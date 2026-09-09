import React, { useState } from 'react';
import {
  doctorMakhanaPackagingReal,
  doctorMakhanaFront,
  doctorMakhanaBack,
  doctorMakhanaCloseup,
  doctorMakhanaLifestyleKitchen,
  doctorMakhanaPosterFacts,
} from '../../assets/images';
import { Sparkles, ShieldCheck, ZoomIn, CheckCircle2 } from 'lucide-react';

interface ProductPackGraphicProps {
  type?: 'front' | 'back' | 'closeup' | 'lifestyle' | 'poster' | 'kitchen' | 'real';
  className?: string;
  weight?: string;
  price?: number;
  productName?: string;
  customImageSrc?: string;
  images?: {
    front?: string;
    back?: string;
    closeup?: string;
    lifestyle?: string;
  };
}


export const ProductPackGraphic: React.FC<ProductPackGraphicProps> = ({
  type = 'front',
  className = 'w-full h-auto',
  weight = '250g',
  price = 399,
  productName = 'Doctor Makhana Premium Fox Nuts',
  customImageSrc,
  images,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const effectiveCustomImage =
    customImageSrc ||
    (images?.front &&
    (images.front.startsWith('http://') ||
      images.front.startsWith('https://') ||
      images.front.startsWith('/api/') ||
      images.front.startsWith('data:'))
      ? images.front
      : undefined);

  // If custom uploaded image is provided, display exact uploaded file
  if (effectiveCustomImage && (type === 'front' || type === 'real')) {
    const isCompact =
      className.includes('h-full') ||
      className.includes('h-24') ||
      className.includes('h-12') ||
      className.includes('h-16') ||
      className.includes('max-w-[200px]') ||
      className.includes('max-w-[190px]');

    return (
      <div
        className={`relative group overflow-hidden rounded-2xl bg-white flex flex-col ${
          isCompact ? '' : 'shadow-xl border border-teal-100'
        } ${className}`}
      >
        <div className="relative w-full flex-1 aspect-[3/4] overflow-hidden bg-gradient-to-b from-[#EDFAF8] via-white to-[#E4F6F4] flex items-center justify-center p-2">
          <img
            src={effectiveCustomImage}
            alt={productName || 'Doctor Makhana'}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
          />

          <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm border border-emerald-300 rounded-full px-2 py-0.5 flex items-center gap-1 shadow-sm">
            <div className="w-2.5 h-2.5 border border-emerald-600 rounded-sm flex items-center justify-center p-0.5">
              <div className="w-1 h-1 rounded-full bg-emerald-600"></div>
            </div>
            <span className="text-[8px] sm:text-[9px] font-black text-emerald-800 uppercase tracking-wide">
              100% Pure
            </span>
          </div>

          {weight && (
            <div className="absolute bottom-2 right-2 bg-teal-900/90 backdrop-blur-sm text-amber-300 text-[10px] sm:text-[11px] font-black px-2.5 py-0.5 rounded-full border border-teal-600 shadow-md">
              {weight}
            </div>
          )}
        </div>

        {!isCompact && (
          <div className="p-3 bg-teal-900 text-white flex items-center justify-between text-xs">
            <span className="font-black text-amber-300 line-clamp-1">{productName}</span>
            <span className="text-[10px] text-teal-200 uppercase font-bold tracking-wider shrink-0 ml-2">
              Authentic Quality
            </span>
          </div>
        )}
      </div>
    );
  }

  if (type === 'poster') {
    return (
      <div
        className={`relative group overflow-hidden rounded-3xl bg-white shadow-xl border border-teal-200 flex flex-col ${className}`}
      >
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-slate-50 flex items-center justify-center p-1">
          <img
            src={doctorMakhanaPosterFacts}
            alt="Doctor Makhana Packaging & Nutritional Profile"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 bg-teal-900/85 backdrop-blur-sm text-amber-300 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-teal-500/50 shadow">
            Official Poster & Facts
          </div>
        </div>
        <div className="p-3 bg-teal-900 text-white flex items-center justify-between text-xs">
          <span className="font-black text-amber-300">Sayandra Nema • FSSAI Certified</span>
          <span className="text-[10px] text-teal-200 uppercase font-bold tracking-wider">
            Goodness In Every Bite
          </span>
        </div>
      </div>
    );
  }

  if (type === 'kitchen' || type === 'real') {
    return (
      <div
        className={`relative group overflow-hidden rounded-3xl bg-white shadow-xl border border-teal-100 flex flex-col ${className}`}
      >
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-slate-50 flex items-center justify-center">
          <img
            src={doctorMakhanaPackagingReal}
            alt="Doctor Makhana Packaging Lifestyle with Fresh Bowl"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-3 bg-teal-900 text-white flex items-center justify-between text-xs">
          <span className="font-black text-amber-300">Doctor Makhana Premium</span>
          <span className="text-[10px] text-teal-200 uppercase font-bold tracking-wider">
            100% Pure & Fresh
          </span>
        </div>
      </div>
    );
  }

  if (type === 'closeup') {

    return (
      <div
        className={`relative group overflow-hidden rounded-3xl bg-white shadow-xl border border-teal-100 flex flex-col items-center justify-center ${className}`}
      >
        <div className="relative w-full aspect-square overflow-hidden bg-amber-50/50 flex items-center justify-center cursor-pointer" onClick={() => setIsZoomed(!isZoomed)}>
          <img
            src={doctorMakhanaCloseup}
            alt="Doctor Makhana Close Up Fresh Lotus Seeds"
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover transition-transform duration-700 ${isZoomed ? 'scale-150' : 'group-hover:scale-110'}`}
          />
          <div className="absolute top-3 right-3 bg-teal-950/70 backdrop-blur-sm text-white text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
            <ZoomIn className="w-3 h-3 text-amber-300" />
            <span>{isZoomed ? 'Click to Reset' : 'Click to Zoom'}</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-teal-950/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 pointer-events-none">
            <span className="text-white text-xs font-black tracking-wide">
              100% Hand-Picked Jumbo Popped Fox Nuts
            </span>
          </div>
        </div>

        <div className="p-4 text-center w-full bg-white border-t border-slate-100">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[11px] font-extrabold text-teal-800 uppercase tracking-wider">
              Puffed Crisp Lotus Seeds
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Unbleached, crunchy, and naturally rich in plant protein & calcium.
          </p>
        </div>
      </div>
    );
  }

  if (type === 'lifestyle') {
    return (
      <div
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0D4D4A] via-[#127F7B] to-[#0A3F3D] p-6 text-white shadow-2xl border border-teal-600 flex flex-col justify-between ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-xs font-black tracking-widest text-amber-300 uppercase">
              Healthy Everyday Snacking
            </span>
          </div>
          <span className="text-[11px] font-black bg-teal-950/70 text-teal-200 px-3 py-1 rounded-full border border-teal-500/50">
            {weight} • ₹{price}
          </span>
        </div>

        <div className="my-5 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black leading-tight text-white">
              The Crispy Taste <br />
              <span className="text-amber-300">For Health</span>
            </h3>
            <p className="text-xs text-teal-100/90 leading-relaxed">
              100% Natural, Gluten Free, Energy Booster & Heart-Friendly Fox Nuts.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] font-bold text-white bg-teal-950/60 px-2.5 py-1 rounded-lg border border-teal-500/40">
                ✓ 9.7g Protein
              </span>
              <span className="text-[10px] font-bold text-amber-300 bg-teal-950/60 px-2.5 py-1 rounded-lg border border-amber-500/40">
                ✓ 0% Trans Fat
              </span>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="w-36 sm:w-44 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/30 transform hover:scale-105 transition-transform bg-white">
              <img
                src={doctorMakhanaFront}
                alt="Doctor Makhana 250g Pack"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-teal-600/60 flex items-center justify-between text-[11px] text-teal-200">
          <span className="flex items-center gap-1 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" /> FSSAI Certified: 21426170000308
          </span>
          <span className="text-amber-300 font-bold">100% Natural</span>
        </div>
      </div>
    );
  }

  if (type === 'back') {
    return (
      <div
        className={`relative group overflow-hidden rounded-3xl bg-white shadow-xl border border-teal-200 flex flex-col ${className}`}
      >
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-slate-50 flex items-center justify-center p-2">
          <img
            src={doctorMakhanaBack}
            alt="Doctor Makhana Back Panel Nutritional Facts"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 bg-teal-900/85 backdrop-blur-sm text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-teal-400/50 shadow">
            Back Panel & Facts
          </div>
        </div>

        <div className="p-3 bg-teal-50/80 border-t border-teal-100 text-[11px] text-slate-700 flex items-center justify-between">
          <span className="font-bold text-teal-950">Nutritional Facts & FSSAI Details</span>
          <span className="text-teal-700 font-extrabold">Net Wt: {weight}</span>
        </div>
      </div>
    );
  }

  // FRONT PACK (Default)
  const isTwin = weight?.includes('2 ×') || productName?.toLowerCase().includes('twin');

  if (isTwin) {
    return (
      <div
        className={`relative group overflow-hidden rounded-3xl bg-white shadow-xl border border-teal-100 flex flex-col ${className}`}
      >
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-gradient-to-b from-[#EDFAF8] via-white to-[#E4F6F4] flex items-center justify-center p-3">
          {/* Twin overlapping pouches */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Left/Back Pouch */}
            <div className="w-2/3 h-4/5 absolute -left-1 sm:left-1 transform -rotate-6 opacity-95 transition-transform group-hover:-translate-x-2">
              <img
                src={doctorMakhanaFront}
                alt="Doctor Makhana Pack 1"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain drop-shadow-md"
              />
              <div className="absolute top-2 left-2 bg-teal-900 text-amber-300 text-[8px] font-black px-2 py-0.5 rounded-full shadow">
                Pack #1 (250g)
              </div>
            </div>

            {/* Right/Front Pouch */}
            <div className="w-2/3 h-4/5 absolute -right-1 sm:right-1 transform rotate-6 z-10 transition-transform group-hover:translate-x-2">
              <img
                src={doctorMakhanaFront}
                alt="Doctor Makhana Pack 2"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain drop-shadow-xl"
              />
              <div className="absolute top-2 right-2 bg-amber-400 text-teal-950 text-[8px] font-black px-2 py-0.5 rounded-full shadow">
                Pack #2 (250g)
              </div>
            </div>
          </div>

          {/* Twin Badge Pill */}
          <div className="absolute bottom-3 bg-teal-900/95 backdrop-blur-sm text-amber-300 text-[11px] font-black px-3 py-1 rounded-full border border-teal-600 shadow-lg z-20">
            Twin Pack: 2 × 250g (500g)
          </div>
        </div>

        <div className="p-3 bg-teal-900 text-white flex items-center justify-between text-xs">
          <span className="font-black text-amber-300">Twin Saver (2 × 250g)</span>
          <span className="text-[10px] text-teal-200 uppercase font-bold tracking-wider">
            Total 500g Freshness
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative group overflow-hidden rounded-3xl bg-white shadow-xl border border-teal-100 flex flex-col ${className}`}
    >
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-slate-50 flex items-center justify-center">
        <img
          src={doctorMakhanaPackagingReal}
          alt={productName || 'Doctor Makhana 250g Pouch'}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-3 bg-teal-900 text-white flex items-center justify-between text-xs">
        <span className="font-black text-amber-300 line-clamp-1">{productName || 'Doctor Makhana 250g'}</span>
        <span className="text-[10px] text-teal-200 uppercase font-bold tracking-wider shrink-0 ml-2">
          {weight} • ₹{price}
        </span>
      </div>
    </div>
  );

};
