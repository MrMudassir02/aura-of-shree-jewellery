import Image from "next/image";
import Link from "next/link";
import { categoryUseCases } from "@/server/use-cases/CategoryUseCases";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await categoryUseCases.getCategories();

  return (
    <main className="min-h-screen bg-[#FFF9F0] px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-[#3A1A1B]">
            Explore
          </p>

          <h1 className="text-4xl font-bold text-[#3A1A1B]">
            Our Collections
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Discover jewellery collections crafted to complement every style
            and occasion.
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="rounded-2xl border border-[#eadfd2] bg-white p-12 text-center">
            <h2 className="text-2xl font-semibold text-[#3A1A1B]">
              Collections coming soon
            </h2>

            <p className="mt-2 text-gray-600">
              Our jewellery collections will appear here once they are added.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-block rounded-lg bg-[#3A1A1B] px-6 py-3 font-semibold text-white"
            >
              Shop All Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-72 bg-[#F5EBDD]">
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      unoptimized
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#3A1A1B]">
                      No Image
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-[#3A1A1B]">
                    {category.name}
                  </h2>

                  {category.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                      {category.description}
                    </p>
                  )}

                  <span className="mt-4 inline-block text-sm font-semibold text-[#3A1A1B]">
                    Explore Collection →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
