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
    <section id="screener" className="py-20 bg-[#F8FAFC] border-t border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F0FDFA] text-[#0F766E] text-xs font-bold uppercase tracking-wider mb-3">
            <Stethoscope className="w-4 h-4 text-[#0F766E]" />
            <span>Interactive Patient Guidance Tool</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Digestive &amp; Health Symptom Screener
          </h2>
          
          <p className="text-slate-600 text-base sm:text-lg mt-3 font-medium">
            Select what you are experiencing to receive a personalized clinical recommendation and priority OPD consultation with Dr. Chaitanya Gupta.
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <button
              onClick={() => {
                setCategory('gastro');
                setSelectedSymptoms([]);
                setIsSubmitted(false);
              }}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
                category === 'gastro'
                  ? 'bg-[#0F766E] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Liver &amp; Gastro Symptoms</span>
            </button>

            <button
              onClick={() => {
                setCategory('general');
                setSelectedSymptoms([]);
                setIsSubmitted(false);
              }}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
                category === 'general'
                  ? 'bg-[#0F766E] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HeartPulse className="w-4 h-4" />
              <span>General Physician &amp; Metabolic</span>
            </button>
          </div>
        </div>

        {!isSubmitted ? (
          /* Symptoms Selection Form */
          <form onSubmit={handleEvaluate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentSymptoms.map((symptom) => {
                const isSelected = selectedSymptoms.includes(symptom.id);
                return (
                  <div
                    key={symptom.id}
                    onClick={() => toggleSymptom(symptom.id)}
                    className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer select-none flex items-start gap-4 ${
                      isSelected
                        ? 'bg-[#F0FDFA] border-[#0F766E] shadow-md ring-1 ring-[#0F766E]'
                        : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="text-2xl shrink-0 mt-0.5">
                      {symptom.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={`text-base font-bold ${isSelected ? 'text-[#0F766E]' : 'text-slate-900'}`}>
                          {symptom.label}
                        </h4>
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                          isSelected ? 'bg-[#0F766E] border-[#0F766E] text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                        {symptom.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
              <div className="text-xs text-slate-500 font-medium">
                {selectedSymptoms.length === 0 ? (
                  <span>Select at least 1 symptom above to generate recommendation</span>
                ) : (
                  <span className="text-[#0F766E] font-bold">
                    {selectedSymptoms.length} symptom{selectedSymptoms.length > 1 ? 's' : ''} selected
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={selectedSymptoms.length === 0}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  selectedSymptoms.length > 0
                    ? 'bg-[#0F766E] hover:bg-[#0D9488] text-white hover:scale-105 active:scale-95'
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Clinical Triage Recommendation</span>
              </div>

              <button
                onClick={handleReset}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Screener</span>
              </button>
            </div>

            <div className="py-6 space-y-4">
              <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                {recommendation.priority}
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Recommended: {recommendation.service}
              </h3>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                {recommendation.description}
              </p>

              {/* Doctor Card */}
              <div className="p-4 rounded-2xl bg-[#F0FDFA] border border-[#CCFBF1] flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden shadow-sm shrink-0 border-2 border-white bg-slate-100">
                  <img
                    src={DOCTOR_CHAITANYA.image}
                    alt={DOCTOR_CHAITANYA.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-xs text-teal-800 font-bold uppercase tracking-wider">
                    Recommended Specialist
                  </div>
                  <div className="text-base font-extrabold text-slate-900">
                    {DOCTOR_CHAITANYA.name}
                  </div>
                  <div className="text-xs text-[#0F766E] font-semibold">
                    {DOCTOR_CHAITANYA.title} • {DOCTOR_CHAITANYA.qualifications}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
              <div className="text-xs text-slate-500 font-medium">
                OPD Fee: <strong className="text-slate-900 font-bold">₹200</strong> | Raman Reti &amp; Hanuman Bagh Clinics
              </div>

              <button
                onClick={() => onBookRecommendation(recommendation.service, recommendation.doctor)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#0F766E] hover:bg-[#0D9488] text-white font-bold text-sm shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
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
