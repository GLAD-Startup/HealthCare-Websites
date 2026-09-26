import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { FollowUpStatus } from '../types/index.ts';

interface StatusDropdownProps {
  status: FollowUpStatus | string;
  onChange: (newStatus: FollowUpStatus) => void | Promise<void>;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<
  FollowUpStatus,
  { label: string; dotColor: string; badgeClasses: string }
> = {
  pending: {
    label: 'Pending',
    dotColor: 'bg-[#94A3B8]',
    badgeClasses: 'bg-[#F1F5F9] text-[#334155] border-[#CBD5E1] hover:bg-[#E2E8F0]',
  },
  scheduled: {
    label: 'Scheduled',
    dotColor: 'bg-[#3B82F6]',
    badgeClasses: 'bg-[#EFF8FF] text-[#175CD3] border-[#B2DDFF] hover:bg-[#D1E9FF]',
  },
  contacted: {
    label: 'Contacted',
    dotColor: 'bg-[#8B5CF6]',
    badgeClasses: 'bg-[#F9F5FF] text-[#6941C6] border-[#E9D7FE] hover:bg-[#E9D7FE]',
  },
  completed: {
    label: 'Completed',
    dotColor: 'bg-[#12B76A]',
    badgeClasses: 'bg-[#ECFDF3] text-[#027A48] border-[#A6F4C5] hover:bg-[#D1FADF]',
  },
  cancelled: {
    label: 'Cancelled',
    dotColor: 'bg-[#94A3B8]',
    badgeClasses: 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:bg-[#F1F5F9]',
  },
};

export const StatusDropdown: React.FC<StatusDropdownProps> = ({
  status,
  onChange,
  disabled = false,
  className = '',
  size = 'md',
}) => {
  const normStatus = (status || 'pending').toLowerCase() as FollowUpStatus;
  const config = STATUS_CONFIG[normStatus] || STATUS_CONFIG.pending;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    const newStatus = e.target.value as FollowUpStatus;
    onChange(newStatus);
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`relative inline-flex items-center select-none ${className}`}
      title="Click to change status"
    >
      <span
        className={`w-1.5 h-1.5 rounded-full absolute left-2.5 pointer-events-none ${config.dotColor}`}
      />
      <select
        value={normStatus}
        disabled={disabled}
        onChange={handleChange}
        className={`appearance-none rounded-full font-medium border cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0F766E]/40 focus:ring-offset-1 transition-all ${
          size === 'sm' ? 'text-[11px] pl-5 pr-5 py-0.5' : 'text-xs pl-5 pr-6 py-1'
        } ${config.badgeClasses} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        aria-label="Change status"
      >
        <option value="pending">Pending</option>
        <option value="scheduled">Scheduled</option>
        <option value="contacted">Contacted</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <ChevronDown
        className={`pointer-events-none text-current opacity-60 absolute ${
          size === 'sm' ? 'w-2.5 h-2.5 right-1.5' : 'w-3 h-3 right-2'
        }`}
      />
    </div>
  );
};
