import { and, eq } from "drizzle-orm";
import type { DB } from "@/db";
import {
	organizationMembers,
	organizations,
	rolePermissions,
	roles,
} from "@/db/schema";

// ─── Organizations ────────────────────────────────────────────────────────────

export async function getOrganizationById(db: DB, id: string) {
	return db.select().from(organizations).where(eq(organizations.id, id)).get();
}

export async function getOrganizationBySlug(db: DB, slug: string) {
	return db
		.select()
		.from(organizations)
		.where(eq(organizations.slug, slug))
		.get();
}

export async function listOrganizationsByUser(db: DB, userId: string) {
	return db
		.select({
			id: organizations.id,
			name: organizations.name,
			slug: organizations.slug,
			createdAt: organizations.createdAt,
		})
		.from(organizationMembers)
		.innerJoin(
			organizations,
			eq(organizationMembers.organizationId, organizations.id),
		)
		.where(eq(organizationMembers.userId, userId))
		.all();
}

export async function insertOrganization(
	db: DB,
	data: { id: string; name: string; slug: string },
) {
	return db.insert(organizations).values(data).returning().get();
}

export async function updateOrganization(
	db: DB,
	id: string,
	data: Partial<{ name: string; slug: string }>,
) {
	return db
		.update(organizations)
		.set(data)
		.where(eq(organizations.id, id))
		.returning()
		.get();
}

export async function deleteOrganization(db: DB, id: string) {
	return db.delete(organizations).where(eq(organizations.id, id)).run();
}

// ─── Members ─────────────────────────────────────────────────────────────────

export async function getMember(
	db: DB,
	userId: string,
	organizationId: string,
) {
	return db
		.select()
		.from(organizationMembers)
		.where(
			and(
				eq(organizationMembers.userId, userId),
				eq(organizationMembers.organizationId, organizationId),
			),
		)
		.get();
}

export async function listMembers(db: DB, organizationId: string) {
	return db
		.select()
		.from(organizationMembers)
		.where(eq(organizationMembers.organizationId, organizationId))
		.all();
}

export async function insertMember(
	db: DB,
	data: { userId: string; organizationId: string; roleId: string },
) {
	return db.insert(organizationMembers).values(data).returning().get();
}

export async function updateMemberRole(
	db: DB,
	userId: string,
	organizationId: string,
	roleId: string,
) {
	return db
		.update(organizationMembers)
		.set({ roleId })
		.where(
			and(
				eq(organizationMembers.userId, userId),
				eq(organizationMembers.organizationId, organizationId),
			),
		)
		.returning()
		.get();
}

export async function deleteMember(
	db: DB,
	userId: string,
	organizationId: string,
) {
	return db
		.delete(organizationMembers)
		.where(
			and(
				eq(organizationMembers.userId, userId),
				eq(organizationMembers.organizationId, organizationId),
			),
		)
		.run();
}

// ─── Roles ────────────────────────────────────────────────────────────────────

export async function getRoleById(db: DB, id: string) {
	return db.select().from(roles).where(eq(roles.id, id)).get();
}

export async function listRolesByOrganization(db: DB, organizationId: string) {
	return db
		.select()
		.from(roles)
		.where(eq(roles.organizationId, organizationId))
		.all();
}

export async function insertRole(
	db: DB,
	data: {
		id: string;
		organizationId: string;
		name: string;
		isOwner?: boolean;
	},
) {
	return db.insert(roles).values(data).returning().get();
}

export async function deleteRole(db: DB, id: string) {
	return db.delete(roles).where(eq(roles.id, id)).run();
}

// ─── Role Permissions ─────────────────────────────────────────────────────────

export async function listPermissionsByRole(db: DB, roleId: string) {
	return db
		.select()
		.from(rolePermissions)
		.where(eq(rolePermissions.roleId, roleId))
		.all();
}

export async function insertRolePermission(
	db: DB,
	data: { roleId: string; permission: string },
) {
	return db.insert(rolePermissions).values(data).returning().get();
}

export async function deleteRolePermission(
	db: DB,
	roleId: string,
	permission: string,
) {
	return db
		.delete(rolePermissions)
		.where(
			and(
				eq(rolePermissions.roleId, roleId),
				eq(rolePermissions.permission, permission),
			),
		)
		.run();
}

// Replaces all permissions for a role in one go
export async function setRolePermissions(
	db: DB,
	roleId: string,
	permissions: string[],
) {
	await db
		.delete(rolePermissions)
		.where(eq(rolePermissions.roleId, roleId))
		.run();

	if (permissions.length === 0) return [];

	return db
		.insert(rolePermissions)
		.values(permissions.map((permission) => ({ roleId, permission })))
		.returning()
		.all();
}
