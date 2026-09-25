import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { QuickActionRow } from './components/QuickActionRow';
import { TheRoadToWellbeing } from './components/TheRoadToWellbeing';
import { PatientInfoBento } from './components/PatientInfoBento';
import { SupportAnytimeSection } from './components/SupportAnytimeSection';
import { GastroSimulator } from './components/GastroSimulator';
import { SymptomScreener } from './components/SymptomScreener';
import { DoctorProfile } from './components/DoctorProfile';
import { TechShowcase } from './components/TechShowcase';
import { BeforeAfterShowcase } from './components/BeforeAfterShowcase';
import { ClinicInfoAndMap } from './components/ClinicInfoAndMap';
import { CtaBanner } from './components/CtaBanner';
import { FaqSection } from './components/FaqSection';
import { AppointmentSection, type BookingDetailsSubmitted } from './components/AppointmentSection';
import { BookingConfirmationModal, type BookingDetails } from './components/BookingConfirmationModal';
import { Footer } from './components/Footer';
import { ServiceModal } from './components/ServiceModal';
import { RightSideFloatingDock } from './components/RightSideFloatingDock';
import { useSmoothScroll, getLenis } from './hooks/useSmoothScroll';
import { GASTRO_CARE_SERVICES, GENERAL_MEDICINE_SERVICES, type ServiceItem } from './data/clinicData';

export function App() {
  useSmoothScroll();

  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [preselectedBookingService, setPreselectedBookingService] = useState<string>('');
  const [bookingConfirmation, setBookingConfirmation] = useState<BookingDetails | null>(null);

  const handleOpenAppointmentModal = (serviceName?: string) => {
    if (serviceName) {
      setPreselectedBookingService(serviceName);
    }
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo('#contact', { offset: -70 });
    } else {
      const element = document.getElementById('contact');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleOpenServiceModal = (serviceName: string) => {
    const allServices = [...GASTRO_CARE_SERVICES, ...GENERAL_MEDICINE_SERVICES];
    const match = allServices.find(
      s => s.name.toLowerCase().includes(serviceName.toLowerCase()) || 
           serviceName.toLowerCase().includes(s.name.toLowerCase())
    );
    if (match) {
      setSelectedService(match);
    } else {
      handleOpenAppointmentModal(serviceName);
    }
  };

  const handleBookingSubmitted = (details: BookingDetailsSubmitted) => {
    setBookingConfirmation(details);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-slate-900 font-sans selection:bg-[#CCFBF1] selection:text-[#0F766E] relative pb-16 sm:pb-0">
      {/* 1. Medtrust Minimalist Sticky Navbar */}
      <Navbar onOpenAppointment={() => handleOpenAppointmentModal()} />

      {/* 2. Medtrust Editorial Hero Section */}
      <Hero onOpenAppointment={() => handleOpenAppointmentModal()} />

      {/* 3. 4-Card Quick Action & Patient Review Grid */}
      <QuickActionRow onOpenAppointment={() => handleOpenAppointmentModal()} />

      {/* 4. The Road to Complete Well-being (4 Tall Pastel Mint Service Cards) */}
      <TheRoadToWellbeing
        onBookAppointment={() => handleOpenAppointmentModal()}
        onOpenServiceModal={handleOpenServiceModal}
      />

      {/* 5. Important Information for Patients (Bento Grid: 94.5% Yellow Card + Lab Coat Doctor) */}
      <PatientInfoBento onOpenAppointment={() => handleOpenAppointmentModal()} />

      {/* 6. Support Anytime, Anywhere (Bento Grid: Telehealth + Features + Quick Booking Card) */}
      <SupportAnytimeSection onOpenAppointment={() => handleOpenAppointmentModal()} />

      {/* 7. Interactive Gastro & Liver Condition Explorer */}
      <GastroSimulator
        onBookService={(serviceName) => handleOpenAppointmentModal(serviceName)}
      />

      {/* 8. Interactive Patient Symptom Screener */}
      <SymptomScreener
        onBookRecommendation={(serviceName, doctorName) =>
          handleOpenAppointmentModal(`${serviceName} (Consultation with ${doctorName})`)
        }
      />

      {/* 9. Doctor Profile & Real Vrindavan Clinical Practice Showcase */}
      <DoctorProfile
        onBookDoctor={(docName) => handleOpenAppointmentModal(`OPD Consultation with ${docName}`)}
      />

      {/* 10. Technology & Endoscopy Facility Showcase */}
      <TechShowcase
        onBookTechService={(serviceName) => handleOpenAppointmentModal(serviceName)}
      />

      {/* 11. Documented Clinical Outcomes & Recovery Showcase */}
      <BeforeAfterShowcase
        onBookTreatment={(treatmentName) => handleOpenAppointmentModal(treatmentName)}
      />

      {/* 12. Both Vrindavan Clinic Locations, Hours & Map */}
      <ClinicInfoAndMap />

      {/* 13. Reach Out For Expert Care Bottom Gradient Pill Banner */}
      <CtaBanner onOpenAppointment={() => handleOpenAppointmentModal()} />

      {/* 14. Frequently Asked Questions */}
      <FaqSection />

      {/* 15. Appointment Request CTA Form */}
      <AppointmentSection
        preselectedService={preselectedBookingService}
        onBookingComplete={handleBookingSubmitted}
      />

      {/* 16. Medtrust Clean Light Off-White Footer */}
      <Footer />

      {/* Right-Side Hover Expanding Action Dock */}
      <RightSideFloatingDock onOpenAppointment={() => handleOpenAppointmentModal()} />

      {/* Interactive Service Detail Modal */}
      <ServiceModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onBook={(serviceName) => handleOpenAppointmentModal(serviceName)}
      />

      {/* Appointment Confirmation & Calendar Sync Modal */}
      <BookingConfirmationModal
        booking={bookingConfirmation}
        onClose={() => setBookingConfirmation(null)}
      />
    </div>
  );
}

export default App;
