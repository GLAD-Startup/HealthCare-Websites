import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  UserCheck,
  Stethoscope,
  Star,
  MapPin,
  Calendar,
  HeartHandshake,
  Award,
  Phone,
  Mail,
  X,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Clock
} from 'lucide-react';
import { DOCTOR_CHAITANYA, DOCTOR_AISHWARYA } from '../data/clinicData';
import { animate } from 'animejs';

interface DoctorProfileProps {
  onBookDoctor: (doctorName: string) => void;
}

export const DoctorProfile: React.FC<DoctorProfileProps> = ({ onBookDoctor }) => {
  const [showVisitingCardModal, setShowVisitingCardModal] = useState<boolean>(false);

  useEffect(() => {
    animate('.doctor-card-anime', {
      opacity: [0, 1],
      translateY: [25, 0],
      delay: (_el, i) => (i || 0) * 150,
      duration: 700,
      ease: 'outExpo'
    });
  }, []);

  return (
    <section id="doctor" className="py-10 sm:py-16 lg:py-20 bg-[#FAFAF8] border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-800 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2.5 sm:mb-3 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-slate-900" />
            <UserCheck className="w-4 h-4 text-slate-900" />
            <span>Consultant Doctors &amp; Specialists</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-[1.15]">
            Meet Our Senior Consultants
          </h2>

          <p className="text-slate-600 text-xs sm:text-base lg:text-lg mt-2 sm:mt-3 font-normal max-w-2xl mx-auto leading-relaxed">
            Delivering advanced gastrointestinal endoscopy, liver disease management, and gold-medalist internal medicine care to Vrindavan and Mathura district.
          </p>
        </div>

        {/* Both Doctors Displayed Side-by-Side in One Go */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          
          {/* ============================================================== */}
          {/* DOCTOR 1: DR. CHAITANYA GUPTA */}
          {/* ============================================================== */}
          <div className="doctor-card-anime bg-white rounded-3xl sm:rounded-[36px] border border-teal-200/90 p-5 sm:p-7 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative">
            
            <div>
              {/* Top Accent Ribbon */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F7F5] text-teal-900 text-[11px] sm:text-xs font-bold uppercase tracking-wider border border-teal-200/80">
                  <Stethoscope className="w-3.5 h-3.5 text-teal-700" />
                  <span>Liver &amp; Gastro Specialist • DM Gastro</span>
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FEF9C3] text-slate-900 text-xs font-extrabold border border-amber-300/80 shadow-2xs">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{DOCTOR_CHAITANYA.rating} ({DOCTOR_CHAITANYA.totalReviews}+ Reviews)</span>
                </span>
              </div>

              {/* Doctor Photo & Header Details */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center mt-5">
                {/* Photo Frame */}
                <div className="relative w-32 h-40 sm:w-36 sm:h-44 rounded-2xl overflow-hidden shadow-md border-2 border-slate-100 bg-slate-100 shrink-0 group">
                  <img
                    src={DOCTOR_CHAITANYA.image}
                    alt={DOCTOR_CHAITANYA.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-2 left-2 right-2 text-center text-[10px] font-bold text-amber-300 bg-slate-900/80 backdrop-blur-xs py-0.5 rounded px-1">
                    MD (2018) • DM Gastro
                  </div>
                </div>

                {/* Name & Qualifications */}
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                    {DOCTOR_CHAITANYA.name}
                  </h3>
                  <div className="text-teal-800 font-bold text-xs sm:text-sm mt-1">
                    {DOCTOR_CHAITANYA.qualifications}
                  </div>
                  <div className="text-slate-500 text-[11px] sm:text-xs font-medium mt-1">
                    SRMS IMS Bareilly • Verified Vrindavan Practice
                  </div>

                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] sm:text-[11px] font-bold">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Endoscopy &amp; Hepatology</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] sm:text-[11px] font-semibold">
                      ₹200 OPD Fee
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio Snippet */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-4 font-normal">
                {DOCTOR_CHAITANYA.bio}
              </p>

              {/* Doctor Philosophy */}
              <div className="mt-4 p-3 sm:p-3.5 rounded-2xl bg-[#FEF9C3]/75 border-l-4 border-amber-400 text-xs text-slate-800 space-y-1 shadow-2xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <HeartHandshake className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Doctor's Philosophy &amp; Medical Ethics</span>
                </div>
                <p className="italic leading-relaxed">
                  "We welcome every patient into a supportive, comforting environment. Our practice is built on strong medical ethics, thorough explanations, transparent care, and affordable treatment."
                </p>
              </div>

              {/* Key Capabilities */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Specialized Clinical Focus
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-800 font-semibold">
                  {(DOCTOR_CHAITANYA.capabilities || []).map((cap, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-[11px] sm:text-xs leading-snug">{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Procedure Photo Thumbnails */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="group/item rounded-xl overflow-hidden border border-slate-200 bg-slate-50 relative aspect-[16/10]">
                    <img
                      src="/images/dr_chaitanya_endoscopy_procedure.jpeg"
                      alt="Dr. Chaitanya performing Upper GI Endoscopy"
                      className="w-full h-full object-cover object-top group-hover/item:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <span className="absolute bottom-1.5 left-2 right-2 text-[10px] font-bold text-white truncate">
                      Upper GI Endoscopy Suite
                    </span>
                  </div>

                  <div className="group/item rounded-xl overflow-hidden border border-slate-200 bg-slate-50 relative aspect-[16/10]">
                    <img
                      src="/images/dr_chaitanya_ercp_ot.jpeg"
                      alt="Dr. Chaitanya Gupta doing ERCP in OT"
                      className="w-full h-full object-cover object-center group-hover/item:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <span className="absolute bottom-1.5 left-2 right-2 text-[10px] font-bold text-white truncate">
                      ERCP &amp; OT Procedures
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-600 font-medium">
                OPD Fee: <strong className="text-slate-900 font-bold text-sm">₹200</strong>
              </div>

              <button
                onClick={() => onBookDoctor(DOCTOR_CHAITANYA.name)}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all hover:scale-102 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-white shrink-0" />
                <span>Book with Dr. Chaitanya</span>
              </button>
            </div>

          </div>

          {/* ============================================================== */}
          {/* DOCTOR 2: DR. AISHWARYA SINGHAL GUPTA */}
          {/* ============================================================== */}
          <div className="doctor-card-anime bg-white rounded-3xl sm:rounded-[36px] border border-amber-200/90 p-5 sm:p-7 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative">
            
            <div>
              {/* Top Accent Ribbon */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF9C3] text-amber-950 text-[11px] sm:text-xs font-bold uppercase tracking-wider border border-amber-300/80">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>Academic Gold Medalist • MD Medicine</span>
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FEF9C3] text-slate-900 text-xs font-extrabold border border-amber-300/80 shadow-2xs">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{DOCTOR_AISHWARYA.rating} ({DOCTOR_AISHWARYA.totalReviews}+ Reviews)</span>
                </span>
              </div>

              {/* Doctor Photo & Header Details */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center mt-5">
                {/* Photo Frame */}
                <div className="relative w-32 h-40 sm:w-36 sm:h-44 rounded-2xl overflow-hidden shadow-md border-2 border-slate-100 bg-slate-100 shrink-0 group">
                  <img
                    src={DOCTOR_AISHWARYA.image}
                    alt={DOCTOR_AISHWARYA.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-2 left-2 right-2 text-center text-[10px] font-bold text-amber-300 bg-slate-900/80 backdrop-blur-xs py-0.5 rounded px-1">
                    ★ Gold Medalist ★
                  </div>
                </div>

                {/* Name & Qualifications */}
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                    {DOCTOR_AISHWARYA.name}
                  </h3>
                  <div className="text-teal-800 font-bold text-xs sm:text-sm mt-1">
                    {DOCTOR_AISHWARYA.qualifications}
                  </div>

                  {/* Hindi Specialization Badge */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-300 text-amber-900 text-[11px] sm:text-xs font-bold mt-1.5">
                    <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                    <span>{DOCTOR_AISHWARYA.hindiSpecialization}</span>
                  </div>

                  <div className="text-slate-500 text-[11px] sm:text-xs font-medium mt-1">
                    MCI Regd. No. 9064 • Ex. Resident Haldwani
                  </div>
                </div>
              </div>

              {/* Bio Snippet */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-4 font-normal">
                {DOCTOR_AISHWARYA.bio}
              </p>

              {/* Doctor Philosophy */}
              <div className="mt-4 p-3 sm:p-3.5 rounded-2xl bg-[#E6F7F5]/75 border-l-4 border-teal-500 text-xs text-slate-800 space-y-1 shadow-2xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <HeartHandshake className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>Doctor's Philosophy &amp; Medical Ethics</span>
                </div>
                <p className="italic leading-relaxed">
                  "Patient care is rooted in precise clinical evaluation, compassionate listening, and lifestyle-integrated medical management. We empower every patient to manage diabetes, hypertension, and thyroid health with confidence."
                </p>
              </div>

              {/* Key Capabilities */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Specialized Clinical Focus
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-800 font-semibold">
                  {(DOCTOR_AISHWARYA.capabilities || []).map((cap, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-[11px] sm:text-xs leading-snug">{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Thumbnails & Official Card Lightbox trigger */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowVisitingCardModal(true)}
                    className="group/item rounded-xl overflow-hidden border border-slate-200 bg-slate-50 relative aspect-[16/10] p-1.5 flex flex-col justify-between text-left hover:border-teal-400 transition-all cursor-pointer"
                  >
                    <img
                      src="/images/dr_aishwarya_visiting_card.jpg"
                      alt="Dr. Aishwarya Visiting Card Preview"
                      className="w-full h-full object-contain group-hover/item:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute bottom-1.5 left-2 right-2 text-[10px] font-bold text-white flex items-center justify-between">
                      <span>MCI Regd. No. 9064</span>
                      <ExternalLink className="w-3 h-3 text-amber-300" />
                    </span>
                  </button>

                  <div className="group/item rounded-xl overflow-hidden border border-slate-200 bg-slate-50 relative aspect-[16/10]">
                    <img
                      src="/images/Dr.aishwarya-d5rJKJ8t.jpg"
                      alt="Dr. Aishwarya Singhal Gupta Consultant Physician"
                      className="w-full h-full object-cover object-top group-hover/item:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <span className="absolute bottom-1.5 left-2 right-2 text-[10px] font-bold text-white truncate">
                      Sugar, BP &amp; Thyroid Clinic
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-600 font-medium">
                OPD Fee: <strong className="text-slate-900 font-bold text-sm">₹200</strong>
              </div>

              <button
                onClick={() => onBookDoctor(DOCTOR_AISHWARYA.name)}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all hover:scale-102 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-white shrink-0" />
                <span>Book with Dr. Aishwarya</span>
              </button>
            </div>

          </div>

        </div>

        {/* Shared Both Clinics Location & OPD Timings Banner */}
        <div className="mt-8 sm:mt-10 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-teal-900 font-bold text-xs uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-teal-700 shrink-0" />
                <span>Dual Clinic Locations in Vrindavan</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Both doctors consult across <strong>Clinic 1 (Hanuman Bagh opp. Federal Bank)</strong> and <strong>Clinic 2 (Chandrashekhar near Dhanuka Ashram)</strong>.
              </p>
            </div>

            <div className="space-y-1 md:border-l md:border-slate-200 md:pl-5">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>OPD Consultation Hours</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Monday to Saturday: <strong>9:00 AM – 7:00 PM</strong><br />
                Sunday: <strong>9:00 AM – 2:00 PM</strong> • Affordable ₹200 Fee
              </p>
            </div>

            <div className="space-y-2 md:border-l md:border-slate-200 md:pl-5">
              <div className="flex items-center gap-2 text-xs text-slate-800 font-bold">
                <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Direct Appointments:</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-900">
                <a href="tel:+919639566111" className="hover:text-teal-700 underline underline-offset-2">+91 96395 66111</a>
                <span>•</span>
                <a href="tel:+919410740382" className="hover:text-teal-700 underline underline-offset-2">+91 94107 40382</a>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Official Visiting Card Lightbox Modal */}
      {showVisitingCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl relative">
            <button
              onClick={() => setShowVisitingCardModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-left mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F7F5] text-teal-900 text-[11px] font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                <span>Verified Medical Credentials</span>
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                Dr. Aishwarya Singhal Gupta
              </h3>
              <p className="text-xs text-slate-500">
                Official Visiting Card &amp; Clinic Registration Details
              </p>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-50 p-2 sm:p-3">
              <img
                src="/images/dr_aishwarya_visiting_card.jpg"
                alt="Dr. Aishwarya Singhal Gupta Visiting Card"
                className="w-full h-auto object-contain rounded-xl"
              />
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>+91 96395 66111, +91 94107 40382</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span className="truncate">dr.aishwaryasinghalgupta@gmail.com</span>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => {
                  setShowVisitingCardModal(false);
                  onBookDoctor(DOCTOR_AISHWARYA.name);
                }}
                className="w-full py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-white" />
                <span>Book Appointment with Dr. Aishwarya</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
