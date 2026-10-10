import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useRealtimeData } from '../hooks/useRealtimeData';
import { HospitalCard } from '../components/hospital/HospitalCard';
import { HospitalMap } from '../components/map/HospitalMap';
import { Search, Filter, Building2, MapPin } from 'lucide-react';

export const HospitalsPage: React.FC = () => {
  const { hospitals, loading } = useRealtimeData();
  const location = useLocation();

  const [search, setSearch] = useState('');
  const [filterEmergency, setFilterEmergency] = useState<string>('All');
  const [filterMinBeds, setFilterMinBeds] = useState<number>(0);
  const [filterMinICU, setFilterMinICU] = useState<number>(0);
  const [filterBlood, setFilterBlood] = useState<string>('All');
  const [filterSpecialist, setFilterSpecialist] = useState<string>('All');
  const [showMap, setShowMap] = useState<boolean>(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search');
    if (query) setSearch(query);
  }, [location.search]);

  const filteredHospitals = hospitals.filter(h => {
    const matchSearch = !search || h.name.toLowerCase().includes(search.toLowerCase()) || h.address.toLowerCase().includes(search.toLowerCase());
    const matchEmergency = filterEmergency === 'All' || h.emergencyStatus === filterEmergency;
    const matchBeds = h.availableBeds >= filterMinBeds;
    const matchICU = h.icuAvailable >= filterMinICU;
    const matchBlood = filterBlood === 'All' || h.bloodInventory.some(b => b.bloodGroup === filterBlood && b.unitsAvailable > 0);
    const matchSpecialist = filterSpecialist === 'All' || h.specialists.some(s => s.specialization.toLowerCase().includes(filterSpecialist.toLowerCase()) && s.availability === 'Available');

    return matchSearch && matchEmergency && matchBeds && matchICU && matchBlood && matchSpecialist;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title & Description */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-7 h-7 text-rose-500" />
            <span>Hospital Directory – Metro Healthcare District</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time availability of hospital beds, ICU units, oxygen resources, blood banks, specialists, and ambulances.
          </p>
        </div>

        <button
          onClick={() => setShowMap(!showMap)}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <MapPin className="w-4 h-4 text-rose-500" />
          <span>{showMap ? 'Hide Live GIS Map' : 'Show Live GIS Map'}</span>
        </button>
      </div>

      {/* Map Section */}
      {showMap && (
        <div className="space-y-2">
          <HospitalMap hospitals={filteredHospitals} height="320px" />
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3 text-xs">
        
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px]">
          <Filter className="w-4 h-4 text-rose-500" />
          <span>Search & Filter Hospitals</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search hospital name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          {/* Emergency Status */}
          <div>
            <select
              value={filterEmergency}
              onChange={(e) => setFilterEmergency(e.target.value)}
              className="w-full py-2 px-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl focus:outline-none font-medium"
            >
              <option value="All">All Emergency Statuses</option>
              <option value="Active">🟢 Emergency Ready</option>
              <option value="High Volume">🟡 High Volume</option>
              <option value="Critical Only">🔴 Critical Only</option>
            </select>
          </div>

          {/* Min Available Beds */}
          <div>
            <select
              value={filterMinBeds}
              onChange={(e) => setFilterMinBeds(Number(e.target.value))}
              className="w-full py-2 px-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl focus:outline-none font-medium"
            >
              <option value={0}>Any Beds Available</option>
              <option value={5}>≥ 5 Beds Available</option>
              <option value={15}>≥ 15 Beds Available</option>
              <option value={30}>≥ 30 Beds Available</option>
            </select>
          </div>

          {/* Min ICU Beds */}
          <div>
            <select
              value={filterMinICU}
              onChange={(e) => setFilterMinICU(Number(e.target.value))}
              className="w-full py-2 px-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl focus:outline-none font-medium"
            >
              <option value={0}>Any ICU Beds</option>
              <option value={2}>≥ 2 ICU Open</option>
              <option value={5}>≥ 5 ICU Open</option>
              <option value={10}>≥ 10 ICU Open</option>
            </select>
          </div>

          {/* Blood Group */}
          <div>
            <select
              value={filterBlood}
              onChange={(e) => setFilterBlood(e.target.value)}
              className="w-full py-2 px-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl focus:outline-none font-medium"
            >
              <option value="All">Any Blood Stock</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                <option key={group} value={group}>🩸 {group} Available</option>
              ))}
            </select>
          </div>

          {/* Specialist */}
          <div>
            <select
              value={filterSpecialist}
              onChange={(e) => setFilterSpecialist(e.target.value)}
              className="w-full py-2 px-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl focus:outline-none font-medium"
            >
              <option value="All">Any Specialist</option>
              <option value="Cardiologist">❤️ Cardiologist</option>
              <option value="Neurologist">🧠 Neurologist</option>
              <option value="Pulmonologist">🫁 Pulmonologist</option>
              <option value="Gynecologist">👩‍⚕️ Gynecologist</option>
              <option value="Pediatrician">🧒 Pediatrician</option>
              <option value="General Surgeon">🔪 General Surgeon</option>
            </select>
          </div>

        </div>
      </div>

      {/* Grid Display */}
      {loading ? (
        <div className="text-center py-16 text-slate-500">
          Loading live hospital directory...
        </div>
      ) : filteredHospitals.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
          <p className="text-slate-600 dark:text-slate-400 font-semibold text-sm">
            No hospitals currently match your filter requirements.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setFilterEmergency('All');
              setFilterMinBeds(0);
              setFilterMinICU(0);
              setFilterBlood('All');
              setFilterSpecialist('All');
            }}
            className="mt-3 px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHospitals.map(hosp => (
            <HospitalCard
              key={hosp.id}
              hospital={hosp}
              highlightBloodGroup={filterBlood !== 'All' ? filterBlood : undefined}
              highlightSpecialist={filterSpecialist !== 'All' ? filterSpecialist : undefined}
            />
          ))}
        </div>
      )}

    </div>
  );
};
