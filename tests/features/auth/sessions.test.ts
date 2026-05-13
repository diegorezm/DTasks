// tests/features/auth/session.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { createTestDb, type TestDb } from "../../helpers/db";
import { createSessionService } from "@/features/auth/services/session.services";
import { SESSION_QUERIES } from "@/features/auth/queries/sessions.queries";
import { USER_QUERIES } from "@/features/auth/queries/users.queries";
import { generateSecureRandomString, hashSecret } from "@/lib/crypto";

// ── Helpers ───────────────────────────────────────────────────────────────────

async function seedUser(db: TestDb) {
  const { data: user } = await USER_QUERIES.create(db, {
    id: generateSecureRandomString(),
    name: "Test User",
    email: `test-${generateSecureRandomString()}@example.com`,
  });
  return user!;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("sessionService.create", () => {
  let db: TestDb;
  beforeEach(() => {
    db = createTestDb();
  });

  it("creates a session and returns a token", async () => {
    const { create } = createSessionService(db);
    const user = await seedUser(db);
    const { data, error } = await create(user.id);

    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data!.token).toMatch(/^[a-z2-9]+\.[a-z2-9]+$/);
    expect(data!.userId).toBe(user.id);
  });

  it("stores the session in the database", async () => {
    const { create } = createSessionService(db);
    const user = await seedUser(db);
    const { data: session } = await create(user.id);

    const { data: stored } = await SESSION_QUERIES.getById(db, session!.id);
    expect(stored).not.toBeNull();
    expect(stored!.userId).toBe(user.id);
  });
});

describe("sessionService.validate", () => {
  let db: TestDb;
  beforeEach(() => {
    db = createTestDb();
  });

  it("returns session for a valid token", async () => {
    const { create, validate } = createSessionService(db);
    const user = await seedUser(db);
    const { data: session } = await create(user.id);

    const { data, error } = await validate(session!.token);
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data!.id).toBe(session!.id);
  });

  it("returns null for a token with wrong format", async () => {
    const { validate } = createSessionService(db);
    const { data, error } = await validate("notavalidtoken");
    expect(error).toBeNull();
    expect(data).toBeNull();
  });

  it("returns null for a tampered secret", async () => {
    const { create, validate } = createSessionService(db);
    const user = await seedUser(db);
    const { data: session } = await create(user.id);
    const [id] = session!.token.split(".");

    const { data, error } = await validate(`${id}.tamperedsecret`);
    expect(error).toBeNull();
    expect(data).toBeNull();
  });

  it("deletes and returns null for an expired session", async () => {
    const { validate } = createSessionService(db);
    const user = await seedUser(db);

    const id = generateSecureRandomString();
    const secret = generateSecureRandomString();
    const secretHash = Buffer.from(await hashSecret(secret));
    const expiredAt = Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 31;

    await SESSION_QUERIES.create(db, {
      id,
      userId: user.id,
      secretHash,
      createdAt: expiredAt,
    });

    const { data, error } = await validate(`${id}.${secret}`);
    expect(error).toBeNull();
    expect(data).toBeNull();

    const { data: stored } = await SESSION_QUERIES.getById(db, id);
    expect(stored).toBeNull();
  });

  it("returns null for a non-existent session id", async () => {
    const { validate } = createSessionService(db);
    const { data, error } = await validate(
      `${generateSecureRandomString()}.somesecret`,
    );
    expect(error).toBeNull();
    expect(data).toBeNull();
  });
});

describe("sessionService.validateWithUser", () => {
  let db: TestDb;
  beforeEach(() => {
    db = createTestDb();
  });

  it("returns session and user for a valid token", async () => {
    const { create, validateWithUser } = createSessionService(db);
    const user = await seedUser(db);
    const { data: session } = await create(user.id);

    const { data, error } = await validateWithUser(session!.token);
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data!.users.id).toBe(user.id);
    expect(data!.session.id).toBe(session!.id);
  });
});

describe("sessionService.invalidate", () => {
  let db: TestDb;
  beforeEach(() => {
    db = createTestDb();
  });

  it("deletes the session", async () => {
    const { create, invalidate } = createSessionService(db);
    const user = await seedUser(db);
    const { data: session } = await create(user.id);

    await invalidate(session!.id);

    const { data: stored } = await SESSION_QUERIES.getById(db, session!.id);
    expect(stored).toBeNull();
  });
});

describe("sessionService.invalidateAll", () => {
  let db: TestDb;
  beforeEach(() => {
    db = createTestDb();
  });

  it("deletes all sessions for a user", async () => {
    const { create, invalidateAll } = createSessionService(db);
    const user = await seedUser(db);
    await create(user.id);
    await create(user.id);

    await invalidateAll(user.id);

    const { data: sessions } = await SESSION_QUERIES.getAllByUserId(
      db,
      user.id,
    );
    expect(sessions).toHaveLength(0);
  });
});
