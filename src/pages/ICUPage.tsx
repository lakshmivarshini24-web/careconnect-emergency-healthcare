import React from 'react';
import { useRealtimeData } from '../hooks/useRealtimeData';
import { Activity, Wind, AlertCircle, PhoneCall, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ICUPage: React.FC = () => {
  const { hospitals } = useRealtimeData();

  // Sort hospitals by available ICU beds (highest first)
  const sortedICU = [...hospitals].sort((a, b) => b.icuAvailable - a.icuAvailable);

  const getICUBadge = (available: number) => {
    if (available >= 5) {
      return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">🟢 Available</span>;
    } else if (available >= 1) {
      return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300">🟡 Limited Capacity</span>;
    } else {
      return <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 animate-pulse">🔴 FULL / SATURATED</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="w-7 h-7 text-indigo-500" />
          <span>ICU & Critical Care Availability</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Hospitals ranked by available Intensive Care Units, ventilators, and critical care infrastructure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedICU.map((hosp, idx) => (
          <div
            key={hosp.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Rank #{idx + 1}</span>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    <Link to={`/hospitals/${hosp.id}`} className="hover:text-indigo-600 transition-colors">
                      {hosp.name}
                    </Link>
                  </h3>
                </div>
                {getICUBadge(hosp.icuAvailable)}
              </div>

              {/* ICU & Ventilator Stats Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100 dark:border-slate-800">
                <div className="p-2.5 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl">
                  <span className="text-slate-500 block font-medium">ICU Beds Open</span>
                  <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {hosp.icuAvailable} <span className="text-xs text-slate-400 font-normal">/ {hosp.icuTotal}</span>
                  </p>
                </div>

                <div className="p-2.5 bg-cyan-50/50 dark:bg-cyan-950/20 rounded-2xl">
                  <span className="text-slate-500 block font-medium">Ventilators</span>
                  <p className="text-xl font-black text-cyan-600 dark:text-cyan-400 mt-0.5">
                    {hosp.ventilatorsAvailable} <span className="text-xs text-slate-400 font-normal">/ {hosp.ventilatorsTotal}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                <p className="flex items-center justify-between">
                  <span>Oxygen-supported ICU:</span>
                  <strong className="font-mono text-emerald-600">{Math.round(hosp.icuAvailable * 0.8)} beds</strong>
                </p>
                <p className="flex items-center justify-between">
                  <span>Critical Care Team:</span>
                  <strong className="font-semibold text-slate-800 dark:text-slate-200">On Emergency Duty</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <a
                href={`tel:${hosp.phone}`}
                className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs text-center flex items-center justify-center gap-1 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call ICU Desk</span>
              </a>

              <Link
                to={`/hospitals/${hosp.id}`}
                className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs"
              >
                Inspect Bed Matrix
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
