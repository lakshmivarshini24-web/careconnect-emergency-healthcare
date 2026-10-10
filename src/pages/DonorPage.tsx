import React, { useState } from 'react';
import { useRealtimeData } from '../hooks/useRealtimeData';
import { bloodService } from '../services/bloodService';
import { HeartHandshake, CheckCircle2, XCircle, Droplet, MapPin, Clock, ShieldCheck } from 'lucide-react';

export const DonorPage: React.FC = () => {
  const { bloodRequests } = useRealtimeData();
  const [donorName, setDonorName] = useState('Alex Mercer');
  const [donorGroup, setDonorGroup] = useState<'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'>('B+');
  const [donorCity] = useState('Metro Healthcare District');

  const pendingRequests = bloodRequests.filter(r => r.status === 'PENDING');

  const handleAccept = (reqId: string) => {
    bloodService.updateRequestStatus(reqId, 'FULFILLED', donorName);
  };

  const handleDecline = (reqId: string) => {
    // Soft decline for this session
    alert(`Thank you for reviewing request #${reqId}. Other donors in your area will be notified.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Donor Header & Profile Card */}
      <div className="bg-gradient-to-r from-rose-900 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3.5 bg-rose-600 rounded-2xl">
              <HeartHandshake className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black">Blood Donor Emergency Response Network</h1>
              <p className="text-xs text-slate-300 mt-0.5">
                Voluntary donor portal receiving real-time emergency blood alerts from nearby hospitals.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Registered Active Donor Profile</span>
          </div>
        </div>

        {/* Profile Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Donor Full Name:</label>
            <input
              type="text"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              className="w-full p-2 bg-slate-800 text-white rounded-xl font-bold focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Your Blood Group:</label>
            <select
              value={donorGroup}
              onChange={(e) => setDonorGroup(e.target.value as any)}
              className="w-full p-2 bg-slate-800 text-white rounded-xl font-bold focus:outline-none"
            >
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                <option key={group} value={group}>🩸 {group}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Location Node:</label>
            <div className="p-2 bg-slate-800/80 text-emerald-400 rounded-xl font-bold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{donorCity} (Available)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Requests Ticker */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Droplet className="w-6 h-6 text-rose-500 animate-pulse" />
          <span>Active Emergency Blood Requests ({pendingRequests.length})</span>
        </h2>

        {pendingRequests.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center text-slate-500 text-sm">
            🎉 No unfulfilled emergency blood requests at this moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingRequests.map(req => {
              const isCompatible = req.bloodGroup === donorGroup || donorGroup === 'O-';

              return (
                <div
                  key={req.id}
                  className={`bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between ${
                    isCompatible ? 'border-rose-400 dark:border-rose-800 ring-1 ring-rose-300' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-xl bg-rose-600 text-white font-black text-xs">
                        🚨 {req.bloodGroup} • {req.unitsRequired} Units Required
                      </span>
                      <span className="text-xs font-bold text-rose-600">{req.emergencyLevel}</span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                        {req.hospitalName}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span>Location: {req.location}</span> • <span>Distance: ~4.2 km</span>
                      </p>
                    </div>

                    {isCompatible && (
                      <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Compatible Match with your {donorGroup} Blood Type!</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleAccept(req.id)}
                      className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>[ACCEPT REQUEST]</span>
                    </button>

                    <button
                      onClick={() => handleDecline(req.id)}
                      className="py-2.5 px-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      [CANNOT DONATE]
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
