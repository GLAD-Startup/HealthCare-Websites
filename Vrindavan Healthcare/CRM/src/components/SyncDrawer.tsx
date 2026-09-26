import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  Trash2, 
  RotateCw,
  Server,
  ArrowRight
} from 'lucide-react';
import { db } from '../db/dexie.ts';
import { syncEngine, type SyncEngineState } from '../services/syncEngine.ts';
import type { SyncQueueItem } from '../types/index.ts';

interface SyncDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerSync: () => Promise<void>;
  onOpenSettings: () => void;
}

export const SyncDrawer: React.FC<SyncDrawerProps> = ({
  isOpen,
  onClose,
  onTriggerSync,
  onOpenSettings,
}) => {
  const [syncState, setSyncState] = useState<SyncEngineState>(syncEngine.getState());
  const [queueItems, setQueueItems] = useState<SyncQueueItem[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const unsubscribe = syncEngine.subscribe(setSyncState);
    loadQueue();
    const interval = setInterval(loadQueue, 2500);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      unsubscribe();
      clearInterval(interval);
    };
  }, [isOpen, onClose]);

  const loadQueue = async () => {
    try {
      const items = await db.syncQueue.reverse().toArray();
      setQueueItems(items);
    } catch (e) {
      console.error('Error reading sync queue:', e);
    }
  };

  const handleClearSynced = async () => {
    await db.syncQueue.where('status').equals('synced').delete();
    await loadQueue();
    await syncEngine.refreshPendingCount();
  };

  const handleRetryFailed = async () => {
    const failedItems = await db.syncQueue.where('status').equals('failed').toArray();
    for (const item of failedItems) {
      await db.syncQueue.update(item.id, { status: 'pending' });
    }
    await loadQueue();
    await onTriggerSync();
  };

  if (!isOpen) return null;

  const pendingItems = queueItems.filter((i) => i.status === 'pending' || i.status === 'failed');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div className="w-full max-w-xl bg-white h-full shadow-xl flex flex-col justify-between border-l border-[#E2E8F0] animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="bg-[#F8FAFC] p-5 border-b border-[#E2E8F0] shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#F0FDFA] border border-[#0F766E]/20 flex items-center justify-center text-[#0F766E]">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-semibold leading-6 text-[#0F172A]">Offline sync & database</h2>
                <p className="text-xs text-[#64748B] mt-0.5 leading-4">
                  Device ➔ Cloud synchronization queue
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="btn-icon"
              title="Close drawer"
              aria-label="Close drawer"
            >
              <X className="w-4 h-4 text-[#475569]" />
            </button>
          </div>

          {/* Sync status overview bar */}
          <div className="mt-4 p-3 bg-white border border-[#E2E8F0] rounded-xl flex items-center justify-between text-xs">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={syncState.isOnline ? 'badge-success' : 'badge-warning'}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      syncState.isOnline ? 'bg-[#12B76A] animate-live-pulse' : 'bg-[#F79009]'
                    }`}
                  />
                  <span>{syncState.isOnline ? 'Online' : 'Offline'}</span>
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-1 tabular-nums">
                {syncState.lastSyncTime
                  ? `Last sync: ${new Date(syncState.lastSyncTime).toLocaleTimeString()}`
                  : 'No sync in this session'}
              </p>
            </div>

            <button
              onClick={onTriggerSync}
              disabled={syncState.isSyncing || !syncState.isOnline}
              className="btn-primary h-8 text-xs px-3"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncState.isSyncing ? 'animate-spin' : ''}`} />
              <span>{syncState.isSyncing ? 'Syncing...' : 'Sync now'}</span>
            </button>
          </div>
        </div>

        {/* Sync Pipeline Explanation Diagram */}
        <div className="p-3.5 bg-[#F8FAFC] border-b border-[#E2E8F0] shrink-0">
          <p className="text-[10px] font-medium text-[#64748B] uppercase tracking-wider mb-1.5">
            Offline-first data flow
          </p>
          <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-[#E2E8F0]">
            <span className="text-[#0F172A] font-medium">1. UI write</span>
            <ArrowRight className="w-3 h-3 text-[#64748B]" />
            <span className="text-[#0F172A] font-medium">2. IndexedDB</span>
            <ArrowRight className="w-3 h-3 text-[#64748B]" />
            <span className="text-[#B54708] font-medium">3. Sync queue</span>
            <ArrowRight className="w-3 h-3 text-[#64748B]" />
            <span className="text-[#0F766E] font-medium">4. PostgreSQL</span>
          </div>
        </div>

        {/* Tab Controls & Bulk Actions */}
        <div className="px-5 py-2.5 border-b border-[#E2E8F0] flex items-center justify-between bg-white shrink-0 text-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('pending')}
              className={`h-8 px-2.5 rounded-lg font-medium transition-colors ${
                activeTab === 'pending'
                  ? 'bg-[#FFFAEB] text-[#B54708] border border-[#FEDF89]'
                  : 'text-[#475569] hover:bg-[#F8FAFC]'
              }`}
            >
              <span>Pending</span>
              <span className="tabular-nums ml-1">({pendingItems.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`h-8 px-2.5 rounded-lg font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1]'
                  : 'text-[#475569] hover:bg-[#F8FAFC]'
              }`}
            >
              <span>All</span>
              <span className="tabular-nums ml-1">({queueItems.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {pendingItems.some((i) => i.status === 'failed') && (
              <button
                onClick={handleRetryFailed}
                className="btn-ghost h-8 px-2 text-xs text-[#B54708] hover:text-[#93370D]"
              >
                <RotateCw className="w-3 h-3 mr-1" />
                <span>Retry failed</span>
              </button>
            )}
            <button
              onClick={handleClearSynced}
              className="btn-ghost h-8 px-2 text-xs text-[#64748B] hover:text-[#0F172A]"
              title="Clear synced logs from queue"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              <span>Clear synced</span>
            </button>
          </div>
        </div>

        {/* Queue Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-2.5">
          {(activeTab === 'pending' ? pendingItems : queueItems).length === 0 ? (
            <div className="text-center py-12 bg-[#F8FAFC] rounded-xl border border-dashed border-[#E2E8F0]">
              <CheckCircle2 className="w-8 h-8 text-[#067647] mx-auto mb-2" />
              <p className="text-sm font-medium text-[#0F172A]">Queue is clear</p>
              <p className="text-xs text-[#64748B] mt-0.5">
                All records on this device are synchronized with the cloud.
              </p>
            </div>
          ) : (
            (activeTab === 'pending' ? pendingItems : queueItems).map((item) => (
              <div
                key={item.id}
                className="clinical-card p-3 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        item.operation === 'CREATE'
                          ? 'badge-success'
                          : item.operation === 'UPDATE'
                          ? 'badge-info'
                          : 'badge-danger'
                      }`}
                    >
                      {item.operation === 'CREATE'
                        ? 'Create'
                        : item.operation === 'UPDATE'
                        ? 'Update'
                        : 'Delete'}
                    </span>
                    <span className="font-medium text-[#0F172A] text-xs">
                      {item.entity}
                    </span>
                  </div>

                  <span
                    className={
                      item.status === 'synced'
                        ? 'badge-success'
                        : item.status === 'failed'
                        ? 'badge-danger'
                        : item.status === 'syncing'
                        ? 'badge-info'
                        : 'badge-warning'
                    }
                  >
                    {item.status === 'synced'
                      ? 'Synced'
                      : item.status === 'failed'
                      ? 'Failed'
                      : item.status === 'syncing'
                      ? 'Syncing'
                      : 'Pending'}
                  </span>
                </div>

                <p className="text-[#475569] tabular-nums text-xs truncate">
                  Target ID: {item.entityId}
                </p>

                {item.errorMessage && (
                  <p className="text-[#B42318] text-xs bg-[#FEF3F2] p-1.5 rounded-md border border-[#FECDCA]">
                    {item.errorMessage} (Retries: {item.retryCount})
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-[#64748B] tabular-nums pt-1 border-t border-[#F1F5F9]">
                  <span>Queued: {new Date(item.createdAt).toLocaleTimeString()}</span>
                  <span>ID: {item.id.substring(0, 10)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] shrink-0 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenSettings();
            }}
            className="btn-ghost h-8 px-2 text-xs text-[#0F766E] hover:text-[#115E59]"
          >
            <Server className="w-3.5 h-3.5 mr-1" />
            <span>Configure credentials</span>
          </button>
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
