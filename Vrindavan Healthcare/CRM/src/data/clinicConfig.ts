/**
 * Clinic & Doctor Configuration for Vrindavan Healthcare CRM
 * 
 * Sourced from the main website's clinicData.ts — single source of truth
 * for all clinic locations and attending physicians.
 */

export interface ClinicLocationConfig {
  id: string;
  name: string;
  badge: string;
  shortName: string;
  address: string;
  landmark: string;
  city: string;
  pincode: string;
  timing: string;
  phone: string;
  googleMapsUrl: string;
}

export interface DoctorConfig {
  id: string;
  name: string;
  shortName: string;
  initials: string;
  title: string;
  qualifications: string;
  specialization: string;
  hindiSpecialization?: string;
  consultationFee: string;
  phone: string;
  email?: string;
  clinicIds: string[]; // Which clinics this doctor practices at
}

export interface ActiveClinicContext {
  doctor: DoctorConfig;
  clinic: ClinicLocationConfig;
}

// ─── Clinic Locations ──────────────────────────────────────────────────────────

export const CLINICS: ClinicLocationConfig[] = [
  {
    id: 'raman-reti',
    name: 'Raman Reti — ISKCON Area',
    badge: 'Primary Clinic & Endoscopy Suite',
    shortName: 'Raman Reti',
    address: 'Bhakti Vedant Marg, Raman Reti, Vrindavan, Uttar Pradesh',
    landmark: 'Near ISKCON Temple, Raman Reti',
    city: 'Vrindavan, Mathura District',
    pincode: '281121',
    timing: 'Mon – Sat: 9:00 AM – 7:00 PM',
    phone: '+91 94122 81121',
    googleMapsUrl: 'https://www.google.com/maps?q=27.572217,77.678634',
  },
  {
    id: 'hanuman-bagh',
    name: 'Hanuman Bagh — City Centre',
    badge: 'Consultation & OPD Centre',
    shortName: 'Hanuman Bagh',
    address: 'Bankey Bihari Nikunj, Hanuman Bagh, Vrindavan, Uttar Pradesh',
    landmark: 'Near Brijwasi Mithai Wala',
    city: 'Vrindavan, Mathura District',
    pincode: '281121',
    timing: 'Mon – Sun: 10:00 AM – 2:00 PM',
    phone: '+91 94122 81121',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Bankey+Bihari+Nikunj+Hanuman+Bagh+Vrindavan',
  },
];

// ─── Doctors ───────────────────────────────────────────────────────────────────

export const DOCTORS: DoctorConfig[] = [
  {
    id: 'chaitanya',
    name: 'Dr. Chaitanya Gupta',
    shortName: 'Dr. Chaitanya',
    initials: 'CG',
    title: 'Liver & Gastro Specialist | Consultant Physician',
    qualifications: 'MBBS, MD (General Medicine), DM (Gastroenterology)',
    specialization: 'Upper GI Endoscopy, Hepatology, GERD, Peptic Ulcers, IBS & Emergency Critical Care',
    consultationFee: '₹200',
    phone: '+91 96395 66111',
    clinicIds: ['raman-reti', 'hanuman-bagh'],
  },
  {
    id: 'aishwarya',
    name: 'Dr. Aishwarya Singhal Gupta',
    shortName: 'Dr. Aishwarya',
    initials: 'AG',
    title: 'Consultant Physician | Sugar, BP & Thyroid Specialist',
    qualifications: 'M.B.B.S., M.D. (Internal Medicine) — Gold Medalist',
    specialization: 'Diabetes, Hypertension, Thyroid Disorders, Infectious Fevers & Adult Internal Medicine',
    hindiSpecialization: 'शुगर, बी.पी. एवं थायरॉइड रोग विशेषज्ञ',
    consultationFee: '₹200',
    phone: '+91 96395 66111',
    email: 'dr.aishwaryasinghalgupta@gmail.com',
    clinicIds: ['raman-reti', 'hanuman-bagh'],
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

export function getClinicById(id: string): ClinicLocationConfig | undefined {
  return CLINICS.find((c) => c.id === id);
}

export function getDoctorById(id: string): DoctorConfig | undefined {
  return DOCTORS.find((d) => d.id === id);
}

export function getClinicsForDoctor(doctorId: string): ClinicLocationConfig[] {
  const doctor = getDoctorById(doctorId);
  if (!doctor) return [];
  return CLINICS.filter((c) => doctor.clinicIds.includes(c.id));
}

/** Persistence key for the active context in localStorage */
export const ACTIVE_CONTEXT_STORAGE_KEY = 'vh_crm_active_context';

/** Default active context */
export const DEFAULT_CONTEXT: ActiveClinicContext = {
  doctor: DOCTORS[0],
  clinic: CLINICS[0],
};
