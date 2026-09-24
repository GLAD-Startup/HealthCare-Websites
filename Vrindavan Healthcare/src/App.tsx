import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { QuickActionRow } from './components/QuickActionRow';
import { AboutUsSection } from './components/AboutUsSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { GastroSimulator } from './components/GastroSimulator';
import { SymptomScreener } from './components/SymptomScreener';
import { GastroCareServices } from './components/GastroCareServices';
import { GeneralMedicineServices } from './components/GeneralMedicineServices';
import { DoctorProfile } from './components/DoctorProfile';
import { TechShowcase } from './components/TechShowcase';
import { BeforeAfterShowcase } from './components/BeforeAfterShowcase';
import { FaqSection } from './components/FaqSection';
import { Testimonials } from './components/Testimonials';
import { ClinicInfoAndMap } from './components/ClinicInfoAndMap';
import { AppointmentSection, type BookingDetailsSubmitted } from './components/AppointmentSection';
import { BookingConfirmationModal, type BookingDetails } from './components/BookingConfirmationModal';
import { Footer } from './components/Footer';
import { ServiceModal } from './components/ServiceModal';
import { RightSideFloatingDock } from './components/RightSideFloatingDock';
import { RequestCallbackModal } from './components/RequestCallbackModal';
import { useSmoothScroll, getLenis } from './hooks/useSmoothScroll';
import type { ServiceItem } from './data/clinicData';

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
      lenis.scrollTo('#contact', { offset: -110 });
    } else {
      const element = document.getElementById('contact');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleBookingSubmitted = (details: BookingDetailsSubmitted) => {
    setBookingConfirmation(details);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#CCFBF1] selection:text-[#0F766E] relative pb-16 sm:pb-0">
      {/* Sticky Navbar */}
      <Navbar onOpenAppointment={() => handleOpenAppointmentModal()} />

      {/* Hero Section */}
      <Hero onOpenAppointment={() => handleOpenAppointmentModal()} />

      {/* 4-Card Quick Action Grid */}
      <QuickActionRow onOpenAppointment={() => handleOpenAppointmentModal()} />

      {/* About Doctor & Medical Philosophy */}
      <AboutUsSection />

      {/* Why Choose Us / Trust Features */}
      <WhyChooseUs />

      {/* Interactive Gastro & Liver Condition Explorer */}
      <GastroSimulator
        onBookService={(serviceName) => handleOpenAppointmentModal(serviceName)}
      />

      {/* Interactive Patient Symptom Screener */}
      <SymptomScreener
        onBookRecommendation={(serviceName, doctorName) =>
          handleOpenAppointmentModal(`${serviceName} (Consultation with ${doctorName})`)
        }
      />

      {/* Liver & Gastroenterology Services */}
      <GastroCareServices
        onSelectService={(service) => setSelectedService(service)}
        onBookService={(serviceName) => handleOpenAppointmentModal(serviceName)}
      />

      {/* General Medicine & Critical Care Services */}
      <GeneralMedicineServices
        onSelectService={(service) => setSelectedService(service)}
        onBookService={(serviceName) => handleOpenAppointmentModal(serviceName)}
      />

      {/* Doctor Profile & Credentials */}
      <DoctorProfile
        onBookDoctor={(docName) => handleOpenAppointmentModal(`OPD Consultation with ${docName}`)}
      />

      {/* Technology & Endoscopy Facility Showcase */}
      <TechShowcase
        onBookTechService={(serviceName) => handleOpenAppointmentModal(serviceName)}
      />

      {/* Documented Clinical Outcomes & Recovery Showcase */}
      <BeforeAfterShowcase
        onBookTreatment={(treatmentName) => handleOpenAppointmentModal(treatmentName)}
      />

      {/* Frequently Asked Questions */}
      <FaqSection />

      {/* Patient Testimonials (Justdial 4.5★) */}
      <Testimonials />

      {/* Both Vrindavan Clinic Locations, Hours & Map */}
      <ClinicInfoAndMap />

      {/* Appointment CTA Form */}
      <AppointmentSection
        preselectedService={preselectedBookingService}
        onBookingComplete={handleBookingSubmitted}
      />

      {/* Footer */}
      <Footer />

      {/* Right-Side Hover Expanding Action Dock */}
      <RightSideFloatingDock onOpenAppointment={() => handleOpenAppointmentModal()} />

      {/* Left-Side Sticky Vertical Request Callback Red Tab */}
      <RequestCallbackModal />

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
