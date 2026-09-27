import { db } from '../db/dexie.ts';
import { syncWithBackend } from './apiClient.ts';
import type { Customer, FollowUp, OperationType, SyncEntity, SyncQueueItem } from '../types/index.ts';

type SyncListener = (state: SyncEngineState) => void;

export interface SyncEngineState {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncTime: string | null;
  lastError: string | null;
}

class SyncEngine {
  private state: SyncEngineState = {
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isSyncing: false,
    pendingCount: 0,
    lastSyncTime: null,
    lastError: null,
  };

  private listeners: Set<SyncListener> = new Set();
  private syncTimeout: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.updateState({ isOnline: true });
        this.syncNow();
      });

      window.addEventListener('offline', () => {
        this.updateState({ isOnline: false });
      });

      // Periodically refresh pending count
      this.refreshPendingCount();
    }
  }

  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  public getState(): SyncEngineState {
    return this.state;
  }

  private updateState(partial: Partial<SyncEngineState>) {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach((fn) => fn(this.state));
  }

  public async refreshPendingCount(): Promise<number> {
    try {
      const count = await db.syncQueue
        .where('status')
        .equals('pending')
        .or('status')
        .equals('failed')
        .count();
      this.updateState({ pendingCount: count });
      return count;
    } catch {
      return 0;
    }
  }

  // Queue a mutation for offline synchronization
  public async queueChange(
    entity: SyncEntity,
    entityId: string,
    operation: OperationType,
    payload: any
  ): Promise<void> {
    const queueItem: SyncQueueItem = {
      id: 'sq-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now(),
      entity,
      entityId,
      operation,
      payload,
      createdAt: new Date().toISOString(),
      retryCount: 0,
      status: 'pending',
    };

    await db.syncQueue.add(queueItem);
    await this.refreshPendingCount();

    // Trigger sync automatically if online
    if (this.state.isOnline) {
      if (this.syncTimeout) clearTimeout(this.syncTimeout);
      this.syncTimeout = setTimeout(() => {
        this.syncNow();
      }, 1000);
    }
  }

  // Sync dispatcher: process queued changes & pull remote changes from local PostgreSQL
  public async syncNow(): Promise<{ success: boolean; syncedCount: number; message: string }> {
    if (this.state.isSyncing) {
      return { success: false, syncedCount: 0, message: 'Sync is already in progress.' };
    }

    if (!navigator.onLine) {
      this.updateState({ isOnline: false });
      return { success: false, syncedCount: 0, message: 'Device is offline. Changes remain safely stored locally.' };
    }

    this.updateState({ isSyncing: true, lastError: null });

    try {
      // 1. Collect pending items
      const pendingItems = await db.syncQueue
        .where('status')
        .anyOf(['pending', 'failed'])
        .toArray();

      // 2. Dispatch batch sync to backend
      const res = await syncWithBackend(pendingItems);

      if (!res.success) {
        this.updateState({
          isSyncing: false,
          lastError: res.message,
        });
        await this.refreshPendingCount();
        return { success: false, syncedCount: 0, message: res.message };
      }

      // 3. Mark all successfully dispatched queue items as synced
      for (const item of pendingItems) {
        await db.syncQueue.update(item.id, {
          status: 'synced',
          errorMessage: undefined,
        });

        if (item.entity === 'customer' && item.operation !== 'DELETE') {
          await db.customers.update(item.entityId, { syncStatus: 'synced' });
        } else if (item.entity === 'followup' && item.operation !== 'DELETE') {
          await db.followups.update(item.entityId, { syncStatus: 'synced' });
        }
      }

      // 4. Merge remote changes down from PostgreSQL (Two-way sync)
      if (Array.isArray(res.remoteCustomers)) {
        for (const rc of res.remoteCustomers) {
          const local = await db.customers.get(rc.id);
          if (!local || new Date(rc.updatedAt) > new Date(local.updatedAt)) {
            await db.customers.put({
              id: rc.id,
              name: rc.name,
              phone: rc.phone,
              email: rc.email || undefined,
              category: rc.category || undefined,
              doctorAssigned: rc.doctorAssigned || undefined,
              clinicId: rc.clinicId || undefined,
              lastContact: rc.lastContact,
              nextFollowUp: rc.nextFollowUp,
              followUpStatus: rc.followUpStatus || 'pending',
              notes: rc.notes || '',
              whatsappStatus: rc.whatsappStatus || 'none',
              syncStatus: 'synced',
              createdAt: rc.createdAt,
              updatedAt: rc.updatedAt,
            });
          }
        }
      }

      if (Array.isArray(res.remoteFollowups)) {
        for (const rf of res.remoteFollowups) {
          const localF = await db.followups.get(rf.id);
          if (!localF || new Date(rf.updatedAt) > new Date(localF.updatedAt)) {
            await db.followups.put({
              id: rf.id,
              customerId: rf.customerId,
              customerName: rf.customerName,
              customerPhone: rf.customerPhone,
              doctorAssigned: rf.doctorAssigned || undefined,
              clinicId: rf.clinicId || undefined,
              date: rf.date,
              status: rf.status,
              notes: rf.notes || '',
              reminderSent: rf.reminderSent,
              syncStatus: 'synced',
              createdAt: rf.createdAt,
              updatedAt: rf.updatedAt,
            });
          }
        }
      }

      const now = new Date().toISOString();
      const settings = await db.settings.get('clinic-settings');
      if (settings) {
        await db.settings.update('clinic-settings', { lastSyncTimestamp: now });
      }

      await this.refreshPendingCount();
      this.updateState({
        isSyncing: false,
        lastSyncTime: now,
        lastError: null,
      });

      return {
        success: true,
        syncedCount: res.processedCount,
        message: `Successfully synchronized ${res.processedCount} changes with local PostgreSQL database.`,
      };
    } catch (err: any) {
      console.error('Fatal sync error:', err);
      const errMsg = err?.message || 'Sync failed';
      this.updateState({
        isSyncing: false,
        lastError: errMsg,
      });
      await this.refreshPendingCount();
      return { success: false, syncedCount: 0, message: errMsg };
    }
  }
}

export const syncEngine = new SyncEngine();
