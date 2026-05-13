import { SignInPage } from "@/features/auth/ui/pages/sign-in-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/sign-in")({
	component: SignInPage,
});
