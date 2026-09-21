# =====================================================================
#  PROJECT BRAHMA — WINDOWS POWERSHELL ONE-SHOT BOOTSTRAP (SINGLE RUN)
#  Checks Node/npm -> fixes script policy -> detects manager ->
#  clean install -> runs dev server. Paste the WHOLE block once.
# =====================================================================
$ErrorActionPreference = "Continue"

# ---- [1/6] CHECK NODE + NPM, REFRESH PATH ----
Write-Host "`n[1/6] Checking Node.js and npm..." -ForegroundColor Cyan
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js NOT installed. Attempting winget install..." -ForegroundColor Yellow
    if (Get-Command winget -ErrorAction SilentlyContinue) {
        winget install OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
    } else {
        Write-Host "winget missing. Install Node LTS manually from https://nodejs.org then re-run this block." -ForegroundColor Red
        exit 1
    }
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Host "Node installed but not in THIS session. CLOSE PowerShell, reopen it, paste this block again." -ForegroundColor Red
        exit 1
    }
}
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "npm missing while Node exists. Reinstall Node LTS from https://nodejs.org (Repair install)." -ForegroundColor Red
    exit 1
}
Write-Host ("Node: " + (node -v)) -ForegroundColor Green
Write-Host ("npm : " + (npm -v)) -ForegroundColor Green

# ---- [2/6] FIX "running scripts is disabled" (npm.ps1 blocked) ----
Write-Host "`n[2/6] Fixing PowerShell execution policy (no admin needed)..." -ForegroundColor Cyan
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
Write-Host "Policy set to RemoteSigned for CurrentUser." -ForegroundColor Green

# ---- [3/6] GO TO PROJECT FOLDER + DETECT PACKAGE MANAGER ----
Write-Host "`n[3/6] Locating project and package manager..." -ForegroundColor Cyan
$proj = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $proj) { $proj = Get-Location }
if (-not (Test-Path "$proj\package.json")) {
    Write-Host "package.json NOT found in project folder!" -ForegroundColor Red
    exit 1
}
Set-Location $proj
if (Test-Path pnpm-lock.yaml) { $pm = "pnpm" } elseif ((Test-Path bun.lockb) -or (Test-Path bun.lock)) { $pm = "bun" } else { $pm = "npm" }
Write-Host "Package manager detected: $pm" -ForegroundColor Green
if ($pm -eq "pnpm" -and -not (Get-Command pnpm -ErrorAction SilentlyContinue)) { npm install -g pnpm }
if ($pm -eq "bun"  -and -not (Get-Command bun  -ErrorAction SilentlyContinue)) { npm install -g bun }

# ---- [4/6] RESET REGISTRY + CLEAN CACHE ----
Write-Host "`n[4/6] Resetting npm registry and cache..." -ForegroundColor Cyan
npm config set registry https://registry.npmjs.org/
npm cache clean --force

# ---- [5/6] CLEAN INSTALL DEPENDENCIES ----
Write-Host "`n[5/6] Installing dependencies (takes minutes, do not interrupt)..." -ForegroundColor Cyan
if (Test-Path node_modules) { Remove-Item -Recurse -Force node_modules }
if ($pm -eq "npm") { npm install } elseif ($pm -eq "pnpm") { pnpm install } else { bun install }
if ($LASTEXITCODE -ne 0) {
    Write-Host "Install FAILED. Usual suspects: antivirus blocking, proxy, corporate network, or no internet. Fix and re-run this block." -ForegroundColor Red
    exit 1
}
Write-Host "Dependencies installed." -ForegroundColor Green

# ---- [6/6] RUN DEV SERVER ----
Write-Host "`n[6/6] Starting PROJECT BRAHMA dev server..." -ForegroundColor Cyan
Write-Host "Open the URL printed below (usually http://localhost:8080 or :5173). Ctrl+C stops it." -ForegroundColor Green
if ($pm -eq "npm") { npm run dev } elseif ($pm -eq "pnpm") { pnpm dev } else { bun run dev }
