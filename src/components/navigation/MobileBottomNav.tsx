"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getWishlistCount } from "@/lib/wishlist";

type SessionUser = {
  name?: string | null;
  email?: string | null;
};

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      setWishlistCount(getWishlistCount());
    });

    const handleWishlistUpdate = () => {
      setWishlistCount(getWishlistCount());
    };

    window.addEventListener("wishlist-updated", handleWishlistUpdate);
    window.addEventListener("storage", handleWishlistUpdate);

    // Fetch lightweight session status
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});

    return () => {
      window.removeEventListener("wishlist-updated", handleWishlistUpdate);
      window.removeEventListener("storage", handleWishlistUpdate);
    };
  }, []);

  // Skip bottom nav on admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    {
      label: "Home",
      href: "/",
      exact: true,
      icon: (active: boolean) => (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={active ? "1.8" : "1.8"}
        >
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5a1 1 0 01-1-1v-5h-4v5a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        </svg>
      ),
    },
    {
      label: "Shop",
      href: "/products",
      exact: false,
      icon: (active: boolean) => (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      label: "Orders",
      href: "/orders",
      exact: false,
      icon: (active: boolean) => (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      label: "Wishlist",
      href: "/wishlist",
      exact: true,
      badge: wishlistCount,
      icon: (active: boolean) => (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
      ),
    },
    {
      label: user?.name ? "Account" : "Profile",
      href: user ? "/orders" : "/login",
      exact: false,
      icon: (active: boolean) => (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8DFD5] md:hidden shadow-[0_-4px_20px_rgba(43,21,25,0.06)] pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5">
      <div className="flex items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 min-w-[58px] transition-all duration-150 relative ${
                isActive ? "text-[#6B1D2F]" : "text-[#8A7879] hover:text-[#524043]"
              }`}
            >
              {/* Icon Container with subtle pill background for active state */}
              <div
                className={`flex h-8 w-11 items-center justify-center rounded-full transition-all duration-150 ${
                  isActive ? "bg-[#F9EFF1] text-[#6B1D2F]" : ""
                }`}
              >
                {item.icon(Boolean(isActive))}

                {/* Badge indicator for Wishlist count */}
                {Boolean(item.badge && item.badge > 0) && (
                  <span className="absolute -top-0.5 right-3 flex h-4 w-4 items-center justify-center rounded-full bg-[#6B1D2F] text-[9px] font-bold text-white shadow-2xs">
                    {item.badge! > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`mt-0.5 text-[10px] tracking-tight ${
                  isActive ? "font-bold text-[#6B1D2F]" : "font-medium text-[#8A7879]"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

