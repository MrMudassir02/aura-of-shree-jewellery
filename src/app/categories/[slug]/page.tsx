import Link from "next/link";
import { getServerSession } from "next-auth";

import SiteNavigation from "@/components/navigation/SiteNavigation";
import FeaturedProductCard from "@/components/products/FeaturedProductCard";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { categoryUseCases } from "@/server/use-cases/CategoryUseCases";
import { productUseCases } from "@/server/use-cases/ProductUseCases";

export const dynamic = "force-dynamic";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

// All available categories for the dynamic switcher tabs
const categoryTabs = [
  { slug: "all", name: "All Jewels", href: "/products" },
  { slug: "rings", name: "Rings", href: "/categories/rings" },
  { slug: "necklaces", name: "Necklaces", href: "/categories/necklaces" },
  { slug: "earrings", name: "Earrings", href: "/categories/earrings" },
  { slug: "bracelets", name: "Bracelets", href: "/categories/bracelets" },
  { slug: "pendants", name: "Pendants", href: "/categories/pendants" },
  { slug: "gold-coins", name: "Gold Coins", href: "/categories/gold-coins" },
  { slug: "chains", name: "Chains", href: "/categories/chains" },
];

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const cleanSlug = slug.toLowerCase().trim();

  const [category, session] = await Promise.all([
    categoryUseCases.getCategoryBySlug(cleanSlug),
    getServerSession(authOptions),
  ]);

  // Fallback category object in case of unexpected null
  const activeCategory = category || {
    _id: cleanSlug,
    name: cleanSlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    slug: cleanSlug,
    description: "Explore our collection of handcrafted luxury jewellery.",
  };

  const categoryId = activeCategory._id ? String(activeCategory._id) : cleanSlug;

  const products = await productUseCases.getProducts({
    category: categoryId,
    limit: 24,
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2B1519]">
      {/* Top Announcement Bar */}
      <div className="bg-[#6B1D2F] px-4 py-2 text-center text-[10px] sm:text-xs font-semibold tracking-[0.18em] text-[#FAF7F2] overflow-hidden whitespace-nowrap">
        ✨ 100% BIS HALLMARKED 22K GOLD &amp; IGI CERTIFIED DIAMONDS | FREE INSURED DELIVERY
      </div>

      <SiteNavigation
        isLoggedIn={Boolean(session?.user)}
        user={session?.user}
      />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#8A7879]">
          <Link href="/" className="hover:text-[#6B1D2F] transition">
            Home
          </Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-[#6B1D2F] transition">
            Categories
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#2B1519]">{activeCategory.name}</span>
        </nav>

        {/* Category Switcher Tabs / Pills Bar */}
        <div className="mt-5 mb-8">
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#C5A059] font-bold mb-2.5">
            Switch Category
          </p>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            {categoryTabs.map((tab) => {
              const isCurrent = tab.slug === cleanSlug;
              return (
                <Link
                  key={tab.slug}
                  href={tab.href}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition duration-150 active:scale-95 shadow-2xs ${
                    isCurrent
                      ? "bg-[#6B1D2F] text-white ring-2 ring-[#6B1D2F] shadow-xs"
                      : "bg-white text-[#524043] border border-[#E8DFD5] hover:border-[#6B1D2F] hover:text-[#6B1D2F] hover:bg-[#FAF7F2]"
                  }`}
                >
                  {tab.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Collection Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#E8DFD5] pb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059] sm:text-xs">
              THE ATELIER COLLECTION
            </span>
            <h1 className="mt-1 font-serif text-3xl font-bold text-[#6B1D2F] sm:text-5xl">
              {activeCategory.name}
            </h1>
            {activeCategory.description && (
              <p className="mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-[#524043]">
                {activeCategory.description}
              </p>
            )}
          </div>

          <div className="rounded-full bg-white border border-[#E8DFD5] px-4 py-1.5 text-xs font-semibold text-[#6B1D2F] shadow-2xs">
            {products.length} {products.length === 1 ? "Piece" : "Pieces"} Available
          </div>
        </div>

        {/* Products Grid or Empty State */}
        <section className="py-8">
          {products.length === 0 ? (
            <div className="rounded-2xl border border-[#E8DFD5] bg-white px-6 py-16 text-center shadow-xs">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FAF7F2] text-xl text-[#C5A059]">
                ◇
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#2B1519]">
                New {activeCategory.name} arriving soon
              </h2>
              <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm leading-6 text-[#8A7879]">
                Our master artisans are handcrafting new additions for this collection.
                Explore our other jewellery families or visit the full catalogue.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/products"
                  className="rounded-xl bg-[#6B1D2F] px-7 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#541524]"
                >
                  Browse Full Catalogue
                </Link>
                <Link
                  href="/categories"
                  className="rounded-xl border border-[#DFD4C7] bg-[#FAF7F2] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#2B1519] transition hover:bg-white hover:border-[#6B1D2F]"
                >
                  All Categories
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
              {products.map((product) => (
                <FeaturedProductCard
                  key={String(product._id)}
                  product={{
                    id: String(product._id),
                    slug: product.slug,
                    name: product.name,
                    price: product.price,
                    compareAtPrice: product.compareAtPrice,
                    stock: product.stock,
                    category: activeCategory.name,
                    images: (product.images ?? [])
                      .map((image) => image.url)
                      .filter((url): url is string => Boolean(url)),
                  }}
                />
              ))}
            </div>
          )}

          {/* Quick Footer Links */}
          <div className="mt-14 pt-8 border-t border-[#E8DFD5] flex flex-wrap items-center justify-between gap-4 text-xs text-[#8A7879]">
            <Link
              href="/categories"
              className="font-semibold text-[#6B1D2F] hover:underline"
            >
              ← Back to All Categories
            </Link>
            <Link
              href="/products"
              className="font-semibold text-[#6B1D2F] hover:underline"
            >
              Explore Full Collection →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
