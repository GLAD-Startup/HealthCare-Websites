import React, { useState, useEffect } from 'react';
import { 
  X, 
  Phone, 
  Edit2, 
  Plus, 
  CheckCircle2, 
  Send
} from 'lucide-react';
import type { Customer, FollowUp, WhatsAppLog, FollowUpStatus } from '../types/index.ts';
import { WhatsAppGlyph } from './WhatsAppGlyph.tsx';
import { DueBadge } from './DueBadge.tsx';
import { StatusBadge } from './StatusBadge.tsx';
import { StatusDropdown } from './StatusDropdown.tsx';
import { db } from '../db/dexie.ts';
import { syncEngine } from '../services/syncEngine.ts';
import { formatPhone, cleanPhoneForLink, formatDate, formatTime, formatPatientDisplayId } from '../utils/formatters.ts';

interface PatientDetailsDrawerProps {
  patient: Customer | null;
  followups: FollowUp[];
  whatsappLogs: WhatsAppLog[];
  onClose: () => void;
  onEditPatient: (patient: Customer) => void;
  onSendWhatsApp: (patient: Customer) => void;
  onAddFollowUp: (patient: Customer, date: string, notes: string) => Promise<void>;
  onMarkFollowUpComplete: (followupId: string) => Promise<void>;
  onUpdateStatus?: (patient: Customer, newStatus: FollowUpStatus) => Promise<void> | void;
}

export const PatientDetailsDrawer: React.FC<PatientDetailsDrawerProps> = ({
  patient,
  followups,
  whatsappLogs,
  onClose,
  onEditPatient,
  onSendWhatsApp,
  onAddFollowUp,
  onMarkFollowUpComplete,
  onUpdateStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'followups' | 'whatsapp'>('overview');
  const [newFollowUpDate, setNewFollowUpDate] = useState('');
  const [newFollowUpNotes, setNewFollowUpNotes] = useState('');
  const [isAddingFollowUp, setIsAddingFollowUp] = useState(false);

  useEffect(() => {
    if (!patient) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [patient, onClose]);

  if (!patient) return null;

  const patientFollowups = followups.filter((f) => f.customerId === patient.id);
  const patientLogs = whatsappLogs.filter((l) => l.customerId === patient.id);

  const handleCreateFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFollowUpDate) return;
    try {
      setIsAddingFollowUp(true);
      await onAddFollowUp(patient, newFollowUpDate, newFollowUpNotes);
      setNewFollowUpDate('');
      setNewFollowUpNotes('');
    } finally {
      setIsAddingFollowUp(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div 
        className="w-full max-w-xl bg-white h-full shadow-xl flex flex-col justify-between border-l border-[#E2E8F0] animate-in slide-in-from-right duration-200"
      >
        {/* Drawer Header */}
        <div className="bg-[#F8FAFC] p-5 border-b border-[#E2E8F0] shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="badge-neutral">
                  {patient.category || 'General consultation'}
                </span>
                <span className="text-xs text-[#64748B] tabular-nums">
                  <span className="text-[#64748B]">Patient ID </span>{formatPatientDisplayId(patient.id)}
                </span>
              </div>
              <h2 className="text-xl font-semibold leading-7 text-[#0F172A] tracking-tight">{patient.name}</h2>
              <div className="flex items-center gap-2 text-xs text-[#64748B] mt-1 tabular-nums whitespace-nowrap">
                <span className="font-medium text-[#0F172A]">{formatPhone(patient.phone)}</span>
                {patient.email && <span>• {patient.email}</span>}
              </div>
            </div>
            <button
              onClick={onClose}
              className="btn-icon"
              title="Close drawer"
              aria-label="Close drawer"
            >
              <X className="w-4 h-4 text-[#475569]" />
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => onSendWhatsApp(patient)}
              className="btn-secondary flex-1 h-9"
              title="Send WhatsApp message"
              aria-label="WhatsApp"
            >
              <WhatsAppGlyph className="w-4 h-4 text-[#25D366] shrink-0" />
              <span className="text-xs font-medium">WhatsApp</span>
            </button>
            <a
              href={`tel:${cleanPhoneForLink(patient.phone)}`}
              className="btn-secondary flex-1 h-9"
              title="Call patient"
              aria-label="Call"
            >
              <Phone className="w-3.5 h-3.5 text-[#475569]" />
              <span className="text-xs font-medium">Call</span>
            </a>
            <button
              onClick={() => onEditPatient(patient)}
              className="btn-secondary flex-1 h-9"
              title="Edit patient"
              aria-label="Edit"
            >
              <Edit2 className="w-3.5 h-3.5 text-[#475569]" />
              <span className="text-xs font-medium">Edit</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E2E8F0] bg-white px-5 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-[#0F766E] text-[#0F766E]'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Overview & notes
          </button>
          <button
            onClick={() => setActiveTab('followups')}
            className={`py-3 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'followups'
                ? 'border-[#0F766E] text-[#0F766E]'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <span>Follow-ups</span>
            <span className="tabular-nums text-xs px-1.5 py-0.2 rounded-full bg-[#F1F5F9] text-[#475569]">
              {patientFollowups.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`py-3 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'whatsapp'
                ? 'border-[#0F766E] text-[#0F766E]'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <span>WhatsApp history</span>
            <span className="tabular-nums text-xs px-1.5 py-0.2 rounded-full bg-[#F1F5F9] text-[#475569]">
              {patientLogs.length}
            </span>
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Profile Details Grid */}
              <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0] space-y-3">
                <h3 className="text-xs font-medium text-[#475569] uppercase tracking-wider">
                  Clinical profile
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#64748B] block">Attending doctor</span>
                    <span className="font-medium text-[#0F172A]">{patient.doctorAssigned || 'Dr. Vrindavan'}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block mb-1">Follow-up status</span>
                    <StatusDropdown
                      status={patient.followUpStatus}
                      onChange={async (newStatus) => {
                        if (onUpdateStatus) {
                          await onUpdateStatus(patient, newStatus);
                        } else {
                          const now = new Date().toISOString();
                          const updated = {
                            ...patient,
                            followUpStatus: newStatus,
                            updatedAt: now,
                            syncStatus: 'pending' as const,
                          };
                          await db.customers.put(updated);
                          await syncEngine.queueChange('customer', updated.id, 'UPDATE', updated);
                        }
                      }}
                    />
                  </div>
                  <div>
                    <span className="text-[#64748B] block">Next follow-up</span>
                    <div className="mt-0.5">
                      <DueBadge date={patient.nextFollowUp} />
                    </div>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">Cloud sync status</span>
                    <span className="font-medium text-[#067647] flex items-center gap-1 mt-0.5">
                      <span className="dot-success w-1.5 h-1.5" />
                      <span>{patient.syncStatus === 'synced' ? 'Synced' : 'Offline'}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Consultation Notes */}
              <div>
                <h3 className="text-xs font-medium text-[#475569] uppercase tracking-wider mb-1.5">
                  Clinical & care notes
                </h3>
                <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-sm text-[#0F172A] whitespace-pre-wrap leading-relaxed">
                  {patient.notes ? patient.notes : <span className="text-[#64748B] italic">No notes recorded for this patient.</span>}
                </div>
              </div>

              {/* Patient Timeline Info */}
              <div className="text-xs text-[#64748B] space-y-1 pt-3 border-t border-[#E2E8F0] tabular-nums">
                <p>Record created: {formatDate(patient.createdAt)}</p>
                <p>Last updated: {formatDate(patient.updatedAt)}</p>
                {patient.lastContact && (
                  <p>Last contacted: {formatDate(patient.lastContact)} at {formatTime(patient.lastContact)}</p>
                )}
              </div>
            </div>
          )}

          {/* TAB: FOLLOW-UPS */}
          {activeTab === 'followups' && (
            <div className="space-y-5">
              
              {/* Quick Add Follow-up Form */}
              <form onSubmit={handleCreateFollowUp} className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-3">
                <h4 className="text-xs font-medium text-[#0F172A] uppercase tracking-wider">
                  Schedule new follow-up
                </h4>
                <div>
                  <label className="block text-xs font-medium text-[#475569] mb-1">
                    Follow-up date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newFollowUpDate}
                    onChange={(e) => setNewFollowUpDate(e.target.value)}
                    className="clinical-input w-full tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#475569] mb-1">
                    Notes / reason
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Check blood pressure, review scan..."
                    value={newFollowUpNotes}
                    onChange={(e) => setNewFollowUpNotes(e.target.value)}
                    className="clinical-input w-full"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isAddingFollowUp || !newFollowUpDate}
                  className="btn-primary w-full"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingFollowUp ? 'Scheduling...' : 'Save follow-up'}</span>
                </button>
              </form>

              {/* List of Follow-ups */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-medium text-[#475569] uppercase tracking-wider">
                  Follow-up history ({patientFollowups.length})
                </h4>

                {patientFollowups.length === 0 ? (
                  <p className="text-xs text-[#64748B] italic text-center py-4">
                    No follow-ups recorded yet for this patient.
                  </p>
                ) : (
                  patientFollowups.map((f) => (
                    <div
                      key={f.id}
                      className="p-3.5 rounded-lg border border-[#E2E8F0] bg-white text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DueBadge date={f.date} />
                          <span className="text-[#64748B] tabular-nums">{formatDate(f.date)}</span>
                        </div>
                        <StatusBadge status={f.status} />
                      </div>
                      <p className="text-[#475569]">{f.notes || 'Routine follow-up'}</p>
                      
                      {f.status === 'pending' && (
                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => onMarkFollowUpComplete(f.id)}
                            className="btn-secondary h-8 px-2.5 text-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#067647]" />
                            <span>Done</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: WHATSAPP HISTORY */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-medium text-[#475569] uppercase tracking-wider">
                  Sent messages ({patientLogs.length})
                </h4>
                <button
                  onClick={() => onSendWhatsApp(patient)}
                  className="btn-ghost h-8 px-2 text-xs text-[#0F766E] hover:text-[#115E59]"
                >
                  <Send className="w-3 h-3 mr-1" />
                  <span>Compose</span>
                </button>
              </div>

              {patientLogs.length === 0 ? (
                <div className="text-center py-8 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <p className="text-xs text-[#64748B]">No WhatsApp messages dispatched yet.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {patientLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between text-xs text-[#64748B] tabular-nums">
                        <span className="font-medium text-[#0F172A]">{log.templateTitle || 'Direct'}</span>
                        <span>{formatDate(log.sentAt)} {formatTime(log.sentAt)}</span>
                      </div>
                      <p className="text-[#475569] whitespace-pre-wrap">{log.messageBody}</p>
                      <div className="badge-success">
                        <span className="dot-success w-1.5 h-1.5" />
                        <span>Status: {log.status} ({log.channel})</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] shrink-0 text-right">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
