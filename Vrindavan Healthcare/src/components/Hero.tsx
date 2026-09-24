import React, { useEffect, useRef, useState } from 'react';
import { Calendar, Stethoscope, Star, Users, Search } from 'lucide-react';
import { getLenis } from '../hooks/useSmoothScroll';
import { animate, createTimeline, stagger } from 'animejs';
import { animateCounter, animateFloatingLoop } from '../utils/animeEffects';
import heroProcedureImg from '../assets/WhatsApp Image 2026-09-24 at 22.43.06.jpeg';
import vrindavanLogo from '../assets/Vrindavan_Healthcare_logo.png';

interface HeroProps {
  onOpenAppointment: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenAppointment }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const countRef = useRef<HTMLDivElement>(null);
  const yearsRef = useRef<HTMLDivElement>(null);
  const badge1Ref = useRef<HTMLDivElement>(null);
  const badge2Ref = useRef<HTMLDivElement>(null);
  const circle1Ref = useRef<HTMLDivElement>(null);
  const circle2Ref = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    const query = searchTerm.toLowerCase();

    let target = '#gastro-care';
    if (query.includes('general') || query.includes('sugar') || query.includes('diabetes') || query.includes('fever') || query.includes('bp') || query.includes('medicine')) {
      target = '#general-medicine';
    } else if (query.includes('doctor') || query.includes('chaitanya') || query.includes('gupta') || query.includes('qualification')) {
      target = '#doctor';
    } else if (query.includes('endoscopy') || query.includes('scope') || query.includes('machine') || query.includes('tech')) {
      target = '#technology';
    } else if (query.includes('map') || query.includes('location') || query.includes('address') || query.includes('iskcon') || query.includes('raman reti')) {
      target = '#location';
    } else if (query.includes('faq') || query.includes('fee') || query.includes('cost')) {
      target = '#faq';
    }

    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(target, { offset: -110 });
    } else {
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
    <section id="hero" className="pt-20 sm:pt-24 md:pt-32 pb-8 sm:pb-12 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Main Hero Container Card - Soft Mint Teal */}
      <div className="relative rounded-2xl sm:rounded-3xl lg:rounded-[36px] bg-[#F0FDFA] border border-[#CCFBF1] p-4 sm:p-8 lg:p-14 overflow-hidden shadow-xs">
        
        {/* Background Subtle Gradient Blobs - Clean Medical Lighting */}
        <div className="absolute -top-20 -left-20 w-72 sm:w-96 h-72 sm:h-96 bg-white/70 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 sm:w-[420px] h-80 sm:h-[420px] bg-[#0F766E]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-8 items-center relative z-10">
          
          {/* Left Column: Headline & CTAs */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left">
            
            {/* Tag Badge */}
            <div className="hero-anime-item inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-xs border border-teal-200/80 text-[#0F766E] text-[11px] sm:text-xs md:text-sm font-bold max-w-full">
              <img
                src={vrindavanLogo}
                alt="Vrindavan Healthcare"
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full object-contain shrink-0"
              />
              <span className="truncate">Super-Specialty Gastro &amp; Liver Clinic • Vrindavan</span>
            </div>

            {/* Main Headline */}
            <h1 className="hero-anime-item text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.14] tracking-tight">
              Advanced Liver &amp; Gastro Care You Can Rely On
            </h1>

            {/* Subheadline */}
            <p className="hero-anime-item text-sm sm:text-base lg:text-lg text-slate-600 font-medium leading-relaxed max-w-xl">
              Led by <strong>Dr. Chaitanya Gupta</strong> (MBBS, MD General Medicine, DM Gastroenterology). Providing expert Upper GI Endoscopy, fatty liver reversal, chronic acidity relief, and internal medicine in Vrindavan with a transparent ₹200 OPD fee.
            </p>

            {/* CTA Pill Buttons (Stacked on mobile, row on tablet/desktop) */}
            <div className="hero-anime-item flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1 sm:pt-2 w-full sm:w-auto">
              <button
                onClick={onOpenAppointment}
                className="flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-full bg-[#0F766E] hover:bg-[#0D9488] active:bg-[#0D9488] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#0F766E]/25 transition-all hover:scale-105 active:scale-95 cursor-pointer min-h-[44px]"
              >
                <Calendar className="w-4 h-4 text-white" />
                <span>Book OPD (₹200 Fee)</span>
              </button>

              <a
                href="#gastro-explorer"
                onClick={(e) => {
                  e.preventDefault();
                  const lenis = getLenis();
                  if (lenis) lenis.scrollTo('#gastro-explorer', { offset: -110 });
                  else document.getElementById('gastro-explorer')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 rounded-full bg-slate-900 text-white font-bold text-sm sm:text-base shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer min-h-[44px]"
              >
                <span className="text-base">🔬</span>
                <span>Gastro Explorer</span>
              </a>

              <a
                href="#screener"
                onClick={(e) => {
                  e.preventDefault();
                  const lenis = getLenis();
                  if (lenis) lenis.scrollTo('#screener', { offset: -110 });
                  else document.getElementById('screener')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-sm sm:text-base shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer min-h-[44px]"
              >
                <Stethoscope className="w-4 h-4 text-[#0F766E]" />
                <span>Symptom Checker</span>
              </a>
            </div>

            {/* Rating Badge */}
            <div className="hero-anime-item pt-2 sm:pt-4 flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
              <span>Justdial Rating <strong className="text-slate-900 font-bold">4.5 / 5</strong></span>
              <div className="flex items-center text-[#F59E0B] gap-0.5">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
              </div>
              <span className="text-slate-500 font-medium">Based On 65+ Verified Ratings</span>
            </div>

          </div>

          {/* Right Column: Doctor Portrait & Concentric Circles Graphics */}
          <div className="lg:col-span-5 relative flex items-center justify-center pt-4 lg:pt-0">
            <div className="relative w-full max-w-[320px] sm:max-w-md lg:max-w-none flex justify-center items-center">
              
              {/* Concentric Circle Backdrops */}
              <div ref={circle1Ref} className="absolute w-[260px] h-[260px] sm:w-[380px] sm:h-[380px] bg-[#CCFBF1] rounded-full -z-10" />
              <div ref={circle2Ref} className="absolute w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] bg-[#A7F3D0] rounded-full -z-10" />

              {/* Main Doctor Frame */}
              <div className="hero-doctor-frame relative w-full max-w-[260px] sm:max-w-[340px] h-[340px] sm:h-[450px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-white border-4 border-white transition-transform duration-300 hover:scale-[1.02]">
                <img
                  src={heroProcedureImg}
                  alt="Dr. Chaitanya Gupta - Advanced ERCP & Upper GI Endoscopy in Vrindavan"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                
                {/* Live Endoscopy Suite Tag */}
                <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 bg-emerald-600/90 text-white backdrop-blur-md px-2 sm:px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-md border border-white/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>ERCP &amp; Endoscopy OT</span>
                </div>

                <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 text-white p-2 sm:p-2.5 text-center bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/20">
                  <div className="text-xs sm:text-sm font-bold">Dr. Chaitanya Gupta</div>
                  <div className="text-[10px] sm:text-[11px] text-teal-200 font-semibold">MBBS, MD (2018), DM (Gastroenterology)</div>
                  <div className="text-[9px] sm:text-[10px] text-emerald-300 font-medium mt-0.5">Advanced ERCP &amp; Upper GI Endoscopy • ₹200 Fee</div>
                </div>
              </div>

              {/* Floating Badge 1: Top Left Experience */}
              <div ref={badge1Ref} className="absolute top-4 left-0 sm:-left-6 bg-white/95 backdrop-blur-md py-1.5 px-3 sm:py-2 sm:px-3.5 rounded-xl sm:rounded-2xl shadow-xl border border-slate-100 flex items-center gap-2.5 z-20 max-w-[85%]">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-[#0F766E] shrink-0 shadow-xs bg-slate-100">
                  <img
                    src="/images/dr_chaitanya_press_conf.jpeg"
                    alt="Dr. Chaitanya Gupta"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <div className="text-[11px] sm:text-[12px] font-extrabold text-slate-900 leading-tight">
                    Dr. Chaitanya Gupta
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-[#0F766E] font-bold">
                    DM Gastroenterology
                  </div>
                </div>
              </div>

              {/* Floating Badge 2: Bottom Right Client Count */}
              <div ref={badge2Ref} className="absolute bottom-12 right-0 sm:-right-6 bg-white/95 backdrop-blur-md py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl sm:rounded-2xl shadow-xl border border-slate-100 flex items-center gap-2.5 max-w-[85%]">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#0F766E] text-white flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div ref={countRef} className="text-sm sm:text-base font-extrabold text-slate-900 leading-none">65+</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5">Verified Reviews (4.5★)</div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Gleneagles-style Floating Search Bar */}
        <div className="hero-anime-item mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-slate-200/80 relative z-20">
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative">
            <div className="relative flex items-center bg-white rounded-2xl shadow-lg border border-slate-200/90 p-1 sm:p-1.5 focus-within:ring-2 focus-within:ring-[#0F766E]/30 focus-within:border-[#0F766E] transition-all">
              <div className="pl-3 sm:pl-4 pr-1.5 sm:pr-2 text-slate-400">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#0F766E]" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Endoscopy, Fatty Liver, Acidity, Diabetes..."
                className="w-full py-2 sm:py-2.5 pr-2 sm:pr-4 text-xs sm:text-base font-medium text-slate-800 placeholder-slate-400 outline-hidden bg-transparent"
              />
              <button
                type="submit"
                className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0D9488] active:bg-[#0D9488] text-white font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 min-h-[44px]"
              >
                <span>Search</span>
              </button>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3 justify-center text-[11px] sm:text-xs font-semibold text-slate-500">
              <span className="text-slate-400">Popular:</span>
              {['Upper GI Endoscopy', 'Fatty Liver Reversal', 'Acidity & GERD', '₹200 Consultation', 'Dr. Chaitanya Gupta'].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    setSearchTerm(chip);
                    let target = '#gastro-care';
                    if (chip.includes('Endoscopy')) target = '#technology';
                    if (chip.includes('Chaitanya')) target = '#doctor';
                    if (chip.includes('Fee') || chip.includes('200')) target = '#faq';
                    const lenis = getLenis();
                    if (lenis) lenis.scrollTo(target, { offset: -110 });
                    else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-2.5 sm:px-3 py-1 rounded-full bg-white/80 hover:bg-white text-slate-700 hover:text-[#0F766E] border border-slate-200 shadow-2xs transition-all cursor-pointer min-h-[30px]"
                >
                  {chip}
                </button>
              ))}
            </div>
          </form>
        </div>

      </div>
    </section>
  );
};