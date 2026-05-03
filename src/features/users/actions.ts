import { db } from "@/db";
import { insertAccount, insertUser } from "@/features/users/queries";
import { userInsertSchema } from "@/features/users/types";
import { createServerFn } from "@tanstack/react-start";

export const createUserAccountAction = createServerFn()
	.inputValidator(userInsertSchema)
	.handler(({ data }) => {
		db.transaction(async (tx) => {
			const data = await insertUser(tx, data);
		});
	});
