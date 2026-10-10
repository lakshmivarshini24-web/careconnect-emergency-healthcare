import React, { useState } from 'react';
import { useRealtimeData } from '../hooks/useRealtimeData';
import { Droplet, PlusCircle, PhoneCall, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BloodPage: React.FC = () => {
  const { hospitals } = useRealtimeData();
  const [selectedGroup, setSelectedGroup] = useState<'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'>('B+');

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

  // Filter & rank hospitals that have the selected blood group in stock
  const rankedHospitals = [...hospitals].sort((a, b) => {
    const unitsA = a.bloodInventory.find(item => item.bloodGroup === selectedGroup)?.unitsAvailable || 0;
    const unitsB = b.bloodInventory.find(item => item.bloodGroup === selectedGroup)?.unitsAvailable || 0;
    return unitsB - unitsA;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title & Emergency Action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Droplet className="w-7 h-7 text-rose-500" />
            <span>Blood Bank Live Inventory</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time blood unit availability across all hospital blood banks. Select blood group to see stock levels.
          </p>
        </div>

        <Link
          to="/blood/request"
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-transform transform active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>SUBMIT EMERGENCY BLOOD REQUEST</span>
        </Link>
      </div>

      {/* Blood Group Selector Pills */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Select Blood Group:
        </span>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {bloodGroups.map(group => {
            const isSelected = selectedGroup === group;
            return (
              <button
                key={group}
                onClick={() => setSelectedGroup(group)}
                className={`py-3 px-2 rounded-2xl font-black text-base flex flex-col items-center transition-all ${
                  isSelected
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 scale-105 ring-2 ring-rose-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950'
                }`}
              >
                <Droplet className={`w-4 h-4 mb-1 ${isSelected ? 'text-white' : 'text-rose-500'}`} />
                <span>{group}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ranked Hospitals List for Selected Blood Group */}
      <div className="space-y-4">
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Hospitals with <strong className="text-rose-600">{selectedGroup}</strong> Blood Stock</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rankedHospitals.map((hosp) => {
            const bloodItem = hosp.bloodInventory.find(item => item.bloodGroup === selectedGroup);
            const units = bloodItem?.unitsAvailable || 0;

            return (
              <div
                key={hosp.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                        <Link to={`/hospitals/${hosp.id}`} className="hover:text-rose-600 transition-colors">
                          {hosp.name}
                        </Link>
                      </h4>
                      <p className="text-xs text-slate-400">{hosp.address}</p>
                    </div>

                    <div className={`px-3 py-1 rounded-xl text-center shrink-0 ${
                      units > 5 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : (units > 0 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300')
                    }`}>
                      <span className="text-[10px] uppercase font-bold block">{selectedGroup} Stock</span>
                      <strong className="text-lg font-black block">{units} Units</strong>
                    </div>
                  </div>

                  <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <p className="flex justify-between">
                      <span>Distance:</span>
                      <span className="font-semibold">📍 {hosp.distanceKm || 3.2} km away</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Last Stock Audit:</span>
                      <span className="font-mono text-slate-400">{new Date(bloodItem?.lastUpdated || Date.now()).toLocaleTimeString()}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <a
                    href={`tel:${hosp.phone}`}
                    className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs text-center flex items-center justify-center gap-1"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call Blood Bank</span>
                  </a>

                  <Link
                    to="/blood/request"
                    className="p-2 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold text-xs rounded-xl hover:bg-rose-100"
                  >
                    Request {selectedGroup}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
