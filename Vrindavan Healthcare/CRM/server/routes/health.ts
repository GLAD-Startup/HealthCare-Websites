import { Router } from 'express';
import { testDbConnection } from '../db.ts';

export const healthRouter = Router();

healthRouter.get('/', async (_req, res) => {
  const dbStatus = await testDbConnection();
  if (dbStatus.connected) {
    res.json({
      status: 'ok',
      database: 'connected',
      message: dbStatus.message,
      timestamp: dbStatus.timestamp || new Date().toISOString(),
    });
  } else {
    res.status(503).json({
      status: 'degraded',
      database: 'disconnected',
      message: dbStatus.message,
      hint: 'Make sure your local PostgreSQL service is running and credentials in .env are correct.',
    });
  }
});
