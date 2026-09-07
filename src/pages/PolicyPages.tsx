import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, FileText, ShoppingBag, RotateCcw, Lock } from 'lucide-react';

interface PolicyPagesProps {
  initialPolicy?: 'shopping' | 'privacy' | 'refund' | 'terms';
}

export const PolicyPages: React.FC<PolicyPagesProps> = ({
  initialPolicy = 'shopping',
}) => {
  const { activePage } = useStore();

  const getPolicyFromRoute = () => {
    if (activePage === 'policy-shopping') return 'shopping';
    if (activePage === 'policy-privacy') return 'privacy';
    if (activePage === 'policy-refund') return 'refund';
    if (activePage === 'policy-terms') return 'terms';
    return initialPolicy;
  };

  const [activeTab, setActiveTab] = useState<'shopping' | 'privacy' | 'refund' | 'terms'>(
    getPolicyFromRoute()
  );

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white rounded-3xl p-8 sm:p-10 text-center shadow-xl space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-amber-300 bg-amber-400/20 px-3.5 py-1 rounded-full border border-amber-400/30">
            Legal & Store Guidelines
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">
            Doctor Makhana Store Policies
          </h1>
          <p className="text-xs text-teal-100 max-w-md mx-auto">
            Clear, transparent policies for a trustworthy healthy snacking experience.
          </p>
        </div>

        {/* Policy Tabs */}
        <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-sm flex flex-wrap gap-2 justify-center">
          {[
            { id: 'shopping', label: 'Shopping Policy', icon: ShoppingBag },
            { id: 'privacy', label: 'Privacy Policy', icon: Lock },
            { id: 'refund', label: 'Refund & Return Policy', icon: RotateCcw },
            { id: 'terms', label: 'Terms of Service', icon: FileText },
          ].map((tab) => {
            const IconComp = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
                  activeTab === tab.id
                    ? 'bg-teal-700 text-white shadow'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <IconComp className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-slate-700 text-xs sm:text-sm leading-relaxed space-y-6">
          {activeTab === 'shopping' && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3">
                Shopping & Ordering Policy
              </h2>
              <p>
                <strong>How to Order:</strong> Customers can browse products on our official website, add Doctor Makhana items to their shopping cart, and complete checkout by providing valid address details.
              </p>
              <p>
                <strong>Product Availability & Pricing:</strong> All items listed are subject to availability. Prices for Doctor Makhana products are stated in Indian Rupees (₹) inclusive of applicable taxes.
              </p>
              <p>
                <strong>Order Confirmation & Shipping:</strong> Once an order is placed via Cash on Delivery or Online Payment, a confirmation screen and unique Order ID (e.g., DM-1001) will be generated. Dispatch timeline depends on destination courier service coverage across India.
              </p>
              <p>
                <strong>Damaged Package Reporting:</strong> If your makhana package arrives tampered or damaged, please report it immediately to support at +91 76490 90402 or doctormakhan@gmail.com with photos of the unboxing.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3">
                Privacy Policy
              </h2>
              <p>
                <strong>Information Collected:</strong> We collect personal information provided directly by you during checkout or account registration, including your Full Name, Email Address, Mobile Phone Number, Delivery Address, and Order history.
              </p>
              <p>
                <strong>How Information is Used:</strong> Your data is strictly used to fulfill your orders, process delivery, provide customer support tracking, and improve Doctor Makhana website performance.
              </p>
              <p>
                <strong>Cookies & Security:</strong> We use browser localStorage and essential session cookies to remember your shopping cart items and order state. We implement reasonable technical measures to prevent unauthorized data access.
              </p>
              <p>
                <strong>Customer Rights & Contact:</strong> You may request deletion or modification of your account details by emailing doctormakhan@gmail.com.
              </p>
            </div>
          )}

          {activeTab === 'refund' && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3">
                Refund & Return Policy
              </h2>
              <p>
                <strong>Order Cancellation:</strong> You can cancel an order before it has been dispatched by contacting customer support at +91 76490 90402 or using the order management options.
              </p>
              <p>
                <strong>Damaged or Wrong Product Received:</strong> Due to food hygiene standards, food items like Doctor Makhana are non-returnable once opened, unless the parcel arrived damaged, expired, or incorrect item was delivered.
              </p>
              <p>
                <strong>Refund Process:</strong> Eligible refund requests submitted with unboxing proof will be reviewed within 2-3 business days and processed back to your original source account or bank details.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3">
                Terms of Service
              </h2>
              <p>
                <strong>Website Usage:</strong> By accessing and using the Doctor Makhana website, you agree to comply with all applicable terms, conditions, and Indian e-commerce guidelines.
              </p>
              <p>
                <strong>Intellectual Property:</strong> All brand names, logos ("Doctor Makhana - The Crispy Taste For Health"), product pack visuals, and text copy belong exclusively to Doctor Makhana. Unapproved reproduction is prohibited.
              </p>
              <p>
                <strong>Limitation of Liability:</strong> Doctor Makhana shall not be liable for indirect damages arising out of incorrect product storage after delivery. Please store in an airtight container in a cool, dry place.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
