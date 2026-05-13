import type { DB } from "@/db";
import type { NewSession } from "@/features/auth/models/session.models";
import { SESSION_QUERIES } from "@/features/auth/queries/sessions.queries";
import {
  constantTimeEqual,
  generateSecureRandomString,
  hashSecret,
} from "@/lib/crypto";

const SESSION_EXPIRES_IN_SECONDS = 60 * 60 * 24 * 7;

export function createSessionService(db: DB) {
  return {
    async create(userId: string) {
      const id = generateSecureRandomString();
      const secret = generateSecureRandomString();
      const secretHash = Buffer.from(await hashSecret(secret));
      const token = `${id}.${secret}`;
      const session: NewSession = {
        id,
        userId,
        secretHash,
        createdAt: Math.floor(Date.now() / 1000),
      };
      const { data, error } = await SESSION_QUERIES.create(db, session);
      if (error) return { data: null, error };
      return { data: { ...data, token }, error: null };
    },

    async validate(token: string) {
      const tokenParts = token.split(".");
      if (tokenParts.length !== 2) return { data: null, error: null };
      const [sessionId, sessionSecret] = tokenParts;
      const { data: session, error } = await SESSION_QUERIES.getById(
        db,
        sessionId,
      );
      if (error) return { data: null, error };
      if (!session) return { data: null, error: null };
      const now = Math.floor(Date.now() / 1000);
      if (now - session.createdAt >= SESSION_EXPIRES_IN_SECONDS) {
        await SESSION_QUERIES.deleteById(db, sessionId);
        return { data: null, error: null };
      }
      const tokenSecretHash = await hashSecret(sessionSecret);
      if (!constantTimeEqual(tokenSecretHash, session.secretHash))
        return { data: null, error: null };
      return { data: session, error: null };
    },

    async validateWithUser(token: string) {
      const tokenParts = token.split(".");
      if (tokenParts.length !== 2) return { data: null, error: null };
      const [sessionId, sessionSecret] = tokenParts;
      const { data: row, error } = await SESSION_QUERIES.getByIdWithUser(
        db,
        sessionId,
      );
      if (error) return { data: null, error };
      if (!row) return { data: null, error: null };
      const now = Math.floor(Date.now() / 1000);
      if (now - row.session.createdAt >= SESSION_EXPIRES_IN_SECONDS) {
        await SESSION_QUERIES.deleteById(db, sessionId);
        return { data: null, error: null };
      }
      const tokenSecretHash = await hashSecret(sessionSecret);
      if (!constantTimeEqual(tokenSecretHash, row.session.secretHash))
        return { data: null, error: null };
      return { data: row, error: null };
    },

    async invalidate(sessionId: string) {
      return SESSION_QUERIES.deleteById(db, sessionId);
    },

    async invalidateAll(userId: string) {
      return SESSION_QUERIES.deleteByUserId(db, userId);
    },
  };
}
