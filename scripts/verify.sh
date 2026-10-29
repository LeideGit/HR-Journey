#!/usr/bin/env bash
# Kör alla kontroller. Ett steg som inte är konfigurerat markeras SKIPPED och ger
# misslyckande, så verify aldrig visar godkänt för något som inte kontrollerats.
set -u
cd "$(dirname "$0")/.." || exit 1

failed=0
step() { printf '\n== %s\n' "$1"; }
ok() { echo "OK: $1"; }
fail() { echo "FAIL: $1"; failed=1; }
skip() { echo "SKIPPED: $1"; failed=1; }

step "Spec-validering (PRD-mappning, FEAT-status mot feature-list)"
if node scripts/validate-specs.mjs; then ok "validate-specs"; else fail "validate-specs"; fi

step "PRD är inte spårad i git"
if git ls-files 'PRD-HR-Journey*.md' | grep -q .; then
  fail "PRD är spårad i git. Ta bort den från indexet."
else
  ok "PRD är inte spårad"
fi

step "Hemlighetsskanning av spårade filer"
# Matchar faktiska värden, inte namn. Ordet service_role i kommentarer ska inte ge träff.
pattern='sb_secret_[A-Za-z0-9_-]{10,}|service_role_key *= *"?ey|SUPABASE_SERVICE_ROLE_KEY *= *[^ ]+|-----BEGIN [A-Z ]*PRIVATE KEY|eyJhbGciOi[A-Za-z0-9_-]{20,}'
hits=""
while IFS= read -r f; do
  if grep -q -E -e "$pattern" "$f" 2>/dev/null; then hits="$hits $f"; fi
done < <(git ls-files -co --exclude-standard | grep -v -E '^scripts/verify\.sh$')
if [ -n "$hits" ]; then fail "möjlig hemlighet i:$hits"; else ok "inga träffar i spårade filer"; fi

step "Build, lint, typecheck, test"
if [ ! -f package.json ]; then
  skip "build, lint, typecheck, test. Ingen package.json än (implementationsplan fas 1)."
else
  for s in build lint typecheck test; do
    if node -e "const s=require('./package.json').scripts||{};process.exit(s['$s']?0:1)"; then
      if npm run --silent "$s"; then ok "npm run $s"; else fail "npm run $s"; fi
    else
      fail "npm-skriptet '$s' saknas i package.json"
    fi
  done
fi

step "Evals"
node scripts/run-evals.mjs
rc=$?
if [ "$rc" -eq 0 ]; then ok "evals"; else fail "evals ej körda (kod $rc). Runner saknas."; fi

step "Databas och RLS (lokal Supabase)"
if [ ! -d supabase/migrations ]; then
  skip "RLS-tester. Inga migrationer än (FEAT-010)."
elif ! command -v supabase >/dev/null 2>&1 || ! docker info >/dev/null 2>&1; then
  skip "RLS-tester. Supabase CLI eller Docker saknas. Se project-preparations.md sektion 3."
else
  # Återskapa lokal databas från migrationer och seed, kör RLS-testet, och kontrollera utfallet.
  supabase db reset --local >/dev/null 2>&1 || fail "supabase db reset misslyckades"
  out=$(docker exec -i "$(docker ps --format '{{.Names}}' | grep supabase_db_ | head -1)" \
        psql -U postgres -d postgres -v ON_ERROR_STOP=0 -f - < supabase/tests/rls_dokument.sql 2>&1)
  echo "$out" | grep -E 'NOTICE: +TEST' | sed 's/^.*NOTICE: *//'
  if echo "$out" | grep -q 'FAIL'; then
    fail "RLS-test har FAIL-påståenden"
  elif [ "$(echo "$out" | grep -c 'TEST .*: PASS')" -lt 7 ]; then
    fail "RLS-testet gav färre än 7 PASS. Kontrollera utskriften."
  else
    ok "RLS- och Storage-tester (7 påståenden)"
  fi
  supabase db reset --local >/dev/null 2>&1
fi

step "Ej konfigurerade kontroller"
skip "ändrade filer utan FEAT-koppling, progress och rapporter mot status (REVIEW.md avsnitt 14)"

echo
if [ "$failed" -eq 0 ]; then
  echo "VERIFY: OK"
else
  echo "VERIFY: EJ GODKÄND. Se FAIL och SKIPPED ovan."
fi
exit "$failed"
