import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "@/features/public/ui/components/navbar";

export const Route = createFileRoute("/_public")({
  component: Public,
});

function Public() {
  return (
    <div className="dot-grid min-h-screen bg-background text-foreground">
      <Navbar />
      <Outlet />
      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <span className="font-semibold text-foreground">DTasks</span>
          <span>© {new Date().getFullYear()} DTasks. All rights reserved.</span>
          <div className="flex gap-5">
            {["Privacy", "Terms", "Twitter"].map((link) => (
              <a
                key={link}
                href="/"
                className="hover:text-foreground transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
