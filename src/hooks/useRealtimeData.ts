import { useState, useEffect } from 'react';
import { Hospital, BloodRequest } from '../types';
import { dataService } from '../services/dataService';

export function useRealtimeData() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const refreshData = async () => {
    try {
      const hList = await dataService.getHospitals();
      const bList = await dataService.getBloodRequests();
      setHospitals(hList);
      setBloodRequests(bList);
      setIsConnected(dataService.getIsConnected());
      setLastUpdated(dataService.getLastUpdatedTime());
    } catch (e) {
      console.error('Error fetching realtime data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();

    // Subscribe to realtime changes broadcast from any window or admin action
    const unsubscribeAll = dataService.subscribeToUpdates(() => {
      refreshData();
    });

    // Check connection status periodically or on event
    const interval = setInterval(() => {
      setIsConnected(dataService.getIsConnected());
      setLastUpdated(dataService.getLastUpdatedTime());
    }, 1000);

    return () => {
      unsubscribeAll();
      clearInterval(interval);
    };
  }, []);

  return {
    hospitals,
    bloodRequests,
    isConnected,
    lastUpdated,
    loading,
    refreshData
  };
}
