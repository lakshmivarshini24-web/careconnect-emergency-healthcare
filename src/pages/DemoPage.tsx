import React, { useState, useEffect } from 'react';
import { useRealtimeData } from '../hooks/useRealtimeData';
import { dataService } from '../services/dataService';
import { realtimeService } from '../services/realtimeService';
import { 
  PlayCircle, 
  UserPlus, 
  UserMinus, 
  Droplet, 
  Activity, 
  Truck, 
  UserCheck, 
  RotateCcw,
  Terminal,
  ExternalLink,
  Layers
} from 'lucide-react';

export const DemoPage: React.FC = () => {
  const { hospitals } = useRealtimeData();
  const [targetHospitalId, setTargetHospitalId] = useState<string>(hospitals[0]?.id || 'hosp-001');
  const [logs, setLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] Live Realtime Event Bus Initialized.`,
    `[${new Date().toLocaleTimeString()}] Connected to BroadcastChannel 'careconnect_realtime_channel'.`
  ]);

  const targetHospital = hospitals.find(h => h.id === targetHospitalId) || hospitals[0];

  useEffect(() => {
    const unsub = realtimeService.subscribe('NOTIFICATION', (notif) => {
      if (notif) {
        setLogs(prev => [`[${new Date(notif.timestamp).toLocaleTimeString()}] BROADCAST: ${notif.message}`, ...prev.slice(0, 15)]);
      }
    });
    return () => unsub();
  }, []);

  const handleSimulateAdmission = async () => {
    if (targetHospital) {
      const res = await dataService.simulateAdmission(targetHospital.id);
      if (res) {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] SIMULATION: Bed ${res.bed.id} marked OCCUPIED at ${res.hospitalName}`, ...prev]);
      }
    }
  };

  const handleSimulateDischarge = async () => {
    if (targetHospital) {
      const res = await dataService.simulateDischarge(targetHospital.id);
      if (res) {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] SIMULATION: Bed ${res.bed.id} marked AVAILABLE at ${res.hospitalName}`, ...prev]);
      }
    }
  };

  const handleSimulateBlood = () => {
    if (targetHospital) {
      const bItem = targetHospital.bloodInventory.find(b => b.bloodGroup === 'B+');
      const current = bItem?.unitsAvailable || 8;
      const next = current > 1 ? current - 1 : 10;
      dataService.updateBloodStock(targetHospital.id, 'B+', next);
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] SIMULATION: B+ blood stock changed to ${next} units at ${targetHospital.name}`, ...prev]);
    }
  };

  const handleSimulateICU = () => {
    if (targetHospital) {
      const delta = targetHospital.icuAvailable > 1 ? -1 : 3;
      dataService.updateICUCapacity(targetHospital.id, delta);
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] SIMULATION: ICU capacity adjusted by ${delta} beds at ${targetHospital.name}`, ...prev]);
    }
  };

  const handleSimulateAmbulance = () => {
    if (targetHospital && targetHospital.ambulances.length > 0) {
      const amb = targetHospital.ambulances[0];
      const newStatus = amb.status === 'Available' ? 'Assigned' : 'Available';
      dataService.getAmbulances().then(() => {
        realtimeService.updateAmbulanceStatus(amb.id, newStatus);
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] SIMULATION: Ambulance ${amb.id} status changed to ${newStatus}`, ...prev]);
      });
    }
  };

  const handleSimulateDoctor = () => {
    if (targetHospital && targetHospital.specialists.length > 0) {
      const doc = targetHospital.specialists[0];
      const newAvail = doc.availability === 'Available' ? 'In Surgery' : 'Available';
      dataService.updateSpecialistAvailability(doc.id, newAvail);
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] SIMULATION: ${doc.specialization} ${doc.doctorName} changed to ${newAvail}`, ...prev]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Hero Control Room Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 border border-emerald-900/60">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-600 rounded-2xl">
              <PlayCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">
                Hackathon Live Presentation & Multi-Tab Synchronization Center
              </span>
              <h1 className="text-2xl font-black">Live Data Simulation Control Room</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300 font-bold">Target Hospital:</span>
            <select
              value={targetHospitalId}
              onChange={(e) => setTargetHospitalId(e.target.value)}
              className="bg-slate-800 text-white font-black text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none cursor-pointer"
            >
              {hospitals.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
          This panel allows judges and evaluators to trigger real-time hospital resource changes and observe instant zero-latency updates across multiple browser windows without refreshing the page.
        </p>
      </div>

      {/* Multi-tab Testing Instructions Guide */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-500" />
          <span>Step-by-Step Multi-Tab Real-Time Sync Test Instructions</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-1">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-[11px] font-black inline-flex items-center justify-center mb-1">1</span>
            <h4 className="font-extrabold text-slate-900 dark:text-white">Open Tab A</h4>
            <p className="text-slate-500">Keep Patient Dashboard (or /beds) open in Tab A.</p>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-1">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-[11px] font-black inline-flex items-center justify-center mb-1">2</span>
            <h4 className="font-extrabold text-slate-900 dark:text-white">Open Tab B</h4>
            <p className="text-slate-500">Open this Demo Control Room (or /hospital-admin) in Tab B.</p>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-1">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-[11px] font-black inline-flex items-center justify-center mb-1">3</span>
            <h4 className="font-extrabold text-slate-900 dark:text-white">Click Simulation</h4>
            <p className="text-slate-500">Click any simulation button below (e.g. Admission or Discharge).</p>
          </div>

          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl space-y-1 border border-emerald-200">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[11px] font-black inline-flex items-center justify-center mb-1">4</span>
            <h4 className="font-extrabold text-emerald-800 dark:text-emerald-300">Watch Live Sync</h4>
            <p className="text-emerald-700 dark:text-emerald-400 font-semibold">Tab A instantly reflects the bed change with toast notification!</p>
          </div>
        </div>
      </div>

      {/* Simulation Action Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        <button
          onClick={handleSimulateAdmission}
          className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 rounded-3xl shadow-sm text-left space-y-2 group transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-emerald-600">
            <UserPlus className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-100 rounded-full">Bed Engine</span>
          </div>
          <h3 className="font-black text-base text-slate-900 dark:text-white group-hover:text-emerald-600">
            ▶ Simulate Patient Admission
          </h3>
          <p className="text-xs text-slate-500">
            Fills an available bed at <strong>{targetHospital?.name}</strong>, reduces available bed count, and broadcasts toast alert.
          </p>
        </button>

        <button
          onClick={handleSimulateDischarge}
          className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 rounded-3xl shadow-sm text-left space-y-2 group transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-blue-600">
            <UserMinus className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-blue-100 rounded-full">Bed Engine</span>
          </div>
          <h3 className="font-black text-base text-slate-900 dark:text-white group-hover:text-blue-600">
            ▶ Simulate Patient Discharge
          </h3>
          <p className="text-xs text-slate-500">
            Frees an occupied bed at <strong>{targetHospital?.name}</strong>, increases available bed count, and updates matrix.
          </p>
        </button>

        <button
          onClick={handleSimulateBlood}
          className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500 rounded-3xl shadow-sm text-left space-y-2 group transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-rose-600">
            <Droplet className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-rose-100 rounded-full">Blood Bank</span>
          </div>
          <h3 className="font-black text-base text-slate-900 dark:text-white group-hover:text-rose-600">
            ▶ Simulate Blood Stock Change
          </h3>
          <p className="text-xs text-slate-500">
            Modifies B+ blood units in inventory and notifies active patient / donor components.
          </p>
        </button>

        <button
          onClick={handleSimulateICU}
          className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-3xl shadow-sm text-left space-y-2 group transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-indigo-600">
            <Activity className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-indigo-100 rounded-full">Critical Care</span>
          </div>
          <h3 className="font-black text-base text-slate-900 dark:text-white group-hover:text-indigo-600">
            ▶ Simulate ICU Occupancy
          </h3>
          <p className="text-xs text-slate-500">
            Toggles ICU open capacity and recalculates critical care ranking scores.
          </p>
        </button>

        <button
          onClick={handleSimulateAmbulance}
          className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 rounded-3xl shadow-sm text-left space-y-2 group transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-amber-600">
            <Truck className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-amber-100 rounded-full">Ambulance Fleet</span>
          </div>
          <h3 className="font-black text-base text-slate-900 dark:text-white group-hover:text-amber-600">
            ▶ Simulate Ambulance Assignment
          </h3>
          <p className="text-xs text-slate-500">
            Changes ambulance status from Available ➔ Assigned and recalculates ready fleet count.
          </p>
        </button>

        <button
          onClick={handleSimulateDoctor}
          className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 rounded-3xl shadow-sm text-left space-y-2 group transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-purple-600">
            <UserCheck className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-purple-100 rounded-full">Medical Staff</span>
          </div>
          <h3 className="font-black text-base text-slate-900 dark:text-white group-hover:text-purple-600">
            ▶ Simulate Specialist Duty Status
          </h3>
          <p className="text-xs text-slate-500">
            Toggles doctor availability (Available ➔ In Surgery) and updates emergency matcher weights.
          </p>
        </button>

      </div>

      {/* Live Event Terminal Monitor */}
      <div className="bg-slate-950 text-emerald-400 font-mono text-xs rounded-3xl p-6 shadow-2xl space-y-3 border border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-slate-400">
          <span className="flex items-center gap-2 font-bold text-white">
            <Terminal className="w-4 h-4 text-emerald-400" /> Realtime PubSub Event Stream Log
          </span>
          <button
            onClick={() => dataService.resetData()}
            className="text-[11px] hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset All Data
          </button>
        </div>

        <div className="space-y-1.5 max-h-60 overflow-y-auto font-mono text-[11px] leading-relaxed">
          {logs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-slate-600 select-none">&gt;</span>
              <span className={log.includes('SIMULATION') ? 'text-amber-300 font-bold' : (log.includes('BROADCAST') ? 'text-emerald-300 font-bold' : 'text-slate-400')}>
                {log}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
