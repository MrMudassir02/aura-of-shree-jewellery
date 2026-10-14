import Link from "next/link";
import { notFound } from "next/navigation";
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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const [category, session] = await Promise.all([
    categoryUseCases.getCategoryBySlug(slug),
    getServerSession(authOptions),
  ]);

  if (!category) {
    notFound();
  }

  const products = await productUseCases.getProducts({
    category: category._id.toString(),
    limit: 20,
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2B1519]">
      <div className="bg-[#6B1D2F] px-4 py-2 text-center text-[10px] font-semibold tracking-[0.2em] text-[#FAF7F2] sm:text-xs">
        ✨ 100% BIS HALLMARKED 22K GOLD &amp; IGI CERTIFIED DIAMONDS | FREE INSURED DELIVERY
      </div>

      <SiteNavigation
        isLoggedIn={Boolean(session?.user)}
        user={session?.user}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/categories"
          className="text-xs font-semibold uppercase tracking-wider text-[#8A7879] transition hover:text-[#6B1D2F]"
        >
          ← All Collections
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-b border-[#E8DFD5] pb-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059] sm:text-xs">
              THE COLLECTION
            </p>
            <h1 className="mt-1 font-serif text-3xl font-bold text-[#6B1D2F] sm:text-5xl">
              {category.name}
            </h1>
            {category.description && (
              <p className="mt-2 max-w-2xl text-xs sm:text-sm leading-6 text-[#8A7879]">
                {category.description}
              </p>
            )}
          </div>

          <p className="text-xs font-semibold text-[#8A7879]">
            {products.length} {products.length === 1 ? "Piece" : "Pieces"} Available
          </p>
        </div>

        <section className="py-8">
          {products.length === 0 ? (
            <div className="rounded-2xl border border-[#E8DFD5] bg-white px-6 py-20 text-center shadow-xs">
              <h2 className="font-serif text-2xl font-bold text-[#2B1519]">
                New pieces arriving soon
              </h2>
              <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#8A7879]">
                We are curating exquisite new additions for this collection. Explore our complete jewellery catalogue in the meantime.
              </p>
              <Link
                href="/products"
                className="mt-6 inline-block rounded-md bg-[#6B1D2F] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#541524]"
              >
                Browse All Jewellery
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
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

          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-block rounded-md border border-[#6B1D2F] px-8 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#6B1D2F] transition hover:bg-[#6B1D2F] hover:text-white"
            >
              Explore Full Collection →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
