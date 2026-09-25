import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Search } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';

interface FaqItem {
  id: string;
  category: 'doctor' | 'endoscopy' | 'liver' | 'general';
  question: string;
  answer: string;
}

export const FaqSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'doctor' | 'endoscopy' | 'liver' | 'general'>('all');
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const faqs: FaqItem[] = [
    {
      id: 'faq-1',
      category: 'doctor',
      question: 'What are the qualifications and medical background of Dr. Chaitanya Gupta?',
      answer: 'Dr. Chaitanya Gupta holds an MBBS, MD in General Medicine from SRMS Institute of Medical Sciences (Bareilly, completed in 2018), and super-specialty DM training in Gastroenterology. He has over 8 years of clinical and procedural experience treating gastrointestinal, hepatic, and acute internal medicine conditions.'
    },
    {
      id: 'faq-2',
      category: 'endoscopy',
      question: 'Does Dr. Chaitanya Gupta perform Upper GI Endoscopy in Vrindavan?',
      answer: 'Yes, Dr. Chaitanya Gupta actively conducts Upper GI Endoscopy procedures in Vrindavan. The high-definition endoscopic procedure allows direct visual evaluation of the esophagus, stomach, and duodenum for ulcers, chronic acid reflux, bleeding sites, and biopsy testing.'
    },
    {
      id: 'faq-3',
      category: 'liver',
      question: 'How is Fatty Liver diagnosed and treated at Vrindavan Healthcare?',
      answer: 'Dr. Gupta performs comprehensive hepatic assessments including liver ultrasound evaluation, liver enzyme testing (SGOT/SGPT, bilirubin, alk phos), and viral hepatitis screening. Treatment includes individualized metabolic reversal programs, hepatoprotective medical therapy, and dietary protocols to stop progression to cirrhosis.'
    },
    {
      id: 'faq-4',
      category: 'general',
      question: 'What is the OPD consultation fee for Dr. Chaitanya Gupta?',
      answer: `Dr. Chaitanya Gupta is deeply committed to ethical, accessible healthcare for all patients with an affordable consultation fee of ${CLINIC_INFO.consultationFee} for both in-clinic visits and teleconsultations.`
    },
    {
      id: 'faq-5',
      category: 'general',
      question: 'Where are the two clinic locations situated in Vrindavan?',
      answer: 'Dr. Gupta consults at two prime locations in Vrindavan (PIN 281121): Location A is on Bhakti Vedant Marg, Raman Reti (near the ISKCON Temple). Location B is at Bankey Bihari Nikunj, Hanuman Bagh (near Brijwasi Mithai Wala).'
    },
    {
      id: 'faq-6',
      category: 'general',
      question: 'What are the clinic OPD consultation timings?',
      answer: 'OPD operates Monday through Saturday from 9:00 AM to 7:00 PM, and on Sundays from 9:00 AM to 2:00 PM. Walk-ins and pre-booked appointments are both welcome.'
    },
    {
      id: 'faq-7',
      category: 'general',
      question: 'What payment methods are accepted at the clinic?',
      answer: 'The clinic accepts all modern convenient payment modes including UPI (Google Pay, PhonePe, Paytm), Cash, and Debit/Credit cards (Visa, MasterCard, RuPay).'
    },
    {
      id: 'faq-8',
      category: 'doctor',
      question: 'Does Dr. Gupta treat general physician conditions like Diabetes & Hypertension?',
      answer: 'Yes! Having completed his MD in General Medicine in 2018 with extensive critical care experience, Dr. Gupta provides expert management for uncontrolled diabetes, high blood pressure, infectious fevers, seasonal allergies, and rheumatologic disorders.'
    }
  ];

  const filteredFaqs = faqs.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="pt-6 sm:pt-16 pb-12 sm:pb-20 bg-[#FAFAF8] border-t border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-5 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-800 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2.5 sm:mb-3 shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-900" />
            <span>Patient Guidance &amp; Information</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-[1.15]">
            Frequently Asked Questions
          </h2>
          
          <p className="text-slate-600 text-xs sm:text-base lg:text-lg mt-2 sm:mt-3 font-normal max-w-2xl mx-auto leading-relaxed">
            Find answers regarding Dr. Chaitanya Gupta's qualifications, Upper GI Endoscopy, fatty liver care, ₹200 fee, and Vrindavan clinic locations.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-5 sm:mb-7">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 shrink-0 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search topics (e.g. Fee, Endoscopy)..."
              className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 shadow-2xs min-h-[44px]"
            />
          </div>
        </div>

        {/* Category Filter Pills (Mobile horizontal scroll / Desktop wrap) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 sm:flex-wrap sm:justify-center no-scrollbar px-1 mb-6 sm:mb-10">
          {[
            { id: 'all', label: 'All' },
            { id: 'doctor', label: 'Doctor Profile' },
            { id: 'endoscopy', label: 'Endoscopy' },
            { id: 'liver', label: 'Liver Care' },
            { id: 'general', label: 'Fees & Clinics' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`shrink-0 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer min-h-[36px] sm:min-h-[38px] ${
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90 shadow-2xs'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-2.5 sm:space-y-3.5">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all ${
                  isOpen
                    ? 'border-amber-300/90 bg-white shadow-xs ring-1 ring-amber-300/60'
                    : 'border-slate-200/90 bg-white shadow-2xs hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-3.5 sm:p-5 text-left flex items-start justify-between gap-3 sm:gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                >
                  <span className="font-bold text-slate-900 text-xs sm:text-base leading-snug pt-0.5">
                    {faq.question}
                  </span>
                  <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 mt-0.5 ${
                    isOpen ? 'rotate-180 bg-[#FEF08A] text-slate-900 shadow-2xs' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-3.5 sm:px-5 pb-3.5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal border-t border-slate-100 pt-3 bg-[#FAFAF8]/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
