import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/sign-up")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_public/sign-up"!</div>;
}
