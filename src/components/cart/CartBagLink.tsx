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

    return parsed.reduce((total: number, item: unknown) => {
      if (
        typeof item === "object" &&
        item !== null &&
        "quantity" in item &&
        typeof (item as CartItem).quantity === "number" &&
        Number.isFinite((item as CartItem).quantity) &&
        (item as CartItem).quantity > 0
      ) {
        return total + Math.floor((item as CartItem).quantity);
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
      className="whitespace-nowrap rounded-full border border-[#3A1A1B]/20 px-3 py-2 text-sm transition-colors hover:bg-[#3A1A1B] hover:text-[#FFF9F0] sm:px-4"
    >
      Bag ({count})
    </Link>
  );
}
