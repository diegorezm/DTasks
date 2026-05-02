import type { DrizzleD1Database } from "drizzle-orm/d1";
import type * as schema from "@/db/schema";
import {
  getSessionById,
  insertSession,
  deleteSession,
} from "@/features/sessions/queries";

type DB = DrizzleD1Database<typeof schema>;

// ─── Constants ───────────────────────────────────────────────────────────

export const SESSION_COOKIE_NAME = "session_token";
const SESSION_EXPIRES_IN_SECONDS = 60 * 60 * 24; // 1 day

// ─── Types ───────────────────────────────────────────────────────────────

export interface Session {
  id: string;
  secretHash: Uint8Array;
  createdAt: Date;
}

export interface SessionWithToken extends Session {
  /** The full token to send to the client: "<id>.<secret>" */
  token: string;
}

// ─── Crypto helpers ─────────────────────────────────────────────────────

/**
 * Generates a cryptographically-secure random string with ~120 bits of entropy.
 * Uses a human-readable alphabet (a-z, 2-9 without l, o, 0, 1).
 */
function generateSecureRandomString(): string {
  const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  let result = "";
  for (let i = 0; i < bytes.length; i++) {
    result += alphabet[bytes[i] >> 3];
  }
  return result;
}

/**
 * Hashes a session secret with SHA-256.
 * SHA-256 is appropriate here because the secret already has 120 bits of entropy.
 */
async function hashSecret(secret: string): Promise<Uint8Array> {
  const secretBytes = new TextEncoder().encode(secret);
  const hashBuffer = await crypto.subtle.digest("SHA-256", secretBytes);
  return new Uint8Array(hashBuffer);
}

/**
 * Constant-time comparison to prevent timing attacks when comparing secret hashes.
 */
function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.byteLength !== b.byteLength) return false;
  let c = 0;
  for (let i = 0; i < a.byteLength; i++) {
    c |= a[i] ^ b[i];
  }
  return c === 0;
}

// ─── Session management ──────────────────────────────────────────────────

/**
 * Creates a new session, stores it in the DB, and returns the session + token.
 * The token ("<id>.<secret>") is what you set in the cookie.
 */
export async function createSession(
  db: DB
): Promise<SessionWithToken> {
  const now = new Date();
  const id = generateSecureRandomString();
  const secret = generateSecureRandomString();
  const secretHash = await hashSecret(secret);
  const token = `${id}.${secret}`;

  await insertSession(db, {
    id,
    secretHash,
    createdAt: Math.floor(now.getTime() / 1000),
  });

  return { id, secretHash, createdAt: now, token };
}

/**
 * Validates a session token from the cookie.
 * Returns the Session if valid and not expired, null otherwise.
 * Deletes the session from the DB if it has expired.
 */
export async function validateSessionToken(
  db: DB,
  token: string
): Promise<Session | null> {
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [sessionId, sessionSecret] = parts;

  const row = await getSessionById(db, sessionId);
  if (!row) return null;

  const createdAt = new Date(row.createdAt * 1000);
  const now = new Date();

  // Check expiration
  if (now.getTime() - createdAt.getTime() >= SESSION_EXPIRES_IN_SECONDS * 1000) {
    await deleteSession(db, sessionId);
    return null;
  }

  // Verify secret against stored hash
  const incomingHash = await hashSecret(sessionSecret);
  const storedHash =
    row.secretHash instanceof Uint8Array
      ? row.secretHash
      : new Uint8Array(row.secretHash as ArrayBuffer);

  if (!constantTimeEqual(incomingHash, storedHash)) return null;

  return { id: row.id, secretHash: storedHash, createdAt };
}

/**
 * Invalidates a session by deleting it from the DB.
 */
export async function invalidateSession(
  db: DB,
  sessionId: string
): Promise<void> {
  await deleteSession(db, sessionId);
}

// ─── Cookie helpers ─────────────────────────────────────────────────────

/**
 * Returns the Set-Cookie header value for a new session token.
 */
export function makeSessionCookie(token: string): string {
  return `${SESSION_COOKIE_NAME}=${token}; Max-Age=${SESSION_EXPIRES_IN_SECONDS}; HttpOnly; Secure; Path=/; SameSite=Lax`;
}

/**
 * Returns a Set-Cookie header that clears the session cookie.
 */
export function clearSessionCookie(): string {
  return `${SESSION_COOKIE_NAME}=; Max-Age=0; HttpOnly; Secure; Path=/; SameSite=Lax`;
}

/**
 * Encodes a session to JSON, deliberately omitting the secret hash.
 */
export function encodeSessionPublicJSON(session: Session): string {
  return JSON.stringify({
    id: session.id,
    created_at: Math.floor(session.createdAt.getTime() / 1000),
  });
}
