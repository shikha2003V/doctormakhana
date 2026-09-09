import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Logo } from './Logo';
import { GoogleDriveManager } from './GoogleDriveManager';
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
  Phone,
  ShieldCheck,
  Heart,
  Truck,
  HelpCircle,
  HardDrive,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activePage,
    setActivePage,
    cartItemCount,
    setIsCartDrawerOpen,
    searchQuery,
    setSearchQuery,
    isSearchOpen,
    setIsSearchOpen,
    user,
    wishlist,
    isAdminAuthenticated,
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDriveOpen, setIsDriveOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'track-order', label: 'Track Order' },
    { id: 'about', label: 'About Us' },
    { id: 'support', label: 'Support' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActivePage('shop');
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      {/* Top Banner Announcement */}
      <div className="bg-[#0D6E6B] text-teal-50 text-xs py-2 px-4 border-b border-[#0A5A57]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-medium">
              <Truck className="w-3.5 h-3.5 text-amber-300" />
              Free Express Shipping across India on orders above ₹499!
            </span>
            <span className="hidden md:inline text-teal-300">•</span>
            <span className="hidden md:inline-flex items-center gap-1 text-teal-100">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" /> 100%
              Natural & Gluten Free
            </span>
          </div>

          <div className="flex items-center gap-4 font-semibold text-[11px]">
            <a
              href="tel:7649090402"
              className="hover:text-amber-300 flex items-center gap-1 transition-colors text-white"
            >
              <Phone className="w-3 h-3 text-amber-300" />
              +91 76490 90402
            </a>
            {isAdminAuthenticated && (
              <button
                onClick={() => setActivePage('admin')}
                className="bg-amber-400 hover:bg-amber-300 text-teal-950 px-2.5 py-0.5 rounded text-[11px] font-bold border border-amber-300 shadow-sm transition-colors flex items-center gap-1"
                title="Open Store Owner Dashboard"
              >
                Owner Dashboard ●
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-teal-100 shadow-sm transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Tagline */}
          <button
            onClick={() => setActivePage('home')}
            className="flex items-center gap-3 group text-left focus:outline-none hover:opacity-95 transition-opacity"
          >
            <Logo size="md" />
          </button>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setActivePage(link.id as any)}
                className={`text-sm font-bold tracking-wide uppercase transition-all relative py-1 ${
                  activePage === link.id
                    ? 'text-teal-700 font-extrabold'
                    : 'text-slate-600 hover:text-teal-600'
                }`}
              >
                {link.label}
                {activePage === link.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400 rounded-full"></span>
                )}
              </button>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Search Icon / Bar Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-all"
              title="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Link */}
            <button
              onClick={() => setActivePage('shop')}
              className="hidden sm:flex p-2 text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-all relative"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500"></span>
              )}
            </button>

            {/* Google Drive Backup Link */}
            <button
              onClick={() => setIsDriveOpen(true)}
              className="hidden sm:flex p-2 text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-all relative"
              title="Google Drive Backup & Receipts"
            >
              <HardDrive className="w-5 h-5" />
            </button>

            {/* User Account / Login */}
            <button
              onClick={() => setActivePage('account')}
              className={`flex items-center gap-2 p-2 rounded-xl transition-all border ${
                activePage === 'account'
                  ? 'bg-teal-50 border-teal-300 text-teal-800'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <User className="w-5 h-5 text-teal-700" />
              <span className="hidden md:inline text-xs font-bold">
                {user ? user.fullName.split(' ')[0] : 'Login'}
              </span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="bg-gradient-to-r from-cyan-600 to-teal-700 hover:from-cyan-700 hover:to-teal-800 text-white p-2.5 sm:px-4 rounded-xl flex items-center gap-2 shadow-md shadow-cyan-900/20 transition-all font-bold text-sm relative"
            >
              <ShoppingBag className="w-5 h-5 text-amber-300" />
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-amber-400 text-teal-950 text-xs font-black px-2 py-0.5 rounded-full">
                {cartItemCount}
              </span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Search Modal / Overlay Bar */}
        {isSearchOpen && (
          <div className="bg-teal-50 border-t border-b border-teal-200 p-4 animate-fade-in">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-teal-600 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by product name, type (Raw, Roasted, Peri Peri)..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-teal-200 rounded-xl focus:border-teal-600 focus:outline-none text-slate-800 text-sm font-medium"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-sm"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2.5 text-slate-500 hover:text-slate-800 rounded-xl border border-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto animate-slide-left">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <button 
                  onClick={() => {
                    setActivePage('home');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left"
                >
                  <Logo size="sm" />
                </button>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-slate-500 hover:text-slate-800 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="py-6 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => {
                      setActivePage(link.id as any);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-left px-4 py-3 rounded-xl font-bold text-sm tracking-wide transition-all ${
                      activePage === link.id
                        ? 'bg-teal-700 text-white shadow-md'
                        : 'text-slate-700 hover:bg-teal-50'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-3">
              <button
                onClick={() => {
                  setIsDriveOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold py-2.5 rounded-xl text-xs border border-teal-200 flex items-center justify-center gap-2 transition-colors"
              >
                <HardDrive className="w-4 h-4 text-teal-700" />
                Google Drive Storage & Receipts
              </button>

              {isAdminAuthenticated && (
                <button
                  onClick={() => {
                    setActivePage('admin');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-amber-400 text-teal-950 font-bold py-2.5 rounded-xl text-sm shadow-sm hover:bg-amber-500"
                >
                  Go to Admin Dashboard
                </button>
              )}
              <div className="text-center text-xs text-slate-500 space-y-1">
                <p className="font-bold text-teal-800">Support Hotline:</p>
                <p>+91 89892 14183</p>
                <p>shikhuverma2804@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Google Drive Manager Modal */}
      <GoogleDriveManager isOpen={isDriveOpen} onClose={() => setIsDriveOpen(false)} />
    </>
  );
};
