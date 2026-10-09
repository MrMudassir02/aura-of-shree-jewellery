import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { connectDB } from "@/lib/mongodb";
import { Product } from "@/server/models/Product";
import ProductActions from "@/components/products/ProductActions";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  await connectDB();

  const product = await Product.findOne({
    slug,
    isActive: true,
  }).lean();

  if (!product) {
    notFound();
  }

  const image = product.images[0]?.url;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <main className="min-h-screen bg-[#F5EBDD] text-[#2B2020]">
      {/* Header */}
      <header className="border-b border-[#3A1A1B]/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-10">
          <Link
            href="/"
            className="text-xl font-semibold tracking-[0.12em] text-[#3A1A1B] sm:text-2xl"
          >
            AURA <span className="font-light">OF SHREE</span>
            <span className="mt-1 block text-center text-[9px] tracking-[0.42em]">
              JEWELLERY
            </span>
          </Link>

          <Link
            href="/cart"
            className="rounded-full border border-[#3A1A1B]/20 px-4 py-2 text-sm transition hover:bg-[#3A1A1B] hover:text-[#FFF9F0]"
          >
            Bag
          </Link>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-5 py-6 text-sm text-[#806D60] lg:px-10">
        <Link href="/" className="hover:text-[#3A1A1B]">
          Home
        </Link>
        <span className="mx-3">/</span>
        <Link href="/products" className="hover:text-[#3A1A1B]">
          Jewellery
        </Link>
        <span className="mx-3">/</span>
        <span className="text-[#3A1A1B]">{product.name}</span>
      </div>

      {/* Product details */}
      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-20 lg:grid-cols-2 lg:gap-20 lg:px-10">
        {/* Product image */}
        <div className="relative min-h-[350px] overflow-hidden bg-[#FFF9F0] sm:min-h-[550px]">
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
            <div className="flex min-h-[350px] items-center justify-center text-sm text-[#806D60] sm:min-h-[550px]">
              Product image coming soon
            </div>
          )}
        </div>

        {/* Product information */}
        <div className="flex flex-col justify-center py-4 lg:py-10">
          <p className="text-xs uppercase tracking-[0.25em] text-[#967344]">
            Aura of Shree Collection
          </p>

          <h1 className="mt-5 font-serif text-4xl leading-tight text-[#3A1A1B] sm:text-5xl">
            {product.name}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <p className="text-2xl font-medium text-[#3A1A1B]">
              {formatPrice(product.price)}
            </p>

            {product.compareAtPrice &&
              product.compareAtPrice > product.price && (
                <p className="text-lg text-[#806D60] line-through">
                  {formatPrice(product.compareAtPrice)}
                </p>
              )}
          </div>

          <div className="mt-6 h-px bg-[#3A1A1B]/10" />

          <p className="mt-6 whitespace-pre-line text-sm leading-8 text-[#6C5750]">
            {product.description}
          </p>

          <div className="mt-6">
            {product.stock > 0 ? (
              <p className="text-sm text-green-800">In stock</p>
            ) : (
              <p className="text-sm text-red-800">Currently out of stock</p>
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

          <div className="mt-8 border-t border-[#3A1A1B]/10 pt-6">
            <p className="text-xs leading-6 text-[#806D60]">
              Product information and availability are subject to change. Final
              price and stock will be verified during checkout.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
