import { Ambulance } from '../types';
import { realtimeService } from './realtimeService';
import { aiRecommendationService } from './aiRecommendationService';

export class AmbulanceService {
  public getAllAmbulances(): (Ambulance & { hospitalName: string; phone: string })[] {
    const hospitals = realtimeService.getHospitals();
    const result: (Ambulance & { hospitalName: string; phone: string })[] = [];

    hospitals.forEach(h => {
      h.ambulances.forEach(a => {
        result.push({
          ...a,
          hospitalName: h.name,
          phone: h.phone
        });
      });
    });

    return result;
  }

  public getAvailableAmbulances(): (Ambulance & { hospitalName: string; phone: string })[] {
    return this.getAllAmbulances().filter(a => a.status === 'Available');
  }

  public requestAmbulance(userLat: number, userLng: number, emergencyType: string, destinationHospitalId?: string): { ambulance: Ambulance & { hospitalName: string }; etaMinutes: number } | null {
    const available = this.getAvailableAmbulances();
    if (available.length === 0) return null;

    // Find nearest ambulance
    let nearest = available[0];
    let minDistance = aiRecommendationService.calculateDistanceKm(userLat, userLng, nearest.latitude, nearest.longitude);

    for (let i = 1; i < available.length; i++) {
      const amb = available[i];
      const dist = aiRecommendationService.calculateDistanceKm(userLat, userLng, amb.latitude, amb.longitude);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = amb;
      }
    }

    const etaMinutes = aiRecommendationService.estimateTravelTimeMin(minDistance);
    
    // Update status in realtime service
    realtimeService.updateAmbulanceStatus(nearest.id, 'Assigned', `EMG-${Date.now().toString().slice(-4)}`);

    return {
      ambulance: nearest,
      etaMinutes
    };
  }

  public updateAmbulanceStatus(ambulanceId: string, status: Ambulance['status']) {
    realtimeService.updateAmbulanceStatus(ambulanceId, status);
  }
}

export const ambulanceService = new AmbulanceService();
