import React from 'react';
import { getLenis } from '../hooks/useSmoothScroll';

interface PatientInfoBentoProps {
  onOpenAppointment: () => void;
}

export const PatientInfoBento: React.FC<PatientInfoBentoProps> = ({ onOpenAppointment }) => {
  const scrollToExplorer = () => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo('#gastro-explorer', { offset: -70 });
    } else {
      document.getElementById('gastro-explorer')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="about-us" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Centered Editorial Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-[1.12]">
          Important Information <br className="hidden sm:inline" />
          for Patients
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 font-normal mt-3 leading-relaxed max-w-2xl mx-auto">
          Stay informed with essential updates, procedures, and ethical care guidelines to help you navigate your healthcare journey safely and confidently every step of the way.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        
        {/* Left Column (Span 6): Two stacked cards */}
        <div className="lg:col-span-6 flex flex-col gap-4 sm:gap-6">
          
          {/* Top Card: Soft Butter Yellow Stat Card */}
          <div className="rounded-2xl sm:rounded-[32px] bg-[#FEF08A]/90 sm:bg-[#FEF08A] border border-amber-300/80 p-5 sm:p-8 flex flex-col justify-between shadow-2xs">
            {/* Top row: tags + avatar stack */}
            <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <span className="px-2.5 sm:px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                  Stay Informed
                </span>
                <span className="px-2.5 sm:px-3 py-1 rounded-full bg-white/80 text-slate-800 text-[10px] sm:text-[11px] font-semibold border border-amber-300">
                  Essential Care Tips
                </span>
              </div>

              <div className="flex -space-x-2 shrink-0">
                <img src="/images/dr_chaitanya_press_conf.jpeg" alt="Patient" className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white object-cover" />
                <img src="/images/medical_team_faculty.jpeg" alt="Patient" className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white object-cover" />
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white bg-amber-400 text-slate-900 text-[9px] sm:text-[10px] font-bold flex items-center justify-center">
                  ★
                </div>
              </div>
            </div>

            {/* Big Stat & Paragraph */}
            <div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-none mb-2.5 sm:mb-3">
                94.5%
              </div>
              <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                of our patients experience significant health improvements and high satisfaction levels thanks to our compassionate care, advanced endoscopy diagnostics, and personalized treatment plans tailored to each individual's unique needs.
              </p>
            </div>
          </div>

          {/* Bottom Card: Photo Card "Exploring Various Options" */}
          <div
            onClick={scrollToExplorer}
            className="group relative rounded-2xl sm:rounded-[32px] overflow-hidden bg-slate-900 shadow-xs cursor-pointer min-h-[190px] sm:min-h-[240px] flex items-end"
          >
            <img
              src="/images/digestive_clinic.jpg"
              alt="Exploring Various Treatment Options"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
            
            <div className="relative z-10 p-5 sm:p-7 w-full flex flex-col justify-between h-full">
              <h3 className="text-lg sm:text-2xl font-bold text-white leading-tight">
                Exploring Various Options
              </h3>

              <div className="pt-6 sm:pt-8">
                <button
                  type="button"
                  className="px-3.5 sm:px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-slate-900 font-bold text-[11px] sm:text-xs flex items-center gap-1.5 shadow-sm group-hover:bg-slate-900 group-hover:text-white transition-colors cursor-pointer"
                >
                  <span>Explore Now</span>
                  <span className="text-xs">➔</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (Span 6): Mint Card with Doctor in Lab Coat (Responsive Height) */}
        <div className="lg:col-span-6 rounded-2xl sm:rounded-[32px] bg-[#E6F7F5] border border-teal-200/70 p-5 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xs min-h-0 sm:min-h-[480px]">
          
          <div className="relative z-10 max-w-sm mb-4 sm:mb-6">
            <h3 className="font-serif text-xl sm:text-3xl lg:text-4xl text-slate-900 leading-tight tracking-tight">
              Focused molecular &amp; clinical diagnosis targeting precise challenges.
            </h3>

            <div className="pt-3 sm:pt-4">
              <button
                onClick={onOpenAppointment}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-102 active:scale-98 cursor-pointer"
              >
                <span>Contact Us</span>
                <span className="text-xs">➔</span>
              </button>
            </div>
          </div>

          {/* Doctor Portrait Image Anchored at Bottom */}
          <div className="relative w-full flex justify-center lg:justify-end mt-2 sm:mt-4">
            <div className="w-52 sm:w-80 h-64 sm:h-96 rounded-xl sm:rounded-2xl overflow-hidden shadow-md border-4 border-white bg-white">
              <img
                src="/images/dr_chaitanya_gupta.jpg"
                alt="Dr. Chaitanya Gupta - DM Gastroenterology"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
