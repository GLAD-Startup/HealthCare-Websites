import React, { useState } from 'react';
import { Clock, MapPin, ExternalLink, CheckCircle2, CreditCard, Navigation, Compass } from 'lucide-react';
import { CLINIC_INFO, CLINIC_LOCATIONS, type ClinicLocation } from '../data/clinicData';

export const ClinicInfoAndMap: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<ClinicLocation>(CLINIC_LOCATIONS[0]);

  // Determine if open today dynamically
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = daysOfWeek[new Date().getDay()];
  const todaySchedule = CLINIC_INFO.hours.find(h => h.day === todayName);
  const isOpenToday = todaySchedule && !todaySchedule.isClosed;

  return (
    <section id="location" className="py-20 bg-white border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F0FDFA] text-[#0F766E] text-xs font-bold uppercase tracking-wider mb-3">
            <MapPin className="w-4 h-4" />
            <span>2 Clinic Locations in Vrindavan (PIN 281121)</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Clinic Locations &amp; OPD Hours
          </h2>

          <p className="text-slate-600 text-base sm:text-lg mt-3 font-medium">
            Conveniently accessible at Bhakti Vedant Marg (Raman Reti near ISKCON) and Hanuman Bagh (near Brijwasi Mithai Wala).
          </p>
        </div>

        {/* Location Switcher Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {CLINIC_LOCATIONS.map((loc) => {
            const isSelected = selectedLocation.id === loc.id;
            return (
              <button
                key={loc.id}
                onClick={() => setSelectedLocation(loc)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'bg-[#0F766E] text-white border-[#0F766E] shadow-lg shadow-[#0F766E]/20 scale-102'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#F0FDFA] text-[#0F766E]'
                }`}>
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <div className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-teal-200' : 'text-slate-500'}`}>
                    {loc.badge}
                  </div>
                  <div className="text-sm font-extrabold">
                    {loc.name}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Hours Table & Details */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Today Status Badge */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between ${
              isOpenToday
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider">
                    Today is {todayName}
                  </div>
                  <div className="text-sm font-semibold">
                    Open Today: {todaySchedule?.hours}
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase">
                Active OPD
              </span>
            </div>

            {/* Selected Location Address Card */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">
                    {selectedLocation.badge}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {selectedLocation.name}
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-700">
                  PIN 281121
                </span>
              </div>

              <div className="text-sm text-slate-700 space-y-1.5 pt-1 border-t border-slate-200">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                  <span className="font-medium">{selectedLocation.address}</span>
                </div>
                <div className="text-xs text-slate-500 pl-6">
                  Landmark: <strong>{selectedLocation.landmark}</strong>
                </div>
                <div className="text-xs text-slate-500 pl-6">
                  DIGIPIN: <strong>{selectedLocation.digipin}</strong> | Mappls Pin: <strong>{selectedLocation.mapplsPin}</strong>
                </div>
              </div>

              {/* Action Buttons for Directions */}
              <div className="pt-2 flex flex-wrap gap-2">
                <a
                  href={selectedLocation.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#0F766E] hover:bg-[#0D9488] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>

                <a
                  href={selectedLocation.mapplsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all"
                >
                  <span>Mappls Pin: {selectedLocation.mapplsPin}</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>
            </div>

            {/* Weekly Schedule Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-[#0F766E] text-white flex items-center justify-center shadow-md">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Weekly OPD Consultation Schedule</h3>
                  <p className="text-xs text-slate-500 font-medium">Dr. Chaitanya Gupta OPD</p>
                </div>
              </div>

              <div className="space-y-2">
                {CLINIC_INFO.hours.map((h) => {
                  const isCurrentDay = h.day === todayName;
                  return (
                    <div
                      key={h.day}
                      className={`flex items-center justify-between p-2 rounded-xl text-xs sm:text-sm transition-colors ${
                        isCurrentDay
                          ? 'bg-[#F0FDFA] font-bold text-[#0F766E] border border-[#CCFBF1]'
                          : 'text-slate-700 hover:bg-slate-50 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{h.day}</span>
                        {isCurrentDay && (
                          <span className="text-[9px] bg-[#0F766E] text-white px-2 py-0.5 rounded-full font-bold">
                            Today
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-slate-900">{h.hours}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Fee & Payment Modes Card */}
            <div className="p-5 rounded-2xl bg-[#F0FDFA] border border-[#CCFBF1] flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">
                  Affordable &amp; Ethical Healthcare
                </div>
                <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                  OPD Fee: ₹200
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  Modes: UPI (GPay/PhonePe), Cash, Debit &amp; Credit Cards
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white text-[#0F766E] border border-[#CCFBF1] flex items-center justify-center shadow-xs shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Embedded Map */}
          <div className="lg:col-span-7 h-full">
            <div className="rounded-3xl border border-slate-200 overflow-hidden shadow-lg bg-slate-100 flex flex-col h-full min-h-[500px]">
              
              {/* Map Bar */}
              <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold">
                    GPS Coordinates: {selectedLocation.coordinates.lat}, {selectedLocation.coordinates.lng}
                  </span>
                </div>
                <a
                  href={selectedLocation.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-teal-300 hover:text-white font-bold flex items-center gap-1"
                >
                  <span>Open Full Screen Map</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Map Iframe */}
              <div className="relative flex-1 w-full min-h-[460px]">
                <iframe
                  title="Dr. Chaitanya Gupta Clinic Map"
                  src={
                    selectedLocation.id === 'raman-reti'
                      ? "https://maps.google.com/maps?q=27.572217,77.678634&t=&z=16&ie=UTF8&iwloc=&output=embed"
                      : "https://maps.google.com/maps?q=Bankey+Bihari+Nikunj,+Hanuman+Bagh,+Vrindavan+281121&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  }
                  className="w-full h-full border-0 absolute inset-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Map Bottom Footer info */}
              <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="text-slate-600 font-medium">
                  📍 {selectedLocation.address} ({selectedLocation.landmark})
                </div>
                <a
                  href={`tel:${CLINIC_INFO.phoneRaw}`}
                  className="font-bold text-[#0F766E] hover:underline"
                >
                  Call Clinic: {CLINIC_INFO.phone}
                </a>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
