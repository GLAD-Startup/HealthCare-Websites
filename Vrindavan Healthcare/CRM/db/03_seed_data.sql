-- ====================================================================
-- VRINDAVAN HEALTHCARE CRM — STEP 03: CLINICAL SEED DATA
-- ====================================================================
-- Seeds default WhatsApp communication templates and baseline clinic profile.
-- No mock or hardcoded patient records are seeded.
-- ====================================================================

-- 1. Standard Clinical WhatsApp Templates
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

-- 2. Default Clinic Settings Baseline
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
