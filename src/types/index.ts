export type BedStatus = 'Available' | 'Occupied' | 'Maintenance';
export type WardType = 'General' | 'Emergency' | 'ICU' | 'Pediatric' | 'Maternity' | 'Isolation';
export type EmergencyStatus = 'Active' | 'High Volume' | 'Critical Only' | 'Full Diversion';
export type AmbulanceStatus = 'Available' | 'Assigned' | 'On Trip' | 'Maintenance';

export interface Bed {
  id: string; // e.g. "BED-001"
  hospitalId: string;
  ward: WardType;
  type: string; // e.g. "Standard", "Ventilator Bed", "Negative Pressure"
  status: BedStatus;
  patientId?: string | null; // e.g. "PAT-104"
  lastUpdated: string;
}

export interface BloodInventoryItem {
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  unitsAvailable: number;
  lastUpdated: string;
}

export interface Specialist {
  id: string;
  hospitalId: string;
  specialization: string; // e.g. "Cardiologist"
  doctorName: string;
  availability: 'Available' | 'On Call' | 'In Surgery' | 'Unavailable';
  emergencyAvailable: boolean;
  phone?: string;
  lastUpdated: string;
}

export interface Ambulance {
  id: string;
  hospitalId: string;
  driverName: string;
  driverPhone: string;
  type: 'Basic Life Support (BLS)' | 'Advanced Life Support (ALS)' | 'Neonatal ICU' | 'Patient Transport';
  status: AmbulanceStatus;
  latitude: number;
  longitude: number;
  currentAddress?: string;
  destination?: string;
  assignedRequestId?: string;
  lastUpdated: string;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  emergencyStatus: EmergencyStatus;
  totalBeds: number;
  availableBeds: number;
  occupiedBeds: number;
  icuTotal: number;
  icuAvailable: number;
  oxygenBedsTotal: number;
  oxygenBedsAvailable: number;
  ventilatorsTotal: number;
  ventilatorsAvailable: number;
  oxygenCylinders: number;
  bloodInventory: BloodInventoryItem[];
  specialists: Specialist[];
  ambulances: Ambulance[];
  lastUpdated: string;
  distanceKm?: number;
  estimatedTravelTimeMin?: number;
  aiScore?: number;
}

export interface BloodRequest {
  id: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  unitsRequired: number;
  hospitalId: string;
  hospitalName: string;
  emergencyLevel: 'CRITICAL' | 'URGENT' | 'STANDARD';
  contactNumber: string;
  location: string;
  status: 'PENDING' | 'FULFILLED' | 'CANCELLED';
  acceptedByDonor?: string;
  createdAt: string;
}

export interface Donor {
  id: string;
  name: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  phone: string;
  city: string;
  isAvailable: boolean;
  lastDonated?: string;
}

export interface EmergencyQuery {
  emergencyType: string;
  userLat: number;
  userLng: number;
  locationName: string;
  patientCondition: string;
  requiredSpecialist?: string;
  needICU: boolean;
  needOxygen: boolean;
  needBlood?: string; // Blood group e.g. "B+"
  needAmbulance: boolean;
}

export interface AIRecommendationResult {
  hospital: Hospital;
  score: number;
  matchReasons: string[];
  warningNotes: string[];
  breakdown: {
    specialistMatchScore: number;
    icuScore: number;
    bedScore: number;
    travelTimeScore: number;
    resourceScore: number;
  };
}

export interface NotificationItem {
  id: string;
  type: 'bed' | 'blood' | 'ambulance' | 'specialist' | 'icu' | 'system';
  message: string;
  hospitalName?: string;
  timestamp: string;
  read: boolean;
}

export type UserRole = 'patient' | 'hospital-staff' | 'donor';

export interface DataServiceConfig {
  sourceType: 'mock' | 'firebase' | 'supabase' | 'sheets' | 'api';
  googleSheetUrl?: string;
  firebaseConfig?: Record<string, string>;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  apiBaseUrl?: string;
}
