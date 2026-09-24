import React from 'react';
import { Star, Quote, MessageSquare, CheckCircle2 } from 'lucide-react';
import { TESTIMONIALS } from '../data/clinicData';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-[#F8FAFC] border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F0FDFA] text-[#0F766E] text-xs font-bold uppercase tracking-wider mb-3">
            <MessageSquare className="w-4 h-4" />
            <span>Verified Patient Reviews</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            What Our Patients Say
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3 font-medium">
            Read authentic reviews from patients who found digestive relief, cured acidity, and experienced compassionate care under Dr. Chaitanya Gupta (4.5★ on Justdial).
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between relative group"
            >
              <div>
                {/* Rating Stars & Service Tag */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-0.5 text-[#F59E0B]">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>

                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#F0FDFA] text-[#0F766E]">
                    {item.date}
                  </span>
                </div>

                <div className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg mb-3 inline-block">
                  {item.serviceReceived}
                </div>

                <Quote className="w-7 h-7 text-[#0F766E]/20 mb-2" />

                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic mb-6">
                  "{item.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    {item.patientName}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
