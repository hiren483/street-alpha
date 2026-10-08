import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';

export const Toasts: React.FC = () => {
  const { toasts, dismissToast } = useGameStore(state => ({
    toasts: state.toasts,
    dismissToast: state.dismissToast,
  }));

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-14 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none select-none">
      {toasts.map(toast => {
        let Icon = Info;
        let borderClass = 'border-sky-500/40 text-sky-300';
        let bgClass = 'bg-slate-900/95';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          borderClass = 'border-emerald-500/40 text-emerald-300';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderClass = 'border-amber-500/40 text-amber-300';
        } else if (toast.type === 'alert') {
          Icon = AlertCircle;
          borderClass = 'border-rose-500/40 text-rose-300';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-xl backdrop-blur-md flex items-start gap-3 transition-all ${bgClass} ${borderClass}`}
          >
            <Icon className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-0.5">
              <h4 className="text-xs font-bold text-slate-100 font-mono">{toast.title}</h4>
              <p className="text-xs text-slate-300 leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-500 hover:text-slate-300 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
