import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { useAppSession } from "@/features/auth/lib/app-session";
import {
  signInWithEmailSchema,
  signUpWithEmailSchema,
} from "@/features/auth/models/user.models";
import { ACCOUNT_QUERIES } from "@/features/auth/queries/accounts.queries";
import { USER_QUERIES } from "@/features/auth/queries/users.queries";
import {
  generateSecureRandomString,
  hashPassword,
  verifyPassword,
} from "@/lib/crypto";
import { createSessionService } from "./services/session.services";

const {
  create: createSession,
  invalidate: invalidateSession,
  validate: validateSessionTokenWithUser,
} = createSessionService(db);

export const signUpWithEmail = createServerFn()
  .inputValidator(signUpWithEmailSchema)
  .handler(async ({ data }) => {
    const appSession = await useAppSession();

    const { data: existingUser } = await USER_QUERIES.getByEmail(
      db,
      data.email,
    );
    if (existingUser) {
      return { data: null, error: "Email already in use." };
    }

    const { data: user, error: userError } = await USER_QUERIES.create(db, {
      id: generateSecureRandomString(),
      name: data.name,
      email: data.email,
    });
    if (userError) return { data: null, error: "Failed to create user." };

    const { error: accountError } = await ACCOUNT_QUERIES.create(db, {
      id: generateSecureRandomString(),
      userId: user.id,
      provider: "email",
      passwordHash: await hashPassword(data.password),
    });
    if (accountError) return { data: null, error: "Failed to create account." };

    const { data: session, error: sessionError } = await createSession(user.id);
    if (sessionError) return { data: null, error: "Failed to create session." };

    await appSession.update({ token: session.token });

    return { data: { user }, error: null };
  });

export const signInWithEmail = createServerFn()
  .inputValidator(signInWithEmailSchema)
  .handler(async ({ data }) => {
    const appSession = await useAppSession();

    const { data: account } = await ACCOUNT_QUERIES.getByProvider(
      db,
      "email",
      data.email,
    );
    if (!account || !account.passwordHash)
      return { data: null, error: "Invalid credentials." };

    const validPassword = await verifyPassword(
      data.password,
      account.passwordHash,
    );
    if (!validPassword) return { data: null, error: "Invalid credentials." };

    const { data: session, error } = await createSession(account.userId);
    if (error) return { data: null, error: "Failed to create session." };

    await appSession.update({ token: session.token });

    return { data: { userId: account.userId }, error: null };
  });

export const signOut = createServerFn().handler(async () => {
  const appSession = await useAppSession();
  const token = appSession.data?.token;

  if (token) {
    const [sessionId] = token.split(".");
    await invalidateSession(sessionId);
    await appSession.clear();
  }

  return { data: { success: true }, error: null };
});

export const getCurrentSession = createServerFn().handler(async () => {
  const appSession = await useAppSession();
  const token = appSession.data?.token;

  if (!token) return { data: null, error: null };

  const { data, error } = await validateSessionTokenWithUser(token);
  if (error) return { data: null, error: "Failed to validate session." };
  if (!data) return { data: null, error: null };

  return { data, error: null };
});
