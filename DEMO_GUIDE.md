# 🎬 CareConnect – Hackathon Live Demonstration Guide

Follow this guide to demonstrate CareConnect's **zero-latency multi-tab real-time synchronization** and **AI emergency dispatch capabilities** to hackathon judges.

---

## ⚡ 1. The 60-Second Multi-Tab Real-Time Sync Test

### STEP 1: Open Tab 1 (Patient View)
1. Open your browser and navigate to `http://localhost:5173/beds`.
2. Notice **City Care Hospital** showing **35 Available Beds** and inspect Bed `BED-004` (Status: `Available 🟢`).

### STEP 2: Open Tab 2 (Hospital Staff Admin / Demo View)
1. Open a second browser tab (or window side-by-side) to `http://localhost:5173/demo`.
2. Select **City Care Hospital**.

### STEP 3: Trigger Admission Simulation
1. Click **▶ SIMULATE PATIENT ADMISSION** in Tab B.

### STEP 4: Observe Instant Synchronization in Tab 1
1. Look back at Tab 1 (Patient Dashboard) **without reloading the page**.
2. **Result**:
   - Available Beds count instantly changes from **35 ➔ 34**.
   - Bed `BED-004` status changes from **🟢 Available ➔ 🔴 Occupied**.
   - A floating Toast alert appears: `🔔 Bed BED-004 at City Care Hospital changed: AVAILABLE ➔ OCCUPIED`.
   - "Last updated" timestamp updates.

### STEP 5: Trigger Discharge Simulation
1. Click **▶ SIMULATE PATIENT DISCHARGE** in Tab B.
2. **Result**: Available Beds count instantly reverts from **34 ➔ 35**, and Bed `BED-004` turns green again!

---

## 🚨 2. Demonstrating the AI Emergency Hospital Matcher

1. Click the glowing **🚨 EMERGENCY** button in the top navigation bar or go to `/emergency`.
2. **Step 1**: Click **Heart Attack ❤️**.
3. **Step 2**: Enter location: `City Center Mall`, check **Need ICU** & **Need Oxygen**, select **Cardiologist**. Click **CALCULATE AI HOSPITAL RECOMMENDATION SCORES**.
4. **Result**:
   - Evaluates all 8 hospitals using multi-criteria weighted scoring algorithm.
   - Highlights Top Recommended Hospital with **94% Match Score**.
   - Explains **"WHY THIS HOSPITAL WAS RECOMMENDED"** with clear checklist breakdown.
   - Provides instant actions: **[SELECT HOSPITAL]**, **[GET DIRECTIONS]**, **[REQUEST AMBULANCE]**.

---

## 🩸 3. Demonstrating Emergency Blood Request & Donor Response

1. Navigate to `/blood/request`.
2. Select **B+ Blood**, **2 Units**, **City Care Hospital**, **CRITICAL**. Click **BROADCAST EMERGENCY BLOOD REQUEST NOW**.
3. Navigate to `/donors` (Blood Donor Dashboard).
4. See the active request broadcasted in real-time!
5. Click **[ACCEPT REQUEST]** as donor Alex Mercer.
6. The request status updates across all views!

---

## 🚑 4. Demonstrating Ambulance Tracking & Request

1. Navigate to `/ambulances`.
2. View live fleet markers across Metro Healthcare District.
3. Click **[REQUEST AMBULANCE NOW]**.
4. Submit location: `77 Park Avenue`.
5. **Result**: Nearest available ALS ambulance is auto-assigned, status updates to **Assigned 🟡**, and ETA countdown (~8 min) is calculated!
