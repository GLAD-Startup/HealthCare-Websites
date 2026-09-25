import React, { useState, useEffect, useRef } from 'react';
import { Clock, MapPin, ExternalLink, CheckCircle2, CreditCard, Navigation, Compass } from 'lucide-react';
import { CLINIC_INFO, CLINIC_LOCATIONS, type ClinicLocation } from '../data/clinicData';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export const ClinicInfoAndMap: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<ClinicLocation>(CLINIC_LOCATIONS[0]);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  // Determine if open today dynamically
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = daysOfWeek[new Date().getDay()];
  const todaySchedule = CLINIC_INFO.hours.find(h => h.day === todayName);
  const isOpenToday = todaySchedule && !todaySchedule.isClosed;

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [selectedLocation.coordinates.lat, selectedLocation.coordinates.lng],
      zoom: 15,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    // High performance OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
    }).addTo(map);

    CLINIC_LOCATIONS.forEach((loc) => {
      const isPrimary = loc.id === 'raman-reti';
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); pointer-events: auto; cursor: pointer;">
            <div style="background: ${isPrimary ? '#0F766E' : '#1E293B'}; color: white; padding: 6px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; font-family: system-ui, sans-serif; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.35); border: 2px solid white; display: flex; align-items: center; gap: 6px; white-space: nowrap;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #34D399; box-shadow: 0 0 6px #34D399;"></span>
              <span>${loc.badge}</span>
            </div>
            <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 7px solid ${isPrimary ? '#0F766E' : '#1E293B'}; margin-top: -1px;"></div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([loc.coordinates.lat, loc.coordinates.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: system-ui, sans-serif; padding: 4px 2px; min-width: 220px;">
            <div style="font-size: 10px; font-weight: 700; color: ${isPrimary ? '#0F766E' : '#64748B'}; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 3px;">${loc.badge}</div>
            <div style="font-size: 14px; font-weight: 800; color: #0F172A; line-height: 1.25; margin-bottom: 6px;">${loc.name}</div>
            <div style="font-size: 12px; color: #475569; margin-bottom: 4px; line-height: 1.4;">${loc.address}</div>
            <div style="font-size: 11px; color: #0F766E; font-weight: 600; margin-bottom: 10px;">Landmark: ${loc.landmark}</div>
            <div style="display: flex; gap: 8px;">
              <a href="${loc.googleMapsUrl}" target="_blank" rel="noopener noreferrer" style="flex: 1; text-align: center; background: #0F766E; color: white; font-size: 11px; font-weight: 700; padding: 6px 10px; border-radius: 8px; text-decoration: none;">Get Directions</a>
              <a href="tel:${CLINIC_INFO.phoneRaw}" style="flex: 1; text-align: center; background: #F1F5F9; color: #0F172A; font-size: 11px; font-weight: 700; padding: 6px 10px; border-radius: 8px; text-decoration: none;">Call Clinic</a>
            </div>
          </div>
        `);

      marker.on('click', () => {
        setSelectedLocation(loc);
      });

      markersRef.current[loc.id] = marker;
    });

    mapInstanceRef.current = map;

    // Trigger initial invalidateSize to ensure 100% full height coverage
    const timer = setTimeout(() => {
      map.invalidateSize();
      markersRef.current[selectedLocation.id]?.openPopup();
    }, 250);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Update map center smoothly when selectedLocation changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [selectedLocation.coordinates.lat, selectedLocation.coordinates.lng],
        16,
        { animate: true, duration: 1 }
      );
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
        markersRef.current[selectedLocation.id]?.openPopup();
      }, 300);
    }
  }, [selectedLocation]);

  // Clean up on component unmount
  useEffect(() => {
    const handleResize = () => {
      mapInstanceRef.current?.invalidateSize();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <section id="location" className="py-20 bg-[#FAFAF8] border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
            <MapPin className="w-4 h-4 text-slate-900" />
            <span>2 Clinic Locations in Vrindavan (PIN 281121)</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-[1.12]">
            Clinic Locations &amp; OPD Hours
          </h2>

          <p className="text-slate-600 text-sm sm:text-base lg:text-lg mt-3 font-normal max-w-2xl mx-auto leading-relaxed">
            Conveniently accessible at Bhakti Vedant Marg (Raman Reti near ISKCON) and Hanuman Bagh (near Brijwasi Mithai Wala).
          </p>
        </div>

        {/* Location Switcher Tabs */}
        <div className="flex flex-col sm:flex-row justify-center gap-2.5 sm:gap-3 mb-8 sm:mb-10 w-full max-w-xl mx-auto">
          {CLINIC_LOCATIONS.map((loc) => {
            const isSelected = selectedLocation.id === loc.id;
            return (
              <button
                key={loc.id}
                type="button"
                onClick={() => setSelectedLocation(loc)}
                className={`w-full sm:w-auto p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 min-h-[44px] ${
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

          {/* Right Column: Native Interactive Leaflet Map */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-xs bg-white flex flex-col">
              
              {/* Map Bar */}
              <div className="p-3 sm:p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2 sm:gap-3 z-20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span className="text-[11px] sm:text-xs font-bold font-mono">
                    GPS: {selectedLocation.coordinates.lat}, {selectedLocation.coordinates.lng}
                  </span>
                  <span className="text-[10px] text-teal-300 font-semibold hidden sm:inline">
                    • Live Location Pin
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.coordinates.lat},${selectedLocation.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-white font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 transition-colors cursor-pointer"
                  >
                    <span>Directions</span>
                    <Navigation className="w-3 h-3" />
                  </a>
                  <a
                    href={selectedLocation.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-900 font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Native Leaflet Map Container: fills exactly 500px, 100% height, zero empty space */}
              <div className="relative w-full h-[460px] sm:h-[540px] bg-slate-100 overflow-hidden">
                <div
                  ref={mapContainerRef}
                  className="w-full h-full"
                  style={{ width: '100%', height: '100%', minHeight: '460px' }}
                />
              </div>

              {/* Map Bottom Footer info */}
              <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs z-20">
                <div className="text-slate-700 font-medium">
                  📍 <strong>{selectedLocation.name}:</strong> {selectedLocation.address} ({selectedLocation.landmark})
                </div>
                <a
                  href={`tel:${CLINIC_INFO.phoneRaw}`}
                  className="font-bold text-slate-900 hover:text-teal-700 transition-colors"
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

