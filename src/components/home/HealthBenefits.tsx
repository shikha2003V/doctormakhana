import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Star, Quote, ArrowRight, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const HealthBenefits: React.FC = () => {
  const { reviews, setActivePage } = useStore();

  const benefits = [
    {
      title: 'Low Calories & Weight Friendly',
      desc: 'Makhana is high in volume but extremely low in calories and saturated fats, making it ideal for weight management.',
      icon: '🥗',
    },
    {
      title: 'Supports Cardiovascular Health',
      desc: 'Rich in magnesium and low in sodium, helping maintain healthy blood pressure and smooth cardiac rhythm.',
      icon: '🫀',
    },
    {
      title: 'Anti-Aging Antioxidants',
      desc: 'Contains kaempferol and natural flavonoids that fight free radicals, promoting healthy glowing skin.',
      icon: '✨',
    },
    {
      title: 'High Fiber Digestibility',
      desc: 'Soluble dietary fiber aids smooth digestion, prevents bloating, and keeps gut microbiome balanced.',
      icon: '🌾',
    },
  ];

  return (
    <div className="space-y-20">
      {/* Health Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#E6F6F3] via-[#EFF9F7] to-[#DCF2ED] text-slate-800 relative overflow-hidden border-y border-[#C0E7E2]">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-black uppercase tracking-widest text-[#0D4D4A] bg-white/80 px-3.5 py-1.5 rounded-full border border-[#A4E7E2] shadow-sm">
                Nutritional Powerhouse
              </span>

              <h2 className="text-3xl sm:text-4xl font-black text-[#0D4D4A] leading-tight">
                Superfood Packed With <br />
                <span className="text-[#127F7B]">Essential Nutrients</span>
              </h2>

              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                Fox nuts (Makhana) have been revered in Ayurvedic wellness for
                centuries. Doctor Makhana delivers maximum natural nutrients with a 93.63%
                essential amino acid score without any artificial additives or chemical bleaching.
              </p>

              <div className="bg-white/85 backdrop-blur-sm p-5 rounded-2xl border border-[#A4E7E2] shadow-sm space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#0D4D4A]">
                  <span>Protein per 100g</span>
                  <span className="text-[#117C78] font-black">9.7g (High Plant Protein)</span>
                </div>
                <div className="w-full bg-[#E0F3F0] rounded-full h-2">
                  <div className="bg-[#117C78] h-2 rounded-full w-[85%]"></div>
                </div>

                <div className="flex justify-between text-xs font-bold text-[#0D4D4A] pt-2">
                  <span>Dietary Fiber per 100g</span>
                  <span className="text-[#117C78] font-black">7.6g (Smooth Digestion)</span>
                </div>
                <div className="w-full bg-[#E0F3F0] rounded-full h-2">
                  <div className="bg-[#127F7B] h-2 rounded-full w-[75%]"></div>
                </div>
              </div>

              <button
                onClick={() => setActivePage('about')}
                className="bg-[#0D6E6B] hover:bg-[#0A5855] text-white font-black px-6 py-3.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md"
              >
                Read Our Story & Quality Process <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-[#BCEEE8] shadow-sm hover:shadow-md hover:border-[#127F7B] transition-all space-y-3"
                >
                  <span className="text-3xl block">{benefit.icon}</span>
                  <h3 className="text-lg font-bold text-[#0D4D4A]">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-teal-800 bg-teal-100 px-3.5 py-1.5 rounded-full border border-teal-200">
            Real Customer Feedback
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Loved By Healthy Snackers
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            Over 10,000+ happy customers across India choose Doctor Makhana.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative space-y-4 flex flex-col justify-between"
            >
              <Quote className="w-8 h-8 text-teal-200 absolute top-6 right-6" />

              <div className="space-y-2">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  "{review.title}"
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {review.comment}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-slate-900 text-xs block">
                    {review.userName}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {review.userCity} • Verified Buyer
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Banner CTA */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        <div className="bg-gradient-to-r from-[#0D6E6B] via-[#0A5D5A] to-[#127F7B] rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-3 max-w-xl text-center md:text-left z-10">
            <span className="bg-white/20 text-white font-extrabold text-[11px] uppercase tracking-widest px-3 py-1 rounded-full border border-white/30">
              Limited Time Welcome Offer
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              Try Doctor Makhana 250g Today for Only ₹399
            </h3>
            <p className="text-xs text-teal-100">
              Use code <strong className="text-amber-300">WELCOME10</strong> at
              checkout for 10% instant discount!
            </p>
          </div>

          <button
            onClick={() => setActivePage('shop')}
            className="z-10 bg-white text-[#0D6E6B] hover:bg-amber-300 hover:text-teal-950 font-black px-8 py-4 rounded-2xl shadow-xl transition-all text-sm shrink-0"
          >
            Order Doctor Makhana Now
          </button>
        </div>
      </section>
    </div>
  );
};
