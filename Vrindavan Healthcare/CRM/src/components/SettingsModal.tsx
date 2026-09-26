import React, { useState, useEffect } from 'react';
import { 
  X, 
  Settings, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Upload, 
  Copy, 
  RefreshCw, 
  Trash2
} from 'lucide-react';
import { db } from '../db/dexie.ts';
import { testSupabaseConnection } from '../services/supabaseClient.ts';
import { exportDatabaseBackupJSON, importDatabaseBackupJSON } from '../services/exportImport.ts';
import type { ClinicSettings } from '../types/index.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsSaved: () => void;
  onShowToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSettingsSaved,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'clinic' | 'database' | 'backup' | 'advanced'>('clinic');
  const [clinicName, setClinicName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [whatsappPhoneId, setWhatsappPhoneId] = useState('');
  const [whatsappToken, setWhatsappToken] = useState('');

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSettings();
      setTestResult(null);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const loadSettings = async () => {
    const s = await db.settings.get('clinic-settings');
    if (s) {
      setClinicName(s.clinicName || 'Vrindavan Healthcare');
      setDoctorName(s.doctorName || 'Dr. Vrindavan');
      setPhone(s.phone || '+91 9876543210');
      setEmail(s.email || 'care@vrindavanhealthcare.in');
      setAddress(s.address || 'Vrindavan Healthcare Clinic, Mathura / Vrindavan');
      setSupabaseUrl(s.supabaseUrl || '');
      setSupabaseAnonKey(s.supabaseAnonKey || '');
      setWhatsappPhoneId(s.whatsappPhoneId || '');
      setWhatsappToken(s.whatsappToken || '');
    }
  };

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const updated: ClinicSettings = {
        id: 'clinic-settings',
        clinicName: clinicName.trim(),
        doctorName: doctorName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        supabaseUrl: supabaseUrl.trim(),
        supabaseAnonKey: supabaseAnonKey.trim(),
        whatsappPhoneId: whatsappPhoneId.trim(),
        whatsappToken: whatsappToken.trim(),
      };
      await db.settings.put(updated);
      onShowToast('Settings saved successfully.', 'success');
      onSettingsSaved();
      onClose();
    } catch (err: any) {
      onShowToast('Failed to save settings: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      setTestResult({
        success: false,
        message: 'Please enter both Supabase URL and Anon Key.',
      });
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    const res = await testSupabaseConnection(supabaseUrl, supabaseAnonKey);
    setTestResult(res);
    setIsTesting(false);
  };

  const handleCopySql = () => {
    const sqlSchema = `-- Vrindavan Healthcare PostgreSQL Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    doctor_assigned VARCHAR(255) DEFAULT 'Dr. Vrindavan Healthcare',
    category VARCHAR(100) DEFAULT 'General Consultation',
    last_contact TIMESTAMPTZ,
    next_follow_up TIMESTAMPTZ,
    follow_up_status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    whatsapp_status VARCHAR(50) DEFAULT 'none',
    sync_status VARCHAR(50) DEFAULT 'synced',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.followups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    reminder_sent BOOLEAN DEFAULT false,
    sync_status VARCHAR(50) DEFAULT 'synced',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.whatsapp_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    template_title VARCHAR(150),
    message_body TEXT NOT NULL,
    channel VARCHAR(50) DEFAULT 'wa_me',
    status VARCHAR(50) DEFAULT 'sent',
    sent_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public anon access for CRM" ON public.customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public anon access for Followups" ON public.followups FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public anon access for Logs" ON public.whatsapp_logs FOR ALL USING (true) WITH CHECK (true);`;

    navigator.clipboard.writeText(sqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
    onShowToast('PostgreSQL schema copied to clipboard.', 'success');
  };



  const handleResetDatabase = async () => {
    if (confirm('CAUTION: Are you sure you want to clear all local records? Make sure to download a backup first.')) {
      await db.customers.clear();
      await db.followups.clear();
      await db.syncQueue.clear();
      await db.whatsappLogs.clear();
      onShowToast('Local database cleared.', 'info');
      onSettingsSaved();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await importDatabaseBackupJSON(file);
    if (res.success) {
      onShowToast(res.message, 'success');
      onSettingsSaved();
    } else {
      onShowToast(res.message, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-t-2xl sm:rounded-xl max-w-xl w-full border border-[#E2E8F0] shadow-xl overflow-hidden my-0 sm:my-8 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        
        {/* Mobile Handle */}
        <div className="sm:hidden w-10 h-1 bg-[#CBD5E1] rounded-full mx-auto mt-2.5 -mb-1" />

        {/* Header */}
        <div className="bg-[#F8FAFC] p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F0FDFA] border border-[#0F766E]/20 flex items-center justify-center text-[#0F766E]">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold leading-6 text-[#0F172A]">Settings & database</h2>
              <p className="text-xs text-[#64748B] mt-0.5 leading-4">Clinic configuration, cloud backup, and messaging setup</p>
            </div>
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

        {/* Tabs */}
        <div className="flex border-b border-[#E2E8F0] bg-white px-5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('clinic')}
            className={`py-3 px-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'clinic'
                ? 'border-[#0F766E] text-[#0F766E]'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Clinic details
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`py-3 px-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'database'
                ? 'border-[#0F766E] text-[#0F766E]'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Cloud credentials
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`py-3 px-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'backup'
                ? 'border-[#0F766E] text-[#0F766E]'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Data backup
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`py-3 px-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'advanced'
                ? 'border-[#0F766E] text-[#0F766E]'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Advanced (SQL)
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6 max-h-[65vh] overflow-y-auto space-y-4">
          
          {/* TAB 1: CLINIC */}
          {activeTab === 'clinic' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#475569] uppercase tracking-wider mb-1.5">
                  Clinic brand name
                </label>
                <input
                  type="text"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="clinical-input w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#475569] uppercase tracking-wider mb-1.5">
                  Attending doctor / team
                </label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="clinical-input w-full"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#475569] uppercase tracking-wider mb-1.5">
                    Contact phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="clinical-input w-full tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#475569] uppercase tracking-wider mb-1.5">
                    Official email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="clinical-input w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#475569] uppercase tracking-wider mb-1.5">
                  Clinic address
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 text-sm bg-white border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:ring-offset-1 resize-none text-[#0F172A]"
                />
              </div>
            </div>
          )}

          {/* TAB 2: DATABASE */}
          {activeTab === 'database' && (
            <div className="space-y-4">
              <div className="bg-[#F0FDFA] border border-[#0F766E]/20 p-3 rounded-lg text-xs text-[#0F766E] leading-relaxed">
                Connect the CRM to your Supabase PostgreSQL instance. All offline writes in IndexedDB sync automatically with this database.
              </div>

              <div>
                <label className="block text-xs font-medium text-[#475569] uppercase tracking-wider mb-1.5">
                  Supabase project URL
                </label>
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="clinical-input w-full tabular-nums text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#475569] uppercase tracking-wider mb-1.5">
                  Supabase anon public key
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseAnonKey}
                  onChange={(e) => setSupabaseAnonKey(e.target.value)}
                  className="clinical-input w-full tabular-nums text-xs"
                />
              </div>

              {/* Test Button & Result */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="btn-secondary h-8 text-xs px-3"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>{isTesting ? 'Testing...' : 'Test connection'}</span>
                </button>
              </div>

              {testResult && (
                <div
                  className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${
                    testResult.success
                      ? 'badge-success'
                      : 'badge-danger'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-[#067647] shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-[#B42318] shrink-0 mt-0.5" />
                  )}
                  <span>{testResult.message}</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BACKUP */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-2">
                <h4 className="text-xs font-medium text-[#0F172A] uppercase tracking-wider">
                  Offline database export
                </h4>
                <p className="text-xs text-[#64748B]">
                  Download a full snapshot of all registered patients, follow-ups, and logs in JSON format for offline backup.
                </p>
                <button
                  type="button"
                  onClick={() => exportDatabaseBackupJSON()}
                  className="btn-secondary text-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#475569]" />
                  <span>Download JSON backup</span>
                </button>
              </div>

              <div className="p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-2">
                <h4 className="text-xs font-medium text-[#0F172A] uppercase tracking-wider">
                  Restore from JSON backup
                </h4>
                <p className="text-xs text-[#64748B]">
                  Restore previously exported patient records from a JSON file.
                </p>
                <label className="btn-secondary text-xs cursor-pointer inline-flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-[#475569]" />
                  <span>Select backup file</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleResetDatabase}
                  className="btn-ghost text-xs text-[#B42318] hover:text-[#912018]"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  <span>Clear local database</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: ADVANCED (SQL) */}
          {activeTab === 'advanced' && (
            <div className="space-y-4">
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#0F172A]">PostgreSQL DDL Schema</div>
                  <div className="text-xs text-[#64748B] mt-0.5">Tables, constraints, indexes & RLS security policies</div>
                </div>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="btn-secondary h-8 text-xs px-3"
                >
                  <Copy className="w-3.5 h-3.5 text-[#475569]" />
                  <span>{copiedSql ? 'Copied' : 'Copy DDL'}</span>
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#475569] uppercase tracking-wider">
                  PostgreSQL Table Definitions (customers, followups, whatsapp_logs)
                </label>
                <pre className="p-3 bg-[#0F172A] text-slate-200 rounded-lg text-[11px] font-mono leading-relaxed overflow-x-auto max-h-56 select-all border border-slate-800">
                  {`-- Vrindavan Healthcare PostgreSQL Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    doctor_assigned VARCHAR(255) DEFAULT 'Dr. Vrindavan Healthcare',
    category VARCHAR(100) DEFAULT 'General Consultation',
    last_contact TIMESTAMPTZ,
    next_follow_up TIMESTAMPTZ,
    follow_up_status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    whatsapp_status VARCHAR(50) DEFAULT 'none',
    sync_status VARCHAR(50) DEFAULT 'synced',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.followups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    reminder_sent BOOLEAN DEFAULT false,
    sync_status VARCHAR(50) DEFAULT 'synced',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.whatsapp_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    template_title VARCHAR(150),
    message_body TEXT NOT NULL,
    channel VARCHAR(50) DEFAULT 'wa_me',
    status VARCHAR(50) DEFAULT 'sent',
    sent_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public anon access for CRM" ON public.customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public anon access for Followups" ON public.followups FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public anon access for Logs" ON public.whatsapp_logs FOR ALL USING (true) WITH CHECK (true);`}
                </pre>
              </div>

              <div className="p-3 bg-[#FEF3F2] border border-[#B42318]/20 rounded-lg text-xs text-[#B42318] leading-relaxed">
                <strong>Admin Notice:</strong> Execute the schema above once in your Supabase SQL Editor prior to enabling cloud synchronization.
              </div>
            </div>
          )}

        </div>

        {/* Footer (Touch targets min 44px on mobile) */}
        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary min-h-[44px] sm:min-h-[36px] px-4 text-xs sm:text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary min-h-[44px] sm:min-h-[36px] px-4 text-xs sm:text-sm"
          >
            {isSaving ? 'Saving...' : 'Save settings'}
          </button>
        </div>

      </div>
    </div>
  );
};
