import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  CloudOff, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCw, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  HardDrive, 
  Server,
  ArrowRight,
  Database,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/dexie.ts';
import { syncEngine, type SyncEngineState } from '../services/syncEngine.ts';
import type { SyncQueueItem } from '../types/index.ts';
import { formatTime, formatDate } from '../utils/formatters.ts';

interface SyncViewProps {
  onTriggerSync: () => Promise<void>;
  onOpenSettings: () => void;
}

export const SyncView: React.FC<SyncViewProps> = ({
  onTriggerSync,
  onOpenSettings,
}) => {
  const [syncState, setSyncState] = useState<SyncEngineState>(syncEngine.getState());
  const [isTechDetailsOpen, setIsTechDetailsOpen] = useState(false);

  useEffect(() => {
    const unsub = syncEngine.subscribe(setSyncState);
    return unsub;
  }, []);

  // Reactive queries from Dexie local database
  const queueItems = useLiveQuery(() => db.syncQueue.reverse().toArray(), []) || [];
  const customerCount = useLiveQuery(() => db.customers.count(), []) || 0;
  const followupCount = useLiveQuery(() => db.followups.count(), []) || 0;
  const templateCount = useLiveQuery(() => db.templates.count(), []) || 0;
  const logCount = useLiveQuery(() => db.whatsappLogs.count(), []) || 0;

  const totalLocalRecords = customerCount + followupCount + templateCount + logCount;

  const pendingItems = queueItems.filter((i) => i.status === 'pending' || i.status === 'syncing');
  const failedItems = queueItems.filter((i) => i.status === 'failed');
  const recentSyncedItems = queueItems.filter((i) => i.status === 'synced').slice(0, 10);

  // Status calculation
  const getOverallStatus = () => {
    if (!syncState.isOnline) {
      return {
        label: 'Offline',
        subtext: 'Saved safely on this device. Will upload automatically when connected.',
        badgeClass: 'badge-warning',
        dotClass: 'bg-[#F79009]',
        icon: CloudOff,
        color: '#B54708',
      };
    }
    if (syncState.isSyncing) {
      return {
        label: 'Syncing',
        subtext: 'Uploading local clinic records to the secure cloud database...',
        badgeClass: 'badge-info',
        dotClass: 'bg-[#175CD3] animate-pulse',
        icon: RefreshCw,
        color: '#175CD3',
      };
    }
    if (failedItems.length > 0) {
      return {
        label: 'Needs attention',
        subtext: `${failedItems.length} changes could not be uploaded. You can retry them below.`,
        badgeClass: 'badge-danger',
        dotClass: 'bg-[#B42318]',
        icon: AlertTriangle,
        color: '#B42318',
      };
    }
    if (pendingItems.length > 0) {
      return {
        label: 'Changes waiting',
        subtext: `${pendingItems.length} changes waiting to upload to cloud.`,
        badgeClass: 'badge-warning',
        dotClass: 'bg-[#F79009]',
        icon: Cloud,
        color: '#B54708',
      };
    }
    return {
      label: 'Synced',
      subtext: 'All patient records on this device are up to date with cloud storage.',
      badgeClass: 'badge-success',
      dotClass: 'bg-[#12B76A]',
      icon: CheckCircle2,
      color: '#067647',
    };
  };

  const status = getOverallStatus();
  const StatusIcon = status.icon;

  // Relative time helper
  const getRelativeLastSync = () => {
    if (!syncState.lastSyncTime) return 'No sync in this session';
    const diffMs = Date.now() - new Date(syncState.lastSyncTime).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 45) return 'Last synced just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin === 1) return 'Last synced 1 minute ago';
    if (diffMin < 60) return `Last synced ${diffMin} minutes ago`;
    return `Last synced at ${formatTime(syncState.lastSyncTime)}`;
  };

  // Actions
  const handleRetrySingle = async (item: SyncQueueItem) => {
    await db.syncQueue.update(item.id, { status: 'pending', errorMessage: undefined });
    await onTriggerSync();
  };

  const handleRetryAllFailed = async () => {
    for (const item of failedItems) {
      await db.syncQueue.update(item.id, { status: 'pending', errorMessage: undefined });
    }
    await onTriggerSync();
  };

  const handleClearSynced = async () => {
    await db.syncQueue.where('status').equals('synced').delete();
    await syncEngine.refreshPendingCount();
  };

  const formatEntityName = (entity: string) => {
    switch (entity) {
      case 'customer':
        return 'Patient profile';
      case 'followup':
        return 'Follow-up task';
      case 'template':
        return 'Message template';
      default:
        return entity;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-semibold leading-8 text-[#0F172A]">
          Device & Cloud Sync
        </h2>
        <p className="text-sm font-normal text-[#64748B] leading-5 mt-0.5">
          Offline synchronization, local device storage, and cloud connection health.
        </p>
      </div>

      {/* Primary Status Card: State + Last synced + Sync now button */}
      <div className="clinical-card p-5 sm:p-6 bg-white border border-[#E2E8F0] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border"
              style={{
                backgroundColor: status.label === 'Synced' ? '#ECFDF3' : status.label === 'Offline' ? '#FFFAEB' : status.label === 'Needs attention' ? '#FEF3F2' : '#EFF8FF',
                borderColor: status.label === 'Synced' ? '#A6F4C5' : status.label === 'Offline' ? '#FEDF89' : status.label === 'Needs attention' ? '#FECDCA' : '#B2DDFF',
                color: status.color,
              }}
            >
              <StatusIcon className={`w-5 h-5 ${syncState.isSyncing ? 'animate-spin' : ''}`} />
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${status.badgeClass}`}>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${status.dotClass}`} />
                  <span>{status.label}</span>
                </span>
                <span className="text-xs text-[#64748B] tabular-nums">
                  {getRelativeLastSync()}
                </span>
              </div>
              <p className="text-sm text-[#475569] mt-1.5 leading-relaxed">
                {status.subtext}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              onClick={onTriggerSync}
              disabled={syncState.isSyncing || !syncState.isOnline}
              className="btn-primary h-9 px-4 text-xs sm:text-sm"
              title="Synchronize records with cloud"
            >
              <RefreshCw className={`w-4 h-4 mr-1.5 ${syncState.isSyncing ? 'animate-spin' : ''}`} />
              <span>{syncState.isSyncing ? 'Syncing…' : 'Sync now'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row: Waiting to upload, Failed items, Records on this device */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Changes waiting to upload */}
        <div className="clinical-card p-4 sm:p-5 bg-white border border-[#E2E8F0]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">Changes waiting</span>
            <Cloud className="w-4 h-4 text-[#64748B]" />
          </div>
          <div className="mt-2.5">
            <span className={`text-2xl sm:text-3xl font-semibold tabular-nums ${
              pendingItems.length > 0 ? 'text-[#B54708]' : 'text-[#0F172A]'
            }`}>
              {pendingItems.length}
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1">Queued to upload to cloud</p>
        </div>

        {/* Failed items */}
        <div className="clinical-card p-4 sm:p-5 bg-white border border-[#E2E8F0]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">Failed items</span>
            <AlertTriangle className={`w-4 h-4 ${failedItems.length > 0 ? 'text-[#B42318]' : 'text-[#64748B]'}`} />
          </div>
          <div className="mt-2.5">
            <span className={`text-2xl sm:text-3xl font-semibold tabular-nums ${
              failedItems.length > 0 ? 'text-[#B42318]' : 'text-[#0F172A]'
            }`}>
              {failedItems.length}
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1">Upload errors requiring retry</p>
        </div>

        {/* Records on this device */}
        <div className="clinical-card p-4 sm:p-5 bg-white border border-[#E2E8F0]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">Saved on this device</span>
            <HardDrive className="w-4 h-4 text-[#0F766E]" />
          </div>
          <div className="mt-2.5">
            <span className="text-2xl sm:text-3xl font-semibold text-[#0F172A] tabular-nums">
              {totalLocalRecords}
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1 tabular-nums">
            {customerCount} patients · {followupCount} follow-ups
          </p>
        </div>

      </div>

      {/* Pending Changes Table (Record, Change type, Time, Status, Retry) */}
      <div className="clinical-card p-0 overflow-hidden bg-white border border-[#E2E8F0] shadow-xs">
        <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-base font-semibold leading-6 text-[#0F172A]">
              Pending changes ({pendingItems.length + failedItems.length})
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Changes created or updated on this device awaiting cloud synchronization.
            </p>
          </div>

          {failedItems.length > 0 && (
            <button
              onClick={handleRetryAllFailed}
              className="btn-secondary h-8 px-2.5 text-xs text-[#B42318] hover:bg-[#FEF3F2] border-[#FECDCA]"
            >
              <RotateCw className="w-3.5 h-3.5 mr-1" />
              <span>Retry all failed ({failedItems.length})</span>
            </button>
          )}
        </div>

        {[...pendingItems, ...failedItems].length === 0 ? (
          <div className="p-10 text-center">
            <ShieldCheck className="w-8 h-8 text-[#067647] mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#0F172A]">No pending changes</p>
            <p className="text-xs text-[#64748B] mt-0.5">
              All clinical records on this device are safely backed up in the cloud.
            </p>
            <button
              onClick={onTriggerSync}
              disabled={syncState.isSyncing}
              className="btn-secondary text-xs mt-3.5 min-h-[36px]"
            >
              Check cloud status
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-[#F8FAFC] text-[#64748B] text-xs font-medium uppercase tracking-wider border-b border-[#E2E8F0]">
                <tr>
                  <th className="py-2.5 px-4 font-medium whitespace-nowrap">Record</th>
                  <th className="py-2.5 px-4 font-medium whitespace-nowrap">Change type</th>
                  <th className="py-2.5 px-4 font-medium whitespace-nowrap">Created at</th>
                  <th className="py-2.5 px-4 font-medium whitespace-nowrap">Status</th>
                  <th className="py-2.5 px-4 font-medium text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] bg-white">
                {[...pendingItems, ...failedItems].map((item) => (
                  <tr key={item.id} className="hover:bg-[#F8FAFC] text-xs transition-colors">
                    {/* Record */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-[#0F172A]">
                        {formatEntityName(item.entity)}
                      </div>
                      <div className="text-[11px] text-[#64748B] tabular-nums mt-0.5">
                        ID: {item.entityId.substring(0, 16)}
                      </div>
                    </td>

                    {/* Change type */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                        item.operation === 'CREATE'
                          ? 'badge-success'
                          : item.operation === 'UPDATE'
                          ? 'badge-info'
                          : 'badge-danger'
                      }`}>
                        {item.operation === 'CREATE' ? 'New record' : item.operation === 'UPDATE' ? 'Edit' : 'Delete'}
                      </span>
                    </td>

                    {/* Time */}
                    <td className="py-3 px-4 text-[#64748B] tabular-nums whitespace-nowrap">
                      {formatTime(item.createdAt)}
                    </td>

                    {/* Status & Error Message */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {item.status === 'failed' ? (
                        <div className="space-y-0.5">
                          <span className="badge-danger">Failed</span>
                          {item.errorMessage && (
                            <p className="text-[11px] text-[#B42318] max-w-[220px] truncate" title={item.errorMessage}>
                              {item.errorMessage}
                            </p>
                          )}
                        </div>
                      ) : item.status === 'syncing' ? (
                        <span className="badge-info">Uploading…</span>
                      ) : (
                        <span className="badge-warning">Waiting</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {item.status === 'failed' && (
                        <button
                          onClick={() => handleRetrySingle(item)}
                          className="btn-secondary h-7 px-2 text-xs text-[#0F766E]"
                          title="Retry uploading this change"
                        >
                          <RotateCw className="w-3 h-3 mr-1" />
                          <span>Retry</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Sync Activity List */}
      <div className="clinical-card p-0 overflow-hidden bg-white border border-[#E2E8F0] shadow-xs">
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-base font-semibold leading-6 text-[#0F172A]">
              Recent sync activity
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Recently completed cloud synchronization events.
            </p>
          </div>

          {recentSyncedItems.length > 0 && (
            <button
              onClick={handleClearSynced}
              className="btn-ghost h-8 px-2 text-xs text-[#64748B] hover:text-[#0F172A]"
              title="Clear completed logs"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              <span>Clear completed</span>
            </button>
          )}
        </div>

        {recentSyncedItems.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#64748B]">
            <CheckCircle2 className="w-6 h-6 text-[#0F766E] mx-auto mb-1.5 opacity-80" />
            <p className="font-semibold text-[#0F172A]">No sync activity recorded</p>
            <p className="text-[#64748B] mt-0.5">Records synced during this session will be listed here.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E2E8F0]">
            {recentSyncedItems.map((item) => (
              <div
                key={item.id}
                className="p-3 sm:px-5 flex items-center justify-between text-xs hover:bg-[#F8FAFC] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#067647] shrink-0" />
                  <div>
                    <span className="font-semibold text-[#0F172A]">
                      Uploaded {formatEntityName(item.entity).toLowerCase()}
                    </span>
                    <span className="text-[#64748B] ml-2 tabular-nums">
                      ({item.operation.toLowerCase()})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 tabular-nums text-[#64748B]">
                  <span>{formatTime(item.createdAt)}</span>
                  <span className="badge-success">Saved to cloud</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Collapsed "Technical details" Section */}
      <div className="clinical-card p-0 overflow-hidden bg-white border border-[#E2E8F0]">
        <button
          onClick={() => setIsTechDetailsOpen(!isTechDetailsOpen)}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-[#F8FAFC] transition-colors focus-visible:outline-none"
        >
          <div className="flex items-center gap-2.5">
            <Server className="w-4 h-4 text-[#64748B]" />
            <div>
              <span className="text-sm font-semibold text-[#0F172A]">
                Technical details & data architecture
              </span>
              <p className="text-xs text-[#64748B] mt-0.5">
                IndexedDB local engine, PostgreSQL schema, and sync telemetry.
              </p>
            </div>
          </div>
          {isTechDetailsOpen ? (
            <ChevronUp className="w-4 h-4 text-[#64748B]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#64748B]" />
          )}
        </button>

        {isTechDetailsOpen && (
          <div className="p-5 border-t border-[#E2E8F0] bg-[#F8FAFC] space-y-4 text-xs">
            {/* Offline-First Pipeline Diagram */}
            <div>
              <p className="font-semibold text-[#0F172A] uppercase tracking-wider text-[11px] mb-2">
                Offline-First Data Pipeline
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-white p-3 rounded-lg border border-[#E2E8F0] text-center font-medium">
                <div className="p-2 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
                  <p className="text-[#0F172A]">1. UI Actions</p>
                  <p className="text-[11px] text-[#64748B] font-normal mt-0.5">Immediate write</p>
                </div>
                <div className="p-2 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
                  <p className="text-[#0F766E]">2. IndexedDB</p>
                  <p className="text-[11px] text-[#64748B] font-normal mt-0.5">Local offline store</p>
                </div>
                <div className="p-2 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
                  <p className="text-[#B54708]">3. Sync Queue</p>
                  <p className="text-[11px] text-[#64748B] font-normal mt-0.5">Guaranteed delivery</p>
                </div>
                <div className="p-2 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
                  <p className="text-[#067647]">4. PostgreSQL</p>
                  <p className="text-[11px] text-[#64748B] font-normal mt-0.5">Local Server DB</p>
                </div>
              </div>
            </div>

            {/* Database & Table Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3 rounded-lg border border-[#E2E8F0]">
                <p className="text-[#64748B]">Local store</p>
                <p className="font-semibold text-[#0F172A] mt-0.5">vrindavan_healthcare_crm</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-[#E2E8F0]">
                <p className="text-[#64748B]">Primary database</p>
                <p className="font-semibold text-[#0F172A] mt-0.5">PostgreSQL (Local Server)</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-[#E2E8F0]">
                <p className="text-[#64748B]">Sync policy</p>
                <p className="font-semibold text-[#0F172A] mt-0.5">Last-write-wins (LWW)</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-[#E2E8F0]">
                <p className="text-[#64748B]">Queue retry limit</p>
                <p className="font-semibold text-[#0F172A] mt-0.5 tabular-nums">5 attempts</p>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={onOpenSettings}
                className="btn-secondary h-8 px-3 text-xs"
              >
                Configure credentials & SQL in Settings →
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
