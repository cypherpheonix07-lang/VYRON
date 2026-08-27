# =====================================================================
#  PROJECT BRAHMA — ONE-SHOT BOOTSTRAP SCRIPT (FRONTEND + BACKEND)
# =====================================================================
$ErrorActionPreference = "Continue"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $scriptDir) { $scriptDir = (Get-Location).Path }

if (Test-Path "$scriptDir\brahma-engine\main.py") {
    $backendDir = "$scriptDir\brahma-engine"
    $frontendDir = if (Test-Path "$scriptDir\brahma-insights-main\package.json") { "$scriptDir\brahma-insights-main" } else { $scriptDir }
} elseif (Test-Path "$scriptDir\..\brahma-engine\main.py") {
    $backendDir = (Resolve-Path "$scriptDir\..\brahma-engine").Path
    $frontendDir = $scriptDir
} else {
    $backendDir = "$scriptDir\brahma-engine"
    $frontendDir = $scriptDir
}

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "  PROJECT BRAHMA - Fullstack Launcher" -ForegroundColor Cyan
Write-Host "  Frontend: $frontendDir" -ForegroundColor Gray
Write-Host "  Backend : $backendDir" -ForegroundColor Gray
Write-Host "=====================================================`n" -ForegroundColor Cyan

# ---- [1/4] CHECK PYTHON & START BACKEND ----
Write-Host "[1/4] Checking Python backend engine..." -ForegroundColor Cyan

# Check if port 8000 is already listening
$port8000InUse = Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue

if ($port8000InUse) {
    Write-Host "Backend engine is already running on http://127.0.0.1:8000 (Active)." -ForegroundColor Green
} elseif (Test-Path "$backendDir\main.py") {
    Push-Location $backendDir

    # Check / Create virtual environment
    if (-not (Test-Path ".venv\Scripts\python.exe")) {
        Write-Host "Creating Python virtual environment in brahma-engine\.venv..." -ForegroundColor Yellow
        py -m venv .venv
        if ($LASTEXITCODE -ne 0) {
            python -m venv .venv
        }
    }

    # Install Python dependencies if needed
    if (Test-Path ".venv\Scripts\pip.exe") {
        Write-Host "Verifying Python requirements..." -ForegroundColor Yellow
        & ".\.venv\Scripts\pip.exe" install -r requirements.txt --quiet
    }

    # Start FastAPI backend in a separate terminal window
    Write-Host "Starting FastAPI engine on http://127.0.0.1:8000 ..." -ForegroundColor Green
    Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd '$backendDir'; .\.venv\Scripts\python.exe -m uvicorn main:app --port 8000"
    
    Pop-Location
} else {
    Write-Host "Warning: brahma-engine folder not found at $backendDir" -ForegroundColor Yellow
}

# ---- [2/4] DETECT PACKAGE MANAGER ----
Write-Host "`n[2/4] Detecting Frontend package manager..." -ForegroundColor Cyan
$pm = "bun"
if (Get-Command bun -ErrorAction SilentlyContinue) {
    $pm = "bun"
} elseif (Get-Command npm -ErrorAction SilentlyContinue) {
    $pm = "npm"
} else {
    Write-Host "Neither Bun nor Node/npm found! Please install Node.js or Bun." -ForegroundColor Red
    exit 1
}
Write-Host "Package manager: $pm" -ForegroundColor Green

# ---- [3/4] CHECK FRONTEND DEPENDENCIES ----
Write-Host "`n[3/4] Checking frontend dependencies in brahma-insights-main..." -ForegroundColor Cyan
if (-not (Test-Path "$frontendDir\package.json")) {
    Write-Host "package.json not found in $frontendDir!" -ForegroundColor Red
    exit 1
}

Push-Location $frontendDir

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing frontend packages with $pm..." -ForegroundColor Yellow
    if ($pm -eq "bun") { bun install } else { npm install }
}

# ---- [4/4] START FRONTEND DEV SERVER ----
Write-Host "`n[4/4] Starting PROJECT BRAHMA frontend dev server..." -ForegroundColor Cyan
Write-Host "Frontend will be available at http://localhost:8080 (or printed URL)" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the frontend server.`n" -ForegroundColor Gray

# Direct file execution avoids Windows OneDrive Bun .bin metadata remap bugs
if (Test-Path "node_modules\vite\bin\vite.js") {
    if ($pm -eq "bun") {
        bun run .\node_modules\vite\bin\vite.js dev
    } else {
        node .\node_modules\vite\bin\vite.js dev
    }
} else {
    if ($pm -eq "bun") {
        bun run dev
    } else {
        npm run dev
    }
}

Pop-Location
