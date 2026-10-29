# FEAT-001 Autentisering och roller

- **FEAT-ID:** FEAT-001
- **Status:** in-progress (se `project/feature-list.json`)
- **Scopeklassificering:** MVP
- **PRD-ID:** AC-001, PP-009, SEC-002, SEC-004, SEC-005, SEC-006, FR-DOC-008, FR-AI-HIST-003, section 5.1, section 5.2, section 5.3, BL-014, BL-017
- **Ägare:** [TBD] ansvarig: användaren. Nästa steg: godkänna rollmodellen (klar, D-5).

## 1. Beteende

| ID | Påstående | Klassificering |
|---|---|---|
| FEAT-001-B1 | HR och HR-administratör loggar in och ser persistent fiktiv data (AC-001). | ambiguous: PRD anger inte inloggningsmetod. Förslag: e-post och lösenord via Supabase Auth (ADR-002). |
| FEAT-001-B2 | MVP har två roller: HR (5.1) och HR-administratör (5.2). | supported |
| FEAT-001-B3 | HR-administratör har extra behörighet för särskilt skyddade dokument (5.2, FR-DOC-008). | supported |
| FEAT-001-B4 | Roller verkställs i backend och RLS, inte bara i UI (PP-009, SEC-002). | supported |
| FEAT-001-B5 | Anonym åtkomst blockeras (SEC-004). | supported |
| FEAT-001-B6 | Personer loggar inte in i MVP (5.3, BL-017). | supported |
| FEAT-001-B7 | Hur konton skapas (provisionering) och om självregistrering är tillåten. | ambiguous: D-7 uppskjuten av användaren eftersom MVP är demo. |
| FEAT-001-B8 | Entra ID-produktionsinloggning. | Future, BL-014. Needs investigation. |

## 2. Icke-mål

- Entra ID eller annan extern identitetsleverantör (BL-014).
- Chef-, mentor- eller medarbetarinloggning (BL-017).
- Självregistrering. Ingen PRD-regel finns, så den är inte godkänd och ska inte aktiveras utan beslut (B7).

## 3. Datamodellspåverkan

- Roll lagras server-side, i en egen tabell kopplad till `auth.users`. Klienten får aldrig styra rollen.
- Tabellen och RLS-policyerna specificeras i FEAT-010.
- Lösenord hanteras av Supabase Auth. Ingen egen lösenordstabell.

## 4. Säkerhets- och integritetspåverkan

- **Hög risk** (Auth, RLS). Kräver två mänskliga reviewers vid merge enligt REVIEW.md.
- Service-role-nyckel får aldrig nå frontend (SEC-005, SEC-016).
- Negativa tester: HR får inte läsa särskilt skyddade dokument, HR får inte ändra systeminställningar (se FEAT-006, FEAT-011).
- Anonym åtkomst till tabeller, Storage och RPC blockeras (SEC-004).

## 5. Beroenden

- FEAT-010 (datamodell, RLS).
- Supabase Auth i hostat projekt `hr-journey` och lokalt (project-preparations.md, sektion 4).

## 6. Risker

- RISK-002: publik frontend förväxlas med publik dataåtkomst.
- RISK-006: särskilt dokumentskydd kringgås.
- RISK-003: privilegierad nyckel exponeras.

## 7. Acceptanskriterier

- AC-FEAT-001-1: Inloggad HR ser fiktiv persondata (AC-001).
- AC-FEAT-001-2: Utan inloggning returneras inga rader från exponerade tabeller (SEC-004).
- AC-FEAT-001-3: HR får 403 eller tom träff vid läsning av särskilt skyddat dokument (AC-010).
- AC-FEAT-001-4: Roll som skickas från klienten ändrar ingen åtkomst.

## 8. Test- och evalkrav

- TEST-006 (RLS-tester), TEST-SEC-003 (anonym åtkomst), TEST-007 (särskilt dokumentskydd).
- Test att service-role-nyckel inte finns i frontend-bundlen (TEST-M365-007 gäller även här; SEC-005).

## 9. Verifieringsevidens

- src/auth/LoginView.test.tsx (4 tester)
- supabase/tests/rls_dokument.sql (roller och åtkomst)
- Hostat: inloggning verifierad via Auth-API för båda konton; disable_signup=true
- Lokalt: båda konton loggar in med lösenord demo (verifierat 2026-10-29)
- Användarverifiering i webbläsare 2026-10-29

## 10. Öppna blockerare

- Provisionering (D-7) ej beslutad; konton skapade manuellt
- Test av inloggning i webbläsare i CI
- Granskning: PR #2 mergad utan granskning, REVIEW.md ej uppfylld
