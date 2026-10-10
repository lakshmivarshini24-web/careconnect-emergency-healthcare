import React from 'react';
import { Hospital } from '../../types';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Bed, 
  Activity, 
  Wind, 
  Droplet, 
  UserCheck, 
  Truck, 
  Award,
  ChevronRight,
  Navigation,
  PhoneCall
} from 'lucide-react';

interface HospitalCardProps {
  hospital: Hospital;
  highlightBloodGroup?: string;
  highlightSpecialist?: string;
  aiScore?: number;
}

export const HospitalCard: React.FC<HospitalCardProps> = ({ 
  hospital, 
  highlightBloodGroup,
  highlightSpecialist,
  aiScore 
}) => {
  // Find blood group status if requested
  const bloodItem = highlightBloodGroup 
    ? hospital.bloodInventory.find(b => b.bloodGroup === highlightBloodGroup)
    : hospital.bloodInventory.find(b => b.bloodGroup === 'B+');

  // Find specialist status if requested
  const specialistItem = highlightSpecialist
    ? hospital.specialists.find(s => s.specialization.toLowerCase().includes(highlightSpecialist.toLowerCase()))
    : hospital.specialists.find(s => s.specialization === 'Cardiologist');

  const availableAmbulanceCount = hospital.ambulances.filter(a => a.status === 'Available').length;

  const getStatusBadge = (status: Hospital['emergencyStatus']) => {
    switch (status) {
      case 'Active':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">🟢 Emergency Ready</span>;
      case 'High Volume':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">🟡 High Volume</span>;
      case 'Critical Only':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800">🔴 Critical Trauma Only</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">⚪ Normal</span>;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-extrabold text-lg shrink-0 border border-slate-300 dark:border-slate-600">
              {hospital.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                {hospital.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>{hospital.address}</span>
              </p>
            </div>
          </div>

          {(aiScore !== undefined || hospital.aiScore !== undefined) && (
            <div className="bg-gradient-to-br from-amber-500 to-rose-600 text-white font-extrabold text-xs px-3 py-1 rounded-xl shadow-md flex items-center gap-1 shrink-0">
              <Award className="w-3.5 h-3.5" />
              <span>{aiScore ?? hospital.aiScore}% Match</span>
            </div>
          )}
        </div>

        {/* Status Badges & Distance */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {getStatusBadge(hospital.emergencyStatus)}
          <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
            📍 {hospital.distanceKm ?? '3.2'} km away
          </span>
          <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
            ⏱ ~{hospital.estimatedTravelTimeMin ?? '8'} min ETA
          </span>
        </div>

        {/* Resource Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-3 border-y border-slate-100 dark:border-slate-800 text-xs my-2">
          
          {/* Available Beds */}
          <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <Bed className="w-3.5 h-3.5 text-blue-500" />
              <span>Available Beds</span>
            </div>
            <p className={`font-extrabold text-sm mt-0.5 ${
              hospital.availableBeds > 10 ? 'text-emerald-600 dark:text-emerald-400' : (hospital.availableBeds > 0 ? 'text-amber-600' : 'text-rose-600')
            }`}>
              {hospital.availableBeds} / {hospital.totalBeds}
            </p>
          </div>

          {/* ICU Beds */}
          <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <Activity className="w-3.5 h-3.5 text-indigo-500" />
              <span>ICU Open</span>
            </div>
            <p className={`font-extrabold text-sm mt-0.5 ${
              hospital.icuAvailable > 3 ? 'text-emerald-600 dark:text-emerald-400' : (hospital.icuAvailable > 0 ? 'text-amber-600' : 'text-rose-600')
            }`}>
              {hospital.icuAvailable} beds
            </p>
          </div>

          {/* Oxygen Beds */}
          <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <Wind className="w-3.5 h-3.5 text-cyan-500" />
              <span>Oxygen Beds</span>
            </div>
            <p className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mt-0.5">
              {hospital.oxygenBedsAvailable} beds
            </p>
          </div>

          {/* Blood Stock */}
          <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <Droplet className="w-3.5 h-3.5 text-rose-500" />
              <span>{bloodItem?.bloodGroup || 'B+'} Blood</span>
            </div>
            <p className={`font-extrabold text-sm mt-0.5 ${
              (bloodItem?.unitsAvailable || 0) > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
            }`}>
              {bloodItem?.unitsAvailable ?? 0} units
            </p>
          </div>

          {/* Specialist */}
          <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span className="truncate">{specialistItem?.specialization || 'Cardiologist'}</span>
            </div>
            <p className="font-semibold text-xs mt-0.5 text-slate-700 dark:text-slate-300">
              {specialistItem?.availability === 'Available' ? '🟢 Available' : (specialistItem?.availability || 'On Call')}
            </p>
          </div>

          {/* Ambulance */}
          <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <Truck className="w-3.5 h-3.5 text-amber-500" />
              <span>Ambulance</span>
            </div>
            <p className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mt-0.5">
              {availableAmbulanceCount > 0 ? `🟢 ${availableAmbulanceCount} Ready` : '🔴 Busy'}
            </p>
          </div>

        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 mt-4 pt-2">
        <Link
          to={`/hospitals/${hospital.id}`}
          className="flex-1 py-2 px-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-semibold text-xs text-center flex items-center justify-center gap-1 hover:bg-slate-800 dark:hover:bg-white transition-colors"
        >
          <span>View Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
        
        <a
          href={`tel:${hospital.phone}`}
          className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-500 hover:text-white rounded-xl transition-colors shrink-0"
          title="Call Hospital"
        >
          <PhoneCall className="w-4 h-4" />
        </a>

        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-500 hover:text-white rounded-xl transition-colors shrink-0"
          title="Get Directions"
        >
          <Navigation className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
