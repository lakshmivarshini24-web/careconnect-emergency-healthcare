import { BloodRequest, Donor } from '../types';
import { realtimeService } from './realtimeService';
import { initialDonors } from '../data/dummyHospitals';

export class BloodService {
  private donors: Donor[] = initialDonors;

  public getBloodRequests(): BloodRequest[] {
    return realtimeService.getBloodRequests();
  }

  public createBloodRequest(data: Omit<BloodRequest, 'id' | 'createdAt' | 'status'>): BloodRequest {
    return realtimeService.addBloodRequest(data);
  }

  public updateRequestStatus(requestId: string, status: BloodRequest['status'], donorName?: string) {
    realtimeService.updateBloodRequestStatus(requestId, status, donorName);
  }

  public getDonors(): Donor[] {
    return this.donors;
  }

  public registerDonor(donor: Omit<Donor, 'id'>): Donor {
    const newDonor: Donor = {
      ...donor,
      id: `donor-${Date.now()}`
    };
    this.donors.push(newDonor);
    return newDonor;
  }

  public updateBloodStock(hospitalId: string, bloodGroup: string, newUnits: number) {
    realtimeService.updateBloodStock(hospitalId, bloodGroup, newUnits);
  }
}

export const bloodService = new BloodService();
