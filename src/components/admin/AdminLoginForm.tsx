import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Lock, Mail, ShieldAlert, ArrowLeft, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export const AdminLoginForm: React.FC = () => {
  const { adminLogin, setActivePage } = useStore();
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!emailOrUser.trim() || !password) {
      setErrorMessage('Please enter both your Admin Email/Username and Password.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await adminLogin(emailOrUser.trim(), password);
      if (!result.success) {
        setErrorMessage(result.error || 'Invalid credentials. Please verify and try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to connect to authentication service.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F0FAF7] via-white to-[#E8F7F4]">
      <div className="w-full max-w-md space-y-6">
        {/* Return to Store Link */}
        <div>
          <button
            onClick={() => setActivePage('home')}
            className="inline-flex items-center gap-2 text-xs font-bold text-teal-800 hover:text-teal-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Customer Store
          </button>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-teal-100/80 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-900 text-amber-300 shadow-md mb-2">
              <Lock className="w-7 h-7" />
            </div>
            <div className="inline-block bg-teal-100 text-teal-900 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
              Owner / Admin Portal
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Doctor Makhana Admin
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Authenticate to manage live products, pricing, stock inventory, and customer orders.
            </p>
          </div>

          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-2xl flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Authentication Failed</p>
                <p className="text-[11px] text-rose-700 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Admin Email or Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={emailOrUser}
                  onChange={(e) => setEmailOrUser(e.target.value)}
                  placeholder="admin@doctormakhana.com"
                  autoComplete="username"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-700 focus:bg-white transition-all shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-10 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-700 focus:bg-white transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-teal-800 hover:bg-teal-900 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  Sign In to Owner Dashboard
                </>
              )}
            </button>
          </form>

          {/* Security & Credentials hint */}
          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-600">Access Mode:</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Server-Authoritative
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Only authorized personnel can access the product catalog and customer orders database.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
