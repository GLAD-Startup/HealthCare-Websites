import React from 'react';

/**
 * Reusable Skeleton Loaders for Vrindavan Healthcare CRM
 * Prevents jarring layout shifts and eliminates full-page spinners.
 */

export const StatCardSkeleton: React.FC = () => (
  <div className="clinical-card p-5 bg-white space-y-3 animate-pulse border border-[#E2E8F0]">
    <div className="flex items-center justify-between">
      <div className="h-3 w-20 bg-slate-200 rounded" />
      <div className="w-4 h-4 bg-slate-200 rounded-full" />
    </div>
    <div className="h-8 w-16 bg-slate-200 rounded" />
    <div className="h-3 w-32 bg-slate-100 rounded" />
  </div>
);

export const TableRowSkeleton: React.FC = () => (
  <tr className="animate-pulse h-[60px] border-b border-[#E2E8F0]">
    <td className="py-3 px-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
        <div className="space-y-1.5 min-w-0">
          <div className="h-3.5 w-28 bg-slate-200 rounded" />
          <div className="h-2.5 w-16 bg-slate-100 rounded" />
        </div>
      </div>
    </td>
    <td className="py-3 px-4">
      <div className="h-3.5 w-24 bg-slate-200 rounded" />
    </td>
    <td className="py-3 px-4">
      <div className="h-3.5 w-32 bg-slate-100 rounded" />
    </td>
    <td className="py-3 px-4">
      <div className="h-5 w-20 bg-slate-200 rounded-full" />
    </td>
    <td className="py-3 px-4">
      <div className="h-5 w-24 bg-slate-200 rounded-full" />
    </td>
    <td className="py-3 px-4 text-right">
      <div className="h-7 w-16 bg-slate-200 rounded ml-auto" />
    </td>
  </tr>
);

export const ListRowSkeleton: React.FC = () => (
  <div className="p-4 sm:px-5 flex items-center justify-between gap-4 animate-pulse border-b border-[#E2E8F0]">
    <div className="space-y-2 min-w-[200px]">
      <div className="flex items-center gap-2">
        <div className="h-4 w-28 bg-slate-200 rounded" />
        <div className="h-4 w-16 bg-slate-200 rounded-full" />
      </div>
      <div className="h-3 w-20 bg-slate-100 rounded" />
    </div>
    <div className="flex-1 max-w-sm h-3 bg-slate-100 rounded hidden md:block" />
    <div className="flex items-center gap-2 shrink-0">
      <div className="w-8 h-8 rounded bg-slate-200" />
      <div className="w-20 h-8 rounded bg-slate-200" />
    </div>
  </div>
);

export const CardSkeleton: React.FC = () => (
  <div className="clinical-card p-4 bg-white space-y-3 animate-pulse border border-[#E2E8F0]">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-slate-200" />
        <div className="space-y-1">
          <div className="h-3.5 w-24 bg-slate-200 rounded" />
          <div className="h-2.5 w-16 bg-slate-100 rounded" />
        </div>
      </div>
      <div className="h-5 w-16 bg-slate-200 rounded-full" />
    </div>
    <div className="h-3 w-40 bg-slate-100 rounded" />
    <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9]">
      <div className="h-5 w-20 bg-slate-200 rounded-full" />
      <div className="h-7 w-20 bg-slate-200 rounded" />
    </div>
  </div>
);
