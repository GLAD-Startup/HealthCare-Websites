import { db } from '../db/dexie.ts';
import { getSupabaseClient } from './supabaseClient.ts';
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

  // Sync dispatcher: process queued changes & pull remote changes
  public async syncNow(): Promise<{ success: boolean; syncedCount: number; message: string }> {
    if (this.state.isSyncing) {
      return { success: false, syncedCount: 0, message: 'Sync is already in progress.' };
    }

    if (!navigator.onLine) {
      this.updateState({ isOnline: false });
      return { success: false, syncedCount: 0, message: 'Device is offline. Changes remain safely stored locally.' };
    }

    const supabase = await getSupabaseClient();
    if (!supabase) {
      await this.refreshPendingCount();
      return {
        success: false,
        syncedCount: 0,
        message: 'Supabase credentials not configured yet. Set them in Settings to enable cloud synchronization.',
      };
    }

    this.updateState({ isSyncing: true, lastError: null });

    let processedCount = 0;

    try {
      // 1. Process Pending Sync Queue Items
      const pendingItems = await db.syncQueue
        .where('status')
        .anyOf(['pending', 'failed'])
        .toArray();

      for (const item of pendingItems) {
        try {
          await db.syncQueue.update(item.id, { status: 'syncing' });

          const tableName = item.entity === 'customer' ? 'customers' : 'followups';

          if (item.operation === 'CREATE') {
            const remotePayload = this.preparePayloadForSupabase(item.entity, item.payload);
            const { error } = await supabase.from(tableName).upsert(remotePayload as any);
            if (error) throw error;
          } else if (item.operation === 'UPDATE') {
            const remotePayload = this.preparePayloadForSupabase(item.entity, item.payload);
            const { error } = await supabase
              .from(tableName)
              .update(remotePayload as any)
              .eq('id', item.entityId);
            if (error) throw error;
          } else if (item.operation === 'DELETE') {
            const { error } = await supabase.from(tableName).delete().eq('id', item.entityId);
            if (error) throw error;
          }

          // Mark queue item as synced
          await db.syncQueue.update(item.id, {
            status: 'synced',
            errorMessage: undefined,
          });

          // Update local entity syncStatus to 'synced'
          if (item.entity === 'customer' && item.operation !== 'DELETE') {
            await db.customers.update(item.entityId, { syncStatus: 'synced' });
          } else if (item.entity === 'followup' && item.operation !== 'DELETE') {
            await db.followups.update(item.entityId, { syncStatus: 'synced' });
          }

          processedCount++;
        } catch (itemError: any) {
          console.warn(`Sync failed for item ${item.id}:`, itemError);
          await db.syncQueue.update(item.id, {
            status: 'failed',
            retryCount: item.retryCount + 1,
            errorMessage: itemError?.message || 'Network error',
          });
        }
      }

      // 2. Pull remote changes from Supabase (Two-way synchronization)
      await this.pullRemoteChanges(supabase);

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
        syncedCount: processedCount,
        message: `Successfully synchronized ${processedCount} pending changes with PostgreSQL.`,
      };
    } catch (err: any) {
      console.error('Fatal sync error:', err);
      const errMsg = err?.message || 'Sync failed';
      this.updateState({
        isSyncing: false,
        lastError: errMsg,
      });
      await this.refreshPendingCount();
      return { success: false, syncedCount: processedCount, message: errMsg };
    }
  }

  // Convert snake_case Supabase columns to camelCase for local Dexie
  private preparePayloadForSupabase(entity: SyncEntity, payload: any) {
    if (entity === 'customer') {
      const c = payload as Customer;
      return {
        id: c.id,
        name: c.name,
        phone: c.phone,
        email: c.email || null,
        category: c.category || 'General Consultation',
        doctor_assigned: c.doctorAssigned || 'Dr. Vrindavan Healthcare',
        last_contact: c.lastContact || null,
        next_follow_up: c.nextFollowUp || null,
        follow_up_status: c.followUpStatus || 'pending',
        notes: c.notes || '',
        whatsapp_status: c.whatsappStatus || 'none',
        sync_status: 'synced',
        created_at: c.createdAt,
        updated_at: c.updatedAt,
      };
    } else {
      const f = payload as FollowUp;
      return {
        id: f.id,
        customer_id: f.customerId,
        customer_name: f.customerName,
        customer_phone: f.customerPhone,
        date: f.date,
        status: f.status,
        notes: f.notes || '',
        reminder_sent: f.reminderSent,
        sync_status: 'synced',
        created_at: f.createdAt,
        updated_at: f.updatedAt,
      };
    }
  }

  private async pullRemoteChanges(supabase: any) {
    try {
      const { data: remoteCustomers, error: cErr } = await supabase
        .from('customers')
        .select('*')
        .limit(100);

      if (!cErr && Array.isArray(remoteCustomers)) {
        for (const rc of remoteCustomers) {
          const local = await db.customers.get(rc.id);
          // Last Updated Wins
          if (!local || new Date(rc.updated_at) > new Date(local.updatedAt)) {
            await db.customers.put({
              id: rc.id,
              name: rc.name,
              phone: rc.phone,
              email: rc.email || undefined,
              category: rc.category || undefined,
              doctorAssigned: rc.doctor_assigned || undefined,
              lastContact: rc.last_contact,
              nextFollowUp: rc.next_follow_up,
              followUpStatus: rc.follow_up_status || 'pending',
              notes: rc.notes || '',
              whatsappStatus: rc.whatsapp_status || 'none',
              syncStatus: 'synced',
              createdAt: rc.created_at,
              updatedAt: rc.updated_at,
            });
          }
        }
      }

      const { data: remoteFollowups, error: fErr } = await supabase
        .from('followups')
        .select('*')
        .limit(100);

      if (!fErr && Array.isArray(remoteFollowups)) {
        for (const rf of remoteFollowups) {
          const localF = await db.followups.get(rf.id);
          if (!localF || new Date(rf.updated_at) > new Date(localF.updatedAt)) {
            await db.followups.put({
              id: rf.id,
              customerId: rf.customer_id,
              customerName: rf.customer_name,
              customerPhone: rf.customer_phone,
              date: rf.date,
              status: rf.status,
              notes: rf.notes || '',
              reminderSent: rf.reminder_sent,
              syncStatus: 'synced',
              createdAt: rf.created_at,
              updatedAt: rf.updated_at,
            });
          }
        }
      }
    } catch (e) {
      console.warn('Error during pullRemoteChanges:', e);
    }
  }
}

export const syncEngine = new SyncEngine();
