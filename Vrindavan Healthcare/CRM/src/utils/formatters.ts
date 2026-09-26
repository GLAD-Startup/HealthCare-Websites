/**
 * Shared Formatting Utilities for Vrindavan Healthcare CRM
 * Enforces consistent date, time, phone, patient ID, and currency/counter representations.
 */

/**
 * Format a date string or timestamp into standard clinical date: "26 Sep 2026"
 */
export function formatDate(input: string | Date | null | undefined): string {
  if (!input) return '';
  const date = typeof input === 'string' ? new Date(input.includes('T') ? input : `${input}T00:00:00`) : input;
  if (isNaN(date.getTime())) return '';

  const day = date.getDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

/**
 * Format a time string or timestamp into standard clinical format: "1:25 am"
 */
export function formatTime(input: string | Date | null | undefined): string {
  if (!input) return '';
  const date = typeof input === 'string' ? new Date(input) : input;
  if (isNaN(date.getTime())) return '';

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 hour is 12

  return `${hours}:${minutes} ${ampm}`;
}

/**
 * Format full date and time: "26 Sep 2026, 1:25 am"
 */
export function formatDateTime(input: string | Date | null | undefined): string {
  if (!input) return '';
  const d = formatDate(input);
  const t = formatTime(input);
  if (!d) return '';
  return t ? `${d}, ${t}` : d;
}

/**
 * Determine urgency and relative due text for a follow-up date.
 * Calendar-day based comparison:
 * - Overdue: date < today -> "Overdue · 2 days" or "Overdue · 1 day"
 * - Due today: date == today -> "Due today"
 * - Upcoming: date > today -> "Tomorrow" or "In 3 days"
 * - No date -> "Not scheduled"
 */
export interface DueUrgency {
  urgency: 'overdue' | 'due-today' | 'upcoming' | 'none';
  label: string;
  diffDays: number;
  isoDate: string | null;
}

/**
 * Return current or given date formatted as YYYY-MM-DD in Asia/Kolkata (IST, UTC+5:30)
 * Prevents UTC date shifts before 5:30 am IST.
 */
export function getTodayStrIST(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function getDueUrgency(input: string | Date | null | undefined): DueUrgency {
  if (!input) {
    return { urgency: 'none', label: 'Not scheduled', diffDays: 0, isoDate: null };
  }

  const rawStr = typeof input === 'string' ? input : input.toISOString();
  const targetDateOnly = rawStr.split('T')[0];
  const targetParts = targetDateOnly.split('-').map(Number);
  if (targetParts.length !== 3 || isNaN(targetParts[0])) {
    return { urgency: 'none', label: 'Not scheduled', diffDays: 0, isoDate: null };
  }

  const todayStr = getTodayStrIST();
  const todayParts = todayStr.split('-').map(Number);
  const todayMidnight = new Date(todayParts[0], todayParts[1] - 1, todayParts[2]).getTime();
  const targetMidnight = new Date(targetParts[0], targetParts[1] - 1, targetParts[2]).getTime();

  const msPerDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.round((targetMidnight - todayMidnight) / msPerDay);

  if (diffDays < 0) {
    const absDays = Math.abs(diffDays);
    const label = absDays === 1 ? 'Overdue · 1 day' : `Overdue · ${absDays} days`;
    return { urgency: 'overdue', label, diffDays, isoDate: targetDateOnly };
  } else if (diffDays === 0) {
    return { urgency: 'due-today', label: 'Due today', diffDays: 0, isoDate: targetDateOnly };
  } else if (diffDays === 1) {
    return { urgency: 'upcoming', label: 'Tomorrow', diffDays: 1, isoDate: targetDateOnly };
  } else {
    return { urgency: 'upcoming', label: `In ${diffDays} days`, diffDays, isoDate: targetDateOnly };
  }
}

/**
 * Format standard 10-digit Indian phone numbers to "+91 98765 43210".
 * Preserves raw phone digits for tel: and wa.me protocols.
 */
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');

  // 10 digits without country code: 9876543210 -> +91 98765 43210
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }

  // 12 digits starting with 91: 919876543210 -> +91 98765 43210
  if (digits.length === 12 && digits.startsWith('91')) {
    const main = digits.slice(2);
    return `+91 ${main.slice(0, 5)} ${main.slice(5)}`;
  }

  // 11 digits starting with 0: 09876543210 -> +91 98765 43210
  if (digits.length === 11 && digits.startsWith('0')) {
    const main = digits.slice(1);
    return `+91 ${main.slice(0, 5)} ${main.slice(5)}`;
  }

  // Otherwise fallback cleanly
  return phone.trim();
}

/**
 * Clean phone number strictly for tel: and wa.me links
 * e.g., 919876543210
 */
export function cleanPhoneForLink(phone: string | null | undefined): string {
  if (!phone) return '';
  let digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    digits = '91' + digits;
  }
  return digits;
}

/**
 * Standardize Patient ID display: labelled "Patient ID", muted 12px tabular text
 * Keeps original stored value intact.
 */
export function formatPatientDisplayId(id: string): string {
  if (!id) return '';
  // If ID starts with 'cust-', simplify visually while keeping original
  if (id.startsWith('cust-')) {
    const parts = id.split('-');
    if (parts.length >= 2) {
      return parts.slice(1).join('-').toUpperCase();
    }
  }
  return id.toUpperCase();
}
