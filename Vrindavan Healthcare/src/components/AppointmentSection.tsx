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

export const AppointmentSection: React.FC<AppointmentSectionProps> = ({
  preselectedService = '',
  onBookingComplete
}) => {
  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    service: preselectedService || 'Upper GI Endoscopy (Diagnostic & Therapeutic)',
    location: 'Location A — Raman Reti (ISKCON Area)',
    preferredDate: '',
    preferredTime: 'Morning (9:00 AM - 1:00 PM)',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);

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
    <section id="contact" className="py-20 bg-[#FAFAF8] border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: CTA Pitch & Direct Call */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider shadow-2xs">
              <Calendar className="w-4 h-4 text-slate-900" />
              <span>Easy Appointment Request</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-[1.12]">
              Consult Dr. Chaitanya Gupta
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
              Schedule your consultation for Upper GI Endoscopy, fatty liver management, chronic acidity relief, or internal medicine. Fast confirmation via phone or WhatsApp.
            </p>

            <div className="p-6 rounded-[28px] bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                Direct OPD &amp; Emergency Helpline
              </div>

              <a
                href={`tel:${CLINIC_INFO.phoneRaw}`}
                className="flex items-center gap-3 p-4 rounded-2xl bg-[#0F766E] text-white hover:bg-[#0D9488] transition-all shadow-md group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-white/80 font-medium">Tap to Call Directly</div>
                  <div className="text-xl font-bold font-mono tracking-tight">{CLINIC_INFO.phone}</div>
                </div>
              </a>

              <button
                onClick={handleWhatsAppBooking}
                className="w-full py-3.5 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Book via WhatsApp ({CLINIC_INFO.phone})</span>
              </button>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#0F766E]" />
                  <span>OPD Fee: <strong>₹200 only</strong></span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Open 7 Days a Week</span>
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Booking Form */}
          <div className="lg:col-span-7">
            <div className="p-5 sm:p-8 lg:p-10 rounded-3xl bg-white border border-slate-200 shadow-xl">
              
              <div className="mb-6">
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Book Priority Consultation
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                  Fill in your details below. Our desk will confirm your appointment within 15 minutes.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-[#F0FDFA] border border-[#CCFBF1] text-center space-y-4 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-[#0F766E] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#0F766E]/30 animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-extrabold text-slate-900">
                    Appointment Requested!
                  </h4>
                  <p className="text-sm text-slate-600 max-w-md mx-auto font-medium">
                    Thank you, <strong>{formData.patientName || 'Patient'}</strong>. We have registered your request for <strong>{formData.service}</strong> at <strong>{formData.location}</strong>.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2.5 rounded-full bg-[#0F766E] text-white text-xs font-bold hover:bg-[#0D9488] transition-colors cursor-pointer"
                    >
                      Book Another Appointment
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Patient Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.patientName}
                        onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]/30 focus:border-[#0F766E]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 9876543210"
                        className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]/30 focus:border-[#0F766E]"
                      />
                    </div>
                  </div>

                  {/* Specialty / Service */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Service / Clinical Concern *
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]/30 focus:border-[#0F766E] bg-white"
                    >
                      <option value="Upper GI Endoscopy (Diagnostic & Therapeutic)">Upper GI Endoscopy (Diagnostic &amp; Therapeutic)</option>
                      <option value="Fatty Liver & Liver Cirrhosis Management">Fatty Liver &amp; Liver Cirrhosis Management</option>
                      <option value="Chronic Acidity, GERD & Peptic Ulcer Care">Chronic Acidity, GERD &amp; Peptic Ulcer Care</option>
                      <option value="IBS, Colitis & Inflammatory Bowel Disease (IBD)">IBS, Colitis &amp; Inflammatory Bowel Disease (IBD)</option>
                      <option value="Pancreatic & Gallbladder Disorders">Pancreatic &amp; Gallbladder Disorders</option>
                      <option value="Colonoscopy & Lower GI Screening">Colonoscopy &amp; Lower GI Screening</option>
                      <option value="Diabetes & Metabolic Disorder Management">Diabetes &amp; Metabolic Disorder Management</option>
                      <option value="Hypertension & Cardiovascular Assessment">Hypertension &amp; Cardiovascular Assessment</option>
                      <option value="General Physician & Critical Care Consultation">General Physician Consultation (₹200 Fee)</option>
                    </select>
                  </div>

                  {/* Location Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Preferred Vrindavan Clinic *
                    </label>
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]/30 focus:border-[#0F766E] bg-white"
                    >
                      <option value="Location A — Raman Reti (ISKCON Area)">Location A: Bhakti Vedant Marg, Raman Reti (Near ISKCON Temple)</option>
                      <option value="Location B — Hanuman Bagh (City Centre)">Location B: Bankey Bihari Nikunj, Hanuman Bagh (Near Brijwasi)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]/30 focus:border-[#0F766E]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Preferred Time Slot
                      </label>
                      <select
                        value={formData.preferredTime}
                        onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                        className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]/30 focus:border-[#0F766E] bg-white"
                      >
                        <option value="Morning (9:00 AM - 1:00 PM)">Morning (9:00 AM - 1:00 PM)</option>
                        <option value="Afternoon (1:00 PM - 4:00 PM)">Afternoon (1:00 PM - 4:00 PM)</option>
                        <option value="Evening (4:00 PM - 7:00 PM)">Evening (4:00 PM - 7:00 PM)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Symptoms or Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Briefly describe your symptoms or existing reports..."
                      className="w-full min-h-[60px] px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]/30 focus:border-[#0F766E]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full min-h-[48px] py-3.5 sm:py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all hover:scale-[1.01] active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4 text-white" />
                      <span>CONFIRM APPOINTMENT REQUEST (₹200 FEE)</span>
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
