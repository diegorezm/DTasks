import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/">
          <Logo variant="dark" className="size-18" />
        </Link>
        <nav className="hidden gap-6 sm:flex">
          {["Features", "Pricing", "Docs"].map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`}>
              <Button size="sm" variant="ghost">
                {link}
              </Button>
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/sign-in">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              Sign in
            </Button>
          </Link>
          <Link to="/sign-up">
            <Button size="sm">Get started</Button>
          </Link>
          <button type="button" className="sm:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
