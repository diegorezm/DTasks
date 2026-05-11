import { eq } from "drizzle-orm";
import type { DB } from "@/db";
import { schema } from "@/db/schemas";
import type { NewUser } from "@/features/auth/models/user.models";
import { tryCatch } from "@/lib/try-catch";

export const USER_QUERIES = {
	create: async (db: DB, data: NewUser) => {
		const { data: rows, error } = await tryCatch(
			db.insert(schema.users).values(data).returning(),
		);
		if (error) return { data: null, error };
		return { data: rows[0] ?? null, error: null };
	},

	getById: async (db: DB, id: string) => {
		const { data: rows, error } = await tryCatch(
			db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1),
		);
		if (error) return { data: null, error };
		return { data: rows[0] ?? null, error: null };
	},

	getByEmail: async (db: DB, email: string) => {
		const { data: rows, error } = await tryCatch(
			db
				.select()
				.from(schema.users)
				.where(eq(schema.users.email, email))
				.limit(1),
		);
		if (error) return { data: null, error };
		return { data: rows[0] ?? null, error: null };
	},

	getByIdWithAccount: async (db: DB, id: string) => {
		const { data: rows, error } = await tryCatch(
			db
				.select()
				.from(schema.users)
				.where(eq(schema.users.id, id))
				.leftJoin(schema.accounts, eq(schema.accounts.userId, schema.users.id))
				.limit(1),
		);
		if (error) return { data: null, error };
		return { data: rows[0] ?? null, error: null };
	},

	update: async (db: DB, id: string, data: Partial<NewUser>) => {
		const { data: rows, error } = await tryCatch(
			db
				.update(schema.users)
				.set({ ...data, updatedAt: new Date() })
				.where(eq(schema.users.id, id))
				.returning(),
		);
		if (error) return { data: null, error };
		return { data: rows[0] ?? null, error: null };
	},

	delete: async (db: DB, id: string) => {
		return tryCatch(db.delete(schema.users).where(eq(schema.users.id, id)));
	},
};
