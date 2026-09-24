import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Award, ArrowRight } from 'lucide-react';

interface BeforeAfterShowcaseProps {
  onBookTreatment: (treatmentName: string) => void;
}

interface GalleryItem {
  id: string;
  title: string;
  category: 'Gastro & Endoscopy' | 'Liver & Hepatology' | 'General Medicine';
  timeframe: string;
  doctor: string;
  description: string;
  treatmentName: string;
  symptomsResolved: string[];
  clinicalOutcome: string;
  image: string;
}

export const BeforeAfterShowcase: React.FC<BeforeAfterShowcaseProps> = ({ onBookTreatment }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'gastro' | 'liver' | 'general'>('all');
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);

  const galleryItems: GalleryItem[] = [
    {
      id: 'gerd-recovery',
      title: 'Erosive Reflux Esophagitis (GERD) Healing',
      category: 'Gastro & Endoscopy',
      timeframe: '4 Weeks Targeted Protocol',
      doctor: 'Dr. Chaitanya Gupta (Gastroenterologist)',
      description: 'Patient presented with severe nocturnal acid burning, sour regurgitation, and throat discomfort. Upper GI Endoscopy revealed mucosal erosions. Targeted acid suppression and barrier protection achieved full healing.',
      treatmentName: 'Upper GI Endoscopy (Diagnostic & Therapeutic)',
      symptomsResolved: ['Severe retrosternal burning eliminated', 'Nocturnal cough & sour regurgitation stopped', 'Normal food swallowing restored'],
      clinicalOutcome: '100% Mucosal healing confirmed on review with complete symptom relief.',
      image: '/images/dr_chaitanya_endoscopy_procedure.jpeg'
    },
    {
      id: 'fatty-liver-reversal',
      title: 'Grade 2 Fatty Liver & Enzyme Normalization',
      category: 'Liver & Hepatology',
      timeframe: '8 Weeks Hepatology Care',
      doctor: 'Dr. Chaitanya Gupta (Liver Specialist)',
      description: '42-year-old patient presented with fatigue and right hypochondriac fullness. Labs showed SGOT 98 U/L and SGPT 132 U/L with Grade 2 hepatic steatosis. Dr. Gupta tailored a hepatoprotective protocol.',
      treatmentName: 'Fatty Liver & Liver Cirrhosis Management',
      symptomsResolved: ['Enzymes dropped: SGOT 28, SGPT 34 (Normal)', 'Reversal of hepatic steatosis on ultrasound', 'Chronic lethargy and abdominal heaviness gone'],
      clinicalOutcome: 'Normalized liver biochemistry and active metabolic restoration.',
      image: '/images/dr_chaitanya_press_conf.jpeg'
    },
    {
      id: 'peptic-ulcer-h-pylori',
      title: 'Bleeding Duodenal Ulcer & H. Pylori Eradication',
      category: 'Gastro & Endoscopy',
      timeframe: '6 Weeks Therapy',
      doctor: 'Dr. Chaitanya Gupta (DM Gastroenterology)',
      description: 'Patient had recurring intense mid-epigastric gnawing pain with dark stools. Endoscopic evaluation pinpointed an active bleeding crater ulcer. Biopsy confirmed H. pylori, followed by successful eradication.',
      treatmentName: 'Chronic Acidity, GERD & Peptic Ulcer Care',
      symptomsResolved: ['GI bleeding completely arrested', 'Gastric gnawing pain permanently resolved', 'H. pylori bacterial culture cleared'],
      clinicalOutcome: 'Complete re-epithelialization of the ulcer crater without recurrence.',
      image: '/images/dr_chaitanya_ercp_ot.jpeg'
    },
    {
      id: 'ibs-gut-relief',
      title: 'Chronic IBS & Intestinal Spasm Remission',
      category: 'General Medicine',
      timeframe: '3 Weeks Motility Protocol',
      doctor: 'Dr. Chaitanya Gupta (Consultant Physician)',
      description: 'Patient endured 2 years of erratic bowel movements, painful abdominal spasms, and bloating. Structured dietary low-FODMAP guidance and gut motility modulation restored regular bowel transit.',
      treatmentName: 'IBS, Colitis & Inflammatory Bowel Disease (IBD)',
      symptomsResolved: ['Intestinal cramping and pain eliminated', 'Regular daily bowel regularity achieved', 'Significant decrease in gas and abdominal distension'],
      clinicalOutcome: 'Restored confidence, dietary variety, and quality of life.',
      image: '/images/endoscopy_monitor_live.jpeg'
    }
  ];

  const filteredItems = galleryItems.filter((item) => {
    if (activeTab === 'gastro') return item.category === 'Gastro & Endoscopy';
    if (activeTab === 'liver') return item.category === 'Liver & Hepatology';
    if (activeTab === 'general') return item.category === 'General Medicine';
    return true;
  });

  const currentItem = filteredItems[activeItemIndex] || filteredItems[0];

  return (
    <section id="results-gallery" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F0FDFA] text-[#0F766E] text-xs font-bold uppercase tracking-wider mb-3">
            <Award className="w-4 h-4 text-[#F59E0B]" />
            <span>Documented Clinical Outcomes</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Real Patient Recoveries in Vrindavan
          </h2>
          
          <p className="text-slate-600 text-base sm:text-lg mt-3 font-medium">
            Explore case studies of clinical relief across liver diseases, endoscopy diagnoses, chronic acidity, and intestinal health delivered by Dr. Chaitanya Gupta.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { id: 'all', label: 'All Case Studies' },
            { id: 'gastro', label: 'Endoscopy & Reflux' },
            { id: 'liver', label: 'Fatty Liver & Cirrhosis' },
            { id: 'general', label: 'IBS & Internal Medicine' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setActiveItemIndex(0);
              }}
              className={`min-h-[44px] px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center justify-center cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#0F766E] text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Case Study Feature Card */}
        <div className="bg-[#F8FAFC] rounded-3xl border border-slate-200/90 p-5 sm:p-8 lg:p-10 shadow-lg max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Case Info */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#F0FDFA] text-[#0F766E] text-xs font-bold uppercase tracking-wider border border-[#CCFBF1]">
                  {currentItem.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-200/80 text-slate-700 text-xs font-bold">
                  ⏱️ {currentItem.timeframe}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {currentItem.title}
              </h3>

              <div className="text-xs text-slate-500 font-semibold">
                Supervised by <span className="text-[#0F766E] font-bold">{currentItem.doctor}</span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {currentItem.description}
              </p>

              {/* Symptoms Resolved */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Key Symptoms Relieved:
                </div>
                {currentItem.symptomsResolved.map((sym, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{sym}</span>
                  </div>
                ))}
              </div>

              {/* Outcome Highlight */}
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{currentItem.clinicalOutcome}</span>
              </div>

              {/* Button */}
              <div className="pt-2">
                <button
                  onClick={() => onBookTreatment(currentItem.treatmentName)}
                  className="w-full sm:w-auto min-h-[44px] justify-center px-6 py-3 rounded-full bg-[#0F766E] hover:bg-[#0D9488] text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <span>Book Consultation for this Condition</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: Clinical Photo Frame & Quick Selection Cards */}
            <div className="lg:col-span-5 space-y-4">
              {/* Clinical Documentation Photo Frame */}
              <div className="relative rounded-2xl overflow-hidden shadow-md border-2 border-white bg-slate-100 aspect-16/10 group">
                <img
                  src={currentItem.image}
                  alt={currentItem.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2.5 left-3 right-3 text-white text-[11px] font-semibold flex items-center justify-between">
                  <span className="bg-[#0F766E]/90 px-2 py-0.5 rounded-md text-[10px]">Clinical Case Evidence</span>
                  <span className="text-slate-200 text-[10px]">{currentItem.category}</span>
                </div>
              </div>

              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 pt-1">
                Select Case Study:
              </div>

              {filteredItems.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setActiveItemIndex(idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    activeItemIndex === idx
                      ? 'bg-white border-[#0F766E] shadow-md ring-1 ring-[#0F766E]'
                      : 'bg-white/80 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div>
                    <h4 className={`text-sm font-bold ${activeItemIndex === idx ? 'text-[#0F766E]' : 'text-slate-900'}`}>
                      {item.title}
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      {item.category} • {item.timeframe}
                    </span>
                  </div>
                  <ArrowRight className={`w-4 h-4 ${activeItemIndex === idx ? 'text-[#0F766E]' : 'text-slate-400'}`} />
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
