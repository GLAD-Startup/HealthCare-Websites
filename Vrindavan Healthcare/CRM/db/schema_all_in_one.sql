-- ====================================================================
-- VRINDAVAN HEALTHCARE CRM — ALL-IN-ONE COMPLETE DATABASE SCHEMA
-- ====================================================================
-- Comprehensive PostgreSQL / Supabase Schema for Vrindavan Healthcare CRM.
--
-- Instructions:
-- 1. Connect to your local PostgreSQL instance:
--    psql -U postgres -d vrindavan_crm -f schema_all_in_one.sql
-- 2. Or copy-paste this entire file into Supabase SQL Editor / pgAdmin.
-- ====================================================================

BEGIN;

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Core Tables
-- Customers / Patients Table
CREATE TABLE IF NOT EXISTS public.customers (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    email VARCHAR(255),
    doctor_assigned VARCHAR(255) DEFAULT 'Dr. Vrindavan Healthcare Team',
    category VARCHAR(150) DEFAULT 'General consultation',
    last_contact TIMESTAMPTZ,
    next_follow_up TIMESTAMPTZ,
    follow_up_status VARCHAR(50) DEFAULT 'pending' 
        CHECK (follow_up_status IN ('pending', 'contacted', 'completed', 'cancelled', 'scheduled')),
    notes TEXT DEFAULT '',
    whatsapp_status VARCHAR(50) DEFAULT 'none' 
        CHECK (whatsapp_status IN ('none', 'opted_in', 'sent', 'delivered', 'read', 'failed')),
    sync_status VARCHAR(50) DEFAULT 'synced'
        CHECK (sync_status IN ('synced', 'pending', 'error')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Follow-ups Table
CREATE TABLE IF NOT EXISTS public.followups (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    customer_id VARCHAR(64) NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(32) NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' 
        CHECK (status IN ('pending', 'completed', 'rescheduled', 'cancelled')),
    notes TEXT DEFAULT '',
    reminder_sent BOOLEAN DEFAULT false,
    sync_status VARCHAR(50) DEFAULT 'synced'
        CHECK (sync_status IN ('synced', 'pending', 'error')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- WhatsApp Message Templates
CREATE TABLE IF NOT EXISTS public.whatsapp_templates (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(50) DEFAULT 'custom' 
        CHECK (category IN ('greeting', 'followup', 'reminder', 'reports', 'custom')),
    content TEXT NOT NULL,
    variables JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- WhatsApp Dispatch Logs
CREATE TABLE IF NOT EXISTS public.whatsapp_logs (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    customer_id VARCHAR(64) REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    template_title VARCHAR(150),
    message_body TEXT NOT NULL,
    channel VARCHAR(50) DEFAULT 'wa_me' CHECK (channel IN ('wa_me', 'cloud_api')),
    status VARCHAR(50) DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
    sent_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Offline Sync Queue Table
CREATE TABLE IF NOT EXISTS public.sync_queue (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    entity VARCHAR(50) NOT NULL CHECK (entity IN ('customer', 'followup', 'template')),
    entity_id VARCHAR(64) NOT NULL,
    operation VARCHAR(20) NOT NULL CHECK (operation IN ('CREATE', 'UPDATE', 'DELETE')),
    payload JSONB,
    retry_count INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'syncing', 'synced', 'failed')),
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Clinic Settings Table
CREATE TABLE IF NOT EXISTS public.clinic_settings (
    id VARCHAR(64) PRIMARY KEY DEFAULT 'clinic-settings',
    clinic_name VARCHAR(255) DEFAULT 'Vrindavan Healthcare',
    doctor_name VARCHAR(255) DEFAULT 'Dr. Vrindavan Healthcare Team',
    phone VARCHAR(32) DEFAULT '+919876543210',
    email VARCHAR(255) DEFAULT 'care@vrindavanhealthcare.in',
    address TEXT DEFAULT 'Vrindavan Healthcare Clinic, Main Medical Road, Mathura / Vrindavan, UP',
    supabase_url TEXT,
    supabase_anon_key TEXT,
    whatsapp_phone_id VARCHAR(100),
    whatsapp_token TEXT,
    last_sync_timestamp TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_name ON public.customers(name);
CREATE INDEX IF NOT EXISTS idx_customers_next_follow_up ON public.customers(next_follow_up);
CREATE INDEX IF NOT EXISTS idx_customers_follow_up_status ON public.customers(follow_up_status);
CREATE INDEX IF NOT EXISTS idx_customers_sync_status ON public.customers(sync_status);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON public.customers(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_followups_customer_id ON public.followups(customer_id);
CREATE INDEX IF NOT EXISTS idx_followups_date ON public.followups(date);
CREATE INDEX IF NOT EXISTS idx_followups_status ON public.followups(status);
CREATE INDEX IF NOT EXISTS idx_followups_sync_status ON public.followups(sync_status);

CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_customer ON public.whatsapp_logs(customer_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_phone ON public.whatsapp_logs(phone);
CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_sent_at ON public.whatsapp_logs(sent_at DESC);

CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON public.sync_queue(status);
CREATE INDEX IF NOT EXISTS idx_sync_queue_entity ON public.sync_queue(entity, entity_id);

-- 4. Automated updated_at Trigger
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

DROP TRIGGER IF EXISTS trg_whatsapp_templates_updated_at ON public.whatsapp_templates;
CREATE TRIGGER trg_whatsapp_templates_updated_at
    BEFORE UPDATE ON public.whatsapp_templates
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp_column();

DROP TRIGGER IF EXISTS trg_sync_queue_updated_at ON public.sync_queue;
CREATE TRIGGER trg_sync_queue_updated_at
    BEFORE UPDATE ON public.sync_queue
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp_column();

DROP TRIGGER IF EXISTS trg_clinic_settings_updated_at ON public.clinic_settings;
CREATE TRIGGER trg_clinic_settings_updated_at
    BEFORE UPDATE ON public.clinic_settings
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp_column();

-- 5. Seed Initial Data (Templates & Clinic Profile)
INSERT INTO public.whatsapp_templates (id, title, category, content, variables, is_active)
VALUES 
(
    'tmpl-1',
    'Welcome & Patient Greeting',
    'greeting',
    'Namaste {{patient_name}} ji! Welcome to Vrindavan Healthcare. We are committed to providing you with gentle, comprehensive care. If you need any medical advice or wish to consult the doctor, feel free to reply directly here. Wishing you vibrant health! - Dr. Vrindavan Healthcare',
    '["patient_name"]'::jsonb,
    true
),
(
    'tmpl-2',
    'Consultation & Recovery Follow-up',
    'followup',
    'Namaste {{patient_name}} ji, this is Dr. Vrindavan Healthcare following up on your recent consultation. How are your symptoms progressing? Please ensure you are taking your prescribed medications on schedule. If you have any discomfort, please reply to this message.',
    '["patient_name"]'::jsonb,
    true
),
(
    'tmpl-3',
    'Follow-up Consultation Reminder',
    'reminder',
    'Dear {{patient_name}}, this is a friendly reminder from Vrindavan Healthcare for your scheduled follow-up on {{date}}. Please confirm your visit or let us know if you need to reschedule to a convenient time.',
    '["patient_name", "date"]'::jsonb,
    true
),
(
    'tmpl-4',
    'Lab & Diagnostic Reports Ready',
    'reports',
    'Namaste {{patient_name}}, your clinical diagnostic test reports have arrived and have been reviewed by the doctor at Vrindavan Healthcare. You can collect your reports or discuss next steps with us.',
    '["patient_name"]'::jsonb,
    true
),
(
    'tmpl-5',
    'Hydration & Seasonal Health Tip',
    'custom',
    'Good day {{patient_name}} ji! A quick seasonal wellness note from Vrindavan Healthcare: Stay hydrated, maintain balanced nutrition, and take regular 15-minute brisk walks. Take care of your health today!',
    '["patient_name"]'::jsonb,
    true
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    content = EXCLUDED.content,
    variables = EXCLUDED.variables,
    is_active = EXCLUDED.is_active,
    updated_at = timezone('utc'::text, now());

INSERT INTO public.clinic_settings (
    id, 
    clinic_name, 
    doctor_name, 
    phone, 
    email, 
    address
)
VALUES (
    'clinic-settings',
    'Vrindavan Healthcare',
    'Dr. Vrindavan Healthcare Team',
    '+919876543210',
    'care@vrindavanhealthcare.in',
    'Vrindavan Healthcare Clinic, Main Medical Road, Mathura / Vrindavan, UP'
)
ON CONFLICT (id) DO NOTHING;

-- 6. Row Level Security & Access Permissions
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow full access for customers" ON public.customers;
DROP POLICY IF EXISTS "Allow full access for followups" ON public.followups;
DROP POLICY IF EXISTS "Allow full access for whatsapp_templates" ON public.whatsapp_templates;
DROP POLICY IF EXISTS "Allow full access for whatsapp_logs" ON public.whatsapp_logs;
DROP POLICY IF EXISTS "Allow full access for sync_queue" ON public.sync_queue;
DROP POLICY IF EXISTS "Allow full access for clinic_settings" ON public.clinic_settings;

CREATE POLICY "Allow full access for customers" ON public.customers FOR ALL TO PUBLIC USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access for followups" ON public.followups FOR ALL TO PUBLIC USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access for whatsapp_templates" ON public.whatsapp_templates FOR ALL TO PUBLIC USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access for whatsapp_logs" ON public.whatsapp_logs FOR ALL TO PUBLIC USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access for sync_queue" ON public.sync_queue FOR ALL TO PUBLIC USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access for clinic_settings" ON public.clinic_settings FOR ALL TO PUBLIC USING (true) WITH CHECK (true);

GRANT ALL ON TABLE public.customers TO PUBLIC;
GRANT ALL ON TABLE public.followups TO PUBLIC;
GRANT ALL ON TABLE public.whatsapp_templates TO PUBLIC;
GRANT ALL ON TABLE public.whatsapp_logs TO PUBLIC;
GRANT ALL ON TABLE public.sync_queue TO PUBLIC;
GRANT ALL ON TABLE public.clinic_settings TO PUBLIC;

COMMIT;
