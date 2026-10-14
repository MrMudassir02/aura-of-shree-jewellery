"use client";

export type WishlistItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  category?: string;
};

const WISHLIST_KEY = "aura-wishlist-v1";

export function getWishlistItems(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getWishlistCount(): number {
  return getWishlistItems().length;
}

export function isItemInWishlist(productId: string): boolean {
  const items = getWishlistItems();
  return items.some((item) => item.productId === productId);
}

export function toggleWishlistItem(item: WishlistItem): boolean {
  if (typeof window === "undefined") return false;
  try {
    const items = getWishlistItems();
    const index = items.findIndex((i) => i.productId === item.productId);
    let added = false;
    if (index >= 0) {
      items.splice(index, 1);
      added = false;
    } else {
      items.push(item);
      added = true;
    }
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("wishlist-updated"));
    return added;
  } catch {
    return false;
  }
}

export function removeWishlistItem(productId: string): void {
  if (typeof window === "undefined") return;
  try {
    const items = getWishlistItems();
    const filtered = items.filter((i) => i.productId !== productId);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event("wishlist-updated"));
  } catch {
    // ignore
  }
}

