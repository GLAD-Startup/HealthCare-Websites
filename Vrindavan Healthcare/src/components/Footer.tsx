import React, { useState } from 'react';
import { Phone, Clock, MapPin } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';
import { getLenis } from '../hooks/useSmoothScroll';
import gladStudioLogo from '../assets/website logo(white background compatible).png';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
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

  return (
    <footer className="bg-[#FAFAF8] text-slate-700 pt-16 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Col 1 (Span 4): Asterisk Logo & Intro */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                ✱
              </div>
              <div className="font-sans text-base font-extrabold text-slate-900 tracking-wider uppercase leading-none">
                Vrindavan <span className="text-slate-500 font-medium">Healthcare</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-sm">
              Providing trusted healthcare services with compassion, innovation, and care for your digestive well-being every day under Dr. Chaitanya Gupta (DM Gastro).
            </p>

            <div className="pt-2 text-xs text-slate-500 font-medium">
              OPD Fee: <strong className="text-slate-900">₹200 only</strong> • 2 Vrindavan Clinics
            </div>
          </div>

          {/* Col 2 (Span 2): About Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-medium text-slate-600">
              <li><a href="#hero" onClick={(e) => handleNavClick(e, '#hero')} className="hover:text-slate-900 transition-colors">Home</a></li>
              <li><a href="#about-us" onClick={(e) => handleNavClick(e, '#about-us')} className="hover:text-slate-900 transition-colors">About Us</a></li>
              <li><a href="#gastro-care" onClick={(e) => handleNavClick(e, '#gastro-care')} className="hover:text-slate-900 transition-colors">Services</a></li>
              <li><a href="#doctor" onClick={(e) => handleNavClick(e, '#doctor')} className="hover:text-slate-900 transition-colors">Doctors</a></li>
              <li><a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} className="hover:text-slate-900 transition-colors">Appointments</a></li>
            </ul>
          </div>

          {/* Col 3 (Span 3): Address & Hotline */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Clinics &amp; Hours
            </h4>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-900 shrink-0 mt-0.5" />
                <span>Raman Reti (Near ISKCON) &amp; Hanuman Bagh, Vrindavan 281121</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-900 shrink-0" />
                <a href={`tel:${CLINIC_INFO.phoneRaw}`} className="font-bold text-slate-900 hover:underline">
                  {CLINIC_INFO.phone}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-900 shrink-0 mt-0.5" />
                <span>Mon-Sat: 9am-7pm | Sun: 9am-2pm</span>
              </div>
            </div>
          </div>

          {/* Col 4 (Span 3): Sign Up for Updates */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Sign Up for Updates
            </h4>
            <p className="text-xs text-slate-500">
              Receive health updates &amp; preventive care guidance.
            </p>

            <form onSubmit={handleSubscribe} className="relative flex items-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full py-2.5 pl-3.5 pr-24 rounded-full border border-slate-300 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-slate-900"
              />
              <button
                type="submit"
                className="absolute right-1 px-4 py-1.5 rounded-full bg-slate-900 text-white font-bold text-[11px] hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {subscribed ? 'Joined!' : 'Subscribe'}
              </button>
            </form>

            {/* Social Icons */}
            <div className="pt-2 flex items-center gap-2 text-slate-600">
              <a
                href={CLINIC_INFO.social.instagramPersonal}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-900 hover:text-white transition-colors flex items-center justify-center text-xs"
                aria-label="Instagram"
              >
                📷
              </a>
              <a
                href={CLINIC_INFO.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-900 hover:text-white transition-colors flex items-center justify-center text-xs font-bold"
                aria-label="Facebook"
              >
                f
              </a>
              <a
                href={CLINIC_INFO.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-900 hover:text-white transition-colors flex items-center justify-center text-xs font-bold"
                aria-label="X / Twitter"
              >
                𝕏
              </a>
              <a
                href={CLINIC_INFO.social.justdial}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-900 hover:text-white transition-colors flex items-center justify-center text-xs font-bold"
                aria-label="Reviews"
              >
                ★
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* Clean White Bottom Bar with Developed by GLAD Studio */}
      <div className="bg-white text-slate-600 text-xs py-5 px-4 sm:px-6 lg:px-8 border-t border-slate-200/90">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-slate-500 text-[11px] sm:text-xs text-center md:text-left">
            © Copyright {new Date().getFullYear()}. All Rights Reserved. Vrindavan Healthcare
          </div>

          {/* Developed by GLAD Studio Tag */}
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium bg-[#FAFAF8] px-3 py-1 rounded-full border border-slate-200/90 shadow-2xs">
            <span>Developed by</span>
            <a
              href="https://gladstudio.net"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center hover:opacity-80 transition-opacity shrink-0"
              title="GLAD Studio (opens gladstudio.net)"
            >
              <img
                src={gladStudioLogo}
                alt="GLAD Studio"
                style={{ height: '16px', maxHeight: '16px', width: 'auto', display: 'block' }}
                className="h-4 max-h-4 w-auto object-contain shrink-0"
              />
            </a>
          </div>

          <div className="flex items-center gap-4 text-slate-500 text-[11px] sm:text-xs">
            <a href="#about-us" onClick={(e) => handleNavClick(e, '#about-us')} className="hover:text-slate-900 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} className="hover:text-slate-900 transition-colors">Terms &amp; Condition</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

