import React, { useState, useEffect } from 'react';
import { X, Calendar, User, CheckCircle2 } from 'lucide-react';
import type { Customer } from '../types/index.ts';
import { formatPhone, getTodayStrIST } from '../utils/formatters.ts';

interface FollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  preselectedCustomer?: Customer | null;
  onSave: (customerId: string, date: string, notes: string) => Promise<void>;
}

export const FollowUpModal: React.FC<FollowUpModalProps> = ({
  isOpen,
  onClose,
  customers,
  preselectedCustomer,
  onSave,
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    preselectedCustomer ? preselectedCustomer.id : customers[0]?.id || ''
  );
  const [date, setDate] = useState(() => {
    const tomorrow = new Date(Date.now() + 86400000);
    return getTodayStrIST(tomorrow);
  });
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      setError('Please select a patient.');
      return;
    }
    if (!date) {
      setError('Please select a follow-up date.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onSave(selectedCustomerId, date, notes.trim());
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to schedule follow-up.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-t-2xl sm:rounded-xl max-w-md w-full border border-[#E2E8F0] shadow-xl overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        
        {/* Mobile Handle */}
        <div className="sm:hidden w-10 h-1 bg-[#CBD5E1] rounded-full mx-auto mt-2.5 -mb-1" />

        {/* Header */}
        <div className="bg-[#F8FAFC] p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold leading-6 text-[#0F172A]">Schedule follow-up</h2>
            <p className="text-xs text-[#64748B] mt-0.5 leading-4">Vrindavan Healthcare patient care</p>
          </div>
          <button
            onClick={onClose}
            className="btn-icon min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-[32px]"
            title="Close dialog"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4 text-[#475569]" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs text-[#B42318] bg-[#FEF3F2] border border-[#FECDCA] rounded-lg">
              {error}
            </div>
          )}

          {/* Patient Selection */}
          <div>
            <label className="block text-xs font-medium text-[#475569] uppercase tracking-wider mb-1.5">
              Select patient *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                required
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="clinical-input w-full pl-9"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({formatPhone(c.phone)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-medium text-[#475569] uppercase tracking-wider mb-1.5">
              Follow-up date *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="clinical-input w-full pl-9 tabular-nums"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-[#475569] uppercase tracking-wider mb-1.5">
              Instructions / reason
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Check blood sugar readings, evaluate response to medicine..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 text-sm bg-white border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:ring-offset-1 resize-none text-[#0F172A]"
            />
          </div>

          {/* Actions (Touch targets min 44px on mobile) */}
          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary min-h-[44px] sm:min-h-[36px] px-4 text-xs sm:text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary min-h-[44px] sm:min-h-[36px] px-4 text-xs sm:text-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Scheduling...' : 'Confirm follow-up'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
