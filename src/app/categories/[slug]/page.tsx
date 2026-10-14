import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";

import SiteNavigation from "@/components/navigation/SiteNavigation";
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
    limit: 6,
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <>
      <SiteNavigation isLoggedIn={Boolean(session?.user)} />

      <main className="min-h-screen bg-[#FFF9F0] text-[#2B2020]">
        <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-8 sm:py-14 lg:px-12">
          <Link
            href="/categories"
            className="text-xs uppercase tracking-[0.14em] text-[#806D60] transition hover:text-[#A8752A]"
          >
            ← All collections
          </Link>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#D4B77E]/40 pb-7">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#A8752A] sm:text-xs">
                The collection
              </p>
              <h1 className="mt-3 font-serif text-4xl text-[#3A1A1B] sm:text-6xl">
                {category.name}
              </h1>
              {category.description && (
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[#806D60]">
                  {category.description}
                </p>
              )}
            </div>

            <p className="text-xs uppercase tracking-wider text-[#806D60]">
              {products.length} {products.length === 1 ? "piece" : "pieces"}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 pb-16 sm:px-8 lg:px-12">
          {products.length === 0 ? (
            <div className="border border-[#D4B77E]/30 bg-white px-6 py-16 text-center sm:py-20">
              <h2 className="font-serif text-2xl text-[#3A1A1B] sm:text-3xl">
                New pieces are coming soon
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#806D60]">
                This collection does not have any products available yet.
                Explore the rest of our jewellery in the meantime.
              </p>
              <Link
                href="/products"
                className="mt-7 inline-block bg-[#3A1A1B] px-7 py-3 text-xs uppercase tracking-[0.14em] text-[#FFF9F0] transition hover:bg-[#54292A]"
              >
                Shop all jewellery
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-3">
              {products.map((product) => {
                const imageUrl = product.images?.[0]?.url;

                return (
                  <article key={product.slug} className="group">
                    <Link href={`/products/${product.slug}`} className="block">
                      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-[#F5EBDD]">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            unoptimized
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
                            className="object-cover transition duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-[#806D60]">
                            Image coming soon
                          </div>
                        )}
                      </div>

                      <div className="pt-4">
                        <h2 className="font-serif text-base text-[#3A1A1B] transition group-hover:text-[#A8752A] sm:text-lg">
                          {product.name}
                        </h2>
                        <p className="mt-2 text-sm font-medium text-[#3A1A1B]">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </Link>

                    <p
                      className={`mt-2 text-xs ${
                        product.stock > 0 ? "text-[#806D60]" : "text-red-800"
                      }`}
                    >
                      {product.stock > 0 ? "In stock" : "Out of stock"}
                    </p>
                  </article>
                );
              })}
            </div>
          )}

          <div className="mt-14 flex justify-center">
            <Link
              href="/products"
              className="border border-[#3A1A1B] px-7 py-3 text-xs uppercase tracking-[0.14em] text-[#3A1A1B] transition hover:bg-[#3A1A1B] hover:text-[#FFF9F0]"
            >
              Shop all jewellery
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
