import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Phone, Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { addContactSubmission, showToast } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('7649090402');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please fill out all required contact fields.', 'warning');
      return;
    }
    addContactSubmission({
      name,
      email,
      phone,
      subject: subject || 'General Contact',
      message,
    });
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Banner */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-amber-300 bg-amber-400/20 px-3.5 py-1.5 rounded-full border border-amber-400/30">
            Reach Out
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">Get In Touch With Us</h1>
          <p className="text-xs sm:text-sm text-teal-100 max-w-md mx-auto">
            Have questions about Doctor Makhana bulk orders, partnerships, or product details?
            We are always happy to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Action Contacts */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
                Direct Contact Handles
              </h2>

              <div className="space-y-4">
                <a
                  href="tel:7649090402"
                  className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-4 hover:bg-amber-100 transition-colors block"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-teal-950 font-bold flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-amber-900 uppercase block">
                      Call Us Directly
                    </span>
                    <span className="text-sm font-black text-slate-900">+91 76490 90402</span>
                  </div>
                </a>

                <a
                  href="https://wa.me/917649090402"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-4 hover:bg-emerald-100 transition-colors block"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-900 uppercase block">
                      WhatsApp Us
                    </span>
                    <span className="text-sm font-black text-slate-900">+91 76490 90402</span>
                  </div>
                </a>

                <a
                  href="mailto:doctormakhan@gmail.com"
                  className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-center gap-4 hover:bg-teal-100 transition-colors block"
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-700 text-white font-bold flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[10px] font-bold text-teal-900 uppercase block">
                      Email Us
                    </span>
                    <span className="text-xs font-extrabold text-slate-900 truncate block">
                      doctormakhan@gmail.com
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
              Send Us A Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Satendra Nema"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-600"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctormakhan@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-600"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="76490 90402"
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
                  placeholder="e.g. Bulk order inquiry for Doctor Makhana"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Message *
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-600"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-teal-700 hover:bg-teal-800 text-white font-black px-8 py-3.5 rounded-xl text-xs shadow transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Submit Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
