"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;

  const item = value as Record<string, unknown>;

  return (
    typeof item.productId === "string" &&
    typeof item.slug === "string" &&
    typeof item.name === "string" &&
    typeof item.price === "number" &&
    Number.isFinite(item.price) &&
    item.price >= 0 &&
    typeof item.image === "string" &&
    typeof item.quantity === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0 &&
    typeof item.stock === "number" &&
    Number.isInteger(item.stock) &&
    item.stock >= 0
  );
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function CartClient() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [storageError, setStorageError] = useState("");

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const stored = localStorage.getItem(CART_KEY);

        if (stored) {
          const parsed: unknown = JSON.parse(stored);
          setCart(Array.isArray(parsed) ? parsed.filter(isCartItem) : []);
        } else {
          setCart([]);
        }
      } catch {
        setCart([]);
        setStorageError(
          "Your saved bag could not be read. Please add your items again.",
        );
      } finally {
        setLoaded(true);
      }
    });
  }, []);

  function saveCart(updatedCart: CartItem[]) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
      setCart(updatedCart);
      setStorageError("");
      window.dispatchEvent(new Event("cart-updated"));
    } catch {
      setStorageError(
        "Your bag could not be saved. Check your browser storage and try again.",
      );
    }
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity < 1) return;

    const updated = cart.map((item) =>
      item.productId === productId ? { ...item, quantity } : item,
    );

    saveCart(updated);
  }

  function removeItem(productId: string) {
    const updated = cart.filter((item) => item.productId !== productId);
    saveCart(updated);
  }

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#FAF7F2] text-[#2B1519]">
        <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-5">
          <p className="text-sm text-[#8A7879]">Loading your shopping bag...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#2B1519]">
      <header className="border-b border-[#E8DFD5] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-xl font-serif font-bold tracking-[0.08em] text-[#6B1D2F] sm:text-2xl"
          >
            AURA <span className="font-light text-[#2B1519]">OF SHREE</span>
            <span className="mt-0.5 block text-center text-[8px] font-semibold tracking-[0.38em] text-[#C5A059]">
              FINE JEWELLERY
            </span>
          </Link>

          <Link
            href="/products"
            className="text-xs font-bold uppercase tracking-wider text-[#6B1D2F] hover:text-[#541524]"
          >
            ← Continue Shopping
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059]">
          YOUR SELECTION
        </p>

        <h1 className="mt-2 font-serif text-3xl font-bold text-[#2B1519] sm:text-4xl">
          Shopping Bag
        </h1>

        <p className="mt-1 text-xs text-[#8A7879]">
          {itemCount} {itemCount === 1 ? "piece" : "pieces"} in your bag
        </p>

        {storageError && (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-800"
          >
            {storageError}
          </p>
        )}

        {cart.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-[#E8DFD5] bg-white px-6 py-16 text-center shadow-xs">
            <h2 className="font-serif text-2xl font-bold text-[#2B1519]">
              Your bag is currently empty
            </h2>
            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#8A7879]">
              Discover something beautiful from our collections and make it yours.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-block rounded-md bg-[#6B1D2F] px-7 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#541524]"
            >
              Explore All Jewellery
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="space-y-4">
              {cart.map((item) => {
                const unavailable = item.stock < 1;
                const exceedsStock = item.quantity > item.stock;

                return (
                  <article
                    key={item.productId}
                    className="flex gap-4 rounded-xl border border-[#E8DFD5] bg-white p-4 shadow-2xs sm:gap-6"
                  >
                    <Link
                      href={`/products/${item.slug}`}
                      className="relative h-28 w-24 shrink-0 overflow-hidden rounded-lg bg-[#FAF7F2] sm:h-36 sm:w-32"
                    >
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          unoptimized
                          sizes="144px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-[#8A7879]">
                          No image
                        </div>
                      )}
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <Link
                            href={`/products/${item.slug}`}
                            className="font-serif text-base font-semibold text-[#2B1519] hover:text-[#6B1D2F]"
                          >
                            {item.name}
                          </Link>
                          <p className="mt-1 text-xs font-medium text-[#8A7879]">
                            {formatPrice(item.price)}
                          </p>
                          {unavailable && (
                            <p className="mt-1 text-xs text-red-700">
                              Currently out of stock.
                            </p>
                          )}
                          {!unavailable && exceedsStock && (
                            <p className="mt-1 text-xs text-amber-700">
                              Quantity exceeds stock limit.
                            </p>
                          )}
                        </div>

                        <p className="text-sm font-bold text-[#6B1D2F]">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#F0E6DC] pt-3">
                        <div className="inline-flex items-center rounded border border-[#DFD4C7]">
                          <button
                            type="button"
                            aria-label={`Decrease quantity of ${item.name}`}
                            disabled={item.quantity <= 1 || unavailable}
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            className="px-3 py-1 text-sm text-[#2B1519] disabled:opacity-30"
                          >
                            −
                          </button>
                          <span className="min-w-8 text-center text-xs font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label={`Increase quantity of ${item.name}`}
                            disabled={
                              unavailable || item.quantity >= item.stock
                            }
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            className="px-3 py-1 text-sm text-[#2B1519] disabled:opacity-30"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="text-xs text-[#8A7879] underline underline-offset-4 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="h-fit rounded-xl border border-[#E8DFD5] bg-white p-6 shadow-xs">
              <h2 className="font-serif text-xl font-bold text-[#2B1519]">
                Order Summary
              </h2>

              <div className="mt-5 flex justify-between gap-4 text-xs">
                <span className="text-[#8A7879]">Subtotal</span>
                <span className="font-semibold text-[#2B1519]">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="mt-3 flex justify-between gap-4 text-xs">
                <span className="text-[#8A7879]">Insured Shipping</span>
                <span className="font-semibold text-[#1A4D2E]">FREE</span>
              </div>

              <div className="my-5 h-px bg-[#E8DFD5]" />

              <div className="flex justify-between gap-4 text-sm font-bold">
                <span className="text-[#2B1519]">Estimated Total</span>
                <span className="text-[#6B1D2F]">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <Link
                href="/checkout"
                aria-disabled={cart.some(
                  (item) => item.stock < 1 || item.quantity > item.stock,
                )}
                className={`mt-6 block rounded-md px-6 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-white shadow-xs transition ${
                  cart.some(
                    (item) => item.stock < 1 || item.quantity > item.stock,
                  )
                    ? "pointer-events-none bg-gray-400"
                    : "bg-[#6B1D2F] hover:bg-[#541524]"
                }`}
              >
                Proceed to Checkout →
              </Link>

              <div className="mt-5 border-t border-[#F0E6DC] pt-4 text-[11px] text-[#8A7879] leading-5">
                <p>✓ 100% BIS Hallmarked Purity Guaranteed</p>
                <p>✓ Complimentary Transit Insurance Included</p>
                <p>✓ 15-Day Easy Exchange Policy</p>
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
