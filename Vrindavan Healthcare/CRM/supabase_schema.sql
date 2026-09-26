-- ====================================================================
-- VRINDAVAN HEALTHCARE CRM — POSTGRESQL / SUPABASE DATABASE SCHEMA
-- Matches Architecture Specification Section 6, 9, 10, 11
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Customers / Patients Table
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    doctor_assigned VARCHAR(255) DEFAULT 'Dr. Vrindavan Healthcare',
    category VARCHAR(100) DEFAULT 'General Consultation',
    last_contact TIMESTAMPTZ,
    next_follow_up TIMESTAMPTZ,
    follow_up_status VARCHAR(50) DEFAULT 'pending' 
        CHECK (follow_up_status IN ('pending', 'contacted', 'completed', 'cancelled', 'scheduled')),
    notes TEXT,
    whatsapp_status VARCHAR(50) DEFAULT 'none' 
        CHECK (whatsapp_status IN ('none', 'opted_in', 'sent', 'delivered', 'read', 'failed')),
    sync_status VARCHAR(50) DEFAULT 'synced',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for phone and quick searching
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_next_follow_up ON public.customers(next_follow_up);
CREATE INDEX IF NOT EXISTS idx_customers_follow_up_status ON public.customers(follow_up_status);

-- 3. Follow-ups Table
CREATE TABLE IF NOT EXISTS public.followups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' 
        CHECK (status IN ('pending', 'completed', 'rescheduled', 'cancelled')),
    notes TEXT,
    reminder_sent BOOLEAN DEFAULT false,
    sync_status VARCHAR(50) DEFAULT 'synced',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_followups_customer_id ON public.followups(customer_id);
CREATE INDEX IF NOT EXISTS idx_followups_date ON public.followups(date);
CREATE INDEX IF NOT EXISTS idx_followups_status ON public.followups(status);

-- 4. Sync Queue Table (for offline audit & sync logs)
CREATE TABLE IF NOT EXISTS public.sync_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    operation VARCHAR(20) NOT NULL CHECK (operation IN ('CREATE', 'UPDATE', 'DELETE')),
    payload JSONB,
    retry_count INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'syncing', 'synced', 'failed')),
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON public.sync_queue(status);

-- 5. WhatsApp Message Templates
CREATE TABLE IF NOT EXISTS public.whatsapp_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    category VARCHAR(50) DEFAULT 'greeting',
    content TEXT NOT NULL,
    variables JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. WhatsApp Dispatch Logs
CREATE TABLE IF NOT EXISTS public.whatsapp_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    template_title VARCHAR(150),
    message_body TEXT NOT NULL,
    channel VARCHAR(50) DEFAULT 'wa_me' CHECK (channel IN ('wa_me', 'cloud_api')),
    status VARCHAR(50) DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
    sent_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_customer ON public.whatsapp_logs(customer_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_sent_at ON public.whatsapp_logs(sent_at);

-- 7. Automated updated_at Trigger
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trg_customers_updated_at ON public.customers;
CREATE TRIGGER trg_customers_updated_at
    BEFORE UPDATE ON public.customers
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp_column();

DROP TRIGGER IF EXISTS trg_followups_updated_at ON public.followups;
CREATE TRIGGER trg_followups_updated_at
    BEFORE UPDATE ON public.followups
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp_column();

-- 8. Row Level Security (RLS) Setup
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users and anon clients with valid API keys full read/write for clinic operations
CREATE POLICY "Allow public anon access for CRM operations" ON public.customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public anon access for Followups" ON public.followups FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public anon access for Sync Queue" ON public.sync_queue FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public anon access for Templates" ON public.whatsapp_templates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public anon access for WhatsApp Logs" ON public.whatsapp_logs FOR ALL USING (true) WITH CHECK (true);

-- 9. Initial Seed Templates
INSERT INTO public.whatsapp_templates (title, category, content, variables)
VALUES 
(
    'Welcome & Greeting',
    'greeting',
    'Namaste {{patient_name}} ji! Welcome to Vrindavan Healthcare. We are committed to providing you with the highest standard of personalized care. If you have any questions or need medical guidance, please reply to this message or call us directly. Wishing you sound health! - Dr. Vrindavan Healthcare',
    '["patient_name"]'::jsonb
),
(
    'Follow-up & Health Check-in',
    'followup',
    'Hello {{patient_name}}, this is a gentle follow-up from Vrindavan Healthcare regarding your recent visit. How are you feeling today? Please remember to take your prescribed medications on time. If your symptoms persist or you need a follow-up consultation on {{date}}, please let us know.',
    '["patient_name", "date"]'::jsonb
),
(
    'Upcoming Appointment Reminder',
    'reminder',
    'Dear {{patient_name}}, your consultation is scheduled with Vrindavan Healthcare on {{date}}. Please reach 10 minutes prior to your slot. If you need to reschedule, kindly notify us here. Clinic location: Vrindavan Healthcare Center.',
    '["patient_name", "date"]'::jsonb
),
(
    'Lab Report & Prescription Ready',
    'reports',
    'Namaste {{patient_name}}, your test reports and updated prescription are now ready at Vrindavan Healthcare. You can collect them during clinic hours or consult with the doctor during your follow-up.',
    '["patient_name"]'::jsonb
)
ON CONFLICT DO NOTHING;
