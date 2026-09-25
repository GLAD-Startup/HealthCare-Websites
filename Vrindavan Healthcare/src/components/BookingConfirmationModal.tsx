import React from 'react';
import { CheckCircle2, X, Calendar, Download, MessageSquare, MapPin, Printer } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';

export interface BookingDetails {
  refNumber: string;
  patientName: string;
  phone: string;
  service: string;
  location?: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
}

interface BookingConfirmationModalProps {
  booking: BookingDetails | null;
  onClose: () => void;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({ booking, onClose }) => {
  if (!booking) return null;

  const handleWhatsAppSend = () => {
    const text = encodeURIComponent(
      `Hello Dr. Chaitanya Gupta / Vrindavan Healthcare, I have submitted an OPD booking request.\n\n*Ref ID:* ${booking.refNumber}\n*Patient:* ${booking.patientName}\n*Phone:* ${booking.phone}\n*Service:* ${booking.service}\n*Location:* ${booking.location || 'Vrindavan Clinic'}\n*Date:* ${booking.preferredDate}\n*Time:* ${booking.preferredTime}`
    );
    window.open(`https://wa.me/919412281121?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadICS = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Vrindavan Healthcare//Dr Chaitanya Gupta OPD//EN
BEGIN:VEVENT
SUMMARY:OPD Appointment with Dr. Chaitanya Gupta (${booking.service})
DESCRIPTION:Appointment Reference: ${booking.refNumber}\\nPatient: ${booking.patientName}\\nService: ${booking.service}\\nDoctor: Dr. Chaitanya Gupta (MBBS, MD, DM Gastroenterology)\\nConsultation Fee: ₹200
LOCATION:${booking.location || CLINIC_INFO.address}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Vrindavan-Healthcare-${booking.refNumber}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Ribbon */}
        <div className="bg-slate-900 text-white p-6 text-center space-y-2">
          <div className="relative w-16 h-16 rounded-full bg-white p-1 mx-auto mb-2 shadow-lg flex items-center justify-center border-2 border-white/80">
            <img
              src="/favicon.png"
              alt="Vrindavan Healthcare Official Logo"
              className="w-full h-full object-contain rounded-full"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <h3 className="font-serif text-2xl font-bold text-white tracking-tight">
            OPD Appointment Requested!
          </h3>
          <p className="text-xs text-amber-200 font-medium">
            Thank you, {booking.patientName}. Your appointment with Dr. Chaitanya Gupta is recorded.
          </p>
        </div>

        {/* Details Card Body */}
        <div className="p-6 space-y-6">
          
          {/* Reference ID Pill (Pastel Yellow Card) */}
          <div className="p-4 rounded-2xl bg-[#FEF08A] border border-amber-300 text-center space-y-1 shadow-2xs">
            <div className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wider">
              Appointment Reference ID
            </div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-wider font-mono">
              {booking.refNumber}
            </div>
            <div className="text-[11px] text-slate-800 font-medium">
              Consultation Fee: <strong className="text-slate-950 font-bold">₹200 only</strong>
            </div>
          </div>

          {/* Details Table */}
          <div className="space-y-3 text-xs sm:text-sm text-slate-700 bg-[#FAFAF8] p-4 rounded-2xl border border-slate-200">
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500 font-medium">Patient Name:</span>
              <span className="font-bold text-slate-900">{booking.patientName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500 font-medium">Contact Phone:</span>
              <span className="font-bold text-slate-900">{booking.phone}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500 font-medium">Doctor:</span>
              <span className="font-bold text-slate-900">Dr. Chaitanya Gupta (DM Gastro)</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500 font-medium">Requested Service:</span>
              <span className="font-bold text-teal-900">{booking.service}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500 font-medium">Preferred Slot:</span>
              <span className="font-bold text-slate-900">{booking.preferredDate} ({booking.preferredTime})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Clinic Location:</span>
              <span className="font-bold text-slate-900 text-right flex items-center justify-end gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>{booking.location || 'Raman Reti (Near ISKCON), Vrindavan'}</span>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <button
              onClick={handleWhatsAppSend}
              className="w-full py-3.5 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Confirm Instant via WhatsApp</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDownloadICS}
                className="py-3 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-900" />
                <Download className="w-3.5 h-3.5" />
                <span>Calendar Invite</span>
              </button>

              <button
                onClick={handlePrint}
                className="py-3 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Print Slip</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
