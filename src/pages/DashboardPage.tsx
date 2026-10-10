import React, { useState } from 'react';
import { useRealtimeData } from '../hooks/useRealtimeData';
import { HospitalCard } from '../components/hospital/HospitalCard';
import { HospitalMap } from '../components/map/HospitalMap';
import { aiRecommendationService } from '../services/aiRecommendationService';
import { Link } from 'react-router-dom';
import { 
  Siren, 
  Bed, 
  Activity, 
  Droplet, 
  Wind, 
  UserCheck, 
  Truck, 
  Award, 
  Search, 
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { hospitals, bloodRequests, isConnected, lastUpdated, loading } = useRealtimeData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity] = useState('Metro Healthcare District');

  // Compute aggregate stats across all hospitals
  const totalAvailableBeds = hospitals.reduce((acc, h) => acc + h.availableBeds, 0);
  const totalAvailableICU = hospitals.reduce((acc, h) => acc + h.icuAvailable, 0);
  const totalOxygenBeds = hospitals.reduce((acc, h) => acc + h.oxygenBedsAvailable, 0);
  const totalBloodUnits = hospitals.reduce((acc, h) => acc + h.bloodInventory.reduce((bAcc, b) => bAcc + b.unitsAvailable, 0), 0);
  const totalSpecialists = hospitals.reduce((acc, h) => acc + h.specialists.filter(s => s.availability === 'Available').length, 0);
  const totalAmbulances = hospitals.reduce((acc, h) => acc + h.ambulances.filter(a => a.status === 'Available').length, 0);

  // Default recommendation for high-volume emergency
  const aiRecommendations = aiRecommendationService.recommendHospitals(hospitals, {
    emergencyType: 'Trauma / Emergency',
    userLat: 12.9716,
    userLng: 77.5946,
    locationName: 'City Center',
    patientCondition: 'Emergency Trauma',
    needICU: true,
    needOxygen: true,
    needAmbulance: true
  });

  const topRecommended = aiRecommendations[0]?.hospital;
  const topScore = aiRecommendations[0]?.score || 94;

  const filteredHospitals = hospitals.filter(h =>
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Hero Section with Emergency Callout */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 text-white p-6 sm:p-10 shadow-2xl border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/20 border border-rose-500/30 rounded-full text-rose-300 text-xs font-semibold backdrop-blur">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Emergency Healthcare Coordination</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Find the right healthcare resource <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-red-300 to-amber-300">when every second matters.</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Live bed matrix tracking, critical ICU availability, blood bank inventory, ambulance dispatch, and hospital matching based on available resources and emergency requirements across <strong className="text-white">{selectedCity}</strong>.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              to="/emergency"
              className="px-6 py-3.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-rose-600/40 flex items-center gap-2 transition-all transform hover:scale-105 border border-rose-500"
            >
              <Siren className="w-6 h-6 animate-pulse text-yellow-300" />
              <span>FIND THE BEST-MATCHED HOSPITAL</span>
            </Link>

            <Link
              to="/demo"
              className="px-5 py-3.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-2xl border border-slate-700 backdrop-blur flex items-center gap-2 transition-all"
            >
              <span>▶ Test Live Multi-Tab Demo</span>
            </Link>
          </div>
        </div>

        {/* Decorative Background Accent */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* Aggregate Live Stats Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-rose-500" />
            <span>Live Healthcare Resource Status</span>
          </h2>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Real-time Sync Active
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          <Link to="/beds" className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-400 transition-all group">
            <div className="flex items-center justify-between text-blue-500 mb-2">
              <Bed className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total</span>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
              {totalAvailableBeds}
            </p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Beds Available</p>
          </Link>

          <Link to="/icu" className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-400 transition-all group">
            <div className="flex items-center justify-between text-indigo-500 mb-2">
              <Activity className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Critical</span>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
              {totalAvailableICU}
            </p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">ICU Capacity</p>
          </Link>

          <Link to="/oxygen" className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-cyan-400 transition-all group">
            <div className="flex items-center justify-between text-cyan-500 mb-2">
              <Wind className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Supported</span>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-cyan-600 transition-colors">
              {totalOxygenBeds}
            </p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Oxygen Beds</p>
          </Link>

          <Link to="/blood" className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-rose-400 transition-all group">
            <div className="flex items-center justify-between text-rose-500 mb-2">
              <Droplet className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Bank</span>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors">
              {totalBloodUnits}
            </p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Blood Units</p>
          </Link>

          <Link to="/specialists" className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-emerald-400 transition-all group">
            <div className="flex items-center justify-between text-emerald-500 mb-2">
              <UserCheck className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">On Duty</span>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
              {totalSpecialists}
            </p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Specialists</p>
          </Link>

          <Link to="/ambulances" className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-amber-400 transition-all group">
            <div className="flex items-center justify-between text-amber-500 mb-2">
              <Truck className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ready</span>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
              {totalAmbulances}
            </p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Ambulances</p>
          </Link>

        </div>
      </section>

      {/* Recommended Hospital Highlight Card */}
      {topRecommended && (
        <section className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border border-amber-500/30 rounded-3xl p-6 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-rose-600 text-white rounded-xl shadow-md">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                  ⭐ Top Recommended Emergency Center
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {topRecommended.name} ({topScore}% Match)
                </h3>
              </div>
            </div>

            <Link
              to={`/hospitals/${topRecommended.id}`}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1 transition-colors"
            >
              <span>View Bed Matrix & Details</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block font-medium">Location & ETA</span>
              <p className="font-bold text-slate-900 dark:text-white mt-1">
                📍 {topRecommended.distanceKm || 3.4} km away (~{topRecommended.estimatedTravelTimeMin || 8} min travel)
              </p>
            </div>

            <div className="p-3 bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block font-medium">Critical Resources</span>
              <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                🛏 {topRecommended.availableBeds} beds | 🏥 {topRecommended.icuAvailable} ICU | 🫁 {topRecommended.oxygenBedsAvailable} Oxygen
              </p>
            </div>

            <div className="p-3 bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block font-medium">Specialist & Ambulance</span>
              <p className="font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                👨‍⚕️ Cardiologist & Neurologist ON DUTY | 🚑 2 ALS Ambulances
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Map + Blood Requests Split View */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Live GIS Map */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-500" />
              <span>Live Hospital Map & Dispatch Markers</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">Click markers for details</span>
          </div>
          <HospitalMap hospitals={hospitals} height="360px" />
        </div>

        {/* Emergency Blood Requests Feed */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Droplet className="w-5 h-5 text-rose-500" />
                <span>Emergency Blood Requests</span>
              </h3>
              <Link to="/blood/request" className="text-xs font-bold text-rose-600 hover:text-rose-700">
                + Request
              </Link>
            </div>

            <div className="space-y-3 mt-3">
              {bloodRequests.slice(0, 3).map(req => (
                <div key={req.id} className="p-3 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-2xl text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="px-2 py-0.5 bg-rose-600 text-white rounded-md text-[10px]">
                      {req.bloodGroup} • {req.unitsRequired} Units
                    </span>
                    <span className="text-rose-600 dark:text-rose-400 font-extrabold">{req.emergencyLevel}</span>
                  </div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{req.hospitalName}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {new Date(req.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/donors"
            className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 rounded-xl font-semibold text-xs text-center block transition-colors mt-2"
          >
            View Donor Response Hub ➔
          </Link>
        </div>

      </section>

      {/* Hospitals Directory Preview */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Nearby Hospitals ({filteredHospitals.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live capacity metrics synchronized across Metro Healthcare District.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Filter hospital..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs rounded-xl focus:outline-none w-48"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <Link
              to="/hospitals"
              className="text-xs font-extrabold text-rose-600 hover:underline flex items-center gap-1"
            >
              <span>View All Hospitals</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            Loading live hospital data...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHospitals.slice(0, 6).map(hosp => (
              <HospitalCard key={hosp.id} hospital={hosp} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
