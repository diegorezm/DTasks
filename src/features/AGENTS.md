# Features — Agent Guide

All domain logic lives here. Each subdirectory is a self-contained feature module. Read this before creating or modifying any feature.

## Existing Features

As the project grows, each feature will be listed here with a one-line description. Keep this list up to date when adding a new feature.

| Feature | Description |
|---|---|
| _(none yet)_ | |

## Feature Folder Structure

Every feature follows this layout:

```
src/features/<name>/
├── <name>.queries.ts   # Drizzle DB queries — only DB access lives here
├── <name>.service.ts   # Business logic — pure functions, no DB imports directly
├── <name>.server.ts    # TanStack Start server functions (createServerFn)
├── <name>.types.ts     # Local types and Zod schemas for this feature
├── components/         # React components scoped to this feature
│   └── FeatureThing.tsx
└── hooks/              # React hooks scoped to this feature (TanStack Query hooks)
    └── use-feature-thing.ts
```

Not every file is required for every feature — only create what the feature actually needs. A simple read-only feature might only need `.queries.ts` and `.server.ts`.

## Layer Responsibilities

### `<name>.queries.ts`
Raw Drizzle queries. No business logic, no validation. Returns raw DB rows. Every function receives `db` as its first argument — never import the db client as a singleton here.

```ts
// Good
export async function getIssueById(db: DrizzleD1Database, id: string) {
  return db.select().from(issues).where(eq(issues.id, id)).get()
}

// Bad — db imported as a global, business logic mixed in
import { db } from '~/db'
export async function getIssue(id: string) { ... }
```

### `<name>.service.ts`
Business logic only. Calls query functions, applies rules, transforms data. Pure functions — no direct DB imports, no HTTP concerns. This is the easiest layer for an agent to reason about and test.

```ts
export async function resolveIssue(
  input: ResolveIssueInput,
  db: DrizzleD1Database
): Promise<Issue> {
  const issue = await getIssueById(db, input.issueId)
  if (!issue) throw new Error('Issue not found')
  if (issue.status === 'closed') throw new Error('Issue is already closed')
  return updateIssueStatus(db, input.issueId, 'awaiting_review')
}
```

### `<name>.server.ts`
TanStack Start server functions (`createServerFn`). Handles auth context, calls service functions, returns data to the client. Validation happens here via Zod before anything reaches the service layer.

```ts
export const createIssue = createServerFn({ method: 'POST' })
  .validator(CreateIssueSchema)
  .handler(async ({ data, context }) => {
    const db = getDb(context.cloudflare.env.DB)
    return issueService.createCustomerIssue(data, db)
  })
```

### `<name>.types.ts`
Zod schemas and inferred types local to this feature. If a type is shared between two or more features, move it to `src/lib/types.ts` instead.

```ts
export const CreateIssueSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  categoryId: z.string().uuid(),
  panelId: z.string().uuid(),
})

export type CreateIssueInput = z.infer<typeof CreateIssueSchema>
```

### `components/`
React components that belong exclusively to this feature. If a component is used by two or more features, move it to `src/components/` (shared UI).

- One component per file
- File name matches the component name (`IssueCard.tsx` exports `IssueCard`)
- No `useEffect` — use hooks or loaders for data

### `hooks/`
TanStack Query hooks for this feature's data. Each hook wraps a server function call.

```ts
export function useIssues(panelId: string) {
  return useQuery({
    queryKey: ['issues', panelId],
    queryFn: () => getIssues({ data: { panelId } }),
  })
}
```

## Rules

- **Never import from one feature into another feature directly.** If two features need to share logic, extract it into `src/lib/`
- **Never put UI components in `.server.ts` files** — server functions are server-only
- **One Zod schema per operation** — `CreateIssueSchema`, `UpdateIssueSchema`, not one big `IssueSchema` used for everything
- **Add your feature to the table at the top of this file** when you create it

## Adding a New Feature — Checklist

- [ ] Create `src/features/<name>/` folder
- [ ] Add schema file(s) to `src/db/schema/` if new DB tables are needed
- [ ] Run `pnpm db:generate` and review the migration SQL
- [ ] Create `<name>.types.ts` with Zod schemas first
- [ ] Create `<name>.queries.ts` for DB access
- [ ] Create `<name>.service.ts` for business logic
- [ ] Create `<name>.server.ts` for server functions
- [ ] Add components and hooks as needed
- [ ] Update the feature table at the top of this file
