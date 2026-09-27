import { db } from '../db/dexie.ts';
import { syncEngine } from './syncEngine.ts';
import type { Customer, WhatsAppLog, WhatsAppTemplate } from '../types/index.ts';

// Clean and normalize phone number for WhatsApp wa.me links
export function normalizePhoneForWhatsApp(rawPhone: string): string {
  let cleaned = rawPhone.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }
  // Default to India country code 91 if 10-digit number is provided
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  return cleaned;
}

// Replace template placeholders like {{patient_name}}, {{date}}, {{clinic_name}}
export function renderTemplate(
  templateContent: string,
  variables: {
    patient_name?: string;
    date?: string;
    clinic_name?: string;
    doctor_name?: string;
    notes?: string;
  }
): string {
  let result = templateContent;
  result = result.replace(/\{\{\s*patient_name\s*\}\}/gi, variables.patient_name || 'Patient');
  result = result.replace(/\{\{\s*name\s*\}\}/gi, variables.patient_name || 'Patient');
  result = result.replace(/\{\{\s*date\s*\}\}/gi, variables.date || 'today');
  result = result.replace(/\{\{\s*clinic_name\s*\}\}/gi, variables.clinic_name || 'Vrindavan Healthcare');
  result = result.replace(/\{\{\s*doctor_name\s*\}\}/gi, variables.doctor_name || 'Dr. Vrindavan');
  result = result.replace(/\{\{\s*notes\s*\}\}/gi, variables.notes || '');
  return result;
}

// Generate direct wa.me URL
export function generateWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = normalizePhoneForWhatsApp(phone);
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

// Dispatch WhatsApp message and log to database
export async function sendWhatsAppMessage({
  customer,
  message,
  templateTitle,
  channel = 'wa_me',
}: {
  customer: Customer;
  message: string;
  templateTitle?: string;
  channel?: 'wa_me' | 'cloud_api';
}): Promise<{ success: boolean; link?: string; message: string }> {
  try {
    const cleanPhone = normalizePhoneForWhatsApp(customer.phone);
    const link = generateWhatsAppLink(customer.phone, message);

    if (channel === 'wa_me') {
      // Open WhatsApp web or native mobile app
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      // Optional Meta Cloud API
      const settings = await db.settings.get('clinic-settings');
      if (settings?.whatsappPhoneId && settings?.whatsappToken) {
        try {
          await fetch(`https://graph.facebook.com/v19.0/${settings.whatsappPhoneId}/messages`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${settings.whatsappToken}`,
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              to: cleanPhone,
              type: 'text',
              text: { body: message },
            }),
          });
        } catch (apiErr) {
          console.warn('Cloud API call failed, opened web link fallback:', apiErr);
          window.open(link, '_blank', 'noopener,noreferrer');
        }
      } else {
        window.open(link, '_blank', 'noopener,noreferrer');
      }
    }

    // Log the sent message
    const logItem: WhatsAppLog = {
      id: 'walog-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      customerId: customer.id,
      customerName: customer.name,
      phone: customer.phone,
      templateTitle: templateTitle || 'Direct Message',
      messageBody: message,
      channel,
      status: 'sent',
      sentAt: new Date().toISOString(),
    };

    await db.whatsappLogs.add(logItem);

    // Update customer last contact and whatsappStatus
    const updatedCustomer: Partial<Customer> = {
      lastContact: new Date().toISOString(),
      whatsappStatus: 'sent',
      updatedAt: new Date().toISOString(),
    };

    await db.customers.update(customer.id, updatedCustomer);

    // Queue update for PostgreSQL sync
    await syncEngine.queueChange('customer', customer.id, 'UPDATE', {
      ...customer,
      ...updatedCustomer,
    });

    return {
      success: true,
      link,
      message: `WhatsApp message triggered for ${customer.name}.`,
    };
  } catch (error: any) {
    console.error('Error dispatching WhatsApp message:', error);
    return {
      success: false,
      message: error?.message || 'Failed to dispatch WhatsApp message.',
    };
  }
}
