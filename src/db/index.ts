import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import type { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";
import { relations, schema } from "./schemas";

export const db = drizzle(env.DB, { schema, relations });
export type DB = BaseSQLiteDatabase<"async" | "sync", any, typeof schema>;