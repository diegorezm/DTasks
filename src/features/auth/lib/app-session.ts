import { useSession } from "@tanstack/react-start/server";
import type { User } from "@/features/auth/models/user.models";

type AppSessionData = {
	token?: string;
	user?: User;
};

export function useAppSession() {
	return useSession<AppSessionData>({
		name: "dtasks-session",
		// TODO: use cloudflare env
		password: process.env.SESSION_SECRET!,
		cookie: {
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			httpOnly: true,
		},
	});
}
