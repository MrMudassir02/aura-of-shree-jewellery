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
      <SiteNavigation isLoggedIn={Boolean(session?.user)} />

      <main className="min-h-screen bg-[#FFF9F0] text-[#2B2020]">
        <section className="mx-auto max-w-[1440px] px-4 pb-16 pt-12 sm:px-8 sm:pt-16 lg:px-12">
          <div className="mb-10 text-center sm:mb-14">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.32em] text-[#A8752A] sm:text-xs">
              Brilliant designs and unparalleled craftsmanship
            </p>

            <h1 className="font-serif text-3xl text-[#241718] sm:text-5xl">
              Shop by Category
            </h1>

            <div className="mx-auto mt-5 h-px w-20 bg-[#D4B77E]" />

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#806D60]">
              Discover jewellery for every moment, from timeless essentials to
              pieces made to be treasured.
            </p>
          </div>

          {orderedCategories.length === 0 ? (
            <div className="border border-[#D4B77E]/40 bg-white px-6 py-16 text-center">
              <h2 className="font-serif text-2xl text-[#3A1A1B]">
                Collections coming soon
              </h2>
              <p className="mt-3 text-sm text-[#806D60]">
                Add the five launch categories in your admin panel to display
                them here.
              </p>
              <Link
                href="/products"
                className="mt-6 inline-block bg-[#3A1A1B] px-6 py-3 text-sm text-[#FFF9F0] transition hover:bg-[#54292A]"
              >
                Shop all jewellery
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-5">
              {orderedCategories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#F5EBDD]">
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
                      <div className="flex h-full items-center justify-center px-3 text-center font-serif text-lg text-[#806D60]">
                        {category.name}
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60 transition group-hover:opacity-100" />
                  </div>

                  <div className="pt-3 text-center">
                    <h2 className="font-serif text-base text-[#241718] transition group-hover:text-[#A8752A] sm:text-lg">
                      {category.name}
                    </h2>
                    <span className="mt-1 inline-block border-b border-transparent pb-1 text-xs text-[#806D60] transition group-hover:border-[#A8752A] group-hover:text-[#A8752A]">
                      Explore collection
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-14 text-center">
            <Link
              href="/products"
              className="inline-block border border-[#3A1A1B] px-8 py-3 text-xs uppercase tracking-[0.16em] text-[#3A1A1B] transition hover:bg-[#3A1A1B] hover:text-[#FFF9F0]"
            >
              View all jewellery
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
