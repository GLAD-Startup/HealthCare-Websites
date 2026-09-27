/**
 * ClinicContext — React Context for the active Clinic + Doctor pair.
 *
 * Provides a globally-accessible way for any CRM component to read the
 * currently active doctor and clinic location, and to switch between them.
 * Persisted to localStorage so the selection survives page reloads.
 */

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import {
  DOCTORS,
  CLINICS,
  getClinicsForDoctor,
  getDoctorById,
  getClinicById,
  ACTIVE_CONTEXT_STORAGE_KEY,
  DEFAULT_CONTEXT,
  type DoctorConfig,
  type ClinicLocationConfig,
  type ActiveClinicContext,
} from '../data/clinicConfig.ts';

interface ClinicContextValue {
  /** The currently active doctor */
  activeDoctor: DoctorConfig;
  /** The currently active clinic location */
  activeClinic: ClinicLocationConfig;
  /** All available doctors */
  doctors: DoctorConfig[];
  /** All available clinics */
  clinics: ClinicLocationConfig[];
  /** Clinics that the currently active doctor practices at */
  doctorClinics: ClinicLocationConfig[];
  /** Switch the active doctor (and optionally the clinic) */
  setActiveDoctor: (doctorId: string, clinicId?: string) => void;
  /** Switch the active clinic location */
  setActiveClinic: (clinicId: string) => void;
  /** Switch both doctor and clinic at once */
  setContext: (doctorId: string, clinicId: string) => void;
}

const ClinicCtx = createContext<ClinicContextValue | null>(null);

/** Read persisted context from localStorage */
function loadPersistedContext(): ActiveClinicContext {
  try {
    const raw = localStorage.getItem(ACTIVE_CONTEXT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { doctorId: string; clinicId: string };
      const doctor = getDoctorById(parsed.doctorId);
      const clinic = getClinicById(parsed.clinicId);
      if (doctor && clinic) {
        return { doctor, clinic };
      }
    }
  } catch {}
  return DEFAULT_CONTEXT;
}

/** Persist context to localStorage */
function persistContext(doctorId: string, clinicId: string): void {
  try {
    localStorage.setItem(
      ACTIVE_CONTEXT_STORAGE_KEY,
      JSON.stringify({ doctorId, clinicId })
    );
  } catch {}
}

export const ClinicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeContext, setActiveContext] = useState<ActiveClinicContext>(loadPersistedContext);

  const setActiveDoctor = useCallback((doctorId: string, clinicId?: string) => {
    const doctor = getDoctorById(doctorId);
    if (!doctor) return;

    // If clinicId is provided and valid for this doctor, use it; otherwise pick first clinic of this doctor
    let clinic: ClinicLocationConfig | undefined;
    if (clinicId) {
      clinic = getClinicById(clinicId);
      if (clinic && !doctor.clinicIds.includes(clinic.id)) {
        clinic = undefined;
      }
    }
    if (!clinic) {
      const doctorClinics = getClinicsForDoctor(doctorId);
      clinic = doctorClinics[0] || CLINICS[0];
    }

    setActiveContext({ doctor, clinic });
    persistContext(doctor.id, clinic.id);
  }, []);

  const setActiveClinic = useCallback((clinicId: string) => {
    const clinic = getClinicById(clinicId);
    if (!clinic) return;

    setActiveContext((prev) => {
      persistContext(prev.doctor.id, clinic.id);
      return { ...prev, clinic };
    });
  }, []);

  const setContext = useCallback((doctorId: string, clinicId: string) => {
    const doctor = getDoctorById(doctorId);
    const clinic = getClinicById(clinicId);
    if (!doctor || !clinic) return;

    setActiveContext({ doctor, clinic });
    persistContext(doctor.id, clinic.id);
  }, []);

  const value: ClinicContextValue = {
    activeDoctor: activeContext.doctor,
    activeClinic: activeContext.clinic,
    doctors: DOCTORS,
    clinics: CLINICS,
    doctorClinics: getClinicsForDoctor(activeContext.doctor.id),
    setActiveDoctor,
    setActiveClinic,
    setContext,
  };

  return <ClinicCtx.Provider value={value}>{children}</ClinicCtx.Provider>;
};

/**
 * Hook to access the active clinic context.
 * Must be called within a <ClinicProvider>.
 */
export function useClinicContext(): ClinicContextValue {
  const ctx = useContext(ClinicCtx);
  if (!ctx) {
    throw new Error('useClinicContext must be used within a <ClinicProvider>');
  }
  return ctx;
}
