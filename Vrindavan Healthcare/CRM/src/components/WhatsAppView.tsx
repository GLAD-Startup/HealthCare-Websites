import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Send, 
  Search, 
  CheckCheck, 
  Clock, 
  Plus, 
  Copy,
  Check,
  AlertCircle,
  MessageSquare,
  Sparkles,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/dexie.ts';
import type { Customer, WhatsAppLog, WhatsAppTemplate } from '../types/index.ts';
import { renderTemplate } from '../services/whatsappService.ts';
import { WhatsAppGlyph } from './WhatsAppGlyph.tsx';
import { DueBadge } from './DueBadge.tsx';
import { StatusBadge } from './StatusBadge.tsx';
import { formatPhone, formatDate, formatTime } from '../utils/formatters.ts';

interface WhatsAppViewProps {
  customers: Customer[];
  templates: WhatsAppTemplate[];
  whatsappLogs: WhatsAppLog[];
  preselectedCustomer?: Customer | null;
  onSendMessage: (params: {
    customer: Customer;
    message: string;
    templateTitle?: string;
    channel?: 'wa_me' | 'cloud_api';
  }) => Promise<void>;
  onSaveTemplate: (template: Partial<WhatsAppTemplate>) => Promise<void>;
}

export const WhatsAppView: React.FC<WhatsAppViewProps> = ({
  customers,
  templates,
  whatsappLogs,
  preselectedCustomer,
  onSendMessage,
  onSaveTemplate,
}) => {
  // Read clinic settings from Dexie
  const settings = useLiveQuery(() => db.settings.get('clinic_default'), []);
  const clinicName = settings?.clinicName || 'Vrindavan Healthcare';
  const doctorName = settings?.doctorName || 'Dr. Vrindavan';
  const isMetaCloudApiConfigured = Boolean(settings?.whatsappToken && settings?.whatsappPhoneId);

  // Selected customer
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    preselectedCustomer ? preselectedCustomer.id : customers[0]?.id || ''
  );

  // Searchable patient picker state
  const [patientSearch, setPatientSearch] = useState('');
  const [isPatientDropdownOpen, setIsPatientDropdownOpen] = useState(false);
  const patientComboboxRef = useRef<HTMLDivElement>(null);

  // Selected template & custom note
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || '');
  const [customMessage, setCustomMessage] = useState('');
  const maxCustomChars = 500;

  // Dispatch channel
  const [channel, setChannel] = useState<'wa_me' | 'cloud_api'>('wa_me');
  const [isSending, setIsSending] = useState(false);

  // New template modal / form
  const [showAddTemplate, setShowAddTemplate] = useState(false);
  const [newTemplateTitle, setNewTemplateTitle] = useState('');
  const [newTemplateContent, setNewTemplateContent] = useState('');
  const [newTemplateCategory, setNewTemplateCategory] = useState<'greeting' | 'followup' | 'reminder' | 'reports' | 'custom'>('custom');

  // Copy status
  const [isCopied, setIsCopied] = useState(false);
  const [mobileTab, setMobileTab] = useState<'compose' | 'preview'>('compose');

  // Sync preselected customer
  useEffect(() => {
    if (preselectedCustomer) {
      setSelectedCustomerId(preselectedCustomer.id);
      setPatientSearch('');
    }
  }, [preselectedCustomer]);

  // Click outside listener for patient picker
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (patientComboboxRef.current && !patientComboboxRef.current.contains(e.target as Node)) {
        setIsPatientDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCustomer = useMemo(
    () => customers.find((c) => c.id === selectedCustomerId) || customers[0],
    [customers, selectedCustomerId]
  );

  const selectedTemplate = useMemo(
    () => templates.find((t) => t.id === selectedTemplateId) || templates[0],
    [templates, selectedTemplateId]
  );

  // Filter patients for combobox
  const filteredPatients = useMemo(() => {
    if (!patientSearch.trim()) return customers.slice(0, 8);
    const q = patientSearch.toLowerCase().trim();
    const rawDigits = patientSearch.replace(/\D/g, '');

    return customers
      .filter((c) => {
        return (
          c.name.toLowerCase().includes(q) ||
          (rawDigits && c.phone.replace(/\D/g, '').includes(rawDigits)) ||
          c.category?.toLowerCase().includes(q)
        );
      })
      .slice(0, 10);
  }, [customers, patientSearch]);

  // Interpolated preview message with dynamic settings doctor/clinic sign-off
  const previewMessage = useMemo(() => {
    if (!selectedTemplate) return customMessage;

    const rendered = renderTemplate(selectedTemplate.content, {
      patient_name: selectedCustomer?.name || 'Patient',
      clinic_name: clinicName,
      doctor_name: selectedCustomer?.doctorAssigned || doctorName,
      date: selectedCustomer?.nextFollowUp ? formatDate(selectedCustomer.nextFollowUp) : 'your scheduled date',
      notes: selectedCustomer?.notes || '',
    });

    return customMessage.trim() ? `${rendered}\n\n${customMessage.trim()}` : rendered;
  }, [selectedTemplate, selectedCustomer, customMessage, clinicName, doctorName]);

  const handleSend = async () => {
    if (!selectedCustomer) {
      alert('Please select a recipient patient.');
      return;
    }
    if (!previewMessage.trim()) {
      alert('Message body cannot be empty.');
      return;
    }

    try {
      setIsSending(true);
      await onSendMessage({
        customer: selectedCustomer,
        message: previewMessage,
        templateTitle: selectedTemplate?.title,
        channel,
      });
      setCustomMessage('');
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateTitle.trim() || !newTemplateContent.trim()) return;

    await onSaveTemplate({
      id: 'tmpl-' + Date.now(),
      title: newTemplateTitle.trim(),
      category: newTemplateCategory,
      content: newTemplateContent.trim(),
      variables: ['patient_name'],
      isActive: true,
    });

    setNewTemplateTitle('');
    setNewTemplateContent('');
    setShowAddTemplate(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(previewMessage);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Helper to highlight variables in template previews
  const renderTemplateContentWithChips = (content: string) => {
    const parts = content.split(/(\{\{[^}]+\}\})/g);
    return parts.map((part, i) => {
      if (part.startsWith('{{') && part.endsWith('}}')) {
        const varName = part.slice(2, -2).trim();
        return (
          <span
            key={i}
            className="inline-block px-1.5 py-0.5 rounded text-[11px] font-mono font-medium bg-[#E0F2FE] text-[#0369A1] mx-0.5"
          >
            {varName}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'greeting':
        return 'Greeting';
      case 'reminder':
        return 'Reminder';
      case 'reports':
        return 'Reports';
      case 'followup':
        return 'Follow-up';
      default:
        return 'Health tip';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Standard Page Header: Title + Subtitle + Channel Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h2 className="text-2xl font-semibold leading-8 text-[#0F172A]">
            WhatsApp messages
          </h2>
          <p className="text-sm font-normal text-[#64748B] leading-5 mt-0.5">
            Standardized greetings, follow-up reminders, and test results for patients.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-xs text-[#475569]">
            <span className="w-2 h-2 rounded-full bg-[#12B76A]" />
            <span>Direct WhatsApp active</span>
          </div>
        </div>
      </div>

      {/* Mobile Tab Switcher (<lg only) */}
      <div className="lg:hidden grid grid-cols-2 p-1 bg-[#F1F5F9] rounded-xl border border-[#E2E8F0] gap-1">
        <button
          type="button"
          onClick={() => setMobileTab('compose')}
          className={`py-2 text-xs font-semibold rounded-lg transition-all text-center min-h-[44px] ${
            mobileTab === 'compose'
              ? 'bg-white text-[#0F766E] shadow-xs'
              : 'text-[#64748B]'
          }`}
        >
          1. Compose message
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`py-2 text-xs font-semibold rounded-lg transition-all text-center min-h-[44px] ${
            mobileTab === 'preview'
              ? 'bg-white text-[#0F766E] shadow-xs'
              : 'text-[#64748B]'
          }`}
        >
          2. Live preview
        </button>
      </div>

      {/* Two-Column Grid: Composer (~60%) and Sticky Phone Preview (~40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-20 lg:pb-0">
        
        {/* Left Column: Composer Controls (~60%, 7 cols) */}
        <div className={`lg:col-span-7 space-y-5 ${mobileTab === 'compose' ? 'block' : 'hidden lg:block'}`}>
          
          {/* Section 1: Patient Picker (Searchable Combobox + Compact Summary Row) */}
          <div className="clinical-card p-4 sm:p-5 space-y-3 bg-white" ref={patientComboboxRef}>
            <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
              1. Recipient patient *
            </label>

            {/* Combobox Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={patientSearch}
                onFocus={() => setIsPatientDropdownOpen(true)}
                onChange={(e) => {
                  setPatientSearch(e.target.value);
                  setIsPatientDropdownOpen(true);
                }}
                placeholder={
                  selectedCustomer
                    ? `${selectedCustomer.name} — ${formatPhone(selectedCustomer.phone)}`
                    : 'Search patient by name or phone…'
                }
                className="clinical-input w-full pl-9 pr-8 text-sm"
              />
              {patientSearch && (
                <button
                  onClick={() => {
                    setPatientSearch('');
                    setIsPatientDropdownOpen(false);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] p-0.5"
                >
                  ×
                </button>
              )}

              {/* Combobox Dropdown */}
              {isPatientDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-50 overflow-hidden max-h-64 overflow-y-auto">
                  <div className="p-2 bg-[#F8FAFC] border-b border-[#F1F5F9] text-[11px] font-medium text-[#64748B]">
                    Select patient from clinic directory
                  </div>
                  {filteredPatients.length === 0 ? (
                    <div className="p-4 text-center text-xs text-[#64748B]">
                      No matching patients found.
                    </div>
                  ) : (
                    <div className="divide-y divide-[#F1F5F9]">
                      {filteredPatients.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            setSelectedCustomerId(c.id);
                            setPatientSearch('');
                            setIsPatientDropdownOpen(false);
                          }}
                          className={`w-full text-left p-3 hover:bg-[#F8FAFC] transition-colors flex items-center justify-between gap-3 text-xs ${
                            selectedCustomerId === c.id ? 'bg-[#F0FDFA]' : ''
                          }`}
                        >
                          <div className="min-w-0">
                            <span className="font-semibold text-[#0F172A] block truncate">
                              {c.name}
                            </span>
                            <span className="text-[#64748B] tabular-nums">
                              {formatPhone(c.phone)} · {c.category || 'General consultation'}
                            </span>
                          </div>
                          {selectedCustomerId === c.id && (
                            <Check className="w-4 h-4 text-[#0F766E] shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected Patient Compact Summary Row */}
            {selectedCustomer && (
              <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div>
                    <span className="text-[#64748B]">Selected: </span>
                    <strong className="text-[#0F172A] font-medium">{selectedCustomer.name}</strong>
                    <span className="text-[#64748B] ml-2 tabular-nums">{formatPhone(selectedCustomer.phone)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[#64748B]">Status:</span>
                  <StatusBadge status={selectedCustomer.followUpStatus} />
                  <span className="text-[#64748B] ml-1">Next due:</span>
                  <DueBadge date={selectedCustomer.nextFollowUp} />
                </div>
              </div>
            )}

            {/* WhatsApp Consent Warning (if not explicitly opted in) */}
            {selectedCustomer && selectedCustomer.whatsappStatus === 'none' && (
              <div className="p-3 bg-[#FFFAEB] border border-[#FEDF89] rounded-lg text-xs text-[#B54708] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#B54708]" />
                <span>
                  <strong>Notice:</strong> This patient has not confirmed formal WhatsApp opt-in. Message will be dispatched via direct WhatsApp link.
                </span>
              </div>
            )}
          </div>

          {/* Section 2: Templates (Vertical radio-style cards with highlighted variable chips) */}
          <div className="clinical-card p-4 sm:p-5 space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                2. Message template
              </label>
              <button
                onClick={() => setShowAddTemplate(!showAddTemplate)}
                className="btn-ghost text-xs text-[#0F766E] hover:text-[#115E59] h-7 px-2"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>New template</span>
              </button>
            </div>

            {/* Add Custom Template Inline Form */}
            {showAddTemplate && (
              <form onSubmit={handleCreateTemplate} className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#0F172A]">Create clinical template</span>
                  <select
                    value={newTemplateCategory}
                    onChange={(e) => setNewTemplateCategory(e.target.value as any)}
                    className="clinical-input h-7 text-xs py-0 px-2"
                  >
                    <option value="greeting">Greeting</option>
                    <option value="reminder">Reminder</option>
                    <option value="reports">Reports</option>
                    <option value="followup">Follow-up</option>
                    <option value="custom">Health tip / Other</option>
                  </select>
                </div>

                <input
                  type="text"
                  required
                  placeholder="Template title (e.g. Blood pressure review reminder)"
                  value={newTemplateTitle}
                  onChange={(e) => setNewTemplateTitle(e.target.value)}
                  className="clinical-input w-full text-xs"
                />

                <textarea
                  required
                  rows={3}
                  placeholder="Message body. Available placeholders: {{patient_name}}, {{date}}, {{doctor_name}}, {{clinic_name}}"
                  value={newTemplateContent}
                  onChange={(e) => setNewTemplateContent(e.target.value)}
                  className="clinical-input w-full text-xs resize-none"
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddTemplate(false)}
                    className="btn-ghost text-xs h-7 px-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary text-xs h-7 px-3"
                  >
                    Save template
                  </button>
                </div>
              </form>
            )}

            {/* Vertical Radio-Style Template Cards */}
            <div className="space-y-2.5">
              {templates.map((tmpl) => {
                const isSelected = selectedTemplateId === tmpl.id;

                return (
                  <div
                    key={tmpl.id}
                    onClick={() => setSelectedTemplateId(tmpl.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#0F766E] bg-[#F0FDFA] shadow-xs'
                        : 'border-[#E2E8F0] hover:bg-[#F8FAFC] bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-[#0F766E] bg-[#0F766E]' : 'border-[#CBD5E1] bg-white'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                        </div>
                        <span className="font-semibold text-sm text-[#0F172A]">
                          {tmpl.title}
                        </span>
                      </div>

                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                        {getCategoryLabel(tmpl.category)}
                      </span>
                    </div>

                    <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed pl-6">
                      {renderTemplateContentWithChips(tmpl.content)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Custom Note Textarea with Character Count */}
          <div className="clinical-card p-4 sm:p-5 space-y-2 bg-white">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                3. Additional custom note (optional)
              </label>
              <span className={`text-xs tabular-nums ${
                customMessage.length > maxCustomChars ? 'text-[#B42318] font-semibold' : 'text-[#64748B]'
              }`}>
                {customMessage.length} / {maxCustomChars} characters
              </span>
            </div>

            <textarea
              rows={3}
              maxLength={maxCustomChars}
              placeholder="Add individualized notes, dosage reminders, or appointment notes to attach..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="clinical-input w-full text-sm resize-none"
            />
          </div>

          {/* Section 4: Dispatch Channel Segmented Control & Actions */}
          <div className="clinical-card p-4 sm:p-5 space-y-4 bg-white">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
                4. Dispatch channel
              </label>

              {/* Two-segment equal control */}
              <div className="grid grid-cols-2 p-1 bg-[#F1F5F9] rounded-lg border border-[#E2E8F0] gap-1">
                <button
                  type="button"
                  onClick={() => setChannel('wa_me')}
                  className={`py-2 text-xs font-medium rounded-md transition-all text-center ${
                    channel === 'wa_me'
                      ? 'bg-white text-[#0F766E] shadow-xs'
                      : 'text-[#475569] hover:text-[#0F172A]'
                  }`}
                >
                  Direct (WhatsApp web / app)
                </button>

                <button
                  type="button"
                  disabled={!isMetaCloudApiConfigured}
                  onClick={() => isMetaCloudApiConfigured && setChannel('cloud_api')}
                  title={
                    !isMetaCloudApiConfigured
                      ? 'Meta Cloud API is not configured in Clinic Settings'
                      : 'Automated background delivery via Meta Cloud API'
                  }
                  className={`py-2 text-xs font-medium rounded-md transition-all text-center relative ${
                    channel === 'cloud_api'
                      ? 'bg-white text-[#0F766E] shadow-xs'
                      : !isMetaCloudApiConfigured
                      ? 'text-[#64748B] cursor-not-allowed opacity-60'
                      : 'text-[#475569] hover:text-[#0F172A]'
                  }`}
                >
                  <span>Meta Cloud API</span>
                  {!isMetaCloudApiConfigured && (
                    <span className="text-[10px] ml-1 text-[#B54708] font-normal">(Not configured)</span>
                  )}
                </button>
              </div>

              {/* Explanatory one-line helper text */}
              <p className="text-xs text-[#64748B] mt-2">
                {channel === 'wa_me'
                  ? 'Opens WhatsApp application or web directly with pre-filled message.'
                  : 'Automated dispatch via Meta Business API directly to patient\'s device.'}
              </p>
            </div>

            {/* Actions: Primary Send on WhatsApp (one line) + Secondary Copy text */}
            <div className="pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleCopy}
                className="btn-secondary h-9 px-3.5 text-xs sm:text-sm"
                title="Copy rendered message text"
              >
                <Copy className="w-4 h-4 text-[#475569]" />
                <span>{isCopied ? 'Copied to clipboard' : 'Copy text'}</span>
              </button>

              <button
                onClick={handleSend}
                disabled={isSending || !selectedCustomer}
                className="btn-primary h-9 px-5 text-xs sm:text-sm font-medium"
                title="Send message on WhatsApp"
              >
                <WhatsAppGlyph className="w-4 h-4 text-white shrink-0" />
                <span>{isSending ? 'Sending…' : 'Send on WhatsApp'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Sticky Phone Preview (~40%, 5 cols) */}
        <div className={`lg:col-span-5 sticky top-20 ${mobileTab === 'preview' ? 'block' : 'hidden lg:block'}`}>
          <div className="clinical-card p-5 bg-[#F8FAFC] border border-[#E2E8F0] shadow-sm space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#0F766E]" />
                <span className="font-semibold text-sm text-[#0F172A]">Live preview</span>
              </div>
              <span className="text-xs text-[#64748B]">WhatsApp message</span>
            </div>

            {/* Realistic Clinical Chat Frame */}
            <div className="bg-[#EFEAE2] rounded-2xl p-3.5 border border-[#CBD5E1] shadow-inner min-h-[380px] flex flex-col justify-between">
              
              {/* WhatsApp Chat Header */}
              <div className="bg-[#075E54] text-white px-3 py-2 rounded-xl flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-semibold">
                    VH
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{clinicName}</p>
                    <p className="text-[10px] text-white/80 truncate">Official Clinical Channel</p>
                  </div>
                </div>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white font-mono">
                  Encrypted
                </span>
              </div>

              {/* Chat Message Bubble */}
              <div className="my-3 flex justify-start">
                <div className="bg-white rounded-2xl rounded-tl-xs p-3.5 max-w-[92%] shadow-sm text-xs text-[#0F172A] space-y-2 border border-[#E2E8F0]">
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {previewMessage || 'Select a patient and template to preview message content...'}
                  </p>

                  <div className="flex items-center justify-end gap-1 text-[10px] text-[#64748B] tabular-nums pt-1 border-t border-[#F1F5F9]">
                    <span>{formatTime(new Date())}</span>
                    <CheckCheck className="w-3.5 h-3.5 text-[#175CD3]" />
                  </div>
                </div>
              </div>

              {/* Chat Input Placeholder */}
              <div className="bg-white px-3 py-2 rounded-full border border-[#CBD5E1] text-[11px] text-[#64748B] flex items-center justify-between">
                <span>Message preview only</span>
                <Send className="w-3.5 h-3.5 text-[#64748B]" />
              </div>

            </div>

            {/* Recipient verification note */}
            <div className="text-xs text-[#64748B] flex items-center justify-between pt-1">
              <span>Recipient: <strong className="text-[#0F172A]">{selectedCustomer?.name || 'Patient'}</strong></span>
              <span className="tabular-nums">{formatPhone(selectedCustomer?.phone)}</span>
            </div>

          </div>
        </div>

      </div>

      {/* Mobile Sticky Send Bottom Bar (<lg only, min 44px touch targets) */}
      <div className="lg:hidden fixed bottom-[58px] left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] p-3 shadow-lg flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setMobileTab(mobileTab === 'compose' ? 'preview' : 'compose')}
          className="btn-secondary min-h-[44px] px-3.5 text-xs font-medium"
        >
          <Smartphone className="w-4 h-4 mr-1.5 text-[#0F766E]" />
          <span>{mobileTab === 'compose' ? 'Preview' : 'Edit'}</span>
        </button>

        <button
          onClick={handleSend}
          disabled={isSending || !selectedCustomer}
          className="btn-primary min-h-[44px] flex-1 justify-center text-xs font-medium"
        >
          <WhatsAppGlyph className="w-4 h-4 text-white mr-1.5" />
          <span>{isSending ? 'Sending…' : 'Send on WhatsApp'}</span>
        </button>
      </div>

      {/* Recent Dispatches Table */}
      <div className="clinical-card p-0 overflow-hidden bg-white border border-[#E2E8F0] shadow-xs">
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#0F766E]" />
            <h3 className="text-base font-semibold leading-6 text-[#0F172A]">
              Recent dispatches ({whatsappLogs.length})
            </h3>
          </div>
        </div>

        {whatsappLogs.length === 0 ? (
          <div className="p-10 text-center">
            <MessageSquare className="w-8 h-8 text-[#64748B] mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-[#0F172A]">No messages sent yet</h4>
            <p className="text-xs text-[#64748B] mt-0.5">Dispatched WhatsApp logs will be archived here.</p>
            <button
              onClick={() => {
                setMobileTab('compose');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="btn-secondary text-xs mt-3 min-h-[36px]"
            >
              Compose message
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-[#F8FAFC] text-[#64748B] text-xs font-medium uppercase tracking-wider border-b border-[#E2E8F0]">
                <tr>
                  <th className="py-2.5 px-4 font-medium whitespace-nowrap">Patient</th>
                  <th className="py-2.5 px-4 font-medium whitespace-nowrap">Template</th>
                  <th className="py-2.5 px-4 font-medium whitespace-nowrap">Channel</th>
                  <th className="py-2.5 px-4 font-medium whitespace-nowrap">Sent at</th>
                  <th className="py-2.5 px-4 font-medium whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] bg-white">
                {whatsappLogs.slice(0, 10).map((log) => (
                  <tr key={log.id} className="hover:bg-[#F8FAFC] text-xs transition-colors">
                    <td className="py-3 px-4 font-medium text-[#0F172A] whitespace-nowrap">
                      <div>{log.customerName}</div>
                      <div className="text-[11px] text-[#64748B] tabular-nums font-normal">
                        {formatPhone(log.phone)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#475569] whitespace-nowrap">
                      {log.templateTitle || 'Direct'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="badge-neutral tabular-nums text-[11px]">
                        {log.channel === 'cloud_api' ? 'Meta Cloud API' : 'Direct Link'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#64748B] tabular-nums whitespace-nowrap">
                      {formatDate(log.sentAt)} {formatTime(log.sentAt)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="badge-success">
                        <span className="dot-success w-1.5 h-1.5" />
                        <span className="capitalize">{log.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
