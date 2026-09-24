import React from 'react';
import { Calendar, Stethoscope, Activity, Phone, ArrowRight } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';
import { getLenis } from '../hooks/useSmoothScroll';

interface QuickActionRowProps {
  onOpenAppointment: () => void;
}

export const QuickActionRow: React.FC<QuickActionRowProps> = ({ onOpenAppointment }) => {
  const scrollToSection = (id: string) => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(id, { offset: -110 });
    } else {
      document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 mb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Book an Appointment (Red / Ruby) */}
        <button
          onClick={onOpenAppointment}
          className="group relative bg-gradient-to-br from-[#991B1B] to-[#7F1D1D] text-white p-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-left overflow-hidden border border-red-500/20 cursor-pointer flex flex-col justify-between min-h-[120px]"
        >
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Calendar className="w-24 h-24 text-white" />
          </div>
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="p-1.5 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-bold leading-tight">Book Consultation</h3>
            <p className="text-xs text-red-100 font-medium mt-0.5">₹200 Fee • In-Clinic &amp; Online</p>
          </div>
        </button>

        {/* Card 2: Liver & Gastro Specialty (Teal / Jade) */}
        <button
          onClick={() => scrollToSection('#gastro-care')}
          className="group relative bg-gradient-to-br from-[#0F766E] via-[#0D9488] to-[#115E59] text-white p-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-left overflow-hidden border border-teal-400/20 cursor-pointer flex flex-col justify-between min-h-[120px]"
        >
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-24 h-24 text-white" />
          </div>
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="p-1.5 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-bold leading-tight">Liver &amp; Gastro Care</h3>
            <p className="text-xs text-teal-100 font-medium mt-0.5">Fatty Liver, Acidity, GERD &amp; IBS</p>
          </div>
        </button>

        {/* Card 3: Upper GI Endoscopy Suite (Royal Blue) */}
        <button
          onClick={() => scrollToSection('#technology')}
          className="group relative bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1E40AF] text-white p-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-left overflow-hidden border border-blue-400/20 cursor-pointer flex flex-col justify-between min-h-[120px]"
        >
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Stethoscope className="w-24 h-24 text-white" />
          </div>
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="p-1.5 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-bold leading-tight">Upper GI Endoscopy</h3>
            <p className="text-xs text-blue-100 font-medium mt-0.5">Direct High-Definition Diagnostics</p>
          </div>
        </button>

        {/* Card 4: 2 Vrindavan Clinics & Helpline (Emerald / Green) */}
        <a
          href={`tel:${CLINIC_INFO.phoneRaw}`}
          className="group relative bg-gradient-to-br from-[#047857] to-[#065F46] text-white p-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-left overflow-hidden border border-emerald-400/20 cursor-pointer flex flex-col justify-between min-h-[120px]"
        >
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Phone className="w-24 h-24 text-white" />
          </div>
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <span className="p-1.5 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-extrabold tracking-tight leading-tight">{CLINIC_INFO.phone}</h3>
            <p className="text-xs text-emerald-100 font-medium mt-0.5">Raman Reti &amp; Hanuman Bagh</p>
          </div>
        </a>

      </div>
    </section>
  );
};
