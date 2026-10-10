import React, { useState } from 'react';
import { useRealtimeData } from '../hooks/useRealtimeData';
import { WardType, Hospital } from '../types';
import { BedMatrix } from '../components/hospital/BedMatrix';
import { hospitalService } from '../services/hospitalService';
import { bedService } from '../services/bedService';
import { Bed as BedIcon, Filter, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BedsPage: React.FC = () => {
  const { hospitals } = useRealtimeData();
  const [selectedWard, setSelectedWard] = useState<WardType | 'All'>('All');
  const [expandedHospitalId, setExpandedHospitalId] = useState<string | null>(null);

  // Hospitals automatically sorted by available beds (highest available beds top)
  const sortedHospitals = [...hospitals].sort((a, b) => b.availableBeds - a.availableBeds);

  const wards: (WardType | 'All')[] = ['All', 'Emergency', 'ICU', 'General', 'Pediatric', 'Maternity', 'Isolation'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <BedIcon className="w-7 h-7 text-blue-500" />
          <span>Real-Time Bed Directory & Matrix</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Hospitals sorted automatically by available bed capacity. Expand any hospital to view individual bed statuses.
        </p>
      </div>

      {/* Ward Category Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-2 text-xs">
        <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-rose-500" /> Filter Ward Type:
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {wards.map(ward => (
            <button
              key={ward}
              onClick={() => setSelectedWard(ward)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                selectedWard === ward
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {ward === 'All' ? 'All Beds' : ward}
            </button>
          ))}
        </div>
      </div>

      {/* Hospital Bed Availability List */}
      <div className="space-y-4">
        {sortedHospitals.map((hosp, idx) => {
          const isExpanded = expandedHospitalId === hosp.id;
          const beds = bedService.getBedsByHospital(hosp.id);
          const filteredBeds = bedService.filterBeds(beds, selectedWard);

          return (
            <div
              key={hosp.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 transition-all"
            >
              {/* Summary Row */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-sm flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                    #{idx + 1}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                      <Link to={`/hospitals/${hosp.id}`} className="hover:text-blue-600 transition-colors">
                        {hosp.name}
                      </Link>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                        {hosp.emergencyStatus}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{hosp.address}</span> • <span>📍 {hosp.distanceKm || 3.2} km away</span>
                    </p>
                  </div>
                </div>

                {/* Available Beds Count Pill & Expand Toggle */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-medium text-slate-400 block">Available Beds</span>
                    <p className={`font-black text-xl ${
                      hosp.availableBeds > 15 ? 'text-emerald-600 dark:text-emerald-400' : (hosp.availableBeds > 0 ? 'text-amber-600' : 'text-rose-600')
                    }`}>
                      {hosp.availableBeds} <span className="text-xs text-slate-400 font-normal">/ {hosp.totalBeds} Total</span>
                    </p>
                  </div>

                  <button
                    onClick={() => setExpandedHospitalId(isExpanded ? null : hosp.id)}
                    className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1 transition-colors"
                  >
                    <span>{isExpanded ? 'Hide Grid' : 'Inspect 100 Beds'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Individual Bed Matrix Grid when expanded */}
              {isExpanded && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <BedMatrix
                    beds={filteredBeds}
                    hospitalName={hosp.name}
                    totalBeds={hosp.totalBeds}
                    availableBeds={hosp.availableBeds}
                    occupiedBeds={hosp.occupiedBeds}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
