/**
 * ClinicSwitcher — A premium dropdown for switching between
 * doctors and clinic locations within the CRM Sidebar.
 *
 * When expanded it shows all available doctor+clinic combos.
 * Collapsed sidebar mode: shows the active doctor's initials
 * with a tooltip; clicking opens the full picker popover.
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, MapPin, Stethoscope, Check, Building2 } from 'lucide-react';
import { useClinicContext } from '../context/ClinicContext.tsx';

interface ClinicSwitcherProps {
  isCollapsed?: boolean;
}

export const ClinicSwitcher: React.FC<ClinicSwitcherProps> = ({ isCollapsed = false }) => {
  const {
    activeDoctor,
    activeClinic,
    doctors,
    doctorClinics,
    setActiveDoctor,
    setActiveClinic,
  } = useClinicContext();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  // Collapsed sidebar: compact pill with initials
  if (isCollapsed) {
    return (
      <div ref={dropdownRef} className="relative px-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-11 h-11 mx-auto rounded-xl bg-gradient-to-br from-[#F0FDFA] to-[#CCFBF1] border border-[#99F6E4] flex items-center justify-center cursor-pointer shadow-xs hover:shadow-md hover:border-[#0F766E]/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]"
          title={`${activeDoctor.shortName} · ${activeClinic.shortName}`}
          aria-label={`Switch doctor or clinic — currently ${activeDoctor.shortName} at ${activeClinic.shortName}`}
        >
          <span className="text-[11px] font-bold text-[#0F766E] tracking-tight leading-none">
            {activeDoctor.initials}
          </span>
        </button>

        {isOpen && (
          <SwitcherDropdown
            activeDoctor={activeDoctor}
            activeClinic={activeClinic}
            doctors={doctors}
            doctorClinics={doctorClinics}
            onSelectDoctor={(doctorId) => {
              setActiveDoctor(doctorId);
              setIsOpen(false);
            }}
            onSelectClinic={(clinicId) => {
              setActiveClinic(clinicId);
              setIsOpen(false);
            }}
            position="right"
          />
        )}
      </div>
    );
  }

  // Expanded sidebar: full doctor+clinic card
  return (
    <div ref={dropdownRef} className="relative px-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2.5 rounded-lg bg-gradient-to-br from-[#F0FDFA] to-[#ECFDF5] border border-[#A7F3D0] hover:border-[#0F766E]/50 hover:shadow-sm transition-all cursor-pointer text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] focus-visible:ring-offset-1"
        aria-label="Switch doctor or clinic"
        aria-expanded={isOpen}
      >
        <div className="flex items-start gap-2.5">
          {/* Doctor initials avatar */}
          <div className="w-8 h-8 rounded-lg bg-[#0F766E] text-white flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-[10px] font-bold tracking-tight">{activeDoctor.initials}</span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-semibold text-[#0F172A] truncate leading-tight">
                {activeDoctor.shortName}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#64748B] shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-[#0D9488] shrink-0" />
              <span className="text-[11px] text-[#475569] truncate leading-tight">
                {activeClinic.shortName}
              </span>
            </div>
          </div>
        </div>
      </button>

      {isOpen && (
        <SwitcherDropdown
          activeDoctor={activeDoctor}
          activeClinic={activeClinic}
          doctors={doctors}
          doctorClinics={doctorClinics}
          onSelectDoctor={(doctorId) => {
            setActiveDoctor(doctorId);
            setIsOpen(false);
          }}
          onSelectClinic={(clinicId) => {
            setActiveClinic(clinicId);
            setIsOpen(false);
          }}
          position="below"
        />
      )}
    </div>
  );
};

// ─── Dropdown Panel ─────────────────────────────────────────────────────────────

interface SwitcherDropdownProps {
  activeDoctor: ReturnType<typeof import('../context/ClinicContext.tsx').useClinicContext>['activeDoctor'];
  activeClinic: ReturnType<typeof import('../context/ClinicContext.tsx').useClinicContext>['activeClinic'];
  doctors: ReturnType<typeof import('../context/ClinicContext.tsx').useClinicContext>['doctors'];
  doctorClinics: ReturnType<typeof import('../context/ClinicContext.tsx').useClinicContext>['doctorClinics'];
  onSelectDoctor: (id: string) => void;
  onSelectClinic: (id: string) => void;
  position: 'right' | 'below';
}

const SwitcherDropdown: React.FC<SwitcherDropdownProps> = ({
  activeDoctor,
  activeClinic,
  doctors,
  doctorClinics,
  onSelectDoctor,
  onSelectClinic,
  position,
}) => {
  return (
    <div
      className={`absolute z-50 bg-white border border-[#E2E8F0] rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 ${
        position === 'right'
          ? 'left-full top-0 ml-2 w-72'
          : 'left-0 right-0 top-full mt-1.5 w-full min-w-[260px]'
      }`}
      style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
    >
      {/* Doctor Selection */}
      <div className="p-2.5 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-1.5 px-2 pb-1.5">
          <Stethoscope className="w-3.5 h-3.5 text-[#64748B]" />
          <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-widest">
            Doctor
          </span>
        </div>
        {doctors.map((doc) => {
          const isActive = doc.id === activeDoctor.id;
          return (
            <button
              key={doc.id}
              onClick={() => onSelectDoctor(doc.id)}
              className={`w-full px-2.5 py-2 rounded-lg text-left flex items-center gap-2.5 transition-all group ${
                isActive
                  ? 'bg-[#F0FDFA] border border-[#CCFBF1]'
                  : 'hover:bg-[#F8FAFC] border border-transparent'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-bold tracking-tight shadow-xs ${
                  isActive
                    ? 'bg-[#0F766E] text-white'
                    : 'bg-[#E2E8F0] text-[#475569] group-hover:bg-[#CBD5E1]'
                }`}
              >
                {doc.initials}
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className={`text-[12.5px] font-medium leading-tight truncate ${
                    isActive ? 'text-[#0F766E]' : 'text-[#0F172A]'
                  }`}
                >
                  {doc.name}
                </p>
                <p className="text-[10.5px] text-[#64748B] leading-tight truncate mt-px">
                  {doc.specialization.split(',')[0]}
                </p>
              </div>

              {isActive && (
                <Check className="w-4 h-4 text-[#0F766E] shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Clinic Location Selection */}
      <div className="p-2.5">
        <div className="flex items-center gap-1.5 px-2 pb-1.5">
          <Building2 className="w-3.5 h-3.5 text-[#64748B]" />
          <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-widest">
            Clinic Location
          </span>
        </div>
        {doctorClinics.map((clinic) => {
          const isActive = clinic.id === activeClinic.id;
          return (
            <button
              key={clinic.id}
              onClick={() => onSelectClinic(clinic.id)}
              className={`w-full px-2.5 py-2 rounded-lg text-left flex items-start gap-2.5 transition-all ${
                isActive
                  ? 'bg-[#F0FDFA] border border-[#CCFBF1]'
                  : 'hover:bg-[#F8FAFC] border border-transparent'
              }`}
            >
              <MapPin
                className={`w-4 h-4 mt-0.5 shrink-0 ${
                  isActive ? 'text-[#0D9488]' : 'text-[#94A3B8]'
                }`}
              />
              <div className="min-w-0 flex-1">
                <p
                  className={`text-[12.5px] font-medium leading-tight truncate ${
                    isActive ? 'text-[#0F766E]' : 'text-[#0F172A]'
                  }`}
                >
                  {clinic.shortName}
                </p>
                <p className="text-[10.5px] text-[#64748B] leading-tight mt-px truncate">
                  {clinic.landmark}
                </p>
                <p className="text-[10px] text-[#94A3B8] leading-tight mt-px">
                  {clinic.timing}
                </p>
              </div>

              {isActive && (
                <Check className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
