import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Phone, Calendar, MapPin, Stethoscope, Search } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';

/* ─── Animated Heartbeat SVG ─── */
const HeartbeatLine: React.FC = () => {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    const animate = () => {
      path.style.transition = 'none';
      path.style.strokeDashoffset = `${length}`;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          path.style.transition = 'stroke-dashoffset 2.8s cubic-bezier(0.4, 0, 0.2, 1)';
          path.style.strokeDashoffset = '0';
        });
      });
    };

    animate();
    const interval = setInterval(animate, 3600);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg
      viewBox="0 0 600 100"
      className="w-full max-w-xl mx-auto h-16 sm:h-20"
      fill="none"
      aria-hidden="true"
    >
      {/* Track (dim line) */}
      <path
        d="M0 50 L150 50 L175 50 L195 15 L215 85 L235 20 L255 75 L275 35 L295 50 L320 50 L600 50"
        stroke="rgba(15, 118, 110, 0.1)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Animated heartbeat */}
      <path
        ref={pathRef}
        d="M0 50 L150 50 L175 50 L195 15 L215 85 L235 20 L255 75 L275 35 L295 50 L320 50 L600 50"
        stroke="url(#heartGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="heartGradient" x1="0" y1="0" x2="600" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0D9488" stopOpacity="0.3" />
          <stop offset="35%" stopColor="#0F766E" />
          <stop offset="65%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor="#0D9488" stopOpacity="0.3" />
        </linearGradient>
      </defs>
    </svg>
  );
};

/* ─── Floating particle dots ─── */
const FloatingParticles: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full"
        style={{
          width: `${4 + Math.random() * 6}px`,
          height: `${4 + Math.random() * 6}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          background: i % 3 === 0
            ? 'rgba(15, 118, 110, 0.12)'
            : i % 3 === 1
              ? 'rgba(254, 249, 195, 0.5)'
              : 'rgba(230, 247, 245, 0.6)',
          animation: `floatParticle ${5 + Math.random() * 7}s ease-in-out ${Math.random() * 3}s infinite alternate`,
        }}
      />
    ))}
  </div>
);

/* ─── 404 Page Component ─── */
export const NotFound: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const quickLinks = [
    { name: 'Home', href: '/', icon: Home, description: 'Back to main page' },
    { name: 'Call Us', href: `tel:${CLINIC_INFO.phoneRaw}`, icon: Phone, description: CLINIC_INFO.phone, external: true },
    { name: 'Locations', href: '/#location', icon: MapPin, description: '2 Clinic Locations' },
    { name: 'Services', href: '/#gastro-care', icon: Stethoscope, description: 'Gastro & Liver Care' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `https://www.google.com/search?q=site:vrindavanhealthcare.com+${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-slate-900 relative overflow-hidden flex flex-col">
      {/* CSS Keyframes */}
      <style>{`
        @keyframes floatParticle {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0.5; }
          100% { transform: translateY(-30px) translateX(15px) scale(1.3); opacity: 0.9; }
        }
        @keyframes gentlePulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slide-up { animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-up-delay-1 { animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards; opacity: 0; }
        .animate-slide-up-delay-2 { animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }
        .animate-slide-up-delay-3 { animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; opacity: 0; }
        .animate-slide-up-delay-4 { animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards; opacity: 0; }
        .animate-fade-in { animation: fadeIn 1s ease forwards; }
      `}</style>

      <FloatingParticles />

      {/* Ambient gradient orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#E6F7F5]/60 to-transparent blur-3xl -translate-x-1/3 -translate-y-1/3" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tl from-[#FEF9C3]/40 to-transparent blur-3xl translate-x-1/4 translate-y-1/4" aria-hidden="true" />

      {/* Minimal top bar */}
      <header className="relative z-10 w-full bg-[#FAFAF8]/90 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0">
              <img
                src="/favicon.png"
                alt="Vrindavan Healthcare Official Logo"
                className="w-7 h-7 sm:w-9 sm:h-9 object-contain shrink-0 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div>
              <div className="font-sans text-[13px] sm:text-base font-extrabold text-slate-900 tracking-wider uppercase leading-tight sm:leading-none flex items-center gap-1.5">
                <span>Vrindavan</span>
                <span className="text-slate-500 font-medium">Healthcare</span>
              </div>
              <div className="text-[8px] sm:text-[9px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5 sm:mt-1">
                Dr. Chaitanya Gupta • DM Gastro
              </div>
            </div>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] min-h-[38px] sm:min-h-[42px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Go Home</span>
            <span className="sm:hidden">Home</span>
          </Link>
        </div>
      </header>

      {/* Main 404 content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div className="max-w-2xl w-full text-center">
          {/* Heartbeat line */}
          <div className="animate-fade-in mb-4 sm:mb-6">
            <HeartbeatLine />
          </div>

          {/* 404 number */}
          <div className="animate-slide-up">
            <h1
              className="font-serif text-[7rem] sm:text-[9rem] lg:text-[11rem] font-black leading-none tracking-tighter"
              style={{
                background: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 40%, #0D9488 70%, #065F5B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              404
            </h1>
          </div>

          {/* Description */}
          <div className="animate-slide-up-delay-1 mt-2 sm:mt-3">
            <p className="font-serif text-xl sm:text-2xl lg:text-3xl text-slate-800 font-medium tracking-tight leading-snug">
              This page seems to have gone for a checkup
            </p>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-slate-500 font-sans max-w-md mx-auto leading-relaxed">
              The page you're looking for doesn't exist or may have been moved. Let us guide you back to the right place.
            </p>
          </div>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="animate-slide-up-delay-2 mt-6 sm:mt-8 max-w-md mx-auto"
          >
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search our site..."
                className="w-full pl-11 pr-24 py-3.5 rounded-full bg-white border border-slate-200 shadow-sm text-sm text-slate-800 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-2 rounded-full text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 active:scale-[0.96] transition-all cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick action cards */}
          <div className="animate-slide-up-delay-3 mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-lg sm:max-w-2xl mx-auto">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              const content = (
                <div className="group flex flex-col items-center gap-2.5 sm:gap-3 p-4 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/70 shadow-sm hover:shadow-md hover:border-teal-200 hover:bg-white transition-all duration-300 cursor-pointer min-h-[110px] justify-center">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-teal-50 to-mint flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-teal-100/80">
                    <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-teal-700" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-teal-800 transition-colors">
                      {link.name}
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5 font-medium">
                      {link.description}
                    </div>
                  </div>
                </div>
              );

              return link.external ? (
                <a key={link.name} href={link.href}>
                  {content}
                </a>
              ) : (
                <Link key={link.name} to={link.href}>
                  {content}
                </Link>
              );
            })}
          </div>

          {/* Primary CTA */}
          <div className="animate-slide-up-delay-4 mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 shadow-md hover:shadow-lg transition-all hover:scale-[1.03] active:scale-[0.97] min-h-[48px]"
            >
              <Home className="w-4 h-4" />
              Return to Homepage
            </Link>
            <a
              href={`tel:${CLINIC_INFO.phoneRaw}`}
              className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold text-teal-800 bg-teal-50 border border-teal-200 hover:bg-teal-100 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] min-h-[48px]"
            >
              <Phone className="w-4 h-4" />
              Call {CLINIC_INFO.phone}
            </a>
          </div>

          {/* Footer note */}
          <p className="animate-slide-up-delay-4 mt-8 sm:mt-10 text-[11px] sm:text-xs text-slate-400 font-medium">
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              OPD Available Mon-Sat 9 AM – 7 PM &nbsp;•&nbsp; Sun 9 AM – 2 PM
            </span>
          </p>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
