import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  Info, 
  CheckCircle2, 
  Layers, 
  Building2 
} from 'lucide-react';
import { authService } from '../services/authService';

export const StaffLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const currentSession = authService.getSession();

  // Staff Credentials Form State
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [staffError, setStaffError] = useState<string | null>(null);

  // Judge Demo Form State
  const [judgeEmail, setJudgeEmail] = useState('');
  const [demoError, setDemoError] = useState<string | null>(null);

  // Real staff login attempt handler
  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStaffError(null);

    const result = authService.attemptStaffLogin(staffEmail, staffPassword);
    if (!result.success) {
      setStaffError(result.message);
    }
  };

  // Judge Demo entry handler
  const handleJudgeDemoEnter = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setDemoError(null);

    const result = authService.enterJudgeDemo(judgeEmail);
    if (!result.success) {
      setDemoError(result.error || 'Invalid email format.');
      return;
    }

    // Direct transition to the Admin Dashboard in Demo Mode
    navigate('/hospital-admin');
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl w-full space-y-8">
        
        {/* Header Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>CareConnect Administrative Gateway</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Hospital Staff Portal
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Authorized portal for managing live hospital beds, ICU capacity, blood inventory, ambulances, and specialist duty shifts.
          </p>
        </div>

        {/* Existing Session Callout (if already logged in) */}
        {currentSession && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-emerald-900 dark:text-emerald-200">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider">
                  Active Session: {currentSession.isJudgeDemo ? '⚖️ Judge Demo Mode' : 'Staff Authenticated'}
                </p>
                <p className="text-sm font-semibold">
                  Signed in as <span className="font-extrabold">{currentSession.displayName}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/hospital-admin')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                Go to Admin Dashboard →
              </button>
              <button
                type="button"
                onClick={() => {
                  authService.logout();
                  navigate('/hospital-admin/login');
                }}
                className="px-3 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700"
              >
                Exit Session
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Card 1: Genuine Staff Login (Preserved for real production authentication) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Production Authentication
                </span>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold px-2 py-0.5 rounded">
                  Hospital SSO / OAuth
                </span>
              </div>

              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                Staff Sign In
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your authorized clinical staff email and credentials.
              </p>

              {/* Error Notice */}
              {staffError && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{staffError}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleStaffSubmit} className="mt-5 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Staff Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={staffEmail}
                      onChange={(e) => setStaffEmail(e.target.value)}
                      placeholder="e.g. physician@careconnect-health.org"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={staffPassword}
                      onChange={(e) => setStaffPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              </form>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Real staff accounts are provisioned via institutional hospital identity servers.</span>
            </div>
          </div>

          {/* Card 2: Judge Demo Access (Highlighted for SITAMS × HACKSPHERE) */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white border-2 border-indigo-500/60 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
            
            {/* Top decorative badge */}
            <div className="absolute top-0 right-0 bg-gradient-to-l from-rose-500 to-indigo-500 text-white text-[10px] font-black tracking-wider uppercase px-4 py-1 rounded-bl-xl shadow-sm">
              SITAMS × HACKSPHERE 2026
            </div>

            <div>
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Evaluation Environment</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                ⚖️ Hackathon Judge Demo Mode
              </h2>

              <p className="text-xs text-indigo-200/90 leading-relaxed mt-2 bg-indigo-950/60 border border-indigo-800/60 p-3 rounded-xl">
                Explore CareConnect administration using simulated hospital data. No real hospital records will be modified.
              </p>

              {/* Validation error for demo email */}
              {demoError && (
                <div className="mt-3 p-3 bg-rose-950/80 border border-rose-800 rounded-xl text-xs text-rose-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <p>{demoError}</p>
                </div>
              )}

              {/* Demo Mode Details & Form */}
              <form onSubmit={handleJudgeDemoEnter} className="mt-5 space-y-4 text-xs">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block font-bold text-indigo-200">
                      Judge / Evaluator Email <span className="text-indigo-400 font-normal">(Optional)</span>
                    </label>
                    <span className="text-[10px] text-indigo-300">No account required</span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={judgeEmail}
                      onChange={(e) => setJudgeEmail(e.target.value)}
                      placeholder="e.g. judge@sitams.edu or leave blank"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-900/80 border border-indigo-700/80 rounded-xl text-white placeholder-indigo-400/60 focus:outline-none focus:border-indigo-400 transition-colors"
                    />
                    <Mail className="w-4 h-4 text-indigo-400 absolute left-3 top-3 pointer-events-none" />
                  </div>
                  <p className="text-[11px] text-indigo-300/80 mt-1">
                    If provided, will appear on your session badge. You do not need to register or request credentials.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer border border-emerald-400/30"
                  >
                    <span>Enter Judge Demo Mode</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[11px] text-center text-indigo-300/80">
                    Instantly unlocks full administrative controls with isolated dummy data.
                  </p>
                </div>
              </form>
            </div>

            <div className="pt-4 border-t border-indigo-800/80 space-y-1.5 text-[11px] text-indigo-300/90">
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Isolated Demo Namespace: Production database records remain untouched.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Test Bed Admissions, Discharges, ICU & Blood adjustments immediately.</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
