import { and, eq } from "drizzle-orm";
import type { DB } from "@/db";
import { schema } from "@/db/schemas";
import type { NewAccount } from "@/features/auth/models/user.models";
import { tryCatch } from "@/lib/try-catch";

export const ACCOUNT_QUERIES = {
	create: async (db: DB, data: NewAccount) => {
		const { data: rows, error } = await tryCatch(
			db.insert(schema.accounts).values(data).returning(),
		);
		if (error) return { data: null, error };
		return { data: rows[0] ?? null, error: null };
	},

	getByProvider: async (
		db: DB,
		provider: string,
		providerAccountId: string,
	) => {
		const { data: rows, error } = await tryCatch(
			db
				.select()
				.from(schema.accounts)
				.where(
					and(
						eq(schema.accounts.provider, provider),
						eq(schema.accounts.providerAccountId, providerAccountId),
					),
				)
				.limit(1),
		);
		if (error) return { data: null, error };
		return { data: rows[0] ?? null, error: null };
	},

	getByUserId: async (db: DB, userId: string) => {
		return tryCatch(
			db
				.select()
				.from(schema.accounts)
				.where(eq(schema.accounts.userId, userId)),
		);
	},

	deleteByProvider: async (db: DB, userId: string, provider: string) => {
		return tryCatch(
			db
				.delete(schema.accounts)
				.where(
					and(
						eq(schema.accounts.userId, userId),
						eq(schema.accounts.provider, provider),
					),
				),
		);
	},
};
