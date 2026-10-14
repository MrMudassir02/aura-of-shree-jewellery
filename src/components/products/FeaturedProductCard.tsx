"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import QuickAddToBag from "@/components/products/QuickAddToBag";
import { isItemInWishlist, toggleWishlistItem } from "@/lib/wishlist";

type FeaturedProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  stock: number;
  images: string[];
  compareAtPrice?: number | null;
  category?: string;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function FeaturedProductCard({
  product,
}: {
  product: FeaturedProduct;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);

  const images = (product.images || []).filter(
    (image) => typeof image === "string" && image.trim().length > 0,
  );

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

  function handleWishlistToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const updated = toggleWishlistItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: images[0] || "",
      stock: product.stock,
      category: product.category,
    });
    setInWishlist(updated);
  }

  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100,
        )
      : null;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-[#E8DFD5] bg-[#FFFFFF] shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-[#C5A059]/60 hover:shadow-md">
      {/* Product Image Area */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#FAF7F2]">
        <Link
          href={`/products/${product.slug}`}
          aria-label={`View ${product.name}`}
          className="absolute inset-0 z-0"
        >
          {images[activeImage] ? (
            <Image
              src={images[activeImage]}
              alt={product.name}
              fill
              unoptimized
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-[#8A7879]">
              Image coming soon
            </div>
          )}
        </Link>

        {/* Top Badges */}
        <div className="pointer-events-none absolute left-2.5 top-2.5 z-10 flex flex-col gap-1">
          <span className="rounded-sm bg-[#6B1D2F] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-xs">
            18K BIS HALLMARKED
          </span>
          {discount && (
            <span className="rounded-sm bg-[#C5A059] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#2B1519] shadow-xs">
              SAVE {discount}%
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-2.5 top-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#6B1D2F] shadow-sm backdrop-blur-xs transition hover:scale-110 hover:bg-white"
        >
          <svg
            viewBox="0 0 24 24"
            fill={inWishlist ? "#6B1D2F" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4 transition-colors"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>

        {/* Image Dots if multiple */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 z-20 flex justify-center gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`View image ${index + 1}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveImage(index);
                }}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  index === activeImage
                    ? "w-4 bg-[#6B1D2F]"
                    : "w-1.5 bg-black/25 hover:bg-black/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Desktop Quick Add Bar */}
        <div className="absolute inset-x-3 bottom-3 z-20 hidden translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:block">
          <QuickAddToBag
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: images[0] || "",
              stock: product.stock,
            }}
          />
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        {/* Rating and Reviews */}
        <div className="flex items-center gap-1 text-[11px] text-[#C5A059]">
          <span>★★★★★</span>
          <span className="text-[10px] text-[#8A7879]">(4.9)</span>
        </div>

        {/* Name */}
        <h3 className="mt-1 font-serif text-sm font-semibold leading-snug text-[#2B1519] transition group-hover:text-[#6B1D2F] sm:text-base line-clamp-1">
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>

        {/* Price Row */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-semibold text-sm sm:text-base text-[#6B1D2F]">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-xs text-[#9C8B8E] line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        {/* Stock status indicator */}
        <p
          className={`mt-1.5 text-[10px] font-medium uppercase tracking-wider ${
            product.stock > 0 ? "text-[#1A4D2E]" : "text-red-700"
          }`}
        >
          {product.stock > 0 ? "✓ Ready to Ship" : "Made to Order"}
        </p>

        {/* Mobile Quick Add */}
        <div className="mt-3 lg:hidden">
          <QuickAddToBag
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: images[0] || "",
              stock: product.stock,
            }}
          />
        </div>
      </div>
    </article>
  );
}
