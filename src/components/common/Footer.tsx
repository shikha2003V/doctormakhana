import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Logo } from './Logo';
import { Phone, Mail, MessageSquare, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActivePage } = useStore();

  return (
    <footer className="bg-[#0A3D3A] text-teal-100 pt-16 pb-12 border-t-4 border-[#127F7B] relative overflow-hidden">
      {/* Background Subtle Glowing Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#127F7B]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-teal-800/80">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <button onClick={() => setActivePage('home')} className="text-left focus:outline-none">
              <Logo variant="dark" size="md" />
            </button>

            <p className="text-xs text-teal-200/80 leading-relaxed">
              Doctor Makhana brings premium-quality fox nuts carefully selected
              for their crisp texture, large size, and wholesome health benefits.
              100% natural, manufactured by Sayandra Nema, and made in India.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-amber-300 bg-teal-950/60 border border-teal-700/60 p-2.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> FSSAI
              Lic No: 21426170000308
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white text-sm font-extrabold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button
                  onClick={() => setActivePage('home')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-2"
                >
                  <span className="text-amber-400">›</span> Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('about')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-2"
                >
                  <span className="text-amber-400">›</span> About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('shop')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-2"
                >
                  <span className="text-amber-400">›</span> Shop Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('track-order')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-2"
                >
                  <span className="text-amber-400">›</span> Track Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('contact')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-2"
                >
                  <span className="text-amber-400">›</span> Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Support */}
          <div>
            <h4 className="text-white text-sm font-extrabold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button
                  onClick={() => setActivePage('support')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-2"
                >
                  <span className="text-amber-400">›</span> Support & FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('policy-shopping')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-2"
                >
                  <span className="text-amber-400">›</span> Shopping Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('policy-refund')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-2"
                >
                  <span className="text-amber-400">›</span> Refund & Return Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('account')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-2"
                >
                  <span className="text-amber-400">›</span> Customer Account
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Legal */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-extrabold uppercase tracking-wider border-b border-slate-800 pb-2">
              Contact & Connect
            </h4>

            <div className="space-y-2.5 text-xs text-slate-300">
              <a
                href="tel:7649090402"
                className="flex items-center gap-3 p-2 rounded-lg bg-teal-950/60 hover:bg-teal-900/60 transition-colors border border-teal-700/50 text-white"
              >
                <Phone className="w-4 h-4 text-amber-300 shrink-0" />
                <div>
                  <span className="text-[10px] text-teal-200 block font-semibold">
                    Order Now / Phone
                  </span>
                  <span className="font-bold text-white">+91 76490 90402</span>
                </div>
              </a>

              <a
                href="https://wa.me/917649090402"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 transition-colors border border-emerald-800/50"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-emerald-300 block font-semibold">
                    WhatsApp Chat Support
                  </span>
                  <span className="font-bold text-white">+91 76490 90402</span>
                </div>
              </a>

              <a
                href="mailto:doctormakhan@gmail.com"
                className="flex items-center gap-3 p-2 rounded-lg bg-teal-950/60 hover:bg-teal-900/60 transition-colors border border-teal-700/50 text-white"
              >
                <Mail className="w-4 h-4 text-amber-300 shrink-0" />
                <div className="overflow-hidden">
                  <span className="text-[10px] text-teal-200 block font-semibold">
                    Official Email
                  </span>
                  <span className="font-bold text-white truncate block">
                    doctormakhan@gmail.com
                  </span>
                </div>
              </a>
            </div>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-400">
              <button
                onClick={() => setActivePage('policy-privacy')}
                className="hover:text-amber-300 transition-colors"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button
                onClick={() => setActivePage('policy-terms')}
                className="hover:text-amber-300 transition-colors"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Doctor Makhana. All Rights Reserved.</p>
          <div className="flex items-center gap-2">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Healthy India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
