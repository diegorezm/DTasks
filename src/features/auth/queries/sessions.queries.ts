import { eq } from "drizzle-orm";
import type { DB } from "@/db";
import { schema } from "@/db/schemas";
import type { NewSession } from "@/features/auth/models/session.models";
import { tryCatch } from "@/lib/try-catch";

export const SESSION_QUERIES = {
	create: async (db: DB, data: NewSession) => {
		const { data: rows, error } = await tryCatch(
			db.insert(schema.sessions).values(data).returning(),
		);
		if (error) return { data: null, error };
		return { data: rows[0] ?? null, error: null };
	},

	getById: async (db: DB, id: string) => {
		const { data: rows, error } = await tryCatch(
			db
				.select()
				.from(schema.sessions)
				.where(eq(schema.sessions.id, id))
				.limit(1),
		);
		if (error) return { data: null, error };
		return { data: rows[0] ?? null, error: null };
	},

	getByIdWithUser: async (db: DB, id: string) => {
		const { data: rows, error } = await tryCatch(
			db
				.select()
				.from(schema.sessions)
				.where(eq(schema.sessions.id, id))
				.innerJoin(schema.users, eq(schema.users.id, schema.sessions.userId))
				.limit(1),
		);
		if (error) return { data: null, error };
		return { data: rows[0] ?? null, error: null };
	},

	deleteById: async (db: DB, id: string) => {
		return tryCatch(
			db.delete(schema.sessions).where(eq(schema.sessions.id, id)),
		);
	},

	deleteByUserId: async (db: DB, userId: string) => {
		return tryCatch(
			db.delete(schema.sessions).where(eq(schema.sessions.userId, userId)),
		);
	},
};
