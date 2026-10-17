import Link from "next/link";
import { getServerSession } from "next-auth";

import SiteNavigation from "@/components/navigation/SiteNavigation";
import SignOutButton from "@/components/account/SignOutButton";
import ChangePasswordSection from "@/components/account/ChangePasswordSection";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { orderRepository } from "@/server/repositories/OrderRepository";

export const dynamic = "force-dynamic";

function getInitials(name?: string | null, email?: string | null): string {
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
  return "ME";
}

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  let orderCount = 0;
  if (user?.id) {
    try {
      const orders = await orderRepository.findByUserId(user.id);
      orderCount = orders.length;
    } catch {
      // Gracefully handle
    }
  }

  const initials = getInitials(user?.name, user?.email);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2B1519]">
      {/* Top Announcement Bar */}
      <div className="bg-[#6B1D2F] px-4 py-2 text-center text-[10px] sm:text-xs font-semibold tracking-[0.18em] text-[#FAF7F2] overflow-hidden whitespace-nowrap">
        ✨ AURA PRIVILEGE CLUB · COMPLIMENTARY INSURED SHIPPING ACROSS INDIA
      </div>

      <SiteNavigation isLoggedIn={Boolean(user)} user={user} />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs text-[#8A7879]">
          <Link href="/" className="hover:text-[#6B1D2F] transition">
            Home
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#2B1519]">My Account</span>
        </nav>

        {!user ? (
          /* Guest Screen */
          <div className="mt-8 rounded-3xl border border-[#E8DFD5] bg-white p-8 sm:p-14 text-center shadow-xs">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FAF7F2] text-[#6B1D2F]">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>

            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059]">
              Aura Privilege Membership
            </span>

            <h1 className="mt-2 font-serif text-3xl font-bold text-[#2B1519] sm:text-4xl">
              Welcome to Aura of Shree
            </h1>

            <p className="mx-auto mt-3 max-w-md text-xs sm:text-sm leading-6 text-[#8A7879]">
              Sign in to manage your jewellery orders, track insured shipments, access hallmark certificates, and view your saved wishlist.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3.5">
              <Link
                href="/login?callbackUrl=/account"
                className="rounded-xl bg-[#6B1D2F] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#541524] active:scale-95"
              >
                Sign In to Account
              </Link>
              <Link
                href="/register"
                className="rounded-xl border border-[#DFD4C7] bg-[#FAF7F2] px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-[#2B1519] transition hover:bg-white hover:border-[#6B1D2F]"
              >
                Create New Account
              </Link>
            </div>

            {/* Privilege Perks */}
            <div className="mt-12 grid grid-cols-1 gap-4 border-t border-[#F0E6DC] pt-8 sm:grid-cols-3 text-left">
              <div className="rounded-xl bg-[#FAF7F2] p-4">
                <span className="text-[#C5A059] font-bold text-xs uppercase tracking-wider">Perk 01</span>
                <p className="mt-1 font-serif text-sm font-semibold text-[#2B1519]">Insured Shipping</p>
                <p className="mt-1 text-xs text-[#8A7879]">Doorstep insured delivery with real-time tracking.</p>
              </div>

              <div className="rounded-xl bg-[#FAF7F2] p-4">
                <span className="text-[#C5A059] font-bold text-xs uppercase tracking-wider">Perk 02</span>
                <p className="mt-1 font-serif text-sm font-semibold text-[#2B1519]">100% BIS Hallmarked</p>
                <p className="mt-1 text-xs text-[#8A7879]">Certified gold purity and IGI-graded diamonds.</p>
              </div>

              <div className="rounded-xl bg-[#FAF7F2] p-4">
                <span className="text-[#C5A059] font-bold text-xs uppercase tracking-wider">Perk 03</span>
                <p className="mt-1 font-serif text-sm font-semibold text-[#2B1519]">Dedicated Concierge</p>
                <p className="mt-1 text-xs text-[#8A7879]">Priority assistance for custom jewellery orders.</p>
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated Account Details Screen */
          <div className="space-y-7">
            {/* Profile Overview Card */}
            <section className="relative overflow-hidden rounded-3xl border border-[#E8DFD5] bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4 sm:gap-5">
                  {/* Luxury Avatar Circle */}
                  <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-full bg-[#6B1D2F] border-2 border-[#C5A059] text-xl sm:text-2xl font-serif font-bold text-[#FAF7F2] shadow-sm">
                    {initials}
                  </div>

                  <div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF7F2] border border-[#DFD4C7] px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B1D2F]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059]" />
                      Aura Privilege Member
                    </div>

                    <h1 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-[#2B1519]">
                      {user.name || "Valued Customer"}
                    </h1>

                    <p className="text-xs sm:text-sm text-[#8A7879] mt-0.5">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="border-t border-[#F0E6DC] sm:border-t-0 sm:border-l sm:pl-6 pt-4 sm:pt-0 flex sm:flex-col items-center sm:items-start justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-[#8A7879] font-medium">
                    Order History
                  </span>
                  <p className="font-serif text-2xl font-bold text-[#6B1D2F]">
                    {orderCount} {orderCount === 1 ? "Order" : "Orders"}
                  </p>
                </div>
              </div>
            </section>

            {/* Quick Actions Grid */}
            <section className="grid gap-4 sm:grid-cols-2">
              {/* Orders Tile */}
              <Link
                href="/orders"
                className="group rounded-2xl border border-[#E8DFD5] bg-white p-6 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#6B1D2F] hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FAF7F2] text-[#6B1D2F] transition group-hover:bg-[#6B1D2F] group-hover:text-white">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-[#C5A059] group-hover:translate-x-1 transition">
                    View →
                  </span>
                </div>

                <h3 className="mt-4 font-serif text-lg font-bold text-[#2B1519]">
                  My Orders &amp; Invoices
                </h3>
                <p className="mt-1 text-xs text-[#8A7879] leading-5">
                  Track live shipments, download tax invoices, and review past jewellery orders.
                </p>
              </Link>

              {/* Wishlist Tile */}
              <Link
                href="/wishlist"
                className="group rounded-2xl border border-[#E8DFD5] bg-white p-6 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#6B1D2F] hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FAF7F2] text-[#6B1D2F] transition group-hover:bg-[#6B1D2F] group-hover:text-white">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-[#C5A059] group-hover:translate-x-1 transition">
                    View →
                  </span>
                </div>

                <h3 className="mt-4 font-serif text-lg font-bold text-[#2B1519]">
                  Saved Wishlist
                </h3>
                <p className="mt-1 text-xs text-[#8A7879] leading-5">
                  Manage your curated wishlist of favourite diamond rings, necklaces, and bangles.
                </p>
              </Link>

              {/* Browse Catalogue */}
              <Link
                href="/products"
                className="group rounded-2xl border border-[#E8DFD5] bg-white p-6 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#6B1D2F] hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FAF7F2] text-[#6B1D2F] transition group-hover:bg-[#6B1D2F] group-hover:text-white">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-[#C5A059] group-hover:translate-x-1 transition">
                    Explore →
                  </span>
                </div>

                <h3 className="mt-4 font-serif text-lg font-bold text-[#2B1519]">
                  Explore Jewellery
                </h3>
                <p className="mt-1 text-xs text-[#8A7879] leading-5">
                  Browse festive collections, solitaire rings, pendants, and 24K gold investment coins.
                </p>
              </Link>

              {/* Admin Atelier Tile (If Admin) */}
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="group rounded-2xl border border-[#C5A059]/40 bg-[#FAF7F2] p-6 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#6B1D2F] hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6B1D2F] text-white">
                      ★
                    </div>
                    <span className="text-xs font-semibold text-[#C5A059] group-hover:translate-x-1 transition">
                      Manage →
                    </span>
                  </div>

                  <h3 className="mt-4 font-serif text-lg font-bold text-[#6B1D2F]">
                    Atelier Administration
                  </h3>
                  <p className="mt-1 text-xs text-[#524043] leading-5">
                    Curate catalogue listings, adjust pricing, update inventory, and manage publishing.
                  </p>
                </Link>
              )}
            </section>

            {/* Account Information & Sign Out */}
            <section className="rounded-3xl border border-[#E8DFD5] bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-[#F0E6DC] pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059]">
                    Security &amp; Preferences
                  </span>
                  <h2 className="font-serif text-lg font-bold text-[#2B1519]">
                    Account Information
                  </h2>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                <div className="rounded-xl border border-[#E8DFD5] bg-[#FAF7F2]/60 p-4">
                  <span className="text-[#8A7879] uppercase tracking-wider font-semibold text-[10px]">
                    Customer Name
                  </span>
                  <p className="mt-1 font-semibold text-sm text-[#2B1519]">
                    {user.name || "—"}
                  </p>
                </div>

                <div className="rounded-xl border border-[#E8DFD5] bg-[#FAF7F2]/60 p-4">
                  <span className="text-[#8A7879] uppercase tracking-wider font-semibold text-[10px]">
                    Registered Email
                  </span>
                  <p className="mt-1 font-semibold text-sm text-[#2B1519] truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Password & Security */}
              <ChangePasswordSection />

              {/* Sign Out Action */}
              <div className="pt-4 border-t border-[#F0E6DC] flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs text-[#8A7879]">
                  Logged in via secure authenticated session.
                </p>
                <SignOutButton />
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

