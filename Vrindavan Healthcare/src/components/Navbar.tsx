import React, { useState, useEffect } from 'react';
import { Phone, Calendar, Menu, X } from 'lucide-react';
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

  useEffect(() => {
    document.body.classList.toggle('mobile-menu-open', mobileMenuOpen);
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setIsVisible(true);
    const offset = window.innerWidth >= 1024 ? 110 : 70;
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(href, { offset: -offset });
    } else {
      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
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
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out transform ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        {/* Main Navbar */}
        <header
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAFAF8]/95 backdrop-blur-md shadow-xs py-3 sm:py-3.5 border-b border-slate-200/80'
            : 'bg-[#FAFAF8] py-3.5 sm:py-4 border-b border-slate-200/60'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 w-full">
          {/* Brand Logo with Medtrust Asterisk Symbol */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="flex items-center gap-2.5 group shrink-0 min-w-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg sm:text-xl shadow-xs group-hover:rotate-45 transition-transform duration-300 shrink-0">
              ✱
            </div>
            <div className="shrink min-w-0">
              <div className="font-sans text-sm sm:text-base font-extrabold text-slate-900 tracking-wider uppercase leading-none">
                Vrindavan <span className="text-slate-500 font-medium">Healthcare</span>
              </div>
              <div className="text-[8px] sm:text-[9px] text-slate-400 font-semibold tracking-wider uppercase mt-1 truncate">
                Dr. Chaitanya Gupta • DM Gastro
              </div>
            </div>
          </a>

          {/* Desktop Navigation Links (Centered, clean sans-serif) */}
          <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-2">
            {[
              { name: 'Home', href: '#hero' },
              { name: 'About Doctor', href: '#about-us' },
              { name: 'Services', href: '#gastro-care' },
              { name: 'Endoscopy OT', href: '#technology' },
              { name: 'Symptom Checker', href: '#screener' },
              { name: '2 Clinics', href: '#location' },
            ].map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-3.5 py-2 rounded-full text-xs xl:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all whitespace-nowrap min-h-[36px] flex items-center"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action: Search Circle + Black Pill Button */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <a
              href="#screener"
              onClick={(e) => handleNavClick(e, '#screener')}
              aria-label="Search and Screener"
              className="w-10 h-10 rounded-full border border-slate-300/80 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 shadow-2xs transition-all min-h-[40px] min-w-[40px]"
            >
              <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </a>

            <button
              onClick={onOpenAppointment}
              className="flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 shadow-xs transition-all hover:scale-102 active:scale-98 cursor-pointer min-h-[42px]"
            >
              <span>Contact Us</span>
            </button>
          </div>

          {/* Mobile/Tablet Menu Toggle Button (< 1024px) */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <a
              href={`tel:${CLINIC_INFO.phoneRaw}`}
              aria-label="Call Clinic"
              className="w-10 h-10 rounded-full text-slate-900 bg-slate-100 active:bg-slate-200 flex items-center justify-center transition-colors sm:hidden min-h-[44px] min-w-[44px]"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 rounded-full text-slate-900 hover:bg-slate-100 active:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer min-h-[44px] min-w-[44px]"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>
    </div>

    {/* Full-Screen Mobile & Tablet Drawer Menu (Rendered outside the transform wrapper for reliable 100vh overlay) */}
    {mobileMenuOpen && (
      <div className="lg:hidden fixed inset-0 z-[100] bg-white flex flex-col justify-between animate-fadeIn">
        {/* Top Header inside Drawer */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-100 bg-[#FAFAF8]">
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-base shadow-xs">
              ✱
            </div>
            <div>
              <div className="font-sans text-sm font-extrabold text-slate-900 tracking-wider uppercase leading-none">
                Vrindavan <span className="text-slate-500 font-medium">Healthcare</span>
              </div>
              <div className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
                Dr. Chaitanya Gupta • DM Gastro
              </div>
            </div>
          </a>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="w-10 h-10 rounded-full text-slate-900 hover:bg-slate-100 active:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links with smooth scroll */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-1">
          {mobileNavLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="px-4 py-3 rounded-2xl text-sm font-bold text-slate-800 hover:text-slate-900 hover:bg-slate-100/80 active:bg-slate-100 transition-colors flex items-center justify-between min-h-[46px]"
            >
              <span>{link.name}</span>
              <span className="text-xs text-slate-400">➔</span>
            </a>
          ))}
        </div>

        {/* Drawer Bottom Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-[#FAFAF8] space-y-2.5 shrink-0 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <a
            href={`tel:${CLINIC_INFO.phoneRaw}`}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-xs font-bold text-slate-800 bg-white border border-slate-200 shadow-2xs active:bg-slate-50 min-h-[44px]"
          >
            <Phone className="w-4 h-4 text-slate-900" />
            <span>Call Clinic ({CLINIC_INFO.phone})</span>
          </a>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAppointment();
            }}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 active:scale-98 shadow-sm min-h-[46px] cursor-pointer transition-transform"
          >
            <Calendar className="w-4 h-4 text-white" />
            <span>Book Appointment (₹200 Fee)</span>
          </button>

          <div className="text-center text-[10px] text-slate-500 font-medium">
            OPD Fee: ₹200 • Mon-Sat 9am-7pm | Sun 9am-2pm
          </div>
        </div>
      </div>
    )}
  </>
);
};

