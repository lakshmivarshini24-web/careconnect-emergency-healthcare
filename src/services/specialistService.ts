import { Specialist } from '../types';
import { realtimeService } from './realtimeService';

export class SpecialistService {
  public getAllSpecialists(): (Specialist & { hospitalName: string })[] {
    const hospitals = realtimeService.getHospitals();
    const result: (Specialist & { hospitalName: string })[] = [];

    hospitals.forEach(h => {
      h.specialists.forEach(s => {
        result.push({
          ...s,
          hospitalName: h.name
        });
      });
    });

    return result;
  }

  public getSpecialistsByCategory(category: string): (Specialist & { hospitalName: string })[] {
    const all = this.getAllSpecialists();
    if (!category || category === 'All') return all;

    return all.filter(s => s.specialization.toLowerCase().includes(category.toLowerCase()));
  }

  public updateSpecialistStatus(specialistId: string, availability: Specialist['availability']) {
    realtimeService.updateSpecialistAvailability(specialistId, availability);
  }
}

export const specialistService = new SpecialistService();
