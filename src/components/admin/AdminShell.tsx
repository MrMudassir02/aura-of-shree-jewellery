"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type AdminUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
};

type AdminShellProps = {
  children: React.ReactNode;
  user?: AdminUser | null;
};

const navigationItems = [
  {
    name: "Dashboard",
    href: "/admin",
    exact: true,
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    name: "Products & Catalogue",
    href: "/admin/products",
    exact: false,
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    name: "Add New Jewellery",
    href: "/admin/products/new",
    exact: true,
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
];

function getInitials(name?: string | null, email?: string | null): string {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (email && email.trim()) {
    return email.slice(0, 2).toUpperCase();
  }
  return "AS";
}

export default function AdminShell({ children, user }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const initials = getInitials(user?.name, user?.email);

  const isActive = (itemHref: string, exact: boolean) => {
    if (!pathname) {
      return false;
    }
    if (exact) {
      return pathname === itemHref;
    }
    return pathname.startsWith(itemHref);
  };

  const navLinks = (
    <nav className="space-y-1.5">
      {navigationItems.map((item) => {
        const active = isActive(item.href, item.exact);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition duration-150 ${
              active
                ? "bg-[#6B1D2F] text-white shadow-sm ring-1 ring-[#C5A059]/40"
                : "text-[#FAF7F2]/75 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className={active ? "text-[#C5A059]" : "text-[#FAF7F2]/60"}>
              {item.icon}
            </span>
            <span>{item.name}</span>
            {active && (
              <span className="ml-auto h-2 w-2 rounded-full bg-[#C5A059]" />
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2B1519] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 lg:w-72 shrink-0 flex-col bg-[#541524] border-r border-[#6B1D2F]/70 text-[#FAF7F2] p-6 lg:p-7 justify-between min-h-screen sticky top-0">
        <div>
          {/* Brand */}
          <Link href="/admin" className="block pb-6 border-b border-white/15">
            <span className="font-serif text-xl tracking-[0.12em] block text-[#FAF7F2]">
              AURA OF SHREE
            </span>
            <span className="mt-1.5 block text-[9px] uppercase tracking-[0.38em] text-[#C5A059] font-medium">
              Jewellery &bull; Atelier
            </span>
          </Link>

          {/* Section title */}
          <div className="mt-8 mb-3">
            <span className="text-[10px] uppercase tracking-[0.24em] text-[#C5A059] font-semibold">
              Management
            </span>
          </div>

          {/* Navigation Links */}
          {navLinks}
        </div>

        {/* Bottom Sidebar details */}
        <div className="pt-6 border-t border-white/15 space-y-4">
          <Link
            href="/"
            className="flex items-center justify-between gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-xs text-[#FAF7F2]/80 hover:bg-white/10 hover:text-white transition"
          >
            <span>Visit Storefront</span>
            <span className="text-[#C5A059]">↗</span>
          </Link>

          {/* User badge */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#C5A059] text-xs font-bold text-[#541524]">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-white">
                {user?.name || "Administrator"}
              </p>
              <p className="text-[10px] text-[#C5A059] uppercase tracking-wider">
                Store Admin
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#541524] border-r border-[#6B1D2F] p-6 text-[#FAF7F2] flex flex-col justify-between transform transition-transform duration-200 ease-in-out md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-white/15">
            <Link href="/admin" onClick={() => setMobileOpen(false)}>
              <span className="font-serif text-lg tracking-[0.12em] block text-[#FAF7F2]">
                AURA OF SHREE
              </span>
              <span className="mt-1 block text-[9px] uppercase tracking-[0.35em] text-[#C5A059]">
                Jewellery Atelier
              </span>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
              aria-label="Close menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-8 mb-3">
            <span className="text-[10px] uppercase tracking-[0.24em] text-[#C5A059] font-semibold">
              Management
            </span>
          </div>

          {navLinks}
        </div>

        <div className="pt-6 border-t border-white/15 space-y-4">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-between gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-xs text-[#FAF7F2]/80 hover:bg-white/10 hover:text-white transition"
          >
            <span>Visit Storefront</span>
            <span className="text-[#C5A059]">↗</span>
          </Link>

          <div className="flex items-center gap-3 pt-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#C5A059] text-xs font-bold text-[#541524]">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-white">
                {user?.name || "Administrator"}
              </p>
              <p className="text-[10px] text-[#C5A059] uppercase tracking-wider">
                Store Admin
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#E8DFD5] bg-white/90 backdrop-blur-md px-5 py-3.5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden rounded-lg p-2 text-[#541524] hover:bg-[#FAF7F2] transition"
              aria-label="Open navigation menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8A7879]">
                  Atelier Administration
                </p>
              </div>
              <p className="font-serif text-base font-semibold text-[#2B1519]">
                Aura of Shree Jewellery
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#DFD4C7] bg-[#FAF7F2] px-4 py-1.5 text-xs font-semibold text-[#6B1D2F] transition hover:border-[#6B1D2F] hover:bg-white shadow-xs"
            >
              <span>Storefront</span>
              <span className="text-[#C5A059]">↗</span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-[#E8DFD5]">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6B1D2F] text-xs font-semibold text-[#FAF7F2]">
                {initials}
              </div>
              <span className="text-xs font-medium text-[#2B1519] max-w-[120px] truncate">
                {user?.name || "Admin"}
              </span>
            </div>
          </div>
        </header>

        {/* Children Page Content */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
