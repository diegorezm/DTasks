import { env } from "cloudflare:workers";
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import * as schema from "./schema.ts";

export const db = drizzle(env.DB, { schema });
export type DB = DrizzleD1Database<typeof schema>;
