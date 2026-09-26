-- ====================================================================
-- VRINDAVAN HEALTHCARE CRM — STEP 01: CORE TABLES
-- ====================================================================
-- Tables in scope:
--  1. public.customers           (Patient profiles & follow-up tracking)
--  2. public.followups           (Scheduled clinical follow-ups & tasks)
--  3. public.whatsapp_templates  (Templates for greetings, reminders, reports)
--  4. public.whatsapp_logs       (Audit log for sent messages)
--  5. public.sync_queue          (Offline-first synchronization queue)
--  6. public.clinic_settings     (Clinic profile, branding & integration keys)
-- ====================================================================

-- 1. Patients / Customers Table
-- Note: id uses VARCHAR(64) to seamlessly accommodate both offline-generated
-- prefixed IDs (e.g. 'cust-...') and standard UUIDs (gen_random_uuid()).
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

-- 2. Follow-ups Table
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

-- 3. WhatsApp Message Templates
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

-- 4. WhatsApp Dispatch Logs
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

-- 5. Offline Sync Queue Table (Two-way synchronization audit)
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

-- 6. Clinic Settings Table
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
