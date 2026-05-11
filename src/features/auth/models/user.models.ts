import { createInsertSchema, createSelectSchema } from "drizzle-orm/zod";
import { z } from "zod";
import { accounts, users } from "@/db/schemas/auth";

export const userSelectSchema = createSelectSchema(users);
export const userInsertSchema = createInsertSchema(users, {
	email: z.email(),
	name: (s) => s.min(1).max(100),
	avatarUrl: z.url().optional(),
});

export type User = z.infer<typeof userSelectSchema>;
export type NewUser = z.infer<typeof userInsertSchema>;

export const accountSelectSchema = createSelectSchema(accounts);
export const accountInsertSchema = createInsertSchema(accounts, {
	provider: (s) => s.regex(/^(email|google|github)$/),
	passwordHash: (s) => s.nullable(),
});

export type Account = z.infer<typeof accountSelectSchema>;
export type NewAccount = z.infer<typeof accountInsertSchema>;

export const signUpWithEmailSchema = z.object({
	name: z.string().min(1).max(100),
	email: z.email(),
	password: z.string().min(8).max(100),
});

export const signInWithEmailSchema = signUpWithEmailSchema.omit({ name: true });

export type SignUpWithEmailDTO = z.infer<typeof signUpWithEmailSchema>;
export type SignInWithEmailDTO = Omit<SignUpWithEmailDTO, "name">;
