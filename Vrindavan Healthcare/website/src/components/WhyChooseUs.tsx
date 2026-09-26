import React, { useEffect } from 'react';
import { Award, ShieldCheck, Cpu, Activity, MapPin } from 'lucide-react';
import { WHY_CHOOSE_US } from '../data/clinicData';
import { animate, stagger } from 'animejs';

export const WhyChooseUs: React.FC = () => {
  useEffect(() => {
    animate('.trust-card-anime', {
      opacity: [0, 1],
      translateY: [35, 0],
      duration: 900,
      delay: stagger(150),
      ease: 'outExpo'
    });
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity':
        return <Activity className="w-6 h-6 text-[#0F766E]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-[#0F766E]" />;
      case 'Award':
        return <Award className="w-6 h-6 text-[#F59E0B]" />;
      case 'MapPin':
        return <MapPin className="w-6 h-6 text-[#0F766E]" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-[#0F766E]" />;
      default:
        return <Award className="w-6 h-6 text-[#0F766E]" />;
    }
  };

  return (
    <section className="py-16 bg-[#F8FAFC] border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F0FDFA] text-[#0F766E] text-xs font-bold uppercase tracking-wider mb-2">
            <span>Why Patients Choose Dr. Chaitanya Gupta</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Advanced Clinical Care Meets Compassionate Medical Ethics
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3">
            Bringing high-definition endoscopic evaluation, super-specialty liver diagnostics, and accessible ₹200 OPD care to Vrindavan and Mathura.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_CHOOSE_US.map((item) => (
            <div
              key={item.id}
              className="trust-card-anime p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-[#0F766E]/50 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1.5"
            >
              <div>
                <div className="w-13 h-13 rounded-2xl bg-[#F0FDFA] shadow-xs border border-[#CCFBF1] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {getIcon(item.icon)}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#0F766E] transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
