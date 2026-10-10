import { Hospital, Bed, BloodRequest, EmergencyQuery, AIRecommendationResult, DataServiceConfig } from '../types';
import { hospitalService } from './hospitalService';
import { bedService } from './bedService';
import { bloodService } from './bloodService';
import { specialistService } from './specialistService';
import { ambulanceService } from './ambulanceService';
import { aiRecommendationService } from './aiRecommendationService';
import { realtimeService } from './realtimeService';

/**
 * DataService - Unified Data Access Layer
 * 
 * Provides a clean pluggable interface for CareConnect.
 * By default uses Mock Realtime Engine, but supports switching to:
 * - Firebase Realtime Database / Firestore
 * - Supabase Realtime
 * - Google Sheets (Apps Script API)
 * - External REST / GraphQL Hospital APIs
 */
export class DataService {
  private config: DataServiceConfig = {
    sourceType: 'mock'
  };

  /**
   * Configure underlying data source provider
   */
  public configureSource(newConfig: Partial<DataServiceConfig>) {
    this.config = { ...this.config, ...newConfig };
    console.log(`[DataService] Configured data source to: ${this.config.sourceType}`);
  }

  public getDataSourceConfig(): DataServiceConfig {
    return { ...this.config };
  }

  // --- Hospital Methods ---
  public async getHospitals(): Promise<Hospital[]> {
    if (this.config.sourceType === 'sheets' && this.config.googleSheetUrl) {
      // Future Google Sheets fetcher fallback
      return hospitalService.getAllHospitals();
    }
    return hospitalService.getAllHospitals();
  }

  public async getHospitalById(id: string): Promise<Hospital | undefined> {
    return hospitalService.getHospitalById(id);
  }

  public async searchHospitals(query: string): Promise<Hospital[]> {
    return hospitalService.searchHospitals(query);
  }

  // --- Bed Methods ---
  public async getBeds(hospitalId: string): Promise<Bed[]> {
    return bedService.getBedsByHospital(hospitalId);
  }

  public async updateBedStatus(hospitalId: string, bedId: string, status: Bed['status'], patientId?: string | null): Promise<Bed | null> {
    return bedService.updateBedStatus(hospitalId, bedId, status, patientId);
  }

  public async simulateAdmission(hospitalId: string) {
    return bedService.simulateAdmission(hospitalId);
  }

  public async simulateDischarge(hospitalId: string) {
    return bedService.simulateDischarge(hospitalId);
  }

  // --- ICU & Resource Updates ---
  public async updateICUCapacity(hospitalId: string, change: number) {
    realtimeService.updateICUCapacity(hospitalId, change);
  }

  public async updateBloodStock(hospitalId: string, bloodGroup: string, units: number) {
    bloodService.updateBloodStock(hospitalId, bloodGroup, units);
  }

  // --- Blood Requests & Donors ---
  public async createBloodRequest(data: Omit<BloodRequest, 'id' | 'createdAt' | 'status'>): Promise<BloodRequest> {
    return bloodService.createBloodRequest(data);
  }

  public async getBloodRequests(): Promise<BloodRequest[]> {
    return bloodService.getBloodRequests();
  }

  public async respondToBloodRequest(requestId: string, status: BloodRequest['status'], donorName?: string) {
    bloodService.updateRequestStatus(requestId, status, donorName);
  }

  public async getDonors() {
    return bloodService.getDonors();
  }

  // --- Specialists ---
  public async getSpecialists(category?: string) {
    return specialistService.getSpecialistsByCategory(category || 'All');
  }

  public async updateSpecialistAvailability(specialistId: string, availability: any) {
    specialistService.updateSpecialistStatus(specialistId, availability);
  }

  // --- Ambulances ---
  public async getAmbulances() {
    return ambulanceService.getAllAmbulances();
  }

  public async requestAmbulance(userLat: number, userLng: number, emergencyType: string, destinationId?: string) {
    return ambulanceService.requestAmbulance(userLat, userLng, emergencyType, destinationId);
  }

  // --- Hospital Recommendation Engine ---
  public getAIRecommendation(hospitals: Hospital[], query: EmergencyQuery): AIRecommendationResult[] {
    return aiRecommendationService.recommendHospitals(hospitals, query);
  }

  public predictDemand(hospital: Hospital) {
    return aiRecommendationService.predictHospitalDemand(hospital);
  }

  // --- Realtime Subscriptions ---
  public subscribeToUpdates(callback: () => void) {
    return realtimeService.subscribe('ALL_UPDATED', callback);
  }

  public subscribeToNotifications(callback: (notif: any) => void) {
    return realtimeService.subscribe('NOTIFICATION', callback);
  }

  public getIsConnected(): boolean {
    return realtimeService.getIsConnected();
  }

  public getLastUpdatedTime(): string {
    return realtimeService.getLastUpdatedTime();
  }

  public setConnected(status: boolean) {
    realtimeService.setConnected(status);
  }

  public resetData() {
    realtimeService.resetToDummyData();
  }

  public getMode(): 'live' | 'demo' {
    return realtimeService.getMode();
  }

  public isDemoMode(): boolean {
    return realtimeService.getMode() === 'demo';
  }

  public setMode(mode: 'live' | 'demo') {
    realtimeService.setMode(mode);
  }

  public resetDemoData() {
    realtimeService.resetDemoData();
  }
}

export const dataService = new DataService();
