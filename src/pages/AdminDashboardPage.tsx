import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRealtimeData } from '../hooks/useRealtimeData';
import { bedService } from '../services/bedService';
import { dataService } from '../services/dataService';
import { authService } from '../services/authService';
import { BedMatrix } from '../components/hospital/BedMatrix';
import { Bed, AuthSession } from '../types';
import { 
  ShieldCheck, 
  Bed as BedIcon, 
  Activity, 
  Droplet, 
  UserCheck, 
  UserPlus, 
  UserMinus,
  RotateCcw,
  LogOut,
  Sparkles,
  Layers,
  Database
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<AuthSession | null>(() => authService.getSession());

  // Route protection guard
  useEffect(() => {
    const currentSession = authService.getSession();
    if (!currentSession) {
      navigate('/hospital-admin/login', { replace: true });
      return;
    }
    setSession(currentSession);

    const unsub = authService.subscribe((updatedSession) => {
      setSession(updatedSession);
      if (!updatedSession) {
        navigate('/hospital-admin/login', { replace: true });
      }
    });
    return () => unsub();
  }, [navigate]);

  const { hospitals } = useRealtimeData();
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>(hospitals[0]?.id || 'hosp-001');

  const selectedHospital = hospitals.find(h => h.id === selectedHospitalId) || hospitals[0];
  const beds = selectedHospital ? bedService.getBedsByHospital(selectedHospital.id) : [];

  const handleLogout = () => {
    authService.logout();
    navigate('/hospitals');
  };

  // Controls
  const handleBedStatusChange = (bedId: string, newStatus: Bed['status']) => {
    if (selectedHospital) {
      dataService.updateBedStatus(selectedHospital.id, bedId, newStatus);
    }
  };

  const handleSimulateAdmission = async () => {
    if (selectedHospital) {
      const res = await dataService.simulateAdmission(selectedHospital.id);
      if (!res) {
        alert('No available beds to simulate admission in this hospital.');
      }
    }
  };

  const handleSimulateDischarge = async () => {
    if (selectedHospital) {
      const res = await dataService.simulateDischarge(selectedHospital.id);
      if (!res) {
        alert('No occupied beds to simulate discharge in this hospital.');
      }
    }
  };

  const handleICUChange = (delta: number) => {
    if (selectedHospital) {
      dataService.updateICUCapacity(selectedHospital.id, delta);
    }
  };

  const handleBloodStockChange = (group: string, current: number, delta: number) => {
    if (selectedHospital) {
      dataService.updateBloodStock(selectedHospital.id, group, current + delta);
    }
  };

  const handleResetBaseline = () => {
    if (session?.isJudgeDemo) {
      dataService.resetDemoData();
    } else {
      dataService.resetData();
    }
  };

  if (!session) {
    return null;
  }

  const isDemo = session.isJudgeDemo;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Prominent Demo Mode Banner */}
      {isDemo && (
        <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-500/20 dark:from-amber-950/60 dark:via-orange-950/40 dark:to-amber-950/60 border-2 border-amber-500/50 text-amber-950 dark:text-amber-100 px-5 py-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs shadow-md">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚖️</span>
            <div>
              <p className="font-extrabold text-sm text-amber-900 dark:text-amber-200">
                Demo Environment — All changes use simulated data.
              </p>
              <p className="text-[11px] text-amber-800 dark:text-amber-300/80">
                Operating in isolated demo namespace. Real hospital records and live production resources are protected.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-black uppercase tracking-wider bg-amber-500 text-white px-2.5 py-1 rounded-lg shadow-sm">
              Judge Demo Active
            </span>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl shadow-sm transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer text-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Demo / Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Command Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-5 border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-md">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  CareConnect Command Portal
                </span>
                {isDemo && (
                  <span className="text-[10px] bg-indigo-900/80 text-indigo-300 font-black px-2 py-0.5 rounded-md border border-indigo-700">
                    DEMO MODE
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black">Hospital Resource Management</h1>
            </div>
          </div>

          {/* Session Identification & Exit Button */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl px-4 py-2 text-xs flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-extrabold">Active Session</p>
                <p className="font-extrabold text-white">
                  {isDemo ? '⚖️ JUDGE DEMO MODE' : 'Staff Authenticated'}
                  {session.email && <span className="font-normal text-slate-300 ml-1.5">({session.email})</span>}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs rounded-2xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>{isDemo ? 'Exit Demo' : 'Sign Out'}</span>
            </button>
          </div>
        </div>

        {/* Hospital Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-300 font-bold">Managing Hospital:</label>
            <select
              value={selectedHospitalId}
              onChange={(e) => setSelectedHospitalId(e.target.value)}
              className="bg-slate-800 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl border border-slate-700 focus:outline-none cursor-pointer"
            >
              {hospitals.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>

          {isDemo && (
            <div className="text-[11px] text-indigo-300/80 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              <span>Simulated Data Store: <strong className="text-indigo-200">careconnect_demo_namespace</strong></span>
            </div>
          )}
        </div>

        {/* Quick Simulation Action Buttons */}
        {selectedHospital && (
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-2 mr-1">
              <span className="text-slate-400 font-extrabold uppercase tracking-wider">
                {isDemo ? 'Judge Demo Controls' : 'Live Controls'}:
              </span>
              {isDemo && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-extrabold border border-amber-500/30">
                  Demo Data
                </span>
              )}
            </div>
            
            <button
              onClick={handleSimulateAdmission}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>▶ Simulate Emergency Admission (Occupies Bed)</span>
            </button>

            <button
              onClick={handleSimulateDischarge}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-md flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            >
              <UserMinus className="w-4 h-4" />
              <span>▶ Simulate Patient Discharge (Frees Bed)</span>
            </button>

            <button
              onClick={handleResetBaseline}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl flex items-center gap-1.5 ml-auto border border-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Baseline {isDemo ? '(Demo Store)' : ''}</span>
            </button>
          </div>
        )}
      </div>

      {selectedHospital && (
        <div className="space-y-6">
          
          {/* Resource Update Controls Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            
            {/* ICU Controls */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-500" />
                  <span>ICU Capacity Controls</span>
                </h3>
                {isDemo && (
                  <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                    Demo Data
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-[11px]">Current Available ICU Beds: <strong className="text-indigo-600 dark:text-indigo-400 font-black text-base">{selectedHospital.icuAvailable} / {selectedHospital.icuTotal}</strong></p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleICUChange(1)}
                  className="flex-1 py-2.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-black rounded-xl hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-colors cursor-pointer"
                >
                  + Free 1 ICU Bed
                </button>
                <button
                  onClick={() => handleICUChange(-1)}
                  className="flex-1 py-2.5 bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-black rounded-xl hover:bg-rose-200 dark:hover:bg-rose-900 transition-colors cursor-pointer"
                >
                  - Occupy 1 ICU Bed
                </button>
              </div>
            </div>

            {/* Blood Controls */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-rose-500" />
                  <span>B+ Blood Inventory</span>
                </h3>
                {isDemo && (
                  <span className="text-[10px] bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900">
                    Demo Data
                  </span>
                )}
              </div>
              {(() => {
                const bItem = selectedHospital.bloodInventory.find(b => b.bloodGroup === 'B+');
                const units = bItem?.unitsAvailable || 0;
                return (
                  <>
                    <p className="text-slate-400 text-[11px]">B+ Available: <strong className="text-rose-600 dark:text-rose-400 font-black text-base">{units} Units</strong></p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleBloodStockChange('B+', units, 1)}
                        className="flex-1 py-2.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-black rounded-xl hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-colors cursor-pointer"
                      >
                        + Add 1 Unit
                      </button>
                      <button
                        onClick={() => handleBloodStockChange('B+', units, -1)}
                        className="flex-1 py-2.5 bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-black rounded-xl hover:bg-rose-200 dark:hover:bg-rose-900 transition-colors cursor-pointer"
                      >
                        - Use 1 Unit
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Specialist Duty Controls */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-500" />
                  <span>Cardiologist Status</span>
                </h3>
                {isDemo && (
                  <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    Demo Data
                  </span>
                )}
              </div>
              {(() => {
                const spec = selectedHospital.specialists.find(s => s.specialization === 'Cardiologist');
                if (!spec) return <p className="text-slate-400">No cardiologist listed</p>;
                return (
                  <>
                    <p className="text-slate-400 text-[11px]">{spec.doctorName}: <strong className="text-slate-800 dark:text-slate-200">{spec.availability}</strong></p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => dataService.updateSpecialistAvailability(spec.id, 'Available')}
                        className="flex-1 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer"
                      >
                        Mark Available
                      </button>
                      <button
                        onClick={() => dataService.updateSpecialistAvailability(spec.id, 'In Surgery')}
                        className="flex-1 py-2.5 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition-colors cursor-pointer"
                      >
                        Mark In Surgery
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>

          </div>

          {/* Interactive Bed Matrix Management Grid */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <BedIcon className="w-5 h-5 text-blue-500" />
                <span>Interactive Bed Status Controller (100 Beds)</span>
              </h2>
              {isDemo && (
                <span className="text-xs bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Demo Data — Simulated Ward Grid</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Select status dropdown on any bed to update simulated patient status. Changes broadcast to the demo bus and are reflected on public bed matrix views.
            </p>
            <BedMatrix
              beds={beds}
              hospitalName={selectedHospital.name}
              totalBeds={selectedHospital.totalBeds}
              availableBeds={selectedHospital.availableBeds}
              occupiedBeds={selectedHospital.occupiedBeds}
              isAdmin={true}
              onStatusChange={handleBedStatusChange}
            />
          </div>

        </div>
      )}

    </div>
  );
};
