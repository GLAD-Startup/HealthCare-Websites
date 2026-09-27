import React from 'react';
import type { FollowUpStatus } from '../types/index.ts';

interface StatusBadgeProps {
  status: FollowUpStatus | string;
  className?: string;
}

/**
 * <StatusBadge>
 * Follow-up lifecycle status indicator.
 * Neutral grey pill with a small coloured dot:
 * - Pending → grey dot (#94A3B8)
 * - Scheduled → blue dot (#3B82F6)
 * - Contacted → violet dot (#8B5CF6)
 * - Completed → green dot (#12B76A)
 * 
 * Strict rule: NEVER amber or red. Amber and red are strictly reserved for urgency <DueBadge>.
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = '',
}) => {
  const normStatus = (status || 'pending').toLowerCase();

  let dotColor = 'bg-[#94A3B8]'; // Grey default
  let label = 'Pending';

  if (normStatus === 'completed') {
    dotColor = 'bg-[#12B76A]'; // Green
    label = 'Completed';
  } else if (normStatus === 'contacted') {
    dotColor = 'bg-[#8B5CF6]'; // Violet
    label = 'Contacted';
  } else if (normStatus === 'scheduled') {
    dotColor = 'bg-[#3B82F6]'; // Blue
    label = 'Scheduled';
  } else if (normStatus === 'rescheduled') {
    dotColor = 'bg-[#3B82F6]'; // Blue
    label = 'Rescheduled';
  } else if (normStatus === 'cancelled') {
    dotColor = 'bg-[#94A3B8]'; // Grey
    label = 'Cancelled';
  } else {
    dotColor = 'bg-[#94A3B8]'; // Grey
    label = 'Pending';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F1F5F9] text-[#334155] border border-[#E2E8F0] whitespace-nowrap ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
      <span>{label}</span>
    </span>
  );
};
