import React, { useState } from 'react';
import {
  Phone,
  Clock,
  MapPin,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Mail,
  Star,
  CheckCircle2,
  ShieldCheck,
  Stethoscope,
  Sliders,
  Calendar,
  UserCheck,
  MessageCircle,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';
import { getLenis } from '../hooks/useSmoothScroll';
import gladStudioLogo from '../assets/website logo(white background compatible).png';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('clinics');

  const toggleAccordion = (id: string) => {
    setOpenAccordion((prev) => (prev === id ? null : id));
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmail('');
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(href, { offset: -70 });
    } else {
      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'About Doctor', href: '#about-us' },
    { label: 'Gastro Services', href: '#gastro-care' },
    { label: 'General Medicine', href: '#general-medicine' },
    { label: 'Symptom Screener', href: '#screener' },
    { label: 'Book OPD (₹200)', href: '#contact' },
  ];

  return (
    <footer className="bg-[#FAFAF8] text-slate-700 border-t border-slate-200/80">
      
      {/* ========================================================================= */}
      {/* 1. MOBILE PHONE APPLICATION FOOTER (Visible on Mobile Screens: md:hidden) */}
      {/* ========================================================================= */}
      <div className="md:hidden px-4 pt-8 pb-6 space-y-5 max-w-lg mx-auto">
        
        {/* App Profile Header Card */}
        <div className="bg-gradient-to-b from-white via-white to-slate-50/70 rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
          {/* App Top Bar */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center p-2 shadow-sm border border-slate-800">
                <img
                  src="/favicon.png"
                  alt="Vrindavan Healthcare App"
                  className="w-full h-full object-contain drop-shadow-2xs"
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-2.5 h-2.5 text-white stroke-[3]" />
              </span>
            </div>
            <div>
              <div className="font-sans text-base font-extrabold text-slate-900 leading-tight">
                Vrindavan Healthcare
              </div>
              <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mt-0.5">
                <UserCheck className="w-3 h-3 text-teal-700 shrink-0" />
                <span className="truncate">Dr. Chaitanya Gupta • DM Gastro</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Specialized liver, gastrointestinal, endoscopy &amp; comprehensive medicine care serving Vrindavan and Mathura district.
          </p>

          {/* Quick App Value Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 py-1">
            <div className="p-2 rounded-xl bg-[#FEF9C3]/80 border border-amber-300/70 text-center">
              <div className="text-xs font-black text-slate-900 flex items-center justify-center gap-1">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>4.5 / 5</span>
              </div>
              <div className="text-[10px] text-amber-900 font-semibold mt-0.5">65+ Reviews</div>
            </div>

            <div className="p-2 rounded-xl bg-[#E6F7F5] border border-teal-200/80 text-center">
              <div className="text-xs font-black text-teal-950">₹200 Only</div>
              <div className="text-[10px] text-teal-800 font-semibold mt-0.5">OPD Consult</div>
            </div>

            <div className="p-2 rounded-xl bg-slate-100/90 border border-slate-200 text-center">
              <div className="text-xs font-black text-slate-900">2 Centers</div>
              <div className="text-[10px] text-slate-600 font-semibold mt-0.5">Vrindavan</div>
            </div>
          </div>

          {/* Hero App CTA Button */}
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider shadow-sm active:scale-95 transition-all text-center min-h-[46px]"
          >
            <Calendar className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Book Priority OPD Consultation (₹200)</span>
            <ArrowRight className="w-3.5 h-3.5 text-white/80 shrink-0" />
          </a>

          {/* Quick 2-button contact row */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:${CLINIC_INFO.phoneRaw}`}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-bold shadow-2xs active:scale-95 transition-all text-center min-h-[40px]"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Call Clinic</span>
            </a>

            <a
              href={CLINIC_INFO.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 text-emerald-950 text-xs font-bold shadow-2xs active:scale-95 transition-all text-center min-h-[40px]"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
              <span>WhatsApp OPD</span>
            </a>
          </div>
        </div>

        {/* Emergency Alert Banner */}
        <div className="p-3.5 rounded-2xl bg-rose-50/90 border border-rose-200/90 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-rose-950 truncate">Acute GI Emergency or Bleed?</div>
              <div className="text-[10px] text-rose-700 truncate">Immediate Clinical Line: {CLINIC_INFO.phone}</div>
            </div>
          </div>
          <a
            href={`tel:${CLINIC_INFO.phoneRaw}`}
            className="px-3 py-1.5 rounded-xl bg-rose-600 active:bg-rose-700 text-white text-[11px] font-bold shrink-0 shadow-2xs active:scale-95 transition-all"
          >
            Call Now
          </a>
        </div>

        {/* Mobile App Quick-Action Tiles (2x3 Grid) */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1 flex items-center justify-between">
            <span>App Quick Actions</span>
            <span className="text-[10px] text-slate-400 font-normal">1-tap navigation</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Tile 1: Services */}
            <a
              href="#gastro-care"
              onClick={(e) => handleNavClick(e, '#gastro-care')}
              className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-2.5 active:scale-95 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center shrink-0 border border-teal-100">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">Clinical Care</div>
                <div className="text-[10px] text-slate-500 truncate">Gastro &amp; Liver</div>
              </div>
            </a>

            {/* Tile 2: Simulator */}
            <a
              href="#gastro-explorer"
              onClick={(e) => handleNavClick(e, '#gastro-explorer')}
              className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-2.5 active:scale-95 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 border border-amber-100">
                <Sliders className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">Organ Viewer</div>
                <div className="text-[10px] text-slate-500 truncate">Tissue Recovery</div>
              </div>
            </a>

            {/* Tile 3: Screener */}
            <a
              href="#screener"
              onClick={(e) => handleNavClick(e, '#screener')}
              className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-2.5 active:scale-95 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">Symptom Check</div>
                <div className="text-[10px] text-slate-500 truncate">Triage Screener</div>
              </div>
            </a>

            {/* Tile 4: Doctor Profile */}
            <a
              href="#doctor"
              onClick={(e) => handleNavClick(e, '#doctor')}
              className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-2.5 active:scale-95 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-800 flex items-center justify-center shrink-0 border border-indigo-100">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">Doctor Profile</div>
                <div className="text-[10px] text-slate-500 truncate">Qualifications</div>
              </div>
            </a>

            {/* Tile 5: Reviews */}
            <a
              href={CLINIC_INFO.social.justdial}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-2.5 active:scale-95 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">4.5★ Reviews</div>
                <div className="text-[10px] text-slate-500 truncate">Justdial Verified</div>
              </div>
            </a>

            {/* Tile 6: Clinic Locations */}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-2.5 active:scale-95 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-800 flex items-center justify-center shrink-0 border border-rose-100">
                <MapPin className="w-4 h-4 text-rose-600" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">Both Clinics</div>
                <div className="text-[10px] text-slate-500 truncate">Raman Reti &amp; City</div>
              </div>
            </a>
          </div>
        </div>

        {/* Mobile Accordions: Collapsible Drawers */}
        <div className="space-y-2.5">
          {/* Drawer 1: Clinic Locations & Hours */}
          <div className="rounded-2xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden">
            <button
              onClick={() => toggleAccordion('clinics')}
              className="w-full flex items-center justify-between p-3.5 text-left font-bold text-xs text-slate-900 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>2 Vrindavan Clinics &amp; Hours</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  openAccordion === 'clinics' ? 'rotate-180 text-slate-900' : ''
                }`}
              />
            </button>

            {openAccordion === 'clinics' && (
              <div className="p-3.5 pt-0 border-t border-slate-100 space-y-2.5 text-xs">
                {/* Location A */}
                <div className="p-2.5 rounded-xl bg-[#FAFAF8] border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Raman Reti (Near ISKCON)</span>
                    <a
                      href={CLINIC_INFO.mapsDirectionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1"
                    >
                      <span>Map</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Opp. Chandra Shekhar Dhanuka Ashram, Parikrama Marg, Vrindavan
                  </p>
                </div>

                {/* Location B */}
                <div className="p-2.5 rounded-xl bg-[#FAFAF8] border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Hanuman Bagh (City Centre)</span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      Daily OPD
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Bankey Bihari Nikunj, Hanuman Bagh, Vrindavan
                  </p>
                </div>

                {/* Hours & Phone Bar */}
                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>Mon-Sat: 9am-7pm • Sun: 9am-2pm</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Drawer 2: Page Navigation Links */}
          <div className="rounded-2xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden">
            <button
              onClick={() => toggleAccordion('nav')}
              className="w-full flex items-center justify-between p-3.5 text-left font-bold text-xs text-slate-900 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-slate-500" />
                <span>Complete Page Navigation</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  openAccordion === 'nav' ? 'rotate-180 text-slate-900' : ''
                }`}
              />
            </button>

            {openAccordion === 'nav' && (
              <div className="p-3.5 pt-0 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="p-2 rounded-xl bg-[#FAFAF8] border border-slate-200/70 text-slate-700 font-medium active:bg-slate-200 flex items-center justify-between"
                  >
                    <span className="truncate">{link.label}</span>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Drawer 3: Patient Care Policies & Disclaimers */}
          <div className="rounded-2xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden">
            <button
              onClick={() => toggleAccordion('legal')}
              className="w-full flex items-center justify-between p-3.5 text-left font-bold text-xs text-slate-900 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Patient Policies &amp; Medical Notice</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  openAccordion === 'legal' ? 'rotate-180 text-slate-900' : ''
                }`}
              />
            </button>

            {openAccordion === 'legal' && (
              <div className="p-3.5 pt-0 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <p className="text-[11px] leading-relaxed">
                  <strong>Medical Disclaimer:</strong> Content on this portal is for health awareness, appointment scheduling, and patient education under Dr. Chaitanya Gupta. In acute emergencies, contact local emergency services immediately.
                </p>
                <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
                  <a href="#about-us" onClick={(e) => handleNavClick(e, '#about-us')} className="hover:underline">Privacy Policy</a>
                  <span>•</span>
                  <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} className="hover:underline">Terms of Care</a>
                  <span>•</span>
                  <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} className="hover:underline">Patient Notice</a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Newsletter Subscription App Tile */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-700" />
            <h5 className="text-xs font-bold text-slate-900">
              Get Daily Gastro &amp; Liver Health Tips
            </h5>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">
            Preventive digestive tips delivered directly to your inbox.
          </p>

          <form onSubmit={handleSubscribe} className="relative flex items-center">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address..."
              className="w-full py-2.5 pl-3.5 pr-24 rounded-full border border-slate-300 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-slate-900"
            />
            <button
              type="submit"
              className="absolute right-1 px-4 py-1.5 rounded-full bg-slate-900 text-white font-bold text-[11px] hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
            >
              {subscribed ? 'Joined!' : 'Join'}
            </button>
          </form>

          {subscribed && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Subscribed successfully! Thank you.</span>
            </div>
          )}
        </div>

        {/* App Footer Bottom: Version, Developed by GLAD Studio & Copyright */}
        <div className="pt-2 text-center space-y-3">
          {/* Developed by GLAD Studio App Badge */}
          <div className="inline-flex items-center gap-2 text-slate-500 text-xs font-medium bg-white px-4 py-1.5 rounded-full border border-slate-200/90 shadow-2xs">
            <span>Developed by</span>
            <a
              href="https://gladstudio.net"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center hover:opacity-80 transition-opacity shrink-0"
              title="GLAD Studio"
            >
              <img
                src={gladStudioLogo}
                alt="GLAD Studio"
                style={{ height: '22px', maxHeight: '22px', width: 'auto', display: 'block' }}
                className="h-[22px] max-h-[22px] w-auto object-contain shrink-0"
              />
            </a>
          </div>

          <div className="text-[10px] text-slate-400">
            Vrindavan Healthcare Mobile App • Build v2.5.0
          </div>
          <div className="text-[10px] text-slate-500">
            © {new Date().getFullYear()} Vrindavan Healthcare • Dr. Chaitanya Gupta. All Rights Reserved.
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP EDITORIAL FOOTER (Visible on Tablets & Desktops: hidden md:block) */}
      {/* ========================================================================= */}
      <div className="hidden md:block pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Col 1 (Span 4): Brand Logo, Doctor Credentials & Trust Badges */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="/favicon.png"
                  alt="Vrindavan Healthcare Official Logo"
                  className="w-10 h-10 object-contain shrink-0 drop-shadow-2xs"
                />
                <div>
                  <div className="font-sans text-base sm:text-lg font-black text-slate-900 tracking-wider uppercase leading-none">
                    Vrindavan <span className="text-slate-500 font-medium">Healthcare</span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
                    Dr. Chaitanya Gupta • DM Gastro
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-sm">
                Providing trusted, evidence-based gastrointestinal, liver, and comprehensive medical care for the pilgrimage city of Vrindavan and Mathura district.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF9C3] text-amber-900 border border-amber-300/70 text-[11px] font-bold shadow-2xs">
                  <span>OPD Fee:</span>
                  <span className="text-slate-950 font-black">₹200 only</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F7F5] text-emerald-900 border border-emerald-200 text-[11px] font-semibold shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>2 Vrindavan Clinics</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-slate-600 border border-slate-200 text-[11px] font-medium shadow-2xs">
                  <ShieldCheck className="w-3 h-3 text-slate-500" />
                  <span>DM Certified Specialist</span>
                </div>
              </div>
            </div>

            {/* Col 2 (Span 3): Quick Navigation */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Quick Navigation
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-slate-600">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="hover:text-slate-950 transition-colors inline-flex items-center gap-1.5 group"
                    >
                      <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-slate-900 transition-colors" />
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 (Span 5): Clinics, Locations & Hotline */}
            <div className="lg:col-span-5 space-y-3.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Clinics &amp; Consultation Hours
              </h4>

              {/* Clinic Location Cards */}
              <div className="space-y-2.5">
                <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          Raman Reti Clinic (Near ISKCON)
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                          Opp. Chandra Shekhar Dhanuka Ashram, Parikrama Marg, Raman Reti, Vrindavan
                        </p>
                      </div>
                    </div>
                    <a
                      href={CLINIC_INFO.mapsDirectionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 p-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors"
                      title="Open in Google Maps"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          Hanuman Bagh Clinic (City Centre)
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                          Bankey Bihari Nikunj, Hanuman Bagh, Vrindavan
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 self-center">
                      OPD Daily
                    </span>
                  </div>
                </div>

                {/* Phone & Timings Quick Bar */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={`tel:${CLINIC_INFO.phoneRaw}`}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Direct Helpline</div>
                      <div className="text-xs font-bold tracking-tight truncate">{CLINIC_INFO.phone}</div>
                    </div>
                  </a>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                    <Clock className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">OPD Timings</div>
                      <div className="text-[11px] font-bold text-slate-800">Mon-Sat: 9am-7pm • Sun: 9am-2pm</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Newsletter & Socials Section */}
              <div className="pt-2 border-t border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">
                      Health Updates &amp; Gastro Tips
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      Join patient wellness updates &amp; preventive health advisories.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600 shrink-0">
                    <a
                      href={CLINIC_INFO.social.justdial}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 px-2.5 rounded-full border border-slate-200 bg-white hover:bg-amber-50 transition-all flex items-center gap-1 text-slate-800 shadow-2xs"
                      title="Justdial 4.5/5 Verified Reviews"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span className="text-[11px] font-bold">4.5★</span>
                    </a>
                  </div>
                </div>

                <form onSubmit={handleSubscribe} className="relative flex items-center max-w-md">
                  <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email for updates..."
                    className="w-full py-2.5 pl-10 pr-26 rounded-full border border-slate-300 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-slate-900 transition-colors shadow-2xs"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 px-4 py-1.5 rounded-full bg-slate-900 text-white font-bold text-[11px] hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
                  >
                    {subscribed ? 'Subscribed!' : 'Subscribe'}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>

        {/* Clean Bottom Bar for Desktop */}
        <div className="bg-white text-slate-600 text-xs py-5 px-4 sm:px-6 lg:px-8 border-t border-slate-200/90">
          <div className="max-w-7xl mx-auto flex flex-row items-center justify-between gap-4">
            <div className="text-slate-500 text-xs">
              © {new Date().getFullYear()} Vrindavan Healthcare • Dr. Chaitanya Gupta. All Rights Reserved.
            </div>

            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium bg-[#FAFAF8] px-4 py-1.5 rounded-full border border-slate-200/90 shadow-2xs">
              <span>Developed by</span>
              <a
                href="https://gladstudio.net"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center hover:opacity-80 transition-opacity shrink-0"
                title="GLAD Studio"
              >
                <img
                  src={gladStudioLogo}
                  alt="GLAD Studio"
                  style={{ height: '22px', maxHeight: '22px', width: 'auto', display: 'block' }}
                  className="h-[22px] max-h-[22px] w-auto object-contain shrink-0"
                />
              </a>
            </div>

            <div className="flex items-center gap-4 text-slate-500 text-xs">
              <a href="#about-us" onClick={(e) => handleNavClick(e, '#about-us')} className="hover:text-slate-900 transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} className="hover:text-slate-900 transition-colors">Terms of Care</a>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
};
