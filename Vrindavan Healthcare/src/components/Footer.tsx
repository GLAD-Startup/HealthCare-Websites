import React from 'react';
import { Phone, Clock, ArrowUp, MessageSquare, Award } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';
import vrindavanLogo from '../assets/Vrindavan_Healthcare_logo.png';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-20 sm:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-md border border-slate-700/80 shrink-0 flex items-center justify-center p-0.5">
                <img
                  src={vrindavanLogo}
                  alt="Vrindavan Healthcare Official Logo"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div>
                <div className="font-sans text-xl font-bold text-white tracking-tight">
                  Vrindavan <span className="text-[#0F766E]">Healthcare</span>
                </div>
                <div className="text-xs text-slate-400 font-medium">
                  {CLINIC_INFO.altName} • Dr. Chaitanya Gupta
                </div>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              "{CLINIC_INFO.tagline}" — Bringing super-specialty Upper GI Endoscopy, fatty liver protocols, and internal medicine to Vrindavan at an accessible ₹200 OPD fee.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={`tel:${CLINIC_INFO.phoneRaw}`}
                className="min-h-[44px] px-5 py-2.5 rounded-full bg-[#0F766E] text-white hover:bg-[#0D9488] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-white" />
                <span>Call Clinic</span>
              </a>
              <a
                href={CLINIC_INFO.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-5 py-2.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="pt-2 flex items-center gap-3 text-slate-400 text-xs">
              <span className="font-semibold text-slate-500">Connect:</span>
              <a
                href={CLINIC_INFO.social.instagramPersonal}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-lg bg-slate-800 hover:bg-[#0F766E] hover:text-white transition-colors flex items-center justify-center"
                aria-label="Instagram Profile"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a
                href={CLINIC_INFO.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-lg bg-slate-800 hover:bg-[#0F766E] hover:text-white transition-colors flex items-center justify-center"
                aria-label="Facebook Page"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
              </a>
              <a
                href={CLINIC_INFO.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-lg bg-slate-800 hover:bg-[#0F766E] hover:text-white transition-colors flex items-center justify-center"
                aria-label="Twitter Profile"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a
                href={CLINIC_INFO.social.justdial}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-lg bg-slate-800 hover:bg-[#0F766E] hover:text-white transition-colors flex items-center justify-center"
                aria-label="Justdial Listing"
              >
                <Award className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-sm font-medium">
              <li><a href="#hero" className="hover:text-[#0F766E] transition-colors">Home Overview</a></li>
              <li><a href="#about-us" className="hover:text-[#0F766E] transition-colors">About Dr. Chaitanya Gupta</a></li>
              <li><a href="#gastro-explorer" className="hover:text-[#0F766E] transition-colors">Gastro Condition Explorer</a></li>
              <li><a href="#gastro-care" className="hover:text-[#0F766E] transition-colors">Liver &amp; Gastro Care</a></li>
              <li><a href="#general-medicine" className="hover:text-[#0F766E] transition-colors">General Medicine &amp; Diabetes</a></li>
              <li><a href="#doctor" className="hover:text-[#0F766E] transition-colors">Doctor Credentials (DM Gastro)</a></li>
              <li><a href="#technology" className="hover:text-[#0F766E] transition-colors">Endoscopy Suite</a></li>
              <li><a href="#location" className="hover:text-[#0F766E] transition-colors">2 Vrindavan Clinics &amp; Maps</a></li>
            </ul>
          </div>

          {/* Col 3: Contact & Both Locations */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              2 Vrindavan Clinic Addresses
            </h4>

            <div className="space-y-3 text-xs text-slate-300 font-medium">
              {/* Location A */}
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <div className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
                  Location A — Primary &amp; Endoscopy Suite
                </div>
                <div className="text-white font-semibold">
                  Bhakti Vedant Marg, Raman Reti, Vrindavan 281121
                </div>
                <div className="text-slate-400 text-[11px]">
                  Near ISKCON Temple • DIGIPIN: 39M-J6M-J735 • Mappls: vfmcw4
                </div>
              </div>

              {/* Location B */}
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <div className="text-teal-400 font-bold uppercase tracking-wider text-[10px]">
                  Location B — Consultation &amp; OPD Centre
                </div>
                <div className="text-white font-semibold">
                  Bankey Bihari Nikunj, Hanuman Bagh, Vrindavan 281121
                </div>
                <div className="text-slate-400 text-[11px]">
                  Near Brijwasi Mithai Wala
                </div>
              </div>

              {/* Timings */}
              <div className="flex items-start gap-2 pt-1 text-slate-400">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div>Mon-Sat: 9:00 AM – 7:00 PM | Sun: 9:00 AM – 2:00 PM</div>
                  <div className="text-teal-300 font-bold mt-0.5">OPD Consultation Fee: ₹200 only</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Vrindavan Healthcare / Chaitanya Health Care. All rights reserved. Dr. Chaitanya Gupta (MBBS, MD, DM Gastroenterology).
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
