import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";

import SiteNavigation from "@/components/navigation/SiteNavigation";
import FeaturedProductCard from "@/components/products/FeaturedProductCard";
import NewsletterSubscription from "@/components/home/NewsletterSubscription";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { productUseCases } from "@/server/use-cases/ProductUseCases";

export const dynamic = "force-dynamic";

const categoryHighlights = [
  {
    name: "Rings",
    slug: "rings",
    subtitle: "Solitaire & Cocktail",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Necklaces",
    slug: "necklaces",
    subtitle: "Chokers & Heritage Sets",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Earrings",
    slug: "earrings",
    subtitle: "Jhumkas, Drops & Studs",
    image:
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Bracelets",
    slug: "bracelets",
    subtitle: "Kadas & Tennis Bangles",
    image:
      "https://images.unsplash.com/photo-1611591475806-037140e6955a?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Pendants",
    slug: "pendants",
    subtitle: "Spiritual & Modern",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Gold Coins",
    slug: "gold-coins",
    subtitle: "24K 999 Investment Coins",
    image:
      "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80",
  },
];

// Curated backup products if DB is empty or has few items
const fallbackShowcaseProducts = [
  {
    id: "fb-1",
    slug: "royal-kundan-solitaire-ring",
    name: "Royal Heritage Solitaire Ring",
    price: 34999,
    compareAtPrice: 42999,
    stock: 5,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "fb-2",
    slug: "divine-bloom-diamond-necklace",
    name: "Divine Bloom Diamond Necklace",
    price: 89999,
    compareAtPrice: 105000,
    stock: 3,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "fb-3",
    slug: "celestial-cascade-drop-earrings",
    name: "Celestial Cascade Drop Earrings",
    price: 24500,
    compareAtPrice: 29000,
    stock: 8,
    images: [
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "fb-4",
    slug: "imperial-carat-gold-bangle",
    name: "Imperial 22K Gold Bangle",
    price: 68500,
    compareAtPrice: 76000,
    stock: 4,
    images: [
      "https://images.unsplash.com/photo-1611591475806-037140e6955a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80",
    ],
  },
];

const customerReviews = [
  {
    name: "Ananya Deshmukh",
    city: "Mumbai",
    rating: 5,
    text: "The finish and weight of the Royal Solitaire Ring exceeded my expectations! The BIS hallmark certificate came right inside the velvet box. It feels like wearing pure royalty.",
    piece: "Royal Heritage Solitaire Ring",
  },
  {
    name: "Radhika Mehra",
    city: "New Delhi",
    rating: 5,
    text: "Ordered my wedding reception necklace from Aura of Shree. The craftsmanship is flawless, customer support was so attentive, and insured delivery arrived in 48 hours.",
    piece: "Divine Bloom Diamond Necklace",
  },
  {
    name: "Pooja Venkatesh",
    city: "Bengaluru",
    rating: 5,
    text: "Every piece I've bought from Aura of Shree carries a distinct grace. The gold purity and diamond brilliance get compliments everywhere I go. 10/10 recommended!",
    piece: "Celestial Cascade Drop Earrings",
  },
];

export default async function Home() {
  const session = await getServerSession(authOptions);

  const dbProducts = await productUseCases.getProducts({
    limit: 8,
  });

  const displayProducts =
    dbProducts.length > 0
      ? dbProducts.map((p) => ({
          id: String(p._id),
          slug: p.slug,
          name: p.name,
          price: p.price,
          compareAtPrice: p.compareAtPrice,
          stock: p.stock,
          images: (p.images ?? [])
            .map((img) => img.url)
            .filter((url): url is string => Boolean(url)),
        }))
      : fallbackShowcaseProducts;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2B1519]">
      {/* Top Announcement Bar */}
      <div className="bg-[#6B1D2F] px-3 py-1.5 text-center text-[10px] sm:text-xs font-medium tracking-[0.16em] text-[#FAF7F2] overflow-hidden whitespace-nowrap">
        <span className="opacity-95">
          ✨ Complimentary Insured Delivery Across India · 100% BIS Hallmarked 22K Gold &amp; Certified Solitaires
        </span>
      </div>

      {/* Modern Two-Tier Navbar */}
      <SiteNavigation
        isLoggedIn={Boolean(session?.user)}
        user={session?.user}
      />

      {/* Mobile Visual Hero Banner Card (Exact AI Sports Experience) */}
      <div className="block md:hidden px-3 pt-3 pb-1">
        <div className="relative aspect-[4/5] max-h-[500px] w-full overflow-hidden rounded-2xl shadow-md">
          <Image
            src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=85"
            alt="Signature Diamond and Gold Jewellery"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

          <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col items-start text-white">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 px-3 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#E8D09E]">
              ✨ Festive &amp; Bridal 2024
            </span>

            <h1 className="mt-2.5 font-serif text-3xl font-normal leading-tight text-white drop-shadow-sm">
              Own your
              <br />
              <span className="italic font-light text-[#E8D09E]">next forever.</span>
            </h1>

            <p className="mt-2 text-xs leading-relaxed text-white/80 max-w-xs">
              Handcrafted in 100% BIS hallmarked 22K gold &amp; certified natural solitaires.
            </p>

            <div className="mt-4 w-full">
              <Link
                href="/products"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#C5A059] py-3 px-5 text-xs font-bold text-[#2B1519] shadow-md transition active:scale-95 hover:bg-[#D4AF67]"
              >
                <span>Shop jewellery collection</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Hero Section */}
      <section className="hidden md:block relative overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-[#FFFDFB] to-[#FAF7F2] py-10 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/40 bg-[#FFFDFB] px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#C5A059] shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#6B1D2F]" />
              FESTIVE &amp; BRIDAL COUTURE 2024
            </div>

            <h1 className="mt-5 font-serif text-4xl font-normal leading-[1.12] tracking-tight text-[#2B1519] sm:text-5xl lg:text-6xl">
              Timeless Elegance.
              <br />
              <span className="font-light italic text-[#6B1D2F]">
                Crafted For Your Forever.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-[#524043] sm:text-base">
              Celebrate your milestones with handcrafted jewellery in 100% BIS
              hallmarked gold, ethically sourced solitaire diamonds, and precious gemstones
              designed to become family heirlooms.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-md bg-[#6B1D2F] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#541524] active:scale-95"
              >
                <span>Explore Collections</span>
                <span className="text-base leading-none">→</span>
              </Link>

              <Link
                href="/categories"
                className="inline-flex items-center gap-2 rounded-md border border-[#DFD4C7] bg-white px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-[#2B1519] shadow-2xs transition hover:border-[#6B1D2F] hover:bg-[#F9EFF1]"
              >
                <span>Shop by Category</span>
              </Link>
            </div>

            {/* Trust Badges Bar */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-[#E8DFD5] pt-8">
              <div>
                <p className="font-serif text-2xl font-bold text-[#6B1D2F]">50k+</p>
                <p className="mt-0.5 text-xs font-medium text-[#8A7879]">
                  Happy Clients
                </p>
              </div>

              <div>
                <p className="font-serif text-2xl font-bold text-[#6B1D2F]">100%</p>
                <p className="mt-0.5 text-xs font-medium text-[#8A7879]">
                  BIS Hallmarked
                </p>
              </div>

              <div>
                <p className="font-serif text-2xl font-bold text-[#6B1D2F]">4.9★</p>
                <p className="mt-0.5 text-xs font-medium text-[#8A7879]">
                  Verified Rating
                </p>
              </div>
            </div>
          </div>

          {/* Right Hero Visual */}
          <div className="relative lg:col-span-5">
            <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-2xl border-4 border-white shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=85"
                alt="Signature Diamond and Gold Jewellery"
                fill
                priority
                unoptimized
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Floating Badge */}
              <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/40 bg-white/95 p-4 shadow-lg backdrop-blur-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059]">
                      SIGNATURE EDIT
                    </span>
                    <h3 className="font-serif text-base font-bold text-[#2B1519]">
                      The Royal Solitaire Set
                    </h3>
                  </div>
                  <span className="rounded-full bg-[#6B1D2F] px-3 py-1 text-[11px] font-bold text-white">
                    ₹34,999
                  </span>
                </div>
              </div>
            </div>

            {/* Decorative Gold Rings */}
            <div className="pointer-events-none absolute -bottom-6 -right-6 -z-10 h-64 w-64 rounded-full border border-[#C5A059]/30" />
            <div className="pointer-events-none absolute -left-6 -top-6 -z-10 h-48 w-48 rounded-full border border-[#C5A059]/20" />
          </div>
        </div>
      </section>

      {/* Trust Elements Bar */}
      <section className="border-y border-[#E8DFD5] bg-white py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FAF7F2] text-[#6B1D2F]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2B1519]">
                100% Certified
              </h4>
              <p className="text-[11px] text-[#8A7879]">
                BIS Hallmarked &amp; IGI Diamonds
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FAF7F2] text-[#6B1D2F]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2B1519]">
                Insured Shipping
              </h4>
              <p className="text-[11px] text-[#8A7879]">
                Complimentary &amp; Discreet Delivery
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FAF7F2] text-[#6B1D2F]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 16H3v5" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2B1519]">
                15-Day Exchange
              </h4>
              <p className="text-[11px] text-[#8A7879]">
                Hassle-Free Returns &amp; Money-back
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FAF7F2] text-[#6B1D2F]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2B1519]">
                Lifetime Buyback
              </h4>
              <p className="text-[11px] text-[#8A7879]">
                Assured Gold Market Valuation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop By Category */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059] sm:text-xs">
              EXPLORE OUR MASTERPIECES
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-[#2B1519] sm:text-4xl">
              Shop by Category
            </h2>
            <div className="mx-auto mt-4 h-0.5 w-16 bg-[#C5A059]" />
            <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm text-[#8A7879]">
              From everyday minimalist sparkle to lavish wedding adornments, discover
              pieces curated for every celebration.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 sm:gap-6">
            {categoryHighlights.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-[#E8DFD5] bg-white p-2.5 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-[#6B1D2F] hover:shadow-md"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#FAF7F2]">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-40 group-hover:opacity-70 transition-opacity" />
                </div>

                <div className="mt-3 text-center pb-1">
                  <h3 className="font-serif text-sm font-bold text-[#2B1519] transition group-hover:text-[#6B1D2F]">
                    {cat.name}
                  </h3>
                  <p className="mt-0.5 text-[10px] text-[#8A7879]">
                    {cat.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection / Bestsellers */}
      <section className="border-t border-[#E8DFD5] bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#F0E6DC] pb-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059] sm:text-xs">
                MOST ADMIRED DESIGNS
              </p>
              <h2 className="mt-1 font-serif text-3xl font-bold text-[#2B1519] sm:text-4xl">
                Featured &amp; Bestsellers
              </h2>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6B1D2F] hover:text-[#541524]"
            >
              <span>View All Jewellery</span>
              <span className="text-sm">→</span>
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
            {displayProducts.map((product) => (
              <FeaturedProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Occasions / Curated Edit */}
      <section className="py-16 sm:py-20 bg-[#FAF7F2]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059]">
              CURATED FOR YOUR CHAPTERS
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-[#2B1519] sm:text-4xl">
              Crafted for Special Moments
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {/* Bridal */}
            <div className="group relative overflow-hidden rounded-2xl bg-white shadow-xs">
              <div className="relative h-80 w-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=800&q=80"
                  alt="Bridal Symphony"
                  fill
                  unoptimized
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#EADBCE]">
                    THE WEDDING EDIT
                  </span>
                  <h3 className="mt-1 font-serif text-2xl font-bold">
                    The Bridal Symphony
                  </h3>
                  <p className="mt-1 text-xs text-stone-200">
                    Regal bridal chokers, necklaces &amp; heirloom jewels.
                  </p>
                  <Link
                    href="/products?category=necklaces"
                    className="mt-4 inline-block text-xs font-bold tracking-wider uppercase text-[#C5A059] underline underline-offset-4"
                  >
                    Explore Bridal →
                  </Link>
                </div>
              </div>
            </div>

            {/* Everyday Solitaires */}
            <div className="group relative overflow-hidden rounded-2xl bg-white shadow-xs">
              <div className="relative h-80 w-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80"
                  alt="Everyday Solitaires"
                  fill
                  unoptimized
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#EADBCE]">
                    MINIMALIST LUXURY
                  </span>
                  <h3 className="mt-1 font-serif text-2xl font-bold">
                    Daily Solitaires
                  </h3>
                  <p className="mt-1 text-xs text-stone-200">
                    Featherlight 18K gold &amp; diamond designs for everyday work.
                  </p>
                  <Link
                    href="/products?category=rings"
                    className="mt-4 inline-block text-xs font-bold tracking-wider uppercase text-[#C5A059] underline underline-offset-4"
                  >
                    Shop Solitaires →
                  </Link>
                </div>
              </div>
            </div>

            {/* Gifting */}
            <div className="group relative overflow-hidden rounded-2xl bg-white shadow-xs">
              <div className="relative h-80 w-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80"
                  alt="Gifts of Love"
                  fill
                  unoptimized
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#EADBCE]">
                    CELEBRATE THEM
                  </span>
                  <h3 className="mt-1 font-serif text-2xl font-bold">
                    Gifts of Love
                  </h3>
                  <p className="mt-1 text-xs text-stone-200">
                    Timeless pendants &amp; bracelets in luxury gift wrapping.
                  </p>
                  <Link
                    href="/products?category=pendants"
                    className="mt-4 inline-block text-xs font-bold tracking-wider uppercase text-[#C5A059] underline underline-offset-4"
                  >
                    Find the Gift →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Craftsmanship & Heritage */}
      <section className="bg-[#6B1D2F] py-16 text-white sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A059]">
              THE AURA PROMISE
            </span>
            <h2 className="mt-3 font-serif text-3xl font-normal leading-tight sm:text-5xl">
              An Heirloom in Every Detail.
            </h2>
            <p className="mt-6 text-sm leading-7 text-[#E8DFD5] sm:text-base">
              At Aura of Shree Jewellery, each piece is brought to life by master
              karigars carrying forward generations of goldsmithing mastery. From
              conflict-free natural diamonds to 100% BIS hallmarked gold, we ensure
              uncompromising purity and beauty.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-white/20 pt-6">
              <div>
                <p className="font-serif text-xl font-bold text-[#C5A059]">Master Karigars</p>
                <p className="mt-1 text-xs text-[#E8DFD5]">Over 25+ years of bench experience</p>
              </div>
              <div>
                <p className="font-serif text-xl font-bold text-[#C5A059]">Zero Conflict</p>
                <p className="mt-1 text-xs text-[#E8DFD5]">100% ethically certified gemstones</p>
              </div>
            </div>

            <Link
              href="/about"
              className="mt-8 inline-block rounded-md border border-[#C5A059] px-7 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#FAF7F2] hover:text-[#6B1D2F]"
            >
              Discover Our Heritage →
            </Link>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border-4 border-white/10 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80"
              alt="Jewellery Craftsmanship at Aura of Shree"
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059]">
              REAL CLIENT STORIES
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-[#2B1519] sm:text-4xl">
              Cherished by Over 50,000 Patrons
            </h2>
            <div className="mx-auto mt-4 h-0.5 w-16 bg-[#C5A059]" />
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {customerReviews.map((rev, index) => (
              <div
                key={index}
                className="flex flex-col justify-between rounded-xl border border-[#E8DFD5] bg-[#FAF7F2]/50 p-6 shadow-2xs"
              >
                <div>
                  <div className="flex text-sm text-[#C5A059]">
                    {"★".repeat(rev.rating)}
                  </div>
                  <p className="mt-4 text-xs leading-6 text-[#524043] italic">
                    &ldquo;{rev.text}&rdquo;
                  </p>
                </div>

                <div className="mt-6 border-t border-[#E8DFD5] pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#2B1519]">
                        {rev.name}
                      </h4>
                      <p className="text-[10px] text-[#8A7879]">{rev.city}</p>
                    </div>
                    <span className="rounded-full bg-[#1A4D2E]/10 px-2 py-0.5 text-[9px] font-bold text-[#1A4D2E]">
                      ✓ Verified Buyer
                    </span>
                  </div>
                  <p className="mt-2 text-[10px] text-[#C5A059] font-medium">
                    Purchased: {rev.piece}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIP Privilege Club / Newsletter */}
      <section className="border-t border-[#E8DFD5] bg-[#FAF7F2] py-16 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A059]">
            AURA PRIVILEGE CIRCLE
          </span>
          <h2 className="mt-2 font-serif text-3xl font-bold text-[#2B1519] sm:text-4xl">
            Receive ₹1,500 Off Your First Heirloom
          </h2>
          <p className="mt-3 text-xs sm:text-sm leading-6 text-[#8A7879]">
            Subscribe to receive private preview invitations, secret festive sales, and
            complimentary jewellery cleaning vouchers.
          </p>

          <NewsletterSubscription />
        </div>
      </section>

      {/* Production-Ready Footer */}
      <footer className="border-t border-[#4E1421] bg-[#541524] text-[#E8DFD5] py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            {/* Brand column */}
            <div className="lg:col-span-2">
              <span className="font-serif text-2xl font-bold tracking-wider text-white">
                AURA OF SHREE
              </span>
              <p className="mt-1 text-[9px] font-bold tracking-[0.35em] text-[#C5A059]">
                FINE JEWELLERY · EST. 2024
              </p>
              <p className="mt-4 max-w-sm text-xs leading-6 text-[#D7C4B3]">
                Purveyors of timeless fine jewellery, handcrafted in 100% BIS
                hallmarked gold and certified diamonds for your most treasured
                moments.
              </p>

              <div className="mt-6 flex items-center gap-3">
                <span className="text-xs text-[#C5A059] font-medium">Customer Support:</span>
                <span className="text-xs font-bold text-white">+91 1800-2872-4357</span>
              </div>
            </div>

            {/* Quick Collections */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Collections
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5 text-xs text-[#D7C4B3]">
                <li><Link href="/categories/rings" className="hover:text-white">Diamond Rings</Link></li>
                <li><Link href="/categories/necklaces" className="hover:text-white">Gold Necklaces</Link></li>
                <li><Link href="/categories/earrings" className="hover:text-white">Drop &amp; Stud Earrings</Link></li>
                <li><Link href="/categories/bracelets" className="hover:text-white">Tennis Bracelets</Link></li>
                <li><Link href="/categories/gold-coins" className="hover:text-white">24K Gold Coins</Link></li>
              </ul>
            </div>

            {/* Customer Care */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Customer Care
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5 text-xs text-[#D7C4B3]">
                <li><Link href="/shipping" className="hover:text-white">Shipping &amp; Delivery</Link></li>
                <li><Link href="/shipping" className="hover:text-white">Returns &amp; Exchange</Link></li>
                <li><Link href="/contact" className="hover:text-white">Book Video Consultation</Link></li>
                <li><Link href="/contact" className="hover:text-white">Store Locator</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy &amp; Security</Link></li>
              </ul>
            </div>

            {/* Corporate & Trust */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Our Heritage
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5 text-xs text-[#D7C4B3]">
                <li><Link href="/about" className="hover:text-white">About Aura of Shree</Link></li>
                <li><Link href="/about" className="hover:text-white">Artisan Karigars</Link></li>
                <li><Link href="/products" className="hover:text-white">All Jewellery</Link></li>
                <li><Link href="/login" className="hover:text-white">My Account</Link></li>
              </ul>
            </div>
          </div>

          {/* Security and Payment Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-[#D7C4B3]">
            <p>© {new Date().getFullYear()} Aura of Shree Jewellery Ltd. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[#C5A059]">100% SECURE CHECKOUT</span>
              <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-white">RAZORPAY</span>
              <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-white">UPI</span>
              <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-white">VISA / MC</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
