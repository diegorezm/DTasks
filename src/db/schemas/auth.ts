import { defineRelations, sql } from "drizzle-orm";
import {
	blob,
	index,
	integer,
	primaryKey,
	sqliteTable,
	text,
	uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	avatarUrl: text("avatar_url"),
	createdAt: integer("created_at", { mode: "timestamp" }).default(
		sql`(unixepoch())`,
	),
	updatedAt: integer("updated_at", { mode: "timestamp" }).default(
		sql`(unixepoch())`,
	),
});

export const accounts = sqliteTable(
	"accounts",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		provider: text("provider").notNull(),
		providerAccountId: text("provider_account_id"),
		passwordHash: text("password_hash"),
		createdAt: integer("created_at", { mode: "timestamp" }).default(
			sql`(unixepoch())`,
		),
	},
	(t) => [
		uniqueIndex("accounts_provider_account_id_idx").on(
			t.provider,
			t.providerAccountId,
		),
		index("accounts_user_id_idx").on(t.userId),
	],
);

export const sessions = sqliteTable("session", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	secretHash: blob("secret_hash", { mode: "buffer" }).notNull(),
	createdAt: integer("created_at").notNull(),
});

export const organizations = sqliteTable("organizations", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	slug: text("slug").notNull().unique(),
	createdAt: integer("created_at", { mode: "timestamp" }).default(
		sql`(unixepoch())`,
	),
	updatedAt: integer("updated_at", { mode: "timestamp" }).default(
		sql`(unixepoch())`,
	),
});

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
			sql`(unixepoch())`,
		),
	},
	(t) => [
		primaryKey({ columns: [t.userId, t.organizationId] }),
		index("org_members_org_id_idx").on(t.organizationId),
	],
);

export const roles = sqliteTable(
	"roles",
	{
		id: text("id").primaryKey(),
		organizationId: text("organization_id")
			.notNull()
			.references(() => organizations.id, { onDelete: "cascade" }),
		name: text("name").notNull(),
		isOwner: integer("is_owner", { mode: "boolean" }).notNull().default(false),
		createdAt: integer("created_at", { mode: "timestamp" }).default(
			sql`(unixepoch())`,
		),
	},
	(t) => [
		uniqueIndex("roles_org_name_idx").on(t.organizationId, t.name),
		index("roles_org_id_idx").on(t.organizationId),
	],
);

export const rolePermissions = sqliteTable(
	"role_permissions",
	{
		roleId: text("role_id")
			.notNull()
			.references(() => roles.id, { onDelete: "cascade" }),
		permission: text("permission").notNull(),
	},
	(t) => [primaryKey({ columns: [t.roleId, t.permission] })],
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const relations = defineRelations(
	{
		users,
		accounts,
		sessions,
		organizations,
		organizationMembers,
		roles,
		rolePermissions,
	},
	(r) => ({
		users: {
			accounts: r.many.accounts(),
			sessions: r.many.sessions(),
			organizationMembers: r.many.organizationMembers(),
		},
		accounts: {
			user: r.one.users({
				from: r.accounts.userId,
				to: r.users.id,
			}),
		},
		sessions: {
			user: r.one.users({
				from: r.sessions.userId,
				to: r.users.id,
			}),
		},
		organizations: {
			members: r.many.organizationMembers(),
			roles: r.many.roles(),
		},
		organizationMembers: {
			user: r.one.users({
				from: r.organizationMembers.userId,
				to: r.users.id,
			}),
			organization: r.one.organizations({
				from: r.organizationMembers.organizationId,
				to: r.organizations.id,
			}),
			role: r.one.roles({
				from: r.organizationMembers.roleId,
				to: r.roles.id,
			}),
		},
		roles: {
			organization: r.one.organizations({
				from: r.roles.organizationId,
				to: r.organizations.id,
			}),
			permissions: r.many.rolePermissions(),
			members: r.many.organizationMembers(),
		},
		rolePermissions: {
			role: r.one.roles({
				from: r.rolePermissions.roleId,
				to: r.roles.id,
			}),
		},
	}),
);

export const tables = {
	users,
	accounts,
	sessions,
	organizations,
	organizationMembers,
	roles,
	rolePermissions,
};
