import React, { useState, useEffect } from 'react';
import { Bed, WardType } from '../../types';
import { Filter, User, Clock, CheckCircle2, AlertTriangle, XCircle, Search } from 'lucide-react';

interface BedMatrixProps {
  beds: Bed[];
  hospitalName: string;
  totalBeds: number;
  availableBeds: number;
  occupiedBeds: number;
  isAdmin?: boolean;
  onStatusChange?: (bedId: string, newStatus: Bed['status']) => void;
  selectedWard?: WardType | 'All';
  onWardChange?: (ward: WardType | 'All') => void;
}

export const BedMatrix: React.FC<BedMatrixProps> = ({
  beds,
  hospitalName,
  totalBeds,
  availableBeds,
  occupiedBeds,
  isAdmin = false,
  onStatusChange,
  selectedWard: controlledWard,
  onWardChange
}) => {
  const [internalWard, setInternalWard] = useState<WardType | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<Bed['status'] | 'All'>('All');
  const [searchBed, setSearchBed] = useState('');

  const activeWard = controlledWard !== undefined ? controlledWard : internalWard;

  const handleWardClick = (ward: WardType | 'All') => {
    setInternalWard(ward);
    if (onWardChange) {
      onWardChange(ward);
    }
  };

  const wards: (WardType | 'All')[] = ['All', 'Emergency', 'ICU', 'General', 'Pediatric', 'Maternity', 'Isolation'];
  const statuses: (Bed['status'] | 'All')[] = ['All', 'Available', 'Occupied', 'Maintenance'];

  const filteredBeds = beds.filter(bed => {
    const matchWard = activeWard === 'All' || bed.ward.toLowerCase().trim() === activeWard.toLowerCase().trim();
    const matchStatus = selectedStatus === 'All' || bed.status.toLowerCase().trim() === selectedStatus.toLowerCase().trim();
    const matchSearch = !searchBed || bed.id.toLowerCase().includes(searchBed.toLowerCase()) || (bed.patientId && bed.patientId.toLowerCase().includes(searchBed.toLowerCase()));
    return matchWard && matchStatus && matchSearch;
  });

  const wardBeds = beds.filter(b => activeWard === 'All' || b.ward.toLowerCase().trim() === activeWard.toLowerCase().trim());
  const displayTotal = activeWard === 'All' ? totalBeds : wardBeds.length;
  const displayAvailable = activeWard === 'All' ? availableBeds : wardBeds.filter(b => b.status === 'Available').length;
  const displayOccupied = activeWard === 'All' ? occupiedBeds : wardBeds.filter(b => b.status === 'Occupied').length;

  const getStatusBadge = (status: Bed['status']) => {
    switch (status) {
      case 'Available':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400"><CheckCircle2 className="w-3 h-3" /> Available</span>;
      case 'Occupied':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400"><XCircle className="w-3 h-3" /> Occupied</span>;
      case 'Maintenance':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400"><AlertTriangle className="w-3 h-3" /> Maintenance</span>;
    }
  };

  const getTileBorder = (status: Bed['status']) => {
    switch (status) {
      case 'Available':
        return 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/20 hover:bg-emerald-100/50';
      case 'Occupied':
        return 'border-rose-200 dark:border-rose-900 bg-rose-50/40 dark:bg-rose-950/20 hover:bg-rose-100/50';
      case 'Maintenance':
        return 'border-amber-200 dark:border-amber-900 bg-amber-50/40 dark:bg-amber-950/20 hover:bg-amber-100/50';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-5">
      
      {/* Header Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{hospitalName}</span>
            <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full font-semibold">
              Live Bed Matrix
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Individual bed status, ward allocation, and masked patient records.
          </p>
        </div>

        {/* Counter Pills */}
        <div className="flex items-center gap-3 text-xs font-bold">
          <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl">
            Total: <span className="font-mono text-slate-900 dark:text-white">{displayTotal}</span>
          </div>
          <div className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-xl border border-emerald-300 dark:border-emerald-800">
            Available: <span className="font-mono text-emerald-600 dark:text-emerald-400">{displayAvailable}</span>
          </div>
          <div className="px-3 py-1.5 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 rounded-xl border border-rose-300 dark:border-rose-800">
            Occupied: <span className="font-mono text-rose-600 dark:text-rose-400">{displayOccupied}</span>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Ward Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
          <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Ward:
          </span>
          {wards.map(ward => (
            <button
              key={ward}
              onClick={() => handleWardClick(ward)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 ${
                activeWard.toLowerCase().trim() === ward.toLowerCase().trim()
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {ward}
            </button>
          ))}
        </div>

        {/* Status Dropdown & Search */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-xl px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Available">🟢 Available Only</option>
            <option value="Occupied">🔴 Occupied Only</option>
            <option value="Maintenance">⚪ Maintenance Only</option>
          </select>

          <div className="relative">
            <input
              type="text"
              placeholder="Bed / Patient ID..."
              value={searchBed}
              onChange={(e) => setSearchBed(e.target.value)}
              className="w-36 pl-7 pr-2 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-transparent focus:border-rose-500 focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
          </div>
        </div>
      </div>

      {/* Bed Grid Display */}
      {filteredBeds.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            No beds match the selected ward or status filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredBeds.map(bed => (
            <div
              key={bed.id}
              className={`p-3 rounded-xl border transition-all relative flex flex-col justify-between ${getTileBorder(bed.status)}`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                    {bed.id}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                    {bed.ward}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mb-1">
                  {bed.type}
                </p>

                <div className="mb-2">
                  {getStatusBadge(bed.status)}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[10px] space-y-0.5">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-0.5"><User className="w-2.5 h-2.5" /> ID:</span>
                  <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                    {bed.patientId || 'None'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" /> Updated:</span>
                  <span>{new Date(bed.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              {/* Staff Direct Action Controls */}
              {isAdmin && onStatusChange && (
                <div className="mt-2 pt-2 border-t border-slate-300 dark:border-slate-700">
                  <select
                    value={bed.status}
                    onChange={(e) => onStatusChange(bed.id, e.target.value as Bed['status'])}
                    className="w-full text-[10px] py-1 px-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded font-semibold cursor-pointer"
                  >
                    <option value="Available">🟢 Available</option>
                    <option value="Occupied">🔴 Occupied</option>
                    <option value="Maintenance">⚪ Maintenance</option>
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
