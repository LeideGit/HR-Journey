#!/usr/bin/env bash
# Kontrollerar förutsättningar för HR Journey. Installerar inget.
set -u
cd "$(dirname "$0")/.." || exit 1

missing=0
check() {
  if command -v "$1" >/dev/null 2>&1; then
    echo "OK      $1"
  else
    echo "SAKNAS  $1  $2"
    missing=1
  fi
}

check git
check node "(v25 enligt project-preparations.md)"
check supabase "(CLI 2.x, se project-preparations.md sektion 3)"
check docker "(Colima. Sätt DOCKER_HOST, se project-preparations.md sektion 3)"

if [ -f PRD-HR-Journey-v002.md ]; then
  echo "OK      PRD-HR-Journey-v002.md finns lokalt"
else
  echo "SAKNAS  PRD-HR-Journey-v002.md. Begär bilagan innan arbete påbörjas."
  missing=1
fi

if [ "$missing" -eq 0 ]; then
  echo "Förutsättningar OK."
else
  echo "Förutsättningar saknas. Se ovan."
fi
exit "$missing"
