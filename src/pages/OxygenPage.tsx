import React from 'react';
import { useRealtimeData } from '../hooks/useRealtimeData';
import { Wind, PhoneCall, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const OxygenPage: React.FC = () => {
  const { hospitals } = useRealtimeData();

  // Sort by oxygen availability
  const sortedOxygen = [...hospitals].sort((a, b) => b.oxygenBedsAvailable - a.oxygenBedsAvailable);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Wind className="w-7 h-7 text-cyan-500" />
          <span>Oxygen-Supported Beds & Cylinders</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Real-time tracking of oxygen beds, high-flow nasal cannula units, and backup oxygen cylinders.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedOxygen.map((hosp) => (
          <div key={hosp.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                <Link to={`/hospitals/${hosp.id}`} className="hover:text-cyan-600 transition-colors">
                  {hosp.name}
                </Link>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{hosp.address}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-cyan-50/50 dark:bg-cyan-950/20 rounded-2xl border border-cyan-200/60 dark:border-cyan-900">
                <span className="text-slate-500 block font-medium">Oxygen Beds</span>
                <p className="text-xl font-black text-cyan-600 dark:text-cyan-400 mt-0.5">
                  {hosp.oxygenBedsAvailable} <span className="text-xs text-slate-400 font-normal">/ {hosp.oxygenBedsTotal}</span>
                </p>
              </div>

              <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200/60 dark:border-emerald-900">
                <span className="text-slate-500 block font-medium">Backup Cylinders</span>
                <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {hosp.oxygenCylinders}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-1 font-semibold text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" /> High Oxygen Supply Status
              </span>
              <a
                href={`tel:${hosp.phone}`}
                className="px-3 py-1.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 flex items-center gap-1"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Call
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
