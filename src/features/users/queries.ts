import type { DrizzleD1Database } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import type * as schema from "~/db/schema";
import { users, accounts } from "~/db/schema";

type DB = DrizzleD1Database<typeof schema>;

export async function getUserById(db: DB, id: string) {
  return db.select().from(users).where(eq(users.id, id)).get();
}

export async function getUserByEmail(db: DB, email: string) {
  return db.select().from(users).where(eq(users.email, email)).get();
}

export async function insertUser(
  db: DB,
  data: { id: string; name: string; email: string; avatarUrl?: string }
) {
  return db.insert(users).values(data).returning().get();
}

export async function updateUser(
  db: DB,
  id: string,
  data: Partial<{ name: string; avatarUrl: string }>
) {
  return db.update(users).set(data).where(eq(users.id, id)).returning().get();
}

export async function deleteUser(db: DB, id: string) {
  return db.delete(users).where(eq(users.id, id)).run();
}

// ─── Accounts ────────────────────────────────────────────────────────────────

export async function getAccountByProvider(
  db: DB,
  provider: string,
  providerAccountId: string
) {
  return db
    .select()
    .from(accounts)
    .where(
      eq(accounts.provider, provider) &&
        eq(accounts.providerAccountId, providerAccountId)
    )
    .get();
}

export async function getAccountsByUserId(db: DB, userId: string) {
  return db.select().from(accounts).where(eq(accounts.userId, userId)).all();
}

export async function insertAccount(
  db: DB,
  data: {
    id: string;
    userId: string;
    provider: string;
    providerAccountId?: string;
    passwordHash?: string;
  }
) {
  return db.insert(accounts).values(data).returning().get();
}

export async function deleteAccount(db: DB, id: string) {
  return db.delete(accounts).where(eq(accounts.id, id)).run();
}
