import React, { useState } from 'react';
import { useRealtimeData } from '../hooks/useRealtimeData';
import { ambulanceService } from '../services/ambulanceService';
import { Truck, PhoneCall, MapPin, CheckCircle2, Siren, Clock, Navigation } from 'lucide-react';
import { Ambulance } from '../types';

export const AmbulancesPage: React.FC = () => {
  const { hospitals } = useRealtimeData();
  const [showRequestModal, setShowRequestModal] = useState<boolean>(false);
  
  // Form State for Request Ambulance
  const [pickupLocation, setPickupLocation] = useState<string>('77 Park Avenue, Metro Central');
  const [emergencyType, setEmergencyType] = useState<string>('Severe Trauma / Cardiac');
  const [destinationId, setDestinationId] = useState<string>(hospitals[0]?.id || 'hosp-001');
  const [dispatchedResult, setDispatchedResult] = useState<{ ambulance: Ambulance & { hospitalName: string }; etaMinutes: number } | null>(null);

  // Flatten ambulances
  const ambulances = ambulanceService.getAllAmbulances();
  const availableCount = ambulances.filter(a => a.status === 'Available').length;

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = ambulanceService.requestAmbulance(12.9716, 77.5946, emergencyType, destinationId);
    if (result) {
      setDispatchedResult(result);
    } else {
      alert('All ambulance units are currently on active trips. Dispatched high-priority request to central queue.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title & Emergency Request Action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Truck className="w-7 h-7 text-amber-500" />
            <span>Emergency Ambulance Tracking & Dispatch</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time tracking of Advanced Life Support (ALS) & Basic Life Support (BLS) ambulances.
          </p>
        </div>

        <button
          onClick={() => {
            setDispatchedResult(null);
            setShowRequestModal(true);
          }}
          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white font-black text-xs rounded-2xl shadow-lg shadow-amber-500/30 flex items-center gap-2 transition-transform transform active:scale-95 cursor-pointer"
        >
          <Siren className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
          <span>[REQUEST AMBULANCE NOW]</span>
        </button>
      </div>

      {/* Fleet Overview Pill */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Fleet Active: {ambulances.length} Units</span>
        </div>
        <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300">
          <span className="font-extrabold text-emerald-600 dark:text-emerald-400">🟢 {availableCount} Available</span>
          <span className="font-bold text-amber-600">🟡 {ambulances.filter(a => a.status === 'Assigned').length} Assigned</span>
          <span className="font-bold text-rose-600">🔴 {ambulances.filter(a => a.status === 'On Trip').length} On Trip</span>
        </div>
      </div>

      {/* Ambulances Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ambulances.map(a => (
          <div
            key={a.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between font-bold">
                <span className="font-mono text-base text-slate-900 dark:text-white">
                  {a.id}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs ${
                  a.status === 'Available' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {a.status === 'Available' ? '🟢 Available' : `🟡 ${a.status}`}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-amber-600 block">{a.type}</span>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Base: {a.hospitalName}</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl text-xs space-y-1">
                <p className="font-bold text-slate-800 dark:text-slate-200">Driver: {a.driverName}</p>
                <p className="text-slate-400 text-[11px] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-500" /> Current: {a.currentAddress || 'Stationed at Bay'}
                </p>
                {a.destination && (
                  <p className="text-amber-600 font-semibold text-[11px]">En route to: {a.destination}</p>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <a
                href={`tel:${a.driverPhone}`}
                className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs text-center flex items-center justify-center gap-1"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Driver: {a.driverPhone}</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Request Ambulance Interactive Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl animate-scale-up">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Siren className="w-6 h-6 text-rose-500 animate-pulse" />
                <span>Request Emergency Ambulance</span>
              </h3>
              <button onClick={() => setShowRequestModal(false)} className="text-slate-400 text-sm font-bold">
                ✕
              </button>
            </div>

            {dispatchedResult ? (
              <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Ambulance Dispatched!</span>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                    Unit {dispatchedResult.ambulance.id} En Route
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    Driver: <strong>{dispatchedResult.ambulance.driverName}</strong> ({dispatchedResult.ambulance.driverPhone})
                  </p>
                  <p className="text-sm font-black text-rose-600 mt-2">
                    ⏱ Estimated Arrival Time: ~{dispatchedResult.etaMinutes} Minutes
                  </p>
                </div>

                <button
                  onClick={() => setShowRequestModal(false)}
                  className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl"
                >
                  Close & View Fleet Map
                </button>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Pickup Location Address *
                  </label>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-medium focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Emergency Nature *
                  </label>
                  <select
                    value={emergencyType}
                    onChange={(e) => setEmergencyType(e.target.value)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-medium focus:outline-none"
                  >
                    <option value="Severe Trauma / Cardiac">❤️ Heart Attack / Severe Chest Pain</option>
                    <option value="Stroke Emergency">🧠 Acute Stroke Symptoms</option>
                    <option value="Severe Accident">🚗 Vehicle Accident / Severe Trauma</option>
                    <option value="Breathing Failure">🫁 Severe Respiratory Distress</option>
                    <option value="Maternity Emergency">🤰 Pregnancy / Labor Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Destination Hospital Preference *
                  </label>
                  <select
                    value={destinationId}
                    onChange={(e) => setDestinationId(e.target.value)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-medium focus:outline-none"
                  >
                    {hospitals.map(h => (
                      <option key={h.id} value={h.id}>{h.name} (Beds: {h.availableBeds})</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
                >
                  <Siren className="w-4 h-4" />
                  <span>DISPATCH NEAREST AMBULANCE</span>
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
