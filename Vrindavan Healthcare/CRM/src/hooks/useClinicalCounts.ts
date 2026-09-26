import { useMemo } from 'react';
import type { Customer, FollowUp } from '../types/index.ts';
import { getTodayStrIST, getDueUrgency, getDateStrIST } from '../utils/formatters.ts';

export interface ClinicalCounts {
  todayStrIST: string;

  // Task-level grouped arrays
  allTasks: FollowUp[];
  overdueTasks: FollowUp[];
  dueTodayTasks: FollowUp[];
  upcomingTasks: FollowUp[];
  completedTasks: FollowUp[];
  needsAttentionTasks: FollowUp[];

  // Task-level counts
  overdueCount: number;
  dueTodayCount: number;
  upcomingCount: number;
  completedTasksCount: number;
  totalFollowUpsCount: number;

  // Actionable count for Sidebar badge (overdue + due today)
  needsAttentionCount: number;
  hasOverdue: boolean;

  // Patient-level counts
  totalPatientsCount: number;
  completedPatientsCount: number;
  activePatientsCount: number;
}

/**
 * Single source of truth for all clinical dashboard, badge, and tab counts.
 * Anchored to Asia/Kolkata (IST, UTC+5:30) to prevent date shifts.
 * Automatically reconciles customer.nextFollowUp with followups so no scheduled follow-up is missed.
 */
export function useClinicalCounts(customers: Customer[], followups: FollowUp[]): ClinicalCounts {
  const todayStrIST = useMemo(() => getTodayStrIST(), []);

  return useMemo(() => {
    // Collect all follow-ups, and synthesize entries for any customer with nextFollowUp who doesn't have an active follow-up task
    const existingPendingCustIds = new Set(
      followups.filter((f) => f.status === 'pending').map((f) => f.customerId)
    );

    const mergedFollowUps: FollowUp[] = [...followups];

    // Ensure any patient with status scheduled, pending, or with nextFollowUp date set is guaranteed to appear in follow-ups
    const tomorrowStr = getTodayStrIST(new Date(Date.now() + 86400000));

    customers.forEach((c) => {
      const isScheduledOrPending =
        c.followUpStatus === 'scheduled' || c.followUpStatus === 'pending';
      const hasDate = Boolean(c.nextFollowUp);

      if (
        (isScheduledOrPending || hasDate) &&
        c.followUpStatus !== 'completed' &&
        c.followUpStatus !== 'cancelled' &&
        !existingPendingCustIds.has(c.id)
      ) {
        const effectiveDate = c.nextFollowUp || tomorrowStr;
        mergedFollowUps.push({
          id: `fol-synced-${c.id}`,
          customerId: c.id,
          customerName: c.name,
          customerPhone: c.phone,
          date: effectiveDate,
          status: 'pending',
          notes: c.notes || 'Routine consultation follow-up',
          reminderSent: false,
          createdAt: c.createdAt || new Date().toISOString(),
          updatedAt: c.updatedAt || new Date().toISOString(),
          syncStatus: c.syncStatus,
        });
      }
    });

    const pending = mergedFollowUps.filter((f) => f.status === 'pending');
    
    // Categorize based on getDueUrgency for 100% calendar & IST date accuracy
    const overdueTasks: FollowUp[] = [];
    const dueTodayTasks: FollowUp[] = [];
    const upcomingTasks: FollowUp[] = [];
    const completedTasks = mergedFollowUps
      .filter((f) => f.status === 'completed')
      .sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));

    pending.forEach((f) => {
      const { urgency } = getDueUrgency(f.date);
      if (urgency === 'overdue') {
        overdueTasks.push(f);
      } else if (urgency === 'due-today') {
        dueTodayTasks.push(f);
      } else {
        upcomingTasks.push(f);
      }
    });

    // Sort appropriately
    overdueTasks.sort((a, b) => getDateStrIST(a.date).localeCompare(getDateStrIST(b.date)));
    dueTodayTasks.sort((a, b) => a.customerName.localeCompare(b.customerName));
    upcomingTasks.sort((a, b) => getDateStrIST(a.date).localeCompare(getDateStrIST(b.date)));

    const needsAttentionTasks = [...overdueTasks, ...dueTodayTasks];
    const completedPatients = customers.filter((c) => c.followUpStatus === 'completed');

    return {
      todayStrIST,
      allTasks: mergedFollowUps,
      overdueTasks,
      dueTodayTasks,
      upcomingTasks,
      completedTasks,
      needsAttentionTasks,

      overdueCount: overdueTasks.length,
      dueTodayCount: dueTodayTasks.length,
      upcomingCount: upcomingTasks.length,
      completedTasksCount: completedTasks.length,
      totalFollowUpsCount: mergedFollowUps.length,

      needsAttentionCount: needsAttentionTasks.length,
      hasOverdue: overdueTasks.length > 0,

      totalPatientsCount: customers.length,
      completedPatientsCount: completedPatients.length,
      activePatientsCount: Math.max(0, customers.length - completedPatients.length),
    };
  }, [customers, followups, todayStrIST]);
}

