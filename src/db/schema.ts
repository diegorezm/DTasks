import { sql } from "drizzle-orm";
import {
  blob,
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

// ─── Existing ────────────────────────────────────────────────────────────────

export const todos = sqliteTable("todos", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(unixepoch())`
  ),
});

// ─── Users ───────────────────────────────────────────────────────────────────

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  avatarUrl: text("avatar_url"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(unixepoch())`
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`(unixepoch())`
  ),
});

// ─── Accounts (auth providers) ───────────────────────────────────────────────
// One user can have many accounts (email, google, github, etc.)

export const accounts = sqliteTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // e.g. "email", "google", "github"
    provider: text("provider").notNull(),
    // For OAuth: the provider's user ID. For email: null
    providerAccountId: text("provider_account_id"),
    // Only used for email/password auth; store a bcrypt/argon2 hash
    passwordHash: text("password_hash"),
    createdAt: integer("created_at", { mode: "timestamp" }).default(
      sql`(unixepoch())`
    ),
  },
  (t) => [
    uniqueIndex("accounts_provider_account_id_idx").on(
      t.provider,
      t.providerAccountId
    ),
    index("accounts_user_id_idx").on(t.userId),
  ]
);

// ─── Sessions (lucia-auth compatible) ────────────────────────────────────────
// id  : the public session ID stored in the cookie
// secretHash : raw binary hash of the session secret (never sent to client)
// See: https://lucia-auth.com/sessions/basic

export const sessions = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  secretHash: blob("secret_hash").notNull(),
  createdAt: integer("created_at").notNull(),
});

// ─── Organizations ───────────────────────────────────────────────────────────

export const organizations = sqliteTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(unixepoch())`
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`(unixepoch())`
  ),
});

// ─── Roles ───────────────────────────────────────────────────────────────────
// Each org creates its own roles. "owner" is the only fixed/special role.

export const roles = sqliteTable(
  "roles",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    // If true, this role bypasses all permission checks (owner)
    isOwner: integer("is_owner", { mode: "boolean" }).notNull().default(false),
    createdAt: integer("created_at", { mode: "timestamp" }).default(
      sql`(unixepoch())`
    ),
  },
  (t) => [
    uniqueIndex("roles_org_name_idx").on(t.organizationId, t.name),
    index("roles_org_id_idx").on(t.organizationId),
  ]
);

// ─── Role Permissions ────────────────────────────────────────────────────────
// Maps a role to one of your hardcoded permission strings.
// e.g. { roleId: "...", permission: "task:create" }

export const rolePermissions = sqliteTable(
  "role_permissions",
  {
    roleId: text("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    // Matches a value from your hardcoded PERMISSIONS array in app code
    permission: text("permission").notNull(),
  },
  (t) => [primaryKey({ columns: [t.roleId, t.permission] })]
);

// ─── Organization Members ────────────────────────────────────────────────────

export const organizationMembers = sqliteTable(
  "organization_members",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    roleId: text("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "restrict" }),
    joinedAt: integer("joined_at", { mode: "timestamp" }).default(
      sql`(unixepoch())`
    ),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.organizationId] }),
    index("org_members_org_id_idx").on(t.organizationId),
  ]
);
