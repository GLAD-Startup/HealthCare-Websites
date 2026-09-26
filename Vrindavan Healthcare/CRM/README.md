# Vrindavan Healthcare CRM (PWA + Offline-First + PostgreSQL)

A clinical Customer Relationship Management (CRM) Progressive Web App (PWA) tailored for **Vrindavan Healthcare**. Built according to the technical architecture specification in `CRM\Vrindavan_Healthcare_Website_CRM_Architecture.docx`.

---

## 🏥 Key Features & Modules

### 1. Dashboard Console
- **Live KPI Metrics**: Total registered patients, today's due follow-ups, overdue alerts, and completed consultations.
- **Immediate Follow-up Queue**: Actionable cards with 1-click **Call**, **WhatsApp Reminder**, **Mark Done**, and **Reschedule**.
- **Recent Patient Intake**: Real-time overview of recently admitted or updated patient files.

### 2. Patients & Medical Records
- **Comprehensive Patient Registry**: Add, edit, search, and filter patients by specialty, follow-up status, or notes.
- **Search & Filters**: Instant fuzzy search across patient name, phone (`+91`), email, and clinical notes.
- **View Toggle**: Switch seamlessly between dense Table View and responsive Card Grid.
- **Data Export & Import**: 1-click **Export to CSV** and complete **Offline JSON Database Backups**.

### 3. Slide-over Patient Profile Drawer
- Full clinical profile, assigned doctor, and contact information.
- Historical timeline of all past and upcoming follow-ups for that specific patient.
- Inline "Schedule New Follow-up" scheduler.
- Complete WhatsApp communication audit log with dispatch timestamps.

### 4. Follow-up Manager
- Categorized tabs: **Today's Due**, **Overdue**, **Upcoming (7+ days)**, **Completed**, and **All**.
- Quick 1-click rescheduling: `+1 Day`, `+3 Days`, `+1 Week`.
- Instant pre-filled WhatsApp reminder messages.

### 5. WhatsApp Communication Center
- **Predefined Clinic Templates**:
  - Welcome & Patient Greeting
  - Consultation & Recovery Follow-up
  - Follow-up Consultation Reminder
  - Lab & Diagnostic Reports Ready
  - Seasonal Wellness & Hydration Tip
- **Dynamic Tag Interpolation**: Automatically populates `{{patient_name}}`, `{{clinic_name}}`, `{{doctor_name}}`, `{{date}}`, and `{{notes}}`.
- **Live Chat Bubble Simulator**: Visual preview formatted exactly like WhatsApp before sending.
- **Dual Dispatch Channels**:
  - **1-Click WhatsApp Web / App (`wa.me`)**: Opens instantly on desktop browser or mobile WhatsApp without any Meta API fees.
  - **Meta Cloud API**: Optional webhook / Cloud API integration using configured token.

### 6. Offline-First Architecture & Sync Engine
- **Local Storage via Dexie.js (IndexedDB)**: Write operations are instant and zero-latency even with zero internet connectivity.
- **Sync Queue (`sync_queue`)**: All `CREATE`, `UPDATE`, and `DELETE` mutations are safely queued with status tracking (`pending`, `syncing`, `synced`, `failed`).
- **Automatic Reconnection**: Automatically detects when network connectivity returns (`navigator.onLine`) and synchronizes pending changes to Supabase PostgreSQL.
- **Conflict Handling**: Implements *Last Updated Wins* as specified in Architecture Section 9.

### 7. Progressive Web App (PWA)
- Installable on mobile phones (Android / iOS) and desktop (Chrome / Edge).
- Service Worker (`sw.js`) caches the application shell and static assets for full offline capability.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + TypeScript + Vite |
| **Styling** | Tailwind CSS v4 + Medical Healthcare Tokens |
| **Icons** | Lucide React |
| **Local Database (Offline)** | IndexedDB via Dexie.js |
| **Cloud Database** | PostgreSQL via Supabase (`@supabase/supabase-js`) |
| **Offline Sync** | Custom Queue Engine with Auto-retry |
| **Messaging** | WhatsApp `wa.me` Universal Links + Meta Cloud API |
| **PWA** | Web App Manifest + Service Worker Cache |

---

## 🚀 Getting Started

### 1. Run Locally
```bash
# Navigate to the CRM folder
cd CRM

# Start the Vite development server (runs on port 5174)
npm run dev
```

Visit **`http://localhost:5174/`** in your browser.

### 2. Build for Production
```bash
npm run build
```
The compiled, production-ready static assets will be in `CRM/dist/`.

---

## 🐘 Supabase PostgreSQL Setup

1. Create a free project at [Supabase](https://supabase.com).
2. Open the **SQL Editor** in your Supabase project dashboard.
3. Open `CRM/supabase_schema.sql` (or click **Copy SQL Schema Script** inside the CRM Settings modal) and run the script.
4. Copy your **Project URL** and **Anon Public Key** from **Project Settings ➔ API**.
5. In the CRM, click the **Settings icon (⚙️)** in the top navigation bar, paste the credentials into the **PostgreSQL / Supabase** tab, and click **Test Connection** followed by **Save Settings**.
