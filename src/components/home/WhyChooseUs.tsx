import React from 'react';
import {
  Award,
  HeartPulse,
  Apple,
  CheckCircle2,
  ShieldAlert,
  Flag,
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const features = [
    {
      title: '100% Premium Quality',
      desc: 'Hand-picked jumbo fox nuts sourced directly from prime harvesting lotus ponds for maximum crunch and natural size.',
      icon: Award,
      color: 'from-amber-500 to-amber-600',
    },
    {
      title: 'Rich in Protein & Fiber',
      desc: 'High natural plant protein and dietary fiber content helps sustain muscle energy, digestion, and long-lasting satiety.',
      icon: HeartPulse,
      color: 'from-teal-600 to-teal-700',
    },
    {
      title: 'Healthy Snacking',
      desc: 'The ideal guilt-free alternative to fried potato chips or processed junk food for office, gym, tea-time, or TV watching.',
      icon: Apple,
      color: 'from-emerald-600 to-emerald-700',
    },
    {
      title: 'Gluten Free',
      desc: 'Naturally grain-free and gluten-free snack suitable for celiac diets, weight-watchers, and religious fasting (Vrat).',
      icon: CheckCircle2,
      color: 'from-sky-600 to-sky-700',
    },
    {
      title: 'No Cholesterol',
      desc: 'Contains zero trans fat and zero cholesterol, supporting heart health and helping regulate blood pressure and lipid balance.',
      icon: ShieldAlert,
      color: 'from-indigo-600 to-indigo-700',
    },
    {
      title: 'Made in India',
      desc: 'Proudly processed, quality certified, and packaged locally under strict FSSAI food hygiene and safety standards.',
      icon: Flag,
      color: 'from-orange-500 to-amber-600',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F4FAF8] border-b border-[#C0E7E2]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-[#0D4D4A] bg-white/90 px-3.5 py-1.5 rounded-full border border-[#A4E7E2] shadow-sm">
            Unmatched Quality
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0D4D4A] tracking-tight">
            Why Choose Doctor Makhana?
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            Discover why health enthusiasts, fitness conscious snackers, and families
            trust Doctor Makhana for their daily snacking needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, index) => {
            const IconComp = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-teal-300 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <IconComp className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center text-xs font-bold text-teal-700">
                  <span>Guaranteed Freshness</span>
                  <span className="ml-auto font-black text-amber-500">★ 100%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
