import { Hospital, Bed, BloodRequest, Donor, WardType } from '../types';

// Helper to generate realistic bed list for a hospital
function generateBeds(hospitalId: string, count: number, icuCount: number, emergencyCount: number): Bed[] {
  const beds: Bed[] = [];
  const wards: WardType[] = ['General', 'Emergency', 'ICU', 'Pediatric', 'Maternity', 'Isolation'];
  
  for (let i = 1; i <= count; i++) {
    const padNum = i.toString().padStart(3, '0');
    let ward: WardType = 'General';
    let type = 'Standard Bed';
    
    if (i <= emergencyCount) {
      ward = 'Emergency';
      type = 'Emergency Trauma Bed';
    } else if (i <= emergencyCount + icuCount) {
      ward = 'ICU';
      type = i % 2 === 0 ? 'ICU Ventilator Bed' : 'ICU Critical Care Bed';
    } else if (i % 7 === 0) {
      ward = 'Pediatric';
      type = 'Pediatric Care Bed';
    } else if (i % 9 === 0) {
      ward = 'Maternity';
      type = 'Maternity Bed';
    } else if (i % 11 === 0) {
      ward = 'Isolation';
      type = 'Negative Pressure Isolation';
    }

    // Determine initial status (approx 65-75% occupied for realism)
    const isOccupied = (i * 17 + count) % 3 !== 0; // realistic pattern
    const isMaintenance = !isOccupied && (i % 23 === 0);
    const status = isMaintenance ? 'Maintenance' : (isOccupied ? 'Occupied' : 'Available');

    beds.push({
      id: `BED-${padNum}`,
      hospitalId,
      ward,
      type,
      status,
      patientId: status === 'Occupied' ? `PAT-${(100 + (i * 7) % 899).toString()}` : null,
      lastUpdated: new Date(Date.now() - (i * 180000)).toISOString()
    });
  }
  return beds;
}

export const initialHospitals: Hospital[] = [
  {
    id: 'hosp-001',
    name: 'City Care Hospital',
    address: '45 Healthcare Boulevard, Metro Central',
    latitude: 12.9716,
    longitude: 77.5946,
    phone: '+1 (555) 019-2834',
    emergencyStatus: 'Active',
    totalBeds: 100,
    availableBeds: 35,
    occupiedBeds: 63,
    icuTotal: 20,
    icuAvailable: 8,
    oxygenBedsTotal: 50,
    oxygenBedsAvailable: 18,
    ventilatorsTotal: 15,
    ventilatorsAvailable: 6,
    oxygenCylinders: 45,
    bloodInventory: [
      { bloodGroup: 'A+', unitsAvailable: 14, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'A-', unitsAvailable: 4, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'B+', unitsAvailable: 18, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'B-', unitsAvailable: 6, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'AB+', unitsAvailable: 8, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'AB-', unitsAvailable: 2, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'O+', unitsAvailable: 22, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'O-', unitsAvailable: 5, lastUpdated: new Date().toISOString() }
    ],
    specialists: [
      { id: 'spec-101', hospitalId: 'hosp-001', specialization: 'Cardiologist', doctorName: 'Dr. Sarah Jenkins', availability: 'Available', emergencyAvailable: true, phone: '+1 (555) 901-1122', lastUpdated: new Date().toISOString() },
      { id: 'spec-102', hospitalId: 'hosp-001', specialization: 'Neurologist', doctorName: 'Dr. Robert Vance', availability: 'On Call', emergencyAvailable: true, phone: '+1 (555) 901-1123', lastUpdated: new Date().toISOString() },
      { id: 'spec-103', hospitalId: 'hosp-001', specialization: 'Pulmonologist', doctorName: 'Dr. Elena Rostova', availability: 'Available', emergencyAvailable: true, phone: '+1 (555) 901-1124', lastUpdated: new Date().toISOString() },
      { id: 'spec-104', hospitalId: 'hosp-001', specialization: 'General Surgeon', doctorName: 'Dr. Marcus Brody', availability: 'Available', emergencyAvailable: true, phone: '+1 (555) 901-1125', lastUpdated: new Date().toISOString() },
      { id: 'spec-105', hospitalId: 'hosp-001', specialization: 'Orthopedic', doctorName: 'Dr. Anita Roy', availability: 'In Surgery', emergencyAvailable: false, phone: '+1 (555) 901-1126', lastUpdated: new Date().toISOString() }
    ],
    ambulances: [
      { id: 'AMB-101', hospitalId: 'hosp-001', driverName: 'John Miller', driverPhone: '+1 (555) 444-0101', type: 'Advanced Life Support (ALS)', status: 'Available', latitude: 12.9725, longitude: 77.5955, currentAddress: 'Base Station - City Care', lastUpdated: new Date().toISOString() },
      { id: 'AMB-102', hospitalId: 'hosp-001', driverName: 'David Lee', driverPhone: '+1 (555) 444-0102', type: 'Basic Life Support (BLS)', status: 'Available', latitude: 12.9690, longitude: 77.5920, currentAddress: 'Market Square Stand', lastUpdated: new Date().toISOString() }
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'hosp-002',
    name: 'Government General Hospital',
    address: '100 Civil Lines Road, North District',
    latitude: 12.9850,
    longitude: 77.6050,
    phone: '+1 (555) 018-9922',
    emergencyStatus: 'High Volume',
    totalBeds: 150,
    availableBeds: 19,
    occupiedBeds: 128,
    icuTotal: 30,
    icuAvailable: 3,
    oxygenBedsTotal: 80,
    oxygenBedsAvailable: 9,
    ventilatorsTotal: 25,
    ventilatorsAvailable: 2,
    oxygenCylinders: 70,
    bloodInventory: [
      { bloodGroup: 'A+', unitsAvailable: 25, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'A-', unitsAvailable: 8, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'B+', unitsAvailable: 30, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'B-', unitsAvailable: 10, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'AB+', unitsAvailable: 15, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'AB-', unitsAvailable: 3, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'O+', unitsAvailable: 40, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'O-', unitsAvailable: 12, lastUpdated: new Date().toISOString() }
    ],
    specialists: [
      { id: 'spec-201', hospitalId: 'hosp-002', specialization: 'General Physician', doctorName: 'Dr. Arthur Pendelton', availability: 'Available', emergencyAvailable: true, phone: '+1 (555) 902-2211', lastUpdated: new Date().toISOString() },
      { id: 'spec-202', hospitalId: 'hosp-002', specialization: 'Pediatrician', doctorName: 'Dr. Priya Sharma', availability: 'Available', emergencyAvailable: true, phone: '+1 (555) 902-2212', lastUpdated: new Date().toISOString() },
      { id: 'spec-203', hospitalId: 'hosp-002', specialization: 'Gynecologist', doctorName: 'Dr. Maria Santos', availability: 'On Call', emergencyAvailable: true, phone: '+1 (555) 902-2213', lastUpdated: new Date().toISOString() },
      { id: 'spec-204', hospitalId: 'hosp-002', specialization: 'Nephrologist', doctorName: 'Dr. Kenneth Wu', availability: 'Unavailable', emergencyAvailable: false, phone: '+1 (555) 902-2214', lastUpdated: new Date().toISOString() }
    ],
    ambulances: [
      { id: 'AMB-201', hospitalId: 'hosp-002', driverName: 'Carlos Ray', driverPhone: '+1 (555) 444-0201', type: 'Basic Life Support (BLS)', status: 'On Trip', latitude: 12.9810, longitude: 77.6010, currentAddress: 'En route to Civil Lines Trauma', destination: 'Govt Gen ER', lastUpdated: new Date().toISOString() },
      { id: 'AMB-202', hospitalId: 'hosp-002', driverName: 'Frank Gomez', driverPhone: '+1 (555) 444-0202', type: 'Advanced Life Support (ALS)', status: 'Available', latitude: 12.9860, longitude: 77.6070, currentAddress: 'North Gate Depot', lastUpdated: new Date().toISOString() }
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'hosp-003',
    name: 'LifePlus Multispecialty Hospital',
    address: '12 Tech Park Avenue, Silicon Sector',
    latitude: 12.9350,
    longitude: 77.6240,
    phone: '+1 (555) 012-3344',
    emergencyStatus: 'Active',
    totalBeds: 120,
    availableBeds: 42,
    occupiedBeds: 75,
    icuTotal: 25,
    icuAvailable: 11,
    oxygenBedsTotal: 60,
    oxygenBedsAvailable: 24,
    ventilatorsTotal: 18,
    ventilatorsAvailable: 9,
    oxygenCylinders: 60,
    bloodInventory: [
      { bloodGroup: 'A+', unitsAvailable: 10, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'A-', unitsAvailable: 2, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'B+', unitsAvailable: 12, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'B-', unitsAvailable: 0, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'AB+', unitsAvailable: 5, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'AB-', unitsAvailable: 1, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'O+', unitsAvailable: 16, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'O-', unitsAvailable: 3, lastUpdated: new Date().toISOString() }
    ],
    specialists: [
      { id: 'spec-301', hospitalId: 'hosp-003', specialization: 'Cardiologist', doctorName: 'Dr. Michael Chang', availability: 'Available', emergencyAvailable: true, phone: '+1 (555) 903-3301', lastUpdated: new Date().toISOString() },
      { id: 'spec-302', hospitalId: 'hosp-003', specialization: 'Neurologist', doctorName: 'Dr. Sophia Loren', availability: 'Available', emergencyAvailable: true, phone: '+1 (555) 903-3302', lastUpdated: new Date().toISOString() },
      { id: 'spec-303', hospitalId: 'hosp-003', specialization: 'Oncologist', doctorName: 'Dr. David Sterling', availability: 'On Call', emergencyAvailable: false, phone: '+1 (555) 903-3303', lastUpdated: new Date().toISOString() },
      { id: 'spec-304', hospitalId: 'hosp-003', specialization: 'General Surgeon', doctorName: 'Dr. Rachel Adams', availability: 'Available', emergencyAvailable: true, phone: '+1 (555) 903-3304', lastUpdated: new Date().toISOString() }
    ],
    ambulances: [
      { id: 'AMB-301', hospitalId: 'hosp-003', driverName: 'Sanjay Patel', driverPhone: '+1 (555) 444-0301', type: 'Advanced Life Support (ALS)', status: 'Available', latitude: 12.9360, longitude: 77.6250, currentAddress: 'LifePlus Bay 1', lastUpdated: new Date().toISOString() }
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'hosp-004',
    name: 'Sunrise Hospital & Care',
    address: '88 Green Valley Road, South Suburbs',
    latitude: 12.9120,
    longitude: 77.5810,
    phone: '+1 (555) 016-5577',
    emergencyStatus: 'Active',
    totalBeds: 80,
    availableBeds: 28,
    occupiedBeds: 50,
    icuTotal: 15,
    icuAvailable: 6,
    oxygenBedsTotal: 40,
    oxygenBedsAvailable: 14,
    ventilatorsTotal: 10,
    ventilatorsAvailable: 4,
    oxygenCylinders: 35,
    bloodInventory: [
      { bloodGroup: 'A+', unitsAvailable: 6, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'A-', unitsAvailable: 1, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'B+', unitsAvailable: 8, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'B-', unitsAvailable: 2, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'AB+', unitsAvailable: 3, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'AB-', unitsAvailable: 0, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'O+', unitsAvailable: 11, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'O-', unitsAvailable: 2, lastUpdated: new Date().toISOString() }
    ],
    specialists: [
      { id: 'spec-401', hospitalId: 'hosp-004', specialization: 'Gynecologist', doctorName: 'Dr. Rebecca Nurse', availability: 'Available', emergencyAvailable: true, phone: '+1 (555) 904-4401', lastUpdated: new Date().toISOString() },
      { id: 'spec-402', hospitalId: 'hosp-004', specialization: 'Pediatrician', doctorName: 'Dr. Jonathan Swift', availability: 'Available', emergencyAvailable: true, phone: '+1 (555) 904-4402', lastUpdated: new Date().toISOString() },
      { id: 'spec-403', hospitalId: 'hosp-004', specialization: 'Orthopedic', doctorName: 'Dr. James Cobb', availability: 'On Call', emergencyAvailable: true, phone: '+1 (555) 904-4403', lastUpdated: new Date().toISOString() }
    ],
    ambulances: [
      { id: 'AMB-401', hospitalId: 'hosp-004', driverName: 'Thomas Wright', driverPhone: '+1 (555) 444-0401', type: 'Neonatal ICU', status: 'Available', latitude: 12.9130, longitude: 77.5820, currentAddress: 'Sunrise ER Dock', lastUpdated: new Date().toISOString() }
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'hosp-005',
    name: 'Medicare Super Specialty Hospital',
    address: '204 Airport Road, East Corridor',
    latitude: 12.9600,
    longitude: 77.6480,
    phone: '+1 (555) 011-8833',
    emergencyStatus: 'Active',
    totalBeds: 100,
    availableBeds: 31,
    occupiedBeds: 67,
    icuTotal: 22,
    icuAvailable: 7,
    oxygenBedsTotal: 55,
    oxygenBedsAvailable: 21,
    ventilatorsTotal: 16,
    ventilatorsAvailable: 5,
    oxygenCylinders: 50,
    bloodInventory: [
      { bloodGroup: 'A+', unitsAvailable: 12, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'A-', unitsAvailable: 3, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'B+', unitsAvailable: 15, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'B-', unitsAvailable: 5, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'AB+', unitsAvailable: 7, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'AB-', unitsAvailable: 2, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'O+', unitsAvailable: 19, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'O-', unitsAvailable: 4, lastUpdated: new Date().toISOString() }
    ],
    specialists: [
      { id: 'spec-501', hospitalId: 'hosp-005', specialization: 'Pulmonologist', doctorName: 'Dr. Vikram Patel', availability: 'Available', emergencyAvailable: true, phone: '+1 (555) 905-5501', lastUpdated: new Date().toISOString() },
      { id: 'spec-502', hospitalId: 'hosp-005', specialization: 'Nephrologist', doctorName: 'Dr. Karen White', availability: 'Available', emergencyAvailable: true, phone: '+1 (555) 905-5502', lastUpdated: new Date().toISOString() },
      { id: 'spec-503', hospitalId: 'hosp-005', specialization: 'Cardiologist', doctorName: 'Dr. Alan Grant', availability: 'In Surgery', emergencyAvailable: false, phone: '+1 (555) 905-5503', lastUpdated: new Date().toISOString() }
    ],
    ambulances: [
      { id: 'AMB-501', hospitalId: 'hosp-005', driverName: 'Robert Paul', driverPhone: '+1 (555) 444-0501', type: 'Advanced Life Support (ALS)', status: 'Available', latitude: 12.9610, longitude: 77.6490, currentAddress: 'Airport Road Station', lastUpdated: new Date().toISOString() }
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'hosp-006',
    name: 'HealthFirst Emergency Hospital',
    address: '77 Ring Road Bypass, West Node',
    latitude: 12.9510,
    longitude: 77.5420,
    phone: '+1 (555) 014-6622',
    emergencyStatus: 'Critical Only',
    totalBeds: 75,
    availableBeds: 12,
    occupiedBeds: 62,
    icuTotal: 18,
    icuAvailable: 2,
    oxygenBedsTotal: 40,
    oxygenBedsAvailable: 5,
    ventilatorsTotal: 12,
    ventilatorsAvailable: 1,
    oxygenCylinders: 25,
    bloodInventory: [
      { bloodGroup: 'A+', unitsAvailable: 5, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'A-', unitsAvailable: 0, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'B+', unitsAvailable: 7, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'B-', unitsAvailable: 1, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'AB+', unitsAvailable: 2, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'AB-', unitsAvailable: 0, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'O+', unitsAvailable: 9, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'O-', unitsAvailable: 1, lastUpdated: new Date().toISOString() }
    ],
    specialists: [
      { id: 'spec-601', hospitalId: 'hosp-006', specialization: 'General Surgeon', doctorName: 'Dr. Sean O\'Connor', availability: 'Available', emergencyAvailable: true, phone: '+1 (555) 906-6601', lastUpdated: new Date().toISOString() },
      { id: 'spec-602', hospitalId: 'hosp-006', specialization: 'Cardiologist', doctorName: 'Dr. Linda Carter', availability: 'On Call', emergencyAvailable: true, phone: '+1 (555) 906-6602', lastUpdated: new Date().toISOString() }
    ],
    ambulances: [
      { id: 'AMB-601', hospitalId: 'hosp-006', driverName: 'Gregory House', driverPhone: '+1 (555) 444-0601', type: 'Advanced Life Support (ALS)', status: 'Assigned', latitude: 12.9520, longitude: 77.5430, currentAddress: 'Dispatched to Highway Accident', destination: 'HealthFirst Trauma', lastUpdated: new Date().toISOString() }
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'hosp-007',
    name: 'Apollo-style City Hospital',
    address: '1 Prime Medical Expressway, Metro North',
    latitude: 13.0100,
    longitude: 77.5900,
    phone: '+1 (555) 019-9900',
    emergencyStatus: 'Active',
    totalBeds: 200,
    availableBeds: 62,
    occupiedBeds: 134,
    icuTotal: 40,
    icuAvailable: 16,
    oxygenBedsTotal: 110,
    oxygenBedsAvailable: 38,
    ventilatorsTotal: 30,
    ventilatorsAvailable: 12,
    oxygenCylinders: 100,
    bloodInventory: [
      { bloodGroup: 'A+', unitsAvailable: 35, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'A-', unitsAvailable: 12, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'B+', unitsAvailable: 42, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'B-', unitsAvailable: 15, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'AB+', unitsAvailable: 20, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'AB-', unitsAvailable: 6, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'O+', unitsAvailable: 50, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'O-', unitsAvailable: 18, lastUpdated: new Date().toISOString() }
    ],
    specialists: [
      { id: 'spec-701', hospitalId: 'hosp-007', specialization: 'Cardiologist', doctorName: 'Dr. Harold Finch', availability: 'Available', emergencyAvailable: true, phone: '+1 (555) 907-7701', lastUpdated: new Date().toISOString() },
      { id: 'spec-702', hospitalId: 'hosp-007', specialization: 'Neurologist', doctorName: 'Dr. Allison Cameron', availability: 'Available', emergencyAvailable: true, phone: '+1 (555) 907-7702', lastUpdated: new Date().toISOString() },
      { id: 'spec-703', hospitalId: 'hosp-007', specialization: 'Pulmonologist', doctorName: 'Dr. Eric Foreman', availability: 'Available', emergencyAvailable: true, phone: '+1 (555) 907-7703', lastUpdated: new Date().toISOString() },
      { id: 'spec-704', hospitalId: 'hosp-007', specialization: 'Gynecologist', doctorName: 'Dr. Lisa Cuddy', availability: 'Available', emergencyAvailable: true, phone: '+1 (555) 907-7704', lastUpdated: new Date().toISOString() },
      { id: 'spec-705', hospitalId: 'hosp-007', specialization: 'Pediatrician', doctorName: 'Dr. Robert Chase', availability: 'Available', emergencyAvailable: true, phone: '+1 (555) 907-7705', lastUpdated: new Date().toISOString() }
    ],
    ambulances: [
      { id: 'AMB-701', hospitalId: 'hosp-007', driverName: 'Chris Redfield', driverPhone: '+1 (555) 444-0701', type: 'Advanced Life Support (ALS)', status: 'Available', latitude: 13.0110, longitude: 77.5910, currentAddress: 'Apollo Hub Bay A', lastUpdated: new Date().toISOString() },
      { id: 'AMB-702', hospitalId: 'hosp-007', driverName: 'Jill Valentine', driverPhone: '+1 (555) 444-0702', type: 'Advanced Life Support (ALS)', status: 'Available', latitude: 13.0120, longitude: 77.5920, currentAddress: 'Apollo Hub Bay B', lastUpdated: new Date().toISOString() }
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'hosp-008',
    name: 'Community Care Hospital',
    address: '15 Suburbia Cross Road, South East',
    latitude: 12.9200,
    longitude: 77.6600,
    phone: '+1 (555) 013-7744',
    emergencyStatus: 'Active',
    totalBeds: 60,
    availableBeds: 22,
    occupiedBeds: 36,
    icuTotal: 10,
    icuAvailable: 4,
    oxygenBedsTotal: 30,
    oxygenBedsAvailable: 11,
    ventilatorsTotal: 6,
    ventilatorsAvailable: 3,
    oxygenCylinders: 25,
    bloodInventory: [
      { bloodGroup: 'A+', unitsAvailable: 8, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'A-', unitsAvailable: 2, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'B+', unitsAvailable: 9, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'B-', unitsAvailable: 1, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'AB+', unitsAvailable: 4, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'AB-', unitsAvailable: 0, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'O+', unitsAvailable: 12, lastUpdated: new Date().toISOString() },
      { bloodGroup: 'O-', unitsAvailable: 2, lastUpdated: new Date().toISOString() }
    ],
    specialists: [
      { id: 'spec-801', hospitalId: 'hosp-008', specialization: 'General Physician', doctorName: 'Dr. Benjamin Stone', availability: 'Available', emergencyAvailable: true, phone: '+1 (555) 908-8801', lastUpdated: new Date().toISOString() },
      { id: 'spec-802', hospitalId: 'hosp-008', specialization: 'Orthopedic', doctorName: 'Dr. Nancy Drew', availability: 'On Call', emergencyAvailable: true, phone: '+1 (555) 908-8802', lastUpdated: new Date().toISOString() }
    ],
    ambulances: [
      { id: 'AMB-801', hospitalId: 'hosp-008', driverName: 'Mark Taylor', driverPhone: '+1 (555) 444-0801', type: 'Patient Transport', status: 'Available', latitude: 12.9210, longitude: 77.6610, currentAddress: 'Community Care Stand', lastUpdated: new Date().toISOString() }
    ],
    lastUpdated: new Date().toISOString()
  }
];

// Pre-generate individual bed matrices map (hospitalId -> Bed[])
export const initialHospitalBeds: Record<string, Bed[]> = {
  'hosp-001': generateBeds('hosp-001', 100, 20, 15),
  'hosp-002': generateBeds('hosp-002', 150, 30, 20),
  'hosp-003': generateBeds('hosp-003', 120, 25, 15),
  'hosp-004': generateBeds('hosp-004', 80, 15, 10),
  'hosp-005': generateBeds('hosp-005', 100, 22, 12),
  'hosp-006': generateBeds('hosp-006', 75, 18, 10),
  'hosp-007': generateBeds('hosp-007', 200, 40, 25),
  'hosp-008': generateBeds('hosp-008', 60, 10, 8)
};

export const initialBloodRequests: BloodRequest[] = [
  {
    id: 'req-101',
    bloodGroup: 'B+',
    unitsRequired: 2,
    hospitalId: 'hosp-001',
    hospitalName: 'City Care Hospital',
    emergencyLevel: 'CRITICAL',
    contactNumber: '+1 (555) 888-9900',
    location: 'Trauma ICU Bed 004',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'req-102',
    bloodGroup: 'O-',
    unitsRequired: 3,
    hospitalId: 'hosp-007',
    hospitalName: 'Apollo-style City Hospital',
    emergencyLevel: 'CRITICAL',
    contactNumber: '+1 (555) 777-3311',
    location: 'Surgical OT 2',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 7200000).toISOString()
  }
];

export const initialDonors: Donor[] = [
  {
    id: 'donor-001',
    name: 'Alex Mercer',
    bloodGroup: 'B+',
    phone: '+1 (555) 234-5678',
    city: 'Metro City Central',
    isAvailable: true,
    lastDonated: '2025-11-10'
  },
  {
    id: 'donor-002',
    name: 'Samantha Reed',
    bloodGroup: 'O-',
    phone: '+1 (555) 876-5432',
    city: 'North District',
    isAvailable: true,
    lastDonated: '2025-12-01'
  },
  {
    id: 'donor-003',
    name: 'Daniel Kim',
    bloodGroup: 'A+',
    phone: '+1 (555) 345-6789',
    city: 'Silicon Sector',
    isAvailable: true,
    lastDonated: '2026-01-15'
  }
];
