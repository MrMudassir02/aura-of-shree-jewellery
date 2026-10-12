import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";

import SiteNavigation from "@/components/navigation/SiteNavigation";
import FeaturedProductCard from "@/components/products/FeaturedProductCard";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { productUseCases } from "@/server/use-cases/ProductUseCases";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getServerSession(authOptions);

  const products = await productUseCases.getProducts({
    limit: 4,
  });

  return (
    <main className="min-h-screen bg-[#F5EBDD] text-[#2B2020]">
      {/* Announcement */}
      <div className="bg-[#F5EBDD] px-4 py-2.5 text-center text-[10px] tracking-[0.2em] text-[#3A1A1B] sm:text-xs">
        A LITTLE LUXURY, MADE FOR YOU
      </div>

      <SiteNavigation isLoggedIn={Boolean(session?.user)} />

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:py-16 lg:grid-cols-2 lg:px-10 lg:py-20">
        <div className="max-w-xl">
          <p className="mb-5 text-xs uppercase tracking-[0.3em] text-[#967344]">
            Jewelry that feels like you
          </p>

          <h1 className="font-serif text-5xl leading-[1.12] tracking-tight text-[#3A1A1B] sm:text-6xl lg:text-7xl">
            A little
            <br />
            sparkle.
            <br />
            <span className="italic">A lot of soul.</span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-7 text-[#6C5750]">
            Discover thoughtfully chosen jewelry that celebrates your
            individuality, your moments, and your everyday elegance.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="bg-[#3A1A1B] px-7 py-4 text-sm tracking-wide text-[#FFF9F0] transition hover:bg-[#54292A]"
            >
              Explore Collection →
            </Link>

            <Link
              href="/categories"
              className="border border-[#3A1A1B]/25 px-7 py-4 text-sm text-[#3A1A1B] transition hover:bg-[#3A1A1B]/5"
            >
              Discover More
            </Link>
          </div>

          <div className="mt-12 flex gap-8 border-t border-[#3A1A1B]/15 pt-6">
            <div>
              <p className="font-serif text-2xl text-[#3A1A1B]">Timeless</p>
              <p className="mt-1 text-xs text-[#806D60]">Designs</p>
            </div>

            <div>
              <p className="font-serif text-2xl text-[#3A1A1B]">Made</p>
              <p className="mt-1 text-xs text-[#806D60]">For your moments</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-3 border border-[#B89A63]/40" />

          <div className="relative h-[400px] overflow-hidden sm:h-[520px]">
            <Image
              src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1400&q=90"
              alt="Elegant jewelry from the signature collection"
              fill
              priority
              unoptimized
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute bottom-5 left-5 bg-[#FFF9F0]/95 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#967344]">
                The signature collection
              </p>
              <p className="mt-1 font-serif text-xl text-[#3A1A1B]">
                Elegance in every detail
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-[#FFF9F0] px-5 py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#967344]">
                Handpicked for you
              </p>
              <h2 className="mt-3 font-serif text-4xl text-[#3A1A1B] sm:text-5xl">
                The collection
              </h2>
            </div>

            <Link
              href="/products"
              className="text-sm text-[#3A1A1B] underline underline-offset-4 transition hover:text-[#967344]"
            >
              Shop all jewelry →
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="bg-[#F5EBDD] px-6 py-20 text-center">
              <h3 className="font-serif text-3xl text-[#3A1A1B]">
                Our collection is coming soon
              </h3>
              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#806D60]">
                New jewelry pieces will appear here as they are added to the
                Aura of Shree collection.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4">
              {products.map((product) => (
                <FeaturedProductCard
                  key={product.slug}
                  product={{
                    id: String(product._id),
                    slug: product.slug,
                    name: product.name,
                    price: product.price,
                    stock: product.stock,
                    images: (product.images ?? []).map((image) => image.url),
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Brand Story */}
      <section className="bg-[#3A1A1B] px-5 py-16 text-[#F5EBDD] lg:px-10 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#D4B77E]">
              The Aura of Shree experience
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
              More than jewelry.
              <br />
              <span className="italic text-[#D4B77E]">A feeling.</span>
            </h2>

            <p className="mt-6 max-w-lg leading-8 text-[#E4D4C4]">
              Every piece tells a story. From everyday essentials to pieces that
              make your special moments unforgettable, discover jewelry that
              feels uniquely yours.
            </p>

            <Link
              href="/about"
              className="mt-8 inline-block border border-[#D4B77E]/60 px-7 py-4 text-sm transition hover:bg-[#F5EBDD] hover:text-[#3A1A1B]"
            >
              Discover Our Story →
            </Link>
          </div>

          <div className="relative h-[350px] sm:h-[450px]">
            <Image
              src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1200&q=85"
              alt="Jewelry detail representing the Aura of Shree collection"
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-[#EDE0CE] px-5 py-16 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-[#967344]">
          A note from us
        </p>
        <h2 className="mt-4 font-serif text-3xl text-[#3A1A1B] sm:text-4xl">
          A little love, delivered.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#806D60]">
          Discover new arrivals, special collections, and little moments of
          inspiration from Aura of Shree.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-[#3A1A1B] px-5 py-12 text-[#F5EBDD] lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="font-serif text-2xl tracking-wider">
              AURA OF SHREE
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-[#D7C4B3]">
              Jewelry that celebrates your individuality and your moments.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Explore</h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-[#D7C4B3]">
              <Link
                href="/products"
                className="transition hover:text-[#F5EBDD]"
              >
                Shop All
              </Link>
              <Link
                href="/categories"
                className="transition hover:text-[#F5EBDD]"
              >
                Collections
              </Link>
              <Link href="/about" className="transition hover:text-[#F5EBDD]">
                Our Story
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Customer Care</h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-[#D7C4B3]">
              <Link href="/contact" className="transition hover:text-[#F5EBDD]">
                Contact Us
              </Link>
              <Link
                href="/shipping"
                className="transition hover:text-[#F5EBDD]"
              >
                Shipping &amp; Returns
              </Link>
              <Link href="/privacy" className="transition hover:text-[#F5EBDD]">
                Privacy Policy
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Stay Connected</h3>
            <p className="mt-4 text-sm leading-6 text-[#D7C4B3]">
              Follow our journey and discover your next favorite piece.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-7xl border-t border-white/15 pt-6 text-center text-xs text-[#D7C4B3]">
          © {new Date().getFullYear()} Aura of Shree Jewellery. All rights
          reserved.
        </div>
      </footer>
    </main>
  );
}
