import React, { useEffect } from 'react';
import { Activity, ArrowRight, CheckCircle2, Sparkles, ShieldAlert, Flame, Sliders, Crosshair, Scan } from 'lucide-react';
import { GASTRO_CARE_SERVICES, type ServiceItem } from '../data/clinicData';
import { animate, stagger } from 'animejs';

interface GastroCareServicesProps {
  onSelectService: (service: ServiceItem) => void;
  onBookService: (serviceName: string) => void;
}

export const GastroCareServices: React.FC<GastroCareServicesProps> = ({
  onSelectService,
  onBookService,
}) => {
  useEffect(() => {
    animate('.gastro-service-card', {
      opacity: [0, 1],
      translateY: [35, 0],
      duration: 800,
      delay: stagger(100),
      ease: 'outQuad'
    });
  }, []);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity':
        return <Activity className="w-6 h-6 text-[#0F766E]" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-6 h-6 text-[#0F766E]" />;
      case 'Flame':
        return <Flame className="w-6 h-6 text-[#F59E0B]" />;
      case 'Sliders':
        return <Sliders className="w-6 h-6 text-[#0F766E]" />;
      case 'Crosshair':
        return <Crosshair className="w-6 h-6 text-[#0F766E]" />;
      case 'Scan':
        return <Scan className="w-6 h-6 text-[#0F766E]" />;
      default:
        return <Activity className="w-6 h-6 text-[#0F766E]" />;
    }
  };

  return (
    <section id="gastro-care" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F0FDFA] text-[#0F766E] text-xs font-bold uppercase tracking-wider mb-3">
            <Activity className="w-4 h-4 text-[#0F766E]" />
            <span>Super-Specialty Gastroenterology &amp; Hepatology</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Liver &amp; Gastro Care in Vrindavan
          </h2>
          
          <p className="text-slate-600 text-base sm:text-lg mt-3 font-medium">
            Advanced diagnostic Upper GI Endoscopy, liver steatosis protocols, and comprehensive digestive care led by Dr. Chaitanya Gupta (DM Gastroenterology).
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GASTRO_CARE_SERVICES.map((service) => (
            <div
              key={service.id}
              className="gastro-service-card rounded-3xl bg-[#F8FAFC] border border-slate-200/90 p-6 sm:p-7 flex flex-col justify-between hover:border-[#0F766E]/40 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden"
            >
              {service.isConfirmedProcedure && (
                <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#0F766E] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                  <Sparkles className="w-3 h-3" />
                  <span>Endoscopy Centre</span>
                </div>
              )}

              <div>
                {/* Icon */}
                <div className="w-13 h-13 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {getServiceIcon(service.iconName)}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[#0F766E] transition-colors leading-snug">
                  {service.name}
                </h3>

                {/* Short Description */}
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  {service.shortDesc}
                </p>

                {/* Bullet Points */}
                <div className="space-y-2 mb-6">
                  {service.benefits.slice(0, 3).map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E] shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between gap-3">
                <button
                  onClick={() => onSelectService(service)}
                  className="text-xs font-bold text-slate-700 hover:text-[#0F766E] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Read Overview</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onBookService(service.name)}
                  className="px-4 py-2 rounded-full bg-[#0F766E] hover:bg-[#0D9488] text-white font-bold text-xs shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>Book (₹200)</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
