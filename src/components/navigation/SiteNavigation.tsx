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

export default function SiteNavigation({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#3A1A1B] text-[#F5EBDD] shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-10">
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="shrink-0 text-lg font-semibold tracking-[0.1em] text-[#F5EBDD] transition hover:text-white sm:text-2xl"
        >
          AURA <span className="font-light">OF SHREE</span>
          <span className="mt-1 block text-center text-[8px] tracking-[0.42em]">
            JEWELLERY
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-sm px-4 py-3 text-sm transition-colors duration-200 hover:bg-[#F5EBDD] hover:text-[#3A1A1B] focus-visible:bg-[#F5EBDD] focus-visible:text-[#3A1A1B] focus-visible:outline-none"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-5">
          {isLoggedIn ? (
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="hidden rounded-sm px-3 py-2 text-sm transition hover:bg-[#F5EBDD] hover:text-[#3A1A1B] sm:inline-flex"
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-sm border border-[#D4B77E]/60 px-4 py-2 text-sm transition hover:bg-[#F5EBDD] hover:text-[#3A1A1B] sm:inline-flex"
            >
              Sign in
            </Link>
          )}

          <CartBagLink />

          <button
            type="button"
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-[#D4B77E]/50 transition hover:bg-[#F5EBDD] hover:text-[#3A1A1B] lg:hidden"
          >
            {menuOpen ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path d="M3 7h18M3 12h18M3 17h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-navigation"
          className="border-t border-[#D4B77E]/20 px-4 pb-5 pt-3 lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-sm px-4 py-3 text-sm transition-colors hover:bg-[#F5EBDD] hover:text-[#3A1A1B]"
              >
                {link.label}
              </Link>
            ))}

            <div className="my-2 border-t border-[#D4B77E]/20" />

            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  void signOut({ callbackUrl: "/" });
                }}
                className="rounded-sm px-4 py-3 text-left text-sm transition hover:bg-[#F5EBDD] hover:text-[#3A1A1B]"
              >
                Sign out
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-sm px-4 py-3 text-sm transition hover:bg-[#F5EBDD] hover:text-[#3A1A1B]"
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
