import React from 'react';
import { Calendar, Video, ShieldCheck } from 'lucide-react';
import { getLenis } from '../hooks/useSmoothScroll';

interface SupportAnytimeSectionProps {
  onOpenAppointment: () => void;
}

export const SupportAnytimeSection: React.FC<SupportAnytimeSectionProps> = ({ onOpenAppointment }) => {
  const scrollToContact = () => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo('#contact', { offset: -70 });
    } else {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-[1.12]">
            Support Anytime, <br />
            Anywhere
          </h2>
        </div>

        <div className="max-w-md space-y-3">
          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
            Stay informed with essential updates and guidelines to help you navigate your healthcare journey safely and confidently every step of the way.
          </p>

          <div>
            <button
              onClick={scrollToContact}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-slate-300 text-slate-800 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <span>Learn More</span>
              <span className="text-xs">↗</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
        
        {/* Bento Col 1 (Span 5): Large Photo Card (Virtual & Home Care) */}
        <div className="lg:col-span-5 rounded-2xl sm:rounded-[32px] overflow-hidden shadow-xs relative min-h-[260px] sm:min-h-[420px] bg-slate-900 group">
          <img
            src="/images/telehealth_patient.jpg"
            alt="Virtual Consultation at Home"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 text-white">
            <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">
              In-Clinic &amp; Online OPD
            </span>
            <h3 className="text-base sm:text-xl font-bold leading-tight">
              Comfortable Consultations for Outpatients &amp; Senior Citizens
            </h3>
          </div>
        </div>

        {/* Bento Col 2 (Span 4): Two Stacked Cards */}
        <div className="lg:col-span-4 flex flex-col gap-4 sm:gap-6">
          
          {/* Feature List Card */}
          <div className="rounded-2xl sm:rounded-[32px] bg-white border border-slate-200/90 p-5 sm:p-6 flex flex-col justify-center space-y-3.5 sm:space-y-4 shadow-2xs flex-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-800">
                Simple Appointment Scheduling
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                <Video className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-800">
                Virtual &amp; In-Clinic Consultations
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-800">
                Transparent ₹200 OPD Fee
              </span>
            </div>
          </div>

          {/* Recovery Photo Card */}
          <div className="rounded-2xl sm:rounded-[32px] overflow-hidden shadow-xs relative h-[160px] sm:h-[180px] bg-slate-100 group">
            <img
              src="/images/endoscopy_suite.jpg"
              alt="Medical Team & Hospital Faculty"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-4 right-4 text-white text-xs font-bold">
              Specialist Clinical Monitoring &amp; Endoscopy Suite
            </div>
          </div>

        </div>

        {/* Bento Col 3 (Span 3): Avatar Circle Card + Butter Yellow Action Card */}
        <div className="lg:col-span-3 flex flex-col gap-4 sm:gap-6">
          
          {/* Top Mint Circle Avatar Card with Descriptive Trust Info */}
          <div className="rounded-2xl sm:rounded-[32px] bg-[#E6F7F5] border border-teal-200/70 p-4 sm:p-6 flex flex-col items-center justify-center text-center shadow-2xs py-5 sm:h-[140px]">
            <div className="flex -space-x-2.5 mb-2">
              <img src="/images/dr_chaitanya_press_conf.jpeg" alt="Doctor" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-white object-cover shadow-xs" />
              <img src="/images/medical_team_faculty.jpeg" alt="Faculty" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-white object-cover shadow-xs" />
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-white bg-amber-400 text-slate-900 font-bold flex items-center justify-center shadow-xs text-xs">
                4.5★
              </div>
            </div>
            <div className="text-xs font-bold text-slate-900">
              65+ Verified Patient Ratings
            </div>
            <div className="text-[10px] text-teal-800 font-medium mt-0.5">
              Justdial Verified Healthcare Portal
            </div>
          </div>

          {/* Bottom Butter Yellow Action Card */}
          <div className="rounded-2xl sm:rounded-[32px] bg-[#FEF9C3] border border-amber-200/90 p-5 sm:p-6 flex flex-col justify-between shadow-2xs flex-1">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                Quick OPD Appointment Scheduling
              </h3>
              <p className="text-[11px] text-slate-600 font-medium mt-1">
                Mon-Sat 9am-7pm • Sun 9am-2pm
              </p>
            </div>

            <div className="pt-4 sm:pt-6">
              <button
                onClick={onOpenAppointment}
                className="w-full py-2.5 px-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-transform hover:scale-102 active:scale-98 cursor-pointer"
              >
                <span>Book Appointment</span>
                <span className="text-xs">↗</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
