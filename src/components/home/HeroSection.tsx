import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductPackGraphic } from '../common/ProductPackGraphic';
import {
  Sparkles,
  HeartPulse,
  ShoppingBag,
  ArrowRight,
  Phone,
  Globe,
  Leaf,
  Sprout,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Flame,
  Wheat,
  FlaskConical,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setActivePage, navigateToProduct } = useStore();

  const healthPillars = [
    {
      title: '100% Natural & Premium Quality',
      desc: 'Hand-picked jumbo lotus seeds with zero artificial chemicals.',
      icon: Leaf,
    },
    {
      title: 'Rich in Protein, Fiber & Minerals',
      desc: '9.7g natural plant protein & 7.6g dietary fiber per 100g.',
      icon: Activity,
    },
    {
      title: 'Helps in Weight Management',
      desc: 'Low calories, zero trans fat, and long-lasting fullness.',
      icon: Sprout,
    },
    {
      title: 'Good for Heart & Digestion',
      desc: 'Low sodium and rich magnesium supports smooth cardiac rhythm.',
      icon: HeartPulse,
    },
  ];

  const bottomRibbonFeatures = [
    { label: 'Gluten Free', icon: Wheat },
    { label: 'No Preservatives', icon: FlaskConical },
    { label: 'Low in Calories', icon: Flame },
    { label: '100% Natural', icon: Leaf },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#E4F5F2] via-[#F2FAF8] to-[#D9EFEA] text-slate-800 pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#C0E7E2]">
      {/* Soothing Aqua Ambient Glows */}
      <div className="absolute -top-16 -left-16 w-96 h-96 bg-white/70 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-[#8CE0DA]/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 left-1/4 w-[500px] h-[500px] bg-[#BBECE7]/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Main 2-Column Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Healthy Snacking Made Delicious! + 4 Round Feature Badges */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 border border-[#9EE7E2] text-[#0D4D4A] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-500" />
              100% Healthy & Organic Superfood
            </div>

            {/* Poster Headline */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0D4D4A] leading-[1.1]">
                Healthy Snacking <br />
                <span className="text-[#127F7B]">Made Delicious!</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-medium max-w-xl pt-1">
                The crispy taste for health. Crunchy, protein-rich, hand-picked jumbo Fox Nuts with 93.6% essential amino acid score.
              </p>
            </div>

            {/* 4 Signature Circular Feature Badges (Matching Poster) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {healthPillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-white/85 backdrop-blur-sm border border-[#A4E7E2] p-3 rounded-2xl shadow-sm hover:shadow-md hover:border-[#127F7B] transition-all"
                  >
                    {/* Deep Sea Teal Round Icon Badge */}
                    <div className="w-11 h-11 rounded-full bg-[#117C78] text-white flex items-center justify-center shrink-0 shadow-md border-2 border-white">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-[#0D4D4A] leading-tight">
                        {pillar.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Interactive Bowl Representation & Action CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => setActivePage('shop')}
                className="w-full sm:w-auto bg-[#0D6E6B] hover:bg-[#0A5855] text-white font-black px-8 py-4 rounded-2xl shadow-lg shadow-[#0D6E6B]/25 transition-all text-sm flex items-center justify-center gap-2 group"
              >
                <ShoppingBag className="w-5 h-5 text-amber-300" />
                Shop Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigateToProduct('dm-raw-250g')}
                className="w-full sm:w-auto bg-white hover:bg-[#E8F8F5] text-[#0D4D4A] font-extrabold px-7 py-4 rounded-2xl border-2 border-[#8CE0DA] transition-all text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                Explore 250g Pack • ₹399
              </button>
            </div>
          </div>

          {/* Right Column: Packaging Pouch Presentation */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
            
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#68CEC7]/30 to-amber-300/20 rounded-full blur-2xl transform scale-90 pointer-events-none"></div>

            {/* Packaging Presentation Component */}
            <div className="relative w-full max-w-[340px] sm:max-w-[380px]">
              <ProductPackGraphic
                type="real"
                weight="250g"
                price={399}
                className="w-full h-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Bottom Contact Pills Bar (Matching Poster) */}
        <div className="mt-12 pt-8 border-t border-[#BDEAE5]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            
            {/* Pill 1: Order Now Phone */}
            <a
              href="tel:7649090402"
              className="bg-[#0D6E6B] hover:bg-[#0A5855] text-white rounded-full px-5 py-3 flex items-center gap-4 shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-white text-[#0D6E6B] flex items-center justify-center shrink-0 shadow">
                <Phone className="w-5 h-5 fill-[#0D6E6B] text-[#0D6E6B]" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-teal-100 uppercase tracking-widest block leading-none">
                  Order Now
                </span>
                <span className="text-base sm:text-lg font-black tracking-wide leading-tight">
                  +91 76490 90402
                </span>
              </div>
            </a>

            {/* Pill 2: Visit Our Website */}
            <button
              onClick={() => setActivePage('shop')}
              className="bg-[#0D6E6B] hover:bg-[#0A5855] text-white rounded-full px-5 py-3 flex items-center gap-4 shadow-md transition-all text-left"
            >
              <div className="w-10 h-10 rounded-full bg-white text-[#0D6E6B] flex items-center justify-center shrink-0 shadow">
                <Globe className="w-5 h-5 text-[#0D6E6B]" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-teal-100 uppercase tracking-widest block leading-none">
                  Visit Our Website
                </span>
                <span className="text-base sm:text-lg font-black tracking-wide leading-tight">
                  www.doctormakhana.com
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Bottom 4-Pillar Feature Strip (Matching Poster) */}
        <div className="mt-8 pt-6 border-t border-[#CBEFEA]/80">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {bottomRibbonFeatures.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  className="flex items-center justify-center gap-2 bg-white/70 border border-[#BCEEE8] py-2 px-3 rounded-full text-xs font-black text-[#0D4D4A] shadow-sm"
                >
                  <div className="w-5 h-5 rounded-full bg-[#117C78] text-white flex items-center justify-center shrink-0">
                    <Icon className="w-3 h-3" />
                  </div>
                  <span>{feat.label}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

