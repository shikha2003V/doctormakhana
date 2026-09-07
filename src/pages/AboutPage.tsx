import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductPackGraphic } from '../components/common/ProductPackGraphic';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  HeartPulse,
  Flame,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setActivePage } = useStore();

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-[#0D6E6B] via-[#0A5D5A] to-[#127F7B] text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl space-y-4 relative overflow-hidden">
          <span className="text-xs font-black uppercase tracking-widest text-teal-100 bg-white/20 px-3.5 py-1.5 rounded-full border border-white/30">
            Brand Story & Philosophy
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            About Doctor Makhana
          </h1>
          <p className="text-xs sm:text-base text-teal-100 max-w-2xl mx-auto font-medium leading-relaxed">
            The Crispy Taste For Health • Bringing wholesome, hand-selected Indian fox nuts to your daily routine.
          </p>
        </div>

        {/* Main Content Box */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
          <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
            <h2 className="text-2xl font-black text-slate-900">
              Our Passion for Healthy Snacking
            </h2>
            <p>
              Doctor Makhana is focused on bringing premium-quality fox nuts that combine
              crisp texture, delicious taste and healthy everyday snacking. Our makhana
              is carefully selected for its premium quality and is suitable for roasting,
              fasting, daily cooking and wholesome snacking.
            </p>
            <p>
              We source our lotus seeds directly from local Indian lotus harvesters.
              Each pod is popped with traditional care, sorted for uniform large size,
              and packed in food-grade airtight pouches that retain natural crunchiness
              and purity without needing chemical bleaching or synthetic artificial flavorings.
            </p>
          </div>

          {/* Key Brand Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-slate-200">
            <div className="p-5 rounded-2xl bg-teal-50 border border-teal-100 space-y-2">
              <Award className="w-6 h-6 text-teal-700" />
              <h3 className="font-extrabold text-slate-900 text-sm">
                100% Premium Quality
              </h3>
              <p className="text-xs text-slate-600">
                Rigorous double-grading process ensures only plump, unbroken makhana
                seeds reach your bowl.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <HeartPulse className="w-6 h-6 text-amber-700" />
              <h3 className="font-extrabold text-slate-900 text-sm">
                Carefully Selected Fox Nuts
              </h3>
              <p className="text-xs text-slate-600">
                Unbleached, naturally puffed lotus seeds rich in plant protein,
                fiber, and essential minerals.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-2">
              <ShieldCheck className="w-6 h-6 text-emerald-700" />
              <h3 className="font-extrabold text-slate-900 text-sm">
                Made in India Commitment
              </h3>
              <p className="text-xs text-slate-600">
                Processed locally under strict FSSAI food hygiene parameters supporting
                local Indian farming communities.
              </p>
            </div>
          </div>

          {/* Pack Graphic Feature Banner */}
          <div className="bg-gradient-to-br from-slate-900 to-teal-950 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-md">
              <span className="text-amber-400 font-extrabold text-xs uppercase tracking-wider block">
                Doctor Makhana Guarantee
              </span>
              <h3 className="text-2xl font-black">
                Freshness In Every Bite
              </h3>
              <p className="text-xs text-teal-100 leading-relaxed">
                Whether you prefer to roast them in deshi ghee with rock salt or savor
                them raw, Doctor Makhana guarantees uncompromised quality in every 250g pack.
              </p>
            </div>

            <button
              onClick={() => setActivePage('shop')}
              className="bg-amber-400 hover:bg-amber-300 text-teal-950 font-black px-8 py-3.5 rounded-2xl text-xs shadow transition-all shrink-0 flex items-center gap-2"
            >
              Order Doctor Makhana <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
