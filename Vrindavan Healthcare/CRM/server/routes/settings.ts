import { Router } from 'express';
import { pool } from '../db.ts';

export const settingsRouter = Router();

settingsRouter.get('/', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, 
        clinic_name AS "clinicName", 
        doctor_name AS "doctorName", 
        phone, 
        email, 
        address, 
        active_doctor_id AS "activeDoctorId",
        active_clinic_id AS "activeClinicId",
        last_sync_timestamp AS "lastSyncTimestamp"
      FROM public.clinic_settings 
      WHERE id = 'clinic-settings'
      LIMIT 1
    `);
    res.json(result.rows[0] || null);
  } catch (err: any) {
    console.error('Error fetching settings:', err);
    res.status(500).json({ error: err?.message || 'Database query error' });
  }
});

settingsRouter.post('/', async (req, res) => {
  const s = req.body;
  try {
    const result = await pool.query(
      `
      INSERT INTO public.clinic_settings (
        id, clinic_name, doctor_name, phone, email, address, active_doctor_id, active_clinic_id, updated_at
      )
      VALUES ('clinic-settings', $1, $2, $3, $4, $5, $6, $7, timezone('utc'::text, now()))
      ON CONFLICT (id) DO UPDATE SET
        clinic_name = EXCLUDED.clinic_name,
        doctor_name = EXCLUDED.doctor_name,
        phone = EXCLUDED.phone,
        email = EXCLUDED.email,
        address = EXCLUDED.address,
        active_doctor_id = EXCLUDED.active_doctor_id,
        active_clinic_id = EXCLUDED.active_clinic_id,
        updated_at = timezone('utc'::text, now())
      RETURNING 
        id, 
        clinic_name AS "clinicName", 
        doctor_name AS "doctorName", 
        phone, 
        email, 
        address, 
        active_doctor_id AS "activeDoctorId",
        active_clinic_id AS "activeClinicId",
        last_sync_timestamp AS "lastSyncTimestamp"
      `,
      [
        s.clinicName || 'Vrindavan Healthcare',
        s.doctorName || 'Dr. Vrindavan Healthcare Team',
        s.phone || '+919876543210',
        s.email || 'care@vrindavanhealthcare.in',
        s.address || 'Vrindavan Healthcare Clinic, Main Medical Road, Mathura / Vrindavan, UP',
        s.activeDoctorId || 'chaitanya',
        s.activeClinicId || 'raman-reti',
      ]
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error('Error saving settings:', err);
    res.status(500).json({ error: err?.message || 'Database update error' });
  }
});
