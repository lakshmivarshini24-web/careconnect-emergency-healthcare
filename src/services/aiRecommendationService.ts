import { Hospital, EmergencyQuery, AIRecommendationResult } from '../types';

/**
 * Multi-Criteria Decision-Support Recommendation Engine for Emergency Healthcare Coordination
 * 
 * Uses transparent weight-based multi-criteria evaluation to match patients to optimal hospitals
 * during critical medical emergencies.
 */
export class AIRecommendationService {
  
  /**
   * Calculate distance in kilometers between two GPS coordinates using Haversine formula
   */
  public calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1));
  }

  /**
   * Estimate travel time in minutes assuming emergency vehicle urban speed (approx 30 km/h avg)
   */
  public estimateTravelTimeMin(distanceKm: number): number {
    return Math.max(2, Math.round((distanceKm / 35) * 60));
  }

  /**
   * Evaluates and scores hospitals for a given emergency query
   */
  public recommendHospitals(hospitals: Hospital[], query: EmergencyQuery): AIRecommendationResult[] {
    const results: AIRecommendationResult[] = hospitals.map(hosp => {
      const distance = this.calculateDistanceKm(query.userLat, query.userLng, hosp.latitude, hosp.longitude);
      const travelTime = this.estimateTravelTimeMin(distance);

      hosp.distanceKm = distance;
      hosp.estimatedTravelTimeMin = travelTime;

      // 1. Specialist Match Score (0 - 30 points)
      let specialistMatchScore = 30; // default full if no specific specialist requested
      let specialistFound = false;

      if (query.requiredSpecialist && query.requiredSpecialist !== 'General / None') {
        const spec = hosp.specialists.find(s =>
          s.specialization.toLowerCase().includes(query.requiredSpecialist!.toLowerCase()) ||
          query.requiredSpecialist!.toLowerCase().includes(s.specialization.toLowerCase())
        );

        if (spec) {
          if (spec.availability === 'Available') {
            specialistMatchScore = 30;
            specialistFound = true;
          } else if (spec.availability === 'On Call') {
            specialistMatchScore = 20;
            specialistFound = true;
          } else if (spec.availability === 'In Surgery') {
            specialistMatchScore = 10;
          } else {
            specialistMatchScore = 0;
          }
        } else {
          specialistMatchScore = 0;
        }
      } else {
        specialistFound = true;
      }

      // 2. ICU Score (0 - 20 points)
      let icuScore = 20;
      if (query.needICU) {
        if (hosp.icuAvailable >= 5) icuScore = 20;
        else if (hosp.icuAvailable >= 1) icuScore = 14;
        else icuScore = 0;
      } else {
        icuScore = Math.min(20, Math.round((hosp.icuAvailable / Math.max(1, hosp.icuTotal)) * 20));
      }

      // 3. Bed Score (0 - 15 points)
      let bedScore = 15;
      const availRatio = hosp.availableBeds / Math.max(1, hosp.totalBeds);
      if (hosp.availableBeds >= 20) bedScore = 15;
      else if (hosp.availableBeds >= 5) bedScore = 10;
      else if (hosp.availableBeds >= 1) bedScore = 5;
      else bedScore = 0;

      // 4. Travel Time Score (0 - 15 points)
      let travelTimeScore = 15;
      if (travelTime <= 5) travelTimeScore = 15;
      else if (travelTime <= 10) travelTimeScore = 12;
      else if (travelTime <= 20) travelTimeScore = 8;
      else if (travelTime <= 30) travelTimeScore = 4;
      else travelTimeScore = 1;

      // 5. Additional Resource Score (Oxygen, Blood, Ambulance) (0 - 20 points)
      let resourceScore = 0;
      // Oxygen (up to 8 pts)
      if (query.needOxygen) {
        if (hosp.oxygenBedsAvailable > 0 || hosp.oxygenCylinders > 10) resourceScore += 8;
        else resourceScore += 0;
      } else {
        resourceScore += 6;
      }

      // Blood (up to 6 pts)
      if (query.needBlood) {
        const bloodItem = hosp.bloodInventory.find(b => b.bloodGroup === query.needBlood);
        if (bloodItem && bloodItem.unitsAvailable >= 2) resourceScore += 6;
        else if (bloodItem && bloodItem.unitsAvailable > 0) resourceScore += 3;
      } else {
        resourceScore += 4;
      }

      // Ambulance (up to 6 pts)
      if (query.needAmbulance) {
        const availAmb = hosp.ambulances.some(a => a.status === 'Available');
        if (availAmb) resourceScore += 6;
      } else {
        resourceScore += 4;
      }

      const totalScore = Math.min(100, Math.round(specialistMatchScore + icuScore + bedScore + travelTimeScore + resourceScore));
      hosp.aiScore = totalScore;

      // Build explainable reasons
      const matchReasons: string[] = [];
      const warningNotes: string[] = [];

      if (query.requiredSpecialist && specialistFound) {
        matchReasons.push(`Required specialist (${query.requiredSpecialist}) available on emergency duty`);
      } else if (query.requiredSpecialist) {
        warningNotes.push(`Specialist (${query.requiredSpecialist}) is currently unavailable or in surgery`);
      }

      if (query.needICU && hosp.icuAvailable > 0) {
        matchReasons.push(`ICU capacity available (${hosp.icuAvailable} beds open)`);
      } else if (query.needICU) {
        warningNotes.push(`Zero ICU beds currently available`);
      }

      if (hosp.availableBeds > 0) {
        matchReasons.push(`Emergency beds available (${hosp.availableBeds} beds ready)`);
      } else {
        warningNotes.push(`General bed capacity at 100% saturation`);
      }

      if (travelTime <= 10) {
        matchReasons.push(`Rapid emergency response distance (${travelTime} min ETA, ${distance} km)`);
      }

      if (query.needOxygen && (hosp.oxygenBedsAvailable > 0 || hosp.oxygenCylinders > 10)) {
        matchReasons.push(`High oxygen support capacity (${hosp.oxygenBedsAvailable} oxygen beds)`);
      }

      if (hosp.ambulances.some(a => a.status === 'Available')) {
        matchReasons.push(`Stationed ambulance unit available for dispatch`);
      }

      return {
        hospital: hosp,
        score: totalScore,
        matchReasons,
        warningNotes,
        breakdown: {
          specialistMatchScore,
          icuScore,
          bedScore,
          travelTimeScore,
          resourceScore
        }
      };
    });

    // Sort descending by recommendation score
    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Future-ready machine learning demand prediction simulator
   * Projects bed, ICU, and resource depletion rates for the next 4 hours
   */
  public predictHospitalDemand(hospital: Hospital) {
    const occupancyRate = (hospital.occupiedBeds / Math.max(1, hospital.totalBeds)) * 100;
    let surgeRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
    let predictedDepletionHours = 12;

    if (occupancyRate > 90) {
      surgeRisk = 'CRITICAL';
      predictedDepletionHours = 1.2;
    } else if (occupancyRate > 80) {
      surgeRisk = 'HIGH';
      predictedDepletionHours = 3.5;
    } else if (occupancyRate > 65) {
      surgeRisk = 'MODERATE';
      predictedDepletionHours = 6.0;
    }

    return {
      hospitalId: hospital.id,
      currentOccupancyRatePct: Math.round(occupancyRate),
      surgeRiskLevel: surgeRisk,
      estimatedDepletionTimeHours: predictedDepletionHours,
      recommendedPreemptiveReallocation: surgeRisk === 'CRITICAL' ? 'Divert non-emergency trauma cases' : 'Maintain normal triage'
    };
  }
}

export const aiRecommendationService = new AIRecommendationService();
