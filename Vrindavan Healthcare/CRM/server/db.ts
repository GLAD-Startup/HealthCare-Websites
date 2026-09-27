import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Construct connection pool with fallback to standard local Postgres defaults
export const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
      }
    : {
        host: process.env.PGHOST || 'localhost',
        port: parseInt(process.env.PGPORT || '5432', 10),
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || 'postgres',
        database: process.env.PGDATABASE || 'vrindavan_crm',
      }
);

// Diagnostic test helper
export async function testDbConnection(): Promise<{ connected: boolean; message: string; timestamp?: string }> {
  try {
    const client = await pool.connect();
    try {
      const res = await client.query('SELECT current_database(), current_user, now()');
      const row = res.rows[0];
      return {
        connected: true,
        message: `Connected to PostgreSQL database "${row.current_database}" as user "${row.current_user}"`,
        timestamp: row.now,
      };
    } finally {
      client.release();
    }
  } catch (err: any) {
    return {
      connected: false,
      message: err?.message || 'Failed to connect to local PostgreSQL database',
    };
  }
}

/**
 * Automatically ensures new columns and indexes exist on any existing database.
 * Completely idempotent: runs on server startup so no manual SQL is required.
 */
export async function ensureSchemaMigrations(): Promise<void> {
  try {
    const client = await pool.connect();
    try {
      await client.query(`
        ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS clinic_id VARCHAR(64) DEFAULT 'raman-reti';
        ALTER TABLE public.followups ADD COLUMN IF NOT EXISTS doctor_assigned VARCHAR(255) DEFAULT 'Dr. Chaitanya Gupta';
        ALTER TABLE public.followups ADD COLUMN IF NOT EXISTS clinic_id VARCHAR(64) DEFAULT 'raman-reti';
        ALTER TABLE public.whatsapp_logs ADD COLUMN IF NOT EXISTS clinic_id VARCHAR(64) DEFAULT 'raman-reti';
        ALTER TABLE public.clinic_settings ADD COLUMN IF NOT EXISTS active_doctor_id VARCHAR(64) DEFAULT 'chaitanya';
        ALTER TABLE public.clinic_settings ADD COLUMN IF NOT EXISTS active_clinic_id VARCHAR(64) DEFAULT 'raman-reti';
        CREATE INDEX IF NOT EXISTS idx_customers_clinic_id ON public.customers(clinic_id);
        CREATE INDEX IF NOT EXISTS idx_followups_clinic_id ON public.followups(clinic_id);
      `);
      console.log('✅ [PostgreSQL Schema] Multi-clinic columns verified/migrated automatically.');
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.warn('⚠️ [PostgreSQL Migration Note]', err?.message);
  }
}

