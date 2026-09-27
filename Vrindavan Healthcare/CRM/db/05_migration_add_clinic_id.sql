-- Migration: Add multi-clinic partitioning columns
-- Vrindavan Healthcare CRM (Raman Reti & Hanuman Bagh)

-- 1. Customers Table: Add clinic_id
ALTER TABLE public.customers 
ADD COLUMN IF NOT EXISTS clinic_id VARCHAR(64) DEFAULT 'raman-reti';

-- 2. Follow-ups Table: Add doctor_assigned and clinic_id
ALTER TABLE public.followups 
ADD COLUMN IF NOT EXISTS doctor_assigned VARCHAR(255) DEFAULT 'Dr. Chaitanya Gupta';

ALTER TABLE public.followups 
ADD COLUMN IF NOT EXISTS clinic_id VARCHAR(64) DEFAULT 'raman-reti';

-- 3. WhatsApp Dispatch Logs: Add clinic_id
ALTER TABLE public.whatsapp_logs 
ADD COLUMN IF NOT EXISTS clinic_id VARCHAR(64) DEFAULT 'raman-reti';

-- 4. Clinic Settings: Add active_doctor_id and active_clinic_id
ALTER TABLE public.clinic_settings 
ADD COLUMN IF NOT EXISTS active_doctor_id VARCHAR(64) DEFAULT 'chaitanya';

ALTER TABLE public.clinic_settings 
ADD COLUMN IF NOT EXISTS active_clinic_id VARCHAR(64) DEFAULT 'raman-reti';

-- 5. Performance Indexes for clinic querying
CREATE INDEX IF NOT EXISTS idx_customers_clinic_id ON public.customers(clinic_id);
CREATE INDEX IF NOT EXISTS idx_followups_clinic_id ON public.followups(clinic_id);
