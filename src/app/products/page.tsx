import Link from "next/link";
import { getServerSession } from "next-auth";

import SiteNavigation from "@/components/navigation/SiteNavigation";
import FeaturedProductCard from "@/components/products/FeaturedProductCard";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { productUseCases } from "@/server/use-cases/ProductUseCases";

export const dynamic = "force-dynamic";

type ProductsPageProps = {
  searchParams?: Promise<{
    search?: string;
    category?: string;
    filter?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = searchParams ? await Promise.resolve(searchParams) : {};
  const search = resolvedParams.search?.trim() || "";
  const category = resolvedParams.category?.trim() || "";

  const [products, session] = await Promise.all([
    productUseCases.getProducts({
      limit: 50,
      search: search || undefined,
      category: category || undefined,
    }),
    getServerSession(authOptions),
  ]);

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#2B1519]">
      {/* Top Announcement */}
      <div className="bg-[#6B1D2F] px-4 py-2 text-center text-[11px] font-semibold tracking-[0.2em] text-[#FAF7F2]">
        ✨ COMPLIMENTARY INSURED SHIPPING ON ALL ORDERS | 100% CERTIFIED PURITY
      </div>

      <SiteNavigation
        isLoggedIn={Boolean(session?.user)}
        user={session?.user}
      />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#E8DFD5] pb-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059]">
              Handcrafted Masterpieces
            </p>
            <h1 className="mt-1 font-serif text-3xl font-bold text-[#6B1D2F] sm:text-5xl">
              {search
                ? `Search results for "${search}"`
                : category
                ? `${category.toUpperCase()} Collection`
                : "All Jewellery"}
            </h1>
            <p className="mt-2 max-w-xl text-xs sm:text-sm leading-6 text-[#8A7879]">
              Explore timeless designs handcrafted with 100% BIS hallmarked gold, certified diamonds, and precious gemstones.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[#8A7879]">
              {products.length} {products.length === 1 ? "Product" : "Products"}
            </span>

            {(search || category) && (
              <Link
                href="/products"
                className="rounded-full border border-[#DFD4C7] bg-white px-3 py-1 text-xs font-medium text-[#6B1D2F] shadow-2xs hover:bg-[#FAF7F2]"
              >
                Clear Filters ×
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {products.length === 0 ? (
          <div className="rounded-2xl border border-[#E8DFD5] bg-white px-6 py-20 text-center shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FAF7F2] text-[#6B1D2F]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <h2 className="mt-4 font-serif text-2xl font-bold text-[#2B1519]">
              No jewellery pieces matched your search
            </h2>
            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#8A7879]">
              Try searching with different keywords or explore our complete collections.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-block rounded-md bg-[#6B1D2F] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#541524]"
            >
              Browse All Jewellery
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
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
                  images: (product.images ?? [])
                    .map((image) => image.url)
                    .filter((url): url is string => Boolean(url)),
                }}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
