import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { useRealtimeData } from './hooks/useRealtimeData';
import { UserRole } from './types';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { HospitalsPage } from './pages/HospitalsPage';
import { HospitalDetailPage } from './pages/HospitalDetailPage';
import { BedsPage } from './pages/BedsPage';
import { ICUPage } from './pages/ICUPage';
import { OxygenPage } from './pages/OxygenPage';
import { BloodPage } from './pages/BloodPage';
import { BloodRequestPage } from './pages/BloodRequestPage';
import { DonorPage } from './pages/DonorPage';
import { SpecialistsPage } from './pages/SpecialistsPage';
import { AmbulancesPage } from './pages/AmbulancesPage';
import { EmergencyPage } from './pages/EmergencyPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { DemoPage } from './pages/DemoPage';

export function App() {
  const { isConnected, lastUpdated } = useRealtimeData();
  const [activeRole, setActiveRole] = useState<UserRole>('patient');

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
        {/* Realtime Toast Notification Alerts */}
        <ToastContainer />

        {/* Global Navigation Header */}
        <Navbar
          isConnected={isConnected}
          lastUpdated={lastUpdated}
          activeRole={activeRole}
          onRoleChange={setActiveRole}
        />

        {/* Main Content Area */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/hospitals" element={<HospitalsPage />} />
            <Route path="/hospitals/:id" element={<HospitalDetailPage />} />
            <Route path="/beds" element={<BedsPage />} />
            <Route path="/icu" element={<ICUPage />} />
            <Route path="/oxygen" element={<OxygenPage />} />
            <Route path="/blood" element={<BloodPage />} />
            <Route path="/blood/request" element={<BloodRequestPage />} />
            <Route path="/donors" element={<DonorPage />} />
            <Route path="/specialists" element={<SpecialistsPage />} />
            <Route path="/ambulances" element={<AmbulancesPage />} />
            <Route path="/emergency" element={<EmergencyPage />} />
            <Route path="/hospital-admin" element={<AdminDashboardPage />} />
            <Route path="/demo" element={<DemoPage />} />
          </Routes>
        </main>

        {/* System Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
