import React, { useEffect } from 'react';
import { CheckCircle2, UserCheck, Stethoscope, Star, MapPin, Calendar, HeartHandshake } from 'lucide-react';
import { DOCTOR_CHAITANYA } from '../data/clinicData';
import { animate } from 'animejs';

interface DoctorProfileProps {
  onBookDoctor: (doctorName: string) => void;
}

export const DoctorProfile: React.FC<DoctorProfileProps> = ({ onBookDoctor }) => {
  useEffect(() => {
    animate('.doctor-profile-anime', {
      opacity: [0, 1],
      translateY: [35, 0],
      duration: 900,
      ease: 'outExpo'
    });
  }, []);

  return (
    <section id="doctor" className="py-20 bg-[#FAFAF8] border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-slate-900" />
            <UserCheck className="w-4 h-4 text-slate-900" />
            <span>Consultant Profile</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-[1.12]">
            Meet Dr. Chaitanya Gupta
          </h2>

          <p className="text-slate-600 text-sm sm:text-base lg:text-lg mt-3 font-normal max-w-2xl mx-auto leading-relaxed">
            Dedicated Liver &amp; Gastro Specialist and Consultant Physician bringing high-definition endoscopic care and ethical medicine to Vrindavan.
          </p>
        </div>

        {/* Doctor Main Showcase Card */}
        <div className="doctor-profile-anime bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-5xl mx-auto hover:shadow-2xl transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-5 sm:p-10 lg:p-12">
            
            {/* Left Col: Photo & Verified Badges */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-56 sm:w-72 h-72 sm:h-92 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 group">
                <img
                  src={DOCTOR_CHAITANYA.image}
                  alt={DOCTOR_CHAITANYA.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                
                <div className="absolute bottom-3 left-3 right-3 p-2 bg-slate-900/75 backdrop-blur-md rounded-xl text-center text-white border border-white/20">
                  <div className="text-xs font-bold text-amber-300">MD (2018) • DM (Gastroenterology)</div>
                  <div className="text-[10px] text-slate-300">SRMS IMS Bareilly</div>
                </div>
              </div>

              {/* Justdial & Rating Bar */}
              <div className="mt-4 flex items-center gap-3 py-2 px-4 rounded-full bg-[#FEF9C3] border border-amber-300/80 shadow-2xs">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-extrabold text-slate-900 text-xs ml-1">4.5 / 5</span>
                </div>
                <span className="text-amber-400">|</span>
                <span className="text-xs text-slate-800 font-semibold">65+ Justdial Ratings</span>
              </div>
            </div>

            {/* Right Col: Qualifications, Bio & Expertise */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E6F7F5] text-teal-900 border border-teal-200/80 text-xs font-bold uppercase tracking-wider mb-2">
                  <Stethoscope className="w-3.5 h-3.5 text-teal-700" />
                  <span>Liver &amp; Gastro Specialist • Physician</span>
                </div>

                <h3 className="text-3xl sm:text-4xl font-serif text-slate-900 tracking-tight">
                  {DOCTOR_CHAITANYA.name}
                </h3>

                <div className="text-teal-800 font-bold text-base sm:text-lg mt-1">
                  {DOCTOR_CHAITANYA.qualifications}
                </div>

                <div className="text-slate-500 text-xs font-semibold mt-0.5">
                  MD (General Medicine) completed in 2018 from SRMS IMS, Bareilly
                </div>
              </div>

              {/* Bio Paragraph */}
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                {DOCTOR_CHAITANYA.bio}
              </p>

              {/* Lybrate Ethical Statement Quote */}
              <div className="p-4 rounded-2xl bg-[#FEF9C3]/75 border-l-4 border-amber-400 text-xs text-slate-800 space-y-1 shadow-2xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <HeartHandshake className="w-4 h-4 text-amber-600" />
                  <span>Doctor's Philosophy &amp; Medical Ethics</span>
                </div>
                <p className="italic leading-relaxed">
                  "We welcome every patient into a supportive, comforting environment. Our practice is built on strong medical ethics, thorough explanations, transparent care, and affordable treatment."
                </p>
              </div>

              {/* Key Clinical Capabilities */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div className="flex items-center gap-2 text-xs text-slate-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Upper GI Endoscopy Diagnostic &amp; Biopsy</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Fatty Liver &amp; Cirrhosis Reversal Protocols</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Severe Acidity, GERD &amp; Peptic Ulcers</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Emergency &amp; Critical Internal Medicine</span>
                </div>
              </div>

              {/* Clinic Locations Info */}
              <div className="p-3.5 rounded-2xl bg-[#E6F7F5] border border-teal-200/80 text-xs space-y-1 shadow-2xs">
                <div className="font-bold text-teal-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-700" />
                  <span>Practicing at 2 Locations in Vrindavan (PIN 281121):</span>
                </div>
                <div className="text-slate-700 pl-5">
                  • <strong>Location A:</strong> Bhakti Vedant Marg, Raman Reti (Near ISKCON Temple)
                </div>
                <div className="text-slate-700 pl-5">
                  • <strong>Location B:</strong> Bankey Bihari Nikunj, Hanuman Bagh (Near Brijwasi Mithai Wala)
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xs text-slate-600 font-medium">
                  Consultation Fee: <strong className="text-slate-900 font-bold text-sm">₹200</strong> (Cash, UPI, Cards)
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => onBookDoctor(DOCTOR_CHAITANYA.name)}
                    className="w-full sm:w-auto min-h-[46px] justify-center px-7 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all hover:scale-102 active:scale-98 cursor-pointer flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-white" />
                    <span>BOOK APPOINTMENT WITH DR. GUPTA</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Real Clinical Action Photo Showcase */}
        <div className="mt-10 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Clinical Excellence &amp; Community Health in Action</span>
            </h4>
            <span className="text-xs font-bold text-slate-900 bg-[#FEF08A] px-3.5 py-1 rounded-full border border-amber-300 shadow-2xs">
              Verified Vrindavan Practice
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Press Conference / Patient Advocacy */}
            <div className="group rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all">
              <div className="aspect-4/3 overflow-hidden bg-slate-100 relative">
                <img
                  src="/images/dr_chaitanya_press_conf.jpeg"
                  alt="Dr. Chaitanya Gupta addressing World IBD Day Press Conference"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-bold">
                  World IBD Day • Vrindavan
                </span>
              </div>
              <div className="p-3.5">
                <div className="text-xs font-bold text-slate-900">Patient Education &amp; IBD Awareness</div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Dr. Chaitanya Gupta addressing press conference on Inflammatory Bowel Disease (IBD).
                </p>
              </div>
            </div>

            {/* Card 2: Upper GI Endoscopy Procedure */}
            <div className="group rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all">
              <div className="aspect-4/3 overflow-hidden bg-slate-100 relative">
                <img
                  src="/images/dr_chaitanya_endoscopy_procedure.jpeg"
                  alt="Dr. Chaitanya Gupta performing Upper GI Endoscopy"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-bold">
                  Endoscopy Suite
                </span>
              </div>
              <div className="p-3.5">
                <div className="text-xs font-bold text-slate-900">Upper GI Endoscopy Procedure</div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Painless diagnostic &amp; therapeutic video endoscopy performed with clinical surgical team.
                </p>
              </div>
            </div>

            {/* Card 3: Advanced ERCP & Stone Removal */}
            <div className="group rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all">
              <div className="aspect-4/3 overflow-hidden bg-slate-100 relative">
                <img
                  src="/images/dr_chaitanya_ercp_ot.jpeg"
                  alt="Dr. Chaitanya Gupta doing ERCP CBD stone removal"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-bold">
                  ERCP &amp; OT
                </span>
              </div>
              <div className="p-3.5">
                <div className="text-xs font-bold text-slate-900">ERCP in CBD Stone Removal</div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Advanced biliary interventions and endoscopic stone extraction completed safely in OT.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
