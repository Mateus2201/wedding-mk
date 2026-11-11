# AGENTS.md

- Wedding details (names, date, venue, times) live in `src/lib/wedding.ts` and components import them — a detail change must happen once, not in every section.
- RSVP responses are saved in Lovable Cloud (insert-only for guests); the couple's /painel reads them through the guest-summary function gated by a COUPLE_PASSCODE secret — keeps guest data private without guest accounts.
