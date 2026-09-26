import Dexie, { type Table } from 'dexie';
import type { Customer, FollowUp, SyncQueueItem, WhatsAppTemplate, WhatsAppLog, ClinicSettings } from '../types/index.ts';

export class VrindavanCRMDatabase extends Dexie {
  customers!: Table<Customer, string>;
  followups!: Table<FollowUp, string>;
  syncQueue!: Table<SyncQueueItem, string>;
  templates!: Table<WhatsAppTemplate, string>;
  whatsappLogs!: Table<WhatsAppLog, string>;
  settings!: Table<ClinicSettings, string>;

  constructor() {
    super('vrindavan_healthcare_crm');
    this.version(1).stores({
      customers: 'id, name, phone, followUpStatus, nextFollowUp, syncStatus, createdAt',
      followups: 'id, customerId, customerName, date, status, syncStatus',
      syncQueue: 'id, entity, entityId, operation, status, createdAt',
      templates: 'id, title, category, isActive',
      whatsappLogs: 'id, customerId, phone, sentAt, status',
      settings: 'id'
    });
  }
}

export const db = new VrindavanCRMDatabase();

// Default WhatsApp Templates for clinic
export const DEFAULT_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'tmpl-1',
    title: 'Welcome & Patient Greeting',
    category: 'greeting',
    content: 'Namaste {{patient_name}} ji! Welcome to Vrindavan Healthcare. We are committed to providing you with gentle, comprehensive care. If you need any medical advice or wish to consult the doctor, feel free to reply directly here. Wishing you vibrant health! - Dr. Vrindavan Healthcare',
    variables: ['patient_name'],
    isActive: true,
  },
  {
    id: 'tmpl-2',
    title: 'Consultation & Recovery Follow-up',
    category: 'followup',
    content: 'Namaste {{patient_name}} ji, this is Dr. Vrindavan Healthcare following up on your recent consultation. How are your symptoms progressing? Please ensure you are taking your prescribed medications on schedule. If you have any discomfort, please reply to this message.',
    variables: ['patient_name'],
    isActive: true,
  },
  {
    id: 'tmpl-3',
    title: 'Follow-up Consultation Reminder',
    category: 'reminder',
    content: 'Dear {{patient_name}}, this is a friendly reminder from Vrindavan Healthcare for your scheduled follow-up on {{date}}. Please confirm your visit or let us know if you need to reschedule to a convenient time.',
    variables: ['patient_name', 'date'],
    isActive: true,
  },
  {
    id: 'tmpl-4',
    title: 'Lab & Diagnostic Reports Ready',
    category: 'reports',
    content: 'Namaste {{patient_name}}, your clinical diagnostic test reports have arrived and have been reviewed by the doctor at Vrindavan Healthcare. You can collect your reports or discuss next steps with us.',
    variables: ['patient_name'],
    isActive: true,
  },
  {
    id: 'tmpl-5',
    title: 'Hydration & Seasonal Health Tip',
    category: 'custom',
    content: 'Good day {{patient_name}} ji! A quick seasonal wellness note from Vrindavan Healthcare: Stay hydrated, maintain balanced nutrition, and take regular 15-minute brisk walks. Take care of your health today!',
    variables: ['patient_name'],
    isActive: true,
  },
];

export const DEFAULT_SETTINGS: ClinicSettings = {
  id: 'clinic-settings',
  clinicName: 'Vrindavan Healthcare',
  doctorName: 'Dr. Vrindavan Healthcare Team',
  phone: '+919876543210',
  email: 'care@vrindavanhealthcare.in',
  address: 'Vrindavan Healthcare Clinic, Main Medical Road, Mathura / Vrindavan, UP',
  apiUrl: (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api',
  whatsappPhoneId: (import.meta as any).env?.VITE_WHATSAPP_PHONE_NUMBER_ID || '',
  whatsappToken: (import.meta as any).env?.VITE_WHATSAPP_ACCESS_TOKEN || '',
};

// Initialize database with clean state (no hardcoded patients)
export async function initializeDatabase() {
  try {
    // Purge any previously seeded demo patients & follow-ups from local IndexedDB
    const demoCustomers = await db.customers.filter((c) => 
      c.id.startsWith('cust-10') || (Boolean(c.email) && c.email!.includes('example.com'))
    ).toArray();
    if (demoCustomers.length > 0) {
      await db.customers.bulkDelete(demoCustomers.map((c) => c.id));
    }

    const demoFollowups = await db.followups.filter((f) => 
      f.id.startsWith('fol-20')
    ).toArray();
    if (demoFollowups.length > 0) {
      await db.followups.bulkDelete(demoFollowups.map((f) => f.id));
    }

    // Ensure communication templates exist
    const templateCount = await db.templates.count();
    if (templateCount === 0) {
      await db.templates.bulkAdd(DEFAULT_TEMPLATES);
    }

    // Ensure clinic settings exist
    const settings = await db.settings.get('clinic-settings');
    if (!settings) {
      await db.settings.put(DEFAULT_SETTINGS);
    }
  } catch (error) {
    console.error('Error initializing IndexedDB:', error);
  }
}
