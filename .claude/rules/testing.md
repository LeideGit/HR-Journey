---
paths:
  - "**/*.test.*"
  - "**/*.spec.*"
  - "evals/**"
  - "supabase/tests/**"
---

# Testregler för HR Journey

- Varje test och varje eval anger PRD-ID:n och FEAT-ID:n i en kommentar eller ett fält.
- Negativa behörighetstester är obligatoriska för alla RLS-, Storage- och AI-funktioner: HR får inte läsa särskilt skyddade dokument, HR får inte ändra administration, anonym får inget.
- Tester för mock-M365 ska visa att inga nätverksanrop mot Microsoft-domäner görs (TEST-M365-004).
- Tester för AI ska visa att ingen extern LLM anropas (TEST-AI-010).
- Ett test som passerar utan att testa något är ett fel. Lägg inte till skenassertioner.
- Tester får inte använda verkliga personuppgifter. Använd fiktiva seed-data.
- Ett test som ändras för att få grönt är en regression tills det bevisats vara fel. Motivera ändringen i PR-beskrivningen.
