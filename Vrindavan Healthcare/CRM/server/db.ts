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
