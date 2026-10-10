# 🚑 CareConnect – Emergency Healthcare Coordination Platform

**CareConnect** is a functional, modern, real-time emergency healthcare coordination system designed to connect hospitals, patients, blood donors, specialists, and ambulances during critical medical emergencies.

---

## 🌟 Key Features

- 🟢 **Live Zero-Latency Real-Time Data**: Automatically broadcasts bed status, ICU capacity, blood stock, and ambulance dispatches across multiple browser tabs/windows using native browser `BroadcastChannel` & PubSub event engine.
- 🛏 **100-Bed Visual Matrix**: View individual bed status (`Available 🟢`, `Occupied 🔴`, `Maintenance ⚪`), Ward type, Bed ID, and masked patient IDs (`PAT-104`).
- 🏥 **Emergency Decision Matcher**: Transparent scoring engine evaluating specialist match (30%), ICU open capacity (20%), travel time (15%), bed capacity (15%), oxygen (10%), and blood/ambulance (10%).
- 🏥 **ICU & Oxygen Supported Resource Directory**: Sort hospitals by ICU open beds, ventilators, oxygen cylinders, and high-flow nasal cannula units.
- 🩸 **Emergency Blood Bank & Donor Response Network**: Submit emergency blood requests and notify compatible blood donors with real-time accept/decline workflow.
- 🚑 **Ambulance Tracking & Dispatch**: Request nearest available ALS/BLS ambulance unit with live ETA calculation and status tracking.
- 🛠 **Hospital Staff Command Panel & Demo Simulation Room**: Receptionist/admin controls with **Simulate Emergency Admission** & **Simulate Patient Discharge** controls for live hackathon evaluation.
- 🗺 **Interactive GIS Map**: OpenStreetMap Leaflet integration with hospital pins, ambulances, and direction routing.

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React Icons
- **GIS Map**: Leaflet, React-Leaflet
- **Data & Real-Time Sync**: Decoupled `dataService.ts` abstraction layer + `BroadcastChannel` PubSub Sync Engine + LocalStorage persistence
- **Routing**: React Router DOM v7

---

## 🚀 How to Run locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Clean Architecture Project Structure

```
src/
├── types/                # Core TypeScript interfaces (Hospital, Bed, BloodRequest, Specialist, Ambulance)
├── data/                 # Realistic dummy dataset (8 Metro hospitals + 100s of individual beds)
├── services/
│   ├── realtimeService.ts   # Multi-tab BroadcastChannel & PubSub event sync engine
│   ├── hospitalService.ts   # Hospital query & sorting operations
│   ├── bedService.ts        # Bed matrix operations & admission/discharge simulation
│   ├── bloodService.ts      # Blood inventory & emergency request workflow
│   ├── specialistService.ts# Specialist doctor availability tracker
│   ├── ambulanceService.ts # Ambulance tracking & dispatching
│   ├── aiRecommendationService.ts # Multi-criteria recommendation scoring algorithm
│   └── dataService.ts       # Central facade abstraction layer (Pluggable for Google Sheets / Firebase / Supabase)
├── hooks/
│   ├── useRealtimeData.ts   # React hook for live data subscriptions
│   └── useNotifications.ts  # React hook for floating toast alerts
├── components/
│   ├── common/              # Navbar, Footer, LiveIndicator, ToastContainer
│   ├── hospital/            # HospitalCard, BedMatrix (100-bed grid)
│   └── map/                 # HospitalMap (Leaflet OpenStreetMap integration)
└── pages/
    ├── DashboardPage.tsx     # Main Healthcare Command Center
    ├── HospitalsPage.tsx     # /hospitals - Full Hospital Directory with filters
    ├── HospitalDetailPage.tsx# /hospitals/:id - Hospital view + Bed Matrix
    ├── BedsPage.tsx          # /beds - Hospitals sorted by available beds
    ├── ICUPage.tsx           # /icu - Hospitals sorted by ICU capacity
    ├── OxygenPage.tsx        # /oxygen - Oxygen-supported beds & cylinders
    ├── BloodPage.tsx         # /blood - Blood stock matrix (A+, B+, etc.)
    ├── BloodRequestPage.tsx  # /blood/request - Emergency blood request form
    ├── DonorPage.tsx         # /donors - Donor response dashboard
    ├── SpecialistsPage.tsx   # /specialists - Specialist doctor directory
    ├── AmbulancesPage.tsx    # /ambulances - Ambulance fleet & request flow
    ├── EmergencyPage.tsx     # /emergency - 🚨 Emergency AI Matcher Wizard
    ├── AdminDashboardPage.tsx# /hospital-admin - Staff management panel
    └── DemoPage.tsx          # /demo - Live Hackathon Demo Control Room
```

---

## 📖 Architecture & Demo Documentation

- [DATA_SOURCE_SETUP.md](./DATA_SOURCE_SETUP.md): Guide for connecting Google Sheets, Firebase, Supabase, or REST APIs.
- [AI_RECOMMENDATION.md](./AI_RECOMMENDATION.md): Detailed mathematical formula for AI decision-support scoring algorithm.
- [DEMO_GUIDE.md](./DEMO_GUIDE.md): Step-by-step hackathon presentation & multi-tab test instructions.
