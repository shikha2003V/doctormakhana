import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-slide-up ${
            toast.type === 'success'
              ? 'bg-emerald-900/90 text-white border-emerald-500/50 shadow-emerald-950/20'
              : toast.type === 'error'
              ? 'bg-rose-900/90 text-white border-rose-500/50 shadow-rose-950/20'
              : toast.type === 'warning'
              ? 'bg-amber-900/90 text-white border-amber-500/50 shadow-amber-950/20'
              : 'bg-teal-900/90 text-white border-teal-500/50 shadow-teal-950/20'
          }`}
        >
          <div className="flex items-center gap-3">
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
            {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-teal-300 shrink-0" />}
            <span className="text-sm font-semibold">{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 text-slate-300 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
