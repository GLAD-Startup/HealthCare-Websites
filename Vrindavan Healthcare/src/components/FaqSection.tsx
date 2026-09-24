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
    <section id="faq" className="py-20 bg-[#F8FAFC] border-t border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F0FDFA] text-[#0F766E] text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-4 h-4 text-[#0F766E]" />
            <span>Patient Guidance &amp; Information</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          
          <p className="text-slate-600 text-base sm:text-lg mt-3 font-medium">
            Find answers regarding Dr. Chaitanya Gupta's qualifications, Upper GI Endoscopy, fatty liver care, ₹200 fee, and Vrindavan clinic locations.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search question (e.g. Endoscopy, Fee, Locations, Fatty Liver)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]/30 focus:border-[#0F766E] shadow-xs"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { id: 'all', label: 'All Questions' },
            { id: 'doctor', label: 'Dr. Chaitanya Gupta' },
            { id: 'endoscopy', label: 'Upper GI Endoscopy' },
            { id: 'liver', label: 'Liver & Acidity' },
            { id: 'general', label: 'Fee, Timings & Location' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#0F766E] text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition-colors"
                >
                  <span className="font-bold text-slate-900 text-sm sm:text-base">
                    {faq.question}
                  </span>
                  <div className={`w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 bg-[#F0FDFA] text-[#0F766E]' : 'text-slate-500'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium border-t border-slate-100 pt-3">
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
