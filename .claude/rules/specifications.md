---
paths:
  - "specs/**"
  - "project/**"
  - "docs/adr/**"
---

# Specifikationsregler för HR Journey

- Mall och statusregler: se `specs/README.md`.
- Varje FEAT anger PRD-ID:n som finns i PRD-HR-Journey-v002.md. Hitta inte på ID:n.
- Varje påstående i FEAT klassificeras som supported, conflicting, ambiguous eller not-represented. Endast supported är implementationsscope.
- Ändra inte en FEAT för att passa implementationen. Ändra den när beteendet faktiskt ändras, och ange varför.
- `project/feature-list.json` är status-auktoritet. Sätt inte `complete` utan completion-gate i REVIEW.md.
- En ADR ändras inte tyst. Ersätt den med en ny ADR och länka den gamla som ersatt.
