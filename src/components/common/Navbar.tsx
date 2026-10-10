import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  HeartPulse, 
  Siren, 
  Building2, 
  Bed, 
  Activity, 
  Wind, 
  Droplet, 
  UserCheck, 
  Truck, 
  HeartHandshake,
  ShieldCheck, 
  PlayCircle,
  Search,
  Menu,
  X,
  User
} from 'lucide-react';
import { LiveIndicator } from './LiveIndicator';
import { UserRole, AuthSession } from '../../types';
import { authService } from '../../services/authService';

interface NavbarProps {
  isConnected: boolean;
  lastUpdated: string;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isConnected, lastUpdated, activeRole, onRoleChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(() => authService.getSession());
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const unsub = authService.subscribe((s) => setSession(s));
    return () => unsub();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/hospitals?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: 'Hospitals', path: '/hospitals', icon: Building2 },
    { name: 'Beds', path: '/beds', icon: Bed },
    { name: 'ICU', path: '/icu', icon: Activity },
    { name: 'Oxygen', path: '/oxygen', icon: Wind },
    { name: 'Blood', path: '/blood', icon: Droplet },
    { name: 'Specialists', path: '/specialists', icon: UserCheck },
    { name: 'Ambulances', path: '/ambulances', icon: Truck },
    { name: 'Donors', path: '/donors', icon: HeartHandshake },
    { 
      name: session ? (session.isJudgeDemo ? 'Staff Admin (Demo)' : 'Staff Admin') : 'Staff Admin', 
      path: session ? '/hospital-admin' : '/hospital-admin/login', 
      icon: ShieldCheck 
    },
    { name: 'Demo Simulator', path: '/demo', icon: PlayCircle },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Top Banner / Live Status & Emergency Alert */}
      <div className="bg-slate-900 text-white px-4 py-1.5 text-xs flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-3">
          <LiveIndicator isConnected={isConnected} lastUpdated={lastUpdated} showToggle={true} />
        </div>
        <div className="flex items-center gap-4">
          {session?.isJudgeDemo && (
            <div className="flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
              <span>⚖️ Demo Mode</span>
              {session.email && (
                <span className="text-amber-200/90 font-normal">({session.email})</span>
              )}
              <button
                type="button"
                onClick={() => {
                  authService.logout();
                  navigate('/hospitals');
                }}
                className="text-rose-300 hover:text-white underline text-[10px] cursor-pointer ml-1"
                title="Exit Judge Demo Mode"
              >
                Exit
              </button>
            </div>
          )}
          <div className="hidden sm:flex items-center gap-2 text-slate-300">
            <User className="w-3.5 h-3.5" />
            <span>Active Role:</span>
            <select
              value={activeRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="bg-slate-800 text-white text-xs border border-slate-700 rounded px-2 py-0.5 focus:outline-none cursor-pointer"
            >
              <option value="patient">Patient / User</option>
              <option value="hospital-staff">Hospital Staff / Admin</option>
              <option value="donor">Blood Donor</option>
            </select>
          </div>
          <Link
            to="/demo"
            className="hidden md:inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium"
          >
            <PlayCircle className="w-3.5 h-3.5" /> Live Demo Tester
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="p-2 bg-rose-600 text-white rounded-xl shadow-md group-hover:bg-rose-700 transition-colors">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white block">
                CareConnect
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                Emergency Healthcare Coordination
              </span>
            </div>
          </Link>

          {/* Global Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center flex-1 max-w-xs relative">
            <input
              type="text"
              placeholder="Search hospital, blood group (B+), cardiologist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl border border-transparent focus:border-rose-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          </form>

          {/* Emergency Button */}
          <Link
            to="/emergency"
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-rose-600/30 hover:from-rose-700 hover:to-red-700 transform active:scale-95 transition-all border border-rose-500 animate-pulse shrink-0"
          >
            <Siren className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
            <span>🚨 EMERGENCY</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Desktop Secondary Link Bar */}
        <nav className="hidden lg:flex items-center gap-1 py-2 overflow-x-auto border-t border-slate-100 dark:border-slate-800 text-xs">
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path ||
              (link.path.startsWith('/hospital-admin') && location.pathname.startsWith('/hospital-admin'));
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search hospital, specialist, blood..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm rounded-xl"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </form>

          <div className="grid grid-cols-2 gap-2 text-sm">
            {navLinks.map(link => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                >
                  <Icon className="w-4 h-4 text-rose-500" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
