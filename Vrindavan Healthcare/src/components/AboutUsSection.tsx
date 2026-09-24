import React, { useEffect, useRef } from 'react';
import { Stethoscope, Clock, ShieldCheck, HeartPulse, Sparkles, ArrowRight, Award, MapPin } from 'lucide-react';
import { getLenis } from '../hooks/useSmoothScroll';
import { animate, stagger } from 'animejs';
import { CLINIC_INFO } from '../data/clinicData';

export const AboutUsSection: React.FC = () => {
  const clockBadgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Clock badge subtle rotation & pulse
    if (clockBadgeRef.current) {
      animate(clockBadgeRef.current, {
        rotate: [-8, 8],
        scale: [1, 1.08],
        duration: 3500,
        alternate: true,
        loop: true,
        ease: 'inOutSine'
      });
    }

    // 2. Staggered feature row reveal
    animate('.about-feature-row', {
      opacity: [0, 1],
      translateX: [-20, 0],
      duration: 800,
      delay: stagger(150),
      ease: 'outCubic'
    });
  }, []);

  const handleScrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo('#location', { offset: -110 });
    } else {
      const el = document.getElementById('location');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="about-us" className="py-16 sm:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Information & Feature List */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F0FDFA] text-[#0F766E] text-xs sm:text-sm font-bold tracking-wide">
              <Stethoscope className="w-4 h-4 text-[#0F766E]" />
              <span>About Dr. Chaitanya Gupta</span>
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.18]">
              Ethical, Super-Specialty Medical Care in Vrindavan
            </h2>

            {/* Paragraph */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 font-normal leading-relaxed">
              Dr. Chaitanya Gupta is a senior Liver &amp; Gastro Specialist and Consultant Physician. With an MD in General Medicine from SRMS Institute of Medical Sciences (2018) followed by DM in Gastroenterology, Dr. Gupta delivers compassionate, evidence-based care across liver health, gastrointestinal diagnostics, and internal medicine.
            </p>

            {/* 3 Feature Rows */}
            <div className="space-y-4 sm:space-y-6 pt-2">
              
              {/* Feature 1 */}
              <div className="about-feature-row flex items-start gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-2xl transition-colors hover:bg-[#F0FDFA]/60">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#F0FDFA] flex items-center justify-center text-[#0F766E] shrink-0 shadow-xs">
                  <HeartPulse className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                    Ethical &amp; Patient-First Approach
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Upholding high medical ethics, Dr. Gupta welcomes every patient with clarity, thorough explanations, and an accessible ₹200 OPD consultation fee.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="about-feature-row flex items-start gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-2xl transition-colors hover:bg-[#F0FDFA]/60">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#F0FDFA] flex items-center justify-center text-[#0F766E] shrink-0 shadow-xs">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                    Upper GI Endoscopy &amp; Liver Expertise
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Direct endoscopic visualization for ulcers, GERD, and bleeding, combined with comprehensive fatty liver and cirrhosis management protocols.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="about-feature-row flex items-start gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-2xl transition-colors hover:bg-[#F0FDFA]/60">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#F0FDFA] flex items-center justify-center text-[#0F766E] shrink-0 shadow-xs">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                    Dual Convenient Vrindavan Clinics
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Easily accessible at Bhakti Vedant Marg (Raman Reti near ISKCON) and Bankey Bihari Nikunj (Hanuman Bagh near Brijwasi Mithai Wala).
                  </p>
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <a
                href="#location"
                onClick={handleScrollToContact}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#0F766E] hover:bg-[#0D9488] active:bg-[#0D9488] text-white font-bold text-sm shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer min-h-[44px]"
              >
                <span>View Vrindavan Locations</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={`tel:${CLINIC_INFO.phoneRaw}`}
                className="inline-flex items-center justify-center gap-2 text-slate-700 hover:text-[#0F766E] font-bold text-sm transition-colors cursor-pointer min-h-[44px]"
              >
                <span>Call Helpline: {CLINIC_INFO.phone}</span>
              </a>
            </div>

          </div>

          {/* Right Column: Visual Showcase Frame */}
          <div className="lg:col-span-6 relative pt-4 lg:pt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Image Card */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-4/3 group">
                <img
                  src="/images/medical_team_faculty.jpeg"
                  alt="Medical Team & Hospital Faculty with Dr. Chaitanya Gupta"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                
                {/* Overlay Text */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white">
                  <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-[#0F766E]/90 text-white text-[11px] sm:text-xs font-bold mb-1.5 sm:mb-2">
                    <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                    <span>Specialist Clinical Team</span>
                  </div>
                  <h4 className="text-base sm:text-xl font-bold leading-tight">
                    Dedicated Physicians &amp; Critical Care Staff
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-200 mt-0.5 sm:mt-1">
                    Dr. Chaitanya Gupta alongside senior medical colleagues and critical care specialists.
                  </p>
                </div>
              </div>

              {/* Floating Badge: Consultation Fee & Rating */}
              <div
                ref={clockBadgeRef}
                className="absolute -bottom-4 left-1 sm:-left-8 bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl border border-slate-100 flex items-center gap-2.5 sm:gap-3.5 max-w-[85%] sm:max-w-xs"
              >
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                    ₹200 Transparent Fee
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5">
                    4.5 / 5 ★ (65 Justdial Ratings)
                  </div>
                </div>
              </div>

              {/* Floating Badge: OPD Timings */}
              <div className="absolute -top-3 right-1 sm:-right-6 bg-slate-900 text-white py-1.5 px-3 sm:py-2.5 sm:px-4 rounded-xl sm:rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2 max-w-[85%]">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                <div className="text-[11px] sm:text-xs font-bold">
                  Open 7 Days a Week
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
