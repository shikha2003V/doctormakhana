import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { INITIAL_FAQS } from '../data/initialData';
import {
  Phone,
  MessageSquare,
  Mail,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Package,
  CreditCard,
  Truck,
  RotateCcw,
  Send,
  CheckCircle2,
} from 'lucide-react';

export const SupportPage: React.FC = () => {
  const { addSupportTicket, showToast } = useStore();

  const [faqQuery, setFaqQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Ticket Form State
  const [category, setCategory] = useState('Order Support');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('7649090402');
  const [orderId, setOrderId] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const supportCategories = [
    { title: 'Order Support', icon: Package, desc: 'Track, cancel or modify orders' },
    { title: 'Product Questions', icon: HelpCircle, desc: 'Nutrition, storage, package details' },
    { title: 'Payment Issues', icon: CreditCard, desc: 'COD and billing inquiries' },
    { title: 'Delivery Issues', icon: Truck, desc: 'Courier tracking and delays' },
    { title: 'Returns & Refunds', icon: RotateCcw, desc: 'Damaged packages & replacements' },
    { title: 'General Queries', icon: MessageSquare, desc: 'Bulk orders and feedback' },
  ];

  const filteredFaqs = INITIAL_FAQS.filter(
    (faq) =>
      faq.q.toLowerCase().includes(faqQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(faqQuery.toLowerCase())
  );

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please fill out all required fields', 'warning');
      return;
    }
    addSupportTicket({
      category,
      name,
      email,
      phone,
      orderId,
      subject: subject || category,
      message,
    });
    setName('');
    setOrderId('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Banner */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-amber-300 bg-amber-400/20 px-3.5 py-1.5 rounded-full border border-amber-400/30">
            Customer Care
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">
            Need Help? We’re Here For You.
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 max-w-md mx-auto">
            Get instant answers to common questions or reach out directly to our support team.
          </p>
        </div>

        {/* Direct Action Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <a
            href="tel:7649090402"
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-teal-400 hover:shadow-lg transition-all text-center space-y-2 group"
          >
            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">Call Us Directly</h3>
            <p className="text-xs text-teal-800 font-bold">+91 76490 90402</p>
            <span className="text-[10px] text-slate-400 block">Mon - Sat (9 AM - 7 PM)</span>
          </a>

          <a
            href="https://wa.me/917649090402"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-lg transition-all text-center space-y-2 group"
          >
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">WhatsApp Chat</h3>
            <p className="text-xs text-emerald-700 font-bold">+91 76490 90402</p>
            <span className="text-[10px] text-slate-400 block">Instant Chat Assistance</span>
          </a>

          <a
            href="mailto:doctormakhan@gmail.com"
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-teal-400 hover:shadow-lg transition-all text-center space-y-2 group"
          >
            <div className="w-12 h-12 bg-teal-100 text-teal-700 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">Email Support</h3>
            <p className="text-xs text-teal-800 font-bold truncate">doctormakhan@gmail.com</p>
            <span className="text-[10px] text-slate-400 block">Response within 24 hours</span>
          </a>
        </div>

        {/* Support Categories */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-900">Support Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {supportCategories.map((cat, i) => {
              const IconComp = cat.icon;
              return (
                <button
                  key={i}
                  onClick={() => setCategory(cat.title)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    category === cat.title
                      ? 'bg-teal-700 text-white border-teal-700 shadow-md'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <IconComp className="w-5 h-5 mb-2" />
                  <h4 className="font-extrabold text-xs">{cat.title}</h4>
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900">
              Frequently Asked Questions (FAQ)
            </h2>
            <input
              type="text"
              value={faqQuery}
              onChange={(e) => setFaqQuery(e.target.value)}
              placeholder="Search FAQs..."
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-600 w-full sm:w-64"
            />
          </div>

          <div className="divide-y divide-slate-100">
            {filteredFaqs.map((faq, idx) => (
              <div key={idx} className="py-4 first:pt-0">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full text-left font-extrabold text-slate-900 text-sm flex items-center justify-between gap-4 hover:text-teal-700 transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaqIndex === idx ? (
                    <ChevronUp className="w-4 h-4 text-teal-700 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {openFaqIndex === idx && (
                  <div className="mt-2 text-xs text-slate-600 leading-relaxed bg-teal-50/50 p-4 rounded-2xl border border-teal-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Support Ticket Submission Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3">
            Submit a Support Request Ticket
          </h2>

          <form onSubmit={handleTicketSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Selected Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600"
                >
                  {supportCategories.map((c, i) => (
                    <option key={i} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Shikhu Verma"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-600"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="shikhuverma2804@gmail.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-600"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="89892 14183"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Order ID (Optional)
                </label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. DM-1001"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-600"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of your query"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Message Details *
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your question or issue in detail..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-600"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-8 py-3.5 rounded-xl text-xs shadow transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Submit Support Ticket
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
