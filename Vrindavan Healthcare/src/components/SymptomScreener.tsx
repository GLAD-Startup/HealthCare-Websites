import React, { useState } from 'react';
import { Stethoscope, Check, ArrowRight, RotateCcw, Sparkles, Activity, HeartPulse } from 'lucide-react';
import { DOCTOR_CHAITANYA } from '../data/clinicData';

interface SymptomScreenerProps {
  onBookRecommendation: (serviceName: string, doctorName: string) => void;
}

interface SymptomItem {
  id: string;
  category: 'gastro' | 'general';
  label: string;
  description: string;
  icon: string;
}

export const SymptomScreener: React.FC<SymptomScreenerProps> = ({ onBookRecommendation }) => {
  const [category, setCategory] = useState<'gastro' | 'general'>('gastro');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const gastroSymptoms: SymptomItem[] = [
    {
      id: 'severe-acidity',
      category: 'gastro',
      label: 'Chronic Acidity, Heartburn & Sour Belching',
      description: 'Burning sensation in chest or throat after meals, regurgitation, nocturnal cough (GERD).',
      icon: '🔥'
    },
    {
      id: 'stomach-pain-ulcer',
      category: 'gastro',
      label: 'Gnawing Upper Abdominal Pain & Bloating',
      description: 'Persistent stomach ache relieved or worsened by food, heavy gas, suspected gastritis/ulcer.',
      icon: '⚡'
    },
    {
      id: 'fatty-liver-jaundice',
      category: 'gastro',
      label: 'Fatty Liver Signs, Jaundice or Dark Urine',
      description: 'Heaviness in right upper abdomen, fatigue, yellowing eyes, elevated SGOT/SGPT enzymes.',
      icon: '🟡'
    },
    {
      id: 'ibs-bowel-irregularity',
      category: 'gastro',
      label: 'Alternating Diarrhea, Constipation & Spasms',
      description: 'Unpredictable bowel movements, mucus in stool, chronic cramping (Irritable Bowel Syndrome).',
      icon: '🌀'
    },
    {
      id: 'gi-bleeding-black-stool',
      category: 'gastro',
      label: 'Dark Black Stools or Blood in Vomit (GI Bleed)',
      description: 'Critical sign of active gastric/esophageal bleeding requiring urgent Upper GI Endoscopy.',
      icon: '🚨'
    },
    {
      id: 'swallowing-difficulty',
      category: 'gastro',
      label: 'Difficulty Swallowing (Dysphagia) & Weight Loss',
      description: 'Food feels stuck in food pipe, unexplained weight loss, poor appetite.',
      icon: '⚠️'
    }
  ];

  const generalSymptoms: SymptomItem[] = [
    {
      id: 'diabetes-thirst',
      category: 'general',
      label: 'Fluctuating Sugar, Extreme Thirst & Fatigue',
      description: 'High fasting blood glucose, frequent urination, unexplained exhaustion (Diabetes Mellitus).',
      icon: '🩸'
    },
    {
      id: 'hypertension-headache',
      category: 'general',
      label: 'High Blood Pressure & Morning Dizziness',
      description: 'Systolic BP > 140, throbbing headaches, palpitations, cardiovascular assessment required.',
      icon: '💓'
    },
    {
      id: 'fever-infection',
      category: 'general',
      label: 'Recurrent High Fever, Chills & Body Pain',
      description: 'Persistent fever, suspected typhoid, viral infection, or acute infection episode.',
      icon: '🌡️'
    },
    {
      id: 'joint-pain-gout',
      category: 'general',
      label: 'Chronic Joint Swelling, Stiffness & High Uric Acid',
      description: 'Inflammatory joint discomfort, gout flares in big toe, rheumatoid evaluation.',
      icon: '🦴'
    },
    {
      id: 'obesity-fatigue',
      category: 'general',
      label: 'Weight Gain, Sluggish Metabolism & Snoring',
      description: 'Visceral abdominal obesity, metabolic syndrome, fatty liver risk factor.',
      icon: '⚖️'
    },
    {
      id: 'allergy-cough',
      category: 'general',
      label: 'Seasonal Allergy, Wheezing & Chronic Cough',
      description: 'Persistent throat clearing, skin rashes, or allergic bronchitis.',
      icon: '🍃'
    }
  ];

  const currentSymptoms = category === 'gastro' ? gastroSymptoms : generalSymptoms;

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSymptoms.length > 0) {
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setIsSubmitted(false);
  };

  // Dynamic recommendation algorithm
  const getRecommendation = () => {
    const hasBleed = selectedSymptoms.includes('gi-bleeding-black-stool');
    const hasAcidity = selectedSymptoms.includes('severe-acidity') || selectedSymptoms.includes('stomach-pain-ulcer');
    const hasLiver = selectedSymptoms.includes('fatty-liver-jaundice');
    const hasIbs = selectedSymptoms.includes('ibs-bowel-irregularity');
    const hasSwallow = selectedSymptoms.includes('swallowing-difficulty');
    const hasDiabetes = selectedSymptoms.includes('diabetes-thirst');
    const hasHypertension = selectedSymptoms.includes('hypertension-headache');

    if (hasBleed || hasSwallow) {
      return {
        priority: 'Urgent / Priority Clinical Evaluation',
        service: 'Upper GI Endoscopy (Diagnostic & Therapeutic)',
        description: 'Symptoms indicate potential gastric mucosal bleeding or esophageal obstruction. Direct high-definition endoscopic evaluation by Dr. Chaitanya Gupta is strongly recommended.',
        doctor: DOCTOR_CHAITANYA.name
      };
    }

    if (hasLiver) {
      return {
        priority: 'Super-Specialty Hepatology Evaluation',
        service: 'Fatty Liver & Liver Cirrhosis Management',
        description: 'Signs suggest hepatic steatosis or liver enzyme elevation. Ultrasound staging and liver function panel under Dr. Chaitanya Gupta will safeguard your liver health.',
        doctor: DOCTOR_CHAITANYA.name
      };
    }

    if (hasAcidity) {
      return {
        priority: 'Comprehensive Acidity & GERD Protocol',
        service: 'Chronic Acidity, GERD & Peptic Ulcer Care',
        description: 'Symptoms correlate with acid peptic disease or H. pylori gastritis. Dr. Chaitanya Gupta can evaluate whether an Upper GI Endoscopy or targeted mucosal healing protocol is best.',
        doctor: DOCTOR_CHAITANYA.name
      };
    }

    if (hasIbs) {
      return {
        priority: 'Digestive Motility & Gut Health Care',
        service: 'IBS, Colitis & Inflammatory Bowel Disease (IBD)',
        description: 'Presentation matches irritable bowel syndrome or intestinal motility irregularity. Customized dietary low-FODMAP protocol and gut motility regulation recommended.',
        doctor: DOCTOR_CHAITANYA.name
      };
    }

    if (hasDiabetes || hasHypertension) {
      return {
        priority: 'Metabolic & Cardiovascular Physician Evaluation',
        service: 'Diabetes & Metabolic Disorder Management',
        description: 'Comprehensive physician workup for glycemic stabilization, blood pressure titration, and prevention of vascular complications by Dr. Chaitanya Gupta.',
        doctor: DOCTOR_CHAITANYA.name
      };
    }

    return {
      priority: 'General Medical OPD Consultation',
      service: 'Comprehensive Gastro & Physician OPD Consultation',
      description: 'Consult Dr. Chaitanya Gupta at either Raman Reti (near ISKCON) or Hanuman Bagh clinic for complete clinical examination at an accessible ₹200 fee.',
      doctor: DOCTOR_CHAITANYA.name
    };
  };

  const recommendation = getRecommendation();

  return (
    <section id="screener" className="py-10 sm:py-16 lg:py-20 bg-[#FAFAF8] border-t border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-800 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2.5 sm:mb-3 shadow-2xs">
            <Stethoscope className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-900" />
            <span>Interactive Patient Guidance Tool</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-[1.15]">
            Digestive &amp; Health Symptom Screener
          </h2>
          
          <p className="text-slate-600 text-xs sm:text-base lg:text-lg mt-2 sm:mt-3 font-normal max-w-2xl mx-auto leading-relaxed">
            Select what you are experiencing to receive a personalized clinical recommendation and priority OPD consultation with Dr. Chaitanya Gupta.
          </p>
        </div>

        {/* Category Selector Tabs (Segmented 2-tab control on mobile) */}
        <div className="flex justify-center mb-5 sm:mb-8 w-full">
          <div className="grid grid-cols-2 w-full max-w-lg p-1 rounded-2xl bg-white border border-slate-200 shadow-2xs gap-1">
            <button
              type="button"
              onClick={() => {
                setCategory('gastro');
                setSelectedSymptoms([]);
                setIsSubmitted(false);
              }}
              className={`px-3 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 min-h-[44px] text-center ${
                category === 'gastro'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Activity className="w-4 h-4 shrink-0 text-emerald-400" />
              <span className="truncate">Liver &amp; Gastro</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCategory('general');
                setSelectedSymptoms([]);
                setIsSubmitted(false);
              }}
              className={`px-3 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 min-h-[44px] text-center ${
                category === 'general'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <HeartPulse className="w-4 h-4 shrink-0 text-amber-300" />
              <span className="truncate">General Medicine</span>
            </button>
          </div>
        </div>

        {!isSubmitted ? (
          /* Symptoms Selection Form */
          <form onSubmit={handleEvaluate} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {currentSymptoms.map((symptom) => {
                const isSelected = selectedSymptoms.includes(symptom.id);
                return (
                  <div
                    key={symptom.id}
                    onClick={() => toggleSymptom(symptom.id)}
                    className={`p-3.5 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer select-none flex items-start gap-3 sm:gap-4 ${
                      isSelected
                        ? category === 'gastro'
                          ? 'bg-[#E6F7F5] border-teal-300 shadow-sm ring-2 ring-teal-400/50'
                          : 'bg-[#FEF9C3] border-amber-300 shadow-sm ring-2 ring-amber-300/70'
                        : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-xs'
                    }`}
                  >
                    <div className="text-xl sm:text-2xl shrink-0 mt-0.5">
                      {symptom.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                          {symptom.label}
                        </h4>
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors mt-0.5 ${
                          isSelected ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                        {symptom.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-slate-200">
              <div className="text-xs text-slate-600 font-medium text-center sm:text-left">
                {selectedSymptoms.length === 0 ? (
                  <span>Select at least 1 symptom above to generate recommendation</span>
                ) : (
                  <span className="text-slate-900 font-bold flex items-center justify-center sm:justify-start gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    <span>{selectedSymptoms.length} symptom{selectedSymptoms.length > 1 ? 's' : ''} selected</span>
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={selectedSymptoms.length === 0}
                className={`w-full sm:w-auto px-7 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px] ${
                  selectedSymptoms.length > 0
                    ? 'bg-slate-900 hover:bg-slate-800 text-white hover:scale-102 active:scale-98'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Evaluate Symptoms</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          /* Results Card */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 animate-fadeIn">
            <div className="flex items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FEF08A] text-slate-900 border border-amber-300 text-xs font-bold uppercase tracking-wider shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-slate-900" />
                <span>Clinical Triage Recommendation</span>
              </div>

              <button
                onClick={handleReset}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Screener</span>
              </button>
            </div>

            <div className="py-6 space-y-4">
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                {recommendation.priority}
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif text-slate-900 tracking-tight">
                Recommended: {recommendation.service}
              </h3>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {recommendation.description}
              </p>

              {/* Doctor Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#E6F7F5] border border-teal-200/80 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden shadow-sm shrink-0 border-2 border-white bg-white">
                  <img
                    src={DOCTOR_CHAITANYA.image}
                    alt={DOCTOR_CHAITANYA.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-[11px] text-teal-900 font-bold uppercase tracking-wider">
                    Recommended Specialist
                  </div>
                  <div className="text-base sm:text-lg font-extrabold text-slate-900">
                    {DOCTOR_CHAITANYA.name}
                  </div>
                  <div className="text-xs text-teal-800 font-medium">
                    {DOCTOR_CHAITANYA.title} • {DOCTOR_CHAITANYA.qualifications}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
              <div className="text-xs text-slate-600 font-medium">
                OPD Fee: <strong className="text-slate-900 font-bold">₹200</strong> | Raman Reti &amp; Hanuman Bagh Clinics
              </div>

              <button
                onClick={() => onBookRecommendation(recommendation.service, recommendation.doctor)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all hover:scale-102 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Book Priority OPD with {recommendation.doctor}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
