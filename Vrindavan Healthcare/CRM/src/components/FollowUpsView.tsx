import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Phone, 
  Plus,
  ChevronDown,
  Calendar,
  CalendarClock,
  RotateCcw
} from 'lucide-react';
import type { Customer, FollowUp } from '../types/index.ts';
import { WhatsAppGlyph } from './WhatsAppGlyph.tsx';
import { DueBadge } from './DueBadge.tsx';
import { formatPhone, cleanPhoneForLink, formatDate } from '../utils/formatters.ts';
import { useClinicalCounts } from '../hooks/useClinicalCounts.ts';
import { ListRowSkeleton } from './SkeletonLoader.tsx';

export type TabType = 'overdue' | 'today' | 'upcoming' | 'completed' | 'all';

interface FollowUpsViewProps {
  followups: FollowUp[];
  customers: Customer[];
  initialTab?: TabType;
  isLoading?: boolean;
  onOpenNewFollowUp: () => void;
  onMarkFollowUpComplete: (followupId: string) => Promise<void>;
  onRescheduleFollowUp: (followupId: string, newDate: string) => Promise<void>;
  onSendWhatsApp: (customer: Customer, customMessage?: string) => void;
  onSelectPatient: (patient: Customer) => void;
}

export const FollowUpsView: React.FC<FollowUpsViewProps> = ({
  followups,
  customers,
  initialTab,
  isLoading = false,
  onOpenNewFollowUp,
  onMarkFollowUpComplete,
  onRescheduleFollowUp,
  onSendWhatsApp,
  onSelectPatient,
}) => {
  const counts = useClinicalCounts(customers, followups);
  const overdueList = counts.overdueTasks;
  const todayList = counts.dueTodayTasks;
  const upcomingList = counts.upcomingTasks;
  const completedList = counts.completedTasks;

  // Default to Overdue if it has items, else Today (or initialTab if passed)
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (initialTab) return initialTab;
    return overdueList.length > 0 ? 'overdue' : 'today';
  });

  const [searchTerm, setSearchTerm] = useState('');

  // Dropdown states for reschedule menu & pick date picker
  const [openRescheduleId, setOpenRescheduleId] = useState<string | null>(null);
  const [customDatePickerId, setCustomDatePickerId] = useState<string | null>(null);
  const [customDateValue, setCustomDateValue] = useState('');
  const rescheduleMenuRef = useRef<HTMLDivElement>(null);

  // Undo toast state
  const [undoToast, setUndoToast] = useState<{
    followup: FollowUp;
    timeoutId: any;
  } | null>(null);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Click outside listener for reschedule menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (rescheduleMenuRef.current && !rescheduleMenuRef.current.contains(e.target as Node)) {
        setOpenRescheduleId(null);
        setCustomDatePickerId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered displayed list
  const displayedList = useMemo(() => {
    let list: FollowUp[] = [];
    if (activeTab === 'overdue') list = overdueList;
    else if (activeTab === 'today') list = todayList;
    else if (activeTab === 'upcoming') list = upcomingList;
    else if (activeTab === 'completed') list = completedList;
    else list = followups;

    if (!searchTerm.trim()) return list;

    const query = searchTerm.toLowerCase().trim();
    const rawDigits = searchTerm.replace(/\D/g, '');

    return list.filter(
      (f) =>
        f.customerName.toLowerCase().includes(query) ||
        (rawDigits && f.customerPhone.replace(/\D/g, '').includes(rawDigits)) ||
        (f.notes && f.notes.toLowerCase().includes(query))
    );
  }, [activeTab, overdueList, todayList, upcomingList, completedList, followups, searchTerm]);

  // Quick Reschedule helper
  const handleReschedule = async (followupId: string, daysToAdd: number) => {
    setOpenRescheduleId(null);
    setCustomDatePickerId(null);
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    const newDateStr = d.toISOString().split('T')[0];
    await onRescheduleFollowUp(followupId, newDateStr);
  };

  // Custom date reschedule
  const handleCustomDateSubmit = async (followupId: string) => {
    if (!customDateValue) return;
    setOpenRescheduleId(null);
    setCustomDatePickerId(null);
    await onRescheduleFollowUp(followupId, customDateValue);
    setCustomDateValue('');
  };

  // Mark done with Undo Toast
  const handleMarkDone = async (f: FollowUp) => {
    await onMarkFollowUpComplete(f.id);

    // Clear previous toast timer if any
    if (undoToast?.timeoutId) {
      clearTimeout(undoToast.timeoutId);
    }

    const timeoutId = setTimeout(() => {
      setUndoToast(null);
    }, 6000);

    setUndoToast({
      followup: f,
      timeoutId,
    });
  };

  // Undo mark done action
  const handleUndo = async () => {
    if (!undoToast) return;
    clearTimeout(undoToast.timeoutId);
    const f = undoToast.followup;
    // Reschedule back with original date & pending status
    await onRescheduleFollowUp(f.id, f.date);
    setUndoToast(null);
  };

  // Tabs definition in requested order: Overdue, Today, Upcoming, Completed, All
  const tabs = [
    {
      id: 'overdue' as TabType,
      label: 'Overdue',
      count: overdueList.length,
      isAlert: overdueList.length > 0,
    },
    {
      id: 'today' as TabType,
      label: 'Today',
      count: todayList.length,
      isAlert: false,
    },
    {
      id: 'upcoming' as TabType,
      label: 'Upcoming',
      count: upcomingList.length,
      isAlert: false,
    },
    {
      id: 'completed' as TabType,
      label: 'Completed',
      count: completedList.length,
      isAlert: false,
    },
    {
      id: 'all' as TabType,
      label: 'All follow-ups',
      count: followups.length,
      isAlert: false,
    },
  ];

  return (
    <div className="space-y-6" ref={rescheduleMenuRef}>
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold leading-8 text-[#0F172A]">
            Follow-up Manager
          </h2>
          <p className="text-sm font-normal text-[#475569] leading-5 mt-0.5">
            Monitor, contact, and reschedule clinical patient follow-ups.
          </p>
        </div>

        <button
          onClick={onOpenNewFollowUp}
          className="btn-primary self-start sm:self-auto h-9 px-3.5"
          title="Schedule new follow-up"
          aria-label="New follow-up"
        >
          <Plus className="w-4 h-4" />
          <span>New follow-up</span>
        </button>
      </div>

      {/* Underline-style Tabs: Overdue, Today, Upcoming, Completed, All */}
      <div className="space-y-3">
        <div className="border-b border-[#E2E8F0] flex items-center gap-6 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 text-sm font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] ${
                  isActive
                    ? 'border-[#0F766E] text-[#0F766E]'
                    : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`tabular-nums text-xs px-2 py-0.5 rounded-full ${
                    tab.isAlert
                      ? 'bg-[#FEF3F2] text-[#B42318] font-semibold'
                      : isActive
                      ? 'bg-[#F0FDFA] text-[#0F766E]'
                      : 'bg-[#F1F5F9] text-[#64748B]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search below the tabs */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search follow-ups by patient name, phone, notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="clinical-input w-full pl-9 h-9 text-sm"
          />
        </div>
      </div>

      {/* Undo Toast Notification */}
      {undoToast && (
        <div className="p-3 bg-[#0F172A] text-white text-sm rounded-lg flex items-center justify-between shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#12B76A]" />
            <span>
              Follow-up for <strong className="font-medium text-white">{undoToast.followup.customerName}</strong> marked as completed.
            </span>
          </div>
          <button
            onClick={handleUndo}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Undo</span>
          </button>
        </div>
      )}

      {/* Single-Column List (Queue is read top to bottom) */}
      {isLoading ? (
        <div className="clinical-card p-0 overflow-hidden bg-white border border-[#E2E8F0] rounded-xl shadow-xs divide-y divide-[#E2E8F0]">
          <ListRowSkeleton />
          <ListRowSkeleton />
          <ListRowSkeleton />
          <ListRowSkeleton />
        </div>
      ) : displayedList.length === 0 ? (
        
        /* Per-tab empty states */
        <div className="clinical-card p-12 text-center bg-white">
          {activeTab === 'overdue' ? (
            <>
              <CheckCircle2 className="w-8 h-8 text-[#067647] mx-auto mb-2" />
              <h3 className="text-base font-semibold text-[#0F172A]">No overdue follow-ups</h3>
              <p className="text-xs text-[#64748B] mt-1">All clinical patient follow-ups are on schedule.</p>
              <button onClick={onOpenNewFollowUp} className="btn-primary text-xs mt-3.5 min-h-[36px]">
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>Schedule follow-up</span>
              </button>
            </>
          ) : activeTab === 'today' ? (
            <>
              <CheckCircle2 className="w-8 h-8 text-[#067647] mx-auto mb-2" />
              <h3 className="text-base font-semibold text-[#0F172A]">No follow-ups due today</h3>
              <p className="text-xs text-[#64748B] mt-1">Consultation follow-ups scheduled for today are all clear.</p>
              <button onClick={onOpenNewFollowUp} className="btn-primary text-xs mt-3.5 min-h-[36px]">
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>Schedule follow-up</span>
              </button>
            </>
          ) : activeTab === 'upcoming' ? (
            <>
              <CalendarClock className="w-8 h-8 text-[#64748B] mx-auto mb-2" />
              <h3 className="text-base font-semibold text-[#0F172A]">No upcoming follow-ups scheduled</h3>
              <p className="text-xs text-[#64748B] mt-1">Schedule follow-ups for patients after their clinical visits.</p>
              <button onClick={onOpenNewFollowUp} className="btn-primary text-xs mt-3.5 min-h-[36px]">
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>Schedule follow-up</span>
              </button>
            </>
          ) : activeTab === 'completed' ? (
            <>
              <CheckCircle2 className="w-8 h-8 text-[#64748B] mx-auto mb-2" />
              <h3 className="text-base font-semibold text-[#0F172A]">No completed follow-ups yet</h3>
              <p className="text-xs text-[#64748B] mt-1">Follow-ups you mark as done will appear in this archive.</p>
              <button onClick={onOpenNewFollowUp} className="btn-secondary text-xs mt-3.5 min-h-[36px]">
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>Schedule follow-up</span>
              </button>
            </>
          ) : (
            <>
              <Search className="w-8 h-8 text-[#64748B] mx-auto mb-2" />
              <h3 className="text-base font-semibold text-[#0F172A]">No follow-ups found</h3>
              <p className="text-xs text-[#64748B] mt-1">Try adjusting your search criteria.</p>
              <button onClick={() => setSearchTerm('')} className="btn-secondary text-xs mt-3.5 min-h-[36px]">
                Clear search
              </button>
            </>
          )}
        </div>
      ) : (
        
        /* Single-column divided list */
        <div className="clinical-card p-0 overflow-hidden bg-white border border-[#E2E8F0] rounded-xl shadow-xs divide-y divide-[#E2E8F0]">
          {displayedList.map((f) => {
            const customer = customers.find((c) => c.id === f.customerId);
            const isRescheduleOpen = openRescheduleId === f.id;
            const isDatePickerOpen = customDatePickerId === f.id;

            return (
              <div
                key={f.id}
                className="p-4 sm:px-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#F8FAFC] transition-colors"
              >
                {/* Left: Patient name, formatted phone (muted), DueBadge */}
                <div className="min-w-[220px] max-w-[260px] space-y-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => customer && onSelectPatient(customer)}
                      className="font-medium text-[#0F172A] text-sm hover:text-[#0F766E] truncate text-left"
                      title={f.customerName}
                    >
                      {f.customerName}
                    </button>
                    <DueBadge date={f.date} />
                  </div>
                  <p className="text-xs text-[#64748B] tabular-nums whitespace-nowrap">
                    {formatPhone(f.customerPhone)}
                  </p>
                </div>

                {/* Middle: Follow-up reason as normal text (caps label and grey box removed) */}
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-sm text-[#334155] leading-relaxed line-clamp-2" title={f.notes}>
                    {f.notes || 'Routine consultation follow-up.'}
                  </p>
                </div>

                {/* Right: Call icon, WhatsApp button, Reschedule dropdown, Mark done */}
                <div className="flex items-center gap-2 shrink-0 whitespace-nowrap relative">
                  
                  {/* Call icon button */}
                  <a
                    href={`tel:${cleanPhoneForLink(f.customerPhone)}`}
                    className="btn-icon w-8 h-8"
                    title={`Call ${f.customerName}`}
                    aria-label={`Call ${f.customerName}`}
                  >
                    <Phone className="w-3.5 h-3.5 text-[#475569]" />
                  </a>

                  {/* WhatsApp button */}
                  {customer && (
                    <button
                      onClick={() =>
                        onSendWhatsApp(
                          customer,
                          `Namaste ${customer.name} ji, this is a follow-up reminder from Vrindavan Healthcare for your consultation on ${formatDate(f.date)}. Please let us know how your health is today!`
                        )
                      }
                      className="btn-secondary h-8 px-2.5 text-xs"
                      title="Send WhatsApp reminder"
                      aria-label="Send WhatsApp"
                    >
                      <WhatsAppGlyph className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                      <span>WhatsApp</span>
                    </button>
                  )}

                  {/* Reschedule Dropdown (replaces +1d/+3d/+1w chips) */}
                  {f.status !== 'completed' && (
                    <div className="relative">
                      <button
                        onClick={() => {
                          setOpenRescheduleId(isRescheduleOpen ? null : f.id);
                          setCustomDatePickerId(null);
                        }}
                        className="btn-secondary h-8 px-2.5 text-xs gap-1.5"
                        title="Reschedule follow-up"
                        aria-label="Reschedule follow-up"
                      >
                        <Calendar className="w-3.5 h-3.5 text-[#64748B]" />
                        <span>Reschedule</span>
                        <ChevronDown className="w-3 h-3 text-[#64748B]" />
                      </button>

                      {/* Dropdown Menu */}
                      {isRescheduleOpen && (
                        <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-50 py-1 text-left animate-in fade-in">
                          <button
                            onClick={() => handleReschedule(f.id, 1)}
                            className="w-full px-3 py-1.5 text-xs text-[#0F172A] hover:bg-[#F8FAFC] flex items-center justify-between transition-colors"
                          >
                            <span>Tomorrow</span>
                            <span className="text-[#64748B] text-[11px]">+1 day</span>
                          </button>

                          <button
                            onClick={() => handleReschedule(f.id, 3)}
                            className="w-full px-3 py-1.5 text-xs text-[#0F172A] hover:bg-[#F8FAFC] flex items-center justify-between transition-colors"
                          >
                            <span>In 3 days</span>
                            <span className="text-[#64748B] text-[11px]">+3 days</span>
                          </button>

                          <button
                            onClick={() => handleReschedule(f.id, 7)}
                            className="w-full px-3 py-1.5 text-xs text-[#0F172A] hover:bg-[#F8FAFC] flex items-center justify-between transition-colors"
                          >
                            <span>In 1 week</span>
                            <span className="text-[#64748B] text-[11px]">+7 days</span>
                          </button>

                          <div className="border-t border-[#F1F5F9] my-1" />

                          <button
                            onClick={() => {
                              setCustomDatePickerId(f.id);
                              setCustomDateValue(f.date);
                            }}
                            className="w-full px-3 py-1.5 text-xs text-[#0F766E] hover:bg-[#F0FDFA] font-medium flex items-center gap-1.5 transition-colors"
                          >
                            <CalendarClock className="w-3.5 h-3.5" />
                            <span>Pick a date…</span>
                          </button>

                          {/* Custom date inline input inside dropdown */}
                          {isDatePickerOpen && (
                            <div className="p-2 border-t border-[#E2E8F0] bg-[#F8FAFC] space-y-1.5">
                              <input
                                type="date"
                                required
                                value={customDateValue}
                                onChange={(e) => setCustomDateValue(e.target.value)}
                                className="clinical-input h-7 text-xs w-full tabular-nums py-0.5"
                              />
                              <div className="flex justify-end gap-1">
                                <button
                                  onClick={() => setCustomDatePickerId(null)}
                                  className="btn-ghost h-6 px-1.5 text-[11px]"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleCustomDateSubmit(f.id)}
                                  className="btn-primary h-6 px-2 text-[11px]"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mark Done button */}
                  {f.status !== 'completed' ? (
                    <button
                      onClick={() => handleMarkDone(f)}
                      className="btn-secondary h-8 px-2.5 text-xs text-[#067647] gap-1.5"
                      title="Mark follow-up as completed"
                      aria-label="Mark done"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#067647]" />
                      <span>Mark done</span>
                    </button>
                  ) : (
                    <span className="badge-success">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#067647]" />
                      <span>Completed</span>
                    </span>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
