# Features — Agent Guide

## Feature Table

| Feature | Description |
|---|---|
| auth | Email/password auth, sessions, users, accounts, organizations |

## Directory Structure

```
src/features/<name>/
├── models/           # Zod schemas + inferred types
├── queries/          # Drizzle DB access — <entity>.queries.ts
├── services/         # Business logic — <entity>.service.ts
├── lib/              # Helpers reusable within this feature
├── ui/
│   ├── components/   # Feature-scoped reusable UI
│   └── pages/        # Route-level containers
├── actions.ts        # TanStack Start server functions
└── hooks.ts          # TanStack Query hooks
```

Only create what the feature needs. A read-only feature may only need `queries/`, `actions.ts`, and a page.

## Layer Rules

### `models/`
Zod schemas and inferred types. Always derive schemas from Drizzle tables using `createSelectSchema` / `createInsertSchema` from `drizzle-orm/zod`. Only create a schema from scratch (`z.object(...)`) when it represents an operation that has no corresponding table (e.g. a login DTO where no `logins` table exists).

```ts
import { createInsertSchema, createSelectSchema } from "drizzle-orm/zod"
import { z } from "zod"
import { users } from "@/db/schemas/auth"

// Derive from table — always do this for entities that map to a DB table
export const userSelectSchema = createSelectSchema(users)
export const userInsertSchema = createInsertSchema(users, {
  email: z.email(),
  name: (s) => s.min(1).max(100),
  avatarUrl: z.url().optional(),
})
export type User = z.infer<typeof userSelectSchema>
export type NewUser = z.infer<typeof userInsertSchema>

// Create from scratch only when no table backs this schema
export const signUpWithEmailSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
})
export type SignUpWithEmailDTO = z.infer<typeof signUpWithEmailSchema>
```

**Rules:**
- Always use `createSelectSchema(table)` for select types
- Always use `createInsertSchema(table, overrides)` for insert types
- Never manually re-declare fields that already exist on the table
- Only use `z.object(...)` for DTOs that have no backing table

### `queries/<entity>.queries.ts`
Raw Drizzle queries. No business logic. Always receives `db: DB` as first arg. Returns `tryCatch(...)` — never throws. Single-record queries unwrap `rows[0] ?? null` before returning.
```ts
export const USER_QUERIES = {
  getByEmail: async (db: DB, email: string) => {
    const { data: rows, error } = await tryCatch(
      db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1)
    )
    if (error) return { data: null, error }
    return { data: rows[0] ?? null, error: null }
  },
  // Many-record queries return the tryCatch result directly (no unwrap)
  getByUserId: async (db: DB, userId: string) => {
    return tryCatch(db.select().from(schema.accounts).where(eq(schema.accounts.userId, userId)))
  },
}
```

### `services/<entity>.service.ts`
Business logic and transaction boundaries. Calls queries and `db.transaction`. `tryCatch` wraps at this layer for operations that compose multiple queries.
```ts
export async function createSession(userId: string) {
  const id = generateSecureRandomString()
  const secret = generateSecureRandomString()
  const secretHash = Buffer.from(await hashSecret(secret))
  const { data, error } = await SESSION_QUERIES.create(db, { id, userId, secretHash, createdAt: ... })
  if (error) return { data: null, error }
  return { data: { ...data, token: `${id}.${secret}` }, error: null }
}
```

### `actions.ts`
TanStack Start server functions only. Validates input, calls services/queries, updates session cookie. Never import `db` directly — use `DB` type passed through or imported singleton.
```ts
export const signUpWithEmail = createServerFn()
  .inputValidator(signUpWithEmailSchema)
  .handler(async ({ data }) => {
    const appSession = await useAppSession()
    const { data: user, error } = await USER_QUERIES.create(db, { ... })
    if (error) return { data: null, error: "Failed to create user." }
    await appSession.update({ token: session.token })
    return { data: { user }, error: null }
  })
```

### `hooks.ts`
TanStack Query wrappers. `queryOptions` for reads, `useMutation` + `invalidateQueries` for writes.
```ts
export const currentSessionQuery = queryOptions({
  queryKey: authKeys.session(),
  queryFn: () => getCurrentSession(),
})

export function useSignInWithEmail() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Parameters<typeof signInWithEmail>[0]['data']) => signInWithEmail({ data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.session() }),
  })
}
```

### `ui/pages/`
Route-level containers. Imported by `src/routes/` — the route file does nothing but render the page.
```ts
// src/routes/auth/sign-in.tsx
import { SignInPage } from '~/features/auth/ui/pages/sign-in-page'
export const Route = createFileRoute('/auth/sign-in')({ component: SignInPage })
```

### `ui/components/`
Feature-scoped reusable UI. One component per file, kebab-case. If used by 2+ features, move to `src/components/`.

## Error Handling Pattern
- **Queries** — always return `{ data, error }` via `tryCatch`. Never throw.
- **Single-record queries** — unwrap `rows[0] ?? null` inside the query function before returning.
- **Many-record queries** — return `tryCatch` result directly.
- **Services** — check `if (error) return { data: null, error }` after every query call.
- **Actions** — return user-facing error strings: `{ data: null, error: "Something went wrong." }`

## Session Pattern
`useAppSession()` from `@/features/auth/lib/app-session` wraps `useSession` from `@tanstack/react-start/server`. Call it at the top of any action that reads or writes the session cookie.

## Rules
- **No cross-feature imports.** Shared logic goes in `src/lib/`.
- **Routes are thin.** All logic lives in the feature.
- **Queries never import db as a singleton** — always receive `db: DB` as first arg.
- **Services own transactions** — `db.transaction(async (tx) => { ... })` never in queries or actions.
- **One Zod schema per operation** in `models/`.
- **Always derive entity schemas from Drizzle tables** using `createSelectSchema` / `createInsertSchema` from `drizzle-orm/zod`. Never manually redeclare fields that exist on the table. Only use `z.object(...)` for DTOs with no backing table.
- **Update the feature table** at the top of this file when adding a feature.

## Adding a Feature — Checklist
- [ ] Add DB tables to `src/db/schemas/` if needed, run `pnpm db:generate`
- [ ] Write `models/` first — schemas define the contract, always derive from Drizzle tables
- [ ] Write `queries/<entity>.queries.ts`
- [ ] Write `services/<entity>.service.ts` for business logic
- [ ] Write `actions.ts` for server functions
- [ ] Write `hooks.ts` for TanStack Query wrappers
- [ ] Add `ui/` as needed
- [ ] Update the feature table above
