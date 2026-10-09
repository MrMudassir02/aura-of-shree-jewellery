"use client";
import Image from "next/image";
import Link from "next/link";
import { parse } from "path";
import { useState, useEffect } from "react";
import { json } from "zod";

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

export default function CartClient() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);

      if (stored) {
        const parsed: CartItem[] = JSON.parse(stored);
        setCart(Array.isArray(parsed) ? parsed : []);
      }
    } catch {
      setCart([]);
    }
    setLoaded(true);
  }, []);

  function saveCart(updatedCart: CartItem[]) {
    setCart(updatedCart);
    localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cart-updated"));
  }

  function updateQuantity(productId: string, quantity: number) {
    const updatedCart = cart.map((item) =>
      item.productId === productId
        ? {
            ...item,
            quantity: Math.min(Math.max(1, quantity), item.stock),
          }
        : item,
    );
    saveCart(updatedCart);
  }

  function removeItem(productId: string) {
    saveCart(cart.filter((item) => item.productId !== productId));
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  }

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#F5EBDD] px-5 py-20 text-center">
        <p className="text-sm text-[#806D60]">Loading your bag....</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5EBDD] text-[#2B2020]">
      {/* header */}
      <header className="border-b border-[#3A1A1B]/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-10">
          <Link
            href="/"
            className="text-xl font-semibold tracking-[0.12em] text-[#3A1A1B] sm:text-2xl"
          >
            AURA <span className="font-light">OF SHREE</span>
            <span className="mt-1 block text-center text-[9px] tracking-[0.42em]">
              JWELLERY
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
          {cart.length} {cart.length === 1 ? "item" : "items"} in your bag
        </p>

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
            {/* Cart items */}
            <div className="space-y-6">
              {cart.map((item) => (
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
                          disabled={item.quantity <= 1}
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
                          disabled={item.quantity >= item.stock}
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
              ))}
            </div>

            {/* Order summary */}
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
                className="mt-7 block bg-[#3A1A1B] px-6 py-4 text-center text-sm text-[#FFF9F0] transition hover:bg-[#54292A]"
              >
                Proceed to Checkout →
              </Link>

              <p className="mt-4 text-center text-xs leading-5 text-[#806D60]">
                Final pricing, shipping, and stock will be verified at checkout.
              </p>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
