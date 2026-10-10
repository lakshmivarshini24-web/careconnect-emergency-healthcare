/**
 * CareConnect - Judge Demo Mode & Data Isolation Test Suite
 * SITAMS × HACKSPHERE 2026 Hackathon Verification
 */

// 1. Setup Browser Mocks for Node testing environment
class MockStorage {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] !== undefined ? this.store[key] : null;
  }
  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }
  removeItem(key: string): void {
    delete this.store[key];
  }
  clear(): void {
    this.store = {};
  }
}

const mockLocalStorage = new MockStorage();
const mockSessionStorage = new MockStorage();

(global as any).localStorage = mockLocalStorage;
(global as any).sessionStorage = mockSessionStorage;
(global as any).window = {
  BroadcastChannel: class {
    name: string;
    onmessage: any = null;
    constructor(name: string) { this.name = name; }
    postMessage(_data: any) {}
    close() {}
  }
};
(global as any).BroadcastChannel = (global as any).window.BroadcastChannel;

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAIL [Test ${totalTests}]: ${testName}`);
    if (detail) console.error(`   Details: ${detail}`);
    process.exitCode = 1;
  } else {
    passedTests++;
    console.log(`✅ PASS [Test ${totalTests}]: ${testName}`);
  }
}

async function runVerification() {
  console.log('================================================================');
  console.log(' CareConnect: SITAMS × HACKSPHERE Judge Demo Mode Test Suite');
  console.log('================================================================\n');

  // Import services
  const { authService } = await import('../src/services/authService');
  const { realtimeService } = await import('../src/services/realtimeService');
  const { dataService } = await import('../src/services/dataService');

  // --- Test 1: Real Staff Login Rejection with Security Notice ---
  const authAttempt1 = authService.attemptStaffLogin('judge@hackathon.org', 'arbitraryPassword123');
  assert(
    authAttempt1.success === false && authAttempt1.message.includes('enterprise identity provider') && authAttempt1.message.includes('Judge Demo Mode'),
    'Test 1: Real staff login rejects arbitrary credentials with enterprise SSO explanatory notice'
  );

  const authAttemptBlank = authService.attemptStaffLogin('', '');
  assert(
    authAttemptBlank.success === false && authAttemptBlank.message.includes('both staff email and password'),
    'Test 1b: Blank staff credentials show required fields notice'
  );

  // --- Test 2: Initial unauthenticated state & Route Guard ---
  assert(
    authService.getSession() === null,
    'Test 2: Unauthenticated state has null session (triggers redirect to /hospital-admin/login)'
  );
  assert(
    realtimeService.getMode() === 'live',
    'Test 2b: Default data mode is live production namespace'
  );

  // --- Test 3: Judge Demo Invalid Email Validation ---
  const invalidDemoAttempt = authService.enterJudgeDemo('not-a-valid-email');
  assert(
    invalidDemoAttempt.success === false && Boolean(invalidDemoAttempt.error?.includes('valid email address')),
    'Test 3: Entering Judge Demo with invalid email syntax returns validation error'
  );
  assert(
    authService.getSession() === null,
    'Test 3b: Session remains null after invalid demo email input'
  );

  // --- Test 4: Entering Judge Demo without Email (Guest Judge) ---
  const guestDemoAttempt = authService.enterJudgeDemo('');
  assert(
    guestDemoAttempt.success === true && guestDemoAttempt.session?.isJudgeDemo === true,
    'Test 4: Entering Judge Demo without email succeeds immediately'
  );
  assert(
    guestDemoAttempt.session?.displayName === 'Hackathon Judge (Guest)' && guestDemoAttempt.session?.email === undefined,
    'Test 4b: Guest Judge receives generic evaluator label without pretending to be staff'
  );
  assert(
    realtimeService.getMode() === 'demo',
    'Test 4c: Realtime service automatically activates demo data mode'
  );

  // Logout before testing named judge
  authService.logout();
  assert(
    authService.getSession() === null && realtimeService.getMode() === 'live',
    'Test 4d: Logout clears session and restores live data mode'
  );

  // --- Test 5: Entering Judge Demo with Valid Email ---
  const namedDemoAttempt = authService.enterJudgeDemo('judge.lead@sitams.edu');
  assert(
    namedDemoAttempt.success === true && namedDemoAttempt.session?.email === 'judge.lead@sitams.edu',
    'Test 5: Entering Judge Demo with valid email captures judge email for session badge'
  );
  assert(
    namedDemoAttempt.session?.isJudgeDemo === true,
    'Test 5b: Session is explicitly marked as isJudgeDemo: true'
  );
  assert(
    realtimeService.getMode() === 'demo',
    'Test 5c: Data mode is switched to demo namespace'
  );

  // --- Test 6: Data Store Isolation (Demo changes do NOT touch Live Store) ---
  // Seed live store with known baseline
  mockLocalStorage.setItem('careconnect_hospitals', JSON.stringify([{ id: 'hosp-001', name: 'Live Hospital', availableBeds: 50, occupiedBeds: 50, totalBeds: 100 }]));
  mockLocalStorage.setItem('careconnect_beds', JSON.stringify({ 'hosp-001': [{ id: 'BED-001', hospitalId: 'hosp-001', status: 'Available', ward: 'Emergency', type: 'Standard', lastUpdated: '' }] }));

  // In demo mode, fetch hospitals and perform admission simulation
  const demoHospitalsBefore = await dataService.getHospitals();
  const demoHosp1Before = demoHospitalsBefore.find(h => h.id === 'hosp-001')!;
  const availableBedsBefore = demoHosp1Before.availableBeds;
  const occupiedBedsBefore = demoHosp1Before.occupiedBeds;

  // Simulate admission in Demo mode
  const admissionRes = await dataService.simulateAdmission('hosp-001');
  assert(
    admissionRes !== null && admissionRes.bed.status === 'Occupied',
    'Test 6: Emergency admission simulation occupies a bed in demo mode'
  );

  const demoHospitalsAfter = await dataService.getHospitals();
  const demoHosp1After = demoHospitalsAfter.find(h => h.id === 'hosp-001')!;
  assert(
    demoHosp1After.availableBeds === availableBedsBefore - 1 && demoHosp1After.occupiedBeds === occupiedBedsBefore + 1,
    'Test 6b: Hospital bed counts reflect simulated emergency admission'
  );

  // CRITICAL CHECK: Verify live storage keys were NOT touched!
  const liveHospitalsRaw = mockLocalStorage.getItem('careconnect_hospitals');
  const liveHospitals = JSON.parse(liveHospitalsRaw!);
  assert(
    liveHospitals[0].availableBeds === 50 && liveHospitals[0].occupiedBeds === 50,
    'Test 6c: CRITICAL - Live hospital store is completely untouched by demo admissions'
  );
  assert(
    mockLocalStorage.getItem('careconnect_demo_hospitals') !== null,
    'Test 6d: Demo mutations are strictly written to careconnect_demo_* keys'
  );

  // --- Test 7: Patient Discharge Simulation ---
  const dischargeRes = await dataService.simulateDischarge('hosp-001');
  assert(
    dischargeRes !== null && dischargeRes.bed.status === 'Available',
    'Test 7: Patient discharge simulation frees a bed in demo mode'
  );

  const demoHospDischarged = (await dataService.getHospitals()).find(h => h.id === 'hosp-001')!;
  assert(
    demoHospDischarged.availableBeds === availableBedsBefore && demoHospDischarged.occupiedBeds === occupiedBedsBefore,
    'Test 7b: Bed counts recover after patient discharge'
  );

  // --- Test 8: ICU Capacity Controls in Demo Mode ---
  const icuAvailableBefore = demoHospDischarged.icuAvailable;
  await dataService.updateICUCapacity('hosp-001', -1);
  const demoHospICU = (await dataService.getHospitals()).find(h => h.id === 'hosp-001')!;
  assert(
    demoHospICU.icuAvailable === icuAvailableBefore - 1,
    'Test 8: ICU capacity control updates demo ICU availability'
  );

  // --- Test 9: Reset Baseline in Demo Mode ---
  dataService.resetDemoData();
  const demoHospReset = (await dataService.getHospitals()).find(h => h.id === 'hosp-001')!;
  assert(
    demoHospReset.icuAvailable === icuAvailableBefore,
    'Test 9: Reset Baseline returns demo hospital values to initial baseline'
  );
  // Live storage remains unharmed
  const liveHospitalsAfterReset = JSON.parse(mockLocalStorage.getItem('careconnect_hospitals')!);
  assert(
    liveHospitalsAfterReset[0].availableBeds === 50,
    'Test 9b: Reset Baseline did not alter or clear production live store'
  );

  // --- Test 10: Exit Demo / Logout Restoration ---
  authService.logout();
  assert(
    authService.getSession() === null,
    'Test 10: Logout clears session storage'
  );
  assert(
    realtimeService.getMode() === 'live',
    'Test 10b: Exiting demo restores realtimeService to live mode'
  );

  const restoredHospitals = await dataService.getHospitals();
  assert(
    restoredHospitals[0].name === 'Live Hospital' && restoredHospitals[0].totalBeds === 1,
    'Test 10c: Public live view loads from production live store after demo exit',
    `Expected 'Live Hospital' with totalBeds 1, got name: '${restoredHospitals[0]?.name}', totalBeds: ${restoredHospitals[0]?.totalBeds}`
  );

  console.log('\n================================================================');
  console.log(` Results: ${passedTests}/${totalTests} tests passed successfully!`);
  console.log('================================================================\n');

  if (process.exitCode === 1) {
    process.exit(1);
  }
}

runVerification().catch(err => {
  console.error('Fatal verification error:', err);
  process.exit(1);
});
