import { useMemo } from 'react';
import type { Customer, FollowUp } from '../types/index.ts';
import { getTodayStrIST } from '../utils/formatters.ts';

export interface ClinicalCounts {
  todayStrIST: string;

  // Task-level grouped arrays
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
 */
export function useClinicalCounts(customers: Customer[], followups: FollowUp[]): ClinicalCounts {
  const todayStrIST = useMemo(() => getTodayStrIST(), []);

  return useMemo(() => {
    const pending = followups.filter((f) => f.status === 'pending');
    const overdueTasks = pending
      .filter((f) => f.date < todayStrIST)
      .sort((a, b) => a.date.localeCompare(b.date));
    const dueTodayTasks = pending
      .filter((f) => f.date === todayStrIST)
      .sort((a, b) => a.customerName.localeCompare(b.customerName));
    const upcomingTasks = pending
      .filter((f) => f.date > todayStrIST)
      .sort((a, b) => a.date.localeCompare(b.date));
    const completedTasks = followups
      .filter((f) => f.status === 'completed')
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

    const needsAttentionTasks = [...overdueTasks, ...dueTodayTasks];
    const completedPatients = customers.filter((c) => c.followUpStatus === 'completed');

    return {
      todayStrIST,
      overdueTasks,
      dueTodayTasks,
      upcomingTasks,
      completedTasks,
      needsAttentionTasks,

      overdueCount: overdueTasks.length,
      dueTodayCount: dueTodayTasks.length,
      upcomingCount: upcomingTasks.length,
      completedTasksCount: completedTasks.length,
      totalFollowUpsCount: followups.length,

      needsAttentionCount: needsAttentionTasks.length,
      hasOverdue: overdueTasks.length > 0,

      totalPatientsCount: customers.length,
      completedPatientsCount: completedPatients.length,
      activePatientsCount: Math.max(0, customers.length - completedPatients.length),
    };
  }, [customers, followups, todayStrIST]);
}
