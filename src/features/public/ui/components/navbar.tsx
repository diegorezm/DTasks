import { Menu } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo variant="dark" className="size-18" />
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
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            Log in
          </Button>
          <Button size="sm">Get started</Button>
          <button type="button" className="sm:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
