import { env } from "cloudflare:workers";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import type { SQLiteTransaction } from "drizzle-orm/sqlite-core";
import * as schema from "./schema.ts";

export const db = drizzle(env.DB, { schema });
export type DB =
	| DrizzleD1Database<typeof schema>
	| SQLiteTransaction<
		"async",
		D1Result<unknown>,
		typeof schema,
		ExtractTablesWithRelations<typeof schema>
	>;
