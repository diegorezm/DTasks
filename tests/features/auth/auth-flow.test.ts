import { describe, it, expect, beforeEach } from "vitest";
import { createTestDb, type TestDb } from "../../helpers/db";
import { USER_QUERIES } from "@/features/auth/queries/users.queries";
import { ACCOUNT_QUERIES } from "@/features/auth/queries/accounts.queries";
import {
  generateSecureRandomString,
  hashPassword,
  verifyPassword,
} from "@/lib/crypto";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeUserData() {
  return {
    id: generateSecureRandomString(),
    name: "Jane Smith",
    email: `jane-${generateSecureRandomString()}@example.com`,
  };
}

async function makeAccountData(userId: string, password = "supersecret123") {
  return {
    id: generateSecureRandomString(),
    userId,
    provider: "email" as const,
    providerAccountId: null,
    passwordHash: await hashPassword(password),
  };
}

// ── User queries ──────────────────────────────────────────────────────────────

describe("USER_QUERIES.create", () => {
  let db: TestDb;
  beforeEach(() => {
    db = createTestDb();
  });

  it("creates a user and returns it", async () => {
    const input = makeUserData();
    const { data, error } = await USER_QUERIES.create(db, input);

    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data!.id).toBe(input.id);
    expect(data!.email).toBe(input.email);
  });

  it("fails on duplicate email", async () => {
    const input = makeUserData();
    await USER_QUERIES.create(db, input);

    const { data, error } = await USER_QUERIES.create(db, {
      ...input,
      id: generateSecureRandomString(),
    });
    expect(data).toBeNull();
    expect(error).not.toBeNull();
  });
});

describe("USER_QUERIES.getByEmail", () => {
  let db: TestDb;
  beforeEach(() => {
    db = createTestDb();
  });

  it("returns the user for a known email", async () => {
    const input = makeUserData();
    await USER_QUERIES.create(db, input);

    const { data, error } = await USER_QUERIES.getByEmail(db, input.email);
    expect(error).toBeNull();
    expect(data!.id).toBe(input.id);
  });

  it("returns null for an unknown email", async () => {
    const { data, error } = await USER_QUERIES.getByEmail(
      db,
      "nobody@example.com",
    );
    expect(error).toBeNull();
    expect(data).toBeNull();
  });
});

describe("USER_QUERIES.getById", () => {
  let db: TestDb;
  beforeEach(() => {
    db = createTestDb();
  });

  it("returns the user for a known id", async () => {
    const input = makeUserData();
    await USER_QUERIES.create(db, input);

    const { data } = await USER_QUERIES.getById(db, input.id);
    expect(data!.email).toBe(input.email);
  });

  it("returns null for an unknown id", async () => {
    const { data } = await USER_QUERIES.getById(db, "doesnotexist");
    expect(data).toBeNull();
  });
});

// ── Account queries ───────────────────────────────────────────────────────────

describe("ACCOUNT_QUERIES.create", () => {
  let db: TestDb;
  beforeEach(() => {
    db = createTestDb();
  });

  it("creates an account linked to a user", async () => {
    const user = makeUserData();
    await USER_QUERIES.create(db, user);

    const accountData = await makeAccountData(user.id);
    const { data, error } = await ACCOUNT_QUERIES.create(db, accountData);

    expect(error).toBeNull();
    expect(data!.userId).toBe(user.id);
    expect(data!.provider).toBe("email");
  });
});

describe("ACCOUNT_QUERIES.getByProvider", () => {
  let db: TestDb;
  beforeEach(() => {
    db = createTestDb();
  });

  it("returns account for known provider + email", async () => {
    const user = makeUserData();
    await USER_QUERIES.create(db, user);

    const accountData = await makeAccountData(user.id);
    await ACCOUNT_QUERIES.create(db, {
      ...accountData,
      providerAccountId: user.email,
    });

    const { data, error } = await ACCOUNT_QUERIES.getByProvider(
      db,
      "email",
      user.email,
    );
    expect(error).toBeNull();
    expect(data!.userId).toBe(user.id);
  });

  it("returns null for unknown provider account", async () => {
    const { data } = await ACCOUNT_QUERIES.getByProvider(
      db,
      "email",
      "ghost@example.com",
    );
    expect(data).toBeNull();
  });
});

// ── Password hashing ──────────────────────────────────────────────────────────

describe("hashPassword / verifyPassword", () => {
  it("verifies a correct password", async () => {
    const hash = await hashPassword("mypassword123");
    expect(await verifyPassword("mypassword123", hash)).toBe(true);
  });

  it("rejects a wrong password", async () => {
    const hash = await hashPassword("mypassword123");
    expect(await verifyPassword("wrongpassword", hash)).toBe(false);
  });

  it("produces a different hash each time (salted)", async () => {
    const h1 = await hashPassword("samepassword");
    const h2 = await hashPassword("samepassword");
    expect(h1).not.toBe(h2);
  });
});
