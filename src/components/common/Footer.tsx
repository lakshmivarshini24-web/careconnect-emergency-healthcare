import React from 'react';
import { HeartPulse, ShieldAlert, FileCode2, Cpu, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-10 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand & Purpose */}
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <HeartPulse className="w-5 h-5 text-rose-500" />
            <span>CareConnect Platform</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed max-w-md">
            Centralized Real-Time Emergency Healthcare Coordination System connecting hospitals, patients, ICU units, blood donors, specialists, and ambulances during critical medical emergencies.
          </p>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-start gap-2 text-[11px] text-amber-300 max-w-md">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>PROTOTYPE DISCLAIMER:</strong> All displayed hospital data, bed allocations, patient IDs, and donor contacts are realistic dummy data for hackathon demonstration. In medical emergencies, always dial official emergency numbers (911 / 112 / local emergency services).
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-slate-200 font-semibold mb-3 uppercase tracking-wider text-[11px]">Emergency Directives</h4>
          <ul className="space-y-2">
            <li><Link to="/emergency" className="hover:text-white transition-colors flex items-center gap-1 text-rose-400 font-medium">🚨 Emergency Hospital Matcher</Link></li>
            <li><Link to="/beds" className="hover:text-white transition-colors">🛏 Real-Time Bed Directory</Link></li>
            <li><Link to="/icu" className="hover:text-white transition-colors">🏥 Critical ICU & Ventilators</Link></li>
            <li><Link to="/blood" className="hover:text-white transition-colors">🩸 Blood Stock & Request</Link></li>
            <li><Link to="/ambulances" className="hover:text-white transition-colors">🚑 Ambulance Tracking</Link></li>
            <li><Link to="/specialists" className="hover:text-white transition-colors">👨‍⚕️ Emergency Specialists</Link></li>
          </ul>
        </div>

        {/* Developer & Architecture Docs */}
        <div>
          <h4 className="text-slate-200 font-semibold mb-3 uppercase tracking-wider text-[11px]">System Architecture</h4>
          <ul className="space-y-2">
            <li><Link to="/demo" className="hover:text-emerald-400 text-emerald-300 font-medium flex items-center gap-1"><Cpu className="w-3.5 h-3.5" /> Live Simulation Center</Link></li>
            <li><Link to="/hospital-admin" className="hover:text-white transition-colors flex items-center gap-1"><FileCode2 className="w-3.5 h-3.5" /> Staff Command Panel</Link></li>
            <li><span className="text-slate-500 block">Data Abstraction: dataService.ts</span></li>
            <li><span className="text-slate-500 block">PubSub Sync: BroadcastChannel</span></li>
            <li><span className="text-slate-500 block">Scoring: Resource Weight Engine</span></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-800/60 flex flex-wrap justify-between items-center text-slate-500 text-[11px]">
        <p>© 2026 CareConnect Emergency System. Scalable for multi-hospital deployments.</p>
        <p>Built with React, TypeScript, Vite, Tailwind CSS & OpenStreetMap</p>
      </div>
    </footer>
  );
};
