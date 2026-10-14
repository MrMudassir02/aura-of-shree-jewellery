"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isItemInWishlist, toggleWishlistItem } from "@/lib/wishlist";

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
  const [inWishlist, setInWishlist] = useState(false);

  const stock = Math.max(0, Math.floor(product.stock));
  const isOutOfStock = stock <= 0;

  useEffect(() => {
    queueMicrotask(() => {
      setInWishlist(isItemInWishlist(product.id));
    });

    const handleWishlistUpdate = () => {
      setInWishlist(isItemInWishlist(product.id));
    };

    window.addEventListener("wishlist-updated", handleWishlistUpdate);
    return () => {
      window.removeEventListener("wishlist-updated", handleWishlistUpdate);
    };
  }, [product.id]);

  function handleWishlistToggle() {
    const updated = toggleWishlistItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
    });
    setInWishlist(updated);
  }

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

      setMessage("Added to your shopping bag successfully.");
      setTimeout(() => setMessage(""), 3500);
    } catch {
      setMessage("Unable to update your bag. Please try again.");
    }
  }

  return (
    <div className="mt-8 space-y-5">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#2B1519]">
          Quantity
        </p>

        <div className="inline-flex items-center rounded-lg border border-[#DFD4C7] bg-white">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            className="px-4 py-2 text-base text-[#2B1519] disabled:opacity-30"
          >
            −
          </button>

          <span className="min-w-10 text-center text-xs font-semibold">
            {quantity}
          </span>

          <button
            type="button"
            aria-label="Increase quantity"
            disabled={quantity >= stock}
            onClick={() =>
              setQuantity((current) => Math.min(current + 1, stock))
            }
            className="px-4 py-2 text-base text-[#2B1519] disabled:opacity-30"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={() => addToCart()}
          className="flex-1 rounded-md bg-[#6B1D2F] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#541524] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isOutOfStock ? "Out of Stock" : "Add to Bag"}
        </button>

        <button
          type="button"
          disabled={isOutOfStock}
          onClick={() => addToCart(true)}
          className="flex-1 rounded-md border border-[#6B1D2F] bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#6B1D2F] shadow-2xs transition hover:bg-[#FAF7F2] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Buy Now
        </button>

        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={inWishlist ? "Saved in wishlist" : "Add to wishlist"}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-[#DFD4C7] bg-white transition hover:border-[#6B1D2F] ${
            inWishlist ? "text-[#6B1D2F]" : "text-[#8A7879]"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill={inWishlist ? "#6B1D2F" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
      </div>

      {message && (
        <p
          role="status"
          aria-live="polite"
          className="rounded-lg bg-[#FAF7F2] p-2.5 text-xs font-medium text-[#1A4D2E]"
        >
          {message}
        </p>
      )}
    </div>
  );
}
