import React, { useState, useRef } from 'react';
import { Sparkles, CheckCircle2, Sliders, ArrowRight } from 'lucide-react';

interface GastroSimulatorProps {
  onBookService: (serviceName: string) => void;
}

type ConditionType = 'ulcers' | 'fatty-liver' | 'gerd';

interface ConditionDetail {
  id: ConditionType;
  title: string;
  badge: string;
  tagline: string;
  description: string;
  solutionTitle: string;
  solutionDesc: string;
  serviceName: string;
  beforeImage: string;
  afterImage: string;
  beforeLabel: string;
  afterLabel: string;
  untreatedMetrics: string[];
  treatedMetrics: string[];
}

export const GastroSimulator: React.FC<GastroSimulatorProps> = ({ onBookService }) => {
  const [activeCondition, setActiveCondition] = useState<ConditionType>('ulcers');
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateSlider = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(Math.round(percentage));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updateSlider(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      updateSlider(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const conditions: Record<ConditionType, ConditionDetail> = {
    ulcers: {
      id: 'ulcers',
      title: 'Active Gastric Ulcer vs Healed Mucosa',
      badge: 'UPPER GI ENDOSCOPY IN VRINDAVAN',
      tagline: 'High-Definition Video Mucosal Inspection & Epithelial Re-Sealing',
      description: 'H. pylori bacterial infection or NSAID overuse breaks down the stomach\'s mucosal barrier, creating bleeding ulcer craters. Targeted quadruple eradication therapy leads to complete epithelial healing.',
      solutionTitle: 'Olympus Video Endoscopy & Quadruple Eradication Protocol',
      solutionDesc: 'Dr. Chaitanya Gupta conducts diagnostic endoscopy to visualize the ulcer base, rule out bleeding, and prescribe tailored mucosal healing regimens that permanently eliminate burning.',
      serviceName: 'Upper GI Endoscopy (Diagnostic & Therapeutic)',
      beforeImage: '/images/ulcer_16_9_before.jpg',
      afterImage: '/images/ulcer_16_9_after.jpg',
      beforeLabel: 'Severe Active Bleeding Ulcer',
      afterLabel: '100% Healed Gastric Mucosa',
      untreatedMetrics: [
        'Deep mucosal crater with inflamed red bleeding margins',
        'Severe retrosternal gnawing pain after eating',
        'Continuous risk of internal hemorrhage & dark black stools',
        'Active H. pylori bacterial colonization damaging tissue'
      ],
      treatedMetrics: [
        'Fully re-epithelialized smooth pink gastric mucosa',
        '100% Eradicated H. pylori bacterial culture',
        'Complete freedom from burning stomach ache & belching',
        'Restored protective mucus barrier preventing recurrence'
      ]
    },
    'fatty-liver': {
      id: 'fatty-liver',
      title: 'Grade 2 Fatty Liver to Healthy Liver',
      badge: 'SUPER-SPECIALTY HEPATOLOGY',
      tagline: 'Hepatic Steatosis Reversal & Enzyme Normalization',
      description: 'Excess triglyceride accumulation infiltrates liver cells (NAFLD), swelling the liver and elevating SGOT/SGPT enzymes. Personalized metabolic therapy clears fat deposits and prevents cirrhosis.',
      solutionTitle: 'Comprehensive Liver Function Staging & Steatosis Reversal',
      solutionDesc: 'Evidence-based hepatology protocols by Dr. Chaitanya Gupta to clear hepatic lipid infiltration, normalize elevated enzymes, and safeguard lifelong liver vitality.',
      serviceName: 'Fatty Liver & Liver Cirrhosis Management',
      beforeImage: '/images/liver_16_9_before.jpg',
      afterImage: '/images/liver_16_9_after.jpg',
      beforeLabel: 'Grade 2 Fatty Liver (Steatosis)',
      afterLabel: 'Healthy, Rejuvenated Liver',
      untreatedMetrics: [
        'Enlarged liver with yellowish lipid accumulation',
        'Elevated SGOT / SGPT liver enzymes (100+ U/L)',
        'Right upper abdominal fullness & chronic sluggishness',
        'Progression risk toward hepatic fibrosis & cirrhosis'
      ],
      treatedMetrics: [
        'Normal anatomical liver size with clear microcirculation',
        'Completely normalized SGOT / SGPT enzymes (<35 U/L)',
        'Active cellular metabolic detoxification & energy',
        'Ultrasound-confirmed reversal of hepatic steatosis'
      ]
    },
    gerd: {
      id: 'gerd',
      title: 'GERD Acid Reflux vs Intact Mucosal Barrier',
      badge: 'ACID PEPTIC DISEASE CARE',
      tagline: 'Dysfunctional Sphincter Repair & Mucosal Protection',
      description: 'Gastric acid surges past a weakened lower esophageal sphincter, causing severe retrosternal heartburn and mucosal ulcerations. Precision mucosal healing restores the gastroesophageal barrier.',
      solutionTitle: 'Advanced Mucosal Barrier Restoration & Acid Balance',
      solutionDesc: 'Dr. Chaitanya Gupta evaluates esophageal erosion via Upper GI Endoscopy, prescribing targeted barrier-protective and motility protocols for lasting heartburn relief.',
      serviceName: 'Chronic Acidity, GERD & Peptic Ulcer Care',
      beforeImage: '/images/gerd_16_9_clean_before.jpg',
      afterImage: '/images/gerd_16_9_clean_after.jpg',
      beforeLabel: 'Severe Acid Reflux & Mucosal Erosion',
      afterLabel: 'Tight Sphincter & Protected Barrier',
      untreatedMetrics: [
        'Acid surges into food pipe causing intense chest burning',
        'Raw esophageal mucosal erosion, inflammation & ulcers',
        'Nocturnal acid regurgitation, sour belching & night cough',
        'Risk of Barrett\'s esophagus and esophageal strictures'
      ],
      treatedMetrics: [
        'Tightened, functional lower esophageal sphincter',
        '100% Intact, smooth esophageal mucosal barrier',
        'Zero burning sensation & uninterrupted restful sleep',
        'Harmonized gastric acid balance without medication reliance'
      ]
    }
  };

  const current = conditions[activeCondition];

  return (
    <section id="gastro-explorer" className="py-20 sm:py-24 bg-[#FAFAF8] text-slate-900 relative overflow-hidden border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
            <Sliders className="w-4 h-4 text-slate-900" />
            <span>Interactive Clinical &amp; Endoscopy Explorer</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-[1.12]">
            See the Real Difference Clinical Gastro Care Makes
          </h2>
          
          <p className="text-slate-600 text-sm sm:text-base lg:text-lg mt-3 font-normal max-w-2xl mx-auto leading-relaxed">
            Drag the interactive slider below to inspect high-definition endoscopy &amp; organ recovery — comparing untreated gastrointestinal distress against fully restored health under Dr. Chaitanya Gupta.
          </p>
        </div>

        {/* Condition Tabs (Pills) */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
          {(Object.keys(conditions) as ConditionType[]).map((condKey) => {
            const item = conditions[condKey];
            const isActive = activeCondition === condKey;
            return (
              <button
                key={condKey}
                onClick={() => {
                  setActiveCondition(condKey);
                  setSliderPosition(50);
                }}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 min-h-[42px] ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100/80 border border-slate-200/90 shadow-2xs'
                }`}
              >
                <span>{item.title.split(' vs ')[0].split(' to ')[0]}</span>
                {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Main Interactive Comparison Card */}
        <div className="bg-white border border-slate-200/90 rounded-[32px] sm:rounded-[40px] overflow-hidden shadow-xs p-5 sm:p-8 lg:p-10 mb-8">
          
          {/* Card Top Title Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
            <div>
              <span className="px-3 py-1 rounded-full bg-[#E6F7F5] text-teal-900 border border-teal-200 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                {current.badge}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-slate-900 mt-2 tracking-tight">
                {current.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                {current.tagline}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-full bg-[#FEF9C3] text-amber-950 font-bold text-xs border border-amber-200 shadow-2xs hidden sm:inline-block">
                OPD Fee: ₹200 only
              </span>
              <button
                onClick={() => onBookService(current.serviceName)}
                className="px-5 sm:px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all hover:scale-102 active:scale-98 cursor-pointer min-h-[42px]"
              >
                <span>Consult for This Condition</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Split-Screen Image Comparison Canvas: 16:9 Widescreen */}
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 bg-slate-950 w-full aspect-[16/9] max-h-[520px] select-none shadow-inner group cursor-ew-resize touch-none mx-auto"
          >
            
            {/* Top-Left Floating Badge: Before */}
            <div
              className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20 px-3 sm:px-3.5 py-1.5 rounded-full bg-red-600/95 text-white text-[11px] sm:text-xs font-bold shadow-md flex items-center gap-1.5 backdrop-blur-sm pointer-events-none transition-opacity duration-200"
              style={{ opacity: sliderPosition < 12 ? 0.3 : 1 }}
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>BEFORE: {current.beforeLabel}</span>
            </div>

            {/* Top-Right Floating Badge: After */}
            <div
              className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 px-3 sm:px-3.5 py-1.5 rounded-full bg-emerald-600/95 text-white text-[11px] sm:text-xs font-bold shadow-md flex items-center gap-1.5 backdrop-blur-sm pointer-events-none transition-opacity duration-200"
              style={{ opacity: sliderPosition > 88 ? 0.3 : 1 }}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              <span>AFTER: {current.afterLabel}</span>
            </div>

            {/* Layer 1: Left / Before Image State */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={current.beforeImage}
                alt={current.beforeLabel}
                className="w-full h-full object-cover pointer-events-none"
              />
            </div>

            {/* Layer 2: Right / After Image State */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)`
              }}
            >
              <img
                src={current.afterImage}
                alt={current.afterLabel}
                className="w-full h-full object-cover pointer-events-none"
              />
            </div>

            {/* Interactive Vertical Slider Line & Center Handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-2xl pointer-events-none z-20 flex items-center justify-center -translate-x-1/2"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-slate-900 shadow-2xl flex items-center justify-center font-bold text-xs sm:text-sm border-2 border-slate-900 group-hover:scale-110 transition-transform">
                ↔
              </div>
            </div>

            {/* Invisible Range Input for Keyboard & Drag Accessibility: full 0 to 100 range */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              aria-label="Comparison slider"
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
            />
          </div>

          {/* Slider Instruction Prompt */}
          <div className="flex items-center justify-between mt-3 sm:mt-4 text-xs font-semibold text-slate-500">
            <span className="text-red-600 font-bold">← Active Disease Distress</span>
            <span className="text-slate-500 hidden sm:flex items-center gap-1.5 font-medium">
              <span>Drag slider left / right to inspect tissue recovery</span>
            </span>
            <span className="text-emerald-700 font-bold">Restored Mucosal Health →</span>
          </div>

          {/* Side-by-Side Clinical Findings Comparison (Placed cleanly below the image!) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-8">
            
            {/* Untreated Findings Card */}
            <div className="rounded-2xl p-5 sm:p-6 bg-[#FFF5F5] border border-red-200/80 space-y-3">
              <div className="flex items-center gap-2 text-red-700 font-bold text-xs uppercase tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                <span>Untreated Clinical Findings</span>
              </div>
              
              <ul className="space-y-2">
                {current.untreatedMetrics.map((metric, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 font-medium">
                    <span className="text-red-500 font-bold mt-0.5">•</span>
                    <span>{metric}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Treated Outcomes Card */}
            <div className="rounded-2xl p-5 sm:p-6 bg-[#E6F7F5] border border-teal-200/80 space-y-3">
              <div className="flex items-center gap-2 text-teal-800 font-bold text-xs uppercase tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span>Post-Treatment Healed Tissue</span>
              </div>

              <ul className="space-y-2">
                {current.treatedMetrics.map((metric, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{metric}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Dr. Gupta's Solution & OPD Banner */}
          <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-[#FEF9C3] border border-amber-300/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-900 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-800" />
                <span>Dr. Chaitanya Gupta's Clinical Protocol</span>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-slate-900">
                {current.solutionTitle}
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-2xl font-normal">
                {current.solutionDesc}
              </p>
            </div>

            <button
              onClick={() => onBookService(current.serviceName)}
              className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shrink-0 shadow-sm transition-all hover:scale-102 active:scale-98 cursor-pointer flex items-center gap-2 min-h-[44px]"
            >
              <span>Book Appointment (₹200)</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
