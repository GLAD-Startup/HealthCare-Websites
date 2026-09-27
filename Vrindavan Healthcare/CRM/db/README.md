# Vrindavan Healthcare CRM — Local PostgreSQL Database Setup

This directory contains the complete PostgreSQL database schema, automated triggers, performance indexes, seed data, and security policies for **Vrindavan Healthcare CRM**.

---

## 📁 Directory Structure

| File | Purpose |
| :--- | :--- |
| [`schema_all_in_one.sql`](./schema_all_in_one.sql) | **Recommended single-file script** containing the complete schema, tables, triggers, indexes, seed data, and policies in a single transaction. |
| [`setup_local_postgres.ps1`](./setup_local_postgres.ps1) | Automated PowerShell script to create `vrindavan_crm` and apply the schema using local `psql.exe`. |
| [`00_init_database.sql`](./00_init_database.sql) | Creates the database and enables required PostgreSQL extensions (`uuid-ossp`, `pgcrypto`). |
| [`01_create_tables.sql`](./01_create_tables.sql) | Creates all 6 core tables: `customers`, `followups`, `whatsapp_templates`, `whatsapp_logs`, `sync_queue`, and `clinic_settings`. |
| [`02_indexes_and_triggers.sql`](./02_indexes_and_triggers.sql) | Creates indexes for fast lookups & automated `updated_at` triggers. |
| [`03_seed_data.sql`](./03_seed_data.sql) | Seeds clinical WhatsApp templates and default clinic configuration (no fake patients). |
| [`04_security_and_rls.sql`](./04_security_and_rls.sql) | Sets up table permissions and access policies. |

---

## 🏥 Tables in Scope

1. **`customers`**: Patient directory, medical categories, contact details, assigned doctors, and follow-up status.
2. **`followups`**: Scheduled clinical follow-ups, dates, reminder flags, status (`pending`, `completed`, `rescheduled`, `cancelled`), and clinical notes.
3. **`whatsapp_templates`**: Pre-approved clinical communication templates with variable placeholders (`{{patient_name}}`, `{{date}}`).
4. **`whatsapp_logs`**: Historical dispatch log of all messages sent through WhatsApp Web or Cloud API.
5. **`sync_queue`**: Two-way sync queue auditing mutations created while offline or pending upload.
6. **`clinic_settings`**: Clinic profile, operating address, doctor designation, and API credentials.

> [!NOTE]
> All primary keys use `VARCHAR(64) DEFAULT gen_random_uuid()::text`. This allows the application to generate resilient client-side IDs (`cust-...`, `fol-...`) while offline and sync them to PostgreSQL without type conflicts.

---

## 🚀 How to Run Locally

### Option A: Using the Automated Setup Script (PowerShell)

Open PowerShell in this directory and run:
```powershell
.\setup_local_postgres.ps1
```

---

### Option B: Using PostgreSQL (`psql`) directly

1. Open PowerShell / Command Prompt and create the database:
   ```bash
   "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE DATABASE vrindavan_crm;"
   ```

2. Apply the all-in-one schema script:
   ```bash
   "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d vrindavan_crm -f "CRM/db/schema_all_in_one.sql"
   ```

---

### Option C: Using Docker

```bash
docker run --name vrindavan-postgres \
  -e POSTGRES_DB=vrindavan_crm \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 -d postgres:16-alpine

# Apply schema
docker exec -i vrindavan-postgres psql -U postgres -d vrindavan_crm < "CRM/db/schema_all_in_one.sql"
```

---

## 📡 Running the Backend Server & Syncing

1. Start the Node.js/Express backend server:
   ```bash
   cd CRM
   npm run server
   ```
   *(Or run both frontend and backend concurrently with `npm run dev:all`)*

2. In the CRM frontend, open **Settings** (top right or bottom of sidebar) ➔ **PostgreSQL Database**.
3. Confirm the backend API URL is `http://localhost:5000/api` and click **Test connection**.
4. Click **Sync now** (or the sync badge in the top bar) to instantly push your local changes to PostgreSQL!
