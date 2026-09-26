import React from 'react';
import { getDueUrgency, formatDate } from '../utils/formatters.ts';

interface DueBadgeProps {
  date: string | Date | null | undefined;
  className?: string;
  showExactDateOnHover?: boolean;
}

/**
 * <DueBadge>
 * Drives urgency colour according to clinical CRM guidelines:
 * - Overdue → danger: "Overdue · 2 days" (red tint)
 * - Due today → warning: "Due today" (amber tint)
 * - Upcoming → neutral: "Tomorrow" / "In 3 days" (neutral grey tint)
 * - No date → muted text "Not scheduled"
 */
export const DueBadge: React.FC<DueBadgeProps> = ({
  date,
  className = '',
  showExactDateOnHover = true,
}) => {
  const { urgency, label, isoDate } = getDueUrgency(date);
  const formattedFullDate = date ? formatDate(date) : '';

  if (urgency === 'none' || !isoDate) {
    return (
      <span className={`text-xs text-[#64748B] whitespace-nowrap ${className}`}>
        Not scheduled
      </span>
    );
  }

  const badgeStyle =
    urgency === 'overdue'
      ? 'badge-danger'
      : urgency === 'due-today'
      ? 'badge-warning'
      : 'badge-neutral';

  const content = (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tabular-nums whitespace-nowrap ${badgeStyle} ${className}`}
      title={showExactDateOnHover && formattedFullDate ? `Due: ${formattedFullDate}` : undefined}
    >
      <time dateTime={isoDate}>{label}</time>
    </span>
  );

  return content;
};
