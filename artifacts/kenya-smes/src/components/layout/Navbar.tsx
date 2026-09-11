import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/programs", label: "Programmes" },
    { href: "/partners", label: "Partners" },
    { href: "/marketplace", label: "Market" },
    { href: "/membership", label: "Membership" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-black text-base leading-none">
                BN
              </div>
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="font-black text-base tracking-tight text-foreground">BNAK</span>
                <span className="text-[10px] text-muted-foreground font-medium tracking-wide leading-none">Biashara Ndogo Association of Kenya</span>
              </div>
              <span className="font-black text-base tracking-tight text-foreground sm:hidden">BNAK</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location === link.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Button asChild variant="outline" size="sm" className="font-semibold border-primary text-primary hover:bg-primary hover:text-white">
                <Link href="/coordinators">Be a Coordinator</Link>
              </Button>
              <Button asChild variant="default" className="font-semibold shadow-sm">
                <Link href="/membership">Join BNAK</Link>
              </Button>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block text-base font-medium py-2 ${
                  location === link.href ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t space-y-2">
              <Button asChild variant="outline" className="w-full justify-center border-primary text-primary">
                <Link href="/coordinators" onClick={() => setIsMobileMenuOpen(false)}>
                  Be a Coordinator
                </Link>
              </Button>
              <Button asChild variant="default" className="w-full justify-center">
                <Link href="/membership" onClick={() => setIsMobileMenuOpen(false)}>
                  Join BNAK
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
