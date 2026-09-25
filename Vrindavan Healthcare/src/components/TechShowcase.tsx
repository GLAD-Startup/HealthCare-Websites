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
    <section id="technology" className="py-20 bg-[#FAFAF8] text-slate-900 relative overflow-hidden border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
            <Cpu className="w-4 h-4 text-slate-900" />
            <span>Advanced Clinical Facilities</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-[1.12]">
            Diagnostic Technology in Vrindavan
          </h2>

          <p className="text-slate-600 text-sm sm:text-base lg:text-lg mt-3 font-normal max-w-2xl mx-auto leading-relaxed">
            Equipped with modern video endoscopy and liver diagnostic protocols under Dr. Chaitanya Gupta (DM Gastroenterology).
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
          <button
            onClick={() => setActiveTech('endoscopy')}
            className={`w-full sm:w-auto min-h-[44px] px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTech === 'endoscopy'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90 shadow-2xs'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-500" />
            <span>Upper GI Endoscopy</span>
          </button>

          <button
            onClick={() => setActiveTech('hepatology')}
            className={`w-full sm:w-auto min-h-[44px] px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTech === 'hepatology'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90 shadow-2xs'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>Liver &amp; Hepatology Suite</span>
          </button>

          <button
            onClick={() => setActiveTech('colonoscopy')}
            className={`w-full sm:w-auto min-h-[44px] px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTech === 'colonoscopy'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90 shadow-2xs'
            }`}
          >
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Colonoscopy &amp; Lower GI</span>
          </button>
        </div>

        {/* Tab Content Bento Box */}
        <div className={`tech-tab-content rounded-[32px] p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xs transition-colors duration-300 ${
          activeTech === 'hepatology'
            ? 'bg-[#FEF9C3] border border-amber-300/80'
            : 'bg-[#E6F7F5] border border-teal-200/70'
        }`}>
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left: Info */}
            <div className="lg:col-span-6 space-y-5 text-left">
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-3.5 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider">
                    {current.badge}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${
                    activeTech === 'hepatology'
                      ? 'bg-white/80 text-amber-950 border-amber-300'
                      : 'bg-white/80 text-teal-950 border-teal-200'
                  }`}>
                    Vrindavan Facility
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight leading-tight">
                  {current.title}
                </h3>

                <p className="text-slate-700 font-semibold text-xs sm:text-sm mt-1.5">
                  {current.subtitle}
                </p>
              </div>

              <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed font-normal">
                {current.description}
              </p>

              <div className="space-y-2.5">
                {current.features.map((feature, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-white/90 border border-white/60 flex items-start gap-3 text-xs sm:text-sm text-slate-800 font-medium shadow-2xs">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onBookTechService(current.serviceName)}
                  className="w-full sm:w-auto min-h-[46px] justify-center px-7 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all hover:scale-102 active:scale-98 cursor-pointer flex items-center gap-2"
                >
                  <span>Book Consultation for {current.title.split(' ')[0]}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: Facility Image */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border-4 border-white bg-white aspect-16/10 group">
                <img
                  src={current.image}
                  alt={current.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold bg-slate-900/75 backdrop-blur-md p-3 rounded-xl border border-white/20">
                  <div className="text-amber-300 font-bold">{current.title}</div>
                  <div className="text-slate-200 text-[11px]">Vrindavan Healthcare • Dr. Chaitanya Gupta</div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
