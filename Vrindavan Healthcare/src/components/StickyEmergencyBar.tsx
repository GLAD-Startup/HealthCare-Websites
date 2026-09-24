import React, { useState, useEffect } from 'react';
import { Phone, Calendar, MapPin, MessageSquare, Clock } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';
import { getLenis } from '../hooks/useSmoothScroll';

interface StickyEmergencyBarProps {
  onOpenAppointment: () => void;
}

export const StickyEmergencyBar: React.FC<StickyEmergencyBarProps> = ({ onOpenAppointment }) => {
  const [isOpenNow, setIsOpenNow] = useState<boolean>(true);
  const [statusText, setStatusText] = useState<string>('Open Now • OPD 9 AM - 6 PM');

  useEffect(() => {
    // Determine clinic open status based on current local day & time
    const checkStatus = () => {
      const now = new Date();
      const day = now.getDay(); // 0 = Sun, 1 = Mon, ... 4 = Thu
      const hours = now.getHours();
      const mins = now.getMinutes();
      const totalMinutes = hours * 60 + mins;

      if (day === 4) {
        // Thursday Closed
        setIsOpenNow(false);
        setStatusText('Closed Today (Thursday) • OPD Resumes Friday');
      } else if (day === 0) {
        // Sunday 8:00 AM - 12:00 PM
        if (totalMinutes >= 8 * 60 && totalMinutes < 12 * 60) {
          setIsOpenNow(true);
          setStatusText('Open Now • Closes 12:00 PM Today');
        } else {
          setIsOpenNow(false);
          setStatusText('Closed Now • Sunday Hours 8 AM - 12 PM');
        }
      } else {
        // Mon, Tue, Wed, Fri, Sat: 9:00 AM - 6:00 PM
        if (totalMinutes >= 9 * 60 && totalMinutes < 18 * 60) {
          setIsOpenNow(true);
          setStatusText('Open Now • OPD 9:00 AM - 6:00 PM');
        } else if (totalMinutes < 9 * 60) {
          setIsOpenNow(false);
          setStatusText('Opens Today at 9:00 AM');
        } else {
          setIsOpenNow(false);
          setStatusText('Closed Now • Opens Tomorrow 9:00 AM');
        }
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleDirections = () => {
    window.open(CLINIC_INFO.mapsDirectionsUrl, '_blank', 'noopener,noreferrer');
  };

  const handleWhatsApp = () => {
    window.open(CLINIC_INFO.whatsapp, '_blank', 'noopener,noreferrer');
  };

  const scrollToContact = () => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo('#contact', { offset: -110 });
    } else {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-[#480px] z-40 animate-slideUp">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/90 text-white rounded-3xl p-3 sm:p-4 shadow-2xl flex flex-col gap-2.5">
        
        {/* Top Status Header Pill */}
        <div className="flex items-center justify-between gap-2 px-2 text-[11px] font-bold">
          <div className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${isOpenNow ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
            <span className={isOpenNow ? 'text-emerald-400' : 'text-amber-400'}>
              {statusText}
            </span>
          </div>

          <div className="flex items-center gap-1 text-slate-400 font-medium text-[10px]">
            <Clock className="w-3 h-3 text-[#F59E0B]" />
            <span>Mathura Clinic</span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-4 gap-2">
          
          {/* 1. Direct Phone Call */}
          <a
            href={`tel:${CLINIC_INFO.phoneRaw}`}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md active:scale-95 text-center"
            title="Call Clinic"
          >
            <Phone className="w-4 h-4 mb-1" />
            <span className="text-[10px] font-bold">Call Now</span>
          </a>

          {/* 2. WhatsApp Direct Chat */}
          <button
            type="button"
            onClick={handleWhatsApp}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-md active:scale-95 text-center cursor-pointer"
            title="WhatsApp Chat"
          >
            <MessageSquare className="w-4 h-4 mb-1" />
            <span className="text-[10px] font-bold">WhatsApp</span>
          </button>

          {/* 3. Book OPD Appointment */}
          <button
            type="button"
            onClick={() => {
              onOpenAppointment();
              scrollToContact();
            }}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-[#0F766E] hover:bg-[#0D9488] text-white transition-all shadow-md active:scale-95 text-center cursor-pointer"
            title="Book Appointment"
          >
            <Calendar className="w-4 h-4 mb-1" />
            <span className="text-[10px] font-bold">Book OPD</span>
          </button>

          {/* 4. Google Maps Directions */}
          <button
            type="button"
            onClick={handleDirections}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all shadow-md active:scale-95 text-center cursor-pointer"
            title="Directions to Clinic"
          >
            <MapPin className="w-4 h-4 mb-1 text-[#F59E0B]" />
            <span className="text-[10px] font-bold">Map</span>
          </button>

        </div>

      </div>
    </div>
  );
};
