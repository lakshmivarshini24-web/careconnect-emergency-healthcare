import React, { useState } from 'react';
import { useRealtimeData } from '../hooks/useRealtimeData';
import { UserCheck, PhoneCall, Filter, Search, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SpecialistsPage: React.FC = () => {
  const { hospitals } = useRealtimeData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchDoctor, setSearchDoctor] = useState<string>('');
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);

  const categories = [
    { name: 'All', icon: '🩺' },
    { name: 'Cardiologist', icon: '❤️' },
    { name: 'Neurologist', icon: '🧠' },
    { name: 'Pulmonologist', icon: '🫁' },
    { name: 'Gynecologist', icon: '👩‍⚕️' },
    { name: 'Pediatrician', icon: '🧒' },
    { name: 'Orthopedic', icon: '🦴' },
    { name: 'General Physician', icon: '🩺' },
    { name: 'General Surgeon', icon: '🔪' },
    { name: 'Nephrologist', icon: '🫘' },
    { name: 'Oncologist', icon: '🧪' },
  ];

  // Flatten all specialists across hospitals
  const allSpecialists = hospitals.flatMap(h =>
    h.specialists.map(s => ({ ...s, hospitalName: h.name, hospitalAddress: h.address, distanceKm: h.distanceKm || 3.2 }))
  );

  const filteredSpecialists = allSpecialists.filter(s => {
    const matchCategory = selectedCategory === 'All' || s.specialization.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchSearch = !searchDoctor || s.doctorName.toLowerCase().includes(searchDoctor.toLowerCase()) || s.hospitalName.toLowerCase().includes(searchDoctor.toLowerCase());
    const matchAvail = !availableOnly || s.availability === 'Available';

    return matchCategory && matchSearch && matchAvail;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <UserCheck className="w-7 h-7 text-emerald-500" />
          <span>Emergency Specialist Doctor Directory</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Find available medical specialists, surgeons, cardiologists, and neurologists on duty.
        </p>
      </div>

      {/* Category Pills & Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-rose-500" /> Select Specialty:
          </span>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="rounded text-rose-600 focus:ring-rose-500"
              />
              <span>🟢 Available Now Only</span>
            </label>

            <div className="relative">
              <input
                type="text"
                placeholder="Doctor or hospital..."
                value={searchDoctor}
                onChange={(e) => setSearchDoctor(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl focus:outline-none w-48 text-xs"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
                selectedCategory === cat.name
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid Display */}
      {filteredSpecialists.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 text-sm">
          No specialists currently match your search filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpecialists.map(s => (
            <div
              key={s.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                      {s.specialization}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {s.doctorName}
                    </h3>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    s.availability === 'Available' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {s.availability === 'Available' ? '🟢 Available' : s.availability}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl text-xs space-y-1">
                  <p className="font-bold text-slate-800 dark:text-slate-200">{s.hospitalName}</p>
                  <p className="text-slate-400 text-[11px]">📍 {s.hospitalAddress} ({s.distanceKm} km away)</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <a
                  href={`tel:${s.phone || '+15559011122'}`}
                  className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs text-center flex items-center justify-center gap-1"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Doctor Duty Desk</span>
                </a>

                <Link
                  to={`/hospitals/${s.hospitalId}`}
                  className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs"
                >
                  Hospital Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
