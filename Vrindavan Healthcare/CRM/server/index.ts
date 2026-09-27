import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testDbConnection, ensureSchemaMigrations } from './db.ts';
import { healthRouter } from './routes/health.ts';
import { customersRouter } from './routes/customers.ts';
import { followupsRouter } from './routes/followups.ts';
import { syncRouter } from './routes/sync.ts';
import { settingsRouter } from './routes/settings.ts';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Mount API routes
app.use('/api/health', healthRouter);
app.use('/api/customers', customersRouter);
app.use('/api/followups', followupsRouter);
app.use('/api/sync', syncRouter);
app.use('/api/settings', settingsRouter);

app.get('/', (_req, res) => {
  res.json({
    name: 'Vrindavan Healthcare CRM Local PostgreSQL Backend',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      health: '/api/health',
      customers: '/api/customers',
      followups: '/api/followups',
      sync: '/api/sync',
      settings: '/api/settings',
    },
  });
});

app.listen(PORT, async () => {
  console.log(`\n======================================================`);
  console.log(`🏥 Vrindavan Healthcare CRM Backend API`);
  console.log(`📡 Server listening on: http://localhost:${PORT}`);
  console.log(`======================================================`);

  const dbStatus = await testDbConnection();
  if (dbStatus.connected) {
    console.log(`✅ [PostgreSQL] ${dbStatus.message}`);
    await ensureSchemaMigrations();
  } else {
    console.warn(`⚠️ [PostgreSQL] ${dbStatus.message}`);
    console.warn(`👉 Hint: Ensure your PostgreSQL service is running and execute CRM/db/schema_all_in_one.sql`);
  }
  console.log(`======================================================\n`);
});
