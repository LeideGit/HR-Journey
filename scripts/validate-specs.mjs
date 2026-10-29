#!/usr/bin/env node
// Validerar specs/FEAT-*.md mot PRD och project/feature-list.json.
// Kör: node scripts/validate-specs.mjs
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
const errors = [];
const err = (msg) => errors.push(msg);

// PRD är git-ignorerad av designbeslut (publikt repo). CI har den inte.
// Lokalt: full validering mot PRD. I CI: övriga kontroller körs, och PRD-mappningen hoppas över
// med en tydlig notis. Lokal körning får inte hoppa över något.
const PRD = 'PRD-HR-Journey-v002.md';
const prdPresent = existsSync(join(root, PRD));
const inCi = process.env.CI === 'true';
if (!prdPresent && !inCi) {
  console.error(`BLOCKED: ${PRD} saknas lokalt. Bifoga PRD:n innan validering.`);
  process.exit(1);
}
if (!prdPresent) {
  console.log(`NOTIS: ${PRD} finns inte i CI. PRD-mappning kontrolleras lokalt, inte här.`);
}

const ID = /\b[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)*-\d{3}\b/g;
const isPrdId = (id) => !id.startsWith('FEAT-') && !id.startsWith('AC-FEAT-');
const prdIds = new Set(prdPresent ? read(PRD).match(ID) ?? [] : []);
const STATUSES = new Set(['planned', 'in-progress', 'needs-verification', 'blocked', 'complete']);
const HEADINGS = ['Beteende', 'Icke-mål', 'Datamodell', 'Säkerhets', 'Beroenden', 'Risker',
  'Acceptans', 'Test', 'Verifieringsevidens', 'Öppna blockerare'];

const list = JSON.parse(read('project/feature-list.json'));
const byId = new Map();
for (const f of list.features) {
  if (byId.has(f.id)) err(`${f.id}: duplicerad i project/feature-list.json`);
  byId.set(f.id, f);
}

const specNames = readdirSync(join(root, 'specs')).filter((f) => /^FEAT-\d{3}-.+\.md$/.test(f));
const specIds = new Map();
const covered = new Set();

for (const name of specNames) {
  const file = name.normalize('NFC');
  const text = readFileSync(join(root, 'specs', name), 'utf8');
  const id = text.match(/- \*\*FEAT-ID:\*\* (FEAT-\d{3})/)?.[1];
  const status = text.match(/- \*\*Status:\*\* (\S+)/)?.[1];
  if (!id) {
    err(`${file}: saknar FEAT-ID`);
    continue;
  }
  if (specIds.has(id)) err(`${id}: duplicerat FEAT-ID i ${file} och ${specIds.get(id)}`);
  specIds.set(id, file);

  if (!STATUSES.has(status)) err(`${id}: ogiltig status "${status}"`);

  const prdLine = text.match(/- \*\*PRD-ID:\*\* (.+)/)?.[1] ?? '';
  for (const ref of prdLine.match(ID) ?? []) {
    if (prdPresent && isPrdId(ref) && !prdIds.has(ref)) err(`${id}: PRD-ID ${ref} finns inte i PRD`);
  }
  for (const ref of text.match(ID) ?? []) {
    if (!prdPresent || !isPrdId(ref)) continue;
    if (prdIds.has(ref)) covered.add(ref);
    else err(`${id}: refererar ${ref} som inte finns i PRD`);
  }

  for (const h of HEADINGS) {
    if (!new RegExp(`^##.*${h}`, 'mi').test(text)) err(`${id}: saknar avsnitt med "${h}"`);
  }

  const entry = byId.get(id);
  if (!entry) {
    err(`${id}: saknas i project/feature-list.json`);
    continue;
  }
  if (entry.spec !== `specs/${file}`) {
    err(`${id}: spec-sökväg i feature-list (${entry.spec}) stämmer inte med ${file}`);
  }
  if (status !== entry.status) {
    err(`${id}: status ${status} i FEAT men ${entry.status} i feature-list`);
  }
  if (entry.status === 'complete' && (!entry.evidence || !entry.implementation)) {
    err(`${id}: complete utan evidens eller implementation`);
  }
  if (entry.scope === 'Future' && ['in-progress', 'complete'].includes(entry.status)) {
    err(`${id}: Future-scope får inte vara ${entry.status}`);
  }
}

for (const id of byId.keys()) {
  if (!specIds.has(id)) err(`${id}: finns i feature-list men saknar FEAT-fil (orphan)`);
}

for (const id of prdPresent ? prdIds : []) {
  if (isPrdId(id) && !covered.has(id)) err(`PRD-ID ${id} är inte mappat till någon FEAT (omappat krav)`);
}

if (errors.length) {
  for (const e of errors) console.error(`FEL: ${e}`);
  console.error(`\n${errors.length} fel. Merge blockeras.`);
  process.exit(1);
}
console.log(prdPresent
  ? `OK: ${specNames.length} FEAT, ${covered.size} av ${prdIds.size} PRD-ID mappade.`
  : `OK: ${specNames.length} FEAT. PRD-mappning hoppad över (PRD saknas i CI).`);
