#!/usr/bin/env node
// Kontrollerar evals/cases/*.yaml och kör dem när runnern finns.
// Ingen runner finns än. Alla cases är därför NOT RUN, och skriptet avslutar med kod 2
// så att ingen tolkar det som godkänt.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'evals/cases');
const files = readdirSync(dir).filter((f) => f.endsWith('.yaml')).sort();

let problems = 0;
for (const f of files) {
  const t = readFileSync(join(dir, f), 'utf8');
  if (!t.match(/^feat: FEAT-\d{3}/m)) {
    console.error(`FEL ${f}: saknar feat`);
    problems++;
  }
  if (!t.match(/^prd: \[.+\]/m)) {
    console.error(`FEL ${f}: saknar prd-lista`);
    problems++;
  }
  const grader = t.match(/^grader: (\S+)/m)?.[1];
  if (grader && !existsSync(join(root, grader))) {
    console.error(`FEL ${f}: grader ${grader} finns inte`);
    problems++;
  }
}

if (problems) {
  console.error(`${problems} problem i eval-cases.`);
  process.exit(1);
}
console.log(`${files.length} cases kontrollerade. Runner är inte implementerad: alla är NOT RUN.`);
process.exit(2);
