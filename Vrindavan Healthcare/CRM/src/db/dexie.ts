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

// Realistic Clinic Initial Patients Seed
export const DEFAULT_PATIENTS: Customer[] = [
  {
    id: 'cust-101',
    name: 'Rajesh Sharma',
    phone: '+919876543210',
    email: 'rajesh.sharma@example.com',
    category: 'General Medicine & Hypertension',
    doctorAssigned: 'Dr. Vrindavan',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    lastContact: new Date(Date.now() - 2 * 86400000).toISOString(),
    nextFollowUp: new Date(Date.now()).toISOString().split('T')[0], // Today!
    followUpStatus: 'pending',
    notes: 'BP was 140/90. Started Telmisartan 40mg. Follow-up today for BP check and lifestyle review.',
    whatsappStatus: 'sent',
    syncStatus: 'synced',
  },
  {
    id: 'cust-102',
    name: 'Sunita Verma',
    phone: '+919811223344',
    email: 'sunita.v@example.com',
    category: 'Gastroenterology',
    doctorAssigned: 'Dr. Vrindavan',
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    lastContact: new Date(Date.now() - 4 * 86400000).toISOString(),
    nextFollowUp: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], // Overdue!
    followUpStatus: 'pending',
    notes: 'Complaining of acid reflux and bloating. Ultrasound abdomen suggested. Need to check if test was completed.',
    whatsappStatus: 'delivered',
    syncStatus: 'synced',
  },
  {
    id: 'cust-103',
    name: 'Amit Patel',
    phone: '+919723456789',
    email: 'amit.patel92@example.com',
    category: 'Routine Health Checkup',
    doctorAssigned: 'Dr. Vrindavan',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    lastContact: new Date(Date.now() - 3 * 86400000).toISOString(),
    nextFollowUp: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], // Upcoming
    followUpStatus: 'scheduled',
    notes: 'Annual executive blood profile. Fasting glucose normal (94). Lipids slightly elevated. Diet counseling required.',
    whatsappStatus: 'read',
    syncStatus: 'synced',
  },
  {
    id: 'cust-104',
    name: 'Pooja Agarwal',
    phone: '+919899001122',
    email: 'pooja.agarwal@example.com',
    category: 'Dermatology & Skin Care',
    doctorAssigned: 'Dr. Vrindavan',
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    lastContact: new Date(Date.now() - 1 * 86400000).toISOString(),
    nextFollowUp: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    followUpStatus: 'scheduled',
    notes: 'Prescribed topical retinoid cream. Patient responded well. Follow-up after 1 week to evaluate skin redness.',
    whatsappStatus: 'delivered',
    syncStatus: 'synced',
  },
  {
    id: 'cust-105',
    name: 'Harish Chandra Gupta',
    phone: '+919818877665',
    email: 'harish.gupta@example.com',
    category: 'Diabetes Care',
    doctorAssigned: 'Dr. Vrindavan',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    lastContact: new Date(Date.now() - 5 * 86400000).toISOString(),
    nextFollowUp: new Date(Date.now()).toISOString().split('T')[0], // Today!
    followUpStatus: 'contacted',
    notes: 'HbA1c was 7.4%. Metformin dose adjusted. Advised morning walking and sugar log review.',
    whatsappStatus: 'read',
    syncStatus: 'synced',
  },
  {
    id: 'cust-106',
    name: 'Meenakshi Iyer',
    phone: '+919944556677',
    email: 'meenakshi.iyer@example.com',
    category: 'Ophthalmology & Eye Check',
    doctorAssigned: 'Dr. Vrindavan',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    lastContact: new Date(Date.now() - 7 * 86400000).toISOString(),
    nextFollowUp: null,
    followUpStatus: 'completed',
    notes: 'Refraction done. New spectacles prescribed. Patient reported vision clarity resolved.',
    whatsappStatus: 'sent',
    syncStatus: 'synced',
  }
];

export const DEFAULT_FOLLOWUPS: FollowUp[] = [
  {
    id: 'fol-201',
    customerId: 'cust-101',
    customerName: 'Rajesh Sharma',
    customerPhone: '+919876543210',
    date: new Date(Date.now()).toISOString().split('T')[0],
    status: 'pending',
    notes: 'BP re-check after 5 days of starting Telmisartan.',
    reminderSent: false,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    syncStatus: 'synced',
  },
  {
    id: 'fol-202',
    customerId: 'cust-102',
    customerName: 'Sunita Verma',
    customerPhone: '+919811223344',
    date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
    status: 'pending',
    notes: 'Call patient to check if Ultrasound scan reports are ready.',
    reminderSent: true,
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    syncStatus: 'synced',
  },
  {
    id: 'fol-203',
    customerId: 'cust-105',
    customerName: 'Harish Chandra Gupta',
    customerPhone: '+919818877665',
    date: new Date(Date.now()).toISOString().split('T')[0],
    status: 'pending',
    notes: 'Review fasting blood sugar log and insulin sensitivity.',
    reminderSent: true,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    syncStatus: 'synced',
  },
  {
    id: 'fol-204',
    customerId: 'cust-103',
    customerName: 'Amit Patel',
    customerPhone: '+919723456789',
    date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    status: 'pending',
    notes: 'Discuss lipid panel results and dietary modification plan.',
    reminderSent: false,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    syncStatus: 'synced',
  },
  {
    id: 'fol-205',
    customerId: 'cust-104',
    customerName: 'Pooja Agarwal',
    customerPhone: '+919899001122',
    date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    status: 'pending',
    notes: 'Check skin tolerance to topical gel application.',
    reminderSent: false,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    syncStatus: 'synced',
  },
  {
    id: 'fol-206',
    customerId: 'cust-106',
    customerName: 'Meenakshi Iyer',
    customerPhone: '+919944556677',
    date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
    status: 'completed',
    notes: 'Refraction & new spectacles prescribed. Patient confirmed clear vision; consultation completed.',
    reminderSent: true,
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    syncStatus: 'synced',
  }
];

export const DEFAULT_SETTINGS: ClinicSettings = {
  id: 'clinic-settings',
  clinicName: 'Vrindavan Healthcare',
  doctorName: 'Dr. Vrindavan Healthcare Team',
  phone: '+919876543210',
  email: 'care@vrindavanhealthcare.in',
  address: 'Vrindavan Healthcare Clinic, Main Medical Road, Mathura / Vrindavan, UP',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  whatsappPhoneId: import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID || '',
  whatsappToken: import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN || '',
};

// Seed database on first load if empty
export async function initializeDatabase() {
  try {
    const patientCount = await db.customers.count();
    if (patientCount === 0) {
      await db.customers.bulkAdd(DEFAULT_PATIENTS);
      await db.followups.bulkAdd(DEFAULT_FOLLOWUPS);
      await db.templates.bulkAdd(DEFAULT_TEMPLATES);
      await db.settings.put(DEFAULT_SETTINGS);
      console.log('IndexedDB seeded with default Vrindavan Healthcare clinical data.');
    } else {
      // Ensure fol-206 completed task exists for Meenakshi Iyer
      const fol206 = await db.followups.get('fol-206');
      if (!fol206) {
        const defaultFol206 = DEFAULT_FOLLOWUPS.find((f) => f.id === 'fol-206');
        if (defaultFol206) {
          await db.followups.put(defaultFol206);
        }
      }

      // Ensure templates exist
      const templateCount = await db.templates.count();
      if (templateCount === 0) {
        await db.templates.bulkAdd(DEFAULT_TEMPLATES);
      }
      // Ensure settings exist
      const settings = await db.settings.get('clinic-settings');
      if (!settings) {
        await db.settings.put(DEFAULT_SETTINGS);
      }
    }
  } catch (error) {
    console.error('Error initializing IndexedDB:', error);
  }
}
