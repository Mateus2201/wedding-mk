# AGENTS.md

- Wedding details (names, date, venue, times) live in `src/lib/wedding.ts` and components import them — a detail change must happen once, not in every section.
- RSVP responses are saved in Lovable Cloud (insert-only for guests); the couple's single /painel page (tabs for RSVPs, gifts, reports) logs in once and reads RSVPs through guest-summary using the same signed couple session — keeps guest data private without guest accounts.
- Wishlist data is service-role-only; edge functions validate HMAC-signed expiring couple sessions before administrative actions, and serve only public gift fields to guests — client storage never grants permissions.
- Gift images use private Storage with server-issued upload and read URLs — public buckets are blocked by workspace policy.
- Gift payments cross the provider adapter; atomic reservation and idempotent confirmation functions own stock changes, and checkout fails closed until provider setup is complete — browser redirects cannot confirm purchases.
