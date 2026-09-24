import React, { useState, useEffect } from 'react';
import { Cpu, Sparkles, CheckCircle, Activity, ArrowRight, ShieldCheck } from 'lucide-react';
import { animate } from 'animejs';

interface TechShowcaseProps {
  onBookTechService: (serviceName: string) => void;
}

export const TechShowcase: React.FC<TechShowcaseProps> = ({ onBookTechService }) => {
  const [activeTech, setActiveTech] = useState<'endoscopy' | 'hepatology' | 'colonoscopy'>('endoscopy');

  useEffect(() => {
    animate('.tech-tab-content', {
      opacity: [0, 1],
      translateY: [20, 0],
      scale: [0.98, 1],
      duration: 500,
      ease: 'outExpo'
    });
  }, [activeTech]);

  const techDetails = {
    endoscopy: {
      title: "High-Definition Upper GI Endoscopy Suite",
      badge: "ACTIVE CLINICAL PRACTICE IN VRINDAVAN",
      subtitle: "Direct video magnification of food pipe, stomach, and duodenal mucosa",
      description: "Dr. Chaitanya Gupta conducts Upper GI Endoscopy right here in Vrindavan. The high-resolution video endoscope enables precise visualization of acid reflux damage, gastric and duodenal ulcers, early H. pylori bacterial colonization, and sources of acute gastrointestinal bleeding.",
      image: "/images/dr_chaitanya_endoscopy_procedure.jpeg",
      features: [
        "Painless procedural guidance with throat anesthesia or light sedation",
        "High-definition video recording & digital endoscopic imaging",
        "Direct tissue biopsy for H. pylori, celiac disease, and gastritis",
        "Same-day outpatient procedure with rapid, comfortable recovery"
      ],
      serviceName: "Upper GI Endoscopy (Diagnostic & Therapeutic)"
    },
    hepatology: {
      title: "Super-Specialty Hepatology & Liver Diagnostic Staging",
      badge: "LIVER WELLNESS & CIRRHOSIS CARE",
      subtitle: "Targeted protocols for fatty liver (NAFLD/NASH), hepatitis, and jaundice",
      description: "Equipped with advanced diagnostic workup for liver parenchymal diseases. We evaluate steatosis grade, elevated transaminases (SGOT/SGPT), viral hepatitis viral loads (B & C), and metabolic risk factors to formulate effective liver rejuvenation pathways.",
      image: "/images/dr_chaitanya_press_conf.jpeg",
      features: [
        "Accurate clinical staging of Grade 1 & 2 hepatic steatosis",
        "Comprehensive jaundice & bilirubin differential diagnosis",
        "Evidence-based medical protocols to prevent cirrhosis progression",
        "Nutritional metabolic optimization & weight management"
      ],
      serviceName: "Fatty Liver & Liver Cirrhosis Management"
    },
    colonoscopy: {
      title: "Lower GI & Colonoscopy Evaluation Suite",
      badge: "COLORECTAL WELLNESS & IBD CARE",
      subtitle: "Full diagnostic investigation for lower GI bleeding, chronic diarrhea & polyps",
      description: "Thorough endoscopic inspection of the large intestine and terminal ileum to investigate recurring loose stools, rectal bleeding, Crohn's disease, Ulcerative Colitis, and early colorectal polyp screening.",
      image: "/images/endoscopy_monitor_live.jpeg",
      features: [
        "Definitive localization of unexplained rectal bleeding",
        "Biopsy confirmation for inflammatory bowel diseases (IBD)",
        "Early detection and therapeutic surveillance of colon polyps",
        "Safe, monitored clinical environment"
      ],
      serviceName: "Colonoscopy & Lower GI Screening"
    }
  };

  const current = techDetails[activeTech];

  return (
    <section id="technology" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0F766E]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#0F766E]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-teal-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Cpu className="w-4 h-4 text-teal-400" />
            <span>Advanced Clinical Facilities</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Diagnostic Technology in Vrindavan
          </h2>

          <p className="text-slate-300 text-base sm:text-lg mt-3 font-medium">
            Equipped with modern video endoscopy and liver diagnostic protocols under Dr. Chaitanya Gupta (DM Gastroenterology).
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
          <button
            onClick={() => setActiveTech('endoscopy')}
            className={`w-full sm:w-auto min-h-[44px] px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTech === 'endoscopy'
                ? 'bg-[#0F766E] text-white shadow-lg shadow-[#0F766E]/40 ring-2 ring-[#0F766E]'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Upper GI Endoscopy</span>
          </button>

          <button
            onClick={() => setActiveTech('hepatology')}
            className={`w-full sm:w-auto min-h-[44px] px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTech === 'hepatology'
                ? 'bg-[#0F766E] text-white shadow-lg shadow-[#0F766E]/40 ring-2 ring-[#0F766E]'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Liver &amp; Hepatology Suite</span>
          </button>

          <button
            onClick={() => setActiveTech('colonoscopy')}
            className={`w-full sm:w-auto min-h-[44px] px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTech === 'colonoscopy'
                ? 'bg-[#0F766E] text-white shadow-lg shadow-[#0F766E]/40 ring-2 ring-[#0F766E]'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Colonoscopy &amp; Lower GI</span>
          </button>
        </div>

        {/* Tab Content Box */}
        <div className="tech-tab-content bg-slate-800/80 rounded-3xl border border-slate-700/80 p-5 sm:p-10 lg:p-12 overflow-hidden backdrop-blur-md">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left: Info */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="inline-block px-3.5 py-1 rounded-full bg-teal-400/20 text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
                  {current.badge}
                </span>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  {current.title}
                </h3>

                <p className="text-[#F59E0B] font-semibold text-sm mt-1">
                  {current.subtitle}
                </p>
              </div>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {current.description}
              </p>

              <div className="space-y-3">
                {current.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200 font-medium">
                    <CheckCircle className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onBookTechService(current.serviceName)}
                  className="w-full sm:w-auto min-h-[44px] justify-center px-6 py-3 rounded-full bg-[#0F766E] hover:bg-[#0D9488] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#0F766E]/30 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <span>Book Consultation for {current.title.split(' ')[0]}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: Facility Image */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700 bg-slate-950 aspect-16/10 group">
                <img
                  src={current.image}
                  alt={current.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-semibold bg-slate-950/60 backdrop-blur-md p-3 rounded-xl border border-white/10">
                  <div className="text-teal-300 font-bold">{current.title}</div>
                  <div className="text-slate-300 text-[11px]">Vrindavan Healthcare • Dr. Chaitanya Gupta</div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
