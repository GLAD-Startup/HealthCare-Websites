-- ====================================================================
-- VRINDAVAN HEALTHCARE CRM — STEP 00: DATABASE INITIALIZATION
-- ====================================================================
-- Run this as postgres superuser if creating a new local database.
-- If you already have a target database (or are using Supabase/Cloud SQL),
-- you can skip the CREATE DATABASE statement and connect directly.

-- 1. Create database (uncomment if running outside an existing database)
-- CREATE DATABASE vrindavan_crm WITH OWNER = postgres ENCODING = 'UTF8';

-- Connect to vrindavan_crm
-- \c vrindavan_crm;

-- 2. Enable Required Extensions
-- UUID generation and cryptographic hash functions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
