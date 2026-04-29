# DTask — Agent Guide

DTask is a project management platform with a dual-portal model: an internal team workspace (Kanban boards, project management) and an external customer-facing portal (issue submission and tracking). Read this file before writing any code.

## Project Overview

- **Runtime**: Cloudflare Workers (V8 isolate — not Node.js)
- **Framework**: TanStack Start (React, file-based routing)
- **Database**: Cloudflare D1 (SQLite) via Drizzle ORM
- **Auth**: Better Auth
- **Storage**: Cloudflare R2
- **Sessions/Tokens**: Cloudflare KV
- **Linter/Formatter**: Biome (`biome.json` at root)
- **Package manager**: pnpm

## Where Things Live

```
src/
├── db/           # Drizzle client (index.ts) and schema files
├── features/     # All domain logic — see features/AGENTS.md
├── lib/          # Shared utilities, auth config, env helpers
├── integrations/ # Third-party integrations (Better Auth, etc.)
├── routes/       # TanStack Start file-based routes
│   ├── __root.tsx
│   ├── api/      # API routes (server-side only)
│   └── ...       # Page routes
└── styles.css    # Global styles
```

For any domain feature (issues, kanban, organizations, etc.), **always look inside `src/features/` first** before creating anything new. Read `src/features/AGENTS.md` before adding or modifying a feature.

For database schema, look at `src/db/`. Each entity has its own schema file. The `src/db/index.ts` exports the Drizzle client.

For auth configuration and session helpers, look at `src/lib/auth.ts`.

## TypeScript Rules

- **Never use `any`** unless there is a concrete, commented reason why the type cannot be known
- **Never use type casting (`as`)** unless interfacing with an untyped external API, and always leave a comment explaining why
- **Prefer `unknown` over `any`** when the type is genuinely uncertain — then narrow it explicitly
- All server function inputs must be validated with a Zod schema — never trust raw input
- Derive types from Zod schemas with `z.infer<>` instead of writing duplicate interface definitions
- Drizzle's `InferSelectModel` and `InferInsertModel` are the source of truth for DB types — do not rewrite them manually

## React Rules

- **Never use `useEffect`** — use TanStack Query for data fetching, TanStack Router's `loader` for route data, and event handlers for side effects
- If you feel the urge to write `useEffect`, stop and reconsider the data flow
- Prefer server functions (`createServerFn`) over client-side fetching wherever possible
- Keep components focused — if a component exceeds ~150 lines, split it

## General Code Rules

- **Feature-based architecture** — code is organized by domain feature, not by technical layer. Never create top-level `controllers/`, `services/`, or `repositories/` folders
- Colocate everything related to a feature inside its `src/features/<name>/` folder
- Exported function names must be fully descriptive: `createCustomerIssue`, not `create`
- Pure functions over classes — business logic should be plain functions that take data as arguments
- Do not use barrel `index.ts` files that re-export everything — import directly from the source file
- Prefer explicit over implicit — if something is not obvious from the name alone, add a one-line comment

## Database Rules

- Use `integer('column', { mode: 'timestamp' })` for all date/time fields — D1 has no native date type
- Use D1's batch API (`db.batch([...])`) instead of transactions — D1 does not support `BEGIN`/`COMMIT`
- Always review generated migration SQL before applying — Drizzle may generate unsafe table drops when FKs are involved
- Never run `drizzle-kit migrate` against D1 directly — generate with `pnpm db:generate`, apply with `pnpm db:migrate:local` or `pnpm db:migrate:prod`
- FK constraint gotcha: D1 ignores `PRAGMA foreign_keys = OFF`. If a migration recreates a table, rewrite it manually as a backup/rename/restore pattern

## Cloudflare Workers Rules

- Do not use `localStorage` or `sessionStorage` — they are unavailable in the Workers runtime
- Do not import Node.js built-ins unless the `nodejs_compat` flag is set in `wrangler.jsonc` and the specific module is known to be supported
- Access CF bindings (`DB`, `R2`, `KV`) through the request context — never as global singletons
- Cold starts must stay fast — avoid heavy top-level imports and dynamic `require()`

## Migrations Workflow

```bash
pnpm db:generate          # generate SQL from schema changes
pnpm db:migrate:local     # apply to local D1
pnpm db:migrate:prod      # apply to remote D1 (production)
```

Always run `db:migrate:local` and verify locally before running `db:migrate:prod`.
