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
      setMessage("Added to bag!");
      setTimeout(() => {
        setAdded(false);
        setMessage("");
      }, 2500);
    } catch {
      setMessage("Unable to update bag.");
    }
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={addToBag}
        disabled={outOfStock}
        className="w-full cursor-pointer items-center justify-center rounded-lg border border-[#6B1D2F] bg-[#6B1D2F] py-2.5 px-3 text-xs font-bold tracking-wider uppercase text-white shadow-xs transition-all duration-200 hover:bg-[#541524] hover:border-[#541524] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {outOfStock ? "Out of Stock" : added ? "✓ Added to Bag" : "+ Quick Add"}
      </button>

      {message && (
        <p
          role="status"
          aria-live="polite"
          className="mt-1 text-center text-[11px] font-medium text-[#1A4D2E]"
        >
          {message}
        </p>
      )}
    </div>
  );
}
