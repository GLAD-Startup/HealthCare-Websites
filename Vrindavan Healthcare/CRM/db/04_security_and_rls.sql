-- ====================================================================
-- VRINDAVAN HEALTHCARE CRM — STEP 04: SECURITY AND ACCESS POLICIES
-- ====================================================================
-- Compatible with both local PostgreSQL installations and Supabase Cloud.
-- Uses standard PostgreSQL Row-Level Security (RLS).
-- ====================================================================

-- 1. Enable Row Level Security
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_settings ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if re-running
DROP POLICY IF EXISTS "Allow full access for customers" ON public.customers;
DROP POLICY IF EXISTS "Allow full access for followups" ON public.followups;
DROP POLICY IF EXISTS "Allow full access for whatsapp_templates" ON public.whatsapp_templates;
DROP POLICY IF EXISTS "Allow full access for whatsapp_logs" ON public.whatsapp_logs;
DROP POLICY IF EXISTS "Allow full access for sync_queue" ON public.sync_queue;
DROP POLICY IF EXISTS "Allow full access for clinic_settings" ON public.clinic_settings;

-- 3. Create Permissive Policies for CRM Client & Services (TO PUBLIC)
-- Allows read, insert, update, and delete for all CRM operations
CREATE POLICY "Allow full access for customers" 
    ON public.customers FOR ALL TO PUBLIC 
    USING (true) WITH CHECK (true);

CREATE POLICY "Allow full access for followups" 
    ON public.followups FOR ALL TO PUBLIC 
    USING (true) WITH CHECK (true);

CREATE POLICY "Allow full access for whatsapp_templates" 
    ON public.whatsapp_templates FOR ALL TO PUBLIC 
    USING (true) WITH CHECK (true);

CREATE POLICY "Allow full access for whatsapp_logs" 
    ON public.whatsapp_logs FOR ALL TO PUBLIC 
    USING (true) WITH CHECK (true);

CREATE POLICY "Allow full access for sync_queue" 
    ON public.sync_queue FOR ALL TO PUBLIC 
    USING (true) WITH CHECK (true);

CREATE POLICY "Allow full access for clinic_settings" 
    ON public.clinic_settings FOR ALL TO PUBLIC 
    USING (true) WITH CHECK (true);

-- 4. Grant table privileges to standard roles
GRANT ALL ON TABLE public.customers TO PUBLIC;
GRANT ALL ON TABLE public.followups TO PUBLIC;
GRANT ALL ON TABLE public.whatsapp_templates TO PUBLIC;
GRANT ALL ON TABLE public.whatsapp_logs TO PUBLIC;
GRANT ALL ON TABLE public.sync_queue TO PUBLIC;
GRANT ALL ON TABLE public.clinic_settings TO PUBLIC;
