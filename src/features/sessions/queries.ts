import type { DrizzleD1Database } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import type * as schema from "~/db/schema";
import { sessions } from "~/db/schema";

type DB = DrizzleD1Database<typeof schema>;

export async function getSessionById(db: DB, id: string) {
  return db.select().from(sessions).where(eq(sessions.id, id)).get();
}

export async function insertSession(
  db: DB,
  data: {
    id: string;
    secretHash: ArrayBuffer | Uint8Array;
    createdAt: number; // unix seconds
  }
) {
  return db.insert(sessions).values(data).returning().get();
}

export async function deleteSession(db: DB, id: string) {
  return db.delete(sessions).where(eq(sessions.id, id)).run();
}

// Delete all sessions for a user — call on sign-out-all or account deletion
export async function deleteSessionsByUserId(db: DB, userId: string) {
  // sessions table doesn't store userId directly (lucia pattern);
  // this is a no-op placeholder — handle via cascade on users delete
  // or extend the sessions table with a userId column if needed.
  return;
}
