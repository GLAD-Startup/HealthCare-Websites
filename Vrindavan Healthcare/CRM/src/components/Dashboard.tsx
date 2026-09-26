import React, { useMemo } from 'react';
import { 
  Users, 
  CalendarClock, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Phone, 
  ArrowRight, 
  ChevronRight,
  Calendar
} from 'lucide-react';
import type { Customer, FollowUp } from '../types/index.ts';
import { WhatsAppGlyph } from './WhatsAppGlyph.tsx';
import { DueBadge } from './DueBadge.tsx';
import { StatusBadge } from './StatusBadge.tsx';
import { formatPhone, cleanPhoneForLink, formatDate, formatPatientDisplayId, getTodayStrIST } from '../utils/formatters.ts';
import { useClinicalCounts } from '../hooks/useClinicalCounts.ts';
import { StatCardSkeleton, ListRowSkeleton } from './SkeletonLoader.tsx';

interface DashboardProps {
  customers: Customer[];
  followups: FollowUp[];
  isLoading?: boolean;
  onOpenNewPatient: () => void;
  onOpenNewFollowUp: () => void;
  onNavigateToTab: (tab: 'patients' | 'followups' | 'whatsapp' | 'sync', filter?: string) => void;
  onSelectPatient: (patient: Customer) => void;
  onSendWhatsApp: (customer: Customer, customMessage?: string) => void;
  onMarkFollowUpComplete: (followupId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  customers,
  followups,
  isLoading = false,
  onOpenNewPatient,
  onOpenNewFollowUp,
  onNavigateToTab,
  onSelectPatient,
  onSendWhatsApp,
  onMarkFollowUpComplete,
}) => {
  const counts = useClinicalCounts(customers, followups);
  const {
    todayStrIST,
    overdueTasks: overdueFollowUps,
    dueTodayTasks: todayFollowUps,
    needsAttentionTasks: needsAttentionList,
    completedTasks: completedFollowUps,
    totalPatientsCount: totalPatients,
    dueTodayCount,
    overdueCount,
    completedTasksCount,
  } = counts;

  const today = new Date();

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = today.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formattedTodayDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // "Upcoming this week" (date > todayStrIST and within next 7 days)
  const upcomingThisWeekList = useMemo(() => {
    const [y, m, d] = todayStrIST.split('-').map(Number);
    const maxDate = new Date(y, m - 1, d + 7);
    const maxDateStr = getTodayStrIST(maxDate);

    return counts.upcomingTasks
      .filter((f) => f.date <= maxDateStr)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [counts.upcomingTasks, todayStrIST]);

  return (
    <div className="space-y-6">
      
      {/* Compact Header: Greeting + date on left; Add patient (Secondary) & Schedule follow-up (Primary) on right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-2xl font-semibold leading-8 text-[#0F172A]">
            {getGreeting()}, Dr. Vrindavan
          </h2>
          <p className="text-sm font-normal text-[#64748B] leading-5 mt-0.5">
            {formattedTodayDate} · Vrindavan Healthcare Clinic
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenNewPatient}
            className="btn-secondary h-9"
            title="Register new patient"
            aria-label="Add patient"
          >
            <Plus className="w-4 h-4 text-[#475569]" />
            <span>Add patient</span>
          </button>
          <button
            onClick={onOpenNewFollowUp}
            className="btn-primary h-9"
            title="Schedule follow-up"
            aria-label="Schedule follow-up"
          >
            <CalendarClock className="w-4 h-4" />
            <span>Schedule follow-up</span>
          </button>
        </div>
      </div>

      {/* Stat Cards: White, bordered, no tinted backgrounds. Sentence-case labels. */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
        {/* Total Patients */}
        <div 
          onClick={() => onNavigateToTab('patients')}
          className="clinical-card cursor-pointer hover:border-[#CBD5E1] transition-all p-5 bg-white"
          role="button"
          tabIndex={0}
          aria-label="View all patients"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">
              Total patients
            </span>
            <Users className="w-4 h-4 text-[#64748B]" />
          </div>
          <div className="mt-2.5">
            <span className="text-2xl sm:text-3xl font-semibold text-[#0F172A] tabular-nums">
              {totalPatients}
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1 truncate">Active clinical records</p>
        </div>

        {/* Due Today: Amber accent only when > 0 */}
        <div 
          onClick={() => onNavigateToTab('followups', 'today')}
          className={`clinical-card cursor-pointer transition-all p-5 bg-white ${
            todayFollowUps.length > 0 
              ? 'border-[#FEDF89] hover:border-[#FDB022]' 
              : 'hover:border-[#CBD5E1]'
          }`}
          role="button"
          tabIndex={0}
          aria-label="View due today follow-ups"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">
              Due today
            </span>
            <CalendarClock className={`w-4 h-4 ${todayFollowUps.length > 0 ? 'text-[#B54708]' : 'text-[#64748B]'}`} />
          </div>
          <div className="mt-2.5">
            <span className={`text-2xl sm:text-3xl font-semibold tabular-nums ${
              todayFollowUps.length > 0 ? 'text-[#B54708]' : 'text-[#0F172A]'
            }`}>
              {todayFollowUps.length}
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1 truncate">Scheduled for contact today</p>
        </div>

        {/* Overdue: Red accent only when > 0 */}
        <div 
          onClick={() => onNavigateToTab('followups', 'overdue')}
          className={`clinical-card cursor-pointer transition-all p-5 bg-white ${
            overdueFollowUps.length > 0 
              ? 'border-[#FECDCA] hover:border-[#FDA29B]' 
              : 'hover:border-[#CBD5E1]'
          }`}
          role="button"
          tabIndex={0}
          aria-label="View overdue follow-ups"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">
              Overdue
            </span>
            <AlertTriangle className={`w-4 h-4 ${overdueFollowUps.length > 0 ? 'text-[#B42318]' : 'text-[#64748B]'}`} />
          </div>
          <div className="mt-2.5">
            <span className={`text-2xl sm:text-3xl font-semibold tabular-nums ${
              overdueFollowUps.length > 0 ? 'text-[#B42318]' : 'text-[#0F172A]'
            }`}>
              {overdueFollowUps.length}
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1 truncate">Past scheduled follow-up date</p>
        </div>

        {/* Completed Tasks */}
        <div 
          onClick={() => onNavigateToTab('followups', 'completed')}
          className="clinical-card cursor-pointer hover:border-[#CBD5E1] transition-all p-5 bg-white"
          role="button"
          tabIndex={0}
          aria-label="View completed follow-ups"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">
              Tasks completed
            </span>
            <CheckCircle2 className="w-4 h-4 text-[#64748B]" />
          </div>
          <div className="mt-2.5">
            <span className="text-2xl sm:text-3xl font-semibold text-[#0F172A] tabular-nums">
              {completedFollowUps.length}
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1 truncate">Follow-up tasks resolved</p>
        </div>
          </>
        )}
      </div>

      {/* Main Grid: Needs Attention Queue (2/3 width on >=1440px) + Upcoming this week (1/3 width on >=1440px) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Needs attention queue */}
        <div className={`clinical-card p-0 overflow-hidden space-y-0 ${
          upcomingThisWeekList.length > 0 ? 'xl:col-span-8' : 'xl:col-span-12'
        }`}>
          <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#E2E8F0] bg-white">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold leading-6 text-[#0F172A]">
                Needs attention
              </h3>
              {needsAttentionList.length > 0 && (
                <span className={`text-xs tabular-nums font-medium px-2 py-0.5 rounded-full ${
                  overdueFollowUps.length > 0 ? 'badge-danger' : 'badge-warning'
                }`}>
                  {needsAttentionList.length}
                </span>
              )}
            </div>
            {needsAttentionList.length > 0 && (
              <button
                onClick={() => onNavigateToTab('followups')}
                className="btn-ghost text-xs text-[#0F766E] hover:text-[#115E59] h-8 px-2"
              >
                <span>View all follow-ups</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            )}
          </div>

          {/* Divided compact list */}
          {isLoading ? (
            <div className="divide-y divide-[#E2E8F0] bg-white">
              <ListRowSkeleton />
              <ListRowSkeleton />
              <ListRowSkeleton />
            </div>
          ) : needsAttentionList.length === 0 ? (
            <div className="p-10 text-center bg-white">
              <CheckCircle2 className="w-8 h-8 text-[#067647] mx-auto mb-2" />
              <p className="text-sm font-semibold text-[#0F172A]">You're all caught up.</p>
              <p className="text-xs text-[#64748B] mt-0.5">
                No pending patient follow-ups need immediate attention.
              </p>
              <button
                onClick={onOpenNewFollowUp}
                className="btn-secondary text-xs mt-3 min-h-[36px]"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>Schedule follow-up</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#E2E8F0] bg-white">
              {needsAttentionList.slice(0, 5).map((f) => {
                const isOverdue = f.date < todayStrIST;
                const customer = customers.find((c) => c.id === f.customerId);

                return (
                  <div
                    key={f.id}
                    className={`p-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F8FAFC] transition-colors ${
                      isOverdue
                        ? 'border-l-[3px] border-[#B42318]'
                        : 'border-l-[3px] border-[#B54708]'
                    }`}
                  >
                    {/* Left: Name, DueBadge, reason */}
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => customer && onSelectPatient(customer)}
                          className="font-medium text-[#0F172A] text-sm hover:text-[#0F766E] truncate max-w-[200px] text-left"
                          title={f.customerName}
                        >
                          {f.customerName}
                        </button>
                        <DueBadge date={f.date} />
                      </div>
                      <p className="text-xs text-[#475569] truncate max-w-[340px]" title={f.notes}>
                        {f.notes || 'Routine consultation follow-up'}
                      </p>
                      <p className="text-[11px] text-[#64748B] tabular-nums whitespace-nowrap">
                        {formatPhone(f.customerPhone)}
                      </p>
                    </div>

                    {/* Right: Call, WhatsApp, Mark done */}
                    <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                      <a
                        href={`tel:${cleanPhoneForLink(f.customerPhone)}`}
                        className="btn-icon"
                        title={`Call ${f.customerName}`}
                        aria-label={`Call ${f.customerName}`}
                      >
                        <Phone className="w-3.5 h-3.5 text-[#475569]" />
                      </a>

                      {customer && (
                        <button
                          onClick={() =>
                            onSendWhatsApp(
                              customer,
                              `Namaste ${customer.name} ji, this is a follow-up reminder from Vrindavan Healthcare regarding your consultation. Please let us know how your health is today!`
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

                      <button
                        onClick={() => onMarkFollowUpComplete(f.id)}
                        className="btn-secondary h-8 px-2.5 text-xs text-[#067647]"
                        title="Mark follow-up as completed"
                        aria-label="Mark done"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#067647] shrink-0" />
                        <span>Mark done</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {needsAttentionList.length > 5 && (
            <div className="p-3 bg-[#F8FAFC] border-t border-[#E2E8F0] text-center">
              <button
                onClick={() => onNavigateToTab('followups')}
                className="text-xs font-medium text-[#0F766E] hover:underline"
              >
                View all follow-ups ({needsAttentionList.length}) →
              </button>
            </div>
          )}
        </div>

        {/* Narrow "Upcoming this week" column on >=1440px / xl */}
        {upcomingThisWeekList.length > 0 && (
          <div className="xl:col-span-4 clinical-card p-0 overflow-hidden space-y-0">
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#E2E8F0] bg-white">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#0F766E]" />
                <h3 className="text-base font-semibold leading-6 text-[#0F172A]">
                  Upcoming this week
                </h3>
              </div>
              <span className="text-xs font-medium tabular-nums px-2 py-0.5 rounded-full badge-neutral">
                {upcomingThisWeekList.length}
              </span>
            </div>

            <div className="divide-y divide-[#E2E8F0] bg-white">
              {upcomingThisWeekList.slice(0, 5).map((f) => {
                const customer = customers.find((c) => c.id === f.customerId);

                return (
                  <div
                    key={f.id}
                    className="p-3.5 hover:bg-[#F8FAFC] transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => customer && onSelectPatient(customer)}
                        className="font-medium text-[#0F172A] text-sm hover:text-[#0F766E] truncate max-w-[140px] text-left"
                        title={f.customerName}
                      >
                        {f.customerName}
                      </button>
                      <DueBadge date={f.date} />
                    </div>

                    <p className="text-xs text-[#475569] truncate" title={f.notes}>
                      {f.notes || 'Routine follow-up'}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-[#64748B]">
                      <span className="tabular-nums">{formatDate(f.date)}</span>
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${cleanPhoneForLink(f.customerPhone)}`}
                          className="btn-icon w-6 h-6 p-1"
                          title="Call"
                        >
                          <Phone className="w-3 h-3 text-[#475569]" />
                        </a>
                        {customer && (
                          <button
                            onClick={() => onSendWhatsApp(customer)}
                            className="btn-icon w-6 h-6 p-1"
                            title="WhatsApp"
                          >
                            <WhatsAppGlyph className="w-3 h-3 text-[#25D366]" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Recent Patients Section: Whole row clickable with subtle chevron */}
      <div className="clinical-card p-0 overflow-hidden space-y-0">
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#E2E8F0] bg-white">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#0F766E]" />
            <h3 className="text-base font-semibold leading-6 text-[#0F172A]">Recent patients</h3>
          </div>
          <button
            onClick={() => onNavigateToTab('patients')}
            className="btn-ghost text-xs text-[#0F766E] hover:text-[#115E59] h-8 px-2"
          >
            <span>View all patients</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8FAFC] text-[#64748B] text-xs font-medium uppercase tracking-wider border-b border-[#E2E8F0]">
              <tr>
                <th className="py-2.5 px-4 font-medium whitespace-nowrap">Patient</th>
                <th className="py-2.5 px-4 font-medium whitespace-nowrap">Contact</th>
                <th className="py-2.5 px-4 font-medium whitespace-nowrap">Specialty</th>
                <th className="py-2.5 px-4 font-medium whitespace-nowrap">Status</th>
                <th className="py-2.5 px-4 font-medium whitespace-nowrap">Next due</th>
                <th className="py-2.5 px-4 font-medium text-right whitespace-nowrap w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] bg-white">
              {customers.slice(0, 6).map((c) => (
                <tr
                  key={c.id}
                  onClick={() => onSelectPatient(c)}
                  className="hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                >
                  {/* Name on one line + Patient ID muted */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span 
                      className="font-medium text-[#0F172A] group-hover:text-[#0F766E] block truncate max-w-[200px]"
                      title={c.name}
                    >
                      {c.name}
                    </span>
                    <span className="text-xs text-[#64748B] tabular-nums block mt-0.5">
                      <span className="text-[#64748B]">Patient ID </span>{formatPatientDisplayId(c.id)}
                    </span>
                  </td>

                  {/* Contact */}
                  <td className="py-3 px-4 text-[#475569] tabular-nums text-xs whitespace-nowrap">
                    <span className="font-medium text-[#0F172A]">{formatPhone(c.phone)}</span>
                  </td>

                  {/* Specialty */}
                  <td className="py-3 px-4 text-[#475569] text-xs whitespace-nowrap">
                    <span className="truncate max-w-[160px] block" title={c.category || 'General consultation'}>
                      {c.category || 'General consultation'}
                    </span>
                  </td>

                  {/* Follow-up status */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={c.followUpStatus} />
                  </td>

                  {/* Next due */}
                  <td className="py-3 px-4 text-xs whitespace-nowrap">
                    <DueBadge date={c.nextFollowUp} />
                  </td>

                  {/* Subtle Chevron replacing details button */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#0F766E] transition-colors ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
