"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const CART_KEY = "aura-cart-v1";

type CartItem = {
  quantity: number;
};

function readCartCount(): number {
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

  const syncCartCount = useCallback(() => {
    setCount(readCartCount());
  }, []);

  useEffect(() => {
    syncCartCount();

    window.addEventListener("cart-updated", syncCartCount);
    window.addEventListener("storage", syncCartCount);

    return () => {
      window.removeEventListener("cart-updated", syncCartCount);
      window.removeEventListener("storage", syncCartCount);
    };
  }, [syncCartCount]);

  return (
    <Link
      href="/cart"
      aria-label={`Shopping bag, ${count} ${count === 1 ? "item" : "items"}`}
      title="Shopping bag"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-sm text-[#F5EBDD] transition hover:bg-[#F5EBDD] hover:text-[#3A1A1B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4B77E]"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="M5 8h14l1 13H4L5 8Z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </svg>

      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#D4B77E] px-1 text-[10px] font-semibold leading-none text-[#3A1A1B]">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
