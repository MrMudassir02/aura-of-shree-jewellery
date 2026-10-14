"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getWishlistCount } from "@/lib/wishlist";

export default function WishlistLink() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    queueMicrotask(() => {
      setCount(getWishlistCount());
    });

    const handleUpdate = () => {
      setCount(getWishlistCount());
    };

    window.addEventListener("wishlist-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("wishlist-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return (
    <Link
      href="/wishlist"
      aria-label={`Wishlist, ${count} ${count === 1 ? "item" : "items"}`}
      title="Wishlist"
      className="group relative flex items-center gap-2 rounded-md px-2 py-1.5 text-[#2B1519] transition-colors hover:text-[#6B1D2F]"
    >
      <div className="relative flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 transition-transform group-hover:scale-105"
          aria-hidden="true"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>

        {count > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#1A4D2E] px-1 text-[10px] font-bold text-white shadow-xs">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </div>

      <span className="hidden text-xs font-bold tracking-wider text-[#2B1519] group-hover:text-[#6B1D2F] sm:inline">
        WISHLIST
      </span>
    </Link>
  );
}

