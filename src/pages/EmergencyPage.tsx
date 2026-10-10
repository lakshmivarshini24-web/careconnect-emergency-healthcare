import React, { useState } from 'react';
import { useRealtimeData } from '../hooks/useRealtimeData';
import { aiRecommendationService } from '../services/aiRecommendationService';
import { AIRecommendationResult } from '../types';
import { 
  Siren, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Bed, 
  Activity, 
  Wind, 
  Droplet, 
  UserCheck, 
  Truck, 
  Sparkles,
  ArrowRight,
  Navigation,
  PhoneCall,
  ShieldAlert
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmergencyPage: React.FC = () => {
  const { hospitals } = useRealtimeData();

  // Wizard State
  const [step, setStep] = useState<number>(1);

  // Form Inputs
  const [emergencyType, setEmergencyType] = useState<string>('Heart Attack');
  const [locationName, setLocationName] = useState<string>('City Center Mall, Sector 4');
  const [patientCondition, setPatientCondition] = useState<string>('Severe chest pain & shortness of breath');
  const [requiredSpecialist, setRequiredSpecialist] = useState<string>('Cardiologist');
  const [needICU, setNeedICU] = useState<boolean>(true);
  const [needOxygen, setNeedOxygen] = useState<boolean>(true);
  const [needBlood, setNeedBlood] = useState<string>('B+');
  const [needAmbulance, setNeedAmbulance] = useState<boolean>(true);

  // AI Output
  const [recommendations, setRecommendations] = useState<AIRecommendationResult[] | null>(null);

  const emergencyTypes = [
    { name: 'Heart Attack', icon: '❤️', specialist: 'Cardiologist', icu: true, oxygen: true },
    { name: 'Stroke', icon: '🧠', specialist: 'Neurologist', icu: true, oxygen: true },
    { name: 'Accident / Trauma', icon: '🚗', specialist: 'General Surgeon', icu: true, oxygen: true },
    { name: 'Breathing Emergency', icon: '🫁', specialist: 'Pulmonologist', icu: true, oxygen: true },
    { name: 'Pregnancy Emergency', icon: '🤰', specialist: 'Gynecologist', icu: false, oxygen: false },
    { name: 'Severe Burns', icon: '🔥', specialist: 'General Surgeon', icu: true, oxygen: true },
    { name: 'Severe Blood Loss', icon: '🩸', specialist: 'General Surgeon', icu: true, oxygen: true },
    { name: 'Pediatric Emergency', icon: '👶', specialist: 'Pediatrician', icu: false, oxygen: true },
  ];

  const handleSelectEmergencyType = (typeObj: typeof emergencyTypes[0]) => {
    setEmergencyType(typeObj.name);
    setRequiredSpecialist(typeObj.specialist);
    setNeedICU(typeObj.icu);
    setNeedOxygen(typeObj.oxygen);
    setStep(2);
  };

  const handleRunAIRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    const results = aiRecommendationService.recommendHospitals(hospitals, {
      emergencyType,
      userLat: 12.9716,
      userLng: 77.5946,
      locationName,
      patientCondition,
      requiredSpecialist,
      needICU,
      needOxygen,
      needBlood,
      needAmbulance
    });
    setRecommendations(results);
    setStep(3);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Callout */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 border border-rose-900/50">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-600 rounded-2xl animate-pulse">
            <Siren className="w-8 h-8 text-yellow-300" />
          </div>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-rose-400">
              Emergency Healthcare AI Dispatcher
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">
              AI Emergency Hospital Matcher
            </h1>
          </div>
        </div>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Matches critical patients with the highest suitability hospital based on live ICU capacity, specialist availability, distance, travel time, and oxygen resources.
        </p>
      </div>

      {/* STEP 1: Select Emergency Type */}
      {step === 1 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
          <div className="space-y-1">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Step 1 of 2</span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              What type of emergency is occurring?
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {emergencyTypes.map(item => (
              <button
                key={item.name}
                onClick={() => handleSelectEmergencyType(item)}
                className={`p-4 rounded-2xl font-black text-sm flex flex-col items-center justify-center gap-2 border transition-all text-center cursor-pointer ${
                  emergencyType === item.name
                    ? 'bg-rose-600 text-white border-rose-600 shadow-lg shadow-rose-600/30 scale-105'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-rose-400'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>

          <div className="pt-2 text-right">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 ml-auto"
            >
              <span>Continue to Patient Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Location & Requirements Form */}
      {step === 2 && (
        <form onSubmit={handleRunAIRecommendation} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Step 2 of 2</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Patient Conditions & Resource Requirements
              </h2>
            </div>
            <button type="button" onClick={() => setStep(1)} className="text-xs font-bold text-slate-400 hover:text-slate-600">
              ← Change Emergency Type ({emergencyType})
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                Current Location / Address *
              </label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full p-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-medium focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                Required Specialist *
              </label>
              <select
                value={requiredSpecialist}
                onChange={(e) => setRequiredSpecialist(e.target.value)}
                className="w-full p-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold focus:outline-none"
              >
                <option value="Cardiologist">❤️ Cardiologist</option>
                <option value="Neurologist">🧠 Neurologist</option>
                <option value="Pulmonologist">🫁 Pulmonologist</option>
                <option value="Gynecologist">👩‍⚕️ Gynecologist</option>
                <option value="Pediatrician">🧒 Pediatrician</option>
                <option value="General Surgeon">🔪 General Surgeon</option>
                <option value="General / None">None / Any Physician</option>
              </select>
            </div>
          </div>

          {/* Toggle Checklist */}
          <div className="space-y-2">
            <label className="block font-extrabold text-slate-700 dark:text-slate-300">
              Check Critical Resources Needed:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              
              <label className={`p-3 rounded-2xl border flex items-center gap-2 cursor-pointer ${
                needICU ? 'bg-indigo-50 border-indigo-400 text-indigo-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <input
                  type="checkbox"
                  checked={needICU}
                  onChange={(e) => setNeedICU(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>Need ICU Bed</span>
              </label>

              <label className={`p-3 rounded-2xl border flex items-center gap-2 cursor-pointer ${
                needOxygen ? 'bg-cyan-50 border-cyan-400 text-cyan-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <input
                  type="checkbox"
                  checked={needOxygen}
                  onChange={(e) => setNeedOxygen(e.target.checked)}
                  className="rounded text-cyan-600"
                />
                <span>Need Oxygen</span>
              </label>

              <label className={`p-3 rounded-2xl border flex items-center gap-2 cursor-pointer ${
                needAmbulance ? 'bg-amber-50 border-amber-400 text-amber-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <input
                  type="checkbox"
                  checked={needAmbulance}
                  onChange={(e) => setNeedAmbulance(e.target.checked)}
                  className="rounded text-amber-600"
                />
                <span>Need Ambulance</span>
              </label>

              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                <span className="block font-bold text-slate-600 dark:text-slate-400 mb-0.5 text-[10px]">Blood Group:</span>
                <select
                  value={needBlood}
                  onChange={(e) => setNeedBlood(e.target.value)}
                  className="w-full bg-transparent font-bold text-slate-900 dark:text-white focus:outline-none"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                    <option key={group} value={group}>🩸 {group}</option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 transition-transform transform active:scale-98"
          >
            <Sparkles className="w-5 h-5" />
            <span>CALCULATE AI HOSPITAL RECOMMENDATION SCORES</span>
          </button>
        </form>
      )}

      {/* STEP 3: AI Recommendations Output */}
      {step === 3 && recommendations && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-500" />
              <span>AI Emergency Recommendation Results</span>
            </h2>

            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
            >
              Modify Search Parameters
            </button>
          </div>

          {/* Prototype Medical Disclaimer Alert */}
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
            <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <span>
              <strong>DECISION SUPPORT NOTICE:</strong> The AI recommendation score is calculated using multi-criteria resource optimization (Specialist match 30%, ICU 20%, Travel time 15%, Bed capacity 15%, Oxygen 10%, Blood/Ambulance 10%). Emergency medical decisions should always be confirmed by qualified medical professionals.
            </span>
          </div>

          {/* Top Ranked Hospital List */}
          <div className="space-y-6">
            {recommendations.slice(0, 3).map((rec, idx) => {
              const h = rec.hospital;
              const isWinner = idx === 0;

              return (
                <div
                  key={h.id}
                  className={`bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-md space-y-4 transition-all ${
                    isWinner ? 'border-amber-400 dark:border-amber-700 ring-2 ring-amber-400/40' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      {isWinner && (
                        <span className="px-3 py-1 bg-amber-500 text-white font-extrabold text-xs rounded-full inline-block mb-1">
                          🏆 TOP RECOMMENDATION (#1 RANK)
                        </span>
                      )}
                      <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">
                        {h.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span>{h.address}</span> • <strong>📍 {h.distanceKm} km away</strong> • <strong>⏱ ~{h.estimatedTravelTimeMin} min ETA</strong>
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-amber-500 to-rose-600 text-white px-4 py-2 rounded-2xl shadow-md text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider block">AI Match Score</span>
                      <strong className="text-2xl font-black block">{rec.score}%</strong>
                    </div>
                  </div>

                  {/* Why This Hospital Explanation Breakdown */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl space-y-2 text-xs">
                    <h4 className="font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-amber-500" /> WHY THIS HOSPITAL WAS RECOMMENDED:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-medium">
                      {rec.matchReasons.map((reason, rIdx) => (
                        <div key={rIdx} className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{reason}</span>
                        </div>
                      ))}
                      {rec.warningNotes.map((note, nIdx) => (
                        <div key={nIdx} className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                          <span>{note}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link
                      to={`/hospitals/${h.id}`}
                      className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800"
                    >
                      [SELECT HOSPITAL & VIEW BEDS]
                    </Link>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${h.latitude},${h.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5"
                    >
                      <Navigation className="w-4 h-4 text-blue-500" />
                      <span>[GET DIRECTIONS]</span>
                    </a>

                    <Link
                      to="/ambulances"
                      className="px-4 py-2.5 bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-xs rounded-xl flex items-center gap-1.5"
                    >
                      <Truck className="w-4 h-4 text-amber-500" />
                      <span>[REQUEST AMBULANCE]</span>
                    </Link>

                    <a
                      href={`tel:${h.phone}`}
                      className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs flex items-center gap-1 ml-auto"
                    >
                      <PhoneCall className="w-4 h-4" /> Call ER
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
