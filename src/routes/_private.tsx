import { getCurrentSession } from "@/features/auth/actions";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_private")({
	beforeLoad: async ({ location }) => {
		const { data, error } = await getCurrentSession();
		if (error || !data) {
			throw redirect({
				to: "/sign-in",
				search: { redirected: location },
			});
		}
		return { session: data };
	},
	component: () => <Outlet />,
});
