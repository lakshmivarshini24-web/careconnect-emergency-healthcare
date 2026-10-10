# 📊 CareConnect – Data Source Integration & Architecture Setup Guide

This document explains how **CareConnect** decouples frontend UI components from backend storage, enabling seamless migration from the initial mock real-time engine to **Google Sheets**, **Firebase Realtime Database**, **Supabase Realtime**, or **Custom Hospital REST/GraphQL APIs** without modifying any frontend code.

---

## 🏛️ Central Abstraction Architecture (`dataService.ts`)

CareConnect enforces a strict clean architecture principle: **UI components never consume or mutate raw backend databases directly.** All data access and mutations pass through the central service facade:

```
[ React UI Components ]
         │
         ▼
[ dataService.ts (Facade Layer) ]
         │
 ┌───────┴──────────────────────────────┬─────────────────────────┐
 │                                      │                         │
 ▼                                      ▼                         ▼
[ Mock / LocalStorage Engine ]   [ Google Sheets API ]   [ Firebase / Supabase ]
```

---

## 🟢 1. Connecting Google Sheets as a Hospital Data Entry Source

Google Sheets allows non-technical hospital receptionists and nurses to update bed and resource counts directly in a spreadsheet while CareConnect streams updates to patients in real-time.

### Step-by-Step Google Sheets Setup:

1. **Create a Google Sheet** with tabs: `Hospitals`, `Beds`, `BloodInventory`, `Specialists`.
2. Required columns in `Hospitals` tab:
   - `id`, `name`, `address`, `latitude`, `longitude`, `phone`, `emergencyStatus`, `totalBeds`, `availableBeds`, `occupiedBeds`, `icuTotal`, `icuAvailable`, `oxygenBedsAvailable`, `lastUpdated`
3. Required columns in `Beds` tab:
   - `id`, `hospitalId`, `ward`, `type`, `status`, `patientId`, `lastUpdated`
4. **Deploy as Web App via Google Apps Script**:
   - In Google Sheets, open `Extensions -> Apps Script`.
   - Add the following doGet() handler:

```javascript
function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Hospitals");
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var result = [];

  for (var i = 1; i < data.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = data[i][j];
    }
    result.push(obj);
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
```

5. Click **Deploy -> New Deployment**, set access to **Anyone**, and copy the Web App URL.
6. Configure `dataService.ts` via environment variables:

```typescript
// In src/services/dataService.ts
dataService.configureSource({
  sourceType: 'sheets',
  googleSheetUrl: import.meta.env.VITE_GOOGLE_SHEET_URL
});
```

---

## 🔥 2. Connecting Firebase Realtime Database / Firestore

To connect to Firebase:

1. Install Firebase SDK:
   ```bash
   npm install firebase
   ```
2. Set environment variables in `.env`:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   ```
3. Pass `onValue(ref(db, 'hospitals'), (snapshot) => { ... })` into `realtimeService.ts` listeners.

---

## ⚡ 3. Connecting Supabase Realtime

To connect to Supabase:

1. Install Supabase JS client:
   ```bash
   npm install @supabase/supabase-js
   ```
2. Set environment variables in `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
3. Subscribe to postgres changes:
   ```typescript
   supabase
     .channel('schema-db-changes')
     .on('postgres_changes', { event: '*', schema: 'public', table: 'beds' }, payload => {
       dataService.updateBedStatus(payload.new.hospital_id, payload.new.id, payload.new.status);
     })
     .subscribe();
   ```

---

## 🔒 Security & Privacy Guidelines

- Never expose private database credentials or master service account keys in frontend repositories.
- Use `.env.local` for sensitive tokens.
- All patient identifiers MUST be masked (e.g. `PAT-104`). Never store PII in public resource channels.
