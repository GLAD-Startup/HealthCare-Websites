import { Router } from 'express';
import { pool } from '../db.ts';

export const followupsRouter = Router();

// GET all followups
followupsRouter.get('/', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, 
        customer_id AS "customerId", 
        customer_name AS "customerName", 
        customer_phone AS "customerPhone", 
        date, 
        status, 
        notes, 
        reminder_sent AS "reminderSent", 
        sync_status AS "syncStatus", 
        created_at AS "createdAt", 
        updated_at AS "updatedAt"
      FROM public.followups
      ORDER BY date ASC
    `);
    res.json(result.rows);
  } catch (err: any) {
    console.error('Error fetching followups:', err);
    res.status(500).json({ error: err?.message || 'Database query error' });
  }
});

// POST / Upsert followup
followupsRouter.post('/', async (req, res) => {
  const f = req.body;
  if (!f.customerId || !f.date) {
    return res.status(400).json({ error: 'customerId and date are required' });
  }

  const id = f.id || `fol-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  try {
    const result = await pool.query(
      `
      INSERT INTO public.followups (
        id, customer_id, customer_name, customer_phone, date, 
        status, notes, reminder_sent, sync_status, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'synced', $9, $10)
      ON CONFLICT (id) DO UPDATE SET
        customer_name = EXCLUDED.customer_name,
        customer_phone = EXCLUDED.customer_phone,
        date = EXCLUDED.date,
        status = EXCLUDED.status,
        notes = EXCLUDED.notes,
        reminder_sent = EXCLUDED.reminder_sent,
        sync_status = 'synced',
        updated_at = timezone('utc'::text, now())
      RETURNING 
        id, 
        customer_id AS "customerId", 
        customer_name AS "customerName", 
        customer_phone AS "customerPhone", 
        date, 
        status, 
        notes, 
        reminder_sent AS "reminderSent", 
        sync_status AS "syncStatus", 
        created_at AS "createdAt", 
        updated_at AS "updatedAt"
      `,
      [
        id,
        f.customerId,
        f.customerName || '',
        f.customerPhone || '',
        f.date,
        f.status || 'pending',
        f.notes || '',
        Boolean(f.reminderSent),
        f.createdAt || now,
        f.updatedAt || now,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error('Error saving followup:', err);
    res.status(500).json({ error: err?.message || 'Database insert error' });
  }
});

// DELETE followup
followupsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM public.followups WHERE id = $1', [id]);
    res.json({ success: true, message: `Deleted followup ${id}` });
  } catch (err: any) {
    console.error('Error deleting followup:', err);
    res.status(500).json({ error: err?.message || 'Database delete error' });
  }
});
