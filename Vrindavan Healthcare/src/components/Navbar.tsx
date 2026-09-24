import React, { useState, useEffect } from 'react';
import { Phone, Calendar, Menu, X, Activity, Clock, MapPin } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';
import { getLenis } from '../hooks/useSmoothScroll';

interface NavbarProps {
  onOpenAppointment: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAppointment }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'About Doctor', href: '#about-us' },
    { name: 'Gastro Explorer', href: '#gastro-explorer' },
    { name: 'Symptom Checker', href: '#screener' },
    { name: 'Liver & Gastro', href: '#gastro-care' },
    { name: 'General Medicine', href: '#general-medicine' },
    { name: 'Dr. Profile', href: '#doctor' },
    { name: 'Endoscopy Tech', href: '#technology' },
    { name: 'Outcomes', href: '#results-gallery' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Clinics & Map', href: '#location' },
  ];

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out transform ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      {/* Top Utility Header Bar */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-slate-800 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Locations & Working Hours */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <MapPin className="w-3.5 h-3.5" />
              <span>Raman Reti (Near ISKCON) &amp; Hanuman Bagh, Vrindavan</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium text-slate-300">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
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
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] shadow-sm transition-all animate-pulse"
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
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3'
            : 'bg-white py-4 border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4 w-full relative">
          {/* Brand Logo */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="flex items-center gap-2.5 sm:gap-3 group shrink-0 z-10 bg-white"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0F766E] flex items-center justify-center text-white shadow-md shadow-[#0F766E]/20 group-hover:bg-[#0D9488] transition-colors shrink-0">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div className="shrink-0">
              <div className="font-sans text-base sm:text-lg xl:text-xl font-bold text-slate-900 tracking-tight leading-none">
                Dr. Chaitanya <span className="text-[#0F766E]">Gupta</span>
              </div>
              <div className="text-[9px] sm:text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-1">
                Vrindavan Healthcare • Liver &amp; Gastro
              </div>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center justify-center gap-0.5 xl:gap-1 2xl:gap-1.5 flex-1 min-w-0 mx-1 xl:mx-3 overflow-hidden">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-1.5 xl:px-2.5 2xl:px-3 py-1.5 rounded-full text-[11px] xl:text-xs 2xl:text-sm font-semibold text-slate-700 hover:text-[#0F766E] hover:bg-[#F0FDFA] transition-all whitespace-nowrap shrink-0"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action Button */}
          <div className="hidden sm:flex items-center gap-3 shrink-0 z-10 bg-white">
            <button
              onClick={onOpenAppointment}
              className="flex items-center gap-2 px-3.5 xl:px-5 py-2.5 rounded-full text-xs xl:text-sm font-bold text-white bg-[#0F766E] hover:bg-[#0D9488] shadow-md shadow-[#0F766E]/30 transition-all hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book OPD (₹200)</span>
            </button>
          </div>

          {/* Mobile/Tablet Menu Toggle Button (< 1280px) */}
          <div className="flex xl:hidden items-center gap-2 shrink-0">
            <a
              href={`tel:${CLINIC_INFO.phoneRaw}`}
              aria-label="Call Clinic"
              className="p-2.5 rounded-full text-[#0F766E] bg-[#F0FDFA] sm:hidden"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-full text-slate-700 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Drawer Menu (< 1280px) */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-2 pt-3 pb-5 px-4 bg-white border-t border-slate-100 shadow-xl animate-fadeIn">
            <div className="flex flex-col space-y-1 mb-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:text-[#0F766E] hover:bg-[#F0FDFA]"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
              <a
                href={`tel:${CLINIC_INFO.phoneRaw}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-[#0F766E] bg-[#F0FDFA]"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Clinic ({CLINIC_INFO.phone})</span>
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAppointment();
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#0F766E] shadow-md"
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
