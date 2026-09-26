import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, Calendar, Stethoscope, CheckCircle2 } from 'lucide-react';
import type { Customer, FollowUpStatus } from '../types/index.ts';

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patientData: Partial<Customer>) => Promise<void>;
  patientToEdit?: Customer | null;
}

const CATEGORIES = [
  'General consultation',
  'Gastroenterology',
  'Dermatology & skin care',
  'Ophthalmology & vision care',
  'Diabetes & endocrinology',
  'Hypertension & cardiac care',
  'Pediatrics',
  'Routine health checkup',
];

export const PatientModal: React.FC<PatientModalProps> = ({
  isOpen,
  onClose,
  onSave,
  patientToEdit,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [doctorAssigned, setDoctorAssigned] = useState('Dr. Vrindavan');
  const [followUpStatus, setFollowUpStatus] = useState<FollowUpStatus>('pending');
  const [nextFollowUp, setNextFollowUp] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (patientToEdit) {
      setName(patientToEdit.name || '');
      setPhone(patientToEdit.phone || '');
      setEmail(patientToEdit.email || '');
      setCategory(patientToEdit.category || CATEGORIES[0]);
      setDoctorAssigned(patientToEdit.doctorAssigned || 'Dr. Vrindavan');
      setFollowUpStatus(patientToEdit.followUpStatus || 'pending');
      setNextFollowUp(patientToEdit.nextFollowUp || '');
      setNotes(patientToEdit.notes || '');
    } else {
      setName('');
      setPhone('+91 ');
      setEmail('');
      setCategory(CATEGORIES[0]);
      setDoctorAssigned('Dr. Vrindavan');
      setFollowUpStatus('pending');
      setNextFollowUp('');
      setNotes('');
    }
    setError('');
  }, [patientToEdit, isOpen]);

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
    if (!name.trim()) {
      setError('Patient name is required.');
      return;
    }
    if (!phone.trim() || phone.trim() === '+91') {
      setError('Valid contact phone number is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onSave({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        category,
        doctorAssigned,
        followUpStatus,
        nextFollowUp: nextFollowUp || null,
        notes: notes.trim(),
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save patient record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-t-2xl sm:rounded-xl max-w-lg w-full border border-[#E2E8F0] shadow-xl overflow-hidden my-0 sm:my-8 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        
        {/* Mobile Handle */}
        <div className="sm:hidden w-10 h-1 bg-[#CBD5E1] rounded-full mx-auto mt-2.5 -mb-1" />

        {/* Header */}
        <div className="bg-[#F8FAFC] p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold leading-6 text-[#0F172A]">
              {patientToEdit ? 'Edit patient record' : 'Register new patient'}
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5 leading-4">
              Vrindavan Healthcare clinical registry
            </p>
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
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 text-xs text-[#B42318] bg-[#FEF3F2] border border-[#FECDCA] rounded-lg">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-medium text-[#475569] uppercase tracking-wider mb-1.5">
              Full name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="clinical-input w-full pl-10"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#475569] uppercase tracking-wider mb-1.5">
                Phone number (WhatsApp) *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="tel"
                  required
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="clinical-input w-full pl-10 tabular-nums"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-[#475569] uppercase tracking-wider mb-1.5">
                Email address (optional)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  placeholder="ramesh@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="clinical-input w-full pl-10"
                />
              </div>
            </div>
          </div>

          {/* Specialty / Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#475569] uppercase tracking-wider mb-1.5">
                Specialty / Department
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="clinical-input w-full"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor Assigned */}
            <div>
              <label className="block text-xs font-medium text-[#475569] uppercase tracking-wider mb-1.5">
                Attending doctor
              </label>
              <div className="relative">
                <Stethoscope className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={doctorAssigned}
                  onChange={(e) => setDoctorAssigned(e.target.value)}
                  className="clinical-input w-full pl-10"
                />
              </div>
            </div>
          </div>

          {/* Follow-up Scheduling */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E2E8F0]">
            <div>
              <label className="block text-xs font-medium text-[#475569] uppercase tracking-wider mb-1.5">
                Follow-up status
              </label>
              <select
                value={followUpStatus}
                onChange={(e) => setFollowUpStatus(e.target.value as FollowUpStatus)}
                className="clinical-input w-full"
              >
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#475569] uppercase tracking-wider mb-1.5">
                Next follow-up date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  value={nextFollowUp}
                  onChange={(e) => setNextFollowUp(e.target.value)}
                  className="clinical-input w-full pl-10 tabular-nums"
                />
              </div>
            </div>
          </div>

          {/* Clinical Notes */}
          <div>
            <label className="block text-xs font-medium text-[#475569] uppercase tracking-wider mb-1.5">
              Consultation & clinical notes
            </label>
            <textarea
              rows={3}
              placeholder="Symptoms, diagnosis, prescribed medicines, follow-up instructions..."
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
              <span>{isSubmitting ? 'Saving...' : patientToEdit ? 'Update patient' : 'Save patient'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
