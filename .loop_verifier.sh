#!/usr/bin/env bash
set -uo pipefail

TARGET_MD="${TARGET_MD_FILE:-STATUS.md}"
CUSTOM_URL="${LOCALHOST_URL:-}"
FAIL_COUNT=0

echo "=== [1/6] GIT WORKSPACE & DIFF AUDIT ==="
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "detached")
  COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "none")
  MOD_COUNT=$(git status --porcelain | wc -l | tr -d ' ')
  echo "BRANCH=${BRANCH} | COMMIT=${COMMIT} | CHANGED_ENTRIES=${MOD_COUNT}"
  git status --short
  git diff --stat
  git diff --staged --stat
else
  echo "WARN: Not a git repository; auditing filesystem state."
fi

echo "=== [2/6] STATIC COMPILATION, TYPE & LINT GATE ==="
if [ -f "package.json" ]; then
  if grep -q '"typecheck"' package.json; then
    npm run -s typecheck || FAIL_COUNT=$((FAIL_COUNT + 1))
  elif [ -f "tsconfig.json" ] && command -v npx >/dev/null 2>&1; then
    npx --no-install tsc --noEmit || FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
  if grep -q '"lint"' package.json; then
    npm run -s lint || FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
fi

echo "=== [3/6] LIVE LOCALHOST PORT DISCOVERY & DEV SERVER CHECK ==="
DETECTED_URL="${CUSTOM_URL}"
if [ -z "${DETECTED_URL}" ]; then
  for PORT in 8080 5173 3000 4173 4200 8000; do
    if curl -s -o /dev/null --max-time 2 "http://localhost:${PORT}"; then
      DETECTED_URL="http://localhost:${PORT}"
      break
    fi
  done
fi

if [ -z "${DETECTED_URL}" ] && [ -f "package.json" ]; then
  echo "INFO: Localhost offline. Attempting background dev server launch..."
  nohup npm run dev > .dev_server_runtime.log 2>&1 &
  sleep 4
  for PORT in 8080 5173 3000 4173 4200 8000; do
    if curl -s -o /dev/null --max-time 2 "http://localhost:${PORT}"; then
      DETECTED_URL="http://localhost:${PORT}"
      break
    fi
  done
fi

echo "=== [4/6] LIVE LOCALHOST HTTP, DOM & HMR HEALTH PROBE ==="
if [ -n "${DETECTED_URL}" ]; then
  HTTP_METRICS=$(curl -s -S -L -o .localhost_dom_snapshot.html -w "%{http_code}|%{time_total}" --max-time 5 "${DETECTED_URL}" || echo "000|0")
  HTTP_CODE=$(echo "${HTTP_METRICS}" | cut -d'|' -f1)
  HTTP_TIME=$(echo "${HTTP_METRICS}" | cut -d'|' -f2)
  echo "LOCALHOST_URL=${DETECTED_URL} | HTTP_STATUS=${HTTP_CODE} | LATENCY=${HTTP_TIME}s"

  if [ "${HTTP_CODE}" != "200" ]; then
    echo "ERROR: Localhost returned non-200 status (${HTTP_CODE})"
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi

  if [ -f ".localhost_dom_snapshot.html" ]; then
    if grep -E -i "Internal Server Error|Failed to compile|SyntaxError|ReferenceError|vite-error-overlay" .localhost_dom_snapshot.html >/dev/null 2>&1; then
      echo "ERROR: Runtime error overlay detected in live localhost HTML payload."
      FAIL_COUNT=$((FAIL_COUNT + 1))
    else
      echo "DOM_SNAPSHOT=CLEAN"
    fi
  fi

  if [ -f ".dev_server_runtime.log" ]; then
    if grep -E -i "error|Failed to compile|Pre-transform error|Internal server error" .dev_server_runtime.log >/dev/null 2>&1; then
      echo "ERROR: Bundler/HMR log contains compilation errors."
      tail -n 20 .dev_server_runtime.log
      FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
  fi
else
  echo "ERROR: Could not reach or start any localhost development server."
  FAIL_COUNT=$((FAIL_COUNT + 1))
fi

echo "=== [5/6] MARKDOWN MEMORY SPINE CHECK ==="
if [ -f "${TARGET_MD}" ]; then
  echo "MARKDOWN_SPINE=${TARGET_MD} (EXISTS)"
else
  echo "WARN: ${TARGET_MD} not yet created; will be initialized in Phase VII."
fi

echo "=== [6/6] STOP-CHECK VERDICT GATE ==="
rm -f .localhost_dom_snapshot.html
if [ "${FAIL_COUNT}" -eq 0 ]; then
  echo "VERIFIER_VERDICT=ACCEPTED (EXIT_CODE=0)"
  exit 0
else
  echo "VERIFIER_VERDICT=REMEDIATE_REQUIRED (FAIL_COUNT=${FAIL_COUNT}, EXIT_CODE=1)"
  exit 1
fi
