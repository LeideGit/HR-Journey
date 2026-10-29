# Källor och referenser

## Styrande

- **PRD-HR-Journey-v002.md**: enda scope- och kravauktoritet. Lokal, git-ignorerad.
- **project-preparations.md**: miljö, Supabase och GitHub. Lokal, git-ignorerad.

## Verifierad dokumentation (Claude Code-format)

Verifierades 2026-10-29:

- CLAUDE.md, `@import` och `.claude/rules/` med `paths`: https://code.claude.com/docs/en/memory
- Subagenter (`.claude/agents/*.md`, frontmatter och modellvärden): https://code.claude.com/docs/en/sub-agents
- Settings-filer och precedens (`.claude/settings.json`, `permissions`): https://code.claude.com/docs/en/settings

## Citerat i PRD, ej verifierat av projektagenten

PRD-HR-Journey-v002.md hänvisar till Microsoft Learn för Graph-händelser, Calendars.ReadWrite och Teams-providerstöd. Dessa är **Needs investigation** tills de verifierats i samband med ADR-008 och framåt. Ingen design som bygger på dem får göras innan dess.

## Beslut

- `docs/adr/ADR-006-microsoft-graph-som-integrationslager.md`
- `docs/adr/ADR-007-mockad-m365-adapter-i-mvp.md`
- Mall: `docs/adr/ADR-template.md`
