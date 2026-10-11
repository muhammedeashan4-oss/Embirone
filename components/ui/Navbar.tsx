"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

const links = [
  { label: "Home", href: "/" },
  { label: "Meet the Team", href: "/team" },
  { label: "Admin", href: "/admin" },
  { label: "Register", href: "/register" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const linkClass = (href: string) => {
    const isActive = pathname === href;

    return `text-sm transition-colors duration-200 ${
      isActive
        ? "text-violet-300"
        : "text-white/60 hover:text-violet-200"
    }`;
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-[#080812]/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="text-sm font-semibold tracking-[0.24em] text-white transition hover:text-violet-200"
          onClick={() => setMenuOpen(false)}
        >
          EMBRIONE<span className="text-violet-300">.</span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={
                pathname === link.href ? "page" : undefined
              }
              className={linkClass(link.href)}
            >
              {link.label}
            </Link>
          ))}

          <Link href="/register" className="primary-button">
            Join the team <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white transition hover:border-violet-300/40 hover:text-violet-200 md:hidden"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile navigation */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-[#080812] px-5 py-5 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={
                  pathname === link.href ? "page" : undefined
                }
                onClick={() => setMenuOpen(false)}
                className={linkClass(link.href)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}