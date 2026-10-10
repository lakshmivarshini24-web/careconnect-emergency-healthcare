import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRealtimeData } from '../hooks/useRealtimeData';
import { BedMatrix } from '../components/hospital/BedMatrix';
import { HospitalMap } from '../components/map/HospitalMap';
import { dataService } from '../services/dataService';
import { Bed, Hospital } from '../types';
import { 
  Building2, 
  MapPin, 
  PhoneCall, 
  Navigation, 
  Bed as BedIcon, 
  Activity, 
  Wind, 
  Droplet, 
  UserCheck, 
  Truck, 
  ShieldCheck,
  Clock
} from 'lucide-react';

export const HospitalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { hospitals } = useRealtimeData();
  const [hospital, setHospital] = useState<Hospital | undefined>();
  const [beds, setBeds] = useState<Bed[]>([]);
  const [activeTab, setActiveTab] = useState<'beds' | 'icu' | 'blood' | 'specialists' | 'ambulances'>('beds');

  useEffect(() => {
    if (id) {
      const h = hospitals.find(item => item.id === id);
      setHospital(h);
      dataService.getBeds(id).then(setBeds);
    }
  }, [id, hospitals]);

  if (!hospital) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-slate-500 text-sm">Hospital record not found or loading...</p>
        <Link to="/hospitals" className="px-4 py-2 bg-rose-600 text-white rounded-xl font-bold text-xs">
          ← Back to Hospital Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Info */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                {hospital.name}
              </h1>
              <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {hospital.emergencyStatus}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>{hospital.address}</span> • <span className="font-semibold text-slate-700 dark:text-slate-300">📍 {hospital.distanceKm || 3.2} km away</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${hospital.phone}`}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Hospital: {hospital.phone}</span>
            </a>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Navigation className="w-4 h-4 text-blue-500" />
              <span>Get Directions</span>
            </a>
          </div>
        </div>

        {/* Quick Resource Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block font-medium flex items-center gap-1"><BedIcon className="w-3.5 h-3.5 text-blue-500" /> Total Beds</span>
            <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{hospital.availableBeds} / {hospital.totalBeds}</p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block font-medium flex items-center gap-1"><Activity className="w-3.5 h-3.5 text-indigo-500" /> ICU Open</span>
            <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-0.5">{hospital.icuAvailable} / {hospital.icuTotal}</p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block font-medium flex items-center gap-1"><Wind className="w-3.5 h-3.5 text-cyan-500" /> Oxygen Beds</span>
            <p className="text-lg font-black text-cyan-600 dark:text-cyan-400 mt-0.5">{hospital.oxygenBedsAvailable} / {hospital.oxygenBedsTotal}</p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block font-medium flex items-center gap-1"><Droplet className="w-3.5 h-3.5 text-rose-500" /> B+ Blood</span>
            <p className="text-lg font-black text-rose-600 dark:text-rose-400 mt-0.5">{hospital.bloodInventory.find(b => b.bloodGroup === 'B+')?.unitsAvailable || 0} units</p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block font-medium flex items-center gap-1"><UserCheck className="w-3.5 h-3.5 text-emerald-500" /> Specialists</span>
            <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{hospital.specialists.length} Doctors</p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block font-medium flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-amber-500" /> Ambulances</span>
            <p className="text-lg font-black text-amber-600 dark:text-amber-400 mt-0.5">{hospital.ambulances.length} Units</p>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 text-xs overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('beds')}
          className={`px-4 py-2 font-bold rounded-t-xl transition-colors shrink-0 ${
            activeTab === 'beds'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          🛏 Complete Bed Matrix ({hospital.totalBeds} Beds)
        </button>

        <button
          onClick={() => setActiveTab('icu')}
          className={`px-4 py-2 font-bold rounded-t-xl transition-colors shrink-0 ${
            activeTab === 'icu'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          🏥 ICU & Ventilators ({hospital.icuAvailable} Open)
        </button>

        <button
          onClick={() => setActiveTab('blood')}
          className={`px-4 py-2 font-bold rounded-t-xl transition-colors shrink-0 ${
            activeTab === 'blood'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          🩸 Blood Bank Stock
        </button>

        <button
          onClick={() => setActiveTab('specialists')}
          className={`px-4 py-2 font-bold rounded-t-xl transition-colors shrink-0 ${
            activeTab === 'specialists'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          👨‍⚕️ Doctors on Duty
        </button>

        <button
          onClick={() => setActiveTab('ambulances')}
          className={`px-4 py-2 font-bold rounded-t-xl transition-colors shrink-0 ${
            activeTab === 'ambulances'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          🚑 Ambulance Fleet
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'beds' && (
        <BedMatrix
          beds={beds}
          hospitalName={hospital.name}
          totalBeds={hospital.totalBeds}
          availableBeds={hospital.availableBeds}
          occupiedBeds={hospital.occupiedBeds}
        />
      )}

      {activeTab === 'icu' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
            ICU & Critical Care Equipment
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <span className="text-slate-400 font-medium">ICU Beds Available</span>
              <p className="text-2xl font-black text-indigo-600 mt-1">{hospital.icuAvailable} / {hospital.icuTotal}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <span className="text-slate-400 font-medium">Ventilators Ready</span>
              <p className="text-2xl font-black text-cyan-600 mt-1">{hospital.ventilatorsAvailable} / {hospital.ventilatorsTotal}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <span className="text-slate-400 font-medium">Oxygen Cylinders</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">{hospital.oxygenCylinders} Cylinders</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'blood' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
            Blood Bank Inventory Breakdown
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {hospital.bloodInventory.map(b => (
              <div key={b.bloodGroup} className="p-4 bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-2xl text-xs space-y-1">
                <span className="font-black text-base text-rose-600 dark:text-rose-400 block">{b.bloodGroup}</span>
                <p className="font-extrabold text-slate-900 dark:text-white text-sm">{b.unitsAvailable} Units</p>
                <span className="text-[10px] text-slate-400 block">Updated {new Date(b.lastUpdated).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'specialists' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
            Medical Specialist Roster
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {hospital.specialists.map(s => (
              <div key={s.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white text-sm block">{s.doctorName}</span>
                <p className="text-slate-500 dark:text-slate-400 font-semibold">{s.specialization}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    s.availability === 'Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {s.availability}
                  </span>
                  <span className="text-slate-400 text-[10px]">Duty: Emergency</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'ambulances' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
            Ambulance Fleet Status
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {hospital.ambulances.map(a => (
              <div key={a.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-900 dark:text-white text-sm">{a.id} • {a.type}</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] ${
                    a.status === 'Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {a.status}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">Driver: <strong>{a.driverName}</strong> ({a.driverPhone})</p>
                <p className="text-slate-400 text-[11px]">Stationed: {a.currentAddress}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Map View */}
      <div className="space-y-2">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
          Hospital GPS Location
        </h3>
        <HospitalMap hospitals={[hospital]} selectedHospitalId={hospital.id} height="280px" />
      </div>

    </div>
  );
};
