import React from 'react';
import { Wifi, WifiOff, Clock } from 'lucide-react';
import { dataService } from '../../services/dataService';

interface LiveIndicatorProps {
  isConnected: boolean;
  lastUpdated: string;
  showToggle?: boolean;
}

export const LiveIndicator: React.FC<LiveIndicatorProps> = ({ isConnected, lastUpdated, showToggle = false }) => {
  const formatTime = (isoStr: string) => {
    if (!isoStr) return 'Syncing...';
    try {
      const date = new Date(isoStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return isoStr;
    }
  };

  const handleToggleConnection = () => {
    dataService.setConnected(!isConnected);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm">
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium transition-all ${
        isConnected 
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' 
          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 animate-pulse'
      }`}>
        {isConnected ? (
          <>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Wifi className="w-3.5 h-3.5" />
            <span className="font-semibold tracking-wide">LIVE DATA</span>
          </>
        ) : (
          <>
            <WifiOff className="w-3.5 h-3.5" />
            <span className="font-semibold tracking-wide">Connection Interrupted</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
        <Clock className="w-3.5 h-3.5" />
        <span>{isConnected ? 'Last updated:' : 'Last synchronized:'} <strong className="font-mono text-slate-700 dark:text-slate-200">{formatTime(lastUpdated)}</strong></span>
      </div>

      {showToggle && (
        <button
          onClick={handleToggleConnection}
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline cursor-pointer"
          title="Simulate network loss for demo testing"
        >
          [{isConnected ? 'Simulate Disconnect' : 'Reconnect'}]
        </button>
      )}
    </div>
  );
};
