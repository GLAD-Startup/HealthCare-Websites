import React, { useEffect, useRef } from 'react';
import { getLenis } from '../hooks/useSmoothScroll';
import { animate, createTimeline, stagger } from 'animejs';
import { animateCounter, animateFloatingLoop } from '../utils/animeEffects';
import heroDocImg from '../assets/WhatsApp Image 2026-09-24 at 22.47.12.jpeg';

interface HeroProps {
  onOpenAppointment: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenAppointment }) => {
  const countRef = useRef<HTMLDivElement>(null);
  const yearsRef = useRef<HTMLDivElement>(null);
  const badge1Ref = useRef<HTMLDivElement>(null);
  const badge2Ref = useRef<HTMLDivElement>(null);
  const circle1Ref = useRef<HTMLDivElement>(null);
  const circle2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Counter Animations
    if (countRef.current) {
      animateCounter(countRef.current, 65, '', '+', 2000);
    }
    if (yearsRef.current) {
      animateCounter(yearsRef.current, 8, '', '+', 1800);
    }

    // 2. Floating Ambient Oscillations
    if (badge1Ref.current) {
      animateFloatingLoop(badge1Ref.current, 10, 3200);
    }
    if (badge2Ref.current) {
      animateFloatingLoop(badge2Ref.current, 14, 3800);
    }
    if (circle1Ref.current) {
      animate(circle1Ref.current, {
        scale: [0.95, 1.05],
        duration: 4000,
        alternate: true,
        loop: true,
        ease: 'inOutSine'
      });
    }
    if (circle2Ref.current) {
      animate(circle2Ref.current, {
        scale: [1.05, 0.95],
        duration: 4500,
        alternate: true,
        loop: true,
        ease: 'inOutSine'
      });
    }

    // 3. Staggered Entrance Timeline
    const timeline = createTimeline({
      duration: 1000
    });

    timeline
      .add('.hero-anime-item', {
        opacity: [0, 1],
        translateY: [25, 0],
        delay: stagger(120)
      })
      .add(
        '.hero-doctor-frame',
        {
          opacity: [0, 1],
          scale: [0.92, 1],
          duration: 1100
        },
      );
  }, []);

  return (
    <section id="hero" className="pt-24 sm:pt-28 md:pt-36 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        
        {/* Left Column: Editorial Headline, Subtitle, CTAs & Stats */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
          
          {/* Main Editorial Serif Headline */}
          <h1 className="hero-anime-item font-serif text-4xl sm:text-5xl lg:text-[66px] text-slate-900 leading-[1.08] tracking-tight">
            Trust Your Gut Feeling. <br className="hidden sm:inline" />
            We Care for You Every Day
          </h1>

          {/* Subtitle */}
          <p className="hero-anime-item text-sm sm:text-base lg:text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
            Never ignore what your digestive health is telling you. Experience trusted gastro, liver, and endoscopy care with advanced diagnosis and compassionate treatment under <strong>Dr. Chaitanya Gupta</strong> (MD General Medicine, DM Gastroenterology).
          </p>

          {/* Button Row: Solid Black Pill + Underlined Action */}
          <div className="hero-anime-item flex flex-wrap items-center gap-4 sm:gap-6 pt-1">
            <button
              onClick={onOpenAppointment}
              className="px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all hover:scale-102 active:scale-98 cursor-pointer min-h-[46px]"
            >
              BOOK AN APPOINTMENT
            </button>

            <a
              href="#doctor"
              onClick={(e) => {
                e.preventDefault();
                const lenis = getLenis();
                if (lenis) lenis.scrollTo('#doctor', { offset: -70 });
                else document.getElementById('doctor')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-0.5 hover:text-slate-600 hover:border-slate-600 transition-colors inline-flex items-center gap-1.5"
            >
              <span>FIND A DOCTOR</span>
            </a>
          </div>

          {/* Social Proof Stats Row: Butter Yellow Card + Matching Counter */}
          <div className="hero-anime-item flex flex-wrap items-center gap-4 sm:gap-6 pt-4">
            
            {/* Soft Butter Yellow Pill Card */}
            <div className="bg-[#FEF9C3] border border-amber-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-4.5 flex items-center gap-4 shadow-2xs">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">
                  2148
                </div>
                <div className="text-[11px] sm:text-xs text-slate-700 font-semibold mt-1 max-w-[150px] leading-tight">
                  Patients Took a Step Toward Wellness Today
                </div>
                
                {/* Avatar Cluster */}
                <div className="flex -space-x-2 mt-2">
                  <img
                    src="/images/dr_chaitanya_press_conf.jpeg"
                    alt="Verified Patient"
                    className="w-6 h-6 rounded-full border-2 border-[#FEF9C3] object-cover"
                  />
                  <img
                    src="/images/medical_team_faculty.jpeg"
                    alt="Verified Patient"
                    className="w-6 h-6 rounded-full border-2 border-[#FEF9C3] object-cover"
                  />
                  <div className="w-6 h-6 rounded-full border-2 border-[#FEF9C3] bg-amber-400 text-slate-900 text-[10px] font-bold flex items-center justify-center">
                    ★
                  </div>
                </div>
              </div>
            </div>

            {/* Counter Next to Card */}
            <div className="flex flex-col pl-2">
              <div ref={countRef} className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">
                800+
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1 max-w-[160px] leading-tight">
                Users Got Matched With a Doctor Today
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Hero Doctor & Patient Image Frame */}
        <div className="lg:col-span-5 relative flex items-center justify-center pt-4 lg:pt-0">
          <div className="relative w-full max-w-[420px] lg:max-w-none">
            
            {/* Main Rounded Photo Card */}
            <div className="hero-doctor-frame relative rounded-[36px] sm:rounded-[44px] overflow-hidden shadow-xl border border-slate-200/80 bg-slate-100 aspect-4/3 sm:aspect-auto sm:h-[480px] lg:h-[530px]">
              <img
                src={heroDocImg}
                alt="Dr. Chaitanya Gupta - DM Gastroenterologist at World IBD Day Press Conference"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

              {/* Top-Left Circular Floating Badge: "Explore Service ↗" */}
              <a
                href="#gastro-care"
                onClick={(e) => {
                  e.preventDefault();
                  const lenis = getLenis();
                  if (lenis) lenis.scrollTo('#gastro-care', { offset: -70 });
                  else document.getElementById('gastro-care')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="absolute top-4 left-4 sm:top-6 sm:left-6 group cursor-pointer"
                aria-label="Explore Services"
              >
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-white/95 backdrop-blur-md text-slate-900 border border-slate-200/90 shadow-lg flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-slate-900 group-hover:text-white">
                  <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-slate-600 group-hover:text-slate-300 leading-none">Explore</span>
                  <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-slate-600 group-hover:text-slate-300 leading-none mt-0.5">Service</span>
                  <span className="text-base sm:text-lg font-bold mt-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                </div>
              </a>

              {/* Bottom Doctor & Clinic Badge Overlay */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-slate-100 shadow-md">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                      Dr. Chaitanya Gupta
                    </div>
                    <div className="text-[10px] text-teal-800 font-semibold mt-0.5">
                      MD General Medicine (2018) • DM Gastro
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#E6F7F5] text-teal-900 text-[10px] font-bold uppercase whitespace-nowrap">
                    ₹200 Fee
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};