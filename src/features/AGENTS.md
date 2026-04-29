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
├── queries.ts        # Drizzle DB queries — only DB access lives here
├── actions.ts        # TanStack Start server functions + Zod validation
├── types.ts          # Zod schemas and inferred types for this feature
├── hooks/            # TanStack Query hooks
│   └── use-thing.ts
└── ui/
    ├── components/   # Reusable UI pieces scoped to this feature
    │   └── thing-component.tsx
    └── pages/        # Route-level page containers (imported by src/routes/)
        └── thing-page.tsx
```

Not every file is required for every feature — only create what the feature actually needs. A simple read-only feature might only need `queries.ts`, `actions.ts`, and a page.

## Layer Responsibilities

### `queries.ts`

Raw Drizzle queries. No business logic, no validation. Returns raw DB rows. Every function receives `db` as its first argument — never import the db client as a singleton here.

```ts
// Good
export async function getIssueById(db: DrizzleD1Database, id: string) {
  return db.select().from(issues).where(eq(issues.id, id)).get()
}

// Bad — db imported as a global, logic mixed in
import { db } from '~/db'
export async function getIssue(id: string) { ... }
```

### `actions.ts`

TanStack Start server functions (`createServerFn`). Each function handles one operation: validates input with Zod, runs the query, and returns data to the client. This is the only place `createServerFn` is used.

```ts
export const createIssue = createServerFn({ method: 'POST' })
  .validator(CreateIssueSchema)
  .handler(async ({ data, context }) => {
    const db = getDb(context.cloudflare.env.DB)
    const existing = await getIssueById(db, data.id)
    if (existing) throw new Error('Issue already exists')
    return insertIssue(db, data)
  })
```

Business logic that is too complex for a single handler can be extracted into a plain helper function in the same file — but only if it cannot be expressed cleanly as a query.

### `types.ts`

Zod schemas and inferred types local to this feature. One schema per operation — `CreateIssueSchema`, `UpdateIssueSchema` — never one large schema reused for everything. If a type is shared across two or more features, move it to `src/lib/types.ts`.

```ts
export const CreateIssueSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  categoryId: z.string().uuid(),
  panelId: z.string().uuid(),
})

export type CreateIssueInput = z.infer<typeof CreateIssueSchema>
```

### `hooks/`

TanStack Query hooks that wrap server function calls. One hook per logical data concern.

```ts
export function useIssues(panelId: string) {
  return useQuery({
    queryKey: ['issues', panelId],
    queryFn: () => listIssues({ data: { panelId } }),
  })
}
```

### `ui/components/`

Reusable UI pieces that belong exclusively to this feature — cards, forms, badges, lists. If a component is used by two or more features, move it to `src/components/` (shared UI).

- One component per file, kebab-case filename (`issue-card.tsx` exports `IssueCard`)
- No `useEffect` — use hooks or route loaders for data
- Components only receive data as props or read from hooks — no direct server function calls inside components

### `ui/pages/`

Route-level page containers. Each page maps to one route in `src/routes/` — the route file imports and renders the page, nothing more.

```tsx
// src/routes/dashboard/issues/index.tsx — thin wrapper only
import { IssuesPage } from '~/features/issues/ui/pages/issues-page'
export const Route = createFileRoute('/dashboard/issues/')({ component: IssuesPage })
```

Pages are responsible for composing components, calling hooks, and handling route-level loading/error states. They should not contain fine-grained UI logic — extract that into `ui/components/`.

## Rules

- **Never import from one feature into another feature directly.** If shared logic is needed, extract it into `src/lib/`
- **Never put UI components in `actions.ts`** — server functions are server-only
- **Routes are thin wrappers.** All real logic lives in the feature, not in `src/routes/`
- **One Zod schema per operation** — `CreateIssueSchema`, `UpdateIssueSchema`, not one `IssueSchema` for everything
- **Add your feature to the table at the top of this file** when you create it

## Adding a New Feature — Checklist

- [ ] Create `src/features/<name>/` folder
- [ ] Add schema file(s) to `src/db/schema/` if new DB tables are needed
- [ ] Run `pnpm db:generate` and review the migration SQL before applying
- [ ] Write `types.ts` first — schemas define the contract for everything else
- [ ] Write `queries.ts` for DB access
- [ ] Write `actions.ts` for server functions
- [ ] Add `hooks/` and `ui/` as needed
- [ ] Update the feature table at the top of this file
