import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";

import SiteNavigation from "@/components/navigation/SiteNavigation";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { categoryUseCases } from "@/server/use-cases/CategoryUseCases";
import { CORE_CATEGORIES } from "@/server/repositories/CategoryRepository";

export const dynamic = "force-dynamic";

const categoryOrder = [
  "rings",
  "necklaces",
  "earrings",
  "bracelets",
  "pendants",
  "gold-coins",
  "chains",
];

export default async function CategoriesPage() {
  const [categories, session] = await Promise.all([
    categoryUseCases.getCategories(),
    getServerSession(authOptions),
  ]);

  // Map and merge database categories with core categories
  const categoriesBySlug = new Map(
    categories.map((c) => [c.slug.toLowerCase(), c]),
  );

  const displayCategories = categoryOrder.map((slug) => {
    const fromDb = categoriesBySlug.get(slug);
    const core = CORE_CATEGORIES[slug];

    return {
      name: fromDb?.name || core?.name || slug,
      slug,
      description: fromDb?.description || core?.description || "",
      imageUrl: fromDb?.imageUrl || core?.imageUrl || "",
    };
  });

  return (
    <>
      <SiteNavigation
        isLoggedIn={Boolean(session?.user)}
        user={session?.user}
      />

      <main className="min-h-screen bg-[#FAF7F2] text-[#2B1519]">
        <section className="mx-auto max-w-[1440px] px-4 pb-16 pt-8 sm:px-8 sm:pt-14 lg:px-12">
          {/* Header */}
          <div className="mb-10 text-center sm:mb-14">
            <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A059] sm:text-xs">
              BRILLIANT CRAFTSMANSHIP &amp; TIMELESS HEIRLOOMS
            </span>

            <h1 className="font-serif text-3xl font-bold text-[#6B1D2F] sm:text-5xl">
              Shop by Category
            </h1>

            <div className="mx-auto mt-4 h-0.5 w-16 bg-[#C5A059]" />

            <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm leading-6 text-[#524043]">
              From everyday solitaire rings and 24K gold investment coins to lavish bridal necklaces, discover
              pieces handcrafted for every milestone.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
            {displayCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="group block rounded-2xl border border-[#E8DFD5] bg-white p-3 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-[#6B1D2F] hover:shadow-md"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#FAF7F2]">
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover transition duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-3 text-center font-serif text-base text-[#8A7879]">
                      {category.name}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-70 transition group-hover:opacity-85" />

                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <p className="font-serif text-base font-bold sm:text-lg">
                      {category.name}
                    </p>
                    <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-[#E8D09E] transition group-hover:translate-x-0.5">
                      <span>Explore collection</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>

                <div className="p-2">
                  <p className="line-clamp-2 text-xs text-[#8A7879] leading-5">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/products"
              className="inline-block rounded-xl border border-[#6B1D2F] bg-[#6B1D2F] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-xs transition hover:bg-[#541524]"
            >
              Browse All Jewellery →
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
