import Link from "next/link";
import SiteNavigation from "@/components/navigation/SiteNavigation";

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2B1519]">
      <SiteNavigation />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        <Link href="/" className="text-xs font-semibold uppercase tracking-wider text-[#8A7879] hover:text-[#6B1D2F]">
          ← Back to home
        </Link>
        <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A059]">
          TRUST &amp; POLICIES
        </p>
        <h1 className="mt-3 font-serif text-4xl font-bold text-[#6B1D2F] sm:text-5xl">
          Shipping &amp; Returns
        </h1>
        <p className="mt-4 text-xs sm:text-sm leading-7 text-[#524043]">
          We take immense pride in ensuring your fine jewellery arrives securely, discreetly, and fully insured every step of the journey.
        </p>

        <div className="mt-10 space-y-6">
          <section className="rounded-xl border border-[#E8DFD5] bg-white p-6 shadow-xs">
            <h2 className="font-serif text-lg font-bold text-[#2B1519]">🚚 Insured Express Shipping</h2>
            <p className="mt-2 text-xs sm:text-sm leading-6 text-[#8A7879]">
              Every order from Aura of Shree is packaged in tamper-evident security boxes and shipped via certified secure logistics partners (Blue Dart Apex / Sequel Logistics) with 100% transit insurance.
            </p>
          </section>

          <section className="rounded-xl border border-[#E8DFD5] bg-white p-6 shadow-xs">
            <h2 className="font-serif text-lg font-bold text-[#2B1519]">⏱️ Delivery Timelines</h2>
            <p className="mt-2 text-xs sm:text-sm leading-6 text-[#8A7879]">
              In-stock pieces dispatch within 24 to 48 hours. Metro deliveries typically arrive within 2-4 business days, while other locations take 4-6 business days. Tracking links are sent via SMS and email immediately upon dispatch.
            </p>
          </section>

          <section className="rounded-xl border border-[#E8DFD5] bg-white p-6 shadow-xs">
            <h2 className="font-serif text-lg font-bold text-[#2B1519]">🔄 15-Day Hassle-Free Returns &amp; Exchange</h2>
            <p className="mt-2 text-xs sm:text-sm leading-6 text-[#8A7879]">
              If for any reason you are not completely enchanted by your purchase, you may initiate a return or exchange within 15 days of delivery, provided the item is unworn with its original security tag and BIS certificate intact.
            </p>
          </section>

          <section className="rounded-xl border border-[#E8DFD5] bg-white p-6 shadow-xs">
            <h2 className="font-serif text-lg font-bold text-[#2B1519]">💎 Lifetime Exchange &amp; Upgrade</h2>
            <p className="mt-2 text-xs sm:text-sm leading-6 text-[#8A7879]">
              All Aura of Shree gold and diamond jewellery qualifies for our Lifetime Exchange program, calculated against prevailing daily market gold rates.
            </p>
          </section>
        </div>

        <div className="mt-10 border-t border-[#E8DFD5] pt-6 flex flex-wrap gap-4">
          <Link
            href="/contact"
            className="rounded-md bg-[#6B1D2F] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#541524]"
          >
            Contact Customer Support
          </Link>
          <Link
            href="/products"
            className="rounded-md border border-[#DFD4C7] bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#2B1519] transition hover:bg-[#FAF7F2]"
          >
            Explore Jewellery
          </Link>
        </div>
      </main>
    </div>
  );
}
