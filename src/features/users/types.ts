import { createInsertSchema } from "drizzle-orm/zod";
import { z } from "zod";
import { users } from "@/db/schema";

export const userInsertSchema = createInsertSchema(users, {
	name: z.string().min(4).max(256),
	email: z.email(),
	avatarUrl: z.url().optional(),
});

export const userUpdateSchema = userInsertSchema.partial();

type UserUpdate = z.infer<typeof userUpdateSchema>;
