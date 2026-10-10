import type { Hospital, Bed, BloodRequest, NotificationItem, Ambulance, Specialist } from '../types';
import { initialHospitals, initialHospitalBeds, initialBloodRequests } from '../data/dummyHospitals';

type EventListener = (data?: any) => void;

class RealtimeService {
  private hospitals: Hospital[] = [];
  private bedsMap: Record<string, Bed[]> = {};
  private bloodRequests: BloodRequest[] = [];
  private notifications: NotificationItem[] = [];
  private listeners: Map<string, Set<EventListener>> = new Map();
  private broadcastChannel: BroadcastChannel | null = null;
  private isConnected: boolean = true;
  private lastUpdatedTime: string = new Date().toISOString();

  constructor() {
    this.initData();
    this.initBroadcastChannel();
  }

  private initData() {
    // Try loading from localStorage for persistent prototype state across refreshes
    const savedHospitals = localStorage.getItem('careconnect_hospitals');
    const savedBeds = localStorage.getItem('careconnect_beds');
    const savedRequests = localStorage.getItem('careconnect_blood_requests');

    if (savedHospitals && savedBeds) {
      try {
        this.hospitals = JSON.parse(savedHospitals);
        this.bedsMap = JSON.parse(savedBeds);
      } catch (e) {
        this.hospitals = initialHospitals;
        this.bedsMap = initialHospitalBeds;
      }
    } else {
      this.hospitals = initialHospitals;
      this.bedsMap = initialHospitalBeds;
    }

    if (savedRequests) {
      try {
        this.bloodRequests = JSON.parse(savedRequests);
      } catch (e) {
        this.bloodRequests = initialBloodRequests;
      }
    } else {
      this.bloodRequests = initialBloodRequests;
    }

    this.recalculateCountsAll();
  }

  private initBroadcastChannel() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.broadcastChannel = new BroadcastChannel('careconnect_realtime_channel');
      this.broadcastChannel.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === 'SYNC_ALL') {
          this.hospitals = payload.hospitals;
          this.bedsMap = payload.bedsMap;
          this.bloodRequests = payload.bloodRequests;
          this.notifications = payload.notifications || this.notifications;
          this.lastUpdatedTime = payload.lastUpdatedTime;
          this.notifyListeners('ALL_UPDATED', null);
          this.notifyListeners('NOTIFICATION', payload.latestNotification);
        }
      };
    }
  }

  private saveAndBroadcast(latestNotification?: NotificationItem) {
    this.lastUpdatedTime = new Date().toISOString();
    try {
      localStorage.setItem('careconnect_hospitals', JSON.stringify(this.hospitals));
      localStorage.setItem('careconnect_beds', JSON.stringify(this.bedsMap));
      localStorage.setItem('careconnect_blood_requests', JSON.stringify(this.bloodRequests));
    } catch (e) {
      console.warn('LocalStorage save limit exceeded', e);
    }

    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({
        type: 'SYNC_ALL',
        payload: {
          hospitals: this.hospitals,
          bedsMap: this.bedsMap,
          bloodRequests: this.bloodRequests,
          notifications: this.notifications,
          lastUpdatedTime: this.lastUpdatedTime,
          latestNotification
        }
      });
    }

    this.notifyListeners('ALL_UPDATED', null);
    if (latestNotification) {
      this.notifyListeners('NOTIFICATION', latestNotification);
    }
  }

  public subscribe(event: string, listener: EventListener): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);

    return () => {
      this.listeners.get(event)?.delete(listener);
    };
  }

  private notifyListeners(event: string, data?: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(fn => fn(data));
    }
  }

  public getIsConnected(): boolean {
    return this.isConnected;
  }

  public setConnected(status: boolean) {
    this.isConnected = status;
    this.notifyListeners('CONNECTION_CHANGED', this.isConnected);
  }

  public getLastUpdatedTime(): string {
    return this.lastUpdatedTime;
  }

  // --- Hospital Data Access & Updates ---
  public getHospitals(): Hospital[] {
    return [...this.hospitals];
  }

  public getHospitalById(id: string): Hospital | undefined {
    return this.hospitals.find(h => h.id === id);
  }

  public getBedsForHospital(hospitalId: string): Bed[] {
    return this.bedsMap[hospitalId] || [];
  }

  public updateBedStatus(hospitalId: string, bedId: string, newStatus: Bed['status'], newPatientId?: string | null): Bed | null {
    const beds = this.bedsMap[hospitalId];
    if (!beds) return null;

    const bedIndex = beds.findIndex(b => b.id === bedId);
    if (bedIndex === -1) return null;

    const oldStatus = beds[bedIndex].status;
    const nowStr = new Date().toISOString();

    beds[bedIndex] = {
      ...beds[bedIndex],
      status: newStatus,
      patientId: newStatus === 'Occupied' ? (newPatientId || beds[bedIndex].patientId || `PAT-${Math.floor(100 + Math.random() * 900)}`) : null,
      lastUpdated: nowStr
    };

    // Recalculate hospital bed counts
    this.recalculateCounts(hospitalId);

    const hospital = this.getHospitalById(hospitalId);
    const notif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random()}`,
      type: 'bed',
      message: `Bed ${bedId} at ${hospital?.name || 'Hospital'} changed: ${oldStatus.toUpperCase()} ➔ ${newStatus.toUpperCase()}`,
      hospitalName: hospital?.name,
      timestamp: nowStr,
      read: false
    };

    this.notifications.unshift(notif);
    this.saveAndBroadcast(notif);

    return beds[bedIndex];
  }

  public updateICUCapacity(hospitalId: string, changeAvailable: number) {
    const hosp = this.hospitals.find(h => h.id === hospitalId);
    if (!hosp) return;

    hosp.icuAvailable = Math.max(0, Math.min(hosp.icuTotal, hosp.icuAvailable + changeAvailable));
    hosp.lastUpdated = new Date().toISOString();

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'icu',
      message: `ICU capacity updated at ${hosp.name}: ${hosp.icuAvailable}/${hosp.icuTotal} available`,
      hospitalName: hosp.name,
      timestamp: hosp.lastUpdated,
      read: false
    };

    this.notifications.unshift(notif);
    this.saveAndBroadcast(notif);
  }

  public updateBloodStock(hospitalId: string, bloodGroup: string, newUnits: number) {
    const hosp = this.hospitals.find(h => h.id === hospitalId);
    if (!hosp) return;

    const item = hosp.bloodInventory.find(b => b.bloodGroup === bloodGroup);
    if (item) {
      item.unitsAvailable = Math.max(0, newUnits);
      item.lastUpdated = new Date().toISOString();
      hosp.lastUpdated = item.lastUpdated;

      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        type: 'blood',
        message: `${bloodGroup} blood stock at ${hosp.name} updated to ${item.unitsAvailable} units`,
        hospitalName: hosp.name,
        timestamp: hosp.lastUpdated,
        read: false
      };

      this.notifications.unshift(notif);
      this.saveAndBroadcast(notif);
    }
  }

  public updateAmbulanceStatus(ambulanceId: string, status: Ambulance['status'], assignedReqId?: string) {
    for (const hosp of this.hospitals) {
      const amb = hosp.ambulances.find(a => a.id === ambulanceId);
      if (amb) {
        amb.status = status;
        if (assignedReqId) amb.assignedRequestId = assignedReqId;
        amb.lastUpdated = new Date().toISOString();
        hosp.lastUpdated = amb.lastUpdated;

        const notif: NotificationItem = {
          id: `notif-${Date.now()}`,
          type: 'ambulance',
          message: `Ambulance ${amb.id} at ${hosp.name} status: ${status}`,
          hospitalName: hosp.name,
          timestamp: amb.lastUpdated,
          read: false
        };

        this.notifications.unshift(notif);
        this.saveAndBroadcast(notif);
        break;
      }
    }
  }

  public updateSpecialistAvailability(specialistId: string, availability: Specialist['availability']) {
    for (const hosp of this.hospitals) {
      const spec = hosp.specialists.find(s => s.id === specialistId);
      if (spec) {
        spec.availability = availability;
        spec.lastUpdated = new Date().toISOString();
        hosp.lastUpdated = spec.lastUpdated;

        const notif: NotificationItem = {
          id: `notif-${Date.now()}`,
          type: 'specialist',
          message: `${spec.specialization} ${spec.doctorName} at ${hosp.name} is now ${availability}`,
          hospitalName: hosp.name,
          timestamp: spec.lastUpdated,
          read: false
        };

        this.notifications.unshift(notif);
        this.saveAndBroadcast(notif);
        break;
      }
    }
  }

  public addBloodRequest(requestData: Omit<BloodRequest, 'id' | 'createdAt' | 'status'>): BloodRequest {
    const newReq: BloodRequest = {
      ...requestData,
      id: `REQ-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      status: 'PENDING'
    };

    this.bloodRequests.unshift(newReq);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'blood',
      message: `🚨 Emergency Blood Request: ${newReq.unitsRequired} units of ${newReq.bloodGroup} at ${newReq.hospitalName}`,
      hospitalName: newReq.hospitalName,
      timestamp: newReq.createdAt,
      read: false
    };

    this.notifications.unshift(notif);
    this.saveAndBroadcast(notif);
    return newReq;
  }

  public getBloodRequests(): BloodRequest[] {
    return [...this.bloodRequests];
  }

  public updateBloodRequestStatus(requestId: string, status: BloodRequest['status'], donorName?: string) {
    const req = this.bloodRequests.find(r => r.id === requestId);
    if (req) {
      req.status = status;
      if (donorName) req.acceptedByDonor = donorName;

      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        type: 'blood',
        message: `Blood Request ${req.id} for ${req.bloodGroup} has been ${status}${donorName ? ' by donor ' + donorName : ''}`,
        hospitalName: req.hospitalName,
        timestamp: new Date().toISOString(),
        read: false
      };

      this.notifications.unshift(notif);
      this.saveAndBroadcast(notif);
    }
  }

  public getNotifications(): NotificationItem[] {
    return [...this.notifications];
  }

  // --- Recalculate Bed Counts helper ---
  private recalculateCounts(hospitalId: string) {
    const beds = this.bedsMap[hospitalId] || [];
    const hosp = this.hospitals.find(h => h.id === hospitalId);
    if (!hosp) return;

    hosp.totalBeds = beds.length;
    hosp.availableBeds = beds.filter(b => b.status === 'Available').length;
    hosp.occupiedBeds = beds.filter(b => b.status === 'Occupied').length;
    hosp.lastUpdated = new Date().toISOString();
  }

  private recalculateCountsAll() {
    this.hospitals.forEach(h => this.recalculateCounts(h.id));
  }

  public resetToDummyData() {
    localStorage.removeItem('careconnect_hospitals');
    localStorage.removeItem('careconnect_beds');
    localStorage.removeItem('careconnect_blood_requests');
    this.hospitals = initialHospitals;
    this.bedsMap = initialHospitalBeds;
    this.bloodRequests = initialBloodRequests;
    this.notifications = [];
    this.recalculateCountsAll();
    this.saveAndBroadcast();
  }
}

export const realtimeService = new RealtimeService();
