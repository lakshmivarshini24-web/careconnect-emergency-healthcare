import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { Bell, X, Activity, Droplets, Truck, UserCheck } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useNotifications();

  if (toasts.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'bed': return <Activity className="w-5 h-5 text-blue-500" />;
      case 'blood': return <Droplets className="w-5 h-5 text-rose-500" />;
      case 'ambulance': return <Truck className="w-5 h-5 text-amber-500" />;
      case 'specialist': return <UserCheck className="w-5 h-5 text-emerald-500" />;
      default: return <Bell className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl shadow-slate-900/10 transition-all duration-300 animate-slide-in"
        >
          <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
            {getIcon(toast.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {toast.hospitalName || 'CareConnect Live Update'}
            </p>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100 mt-0.5 leading-snug">
              {toast.message}
            </p>
            <span className="text-[10px] text-slate-400 mt-1 block">
              {new Date(toast.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
