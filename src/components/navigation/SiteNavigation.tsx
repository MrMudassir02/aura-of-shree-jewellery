"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import CartBagLink from "@/components/cart/CartBagLink";
import WishlistLink from "@/components/navigation/WishlistLink";

const navigationCategories = [
  { href: "/categories/rings", label: "RINGS" },
  { href: "/categories/necklaces", label: "NECKLACES" },
  { href: "/categories/earrings", label: "EARRINGS" },
  { href: "/categories/bracelets", label: "BRACELETS" },
  { href: "/categories/pendants", label: "PENDANTS" },
  { href: "/categories/gold-coins", label: "GOLD COINS" },
  { href: "/categories", label: "COLLECTIONS" },
  { href: "/products?filter=new", label: "NEW ARRIVALS" },
  { href: "/products?filter=bestseller", label: "BESTSELLERS" },
];

const categorySearchOptions = [
  { label: "All Categories", value: "" },
  { label: "Rings", value: "rings" },
  { label: "Necklaces", value: "necklaces" },
  { label: "Earrings", value: "earrings" },
  { label: "Bracelets", value: "bracelets" },
  { label: "Pendants", value: "pendants" },
  { label: "Gold Coins", value: "gold-coins" },
];

type UserInfo = {
  name?: string | null;
  email?: string | null;
  role?: string | null;
};

type SiteNavigationProps = {
  isLoggedIn?: boolean;
  user?: UserInfo | null;
  variant?: "default" | "minimal";
};

function getUserInitials(name?: string | null, email?: string | null): string {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (email && email.trim()) {
    return email.slice(0, 2).toUpperCase();
  }
  return "MR";
}

export default function SiteNavigation({
  isLoggedIn = false,
  user = null,
}: SiteNavigationProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  const initials = getUserInitials(user?.name, user?.email);
  const displayName = user?.name ? user.name.split(" ")[0] : initials;

  // Close account dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = searchQuery.trim();
    const params = new URLSearchParams();
    if (query) params.set("search", query);
    if (selectedCategory) params.set("category", selectedCategory);

    const queryString = params.toString();
    router.push(queryString ? `/products?${queryString}` : "/products");
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-xs">
      {/* Top tier: Logo | Search with Category Dropdown | User Account, Wishlist, Cart */}
      <div className="border-b border-[#E8DFD5] bg-[#FFFFFF]">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-3 px-4 sm:gap-6 sm:px-6 lg:px-8">
          
          {/* Left: Brand / Logo */}
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-3"
            aria-label="Aura of Shree Jewellery home"
          >
            {/* Elegant Circular Emblem */}
            <div className="relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#C5A059] bg-[#FAF7F2] shadow-xs transition-transform duration-300 group-hover:scale-105">
              <svg
                viewBox="0 0 40 40"
                fill="none"
                className="h-7 w-7 text-[#6B1D2F]"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon
                  points="20,4 34,14 34,28 20,36 6,28 6,14"
                  stroke="#C5A059"
                  strokeWidth="1.5"
                  fill="none"
                />
                <circle cx="20" cy="20" r="8" fill="#6B1D2F" />
                <path
                  d="M17 24L20 15L23 24M18.2 21.5H21.8"
                  stroke="#FFFDFB"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Brand Typography */}
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold tracking-[0.06em] text-[#6B1D2F] sm:text-xl lg:text-2xl">
                AURA <span className="font-light text-[#2B1519]">OF SHREE</span>
              </span>
              <span className="text-[8px] font-semibold tracking-[0.38em] text-[#C5A059] sm:text-[9px]">
                FINE JEWELLERY
              </span>
            </div>
          </Link>

          {/* Center: Search Bar with Category Dropdown (Desktop / Tablet) */}
          <div className="hidden flex-1 max-w-2xl px-2 md:block">
            <form
              action="/products"
              method="GET"
              onSubmit={handleSearchSubmit}
              className="flex items-center rounded-full border border-[#DFD4C7] bg-[#FAF7F2]/60 shadow-inner transition duration-200 focus-within:border-[#6B1D2F] focus-within:bg-white focus-within:shadow-sm"
            >
              {/* Category Dropdown */}
              <div className="relative flex items-center">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="cursor-pointer appearance-none rounded-l-full bg-transparent py-2.5 pl-4 pr-7 text-xs font-medium text-[#524043] transition hover:text-[#6B1D2F] focus:outline-none"
                  aria-label="Filter category"
                >
                  {categorySearchOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="pointer-events-none absolute right-2 h-4 w-4 text-[#8A7879]"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              {/* Vertical separator */}
              <div className="h-6 w-px bg-[#E2D6C8]" aria-hidden="true" />

              {/* Input field */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for rings, diamond necklaces, gold earrings, pendants..."
                className="w-full bg-transparent px-4 py-2.5 text-xs text-[#2B1519] placeholder:text-[#9C8B8E] focus:outline-none sm:text-sm"
              />

              {/* Circular Search Button */}
              <button
                type="submit"
                aria-label="Search"
                className="mr-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6B1D2F] text-white shadow-xs transition hover:bg-[#541524] focus:outline-none focus:ring-2 focus:ring-[#6B1D2F]/40 active:scale-95"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            </form>
          </div>

          {/* Right: Account | Divider | Wishlist | Cart */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            
            {/* Account dropdown button */}
            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                onClick={() => setAccountMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-2.5 transition hover:bg-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                aria-expanded={accountMenuOpen}
                aria-label="User account menu"
              >
                {/* Circular Avatar */}
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6B1D2F] font-medium text-xs text-[#FAF7F2] shadow-xs">
                  {isLoggedIn ? (
                    initials
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-4 w-4"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  )}
                </div>

                <div className="hidden items-center gap-1 sm:flex">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2B1519]">
                    {isLoggedIn ? displayName : "MR"}
                  </span>
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4 text-[#8A7879]"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </button>

              {/* Account Dropdown Menu */}
              {accountMenuOpen && (
                <div className="absolute right-0 top-12 z-50 w-64 rounded-xl border border-[#E8DFD5] bg-[#FFFFFF] p-2 shadow-xl animate-in fade-in zoom-in-95">
                  {isLoggedIn ? (
                    <div>
                      <div className="border-b border-[#F0E6DC] px-4 py-3">
                        <p className="text-xs font-semibold text-[#2B1519]">
                          {user?.name || "Valued Customer"}
                        </p>
                        <p className="truncate text-xs text-[#8A7879]">
                          {user?.email}
                        </p>
                        <span className="mt-1.5 inline-block rounded-full bg-[#FAF7F2] px-2.5 py-0.5 text-[10px] font-medium text-[#6B1D2F]">
                          Aura Privilege Member
                        </span>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/products"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-md px-4 py-2 text-xs text-[#524043] transition hover:bg-[#FAF7F2] hover:text-[#6B1D2F]"
                        >
                          <span>Explore Collection</span>
                        </Link>
                        <Link
                          href="/wishlist"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-md px-4 py-2 text-xs text-[#524043] transition hover:bg-[#FAF7F2] hover:text-[#6B1D2F]"
                        >
                          <span>Saved Wishlist</span>
                        </Link>
                        {user?.role === "admin" && (
                          <Link
                            href="/admin"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-2.5 rounded-md px-4 py-2 text-xs font-semibold text-[#C5A059] transition hover:bg-[#FAF7F2]"
                          >
                            <span>★ Admin Dashboard</span>
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-[#F0E6DC] pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setAccountMenuOpen(false);
                            void signOut({ callbackUrl: "/" });
                          }}
                          className="flex w-full items-center gap-2.5 rounded-md px-4 py-2 text-left text-xs text-[#B3261E] transition hover:bg-red-50"
                        >
                          <span>Sign out</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2">
                      <div className="px-3 py-2 text-center">
                        <p className="font-serif text-sm font-semibold text-[#2B1519]">
                          Welcome to Aura of Shree
                        </p>
                        <p className="mt-0.5 text-[11px] text-[#8A7879]">
                          Sign in to manage your orders &amp; wishlist
                        </p>
                      </div>

                      <div className="mt-2 flex flex-col gap-2">
                        <Link
                          href="/login"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex w-full items-center justify-center rounded-md bg-[#6B1D2F] py-2 text-xs font-semibold text-white transition hover:bg-[#541524]"
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex w-full items-center justify-center rounded-md border border-[#DFD4C7] py-2 text-xs font-semibold text-[#2B1519] transition hover:bg-[#FAF7F2]"
                        >
                          Create Account
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Vertical Divider */}
            <div className="h-6 w-px bg-[#E2D6C8]" aria-hidden="true" />

            {/* Wishlist Link with Live Counter Badge */}
            <WishlistLink />

            {/* Cart Link with Live Counter Badge */}
            <CartBagLink />

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#E2D6C8] text-[#2B1519] transition hover:bg-[#FAF7F2] md:hidden"
            >
              {mobileMenuOpen ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (under header row on mobile screens) */}
        <div className="border-t border-[#F0E6DC] bg-[#FFFDFB] px-4 py-2.5 md:hidden">
          <form
            action="/products"
            method="GET"
            onSubmit={handleSearchSubmit}
            className="flex items-center rounded-full border border-[#DFD4C7] bg-[#FAF7F2] shadow-inner"
          >
            <input
              type="text"
              name="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jewellery, rings, gold..."
              className="w-full bg-transparent px-4 py-2 text-xs text-[#2B1519] placeholder:text-[#9C8B8E] focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Search"
              className="mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#6B1D2F] text-white"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-3.5 w-3.5"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Bottom tier: [ SHOP ] button + Category Navigation Links */}
      <div className="border-b border-[#E8DFD5] bg-[#FFFDFB]">
        <div className="mx-auto flex max-w-[1440px] items-center gap-2 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
          
          {/* SHOP Standout Button (as in image) */}
          <Link
            href="/products"
            className="shrink-0 rounded-sm bg-[#6B1D2F] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-xs transition duration-200 hover:bg-[#541524] active:scale-95"
          >
            SHOP
          </Link>

          {/* Horizontal Navigation Categories */}
          <nav
            aria-label="Jewellery categories"
            className="flex items-center gap-1 overflow-x-auto no-scrollbar sm:gap-2"
          >
            {navigationCategories.map((category) => (
              <Link
                key={category.label}
                href={category.href}
                className="shrink-0 rounded-sm px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#3D141E] transition-colors duration-200 hover:bg-[#F9EFF1] hover:text-[#6B1D2F]"
              >
                {category.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-[#E8DFD5] bg-[#FFFFFF] px-5 py-4 md:hidden animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-1 pb-3 border-b border-[#F0E6DC]">
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md bg-[#6B1D2F] px-4 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-white"
            >
              SHOP ALL JEWELLERY
            </Link>
          </div>

          <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059]">
            COLLECTIONS &amp; CATEGORIES
          </p>

          <div className="mt-2 grid grid-cols-2 gap-1.5 pb-3 border-b border-[#F0E6DC]">
            {navigationCategories.map((category) => (
              <Link
                key={category.label}
                href={category.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-3 py-2 text-xs font-semibold text-[#3D141E] transition hover:bg-[#F9EFF1] hover:text-[#6B1D2F]"
              >
                {category.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 flex flex-col gap-2">
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-medium text-[#524043] hover:text-[#6B1D2F]"
            >
              Our Heritage &amp; Craftsmanship
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-medium text-[#524043] hover:text-[#6B1D2F]"
            >
              Customer Care &amp; Support
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
