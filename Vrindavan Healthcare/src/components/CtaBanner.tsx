import React from 'react';
import { CLINIC_INFO } from '../data/clinicData';
import supportRepImg from '../assets/Orange Simple People Bridge Logo.svg';

interface CtaBannerProps {
  onOpenAppointment: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onOpenAppointment }) => {
  return (
    <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Horizontal Pill Banner Card with Warm Yellow & Mint Pastel Gradient */}
      <div className="rounded-[36px] sm:rounded-[44px] bg-gradient-to-r from-[#FEF9C3] via-[#FFFBEB] to-[#E6F7F5] border border-amber-200/80 p-8 sm:p-12 lg:p-14 relative shadow-xs overflow-visible group">
        <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Column: Headline, Text & Action Buttons */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left relative z-10">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-[1.12]">
              Reach out for expert care and support today
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-slate-700 font-normal leading-relaxed max-w-lg">
              Contact our dedicated clinical team for appointments, endoscopy inquiries, or guidance — your digestive health and well-being are our highest priority.
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
              <button
                onClick={onOpenAppointment}
                className="px-7 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all hover:scale-102 active:scale-98 cursor-pointer min-h-[46px]"
              >
                START YOUR JOURNEY
              </button>

              <a
                href={`tel:${CLINIC_INFO.phoneRaw}`}
                className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-0.5 hover:text-slate-600 hover:border-slate-600 transition-colors"
              >
                GET IN TOUCH
              </a>
            </div>
          </div>

          {/* Mobile/Tablet: In-flow Centered Image with Bottom Negative Margin touching Container Bottom */}
          <div className="lg:hidden flex justify-center items-end mt-4 sm:mt-6 -mb-8 sm:-mb-12 pointer-events-none">
            <div className="w-72 sm:w-84 md:w-96 origin-bottom">
              <img
                src={supportRepImg}
                alt="Vrindavan Healthcare Support Coordinator"
                className="w-full h-auto object-contain drop-shadow-xl select-none block"
              />
            </div>
          </div>

          {/* Desktop Spacer Column (Columns 8..12 in 12-col grid) */}
          <div className="hidden lg:block lg:col-span-5 pointer-events-none" aria-hidden="true" />

        </div>

        {/* Desktop Enlarged Image: Bottom Flush with Container Bottom & Head Popping Out Above */}
        <div className="hidden lg:block absolute bottom-0 right-2 lg:right-6 xl:right-10 pointer-events-none z-20 transition-transform duration-500 ease-out group-hover:scale-103 origin-bottom">
          <img
            src={supportRepImg}
            alt="Vrindavan Healthcare Support Coordinator"
            className="w-[450px] lg:w-[490px] xl:w-[540px] 2xl:w-[580px] h-auto object-contain drop-shadow-2xl select-none block"
          />
        </div>

      </div>
    </section>
  );
};

