"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import SiteNavigation from "@/components/navigation/SiteNavigation";
import {
  getWishlistItems,
  removeWishlistItem,
  type WishlistItem,
} from "@/lib/wishlist";

const CART_KEY = "aura-cart-v1";

type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const refreshWishlist = () => {
    setItems(getWishlistItems());
  };

  useEffect(() => {
    queueMicrotask(() => {
      refreshWishlist();
      setLoaded(true);
    });

    window.addEventListener("wishlist-updated", refreshWishlist);
    return () => {
      window.removeEventListener("wishlist-updated", refreshWishlist);
    };
  }, []);

  function handleMoveToBag(item: WishlistItem) {
    try {
      const stored = localStorage.getItem(CART_KEY);
      const parsed: unknown = stored ? JSON.parse(stored) : [];
      const cart: CartItem[] = Array.isArray(parsed) ? (parsed as CartItem[]) : [];

      const existing = cart.find((c) => c.productId === item.productId);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          productId: item.productId,
          slug: item.slug,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: 1,
          stock: item.stock || 10,
        });
      }

      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      window.dispatchEvent(new Event("cart-updated"));

      removeWishlistItem(item.productId);
      setToastMessage(`"${item.name}" moved to your bag!`);
      setTimeout(() => setToastMessage(""), 3000);
    } catch {
      setToastMessage("Unable to add to bag.");
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2B1519]">
      <SiteNavigation />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-[#E8DFD5] pb-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059]">
                Saved Treasures
              </p>
              <h1 className="mt-1 font-serif text-3xl font-bold text-[#6B1D2F] sm:text-4xl">
                My Wishlist
              </h1>
            </div>
            <p className="text-xs font-semibold text-[#8A7879]">
              {items.length} {items.length === 1 ? "Item" : "Items"}
            </p>
          </div>
        </div>

        {toastMessage && (
          <div className="mb-6 rounded-lg bg-[#6B1D2F] px-4 py-3 text-xs font-medium text-white shadow-md">
            {toastMessage}
          </div>
        )}

        {!loaded ? (
          <div className="py-20 text-center text-sm text-[#8A7879]">
            Loading your wishlist...
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-[#E8DFD5] bg-white p-12 text-center shadow-xs">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FAF7F2] text-[#6B1D2F]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <h2 className="mt-4 font-serif text-2xl font-bold text-[#2B1519]">
              Your wishlist is currently empty
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[#8A7879]">
              Save pieces you love by clicking the heart icon on any product to easily find and purchase them later.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-block rounded-md bg-[#6B1D2F] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#541524]"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-[#E8DFD5] bg-white shadow-xs"
              >
                <div className="relative aspect-square w-full bg-[#FAF7F2]">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      unoptimized
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-[#8A7879]">
                      No Image
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => removeWishlistItem(item.productId)}
                    aria-label="Remove item"
                    className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#8A7879] shadow-xs hover:text-red-600"
                  >
                    ×
                  </button>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-serif text-sm font-semibold text-[#2B1519] line-clamp-1">
                    <Link href={`/products/${item.slug}`} className="hover:text-[#6B1D2F]">
                      {item.name}
                    </Link>
                  </h3>
                  <p className="mt-1 font-semibold text-sm text-[#6B1D2F]">
                    {formatPrice(item.price)}
                  </p>

                  <div className="mt-auto pt-3">
                    <button
                      type="button"
                      onClick={() => handleMoveToBag(item)}
                      className="w-full rounded-md bg-[#6B1D2F] py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#541524]"
                    >
                      Move to Bag
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

