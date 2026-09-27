import { Router } from 'express';
import { pool } from '../db.ts';

export const syncRouter = Router();

interface SyncItem {
  id: string;
  entity: 'customer' | 'followup' | 'template';
  entityId: string;
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  payload: any;
}

syncRouter.post('/', async (req, res) => {
  const { items } = req.body;
  const syncItems: SyncItem[] = Array.isArray(items) ? items : [];

  const client = await pool.connect();
  let processedCount = 0;
  const errors: { id: string; error: string }[] = [];

  try {
    await client.query('BEGIN');

    for (const item of syncItems) {
      try {
        if (item.entity === 'customer') {
          if (item.operation === 'DELETE') {
            await client.query('DELETE FROM public.customers WHERE id = $1', [item.entityId]);
          } else {
            const c = item.payload;
            await client.query(
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
              `,
              [
                c.id,
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
                c.createdAt || new Date().toISOString(),
                c.updatedAt || new Date().toISOString(),
              ]
            );
          }
          processedCount++;
        } else if (item.entity === 'followup') {
          if (item.operation === 'DELETE') {
            await client.query('DELETE FROM public.followups WHERE id = $1', [item.entityId]);
          } else {
            const f = item.payload;
            await client.query(
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
              `,
              [
                f.id,
                f.customerId,
                f.customerName || '',
                f.customerPhone || '',
                f.date,
                f.status || 'pending',
                f.notes || '',
                Boolean(f.reminderSent),
                f.createdAt || new Date().toISOString(),
                f.updatedAt || new Date().toISOString(),
              ]
            );
          }
          processedCount++;
        }
      } catch (itemErr: any) {
        console.warn(`Error processing sync item ${item.id}:`, itemErr);
        errors.push({ id: item.id, error: itemErr?.message || 'Sync operation failed' });
      }
    }

    await client.query('COMMIT');

    // Fetch latest remote state to return to client (Two-way sync)
    const remoteCustomersRes = await client.query(`
      SELECT 
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
      FROM public.customers
    `);

    const remoteFollowupsRes = await client.query(`
      SELECT 
        id, 
        customer_id AS "customerId", 
        customer_name AS "customerName", 
        customer_phone AS "customerPhone", 
        date, status, notes, 
        reminder_sent AS "reminderSent", 
        sync_status AS "syncStatus", 
        created_at AS "createdAt", 
        updated_at AS "updatedAt"
      FROM public.followups
    `);

    res.json({
      success: true,
      processedCount,
      errors,
      remoteCustomers: remoteCustomersRes.rows,
      remoteFollowups: remoteFollowupsRes.rows,
      syncedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    await client.query('ROLLBACK');
    console.error('Fatal batch sync error:', err);
    res.status(500).json({ success: false, error: err?.message || 'Transaction failed' });
  } finally {
    client.release();
  }
});
