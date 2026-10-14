"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const CART_KEY = "aura-cart-v1";

type CartItem = {
  quantity: number;
};

function readCartCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const stored = localStorage.getItem(CART_KEY);
    if (!stored) return 0;

    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return 0;

    return parsed.reduce((total: number, value: unknown) => {
      if (
        typeof value === "object" &&
        value !== null &&
        "quantity" in value &&
        typeof (value as CartItem).quantity === "number" &&
        Number.isFinite((value as CartItem).quantity) &&
        (value as CartItem).quantity > 0
      ) {
        return total + Math.floor((value as CartItem).quantity);
      }

      return total;
    }, 0);
  } catch {
    return 0;
  }
}

export default function CartBagLink() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    queueMicrotask(() => {
      setCount(readCartCount());
    });

    const handleUpdate = () => {
      setCount(readCartCount());
    };

    window.addEventListener("cart-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("cart-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return (
    <Link
      href="/cart"
      aria-label={`Shopping bag, ${count} ${count === 1 ? "item" : "items"}`}
      title="Shopping bag"
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
          <circle cx="8" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>

        {count > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#6B1D2F] px-1 text-[10px] font-bold text-white shadow-xs">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </div>

      <span className="hidden text-xs font-bold tracking-wider text-[#2B1519] group-hover:text-[#6B1D2F] sm:inline">
        CART
      </span>
    </Link>
  );
}
