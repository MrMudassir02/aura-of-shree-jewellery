"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";
import CartBagLink from "@/components/cart/CartBagLink";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop All" },
  { href: "/categories", label: "Collections" },
  { href: "/about", label: "Our Story" },
];

const categories = [
  { href: "/categories/earrings", label: "Earrings" },
  { href: "/categories/rings", label: "Rings" },
  { href: "/categories/pendants", label: "Pendants" },
  { href: "/categories/bracelets", label: "Bracelets" },
  { href: "/categories/chains", label: "Chains" },
];

type SiteNavigationProps = {
  isLoggedIn: boolean;
  variant?: "default" | "minimal";
};

export default function SiteNavigation({
  isLoggedIn,
  variant = "default",
}: SiteNavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const minimal = variant === "minimal";

  const closeMenu = () => setMenuOpen(false);

  const navLinkClass =
    "rounded-sm px-4 py-3 text-sm normal-case tracking-normal text-[#F5EBDD] transition-colors duration-200 hover:bg-[#F5EBDD] hover:text-[#3A1A1B] focus-visible:bg-[#F5EBDD] focus-visible:text-[#3A1A1B] focus-visible:outline-none";

  const categoryLinkClass =
    "shrink-0 rounded-sm px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-[#F5EBDD] transition-colors duration-200 hover:bg-[#F5EBDD] hover:text-[#3A1A1B] focus-visible:bg-[#F5EBDD] focus-visible:text-[#3A1A1B] focus-visible:outline-none sm:text-xs";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#3A1A1B] text-[#F5EBDD] shadow-sm">
      <div className="mx-auto flex min-h-[80px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <Link
          href="/"
          onClick={closeMenu}
          aria-label="Aura of Shree Jewellery home"
          className="shrink-0 text-lg font-semibold tracking-[0.08em] text-[#F5EBDD] sm:text-2xl"
        >
          AURA <span className="font-light">OF SHREE</span>
          <span className="mt-1 block text-center text-[8px] tracking-[0.42em] sm:text-[9px]">
            JEWELLERY
          </span>
        </Link>

        {!minimal && (
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 lg:flex"
          >
            {links.map((link) => (
              <Link key={link.href} href={link.href} className={navLinkClass}>
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex shrink-0 items-center gap-3 sm:gap-5">
          {isLoggedIn ? (
            <button
              type="button"
              onClick={() => void signOut({ callbackUrl: "/" })}
              className="hidden rounded-sm border border-[#D4B77E]/60 px-4 py-2 text-sm transition-colors duration-200 hover:bg-[#F5EBDD] hover:text-[#3A1A1B] sm:inline"
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-sm border border-[#D4B77E]/60 px-4 py-2 text-sm transition-colors duration-200 hover:bg-[#F5EBDD] hover:text-[#3A1A1B] sm:inline"
            >
              Sign in
            </Link>
          )}

          <CartBagLink />

          {!minimal && (
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-[#D4B77E]/50 transition-colors hover:bg-[#F5EBDD] hover:text-[#3A1A1B] lg:hidden"
            >
              {menuOpen ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M3 7h18M3 12h18M3 17h18" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <nav
          aria-label="Jewellery categories"
          className="mx-auto flex max-w-[1440px] items-center gap-3 overflow-x-auto px-4 py-2 sm:justify-center sm:gap-5 sm:px-6 lg:gap-8"
        >
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className={categoryLinkClass}
            >
              {category.label}
            </Link>
          ))}
        </nav>
      </div>

      {!minimal && menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="border-t border-white/10 bg-[#3A1A1B] px-4 py-4 lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="rounded-sm border-b border-white/10 px-4 py-3 text-sm transition-colors hover:bg-[#F5EBDD] hover:text-[#3A1A1B]"
              >
                {link.label}
              </Link>
            ))}

            <p className="px-4 pb-2 pt-5 text-[10px] uppercase tracking-[0.2em] text-[#D4B77E]">
              Shop by category
            </p>

            {categories.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                onClick={closeMenu}
                className="rounded-sm px-4 py-3 text-sm transition-colors hover:bg-[#F5EBDD] hover:text-[#3A1A1B]"
              >
                {category.label}
              </Link>
            ))}

            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  void signOut({ callbackUrl: "/" });
                }}
                className="px-4 py-3 text-left text-sm hover:text-[#D4B77E]"
              >
                Sign out
              </button>
            ) : (
              <Link
                href="/login"
                onClick={closeMenu}
                className="px-4 py-3 text-sm hover:text-[#D4B77E]"
              >
                Sign in / Create account
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
