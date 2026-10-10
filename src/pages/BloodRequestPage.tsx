import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRealtimeData } from '../hooks/useRealtimeData';
import { bloodService } from '../services/bloodService';
import { Droplet, AlertTriangle, CheckCircle2, ArrowLeft, Send } from 'lucide-react';

export const BloodRequestPage: React.FC = () => {
  const { hospitals } = useRealtimeData();
  const navigate = useNavigate();

  const [bloodGroup, setBloodGroup] = useState<'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'>('B+');
  const [unitsRequired, setUnitsRequired] = useState<number>(2);
  const [hospitalId, setHospitalId] = useState<string>(hospitals[0]?.id || 'hosp-001');
  const [emergencyLevel, setEmergencyLevel] = useState<'CRITICAL' | 'URGENT' | 'STANDARD'>('CRITICAL');
  const [contactNumber, setContactNumber] = useState<string>('+1 (555) 019-2834');
  const [location, setLocation] = useState<string>('Trauma ICU Bed 004');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [createdReqId, setCreatedReqId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hosp = hospitals.find(h => h.id === hospitalId);

    const req = bloodService.createBloodRequest({
      bloodGroup,
      unitsRequired,
      hospitalId,
      hospitalName: hosp?.name || 'City Care Hospital',
      emergencyLevel,
      contactNumber,
      location
    });

    setCreatedReqId(req.id);
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      <Link to="/blood" className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to Blood Bank Directory
      </Link>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-100 dark:bg-rose-950 text-rose-600 rounded-2xl shrink-0">
            <Droplet className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Create Emergency Blood Request
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Broadcasts immediate emergency alert to hospital blood banks & registered compatible donors.
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-center space-y-4 animate-fade-in">
            <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Request Broadcasted Successfully</span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                🚨 Emergency Request #{createdReqId} Active
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                <strong>{unitsRequired} Units</strong> of <strong>{bloodGroup}</strong> requested for {location} at {hospitals.find(h => h.id === hospitalId)?.name}.
              </p>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <Link to="/donors" className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl">
                View Registered Donor Dashboard ➔
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            
            {/* Blood Group Selector */}
            <div>
              <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-2">
                1. Required Blood Group *
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const).map(group => (
                  <button
                    key={group}
                    type="button"
                    onClick={() => setBloodGroup(group)}
                    className={`py-2.5 rounded-xl font-extrabold text-sm transition-all ${
                      bloodGroup === group
                        ? 'bg-rose-600 text-white ring-2 ring-rose-400 shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>
            </div>

            {/* Units & Hospital */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                  2. Number of Units Required *
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={unitsRequired}
                  onChange={(e) => setUnitsRequired(Number(e.target.value))}
                  className="w-full p-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-sm focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                  3. Destination Hospital *
                </label>
                <select
                  value={hospitalId}
                  onChange={(e) => setHospitalId(e.target.value)}
                  className="w-full p-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-sm focus:outline-none"
                >
                  {hospitals.map(h => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Emergency Severity */}
            <div>
              <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                4. Patient Emergency Severity *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['CRITICAL', 'URGENT', 'STANDARD'] as const).map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setEmergencyLevel(level)}
                    className={`py-2.5 rounded-xl font-bold transition-all ${
                      emergencyLevel === level
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Location & Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                  5. Ward / Room Location *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. ICU Bed 004"
                  className="w-full p-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-medium focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                  6. Emergency Contact Phone *
                </label>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full p-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-medium focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 transition-transform transform active:scale-98"
            >
              <Send className="w-4 h-4" />
              <span>BROADCAST EMERGENCY BLOOD REQUEST NOW</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
