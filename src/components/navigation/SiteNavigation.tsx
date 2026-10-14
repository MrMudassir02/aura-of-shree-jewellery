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

  return (
    <header className="sticky top-0 z-50 border-b border-[#D4B77E]/30 bg-[#FFF9F0] text-[#3A1A1B] shadow-sm">
      <div className="mx-auto flex min-h-[76px] max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
        <Link
          href="/"
          onClick={closeMenu}
          aria-label="Aura of Shree Jewellery home"
          className="shrink-0 text-lg font-semibold tracking-[0.08em] sm:text-2xl"
        >
          AURA <span className="font-light">OF SHREE</span>
          <span className="mt-1 block text-center text-[8px] tracking-[0.42em] sm:text-[9px]">
            JEWELLERY
          </span>
        </Link>

        {!minimal && (
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 xl:flex"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-3 text-xs uppercase tracking-[0.12em] transition hover:text-[#A8752A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A8752A]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2 sm:gap-4">
          {isLoggedIn ? (
            <button
              type="button"
              onClick={() => void signOut({ callbackUrl: "/" })}
              className="hidden px-2 py-2 text-xs uppercase tracking-wider hover:text-[#A8752A] sm:block"
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/login"
              className="hidden px-2 py-2 text-xs uppercase tracking-wider hover:text-[#A8752A] sm:block"
            >
              Account
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
              className="inline-flex h-10 w-10 items-center justify-center border border-[#3A1A1B]/20 xl:hidden"
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

      <div className="border-t border-[#3A1A1B]/10">
        <nav
          aria-label="Jewellery categories"
          className="mx-auto flex max-w-[1440px] items-center gap-6 overflow-x-auto px-4 py-3 sm:justify-center sm:gap-8 sm:px-6 lg:gap-12"
        >
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="shrink-0 text-[10px] uppercase tracking-[0.12em] transition hover:text-[#A8752A] sm:text-xs sm:tracking-[0.16em]"
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
          className="border-t border-[#3A1A1B]/10 bg-[#FFF9F0] px-4 py-4 xl:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="border-b border-[#3A1A1B]/10 px-2 py-3 text-sm"
              >
                {link.label}
              </Link>
            ))}

            <p className="px-2 pb-2 pt-5 text-[10px] uppercase tracking-[0.2em] text-[#967344]">
              Shop by category
            </p>

            {categories.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                onClick={closeMenu}
                className="px-2 py-3 text-sm"
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
                className="px-2 py-3 text-left text-sm"
              >
                Sign out
              </button>
            ) : (
              <Link
                href="/login"
                onClick={closeMenu}
                className="px-2 py-3 text-sm"
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
