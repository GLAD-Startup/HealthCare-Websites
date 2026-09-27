# ====================================================================
# VRINDAVAN HEALTHCARE CRM — AUTOMATED LOCAL POSTGRESQL SETUP
# ====================================================================

$ErrorActionPreference = "Continue"

# Resolve psql binary
$psqlPath = "C:\Program Files\PostgreSQL\18\bin\psql.exe"
if (-not (Test-Path $psqlPath)) {
    $found = Get-Command psql -ErrorAction SilentlyContinue
    if ($found) {
        $psqlPath = $found.Source
    } else {
        Write-Host "Could not automatically locate psql.exe. Please ensure PostgreSQL is installed." -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n======================================================" -ForegroundColor Cyan
Write-Host "🏥 Setting up Vrindavan Healthcare CRM PostgreSQL DB" -ForegroundColor Cyan
Write-Host "Using psql: $psqlPath" -ForegroundColor Gray
Write-Host "======================================================`n" -ForegroundColor Cyan

# 1. Create database
Write-Host "1. Creating database 'vrindavan_crm' (if not exists)..." -ForegroundColor Yellow
& $psqlPath -U postgres -c "CREATE DATABASE vrindavan_crm;" 2>$null

# 2. Apply all-in-one schema
$schemaPath = Join-Path $PSScriptRoot "schema_all_in_one.sql"
Write-Host "`n2. Applying schema tables, indexes, triggers & templates..." -ForegroundColor Yellow
& $psqlPath -U postgres -d vrindavan_crm -f $schemaPath

Write-Host "`n======================================================" -ForegroundColor Green
Write-Host "✅ Local PostgreSQL Database Setup Complete!" -ForegroundColor Green
Write-Host "Database: vrindavan_crm" -ForegroundColor Green
Write-Host "Now start the backend with: npm run server" -ForegroundColor Green
Write-Host "======================================================`n" -ForegroundColor Green
