import { db } from '../db/dexie.ts';
import type { SyncQueueItem } from '../types/index.ts';

export async function getApiUrl(): Promise<string> {
  try {
    const settings = await db.settings.get('clinic-settings');
    if (settings?.apiUrl && settings.apiUrl.trim()) {
      return settings.apiUrl.trim().replace(/\/+$/, '');
    }
  } catch {}
  
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, '');
  }

  return 'http://localhost:5000/api';
}

export async function testPostgresConnection(customUrl?: string): Promise<{ success: boolean; message: string }> {
  const baseUrl = (customUrl ? customUrl.trim().replace(/\/+$/, '') : await getApiUrl());
  const healthEndpoint = baseUrl.endsWith('/api') ? `${baseUrl}/health` : `${baseUrl}/api/health`;

  try {
    const res = await fetch(healthEndpoint, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    const data = await res.json().catch(() => null);

    if (res.ok && data?.database === 'connected') {
      return {
        success: true,
        message: data.message || 'Connected to local PostgreSQL database!',
      };
    } else if (data?.database === 'disconnected') {
      return {
        success: false,
        message: `Backend reached, but PostgreSQL disconnected: ${data.message}. Ensure PostgreSQL service is running on port 5432.`,
      };
    } else {
      return {
        success: false,
        message: data?.error || `Server responded with status ${res.status}`,
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: `Could not reach backend API at ${baseUrl}. Please start the backend with "npm run server" in the CRM directory.`,
    };
  }
}

export async function syncWithBackend(items: SyncQueueItem[]): Promise<{
  success: boolean;
  processedCount: number;
  remoteCustomers?: any[];
  remoteFollowups?: any[];
  message: string;
}> {
  const baseUrl = await getApiUrl();
  const syncEndpoint = baseUrl.endsWith('/api') ? `${baseUrl}/sync` : `${baseUrl}/api/sync`;

  try {
    const res = await fetch(syncEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      throw new Error(errData?.error || `HTTP ${res.status}: Failed to synchronize`);
    }

    const data = await res.json();
    return {
      success: true,
      processedCount: data.processedCount || 0,
      remoteCustomers: data.remoteCustomers,
      remoteFollowups: data.remoteFollowups,
      message: `Synchronized ${data.processedCount || 0} changes with local PostgreSQL database.`,
    };
  } catch (err: any) {
    return {
      success: false,
      processedCount: 0,
      message: err?.message || `Sync failed. Make sure backend is running at ${baseUrl}`,
    };
  }
}
