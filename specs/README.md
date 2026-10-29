# Specifikationer (FEAT)

Varje feature har en fil `specs/FEAT-NNN-<namn>.md`. Filen är ett levande kontrakt: den beskriver aktuellt beteende och aktuella verifieringskrav, inte historik.

## Obligatoriska fält

Varje FEAT-fil ska innehålla:

- `FEAT-ID`
- `Status` (en av: `planned`, `in-progress`, `needs-verification`, `blocked`, `complete`)
- `PRD-ID` (giltiga ID:n från PRD-HR-Journey-v002.md)
- `Scopeklassificering` (MVP, Future eller kombinerad)
- Avsnitten 1–10: beteende, icke-mål, datamodell, säkerhet och integritet, beroenden, risker, acceptanskriterier, test och eval, verifieringsevidens, öppna blockerare

## Statusregler

- `planned`: ingen implementation.
- `in-progress`: implementation pågår.
- `needs-verification`: implementation finns men är inte verifierad mot aktuell PRD.
- `blocked`: en öppen fråga eller ett beslut stoppar arbetet. Ange vilket i avsnitt 10.
- `complete`: uppfyller completion-gate i REVIEW.md. Kan återgå till `needs-verification` när en regression upptäcks.

Statusen i FEAT-filen och i `project/feature-list.json` ska vara identisk. `scripts/validate-specs.mjs` kontrollerar det.

## Klassificering av påståenden

- **supported**: finns i PRD:n. Godkänt implementationsscope.
- **conflicting**: motsägs av PRD:n eller annan FEAT. Ska lösas innan implementation.
- **ambiguous**: PRD:n är oklar. Ange förslag och ansvarig.
- **not-represented**: finns inte i PRD:n. Ska inte implementeras.

## Future och Needs investigation

Future-innehåll står i egna avsnitt och får inte implementeras utan godkänd PRD-ändring. Osäkra Microsoft Graph-detaljer märks `Needs investigation`.

## Mall

Kopiera en befintlig FEAT-fil och byt innehåll. Mallen är inte en separat fil, eftersom den bara skulle driva isär från de riktiga specarna.
