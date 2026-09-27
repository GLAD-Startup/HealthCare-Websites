import { db } from '../db/dexie.ts';
import type { Customer, FollowUp } from '../types/index.ts';

// Export customers to CSV
export async function exportCustomersToCSV(): Promise<void> {
  const customers = await db.customers.toArray();
  if (customers.length === 0) {
    alert('No customer records to export.');
    return;
  }

  const headers = [
    'ID',
    'Name',
    'Phone',
    'Email',
    'Category',
    'Doctor',
    'Follow-up Status',
    'Next Follow-up',
    'Last Contact',
    'Notes',
    'WhatsApp Status',
    'Created At',
  ];

  const rows = customers.map((c) => [
    `"${c.id}"`,
    `"${c.name.replace(/"/g, '""')}"`,
    `"${c.phone}"`,
    `"${c.email || ''}"`,
    `"${(c.category || '').replace(/"/g, '""')}"`,
    `"${(c.doctorAssigned || '').replace(/"/g, '""')}"`,
    `"${c.followUpStatus}"`,
    `"${c.nextFollowUp || ''}"`,
    `"${c.lastContact || ''}"`,
    `"${(c.notes || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    `"${c.whatsappStatus}"`,
    `"${c.createdAt}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vrindavan_healthcare_patients_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// Export complete IndexedDB database backup to JSON
export async function exportDatabaseBackupJSON(): Promise<void> {
  const customers = await db.customers.toArray();
  const followups = await db.followups.toArray();
  const templates = await db.templates.toArray();
  const whatsappLogs = await db.whatsappLogs.toArray();
  const settings = await db.settings.toArray();

  const backupData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    clinic: 'Vrindavan Healthcare',
    data: {
      customers,
      followups,
      templates,
      whatsappLogs,
      settings,
    },
  };

  const jsonString = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vrindavan_crm_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Import JSON database backup
export async function importDatabaseBackupJSON(file: File): Promise<{ success: boolean; message: string }> {
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);

    if (!parsed.data || !Array.isArray(parsed.data.customers)) {
      return { success: false, message: 'Invalid backup file format.' };
    }

    if (parsed.data.customers?.length > 0) {
      await db.customers.bulkPut(parsed.data.customers);
    }
    if (parsed.data.followups?.length > 0) {
      await db.followups.bulkPut(parsed.data.followups);
    }
    if (parsed.data.templates?.length > 0) {
      await db.templates.bulkPut(parsed.data.templates);
    }

    return {
      success: true,
      message: `Imported ${parsed.data.customers.length} patients and ${parsed.data.followups?.length || 0} follow-ups successfully!`,
    };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to parse JSON backup file.' };
  }
}
