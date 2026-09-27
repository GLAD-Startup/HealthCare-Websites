Vrindavan HealthcareWebsite & CRM Architecture
Technical Architecture & Technology Stack
1. Project Overview
The solution is divided into two independent applications: a public healthcare website and a private Customer Relationship Management (CRM) web application. The CRM is designed as a Progressive Web App (PWA), allowing installation on laptops and phones and supporting offline-first operation if required.
2. High-Level Architecture
                    VRINDAVAN HEALTHCARE                           |             +-------------+-------------+             |                           |             v                           v      PUBLIC WEBSITE                 CRM / APP       Next.js + Vercel        Next.js + PWA + Vercel             |                           |       Public content             +-------+-------+                                  |               |                                  v               v                              IndexedDB       Supabase                              (Local DB)     PostgreSQL                                  |               |                                  +----- Sync ----+                                                  |                                           Edge Functions                                                  |                                                  v                                          Meta WhatsApp API
3. Public Website
The public website is completely separate from the CRM and is intended for patients/customers.
Next.js + TypeScript
Tailwind CSS + shadcn/ui
Vercel hosting
Responsive desktop/mobile design
Public clinic and doctor information
Appointment, call and WhatsApp CTAs
Suggested Website Pages
Home
About Doctor
Services
Clinic Information
Contact
Appointment / WhatsApp
4. CRM Application
The CRM is a separate web application, suggested at crm.vrindavanhealthcare.in. It is a PWA so it can be used in a browser or installed like an application.
Next.js + TypeScript
Tailwind CSS + shadcn/ui
PWA
Vercel hosting
IndexedDB for local/offline data
Dexie.js for IndexedDB access
Supabase PostgreSQL for cloud data
5. CRM Modules
Dashboard
Customers / Patients listing
Add, edit, search and filter customers
Customer details
Follow-up management
Today's and upcoming follow-ups
WhatsApp greetings and follow-ups
Message templates
Basic settings
6. Customer Data Model
customers- id- name- phone- email (optional)- createdAt- updatedAt- lastContact- nextFollowUp- followUpStatus- notes- whatsappStatus- syncStatusfollowups- id- customerId- date- status- notes- createdAt- updatedAt- syncStatus
For the initial CRM, store only information that is actually required. Detailed medical/clinical records should not be added unless explicitly required and appropriately secured.
7. PWA Architecture
Service Worker caches the application shell/assets.
IndexedDB stores local CRM data.
Dexie.js simplifies IndexedDB operations.
A Sync Queue records changes made while offline.
Connectivity detection starts synchronization when the network returns.
8. Offline-First & Online Synchronization
ONLINEUser -> CRM -> IndexedDB -> Sync Queue -> SupabaseOFFLINEUser -> CRM -> IndexedDB -> Sync Queue (Pending)Internet returnsPending changes -> Supabase -> Synced
The local database is the first write target so the UI remains responsive. Offline changes are queued and synchronized when connectivity returns.
9. Sync Queue
sync_queue- id- entity- entityId- operation- payload- createdAt- retryCount- statusExample:entity: customeroperation: CREATEstatus: pending
Support CREATE, UPDATE and DELETE operations.
Retry failed operations.
Mark successful operations as synced.
For a small clinic, Last Updated Wins can be used for basic conflict handling.
Advanced conflict resolution can be added later.
10. WhatsApp Automation
Supabase   |Follow-up data   |Supabase Edge Function / Automation   |Meta WhatsApp Cloud API   |Customer WhatsApp
Greeting messages
Follow-up reminders
Predefined templates
Message status tracking
Actual Meta/WhatsApp charges are separate from development cost.
WhatsApp automation should run in the cloud, so the clinic's browser does not need to remain open. If the clinic is offline, records can be stored locally and synced later, but WhatsApp messages require internet/cloud connectivity.
11. Authentication & Access
For the initial small-clinic MVP, full staff account and role management is not necessary. However, the CRM should use protected access and must not expose the database publicly.
Protected CRM access
No unnecessary multi-user role system in Phase 1
Phase 2 can add Admin, Doctor and Staff roles
Use Supabase Row Level Security for authenticated cloud access
12. Deployment Architecture
PUBLIC WEBSITEGitHub -> Vercel -> www.vrindavanhealthcare.inCRMGitHub -> Vercel -> crm.vrindavanhealthcare.inDATABASESupabase -> PostgreSQLAUTOMATIONSupabase Edge Functions -> Meta WhatsApp Cloud API
13. Recommended Technology Stack
Layer
Technology
Public Website
Next.js
CRM
Next.js
Language
TypeScript
UI
Tailwind CSS
UI Components
shadcn/ui
CRM Type
PWA
Local Database
IndexedDB
IndexedDB Wrapper
Dexie.js
Cloud Database
Supabase PostgreSQL
Backend
Supabase
Offline Sync
Custom Sync Queue
Cloud Functions
Supabase Edge Functions
WhatsApp
Meta WhatsApp Cloud API
Hosting
Vercel
Source Control
GitHub
Domain
Custom domain/subdomains
14. Why No Traditional VPS Is Required
Vercel handles application hosting.
Supabase handles PostgreSQL and backend services.
Supabase Edge Functions can handle lightweight automation.
The initial solution does not require IIS, PM2, Docker or a dedicated VPS.
This keeps infrastructure simple and inexpensive for a small clinic.
15. Internet Failure Behaviour
Internet ON:CRM <-> SupabaseCRM <-> WhatsApp automationInternet OFF:CRM <-> IndexedDBNew/updated records -> Pending SyncInternet restored:Pending local changes -> Supabase -> Synced
Offline operation requires the PWA to have been loaded/installed on that device previously. A completely new device cannot download the application from Vercel without internet.
16. Security & Data Considerations
Use HTTPS everywhere.
Never expose Supabase service-role keys in frontend code.
Use Row Level Security for protected cloud data.
Store only necessary customer information.
Keep API secrets server-side.
Maintain a backup/export strategy for production data.
Apply appropriate privacy and security practices to healthcare-related information.
17. Suggested ₹20,000 MVP Scope
Responsive public website
Separate web-based CRM
Customer listing and management
Search and basic filtering
Follow-up management
Basic WhatsApp greeting/follow-up integration
PWA installation support
Vercel deployment
Supabase database setup
Full offline synchronization, advanced role management, detailed medical records, analytics, appointment systems, multi-branch support and advanced automation can be treated as Phase 2.
18. Final Architecture Summary
                         VRINDAVAN HEALTHCARE                                  |                +-----------------+-----------------+                |                                   |                v                                   v          PUBLIC WEBSITE                         CRM PWA             Next.js                             Next.js                |                                   |              Vercel                              Vercel                                                    |                                  +-----------------+----------------+                                  |                                  |                                  v                                  v                             IndexedDB                           Supabase                             + Dexie.js                        PostgreSQL                                  |                                  |                                  +---------- Sync Queue ------------+                                                                     |                                                              Edge Functions                                                                     |                                                                     v                                                               Meta WhatsApp
Prepared as a technical architecture proposal for the Vrindavan Healthcare CRM MVP.