import React, { useState } from 'react';
import { useRealtimeData } from '../hooks/useRealtimeData';
import { bedService } from '../services/bedService';
import { dataService } from '../services/dataService';
import { BedMatrix } from '../components/hospital/BedMatrix';
import { Bed, Hospital } from '../types';
import { 
  ShieldCheck, 
  Bed as BedIcon, 
  Activity, 
  Wind, 
  Droplet, 
  UserCheck, 
  Truck, 
  PlayCircle, 
  UserPlus, 
  UserMinus,
  Save,
  RotateCcw
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { hospitals } = useRealtimeData();
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>(hospitals[0]?.id || 'hosp-001');

  const selectedHospital = hospitals.find(h => h.id === selectedHospitalId) || hospitals[0];
  const beds = selectedHospital ? bedService.getBedsByHospital(selectedHospital.id) : [];

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 rounded-2xl">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                Hospital Staff Command Portal
              </span>
              <h1 className="text-2xl font-black">Hospital Resource Management</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-300 font-bold">Managing Hospital:</label>
            <select
              value={selectedHospitalId}
              onChange={(e) => setSelectedHospitalId(e.target.value)}
              className="bg-slate-800 text-white font-extrabold text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none cursor-pointer"
            >
              {hospitals.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Simulation Action Buttons */}
        {selectedHospital && (
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3 text-xs">
            <span className="text-slate-400 font-extrabold uppercase tracking-wider">Hackathon Demo Controls:</span>
            
            <button
              onClick={handleSimulateAdmission}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>▶ Simulate Emergency Admission (Occupies Bed)</span>
            </button>

            <button
              onClick={handleSimulateDischarge}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-md flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            >
              <UserMinus className="w-4 h-4" />
              <span>▶ Simulate Patient Discharge (Frees Bed)</span>
            </button>

            <button
              onClick={() => dataService.resetData()}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl flex items-center gap-1 ml-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Baseline
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
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-500" />
                <span>ICU Capacity Controls</span>
              </h3>
              <p className="text-slate-400 text-[11px]">Current Available ICU Beds: <strong className="text-indigo-600 font-black text-base">{selectedHospital.icuAvailable} / {selectedHospital.icuTotal}</strong></p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleICUChange(1)}
                  className="flex-1 py-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-black rounded-xl"
                >
                  + Free 1 ICU Bed
                </button>
                <button
                  onClick={() => handleICUChange(-1)}
                  className="flex-1 py-2 bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-black rounded-xl"
                >
                  - Occupy 1 ICU Bed
                </button>
              </div>
            </div>

            {/* Blood Controls */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Droplet className="w-4 h-4 text-rose-500" />
                <span>B+ Blood Inventory Quick Update</span>
              </h3>
              {(() => {
                const bItem = selectedHospital.bloodInventory.find(b => b.bloodGroup === 'B+');
                const units = bItem?.unitsAvailable || 0;
                return (
                  <>
                    <p className="text-slate-400 text-[11px]">B+ Available: <strong className="text-rose-600 font-black text-base">{units} Units</strong></p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleBloodStockChange('B+', units, 1)}
                        className="flex-1 py-2 bg-emerald-100 text-emerald-800 font-black rounded-xl"
                      >
                        + Add 1 Unit
                      </button>
                      <button
                        onClick={() => handleBloodStockChange('B+', units, -1)}
                        className="flex-1 py-2 bg-rose-100 text-rose-800 font-black rounded-xl"
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
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-500" />
                <span>Cardiologist Status</span>
              </h3>
              {(() => {
                const spec = selectedHospital.specialists.find(s => s.specialization === 'Cardiologist');
                if (!spec) return <p className="text-slate-400">No cardiologist listed</p>;
                return (
                  <>
                    <p className="text-slate-400 text-[11px]">{spec.doctorName}: <strong className="text-slate-800 dark:text-slate-200">{spec.availability}</strong></p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => dataService.updateSpecialistAvailability(spec.id, 'Available')}
                        className="flex-1 py-2 bg-emerald-600 text-white font-bold rounded-xl"
                      >
                        Mark Available
                      </button>
                      <button
                        onClick={() => dataService.updateSpecialistAvailability(spec.id, 'In Surgery')}
                        className="flex-1 py-2 bg-amber-600 text-white font-bold rounded-xl"
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
          <div className="space-y-2">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <BedIcon className="w-5 h-5 text-blue-500" />
              <span>Staff Interactive Bed Status Controller (100 Beds)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Select status dropdown on any bed to update real-time patient status. All changes publish immediately to the patient dashboard.
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
