import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarClock, 
  MessageSquare, 
  DatabaseZap, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Database,
  MoreHorizontal,
  X,
  HardDrive
} from 'lucide-react';
import { syncEngine, type SyncEngineState } from '../services/syncEngine.ts';

export type NavTab = 'dashboard' | 'patients' | 'followups' | 'whatsapp' | 'sync';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  followUpsBadgeCount: number;
  hasOverdueFollowUps: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenSettings: () => void;
  onOpenSyncDrawer: () => void;
  isCollapsed?: boolean;
  onToggleCollapsed?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  followUpsBadgeCount,
  hasOverdueFollowUps,
  isMobileOpen,
  onCloseMobile,
  onOpenSettings,
  onOpenSyncDrawer,
  isCollapsed: controlledCollapsed,
  onToggleCollapsed: controlledToggle,
}) => {
  // Tablet (1024-1279px): defaults to collapsed icon rail unless user chose otherwise
  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('vh_crm_sidebar_collapsed');
      if (saved !== null) return saved === 'true';
      if (typeof window !== 'undefined') {
        return window.innerWidth >= 1024 && window.innerWidth <= 1279;
      }
    } catch {}
    return false;
  });

  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  const toggleCollapsed = controlledToggle || (() => {
    setInternalCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('vh_crm_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  });

  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);
  const [syncState, setSyncState] = useState<SyncEngineState>(syncEngine.getState());

  useEffect(() => {
    const unsub = syncEngine.subscribe(setSyncState);
    return unsub;
  }, []);


  const mainNavItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      badgeClass: '',
    },
    {
      id: 'patients' as NavTab,
      label: 'Patients',
      icon: Users,
      badge: null, // Patient count badge removed as per spec (not actionable)
      badgeClass: '',
    },
    {
      id: 'followups' as NavTab,
      label: 'Follow-ups',
      icon: CalendarClock,
      badge: followUpsBadgeCount > 0 ? followUpsBadgeCount : null,
      badgeClass: hasOverdueFollowUps ? 'badge-danger' : 'badge-warning',
    },
    {
      id: 'whatsapp' as NavTab,
      label: 'WhatsApp',
      icon: MessageSquare,
      badge: null,
      badgeClass: '',
    },
  ];

  const systemNavItems = [
    {
      id: 'sync' as NavTab,
      label: 'Sync',
      icon: DatabaseZap,
      badge: syncState.pendingCount > 0 ? syncState.pendingCount : null,
      badgeClass: 'badge-warning',
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Sidebar container: Pinned to left edge, full height, 248px or 72px when collapsed */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen bg-white border-r border-[#E2E8F0] flex flex-col justify-between transition-all duration-200 ease-in-out shrink-0 ${
          isCollapsed ? 'md:w-[72px]' : 'md:w-[248px]'
        } w-[248px] ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          
          {/* Top of sidebar: Logo mark + Vrindavan Healthcare (16px semibold) + Clinic CRM */}
          <div className={`h-16 border-b border-[#E2E8F0] flex items-center shrink-0 ${
            isCollapsed ? 'justify-center px-0' : 'justify-between px-4'
          }`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <button
                onClick={() => onSelectTab('dashboard')}
                className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shrink-0 hover:ring-2 hover:ring-[#0F766E]/40 transition-all shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]"
                title="Vrindavan Healthcare – Go to Dashboard"
                aria-label="Vrindavan Healthcare"
              >
                <img src="/Vrindavan_Healthcare_logo.png" alt="Vrindavan Healthcare" className="w-full h-full object-cover" />
              </button>
              {!isCollapsed && (
                <div className="min-w-0">
                  <h1 className="text-base font-semibold leading-5 text-[#0F172A] truncate">
                    Vrindavan Healthcare
                  </h1>
                  <p className="text-xs text-[#64748B] leading-4 truncate">
                    Clinic CRM
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Menu */}
          <div className={`flex-1 overflow-y-auto ${isCollapsed ? 'p-2 space-y-3' : 'p-3 space-y-5'}`}>
            {/* Main Navigation Group */}
            <div className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      onCloseMobile();
                    }}
                    title={isCollapsed ? `${item.label}${item.badge ? ` (${item.badge})` : ''}` : undefined}
                    aria-label={item.label}
                    className={`transition-all relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] focus-visible:ring-offset-1 ${
                      isCollapsed
                        ? `w-11 h-11 mx-auto rounded-xl flex items-center justify-center ${
                            isActive
                              ? 'bg-[#F0FDFA] text-[#0F766E] shadow-xs border border-[#CCFBF1]'
                              : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
                          }`
                        : `w-full h-9 flex items-center rounded-lg text-sm justify-between px-3 ${
                            isActive
                              ? 'bg-[#F0FDFA] text-[#0F766E] font-medium border-l-[3px] border-[#0F766E]'
                              : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] font-normal'
                          }`
                    }`}
                  >
                    <div className={`flex items-center min-w-0 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                      <div className="relative flex items-center justify-center">
                        <Icon className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} shrink-0 ${isActive ? 'text-[#0F766E]' : 'text-[#64748B]'}`} />
                        
                        {/* Dot / Pill badge on collapsed icon */}
                        {isCollapsed && item.badge !== null && (
                          <span
                            className={`absolute -top-1.5 -right-2 min-w-[17px] h-[17px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center tabular-nums shadow-xs ring-2 ring-white ${
                              item.id === 'followups' && hasOverdueFollowUps
                                ? 'bg-[#E11D48] text-white'
                                : 'bg-[#FEF9C3] text-[#854D0E] border border-[#FDE047]'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!isCollapsed && item.badge !== null && (
                      <span className={`tabular-nums px-2 py-0.5 rounded-full text-xs font-medium ${item.badgeClass}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Small "System" Group */}
            <div className={isCollapsed ? 'space-y-1' : 'space-y-1 pt-3 border-t border-[#E2E8F0]'}>
              {isCollapsed ? (
                <div className="w-8 h-px bg-[#E2E8F0] mx-auto my-2" />
              ) : (
                <p className="px-3 text-[11px] font-medium text-[#64748B] tracking-wider uppercase mb-1">
                  System
                </p>
              )}
              {systemNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      onCloseMobile();
                    }}
                    title={isCollapsed ? `${item.label}${item.badge ? ` (${item.badge})` : ''}` : undefined}
                    aria-label={item.label}
                    className={`transition-all relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] focus-visible:ring-offset-1 ${
                      isCollapsed
                        ? `w-11 h-11 mx-auto rounded-xl flex items-center justify-center ${
                            isActive
                              ? 'bg-[#F0FDFA] text-[#0F766E] shadow-xs border border-[#CCFBF1]'
                              : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
                          }`
                        : `w-full h-9 flex items-center rounded-lg text-sm justify-between px-3 ${
                            isActive
                              ? 'bg-[#F0FDFA] text-[#0F766E] font-medium border-l-[3px] border-[#0F766E]'
                              : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] font-normal'
                          }`
                    }`}
                  >
                    <div className={`flex items-center min-w-0 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                      <div className="relative flex items-center justify-center">
                        <Icon className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} shrink-0 ${isActive ? 'text-[#0F766E]' : 'text-[#64748B]'}`} />
                        {isCollapsed && item.badge !== null && (
                          <span className="absolute -top-1.5 -right-2 min-w-[17px] h-[17px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center tabular-nums shadow-xs ring-2 ring-white bg-[#FEF9C3] text-[#854D0E] border border-[#FDE047]">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!isCollapsed && item.badge !== null && (
                      <span className={`tabular-nums px-2 py-0.5 rounded-full text-xs font-medium ${item.badgeClass}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              <button
                onClick={() => {
                  onOpenSettings();
                  onCloseMobile();
                }}
                title={isCollapsed ? 'Clinic Settings' : undefined}
                aria-label="Clinic Settings"
                className={`transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] focus-visible:ring-offset-1 ${
                  isCollapsed
                    ? 'w-11 h-11 mx-auto rounded-xl flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
                    : 'w-full h-9 flex items-center rounded-lg text-sm text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] font-normal justify-start px-3 gap-3'
                }`}
              >
                <Settings className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} text-[#64748B] shrink-0`} />
                {!isCollapsed && <span>Settings</span>}
              </button>
            </div>
          </div>

          {/* Vrindavan Healthcare Clinic Status & OPD Timings Card (Butter Yellow like website) */}
          {isCollapsed ? (
            <div className="px-2 pb-2 shrink-0">
              <div
                className="w-11 h-11 mx-auto rounded-xl bg-[#FEFCE8] border border-[#FEF08A] flex items-center justify-center cursor-pointer shadow-xs hover:border-[#FDE047] transition-all"
                title="Clinic OPD Active: 9:00 AM – 1:00 PM & 5:00 PM – 9:00 PM"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308] animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="px-3 pb-2 shrink-0">
              <div className="p-2.5 rounded-lg bg-[#FEFCE8] border border-[#FEF08A] text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-[#854D0E] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EAB308] animate-pulse" />
                    OPD Clinic Active
                  </span>
                  <span className="text-[10px] font-medium text-[#854D0E] bg-[#FEF08A] px-1.5 py-0.5 rounded">
                    Walk-in / Appt
                  </span>
                </div>
                <p className="text-[11px] text-[#A16207] leading-tight">
                  Morning: 9:00 AM – 1:00 PM<br />
                  Evening: 5:00 PM – 9:00 PM
                </p>
              </div>
            </div>
          )}

          {/* Compact Sync Indicator Footer */}
          <div className={`p-3 border-t border-[#E2E8F0] bg-white shrink-0 ${isCollapsed ? 'flex justify-center' : ''}`}>
            <button
              onClick={onOpenSyncDrawer}
              title={
                !syncState.isOnline
                  ? 'Offline – saved on this device (click to view queue)'
                  : syncState.pendingCount > 0
                  ? `${syncState.pendingCount} changes waiting to sync`
                  : 'All changes synced with cloud'
              }
              className={`rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-all relative ${
                isCollapsed
                  ? 'w-11 h-11 flex items-center justify-center shadow-xs'
                  : 'w-full py-2 px-2.5 text-left flex items-center justify-between'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Database className={`${isCollapsed ? 'w-5 h-5' : 'w-3.5 h-3.5'} text-[#64748B] shrink-0`} />
                {!isCollapsed && (
                  <span className="text-xs text-[#0F172A] font-medium truncate">
                    {!syncState.isOnline
                      ? 'Offline – saved on this device'
                      : syncState.pendingCount > 0
                      ? `${syncState.pendingCount} changes waiting`
                      : 'All changes synced'}
                  </span>
                )}
              </div>
              <span
                className={`shrink-0 rounded-full ${
                  isCollapsed
                    ? 'absolute top-1.5 right-1.5 w-2.5 h-2.5 ring-2 ring-white'
                    : 'w-2 h-2'
                } ${
                  !syncState.isOnline
                    ? 'bg-[#B54708]'
                    : syncState.pendingCount > 0
                    ? 'bg-[#B54708]'
                    : 'bg-[#12B76A]'
                }`}
              />
            </button>
          </div>

        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR (<768px, safe-area-inset-bottom padded, min 44px touch targets) */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] pb-[env(safe-area-inset-bottom,10px)] pt-1 px-2 flex items-center justify-around shadow-[0_-2px_12px_rgba(0,0,0,0.06)]"
      >
        {/* 1. Home */}
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[48px] py-1 px-2 rounded-lg transition-colors ${
            currentTab === 'dashboard'
              ? 'text-[#0F766E]'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
          aria-label="Home Dashboard"
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium leading-none">Home</span>
        </button>

        {/* 2. Patients */}
        <button
          onClick={() => onSelectTab('patients')}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[48px] py-1 px-2 rounded-lg transition-colors ${
            currentTab === 'patients'
              ? 'text-[#0F766E]'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
          aria-label="Patients Directory"
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium leading-none">Patients</span>
        </button>

        {/* 3. Follow-ups with badge */}
        <button
          onClick={() => onSelectTab('followups')}
          className={`relative flex flex-col items-center justify-center min-w-[54px] min-h-[48px] py-1 px-2 rounded-lg transition-colors ${
            currentTab === 'followups'
              ? 'text-[#0F766E]'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
          aria-label={`Follow-ups ${followUpsBadgeCount > 0 ? `(${followUpsBadgeCount} needing attention)` : ''}`}
        >
          <div className="relative">
            <CalendarClock className="w-5 h-5 mb-0.5" />
            {followUpsBadgeCount > 0 && (
              <span
                className={`absolute -top-1 -right-2 px-1.5 py-0.2 rounded-full text-[10px] font-bold tabular-nums text-white ${
                  hasOverdueFollowUps ? 'bg-[#B42318]' : 'bg-[#B54708]'
                }`}
              >
                {followUpsBadgeCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium leading-none">Follow-ups</span>
        </button>

        {/* 4. WhatsApp */}
        <button
          onClick={() => onSelectTab('whatsapp')}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[48px] py-1 px-2 rounded-lg transition-colors ${
            currentTab === 'whatsapp'
              ? 'text-[#0F766E]'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
          aria-label="WhatsApp Center"
        >
          <MessageSquare className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium leading-none">WhatsApp</span>
        </button>

        {/* 5. More */}
        <button
          onClick={() => setIsMoreSheetOpen(true)}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[48px] py-1 px-2 rounded-lg transition-colors ${
            currentTab === 'sync' || isMoreSheetOpen
              ? 'text-[#0F766E]'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
          aria-label="More options"
        >
          <div className="relative">
            <MoreHorizontal className="w-5 h-5 mb-0.5" />
            {syncState.pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#B54708]" />
            )}
          </div>
          <span className="text-[10px] font-medium leading-none">More</span>
        </button>
      </nav>

      {/* MOBILE "MORE" BOTTOM SHEET */}
      {isMoreSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setIsMoreSheetOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs animate-in fade-in"
          />

          {/* Bottom Sheet Drawer */}
          <div className="relative w-full bg-white rounded-t-2xl border-t border-[#E2E8F0] shadow-2xl p-5 pb-[calc(env(safe-area-inset-bottom,16px)+16px)] space-y-4 animate-in slide-in-from-bottom duration-200 z-10 max-h-[85vh] overflow-y-auto">
            {/* Sheet Handle */}
            <div className="w-10 h-1 bg-[#CBD5E1] rounded-full mx-auto -mt-1 mb-2" />

            <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0">
                  <img src="/Vrindavan_Healthcare_logo.png" alt="Vrindavan Healthcare" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A]">Vrindavan Healthcare</h3>
                  <p className="text-[11px] text-[#64748B]">Clinic System & Tools</p>
                </div>
              </div>

              <button
                onClick={() => setIsMoreSheetOpen(false)}
                className="btn-icon min-h-[44px] min-w-[44px]"
                aria-label="Close sheet"
              >
                <X className="w-4 h-4 text-[#475569]" />
              </button>
            </div>

            <div className="space-y-2 pt-1">
              {/* Sync Screen */}
              <button
                onClick={() => {
                  onSelectTab('sync');
                  setIsMoreSheetOpen(false);
                }}
                className={`w-full min-h-[48px] px-3.5 rounded-xl border flex items-center justify-between text-left transition-colors ${
                  currentTab === 'sync'
                    ? 'bg-[#F0FDFA] border-[#0F766E]/30 text-[#0F766E]'
                    : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <DatabaseZap className="w-5 h-5 text-[#0F766E]" />
                  <div>
                    <div className="text-sm font-medium">Device & Cloud Sync</div>
                    <div className="text-xs text-[#64748B]">
                      {!syncState.isOnline
                        ? 'Offline – saved on this device'
                        : syncState.pendingCount > 0
                        ? `${syncState.pendingCount} changes waiting to upload`
                        : 'All records synced with cloud'}
                    </div>
                  </div>
                </div>

                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    !syncState.isOnline
                      ? 'bg-[#B54708]'
                      : syncState.pendingCount > 0
                      ? 'bg-[#B54708]'
                      : 'bg-[#12B76A]'
                  }`}
                />
              </button>

              {/* Clinic Settings */}
              <button
                onClick={() => {
                  onOpenSettings();
                  setIsMoreSheetOpen(false);
                }}
                className="w-full min-h-[48px] px-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-slate-100 flex items-center gap-3 text-left transition-colors text-[#0F172A]"
              >
                <Settings className="w-5 h-5 text-[#475569]" />
                <div>
                  <div className="text-sm font-medium">Clinic Settings & Database</div>
                  <div className="text-xs text-[#64748B]">Doctor info, PostgreSQL connection & tools</div>
                </div>
              </button>

              {/* Quick Sync Queue Drawer */}
              <button
                onClick={() => {
                  onOpenSyncDrawer();
                  setIsMoreSheetOpen(false);
                }}
                className="w-full min-h-[48px] px-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-slate-100 flex items-center gap-3 text-left transition-colors text-[#0F172A]"
              >
                <Database className="w-5 h-5 text-[#475569]" />
                <div>
                  <div className="text-sm font-medium">View Sync Queue Drawer</div>
                  <div className="text-xs text-[#64748B]">Inspect offline pending operations directly</div>
                </div>
              </button>
            </div>

            <p className="text-[11px] text-center text-[#64748B] pt-2">
              PWA Offline Ready · Saved on this device
            </p>
          </div>
        </div>
      )}
    </>
  );
};
