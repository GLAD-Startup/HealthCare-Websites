import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  ChevronDown, 
  RefreshCw, 
  Database, 
  Settings as SettingsIcon,
  Download, 
  MessageSquare,
  CalendarPlus,
  UserPlus,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import type { Customer } from '../types/index.ts';
import { syncEngine, type SyncEngineState } from '../services/syncEngine.ts';
import { formatTime } from '../utils/formatters.ts';
import { useClinicContext } from '../context/ClinicContext.tsx';

interface HeaderProps {
  pageTitle: string;
  isCollapsed?: boolean;
  onToggleSidebar?: () => void;
  customers?: Customer[];
  onSelectPatient?: (patient: Customer) => void;
  onOpenNewPatient: () => void;
  onOpenNewFollowUp: () => void;
  onOpenNewWhatsApp: () => void;
  onOpenSettings: () => void;
  onOpenSyncDrawer: () => void;
  onTriggerSync: () => Promise<void> | void;
}

export const Header: React.FC<HeaderProps> = ({
  pageTitle,
  isCollapsed = false,
  onToggleSidebar,
  onOpenNewPatient,
  onOpenNewFollowUp,
  onOpenNewWhatsApp,
  onOpenSettings,
  onOpenSyncDrawer,
  onTriggerSync,
}) => {
  const { activeDoctor, activeClinic } = useClinicContext();
  const [syncState, setSyncState] = useState<SyncEngineState>(syncEngine.getState());
  
  // Dropdown states
  const [isSyncPopoverOpen, setIsSyncPopoverOpen] = useState(false);
  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const syncPopoverRef = useRef<HTMLDivElement>(null);
  const newMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // PWA beforeinstallprompt
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const unsub = syncEngine.subscribe(setSyncState);

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSyncPopoverOpen(false);
        setIsNewMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Click outside handler
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (syncPopoverRef.current && !syncPopoverRef.current.contains(target)) {
        setIsSyncPopoverOpen(false);
      }
      if (newMenuRef.current && !newMenuRef.current.contains(target)) {
        setIsNewMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      unsub();
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] pl-3 sm:pl-3.5 lg:pl-3.5 pr-4 lg:pr-8 flex items-center justify-between gap-3 sticky top-0 z-30 shadow-[0_1px_2px_rgb(16_24_40/0.05)]">
      {/* Left: Sidebar Collapse/Expand Toggle + Page Title */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 min-w-0">
        {/* Sidebar Toggle Button (Desktop & Tablet) */}
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="hidden md:flex btn-icon h-9 w-9 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#475569] hover:text-[#0F766E] hover:border-[#0F766E]/40 transition-all shadow-xs items-center justify-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-[#0F766E]" />
            ) : (
              <PanelLeftClose className="w-4 h-4 text-[#475569]" />
            )}
          </button>
        )}

        <h1 className="text-lg sm:text-2xl font-semibold leading-7 sm:leading-8 text-[#0F172A] truncate">
          {pageTitle}
        </h1>
      </div>

      {/* Right Controls: Quiet Sync Indicator, Primary "New" Dropdown, User Menu */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Quiet Sync Status Indicator with Popover */}
        <div ref={syncPopoverRef} className="relative">
          <button
            onClick={() => setIsSyncPopoverOpen(!isSyncPopoverOpen)}
            className="flex items-center gap-2 h-9 px-2.5 sm:px-3 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-xs font-medium text-[#475569] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] focus-visible:ring-offset-1 min-h-[44px] sm:min-h-[36px]"
            title="Database & sync status"
            aria-label="Database and sync status"
          >
            <Database className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
            
            <span className="hidden sm:inline text-[#0F172A]">
              {!syncState.isOnline
                ? 'Offline'
                : syncState.isSyncing
                ? 'Syncing...'
                : syncState.pendingCount > 0
                ? `${syncState.pendingCount} pending`
                : 'Synced'}
            </span>

            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                !syncState.isOnline
                  ? 'bg-[#B54708]'
                  : syncState.pendingCount > 0
                  ? 'bg-[#B54708]'
                  : 'bg-[#12B76A]'
              }`}
            />
          </button>

          {/* Quiet Sync Popover */}
          {isSyncPopoverOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-50 p-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                <div>
                  <h4 className="text-xs font-semibold text-[#0F172A]">Cloud synchronization</h4>
                  <p className="text-[11px] text-[#64748B]">
                    {syncState.isOnline ? 'Online · Connected' : 'Offline · Saved on this device'}
                  </p>
                </div>
                <span
                  className={`w-2 h-2 rounded-full ${
                    syncState.isOnline ? 'bg-[#12B76A]' : 'bg-[#B54708]'
                  }`}
                />
              </div>

              <div className="py-3 space-y-1.5 text-xs text-[#475569]">
                <div className="flex justify-between">
                  <span>Last synced:</span>
                  <span className="tabular-nums font-medium text-[#0F172A]">
                    {syncState.lastSyncTime ? formatTime(syncState.lastSyncTime) : 'None'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Changes waiting to upload:</span>
                  <span className="tabular-nums font-medium text-[#0F172A]">
                    {syncState.pendingCount}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F1F5F9] flex flex-col gap-2">
                <button
                  onClick={async () => {
                    await onTriggerSync();
                  }}
                  disabled={syncState.isSyncing || !syncState.isOnline}
                  className="btn-primary w-full h-8 text-xs justify-center"
                >
                  <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${syncState.isSyncing ? 'animate-spin' : ''}`} />
                  <span>{syncState.isSyncing ? 'Syncing...' : 'Sync now'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsSyncPopoverOpen(false);
                    onOpenSyncDrawer();
                  }}
                  className="btn-ghost w-full h-8 text-xs justify-center text-[#64748B] hover:text-[#0F172A]"
                >
                  View sync status
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Primary "New" Action with Dropdown (min-h-[44px] on mobile) */}
        <div ref={newMenuRef} className="relative">
          <button
            onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
            className="btn-primary h-9 px-3 gap-1.5 min-h-[44px] sm:min-h-[36px]"
            title="Create new record"
            aria-label="Create new record"
          >
            <Plus className="w-4 h-4" />
            <span className="font-medium text-sm">New</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-80" />
          </button>

          {isNewMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-50 py-1 animate-in fade-in">
              <button
                onClick={() => {
                  setIsNewMenuOpen(false);
                  onOpenNewPatient();
                }}
                className="w-full px-3.5 py-2 text-left text-sm text-[#0F172A] hover:bg-[#F8FAFC] flex items-center gap-2.5 font-normal transition-colors"
              >
                <UserPlus className="w-4 h-4 text-[#0F766E]" />
                <span>Add patient</span>
              </button>

              <button
                onClick={() => {
                  setIsNewMenuOpen(false);
                  onOpenNewFollowUp();
                }}
                className="w-full px-3.5 py-2 text-left text-sm text-[#0F172A] hover:bg-[#F8FAFC] flex items-center gap-2.5 font-normal transition-colors"
              >
                <CalendarPlus className="w-4 h-4 text-[#0F766E]" />
                <span>Schedule follow-up</span>
              </button>

              <button
                onClick={() => {
                  setIsNewMenuOpen(false);
                  onOpenNewWhatsApp();
                }}
                className="w-full px-3.5 py-2 text-left text-sm text-[#0F172A] hover:bg-[#F8FAFC] flex items-center gap-2.5 font-normal transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-[#0F766E]" />
                <span>Send WhatsApp message</span>
              </button>
            </div>
          )}
        </div>

        {/* User / Avatar Menu */}
        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="w-9 h-9 min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] rounded-full bg-[#F0FDFA] border border-[#99F6E4] text-[#0F766E] flex items-center justify-center font-bold text-[10px] tracking-tight hover:border-[#0F766E] hover:shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] focus-visible:ring-offset-1"
            title={`${activeDoctor.shortName} · ${activeClinic.shortName}`}
            aria-label="Doctor profile and clinic settings"
          >
            {activeDoctor.initials}
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-50 p-1 animate-in fade-in">
              <div className="p-3 border-b border-[#F1F5F9]">
                <p className="text-sm font-semibold text-[#0F172A] leading-5">{activeDoctor.shortName}</p>
                <p className="text-xs text-[#64748B] leading-4">{activeClinic.shortName} · Clinic Admin</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onOpenSettings();
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-[#0F172A] hover:bg-[#F8FAFC] flex items-center gap-2 rounded-lg transition-colors"
                >
                  <SettingsIcon className="w-4 h-4 text-[#64748B]" />
                  <span>Clinic Settings & Database</span>
                </button>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onOpenSyncDrawer();
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-[#0F172A] hover:bg-[#F8FAFC] flex items-center gap-2 rounded-lg transition-colors"
                >
                  <Database className="w-4 h-4 text-[#64748B]" />
                  <span>Offline Sync Queue</span>
                </button>

                {installPrompt && (
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      handleInstallClick();
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-[#0F766E] font-medium hover:bg-[#F0FDFA] flex items-center gap-2 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Install CRM App</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
