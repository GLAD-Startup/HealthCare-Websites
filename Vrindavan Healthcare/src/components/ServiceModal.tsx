import React from 'react';
import { X, CheckCircle2, Sparkles, Phone, Calendar } from 'lucide-react';
import { type ServiceItem, CLINIC_INFO } from '../data/clinicData';

interface ServiceModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onBook: (serviceName: string) => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({ service, onClose, onBook }) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 sm:p-8 bg-[#0F766E] text-white relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-white shadow-md shrink-0 p-0.5 border border-white/80">
              <img
                src="/favicon.png"
                alt="Vrindavan Healthcare Official Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-[#CCFBF1] font-bold">Vrindavan Healthcare</div>
              <div className="text-[11px] text-white/80 font-medium">Dr. Chaitanya Gupta (DM Gastro)</div>
            </div>
          </div>

          {service.isConfirmedProcedure && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F59E0B] text-slate-950 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Active Endoscopy Centre</span>
            </div>
          )}

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {service.name}
          </h3>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Clinical Overview &amp; Protocol
            </h4>
            <p className="text-slate-700 text-base leading-relaxed font-medium">
              {service.fullDesc}
            </p>
          </div>

          {/* Benefits List */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Key Patient Benefits &amp; Treatment Highlights
            </h4>
            <div className="space-y-2.5">
              {service.benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-3 text-slate-800 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F0FDFA] border border-[#CCFBF1] text-xs font-semibold text-[#0F766E]">
            <strong>Clinical Note:</strong> Super-specialist consultation available at Raman Reti (near ISKCON Temple) and Hanuman Bagh (near Brijwasi Mithai Wala), Vrindavan. Transparent OPD fee: ₹200.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href={`tel:${CLINIC_INFO.phoneRaw}`}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            <Phone className="w-4 h-4 text-[#0F766E]" />
            <span>Call {CLINIC_INFO.phone}</span>
          </a>

          <button
            onClick={() => {
              onClose();
              onBook(service.name);
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#0F766E] hover:bg-[#0D9488] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-white" />
            <span>Book OPD for {service.name.split('(')[0]} (₹200)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
