#!/usr/bin/env bash
set -uo pipefail

TARGET_MD="${TARGET_MD_FILE:-STATUS.md}"
echo ">>> [GIT PRE-COMMIT GATE] Running Autonomous Loop & Live Localhost Verifier..."

if [ ! -x "./.loop_verifier.sh" ]; then
  chmod +x ./.loop_verifier.sh 2>/dev/null || true
fi

./.loop_verifier.sh
VERIFY_EXIT=$?

if [ "${VERIFY_EXIT}" -ne 0 ]; then
  echo ">>> [PRE-COMMIT BLOCKED] Verification failed (EXIT_CODE=${VERIFY_EXIT}). Fix static/localhost errors before committing."
  exit 1
fi

if [ ! -f "${TARGET_MD}" ]; then
  echo ">>> [PRE-COMMIT BLOCKED] ${TARGET_MD} is missing. Run the synchronization loop to generate ${TARGET_MD}."
  exit 1
fi

if ! grep -q "Final Gate Verdict: ACCEPTED" "${TARGET_MD}" && ! grep -q "Final Gate Verdict: REMEDIATED & ACCEPTED" "${TARGET_MD}" && ! grep -q "\*\*Final Gate Verdict:\*\* ACCEPTED" "${TARGET_MD}" && ! grep -q "\*\*Final Gate Verdict:\*\* REMEDIATED & ACCEPTED" "${TARGET_MD}"; then
  echo ">>> [PRE-COMMIT BLOCKED] ${TARGET_MD} does not contain an ACCEPTED verdict for the latest batch."
  exit 1
fi

git add "${TARGET_MD}"
echo ">>> [PRE-COMMIT ACCEPTED] Codebase, Live Localhost, and ${TARGET_MD} verified and staged."
exit 0
