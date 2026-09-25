import React, { useState } from 'react';
import { Phone, MessageCircle, Calendar, MapPin, PhoneCall, ArrowRight } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';
import { RequestCallbackModal } from './RequestCallbackModal';

interface RightSideFloatingDockProps {
  onOpenAppointment: () => void;
}

export const RightSideFloatingDock: React.FC<RightSideFloatingDockProps> = ({ onOpenAppointment }) => {
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);

  const dockItems = [
    {
      id: 'call',
      label: `Call Now: ${CLINIC_INFO.phone}`,
      icon: Phone,
      bg: 'bg-emerald-600',
      textBg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      action: () => {
        window.location.href = `tel:${CLINIC_INFO.phoneRaw}`;
      }
    },
    {
      id: 'whatsapp',
      label: 'Chat on WhatsApp',
      icon: MessageCircle,
      bg: 'bg-[#25D366]',
      textBg: 'bg-emerald-50 text-emerald-950 border-emerald-200',
      action: () => {
        window.open(CLINIC_INFO.whatsapp, '_blank', 'noopener,noreferrer');
      }
    },
    {
      id: 'book',
      label: 'Book OPD (₹200 Fee)',
      icon: Calendar,
      bg: 'bg-slate-900',
      textBg: 'bg-slate-900 text-white border-slate-800',
      action: () => {
        onOpenAppointment();
      }
    },
    {
      id: 'callback',
      label: 'Request a Callback',
      icon: PhoneCall,
      bg: 'bg-red-600',
      textBg: 'bg-red-50 text-red-950 border-red-200',
      action: () => {
        setIsCallbackOpen(true);
      }
    },
    {
      id: 'map',
      label: 'Raman Reti & Hanuman Bagh Map',
      icon: MapPin,
      bg: 'bg-amber-500',
      textBg: 'bg-amber-50 text-amber-950 border-amber-200',
      action: () => {
        window.open(CLINIC_INFO.mapsDirectionsUrl, '_blank', 'noopener,noreferrer');
      }
    }
  ];

  return (
    <>
      {/* Desktop: Apollo-Style Hover Expanding Dock on Right Edge (md and above) */}
      <div className="hidden md:flex fixed right-3 top-1/2 -translate-y-1/2 z-40 flex-col gap-3.5 items-end pointer-events-none">
        {dockItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={item.action}
              className="pointer-events-auto group relative flex items-center cursor-pointer select-none"
            >
              {/* Expandable Label Pill (Expands to Left on Hover) */}
              <div className="absolute right-0 flex items-center gap-2.5 pl-4 pr-14 py-2.5 rounded-full bg-white shadow-2xl border border-slate-200/90 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out pointer-events-none group-hover:pointer-events-auto whitespace-nowrap z-10">
                <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
                  {item.label}
                </span>
                <span className={`w-6 h-6 rounded-full ${item.bg} text-white flex items-center justify-center shrink-0`}>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Circle Icon Badge (Always Visible on Right Edge) */}
              <div
                className={`relative z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full ${item.bg} text-white shadow-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl border-2 border-white`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: Bottom Sticky Quick Action Bar (below md, touch-friendly min 44px) */}
      <div className="mobile-bottom-dock md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-3 py-2 shadow-2xl pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
          {/* 1. Direct Call */}
          <a
            href={`tel:${CLINIC_INFO.phoneRaw}`}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-emerald-600 active:bg-emerald-700 text-white text-center min-h-[44px] transition-transform active:scale-95"
            aria-label="Call Clinic"
          >
            <Phone className="w-4 h-4 mb-0.5 text-white" />
            <span className="text-[10px] font-bold">Call</span>
          </a>

          {/* 2. WhatsApp */}
          <a
            href={CLINIC_INFO.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#25D366] active:bg-[#1ebd59] text-white text-center min-h-[44px] transition-transform active:scale-95"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 mb-0.5 text-white" />
            <span className="text-[10px] font-bold">WhatsApp</span>
          </a>

          {/* 3. Book OPD */}
          <button
            type="button"
            onClick={onOpenAppointment}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-slate-900 active:bg-slate-800 text-white text-center min-h-[44px] transition-transform active:scale-95 cursor-pointer"
            aria-label="Book OPD Consultation"
          >
            <Calendar className="w-4 h-4 mb-0.5 text-amber-300" />
            <span className="text-[10px] font-bold">Book (₹200)</span>
          </button>

          {/* 4. Request Callback */}
          <button
            type="button"
            onClick={() => setIsCallbackOpen(true)}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-red-600 active:bg-red-700 text-white text-center min-h-[44px] transition-transform active:scale-95 cursor-pointer"
            aria-label="Request Callback"
          >
            <PhoneCall className="w-4 h-4 mb-0.5 text-white" />
            <span className="text-[10px] font-bold">Callback</span>
          </button>
        </div>
      </div>

      {/* Render Request Callback Drawer Modal when triggered */}
      {isCallbackOpen && (
        <RequestCallbackModal isOpen={isCallbackOpen} onClose={() => setIsCallbackOpen(false)} />
      )}
    </>
  );
};
