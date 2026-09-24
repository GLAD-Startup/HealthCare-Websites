import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Sliders, ArrowRight } from 'lucide-react';

interface GastroSimulatorProps {
  onBookService: (serviceName: string) => void;
}

type ConditionType = 'gerd' | 'fatty-liver' | 'ulcers' | 'ibs';

interface ConditionDetail {
  id: ConditionType;
  title: string;
  badge: string;
  tagline: string;
  description: string;
  solutionTitle: string;
  solutionDesc: string;
  serviceName: string;
  untreatedState: {
    label: string;
    metrics: string[];
    visualBg: string;
    accentColor: string;
  };
  treatedState: {
    label: string;
    metrics: string[];
    visualBg: string;
    accentColor: string;
  };
}

export const GastroSimulator: React.FC<GastroSimulatorProps> = ({ onBookService }) => {
  const [activeCondition, setActiveCondition] = useState<ConditionType>('gerd');
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 - 100

  const conditions: Record<ConditionType, ConditionDetail> = {
    gerd: {
      id: 'gerd',
      title: 'GERD, Chronic Acidity & Esophagitis',
      badge: 'UPPER GI ENDOSCOPY IN VRINDAVAN',
      tagline: 'Acid Burning, Regurgitation & Mucosal Inflammation',
      description: 'Stomach acid surges back into the esophagus, eroding delicate lining, causing chest burning, sour belching, and painful swallowing.',
      solutionTitle: 'High-Definition Endoscopy & Mucosal Healing Protocol',
      solutionDesc: 'Dr. Chaitanya Gupta conducts Upper GI Endoscopy to visualize esophageal erosion, prescribe targeted acid-blockers, and permanently restore the mucosal barrier.',
      serviceName: 'Upper GI Endoscopy (Diagnostic & Therapeutic)',
      untreatedState: {
        label: 'Untreated Chronic Reflux',
        metrics: ['Inflamed, eroded esophageal mucosa', 'Severe retrosternal chest burn', 'Frequent night acid regurgitation', 'Barrett’s esophagus risk'],
        visualBg: 'from-red-950/80 via-red-900/60 to-amber-950/70',
        accentColor: '#EF4444'
      },
      treatedState: {
        label: 'Healed Mucosa via Dr. Gupta Protocol',
        metrics: ['100% Intact, smooth pink lining', 'Zero burning & sour regurgitation', 'Restored esophageal sphincter tone', 'Healthy, peaceful sleep'],
        visualBg: 'from-emerald-950/80 via-teal-900/60 to-slate-900/70',
        accentColor: '#10B981'
      }
    },
    'fatty-liver': {
      id: 'fatty-liver',
      title: 'Fatty Liver (Grade 1/2) to Healthy Liver',
      badge: 'SUPER-SPECIALTY HEPATOLOGY',
      tagline: 'Hepatic Steatosis, Elevated Enzymes & Sluggish Metabolism',
      description: 'Excess fat accumulates inside liver cells (NAFLD), elevating SGOT/SGPT enzymes, causing heaviness in upper right abdomen, chronic fatigue, and risk of fibrosis.',
      solutionTitle: 'Comprehensive Liver Function & Reversal Therapy',
      solutionDesc: 'Tailored metabolic and hepatoprotective protocols to clear hepatic triglyceride deposits, normalize liver enzymes, and prevent cirrhosis progression.',
      serviceName: 'Fatty Liver & Liver Cirrhosis Management',
      untreatedState: {
        label: 'Fatty Liver (Grade 2 Steatosis)',
        metrics: ['Elevated SGOT / SGPT enzymes', 'Sluggish hepatic circulation', 'Enlarged liver (Hepatomegaly)', 'Fibrosis & cirrhosis risk'],
        visualBg: 'from-amber-950/80 via-yellow-950/60 to-slate-950/70',
        accentColor: '#F59E0B'
      },
      treatedState: {
        label: 'Rejuvenated, Normal Liver Tissue',
        metrics: ['Normalized liver enzyme levels', 'Reversed steatosis on ultrasound', 'Active cellular detoxification', 'Boosted daily stamina & vitality'],
        visualBg: 'from-emerald-950/80 via-teal-900/60 to-slate-900/70',
        accentColor: '#10B981'
      }
    },
    ulcers: {
      id: 'ulcers',
      title: 'Peptic & Gastric Ulcers (H. Pylori)',
      badge: 'ENDOSCOPIC DIAGNOSIS & BIOPSY',
      tagline: 'Painful Mucosal Craters & GI Bleeding Risk',
      description: 'H. pylori bacterial infection or NSAID overuse breaks down the protective stomach mucus layer, forming raw, painful bleeding sores in the stomach or duodenum.',
      solutionTitle: 'Precision Endoscopic Localization & Eradication',
      solutionDesc: 'Rapid endoscopic visualization and biopsy by Dr. Chaitanya Gupta, followed by targeted quadruple eradication therapy for rapid, complete ulcer healing.',
      serviceName: 'Chronic Acidity, GERD & Peptic Ulcer Care',
      untreatedState: {
        label: 'Active Bleeding Peptic Ulcer',
        metrics: ['Deep mucosal erosion crater', 'Severe gnawing stomach pain', 'Risk of perforation & black stool', 'Persistent bacterial colonization'],
        visualBg: 'from-rose-950/80 via-red-950/70 to-slate-950/80',
        accentColor: '#F43F5E'
      },
      treatedState: {
        label: 'Complete Epithelial Re-Sealing',
        metrics: ['Fully re-epithelialized ulcer crater', 'Permanent pain relief', '100% Eradicated bacterial culture', 'Protected gastric stomach wall'],
        visualBg: 'from-teal-950/80 via-emerald-900/60 to-slate-900/70',
        accentColor: '#14B8A6'
      }
    },
    ibs: {
      id: 'ibs',
      title: 'IBS, Colitis & Chronic Motility Distress',
      badge: 'DIGESTIVE HEALTH & MOTILITY',
      tagline: 'Spastic Colon, Bloating & Unpredictable Bowels',
      description: 'Disrupted brain-gut axis and microbial imbalance trigger chronic cramping, unpredictable diarrhea or constipation, painful gas, and dietary distress.',
      solutionTitle: 'Specialized Gut Motility & Microbiome Stabilization',
      solutionDesc: 'Systematic clinical management by Dr. Chaitanya Gupta integrating low-FODMAP dietary plans, motility modulators, and anti-inflammatory therapy.',
      serviceName: 'IBS, Colitis & Inflammatory Bowel Disease (IBD)',
      untreatedState: {
        label: 'Acute IBS Flare & Bowel Spasms',
        metrics: ['Frequent abdominal cramping & spasms', 'Alternating diarrhea & constipation', 'Constant bloating & fullness', 'Dietary fear & social anxiety'],
        visualBg: 'from-orange-950/80 via-amber-950/60 to-slate-950/70',
        accentColor: '#FB923C'
      },
      treatedState: {
        label: 'Harmonized Digestive Comfort',
        metrics: ['Predictable, normal bowel frequency', 'Smooth, spasm-free intestinal motility', 'Eliminated chronic gas & bloating', 'Restored dietary enjoyment'],
        visualBg: 'from-emerald-950/80 via-teal-900/60 to-slate-900/70',
        accentColor: '#10B981'
      }
    }
  };

  const current = conditions[activeCondition];

  return (
    <section id="gastro-explorer" className="py-20 bg-slate-950 text-white relative overflow-hidden border-t border-slate-800">
      {/* Background Ambient Lights */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#0F766E]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0F766E]/20 border border-[#0F766E]/40 text-white text-xs font-bold uppercase tracking-wider mb-3">
            <Sliders className="w-4 h-4 text-[#F59E0B]" />
            <span>Interactive Gastro &amp; Liver Condition Explorer</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            See the Difference Super-Specialty Gastro Care Makes
          </h2>
          
          <p className="text-slate-300 text-base sm:text-lg mt-3 font-medium">
            Drag the interactive slider below to compare untreated gastrointestinal &amp; liver distress versus restored digestive wellness under Dr. Chaitanya Gupta.
          </p>
        </div>

        {/* Condition Tabs */}
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 mb-10">
          {(Object.keys(conditions) as ConditionType[]).map((condKey) => {
            const item = conditions[condKey];
            const isActive = activeCondition === condKey;
            return (
              <button
                key={condKey}
                onClick={() => setActiveCondition(condKey)}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#0F766E] text-white shadow-lg shadow-[#0F766E]/40 ring-2 ring-[#0F766E]'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>{item.title.split('&')[0]}</span>
                {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}
        </div>

        {/* Interactive Comparison Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-10 mb-8">
          
          {/* Badge & Tagline */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
            <div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
                {current.badge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                {current.title}
              </h3>
              <p className="text-sm text-slate-400 mt-1 font-medium">
                {current.tagline}
              </p>
            </div>

            <button
              onClick={() => onBookService(current.serviceName)}
              className="px-5 py-2.5 rounded-full bg-[#0F766E] hover:bg-[#0D9488] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer transition-all hover:scale-105"
            >
              <span>Consult for {current.title.split('(')[0]}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Dual Interactive Split Comparison Canvas */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 min-h-[360px] sm:min-h-[420px] select-none">
            
            {/* Background Layer: Untreated Condition (Left Side) */}
            <div className={`absolute inset-0 bg-gradient-to-br ${current.untreatedState.visualBg} p-6 sm:p-10 flex flex-col justify-between`}>
              <div>
                <span className="inline-block px-3 py-1 rounded-md bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold uppercase tracking-wider mb-2">
                  ⚠️ {current.untreatedState.label}
                </span>
                <div className="space-y-2 mt-4 max-w-sm">
                  {current.untreatedState.metrics.map((m, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-red-100 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-xs text-red-200/80 font-medium">
                *Untreated condition can lead to chronic complications, ulcer perforation, or progressive liver fibrosis.
              </div>
            </div>

            {/* Foreground Layer: Treated Condition (Right Side, clipped by sliderPosition) */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${current.treatedState.visualBg} p-6 sm:p-10 flex flex-col justify-between`}
              style={{
                clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)`
              }}
            >
              <div className="text-right ml-auto">
                <span className="inline-block px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-2">
                  ✅ {current.treatedState.label}
                </span>
                <div className="space-y-2 mt-4 max-w-sm ml-auto">
                  {current.treatedState.metrics.map((m, idx) => (
                    <div key={idx} className="flex items-center justify-end gap-2 text-xs sm:text-sm text-emerald-100 font-medium">
                      <span>{m}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-right text-xs text-emerald-200/80 font-medium ml-auto">
                *Targeted care by Dr. Chaitanya Gupta with transparent ₹200 consultation fee in Vrindavan.
              </div>
            </div>

            {/* Split Slider Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl pointer-events-none z-20 flex items-center justify-center"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-9 h-9 rounded-full bg-white text-slate-900 shadow-2xl flex items-center justify-center font-bold text-xs border-2 border-[#0F766E]">
                ↔
              </div>
            </div>

            {/* Invisible Range Input Slider Over Canvas */}
            <input
              type="range"
              min="5"
              max="95"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              aria-label="Comparison slider"
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
            />
          </div>

          {/* Slider Instruction Prompt */}
          <div className="flex items-center justify-between mt-4 text-xs font-semibold text-slate-400">
            <span className="text-red-400">← Untreated Symptoms</span>
            <span className="text-slate-300 flex items-center gap-1.5">
              <span>Drag slider left / right to compare clinical states</span>
            </span>
            <span className="text-emerald-400">Post-Treatment Wellness →</span>
          </div>

          {/* Solution Callout Box */}
          <div className="mt-8 p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Dr. Gupta's Clinical Solution</span>
              </div>
              <h4 className="text-lg font-bold text-white">
                {current.solutionTitle}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl font-medium">
                {current.solutionDesc}
              </p>
            </div>

            <button
              onClick={() => onBookService(current.serviceName)}
              className="px-6 py-3 rounded-full bg-[#0F766E] hover:bg-[#0D9488] text-white font-bold text-xs sm:text-sm shrink-0 shadow-lg shadow-[#0F766E]/30 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <span>Book Appointment (₹200)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
