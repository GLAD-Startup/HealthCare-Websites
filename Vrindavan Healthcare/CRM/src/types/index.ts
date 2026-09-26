export type FollowUpStatus = 'pending' | 'contacted' | 'completed' | 'cancelled' | 'scheduled';
export type WhatsAppStatus = 'none' | 'opted_in' | 'sent' | 'delivered' | 'read' | 'failed';
export type SyncStatus = 'synced' | 'pending' | 'error';
export type OperationType = 'CREATE' | 'UPDATE' | 'DELETE';
export type SyncEntity = 'customer' | 'followup' | 'template';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  doctorAssigned?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  lastContact: string | null;
  nextFollowUp: string | null;
  followUpStatus: FollowUpStatus;
  notes: string;
  whatsappStatus: WhatsAppStatus;
  syncStatus: SyncStatus;
}

export interface FollowUp {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  date: string;
  status: 'pending' | 'completed' | 'rescheduled' | 'cancelled';
  notes: string;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
  syncStatus: SyncStatus;
}

export interface SyncQueueItem {
  id: string;
  entity: SyncEntity;
  entityId: string;
  operation: OperationType;
  payload: any;
  createdAt: string;
  retryCount: number;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  errorMessage?: string;
}

export interface WhatsAppTemplate {
  id: string;
  title: string;
  category: 'greeting' | 'followup' | 'reminder' | 'reports' | 'custom';
  content: string;
  variables: string[];
  isActive: boolean;
}

export interface WhatsAppLog {
  id: string;
  customerId?: string;
  customerName: string;
  phone: string;
  templateTitle?: string;
  messageBody: string;
  channel: 'wa_me' | 'cloud_api';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  sentAt: string;
}

export interface ClinicSettings {
  id?: string;
  clinicName: string;
  doctorName: string;
  phone: string;
  email: string;
  address: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  whatsappPhoneId?: string;
  whatsappToken?: string;
  lastSyncTimestamp?: string;
}
