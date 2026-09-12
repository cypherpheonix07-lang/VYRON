# =====================================================================
#  PROJECT BRAHMA — DOCKER + OPENROUTER CONNECTION (WINDOWS POWERSHELL)
#  Run from: brahma-insights-main root. Docker Desktop must be RUNNING.
# =====================================================================
$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

Write-Host "=== [1/6] DOCKER ALIVE CHECK ===" -ForegroundColor Cyan
try {
  $v = docker version --format "Server: {{.Server.Version}}" 2>$null
  if (-not $v -or $LASTEXITCODE -ne 0) {
    Write-Host "⚠️  DOCKER DESKTOP IS NOT RUNNING." -ForegroundColor Yellow
    Write-Host "Please start Docker Desktop from your Windows Start Menu, wait until the Docker whale icon says 'Engine running', and re-run this script." -ForegroundColor White
    exit 1
  }
  Write-Host "Docker is LIVE ($v)." -ForegroundColor Green
} catch {
  Write-Host "⚠️  Docker daemon not detected. Please launch Docker Desktop." -ForegroundColor Yellow
  exit 1
}

Write-Host "`n=== [2/6] COMPOSE UP (redis + engine + worker) ===" -ForegroundColor Cyan
docker compose -f docker-compose.industrial.yml up -d --build
$healthy = $false
for ($i = 0; $i -lt 30; $i++) {
  $st = docker ps --filter "name=brahma-redis" --format "{{.Status}}"
  if ($st -match "healthy") { $healthy = $true; break }
  Start-Sleep -Seconds 2
}
if (-not $healthy) { Write-Host "REDIS UNHEALTHY:" -ForegroundColor Red; docker logs brahma-redis; exit 1 }
docker ps --format "table {{.Names}}`t{{.Status}}`t{{.Ports}}" | Select-String "brahma"

Write-Host "`n=== [3/6] ENV CONTRACT + SECURE KEY INTAKE ===" -ForegroundColor Cyan
if (-not (Test-Path .env)) { Copy-Item .env.example .env; Write-Host ".env created from .env.example" }
$sec = Read-Host "Paste OPENROUTER_API_KEY (hidden input)" -AsSecureString
$bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec)
$plain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
(Get-Content .env) -replace '^OPENROUTER_API_KEY=.*', "OPENROUTER_API_KEY=$plain" | Set-Content .env
Write-Host ".env updated (key masked in memory only)." -ForegroundColor Green

Write-Host "`n=== [4/6] OPENROUTER CONNECTIVITY PING ===" -ForegroundColor Cyan
$headers = @{ Authorization = "Bearer $plain"; "HTTP-Referer" = "https://brahma.local"; "X-Title" = "PROJECT BRAHMA" }
try {
  $models = Invoke-RestMethod -Uri "https://openrouter.ai/api/v1/models" -Headers $headers
  Write-Host ("OpenRouter LIVE. Models visible: " + $models.data.Count) -ForegroundColor Green
  $body = @{ model = "meta-llama/llama-3.1-8b-instruct:free";
             messages = @(@{ role = "user"; content = "Reply with the single word: BRAHMA" });
             max_tokens = 8 } | ConvertTo-Json -Depth 6
  $resp = Invoke-RestMethod -Uri "https://openrouter.ai/api/v1/chat/completions" -Method Post -Headers $headers -Body $body -ContentType "application/json"
  Write-Host ("Smoke response: " + $resp.choices[0].message.content) -ForegroundColor Green
} catch {
  Write-Host ("OPENROUTER FAIL: " + $_.Exception.Message) -ForegroundColor Red
}

Write-Host "`n=== [5/6] ENGINE + WORKER HEALTH ===" -ForegroundColor Cyan
try {
  $h = Invoke-RestMethod -Uri "http://localhost:8000/health"
  Write-Host ("Engine health: " + ($h | ConvertTo-Json -Compress)) -ForegroundColor Green
} catch { Write-Host "ENGINE DOWN: check docker logs brahma-engine" -ForegroundColor Red }

Write-Host "`n=== [6/6] SUPABASE SECRETS + EDGE DEPLOY ===" -ForegroundColor Cyan
Write-Host "Execute (key entered at prompt, never echoed):" -ForegroundColor Yellow
Write-Host "  npx supabase secrets set OPENROUTER_API_KEY=<paste> HF_TOKEN=<paste>"
Write-Host "  npx supabase functions deploy llm-gateway"
Write-Host "  npx supabase functions deploy embed"
Write-Host "  npx supabase secrets list   # verify masked presence"

# Zero-clear the key from memory
$plain = $null; [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
Write-Host "`n=== CONNECTION COMPLETE. Key purged from session memory. ===" -ForegroundColor Green
