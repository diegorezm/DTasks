import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "#/features/public/ui/pages/home-page";

export const Route = createFileRoute("/_public/")({ component: HomePage });
