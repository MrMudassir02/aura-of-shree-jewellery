import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";

import SiteNavigation from "@/components/navigation/SiteNavigation";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { categoryUseCases } from "@/server/use-cases/CategoryUseCases";

export const dynamic = "force-dynamic";

const featuredCategories = [
  "earrings",
  "rings",
  "pendants",
  "bracelets",
  "chains",
];

export default async function CategoriesPage() {
  const [categories, session] = await Promise.all([
    categoryUseCases.getCategories(),
    getServerSession(authOptions),
  ]);

  const activeCategories = categories.filter((category) =>
    featuredCategories.includes(category.slug.toLowerCase()),
  );

  const orderedCategories = [
    ...featuredCategories
      .map((slug) =>
        activeCategories.find(
          (category) => category.slug.toLowerCase() === slug,
        ),
      )
      .filter((category) => category !== undefined),
    ...activeCategories.filter(
      (category) => !featuredCategories.includes(category.slug.toLowerCase()),
    ),
  ];

  return (
    <>
      <SiteNavigation
        isLoggedIn={Boolean(session?.user)}
        user={session?.user}
      />

      <main className="min-h-screen bg-[#FAF7F2] text-[#2B1519]">
        <section className="mx-auto max-w-[1440px] px-4 pb-16 pt-12 sm:px-8 sm:pt-16 lg:px-12">
          <div className="mb-10 text-center sm:mb-14">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.32em] text-[#C5A059] sm:text-xs">
              BRILLIANT DESIGNS AND UNPARALLELED CRAFTSMANSHIP
            </p>

            <h1 className="font-serif text-3xl font-bold text-[#6B1D2F] sm:text-5xl">
              Shop by Category
            </h1>

            <div className="mx-auto mt-5 h-0.5 w-20 bg-[#C5A059]" />

            <p className="mx-auto mt-5 max-w-xl text-xs sm:text-sm leading-7 text-[#8A7879]">
              Discover jewellery for every moment, from timeless essentials to
              pieces made to be treasured.
            </p>
          </div>

          {orderedCategories.length === 0 ? (
            <div className="rounded-2xl border border-[#E8DFD5] bg-white px-6 py-16 text-center shadow-xs">
              <h2 className="font-serif text-2xl font-bold text-[#2B1519]">
                Collections coming soon
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-[#8A7879]">
                Add launch categories in your admin panel to display them here.
              </p>
              <Link
                href="/products"
                className="mt-6 inline-block rounded-md bg-[#6B1D2F] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#541524]"
              >
                Shop all jewellery
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 sm:gap-6">
              {orderedCategories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  className="group block rounded-xl border border-[#E8DFD5] bg-white p-3 shadow-2xs transition hover:-translate-y-1 hover:border-[#6B1D2F] hover:shadow-md"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-[#FAF7F2]">
                    {category.imageUrl ? (
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 20vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-3 text-center font-serif text-base text-[#8A7879]">
                        {category.name}
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 transition group-hover:opacity-80" />
                  </div>

                  <div className="pt-3 text-center">
                    <h2 className="font-serif text-sm font-bold text-[#2B1519] transition group-hover:text-[#6B1D2F] sm:text-base">
                      {category.name}
                    </h2>
                    <span className="mt-1 inline-block text-[11px] font-semibold text-[#C5A059] transition group-hover:underline">
                      Explore collection →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-14 text-center">
            <Link
              href="/products"
              className="inline-block rounded-md border border-[#6B1D2F] px-8 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#6B1D2F] transition hover:bg-[#6B1D2F] hover:text-white"
            >
              View all jewellery
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
