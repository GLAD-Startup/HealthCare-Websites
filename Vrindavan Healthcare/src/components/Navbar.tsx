import React, { useState, useEffect } from 'react';
import { Phone, Calendar, Menu, X, Activity, Clock, MapPin, ChevronDown, UserCheck, HelpCircle, Stethoscope, Sparkles } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';
import { getLenis } from '../hooks/useSmoothScroll';
import vrindavanLogo from '../assets/Vrindavan_Healthcare_logo.png';

interface NavbarProps {
  onOpenAppointment: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAppointment }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (currentScrollY > 100 && currentScrollY > lastScrollY && !mobileMenuOpen) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY || currentScrollY <= 40) {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
    setIsVisible(true);
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(href, { offset: -110 });
    } else {
      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        const offset = 110;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  const primaryNavLinks = [
    { name: 'About Doctor', href: '#about-us' },
    { name: 'Liver & Gastro', href: '#gastro-care' },
    { name: 'General Medicine', href: '#general-medicine' },
    { name: 'Endoscopy Tech', href: '#technology' },
  ];

  const mobileNavLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'About Doctor', href: '#about-us' },
    { name: 'Liver & Gastro Care', href: '#gastro-care' },
    { name: 'General Medicine', href: '#general-medicine' },
    { name: 'Endoscopy Tech & OT', href: '#technology' },
    { name: 'Symptom Checker', href: '#screener' },
    { name: 'Gastro Explorer', href: '#gastro-explorer' },
    { name: 'Dr. Profile & Credentials', href: '#doctor' },
    { name: 'Treatment Outcomes', href: '#results-gallery' },
    { name: '2 Clinics & Locations', href: '#location' },
    { name: 'Frequently Asked Questions', href: '#faq' },
  ];

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out transform ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      {/* Top Utility Header Bar (Hidden on Mobile & Tablet < 1024px to prevent overflow) */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-slate-800 hidden lg:block">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          {/* Left: Locations & Working Hours */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>Raman Reti (Near ISKCON) &amp; Hanuman Bagh, Vrindavan</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium text-slate-300">
              <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>OPD Fee: ₹200 | Mon-Sat: 9am-7pm | Sun: 9am-2pm</span>
            </div>
          </div>

          {/* Right: Secondary Links & Emergency Hotline */}
          <div className="flex items-center space-x-5">
            <div className="flex items-center space-x-4 text-slate-300 font-medium">
              <a href="#about-us" onClick={(e) => handleNavClick(e, '#about-us')} className="hover:text-white transition-colors">About</a>
              <a href="#screener" onClick={(e) => handleNavClick(e, '#screener')} className="hover:text-white transition-colors">Symptom Checker</a>
              <a href="#faq" onClick={(e) => handleNavClick(e, '#faq')} className="hover:text-white transition-colors">FAQs</a>
              <a href="#location" onClick={(e) => handleNavClick(e, '#location')} className="hover:text-white transition-colors">2 Clinics</a>
            </div>

            <div className="h-3 w-px bg-slate-700" />

            {/* Helpline / Emergency Button */}
            <a
              href={`tel:${CLINIC_INFO.phoneRaw}`}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] shadow-sm transition-all animate-pulse whitespace-nowrap min-h-[32px]"
            >
              <Phone className="w-3 h-3 text-white" />
              <span>APPOINTMENT: {CLINIC_INFO.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-2.5 sm:py-3'
            : 'bg-white py-3 sm:py-3.5 border-b border-slate-100'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4 w-full">
          {/* Brand Logo */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="flex items-center gap-2.5 sm:gap-3 group shrink-0 min-w-0"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-white shadow-md shadow-[#0F766E]/15 border border-slate-200/90 group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center p-0.5">
              <img
                src={vrindavanLogo}
                alt="Vrindavan Healthcare Official Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div className="shrink min-w-0">
              <div className="font-sans text-sm sm:text-base xl:text-lg font-extrabold text-slate-900 tracking-tight leading-none truncate">
                Vrindavan <span className="text-[#0F766E]">Healthcare</span>
              </div>
              <div className="text-[8px] sm:text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-1 truncate">
                Dr. Chaitanya Gupta • DM Gastro
              </div>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center justify-center gap-1.5 2xl:gap-2 shrink-0">
            {primaryNavLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-3 py-1.5 rounded-full text-xs 2xl:text-sm font-semibold text-slate-700 hover:text-[#0F766E] hover:bg-[#F0FDFA] transition-all whitespace-nowrap min-h-[36px] flex items-center"
              >
                {link.name}
              </a>
            ))}

            {/* Explore & More Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setMoreMenuOpen(true)}
              onMouseLeave={() => setMoreMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => setMoreMenuOpen((prev) => !prev)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs 2xl:text-sm font-semibold text-slate-700 hover:text-[#0F766E] hover:bg-[#F0FDFA] transition-all whitespace-nowrap cursor-pointer min-h-[36px]"
                aria-expanded={moreMenuOpen}
              >
                <span>Explore &amp; More</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreMenuOpen ? 'rotate-180 text-[#0F766E]' : 'text-slate-400'}`} />
              </button>

              {moreMenuOpen && (
                <div className="absolute right-0 top-full pt-1.5 w-72 z-50 animate-fadeIn">
                  <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 backdrop-blur-xl">
                    <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      Patient Interactive Tools
                    </div>
                    <a
                      href="#screener"
                      onClick={(e) => {
                        setMoreMenuOpen(false);
                        handleNavClick(e, '#screener');
                      }}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#0F766E] hover:bg-[#F0FDFA] transition-colors group/item"
                    >
                      <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#0F766E] flex items-center justify-center shrink-0 group-hover/item:bg-[#0F766E] group-hover/item:text-white transition-colors">
                        <Stethoscope className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-slate-800 font-bold leading-tight">Symptom Checker</div>
                        <div className="text-[10px] text-slate-400 font-normal">Self-assessment screener</div>
                      </div>
                    </a>
                    <a
                      href="#gastro-explorer"
                      onClick={(e) => {
                        setMoreMenuOpen(false);
                        handleNavClick(e, '#gastro-explorer');
                      }}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#0F766E] hover:bg-[#F0FDFA] transition-colors group/item"
                    >
                      <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#0F766E] flex items-center justify-center shrink-0 group-hover/item:bg-[#0F766E] group-hover/item:text-white transition-colors">
                        <Activity className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-slate-800 font-bold leading-tight">Gastro Explorer</div>
                        <div className="text-[10px] text-slate-400 font-normal">Condition &amp; organ simulator</div>
                      </div>
                    </a>

                    <div className="my-1.5 border-t border-slate-100" />
                    <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      Clinic &amp; Outcomes
                    </div>

                    <a
                      href="#doctor"
                      onClick={(e) => {
                        setMoreMenuOpen(false);
                        handleNavClick(e, '#doctor');
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#0F766E] hover:bg-[#F0FDFA] transition-colors"
                    >
                      <UserCheck className="w-4 h-4 text-[#0F766E] shrink-0" />
                      <span>Doctor Credentials</span>
                    </a>
                    <a
                      href="#results-gallery"
                      onClick={(e) => {
                        setMoreMenuOpen(false);
                        handleNavClick(e, '#results-gallery');
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#0F766E] hover:bg-[#F0FDFA] transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-[#0F766E] shrink-0" />
                      <span>Treatment Outcomes Gallery</span>
                    </a>
                    <a
                      href="#location"
                      onClick={(e) => {
                        setMoreMenuOpen(false);
                        handleNavClick(e, '#location');
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#0F766E] hover:bg-[#F0FDFA] transition-colors"
                    >
                      <MapPin className="w-4 h-4 text-[#0F766E] shrink-0" />
                      <span>2 Clinics &amp; Map</span>
                    </a>
                    <a
                      href="#faq"
                      onClick={(e) => {
                        setMoreMenuOpen(false);
                        handleNavClick(e, '#faq');
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#0F766E] hover:bg-[#F0FDFA] transition-colors"
                    >
                      <HelpCircle className="w-4 h-4 text-[#0F766E] shrink-0" />
                      <span>Frequently Asked Questions</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Action Button */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenAppointment}
              className="flex items-center gap-2 px-4 xl:px-5 py-2.5 rounded-full text-xs xl:text-sm font-bold text-white bg-[#0F766E] hover:bg-[#0D9488] shadow-md shadow-[#0F766E]/30 transition-all hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer min-h-[44px]"
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span>Book OPD (₹200)</span>
            </button>
          </div>

          {/* Mobile/Tablet Menu Toggle Button (< 1280px, min 44x44px touch target) */}
          <div className="flex xl:hidden items-center gap-1.5 sm:gap-2 shrink-0">
            <a
              href={`tel:${CLINIC_INFO.phoneRaw}`}
              aria-label="Call Clinic"
              className="w-10 h-10 rounded-full text-[#0F766E] bg-[#F0FDFA] active:bg-[#CCFBF1] flex items-center justify-center transition-colors sm:hidden min-h-[44px] min-w-[44px]"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 rounded-full text-slate-700 hover:bg-slate-100 active:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer min-h-[44px] min-w-[44px]"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Drawer Menu (< 1280px) */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-2 pt-3 pb-5 px-4 bg-white border-t border-slate-100 shadow-2xl animate-fadeIn max-h-[calc(100vh-80px)] overflow-y-auto">
            {/* Mobile Drawer Brand Header */}
            <div className="flex items-center gap-3 pb-3 mb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white shadow-sm border border-slate-200 shrink-0 p-0.5">
                <img
                  src={vrindavanLogo}
                  alt="Vrindavan Healthcare Official Logo"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-extrabold text-slate-900 leading-tight">Vrindavan Healthcare</div>
                <div className="text-[10px] text-[#0F766E] font-semibold">Dr. Chaitanya Gupta • DM Gastro</div>
              </div>
            </div>

            <div className="flex flex-col space-y-1 mb-4">
              {mobileNavLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-3.5 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:text-[#0F766E] hover:bg-[#F0FDFA] active:bg-[#CCFBF1] transition-colors flex items-center justify-between min-h-[44px]"
                >
                  <span>{link.name}</span>
                  <span className="text-slate-300 text-xs">→</span>
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
              <a
                href={`tel:${CLINIC_INFO.phoneRaw}`}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-bold text-[#0F766E] bg-[#F0FDFA] active:bg-[#CCFBF1] min-h-[44px]"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Clinic ({CLINIC_INFO.phone})</span>
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAppointment();
                }}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-bold text-white bg-[#0F766E] active:bg-[#0D9488] shadow-md min-h-[44px] cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book OPD (₹200 Fee)</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

