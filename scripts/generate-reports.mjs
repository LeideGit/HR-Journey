#!/usr/bin/env node
// Genererar reports/traceability.md, reports/readiness.md och reports/evaluation.md
// från PRD, specs/, project/feature-list.json och evals/cases/. Redigera inte rapporterna för hand.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
const ID = /\b[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)*-\d{3}\b/g;
const isPrdId = (id) => !id.startsWith('FEAT-') && !id.startsWith('AC-FEAT-');

const PRD = 'PRD-HR-Journey-v002.md';
if (!existsSync(join(root, PRD))) {
  console.error(`BLOCKED: ${PRD} saknas. Rapporter genereras inte.`);
  process.exit(1);
}

const prdIds = [...new Set(read(PRD).match(ID) ?? [])].sort();
const list = JSON.parse(read('project/feature-list.json'));
const featById = new Map(list.features.map((f) => [f.id, f]));

// PRD-ID -> set av FEAT-ID som refererar till det
const featRefs = new Map();
for (const name of readdirSync(join(root, 'specs')).filter((f) => /^FEAT-\d{3}-.+\.md$/.test(f)).sort()) {
  const text = readFileSync(join(root, 'specs', name), 'utf8');
  const id = text.match(/- \*\*FEAT-ID:\*\* (FEAT-\d{3})/)[1];
  for (const ref of new Set(text.match(ID) ?? [])) {
    if (!isPrdId(ref)) continue;
    if (!featRefs.has(ref)) featRefs.set(ref, new Set());
    featRefs.get(ref).add(id);
  }
}

// evals
const evalCases = readdirSync(join(root, 'evals/cases')).filter((f) => f.endsWith('.yaml')).sort().map((f) => {
  const t = readFileSync(join(root, 'evals/cases', f), 'utf8');
  return {
    id: t.match(/^id: (\S+)/m)?.[1] ?? f,
    title: t.match(/^title: (.+)/m)?.[1] ?? '',
    feat: t.match(/^feat: (FEAT-\d{3})/m)?.[1] ?? '?',
    prd: (t.match(/^prd: \[(.+)\]/m)?.[1] ?? '').split(',').map((s) => s.trim()).filter(Boolean),
    status: t.match(/^status: (\S+)/m)?.[1] ?? 'not-run',
  };
});
const evalByPrd = new Map();
for (const c of evalCases) {
  for (const p of c.prd) {
    if (!evalByPrd.has(p)) evalByPrd.set(p, []);
    evalByPrd.get(p).push(c.id);
  }
}

mkdirSync(join(root, 'reports'), { recursive: true });

// --- traceability
let t = `# Spårbarhet: PRD → FEAT → implementation → test → resultat → review\n\n`;
t += `Genererad av \`scripts/generate-reports.mjs\`. Redigera inte för hand.\n\n`;
t += `PRD: ${PRD}. PRD-ID totalt: ${prdIds.length}.\n\n`;
t += `| PRD-ID | FEAT | Implementation | Test/eval | Resultat | Review |\n|---|---|---|---|---|---|\n`;
for (const id of prdIds) {
  const feats = [...(featRefs.get(id) ?? [])].sort();
  const impl = feats.length && feats.every((f) => !featById.get(f)?.implementation) ? 'ingen' : 'finns';
  const tests = evalByPrd.get(id) ?? [];
  const featCell = feats.length ? feats.join(', ') : '**saknas**';
  t += `| ${id} | ${featCell} | ${impl} | ${tests.join(', ') || 'ingen'} | ej körd | ej genomförd |\n`;
}
writeFileSync(join(root, 'reports/traceability.md'), t);

// --- readiness
const counts = {};
for (const f of list.features) counts[f.status] = (counts[f.status] ?? 0) + 1;
const allComplete = list.features.every((f) => f.status === 'complete');
let r = `# Readiness\n\n`;
r += `Genererad av \`scripts/generate-reports.mjs\`. Redigera inte för hand.\n\n`;
r += `## Beslut\n\n**${allComplete ? 'Redo' : 'EJ REDO för release'}.** `;
r += `${Object.entries(counts).map(([s, n]) => `${n} ${s}`).join(', ')}.\n\n`;
r += `Ingen feature har implementation. Completion-gate i REVIEW.md är inte uppfylld för någon feature.\n\n`;
r += `## Status per FEAT\n\n| FEAT | Titel | Scope | Status | Blockerad av |\n|---|---|---|---|---|\n`;
for (const f of list.features) {
  const blockers = [...(f.blocked_by ?? []), ...(f.blocked_parts ?? []).map((p) => `del: ${p}`)];
  r += `| ${f.id} | ${f.title} | ${f.scope} | ${f.status} | ${blockers.join(', ') || '-'} |\n`;
}
r += `\n## Öppna beslut\n\n| ID | Beslut | Ägare | Status |\n|---|---|---|---|\n`;
for (const d of list.open_decisions) {
  r += `| ${d.id} | ${d.text} | ${d.owner} | ${d.status ?? 'open'} |\n`;
}
r += `\n## Kontroller som inte är konfigurerade\n\nSe REVIEW.md, avsnitt 14.\n`;
writeFileSync(join(root, 'reports/readiness.md'), r);

// --- evaluation
let e = `# Evaluering\n\n`;
e += `Genererad av \`scripts/generate-reports.mjs\`. Redigera inte för hand.\n\n`;
e += `Runner: ej implementerad. Baselines: se \`evals/baselines.json\`.\n\n`;
e += `| Case | FEAT | PRD | Titel | Status |\n|---|---|---|---|---|\n`;
for (const c of evalCases) {
  e += `| ${c.id} | ${c.feat} | ${c.prd.join(', ')} | ${c.title} | ${c.status} |\n`;
}
const passed = evalCases.filter((c) => c.status === 'passed').length;
e += `\nTotalt: ${evalCases.length} cases, ${passed} passerade, ${evalCases.length - passed} ej passerade.\n`;
writeFileSync(join(root, 'reports/evaluation.md'), e);

console.log(`Rapporter skrivna: traceability (${prdIds.length} PRD-ID), readiness, evaluation (${evalCases.length} cases).`);
