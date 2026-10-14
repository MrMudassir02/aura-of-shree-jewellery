import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";

import SiteNavigation from "@/components/navigation/SiteNavigation";
import ProductActions from "@/components/products/ProductActions";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/server/models/Product";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const [{ slug }, session] = await Promise.all([
    params,
    getServerSession(authOptions),
  ]);

  await connectDB();

  const product = await Product.findOne({
    slug,
    isActive: true,
  }).lean();

  if (!product) notFound();

  const image = product.images[0]?.url;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#2B1519]">
      <div className="bg-[#6B1D2F] px-4 py-2 text-center text-[10px] font-semibold tracking-[0.2em] text-[#FAF7F2] sm:text-xs">
        ✨ 100% BIS HALLMARKED GOLD &amp; CERTIFIED SOLITAIRE DIAMONDS | FREE INSURED SHIPPING
      </div>

      <SiteNavigation
        isLoggedIn={Boolean(session?.user)}
        user={session?.user}
      />

      <div className="mx-auto max-w-7xl px-4 py-5 text-xs text-[#8A7879] sm:px-6 lg:px-8">
        <Link href="/" className="hover:text-[#6B1D2F]">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-[#6B1D2F]">
          Jewellery
        </Link>
        <span className="mx-2">/</span>
        <span className="font-semibold text-[#2B1519]">{product.name}</span>
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 rounded-2xl border border-[#E8DFD5] bg-white p-6 shadow-xs lg:grid-cols-2 lg:gap-14 lg:p-10">
          
          {/* Product Gallery View */}
          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#FAF7F2]">
            {image ? (
              <Image
                src={image}
                alt={product.name}
                fill
                priority
                unoptimized
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-[#8A7879]">
                Product image coming soon
              </div>
            )}

            <div className="absolute left-3 top-3 rounded-sm bg-[#6B1D2F] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white">
              18K BIS HALLMARKED
            </div>
          </div>

          {/* Product Details & Actions */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-xs text-[#C5A059]">
              <span>★★★★★</span>
              <span className="text-[11px] text-[#8A7879] font-medium">(4.9/5 from 48 reviews)</span>
            </div>

            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059]">
              Aura of Shree Couture
            </p>

            <h1 className="mt-1 font-serif text-3xl font-bold leading-tight text-[#2B1519] sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-baseline gap-3">
              <span className="font-serif text-3xl font-bold text-[#6B1D2F]">
                {formatPrice(product.price)}
              </span>

              {product.compareAtPrice &&
                product.compareAtPrice > product.price && (
                  <>
                    <span className="text-base text-[#9C8B8E] line-through">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                    <span className="rounded-full bg-[#C5A059]/20 px-2.5 py-0.5 text-xs font-bold text-[#8A631E]">
                      Save{" "}
                      {Math.round(
                        ((product.compareAtPrice - product.price) /
                          product.compareAtPrice) *
                          100,
                      )}
                      %
                    </span>
                  </>
                )}
            </div>

            <p className="mt-1 text-[11px] text-[#8A7879]">
              Inclusive of all taxes &amp; hallmarking charges. Free insured shipping.
            </p>

            <div className="my-6 h-px bg-[#E8DFD5]" />

            <p className="whitespace-pre-line text-xs sm:text-sm leading-7 text-[#524043]">
              {product.description}
            </p>

            <div className="mt-5">
              {product.stock > 0 ? (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#1A4D2E]/10 px-3 py-1 text-xs font-semibold text-[#1A4D2E]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1A4D2E]" />
                  In Stock · Ready to dispatch within 24 hours
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-800" />
                  Currently Out of Stock · Made to Order
                </div>
              )}
            </div>

            <ProductActions
              product={{
                id: String(product._id),
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: image ?? "",
                stock: product.stock,
              }}
            />

            {/* Trust Assurances */}
            <div className="mt-8 grid grid-cols-2 gap-3 border-t border-[#E8DFD5] pt-6">
              <div className="flex items-center gap-2">
                <span className="text-[#C5A059] text-base">🛡️</span>
                <span className="text-[11px] font-semibold text-[#2B1519]">100% Certified Gold &amp; Diamond</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#C5A059] text-base">🚚</span>
                <span className="text-[11px] font-semibold text-[#2B1519]">Complimentary Transit Insurance</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#C5A059] text-base">🔄</span>
                <span className="text-[11px] font-semibold text-[#2B1519]">15-Day Hassle-Free Returns</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#C5A059] text-base">💎</span>
                <span className="text-[11px] font-semibold text-[#2B1519]">Lifetime Exchange Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
