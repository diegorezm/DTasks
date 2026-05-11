import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import { relations, schema } from "./schemas";

export const db = drizzle(env.DB, { schema, relations });

export type DB =
	| typeof db
	| Parameters<Parameters<typeof db.transaction>[0]>[0];
