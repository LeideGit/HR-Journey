# Grader: källförankring

Används av: EVAL-AI-001, EVAL-AI-002.
PRD: AC-AI-011, AC-AI-012, FR-AI-SRC-001, FR-AI-SRC-003. FEAT-007.

## Godkänt

- Varje påstående i svaret har minst en källa.
- Dokumentkälla anger exakt version-ID och versionsetikett.
- Inga objekt nämns som inte finns i seed-datan för aktuell fråga.

## Underkänt

- Ett påstående saknar källa.
- Källan anger fel version, eller bara dokumentnamnet.
- Svaret nämner data som inte finns i seed.
