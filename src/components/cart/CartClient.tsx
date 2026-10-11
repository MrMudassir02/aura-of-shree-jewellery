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
    try {
      const stored = localStorage.getItem(CART_KEY);

      if (stored) {
        const parsed: unknown = JSON.parse(stored);

        setCart(Array.isArray(parsed) ? parsed.filter(isCartItem) : []);
      }
    } catch {
      setCart([]);
      setStorageError(
        "Your saved bag could not be read. Please add your items again.",
      );
    } finally {
      setLoaded(true);
    }
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
    const item = cart.find((entry) => entry.productId === productId);

    if (!item || item.stock < 1) return;

    const safeQuantity = Math.min(
      Math.max(1, Math.floor(quantity)),
      item.stock,
    );

    saveCart(
      cart.map((entry) =>
        entry.productId === productId
          ? { ...entry, quantity: safeQuantity }
          : entry,
      ),
    );
  }

  function removeItem(productId: string) {
    saveCart(cart.filter((item) => item.productId !== productId));
  }

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#F5EBDD] px-5 py-20 text-center">
        <p className="text-sm text-[#806D60]">Loading your bag…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5EBDD] text-[#2B2020]">
      <header className="border-b border-[#3A1A1B]/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 lg:px-10">
          <Link
            href="/"
            className="text-xl font-semibold tracking-[0.12em] text-[#3A1A1B] sm:text-2xl"
          >
            AURA <span className="font-light">OF SHREE</span>
            <span className="mt-1 block text-center text-[9px] tracking-[0.42em]">
              JEWELLERY
            </span>
          </Link>

          <Link
            href="/products"
            className="text-sm text-[#3A1A1B] underline underline-offset-4"
          >
            Continue Shopping
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-10 lg:py-16">
        <p className="text-xs uppercase tracking-[0.25em] text-[#967344]">
          Your selection
        </p>

        <h1 className="mt-4 font-serif text-4xl text-[#3A1A1B] sm:text-5xl">
          Your Shopping Bag
        </h1>

        <p className="mt-3 text-sm text-[#806D60]">
          {itemCount} {itemCount === 1 ? "item" : "items"} in your bag
        </p>

        {storageError && (
          <p
            role="alert"
            className="mt-5 border border-red-300 bg-white p-4 text-sm text-red-800"
          >
            {storageError}
          </p>
        )}

        {cart.length === 0 ? (
          <div className="mt-10 bg-[#FFF9F0] px-6 py-20 text-center">
            <h2 className="font-serif text-3xl text-[#3A1A1B]">
              Your bag is waiting
            </h2>
            <p className="mt-4 text-sm text-[#806D60]">
              Discover something beautiful and make it yours.
            </p>
            <Link
              href="/products"
              className="mt-8 inline-block bg-[#3A1A1B] px-7 py-4 text-sm text-[#FFF9F0] transition hover:bg-[#54292A]"
            >
              Explore Jewellery
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              {cart.map((item) => {
                const unavailable = item.stock < 1;
                const exceedsStock = item.quantity > item.stock;

                return (
                  <article
                    key={item.productId}
                    className="flex gap-4 border-b border-[#3A1A1B]/10 pb-6 sm:gap-6"
                  >
                    <Link
                      href={`/products/${item.slug}`}
                      className="relative h-36 w-28 shrink-0 overflow-hidden bg-[#FFF9F0] sm:h-44 sm:w-36"
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
                        <div className="flex h-full items-center justify-center text-xs text-[#806D60]">
                          No image
                        </div>
                      )}
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <Link
                            href={`/products/${item.slug}`}
                            className="font-serif text-xl text-[#3A1A1B] hover:underline"
                          >
                            {item.name}
                          </Link>
                          <p className="mt-2 text-sm text-[#806D60]">
                            {formatPrice(item.price)}
                          </p>
                          {unavailable && (
                            <p className="mt-2 text-xs text-red-800">
                              Currently out of stock. Remove this item to
                              continue.
                            </p>
                          )}
                          {!unavailable && exceedsStock && (
                            <p className="mt-2 text-xs text-amber-800">
                              Quantity exceeds the saved stock limit. Update it
                              before checkout.
                            </p>
                          )}
                        </div>

                        <p className="text-sm font-medium text-[#3A1A1B]">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>

                      <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-5">
                        <div className="inline-flex items-center border border-[#3A1A1B]/20">
                          <button
                            type="button"
                            aria-label={`Decrease quantity of ${item.name}`}
                            disabled={item.quantity <= 1 || unavailable}
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            className="px-4 py-2 text-lg text-[#3A1A1B] disabled:opacity-30"
                          >
                            −
                          </button>
                          <span className="min-w-10 text-center text-sm">
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
                            className="px-4 py-2 text-lg text-[#3A1A1B] disabled:opacity-30"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="text-xs text-[#806D60] underline underline-offset-4 hover:text-[#3A1A1B]"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="h-fit bg-[#FFF9F0] p-6 sm:p-8">
              <h2 className="font-serif text-2xl text-[#3A1A1B]">
                Order Summary
              </h2>

              <div className="mt-6 flex justify-between gap-4 text-sm">
                <span className="text-[#806D60]">Subtotal</span>
                <span className="font-medium text-[#3A1A1B]">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="mt-4 flex justify-between gap-4 text-sm">
                <span className="text-[#806D60]">Shipping</span>
                <span className="text-[#806D60]">Calculated at checkout</span>
              </div>

              <div className="my-6 h-px bg-[#3A1A1B]/10" />

              <div className="flex justify-between gap-4">
                <span className="font-medium text-[#3A1A1B]">
                  Estimated Total
                </span>
                <span className="font-semibold text-[#3A1A1B]">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <Link
                href="/checkout"
                aria-disabled={cart.some(
                  (item) => item.stock < 1 || item.quantity > item.stock,
                )}
                className={`mt-7 block px-6 py-4 text-center text-sm text-[#FFF9F0] transition ${
                  cart.some(
                    (item) => item.stock < 1 || item.quantity > item.stock,
                  )
                    ? "pointer-events-none bg-gray-500"
                    : "bg-[#3A1A1B] hover:bg-[#54292A]"
                }`}
              >
                Review at Checkout →
              </Link>

              <p className="mt-4 text-center text-xs leading-5 text-[#806D60]">
                Prices and stock are checked again by the server during
                checkout.
              </p>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
