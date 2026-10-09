"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ProductActionsProps = {
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

export default function ProductActions({ product }: ProductActionsProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const isOutOfStock = product.stock <= 0;

  function addToCart(redirectToCart = false) {
    if (isOutOfStock) return;

    try {
      const storedCart = localStorage.getItem(CART_KEY);
      const cart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];

      const existingItem = cart.find((item) => item.productId === product.id);

      if (existingItem) {
        const updatedQuantity = existingItem.quantity + quantity;

        if (updatedQuantity > product.stock) {
          setMessage(`Only ${product.stock} units are currently available.`);
          return;
        }

        existingItem.quantity = updatedQuantity;
      } else {
        cart.push({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
          stock:product.stock,
        });
      }

      localStorage.setItem(CART_KEY, JSON.stringify(cart));

      window.dispatchEvent(new Event("cart-updated"));

      if (redirectToCart) {
        router.push("/cart");
        return;
      }

      setMessage("Added to your bag successfully.");
    } catch {
      setMessage("Unable to update your bag. Please try again.");
    }
  }

  return (
    <div className="mt-8 space-y-5">
      {/* Quantity selector */}
      <div>
        <p className="mb-3 text-sm font-medium text-[#3A1A1B]">Quantity</p>

        <div className="inline-flex items-center border border-[#3A1A1B]/20">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            onClick={() => setQuantity((current) => current - 1)}
            className="px-5 py-3 text-lg text-[#3A1A1B] disabled:opacity-30"
          >
            −
          </button>

          <span className="min-w-12 text-center text-sm">{quantity}</span>

          <button
            type="button"
            aria-label="Increase quantity"
            disabled={quantity >= product.stock}
            onClick={() =>
              setQuantity((current) => Math.min(current + 1, product.stock))
            }
            className="px-5 py-3 text-lg text-[#3A1A1B] disabled:opacity-30"
          >
            +
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={() => addToCart()}
          className="bg-[#3A1A1B] px-6 py-4 text-sm text-[#FFF9F0] transition hover:bg-[#54292A] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isOutOfStock ? "Out of Stock" : "Add to Bag"}
        </button>

        <button
          type="button"
          disabled={isOutOfStock}
          onClick={() => addToCart(true)}
          className="border border-[#3A1A1B]/30 px-6 py-4 text-sm text-[#3A1A1B] transition hover:bg-[#3A1A1B]/5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Buy Now
        </button>
      </div>

      {message && (
        <p role="status" aria-live="polite" className="text-sm text-[#6C5750]">
          {message}
        </p>
      )}
    </div>
  );
}
