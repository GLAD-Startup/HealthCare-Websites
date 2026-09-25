import React from 'react';
import { getLenis } from '../hooks/useSmoothScroll';

interface TheRoadToWellbeingProps {
  onBookAppointment: () => void;
  onOpenServiceModal?: (serviceName: string) => void;
}

export const TheRoadToWellbeing: React.FC<TheRoadToWellbeingProps> = ({
  onBookAppointment,
  onOpenServiceModal
}) => {
  const services = [
    {
      id: 'endoscopy',
      title: 'Upper GI Endoscopy',
      subtitle: 'High-Definition Video Mucosal Inspection & Biopsy',
      tags: ['Diagnostic', 'Biopsy'],
      image: '/images/dr_chaitanya_endoscopy_procedure.jpeg',
      actionName: 'Upper GI Endoscopy (Diagnostic & Therapeutic)'
    },
    {
      id: 'fatty-liver',
      title: 'Fatty Liver & Cirrhosis',
      subtitle: 'Reversing Hepatic Steatosis & Normalizing Enzymes',
      tags: ['Hepatology', 'Certified'],
      image: '/images/dr_chaitanya_press_conf.jpeg',
      actionName: 'Fatty Liver & Liver Cirrhosis Management'
    },
    {
      id: 'gerd-acidity',
      title: 'Acidity & GERD Care',
      subtitle: 'Mucosal Barrier Restoration & H. Pylori Eradication',
      tags: ['Mucosal Healing', 'Long-term'],
      image: '/images/dr_chaitanya_ercp_ot.jpeg',
      actionName: 'Chronic Acidity, GERD & Peptic Ulcer Care'
    },
    {
      id: 'general-medicine',
      title: 'Internal Medicine',
      subtitle: 'Managing Hypertension, Diabetes & Critical Adult Health',
      tags: ['Physician', 'MD SRMS 2018'],
      image: '/images/endoscopy_suite.jpg',
      actionName: 'Diabetes Mellitus & Metabolic Disorder Management'
    }
  ];

  const handleLearnMore = (serviceName: string) => {
    if (onOpenServiceModal) {
      onOpenServiceModal(serviceName);
    } else {
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo('#technology', { offset: -70 });
      } else {
        document.getElementById('technology')?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="gastro-care" className="py-12 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Header Row: Editorial Serif Headline (Left) & Subtitle with Black Pill Button (Right) */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-8 mb-8 sm:mb-16">
        <div className="max-w-xl">
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-[1.15]">
            The Road to <br className="hidden sm:inline" />
            Complete Well-being
          </h2>
        </div>

        <div className="max-w-md space-y-3 sm:space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
            Discover personalized healthcare solutions designed to improve your digestive, liver, and metabolic health. Our expert team ensures compassionate care and advanced treatments for a balanced, healthier life — every step of the way.
          </p>

          <div>
            <button
              onClick={onBookAppointment}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all hover:scale-102 active:scale-98 cursor-pointer text-center justify-center flex items-center"
            >
              BOOK APPOINTMENT
            </button>
          </div>
        </div>
      </div>

      {/* 4 Pastel Mint Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {services.map((item) => (
          <div
            key={item.id}
            className="group rounded-2xl sm:rounded-[32px] bg-[#E6F7F5] border border-teal-200/70 p-4 sm:p-6 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-300 min-h-0 sm:min-h-[460px]"
          >
            {/* Top Text & Tags */}
            <div>
              <h3 className="text-base sm:text-xl font-bold text-slate-900 leading-tight">
                {item.title}
              </h3>
              
              <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1 mb-2.5 sm:mb-4">
                {item.subtitle}
              </p>

              {/* Tag Pills */}
              <div className="flex flex-wrap gap-1.5 mb-3 sm:mb-6">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/80 text-slate-700 text-[10px] sm:text-[11px] font-semibold border border-teal-100 shadow-2xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Rounded Photo Container with Learn More Overlay */}
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-4/3 bg-slate-200 shadow-xs mt-auto group-hover:scale-[1.02] transition-transform duration-300">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent pointer-events-none" />

              {/* Learn More Pill Button Over Image */}
              <button
                onClick={() => handleLearnMore(item.actionName)}
                className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/95 backdrop-blur-md text-slate-900 font-bold text-[10px] sm:text-[11px] flex items-center gap-1.5 shadow-sm hover:bg-slate-900 hover:text-white transition-all cursor-pointer"
              >
                <span>Learn More</span>
                <span className="text-xs">➔</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
