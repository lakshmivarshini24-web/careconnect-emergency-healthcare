import { Hospital } from '../types';
import { realtimeService } from './realtimeService';

export class HospitalService {
  public getAllHospitals(): Hospital[] {
    return realtimeService.getHospitals();
  }

  public getHospitalById(id: string): Hospital | undefined {
    return realtimeService.getHospitalById(id);
  }

  public searchHospitals(query: string): Hospital[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.getAllHospitals();

    return this.getAllHospitals().filter(h =>
      h.name.toLowerCase().includes(q) ||
      h.address.toLowerCase().includes(q) ||
      h.specialists.some(s => s.specialization.toLowerCase().includes(q) || s.doctorName.toLowerCase().includes(q)) ||
      h.bloodInventory.some(b => b.bloodGroup.toLowerCase().includes(q))
    );
  }

  public getHospitalsSortedByBeds(): Hospital[] {
    return this.getAllHospitals().sort((a, b) => b.availableBeds - a.availableBeds);
  }

  public getHospitalsSortedByICU(): Hospital[] {
    return this.getAllHospitals().sort((a, b) => b.icuAvailable - a.icuAvailable);
  }

  public getHospitalsSortedByOxygen(): Hospital[] {
    return this.getAllHospitals().sort((a, b) => b.oxygenBedsAvailable - a.oxygenBedsAvailable);
  }

  public getHospitalsByBloodGroup(group: string): Hospital[] {
    return this.getAllHospitals()
      .filter(h => {
        const item = h.bloodInventory.find(b => b.bloodGroup === group);
        return item && item.unitsAvailable > 0;
      })
      .sort((a, b) => {
        const unitsA = a.bloodInventory.find(b => b.bloodGroup === group)?.unitsAvailable || 0;
        const unitsB = b.bloodInventory.find(b => b.bloodGroup === group)?.unitsAvailable || 0;
        return unitsB - unitsA;
      });
  }
}

export const hospitalService = new HospitalService();
