# Grader: mockindikator och ingen verklig trafik

Används av: EVAL-M365-001.
PRD: FR-M365-MVP-005, FR-M365-MVP-009, AC-M365-MVP-007, AC-M365-MVP-008, OPS-010. FEAT-008.

## Godkänt

- Mötet är märkt som mockat i UI och i data (`is_mock = true`).
- Inga kalenderinbjudningar eller Teams-länkar skapas.
- Inga nätverksanrop till Microsoft-domäner under flödet.

## Underkänt

- Mötet ser ut som verkligt bokat utan mockmarkering (RISK-010).
- En Teams-länk eller kalenderreferens visas eller lagras.
- Något anrop går till graph.microsoft.com eller login.microsoftonline.com.
