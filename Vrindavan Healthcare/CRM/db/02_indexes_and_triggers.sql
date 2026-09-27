-- ====================================================================
-- VRINDAVAN HEALTHCARE CRM — STEP 02: INDEXES AND AUTOMATED TRIGGERS
-- ====================================================================

-- 1. Performance Indexes for Fast Lookup and Filtering
-- Customers
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_name ON public.customers(name);
CREATE INDEX IF NOT EXISTS idx_customers_next_follow_up ON public.customers(next_follow_up);
CREATE INDEX IF NOT EXISTS idx_customers_follow_up_status ON public.customers(follow_up_status);
CREATE INDEX IF NOT EXISTS idx_customers_sync_status ON public.customers(sync_status);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON public.customers(created_at DESC);

-- Follow-ups
CREATE INDEX IF NOT EXISTS idx_followups_customer_id ON public.followups(customer_id);
CREATE INDEX IF NOT EXISTS idx_followups_date ON public.followups(date);
CREATE INDEX IF NOT EXISTS idx_followups_status ON public.followups(status);
CREATE INDEX IF NOT EXISTS idx_followups_sync_status ON public.followups(sync_status);

-- WhatsApp Logs
CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_customer ON public.whatsapp_logs(customer_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_phone ON public.whatsapp_logs(phone);
CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_sent_at ON public.whatsapp_logs(sent_at DESC);

-- Offline Sync Queue
CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON public.sync_queue(status);
CREATE INDEX IF NOT EXISTS idx_sync_queue_entity ON public.sync_queue(entity, entity_id);

-- 2. Automated updated_at Timestamp Function
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Trigger Attachments
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
