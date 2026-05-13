import { relations, schema } from "@/db/schemas";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

export function createTestDb() {
  const sqlite = new Database(":memory:");
  const db = drizzle({ schema, relations, client: sqlite });
  migrate(db, { migrationsFolder: "./drizzle" });
  return db;
}

export type TestDb = ReturnType<typeof createTestDb>;
