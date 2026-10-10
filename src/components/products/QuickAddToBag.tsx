"use client";

import { useState } from "react";

type QuickAddToBagProps = {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    image: string;
    stock: number;
  };
};

type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
};

const CART_KEY = "aura-cart-v1";

export default function QuickAddToBag({ product }: QuickAddToBagProps) {
  const [message, setMessage] = useState("");
  const [added, setAdded] = useState(false);
  const outOfStock = product.stock <= 0;

  function addToBag() {
    if (outOfStock) return;

    try {
      const stored = localStorage.getItem(CART_KEY);
      const parsed: unknown = stored ? JSON.parse(stored) : [];

      if (!Array.isArray(parsed)) {
        setMessage("Unable to read your bag. Please try again.");
        return;
      }

      const cart = parsed as CartItem[];
      const existing = cart.find((item) => item.productId === product.id);

      if (existing) {
        if (existing.quantity + 1 > product.stock) {
          setMessage(`Only ${product.stock} available.`);
          return;
        }

        existing.quantity += 1;
        existing.stock = product.stock;
      } else {
        cart.push({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
          stock: product.stock,
        });
      }

      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      window.dispatchEvent(new Event("cart-updated"));

      setAdded(true);
      setMessage("Added to your bag.");
    } catch {
      setMessage("Unable to update your bag. Please try again.");
    }
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={addToBag}
        disabled={outOfStock}
        className="inline-flex min-h-10 min-w-28 cursor-pointer items-center justify-center rounded-md border border-[#3A1A1B] bg-[#3A1A1B] px-4 py-2 text-xs font-medium tracking-wide text-[#FFF9F0] transition-colors duration-200 hover:border-[#54292A] hover:bg-[#54292A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#967344] disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-9"
      >
        {outOfStock ? "Out of Stock" : added ? "✓ Added to Bag" : "Add to Bag"}
      </button>

      {message && (
        <p
          role="status"
          aria-live="polite"
          className="mt-1 text-xs text-[#806D60]"
        >
          {message}
        </p>
      )}
    </div>
  );
}
