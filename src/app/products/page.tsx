import Link from "next/link";
import { getServerSession } from "next-auth";

import SiteNavigation from "@/components/navigation/SiteNavigation";
import FeaturedProductCard from "@/components/products/FeaturedProductCard";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { productUseCases } from "@/server/use-cases/ProductUseCases";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const [products, session] = await Promise.all([
    productUseCases.getProducts({ limit: 50 }),
    getServerSession(authOptions),
  ]);

  return (
    <main className="min-h-screen bg-[#F5EBDD] text-[#2B2020]">
      <div className="bg-[#F5EBDD] px-4 py-2.5 text-center text-[10px] tracking-[0.2em] text-[#3A1A1B] sm:text-xs">
        A LITTLE LUXURY, MADE FOR YOU
      </div>

      <SiteNavigation isLoggedIn={Boolean(session?.user)} variant="minimal" />

      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-10 lg:py-16">
        <p className="text-xs uppercase tracking-[0.3em] text-[#967344]">
          Discover your favorites
        </p>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl text-[#3A1A1B] sm:text-6xl">
              All Jewellery
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#806D60]">
              Explore timeless designs and find the pieces that feel uniquely
              yours.
            </p>
          </div>

          <p className="text-sm text-[#806D60]">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-10">
        {products.length === 0 ? (
          <div className="bg-[#FFF9F0] px-6 py-20 text-center">
            <h2 className="font-serif text-3xl text-[#3A1A1B]">
              Your collection is on its way
            </h2>
            <p className="mt-4 text-sm text-[#806D60]">
              No products are available right now. Please check back soon.
            </p>
            <Link
              href="/"
              className="mt-8 inline-block bg-[#3A1A1B] px-7 py-4 text-sm text-[#FFF9F0] transition hover:bg-[#54292A]"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
            {products.map((product) => (
              <FeaturedProductCard
                key={String(product._id)}
                product={{
                  id: String(product._id),
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
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
