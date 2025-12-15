# Copilot / AI Agent Instructions

Short, actionable notes to make AI coding agents productive in this repository.

## Purpose
- Help contributors and AI agents understand the project's architecture, key workflows, and repository-specific conventions so changes are safe and consistent.

## Big picture
- Framework: Next.js 14 (App Router). Main UI lives under `app/` (components, contexts, pages).
- Server-side utilities and DB logic live in `lib/` (see [lib/database.ts](lib/database.ts)).
- SQLite (better-sqlite3) is used directly — there is no ORM. DB file: `data/broker.db`.
- Scripts that perform setup, DB init and quick tests live in `scripts/` (`scripts/setup.js`, `scripts/init-complete-database.js`).

## Key workflows / commands
- Local dev: `npm install` then `npm run dev` (starts Next.js). See `package.json` scripts.
- One-time setup: `npm run setup` or `node scripts/setup.js` — creates `data/` and `public/uploads/` and a `.env.local` template.
- Build: `npm run build`; Start production: `npm run start`.
- Useful scripts for debugging/verifying admin flows: `npm run verify-admin`, `npm run test-workflow` (see `scripts/`).

## Important implementation notes (do not change lightly)
- Database initialization: `lib/database.ts` calls `initializeDatabase()` on import and creates tables and a default admin account. See `lib/database.ts` for exact SQL and default values.
- Default admin: created automatically (password `admin123` in current scripts). Change defaults in `lib/database.ts` or via `scripts/setup-admin.js` if adjusting.
- Status/enums are implemented with SQL CHECK constraints. Use exact strings when updating records. Example property `status` values: `pending_payment`, `pending`, `approved`, `sold`, `rejected`. (See [lib/database.ts](lib/database.ts)).
- Prepared statements: repository relies on `better-sqlite3` prepared statements exported from `lib/database.ts` (e.g., `propertyOperations`, `paymentOperations`). Reuse these where possible to preserve transaction/consistency patterns.

## Conventions & patterns
- Single `users` table contains `admin`, `broker`, and regular users (role column). Do not add separate user tables.
- Images are stored in `public/uploads/` and referenced by `property_images.image_url`.
- Payments flow: create `payments` row → admin verifies via WhatsApp confirmation → update payment status (`confirmed`/`rejected`) and property `status`. Follow current `paymentOperations.updateStatus` semantics.
- SQL is authoritative: prefer updating `lib/database.ts` prepared statements when changing data shapes rather than scattering raw SQL across handlers.

## Integration points & external dependencies
- WhatsApp integration placeholders and tokens are configured via `.env.local` (`WHATSAPP_CONTACT_PLACEHOLDER`, `WHATSAPP_API_TOKEN`). Check `scripts/setup.js` for default templates.
- Authentication: JWT + bcrypt (`jsonwebtoken`, `bcryptjs`). See `lib/auth.ts` and `app/api/auth` routes for usage patterns.

## Testing & debugging tips
- The DB is file-based (SQLite): examine `data/broker.db` directly for quick inspections, or run `node scripts/debug-database.js`.
- Many lightweight test and verification scripts exist in `scripts/` (e.g., `test-admin-login.js`, `test-workflow.js`) — run these for quick reproducible checks.

## Safety notes for PRs
- Avoid changing SQL enums or column names without updating `lib/database.ts` and all prepared statements and any `scripts/*` that expect those names.
- Be cautious when modifying default admin creation — there are multiple places (`lib/database.ts`, `scripts/setup.js`, `README.md`) with differing defaults; harmonize them and document the chosen default.

## Where to look for examples
- DB operations & conventions: [lib/database.ts](lib/database.ts)
- Setup and env templates: [scripts/setup.js](scripts/setup.js)
- App layout and UI components: `app/components/` and `app/layout.tsx`
- API routes: `app/api/` (auth, properties, payments, admin)

---
If anything is unclear or you want the agent to expand any section (examples, common PR changes, or safety checks), tell me which part to improve.
