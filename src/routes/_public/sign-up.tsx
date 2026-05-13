import { createFileRoute } from "@tanstack/react-router";
import { SignUpPage } from "@/features/auth/ui/pages/sign-up-page";

export const Route = createFileRoute("/_public/sign-up")({
  component: SignUpPage,
});
