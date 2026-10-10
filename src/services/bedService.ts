import { Bed, WardType } from '../types';
import { realtimeService } from './realtimeService';

export class BedService {
  public getBedsByHospital(hospitalId: string): Bed[] {
    return realtimeService.getBedsForHospital(hospitalId);
  }

  public filterBeds(beds: Bed[], wardFilter?: WardType | 'All', statusFilter?: Bed['status'] | 'All'): Bed[] {
    return beds.filter(b => {
      const matchWard = !wardFilter || wardFilter === 'All' || b.ward.toLowerCase().trim() === wardFilter.toLowerCase().trim();
      const matchStatus = !statusFilter || statusFilter === 'All' || b.status.toLowerCase().trim() === statusFilter.toLowerCase().trim();
      return matchWard && matchStatus;
    });
  }

  public updateBedStatus(hospitalId: string, bedId: string, status: Bed['status'], patientId?: string | null): Bed | null {
    return realtimeService.updateBedStatus(hospitalId, bedId, status, patientId);
  }

  public simulateAdmission(hospitalId: string): { bed: Bed; hospitalName: string } | null {
    const beds = this.getBedsByHospital(hospitalId);
    const availableBed = beds.find(b => b.status === 'Available');
    if (!availableBed) return null;

    const patientId = `PAT-${Math.floor(100 + Math.random() * 900)}`;
    const updated = realtimeService.updateBedStatus(hospitalId, availableBed.id, 'Occupied', patientId);
    const hospital = realtimeService.getHospitalById(hospitalId);

    if (updated && hospital) {
      return { bed: updated, hospitalName: hospital.name };
    }
    return null;
  }

  public simulateDischarge(hospitalId: string): { bed: Bed; hospitalName: string } | null {
    const beds = this.getBedsByHospital(hospitalId);
    const occupiedBed = beds.find(b => b.status === 'Occupied');
    if (!occupiedBed) return null;

    const updated = realtimeService.updateBedStatus(hospitalId, occupiedBed.id, 'Available', null);
    const hospital = realtimeService.getHospitalById(hospitalId);

    if (updated && hospital) {
      return { bed: updated, hospitalName: hospital.name };
    }
    return null;
  }
}

export const bedService = new BedService();
