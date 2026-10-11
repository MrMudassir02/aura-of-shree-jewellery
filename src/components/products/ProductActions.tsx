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

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;

  const item = value as Record<string, unknown>;

  return (
    typeof item.productId === "string" &&
    typeof item.slug === "string" &&
    typeof item.name === "string" &&
    typeof item.price === "number" &&
    Number.isFinite(item.price) &&
    typeof item.image === "string" &&
    typeof item.quantity === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0 &&
    typeof item.stock === "number" &&
    Number.isInteger(item.stock) &&
    item.stock >= 0
  );
}

export default function ProductActions({ product }: ProductActionsProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const stock = Math.max(0, Math.floor(product.stock));
  const isOutOfStock = stock <= 0;

  function addToCart(redirectToCart = false) {
    if (isOutOfStock) {
      setMessage("This item is currently out of stock.");
      return;
    }

    try {
      const stored = localStorage.getItem(CART_KEY);
      const parsed: unknown = stored ? JSON.parse(stored) : [];

      if (!Array.isArray(parsed) || !parsed.every(isCartItem)) {
        setMessage(
          "Your saved bag could not be read. Please clear the invalid bag and try again.",
        );
        return;
      }

      const cart: CartItem[] = [...parsed];
      const existingItem = cart.find((item) => item.productId === product.id);

      if (existingItem) {
        const updatedQuantity = existingItem.quantity + quantity;

        if (updatedQuantity > stock) {
          setMessage(`Only ${stock} unit(s) are currently available.`);
          return;
        }

        existingItem.quantity = updatedQuantity;
        existingItem.stock = stock;
        existingItem.price = product.price;
        existingItem.name = product.name;
        existingItem.slug = product.slug;
        existingItem.image = product.image;
      } else {
        cart.push({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
          stock,
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
      <div>
        <p className="mb-3 text-sm font-medium text-[#3A1A1B]">Quantity</p>

        <div className="inline-flex items-center border border-[#3A1A1B]/20">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            className="px-5 py-3 text-lg text-[#3A1A1B] disabled:opacity-30"
          >
            −
          </button>

          <span className="min-w-12 text-center text-sm">{quantity}</span>

          <button
            type="button"
            aria-label="Increase quantity"
            disabled={quantity >= stock}
            onClick={() =>
              setQuantity((current) => Math.min(current + 1, stock))
            }
            className="px-5 py-3 text-lg text-[#3A1A1B] disabled:opacity-30"
          >
            +
          </button>
        </div>
      </div>

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
