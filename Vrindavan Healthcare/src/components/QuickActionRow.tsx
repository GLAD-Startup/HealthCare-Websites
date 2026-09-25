import React from 'react';
import { getLenis } from '../hooks/useSmoothScroll';

interface QuickActionRowProps {
  onOpenAppointment: () => void;
}

export const QuickActionRow: React.FC<QuickActionRowProps> = ({ onOpenAppointment }) => {
  const scrollToSection = (id: string) => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(id, { offset: -70 });
    } else {
      document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 sm:-mt-4 mb-12 sm:mb-16">
      {/* Responsive Grid: Full-Width Clean Cards on Phone, Multi-Column on Tablet/Desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Card 1: Photo Card with Bottom Text Overlay (Full Faculty Visible) */}
        <div
          onClick={() => scrollToSection('#about-us')}
          className="group relative rounded-2xl sm:rounded-[28px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer aspect-[16/9] sm:aspect-auto sm:h-[220px]"
        >
          <img
            src="/images/medical_team_faculty.jpeg"
            alt="Compassionate Care for Seniors and Outpatients"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
          <div className="absolute bottom-3 left-3.5 right-3.5 sm:bottom-4 sm:left-4 sm:right-4 text-white">
            <h3 className="text-xs sm:text-base font-bold leading-snug drop-shadow-sm">
              Compassionate Care for Seniors and Outpatients
            </h3>
          </div>
        </div>

        {/* Card 2: Photo Card with Top-Left Arrow Circle + Bottom Label */}
        <div
          onClick={() => scrollToSection('#technology')}
          className="group relative rounded-2xl sm:rounded-[28px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer aspect-[16/9] sm:aspect-auto sm:h-[220px]"
        >
          <img
            src="/images/dr_chaitanya_endoscopy_procedure.jpeg"
            alt="Endoscopy Tech & Diagnostics"
            className="w-full h-full object-cover object-[center_30%] group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
          
          {/* Top-Left Arrow Pill Circle */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/90 backdrop-blur-md text-slate-900 flex items-center justify-center font-bold text-xs sm:text-sm shadow-xs group-hover:bg-slate-900 group-hover:text-white transition-colors">
            ↗
          </div>

          <div className="absolute bottom-3 left-3.5 right-3.5 sm:bottom-4 sm:left-4 sm:right-4 text-white">
            <h3 className="text-xs sm:text-base font-bold leading-snug drop-shadow-sm">
              Upper GI Endoscopy &amp; Diagnostics
            </h3>
          </div>
        </div>

        {/* Card 3: Soft Pastel Warm Peach Card (Hear From Our Patients) */}
        <div
          onClick={() => scrollToSection('#faq')}
          className="group relative rounded-2xl sm:rounded-[28px] p-4 sm:p-5.5 bg-gradient-to-br from-[#FFF1EE] via-[#FFF6EE] to-[#FEF3C7] border border-orange-200/70 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between aspect-[16/9] sm:aspect-auto sm:h-[220px]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-[13px] font-bold text-slate-900">
              Hear From Our Patients
            </span>
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 border border-orange-200/60 text-slate-900 flex items-center justify-center font-bold text-xs group-hover:bg-slate-900 group-hover:text-white transition-colors">
              ↗
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed my-1 sm:my-2 line-clamp-2">
            "An incredibly caring clinic with doctors who truly go above and beyond!"
          </p>

          <div className="flex items-center justify-between pt-1 border-t border-orange-200/50">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                <img src="/images/dr_chaitanya_press_conf.jpeg" alt="Reviewer" className="w-5 h-5 rounded-full border border-white object-cover" />
                <img src="/images/medical_team_faculty.jpeg" alt="Reviewer" className="w-5 h-5 rounded-full border border-white object-cover" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-700">Reviews (4.5★)</span>
            </div>
            <span className="text-lg sm:text-xl font-serif text-slate-900 font-black leading-none">“</span>
          </div>
        </div>

        {/* Card 4: Photo Card of Medical Staff */}
        <div
          onClick={onOpenAppointment}
          className="group relative rounded-2xl sm:rounded-[28px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer aspect-[16/9] sm:aspect-auto sm:h-[220px]"
        >
          <img
            src="/images/digestive_clinic.jpg"
            alt="Doctors Who Truly Care for You"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
          <div className="absolute bottom-3 left-3.5 right-3.5 sm:bottom-4 sm:left-4 sm:right-4 text-white">
            <h3 className="text-xs sm:text-base font-bold leading-snug drop-shadow-sm">
              Doctors Who Truly Care for You
            </h3>
          </div>
        </div>

      </div>
    </section>
  );
};
