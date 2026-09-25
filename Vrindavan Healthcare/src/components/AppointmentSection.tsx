import React, { useState } from 'react';
import { Calendar, Phone, CheckCircle2, MessageSquare, Shield, Clock } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';

export interface BookingDetailsSubmitted {
  refNumber: string;
  patientName: string;
  phone: string;
  service: string;
  location: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
}

interface AppointmentSectionProps {
  preselectedService?: string;
  onBookingComplete?: (details: BookingDetailsSubmitted) => void;
}

const SERVICES_OPTIONS = [
  { value: 'Upper GI Endoscopy (Diagnostic & Therapeutic)', label: 'Upper GI Endoscopy (Diagnostic)' },
  { value: 'Fatty Liver & Liver Cirrhosis Management', label: 'Fatty Liver & Cirrhosis Care' },
  { value: 'Chronic Acidity, GERD & Peptic Ulcer Care', label: 'Chronic Acidity, GERD & Ulcers' },
  { value: 'IBS, Colitis & Inflammatory Bowel Disease (IBD)', label: 'IBS & Gut Motility Care' },
  { value: 'Pancreatic & Gallbladder Disorders', label: 'Pancreas & Gallbladder Care' },
  { value: 'Colonoscopy & Lower GI Screening', label: 'Colonoscopy & Lower GI Screening' },
  { value: 'Diabetes & Metabolic Disorder Management', label: 'Diabetes & Metabolic Health' },
  { value: 'Hypertension & Cardiovascular Assessment', label: 'Hypertension & Heart Care' },
  { value: 'General Physician & Critical Care Consultation', label: 'General OPD Consultation (₹200)' },
];

const CLINIC_LOCATIONS = [
  { value: 'Location A — Raman Reti (ISKCON Area)', label: 'Location A: Raman Reti (Near ISKCON)' },
  { value: 'Location B — Hanuman Bagh (City Centre)', label: 'Location B: Hanuman Bagh (City Centre)' },
];

const matchServiceOption = (rawService: string): string => {
  if (!rawService) return SERVICES_OPTIONS[0].value;
  const lower = rawService.toLowerCase();
  if (lower.includes('endoscop')) return SERVICES_OPTIONS[0].value;
  if (lower.includes('fatty') || lower.includes('cirrhosis') || lower.includes('liver')) return SERVICES_OPTIONS[1].value;
  if (lower.includes('acid') || lower.includes('gerd') || lower.includes('ulcer') || lower.includes('reflux')) return SERVICES_OPTIONS[2].value;
  if (lower.includes('ibs') || lower.includes('colitis') || lower.includes('gut') || lower.includes('motility') || lower.includes('bowel')) return SERVICES_OPTIONS[3].value;
  if (lower.includes('pancrea') || lower.includes('gallbladder')) return SERVICES_OPTIONS[4].value;
  if (lower.includes('colonoscop')) return SERVICES_OPTIONS[5].value;
  if (lower.includes('diabet') || lower.includes('metabolic') || lower.includes('sugar')) return SERVICES_OPTIONS[6].value;
  if (lower.includes('hypertens') || lower.includes('blood pressure') || lower.includes('cardio') || lower.includes('heart')) return SERVICES_OPTIONS[7].value;
  if (lower.includes('physician') || lower.includes('general') || lower.includes('consultation')) return SERVICES_OPTIONS[8].value;
  return rawService;
};

export const AppointmentSection: React.FC<AppointmentSectionProps> = ({
  preselectedService = '',
  onBookingComplete
}) => {
  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    service: matchServiceOption(preselectedService),
    location: 'Location A — Raman Reti (ISKCON Area)',
    preferredDate: '',
    preferredTime: 'Morning (9:00 AM - 1:00 PM)',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    if (preselectedService) {
      setFormData((prev) => ({ ...prev, service: matchServiceOption(preselectedService) }));
    }
  }, [preselectedService]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const refNum = `VRN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    if (onBookingComplete) {
      onBookingComplete({
        refNumber: refNum,
        patientName: formData.patientName || 'Patient',
        phone: formData.phone,
        service: formData.service,
        location: formData.location,
        preferredDate: formData.preferredDate || 'Earliest Available',
        preferredTime: formData.preferredTime,
        notes: formData.notes
      });
    }
  };

  const handleWhatsAppBooking = () => {
    const text = encodeURIComponent(
      `Hello Dr. Chaitanya Gupta / Vrindavan Healthcare,\n\nI would like to book an OPD consultation.\nName: ${formData.patientName || 'Patient'}\nPhone: ${formData.phone || 'Provided'}\nSpecialty / Service: ${formData.service}\nPreferred Clinic: ${formData.location}\nPreferred Date: ${formData.preferredDate || 'Earliest Available'}\nPreferred Time: ${formData.preferredTime}\nNotes: ${formData.notes || 'None'}`
    );
    window.open(`https://wa.me/919412281121?text=${text}`, '_blank');
  };

  return (
    <section id="contact" className="pt-8 sm:pt-16 pb-14 sm:pb-20 bg-[#FAFAF8] border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
          
          {/* Left Column: CTA Pitch & Direct Call */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-800 text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-2xs">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-900" />
              <span>Easy Appointment Request</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-[1.15]">
              Consult Dr. Chaitanya Gupta
            </h2>

            <p className="text-slate-600 text-xs sm:text-base leading-relaxed font-normal">
              Schedule your consultation for Upper GI Endoscopy, fatty liver management, chronic acidity relief, or internal medicine. Fast confirmation via phone or WhatsApp.
            </p>

            <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-[28px] bg-white border border-slate-200 shadow-2xs space-y-3 sm:space-y-4">
              <div className="text-[11px] sm:text-xs font-bold uppercase text-slate-500 tracking-wider">
                Direct OPD &amp; Emergency Helpline
              </div>

              {/* Responsive Helpline Buttons: Side-by-side on mobile, stacked on sm/lg */}
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3">
                <a
                  href={`tel:${CLINIC_INFO.phoneRaw}`}
                  className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-sm group min-h-[44px]"
                >
                  <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/15 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform shrink-0">
                    <Phone className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0 text-left">
                    <div className="text-[10px] sm:text-xs text-white/80 font-medium">Tap to Call</div>
                    <div className="text-xs sm:text-xl font-bold font-mono tracking-tight truncate">{CLINIC_INFO.phone}</div>
                  </div>
                </a>

                <button
                  onClick={handleWhatsAppBooking}
                  className="w-full py-2.5 sm:py-3.5 px-3 sm:px-4 rounded-xl sm:rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer min-h-[44px]"
                >
                  <MessageSquare className="w-4 h-4 fill-white shrink-0" />
                  <span className="truncate">WhatsApp OPD</span>
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] sm:text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>OPD Fee: <strong className="text-slate-900">₹200 only</strong></span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Open 7 Days a Week</span>
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Booking Form */}
          <div className="lg:col-span-7">
            <div className="p-4 sm:p-8 lg:p-10 rounded-3xl bg-white border border-slate-200 shadow-xl">
              
              <div className="mb-5 sm:mb-6">
                <h3 className="font-serif text-xl sm:text-3xl text-slate-900 tracking-tight">
                  Book Priority Consultation
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
                  Fill in your details below. Our desk will confirm your appointment within 15 minutes.
                </p>
              </div>

              {submitted ? (
                <div className="p-6 sm:p-8 rounded-2xl bg-[#E6F7F5] border border-teal-200/80 text-center space-y-4 animate-fadeIn">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-900 text-amber-300 flex items-center justify-center mx-auto shadow-md animate-bounce">
                    <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  <h4 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                    Appointment Requested!
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto font-normal leading-relaxed">
                    Thank you, <strong>{formData.patientName || 'Patient'}</strong>. We have registered your request for <strong>{formData.service}</strong> at <strong>{formData.location}</strong>.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2.5 sm:px-7 sm:py-3 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors cursor-pointer shadow-sm min-h-[44px]"
                    >
                      Book Another Appointment
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Patient Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.patientName}
                        onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full min-h-[44px] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 9876543210"
                        className="w-full min-h-[44px] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 bg-white"
                      />
                    </div>
                  </div>

                  {/* Specialty / Service */}
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Service / Clinical Concern *
                    </label>
                    <div className="relative">
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full min-h-[44px] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 bg-white text-slate-900 truncate"
                      >
                        {!SERVICES_OPTIONS.some(s => s.value === formData.service) && formData.service && (
                          <option value={formData.service}>{formData.service}</option>
                        )}
                        {SERVICES_OPTIONS.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Location Selector */}
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Preferred Vrindavan Clinic *
                    </label>
                    <div className="relative">
                      <select
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full min-h-[44px] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 bg-white text-slate-900 truncate"
                      >
                        {CLINIC_LOCATIONS.map((loc) => (
                          <option key={loc.value} value={loc.value}>
                            {loc.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        className="w-full min-h-[44px] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Preferred Time Slot
                      </label>
                      <select
                        value={formData.preferredTime}
                        onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                        className="w-full min-h-[44px] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 bg-white text-slate-900 truncate"
                      >
                        <option value="Morning (9:00 AM - 1:00 PM)">Morning (9:00 AM - 1:00 PM)</option>
                        <option value="Afternoon (1:00 PM - 4:00 PM)">Afternoon (1:00 PM - 4:00 PM)</option>
                        <option value="Evening (4:00 PM - 7:00 PM)">Evening (4:00 PM - 7:00 PM)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Symptoms or Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Briefly describe your symptoms or existing reports..."
                      className="w-full min-h-[56px] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 bg-white"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full min-h-[48px] py-3.5 sm:py-4 px-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all hover:scale-[1.01] active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4 text-white shrink-0" />
                      <span className="truncate">CONFIRM APPOINTMENT REQUEST (₹200 FEE)</span>
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
