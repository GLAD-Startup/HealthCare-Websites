import { Router } from 'express';
import { pool } from '../db.ts';

export const customersRouter = Router();

// GET all customers
customersRouter.get('/', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, 
        name, 
        phone, 
        email, 
        doctor_assigned AS "doctorAssigned", 
        category, 
        last_contact AS "lastContact", 
        next_follow_up AS "nextFollowUp", 
        follow_up_status AS "followUpStatus", 
        notes, 
        whatsapp_status AS "whatsappStatus", 
        sync_status AS "syncStatus", 
        created_at AS "createdAt", 
        updated_at AS "updatedAt"
      FROM public.customers
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (err: any) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ error: err?.message || 'Database query error' });
  }
});

// POST / Upsert customer
customersRouter.post('/', async (req, res) => {
  const c = req.body;
  if (!c.name || !c.phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  const id = c.id || `cust-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  try {
    const result = await pool.query(
      `
      INSERT INTO public.customers (
        id, name, phone, email, doctor_assigned, category, 
        last_contact, next_follow_up, follow_up_status, notes, 
        whatsapp_status, sync_status, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'synced', $12, $13)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        phone = EXCLUDED.phone,
        email = EXCLUDED.email,
        doctor_assigned = EXCLUDED.doctor_assigned,
        category = EXCLUDED.category,
        last_contact = EXCLUDED.last_contact,
        next_follow_up = EXCLUDED.next_follow_up,
        follow_up_status = EXCLUDED.follow_up_status,
        notes = EXCLUDED.notes,
        whatsapp_status = EXCLUDED.whatsapp_status,
        sync_status = 'synced',
        updated_at = timezone('utc'::text, now())
      RETURNING 
        id, name, phone, email, 
        doctor_assigned AS "doctorAssigned", 
        category, 
        last_contact AS "lastContact", 
        next_follow_up AS "nextFollowUp", 
        follow_up_status AS "followUpStatus", 
        notes, 
        whatsapp_status AS "whatsappStatus", 
        sync_status AS "syncStatus", 
        created_at AS "createdAt", 
        updated_at AS "updatedAt"
      `,
      [
        id,
        c.name,
        c.phone,
        c.email || null,
        c.doctorAssigned || 'Dr. Vrindavan Healthcare Team',
        c.category || 'General consultation',
        c.lastContact || null,
        c.nextFollowUp || null,
        c.followUpStatus || 'pending',
        c.notes || '',
        c.whatsappStatus || 'none',
        c.createdAt || now,
        c.updatedAt || now,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error('Error saving customer:', err);
    res.status(500).json({ error: err?.message || 'Database insert error' });
  }
});

// DELETE customer
customersRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM public.customers WHERE id = $1', [id]);
    res.json({ success: true, message: `Deleted customer ${id}` });
  } catch (err: any) {
    console.error('Error deleting customer:', err);
    res.status(500).json({ error: err?.message || 'Database delete error' });
  }
});
