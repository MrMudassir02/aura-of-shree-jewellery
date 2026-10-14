import Link from "next/link";
import SiteNavigation from "@/components/navigation/SiteNavigation";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2B1519]">
      <SiteNavigation />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        <Link href="/" className="text-xs font-semibold uppercase tracking-wider text-[#8A7879] hover:text-[#6B1D2F]">
          ← Back to home
        </Link>
        <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A059]">
          CUSTOMER CONCIERGE &amp; CARE
        </p>
        <h1 className="mt-3 font-serif text-4xl font-bold text-[#6B1D2F] sm:text-5xl">Contact Us</h1>
        <p className="mt-4 max-w-2xl text-xs sm:text-sm leading-7 text-[#524043]">
          Need guidance with styling, ring sizing, bespoke bridal orders, or tracking an existing purchase? Our dedicated jewellery consultants are at your service.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-[#E8DFD5] bg-white p-6 shadow-xs">
            <h3 className="font-serif text-lg font-bold text-[#2B1519]">Toll-Free Client Support</h3>
            <p className="mt-2 text-xs text-[#8A7879]">Available Monday to Saturday, 10 AM - 7 PM IST</p>
            <p className="mt-4 font-semibold text-sm text-[#6B1D2F]">+91 1800-2872-4357</p>
            <p className="mt-1 text-xs text-[#524043]">support@auraofshree.com</p>
          </div>

          <div className="rounded-xl border border-[#E8DFD5] bg-white p-6 shadow-xs">
            <h3 className="font-serif text-lg font-bold text-[#2B1519]">Flagship Boutique</h3>
            <p className="mt-2 text-xs text-[#8A7879]">Aura of Shree Jewellery House</p>
            <p className="mt-4 text-xs leading-5 text-[#524043]">
              Level 2, Heritage Diamond Square, Bandra West, Mumbai 400050, India
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-[#E8DFD5] bg-white p-6 shadow-xs">
          <h2 className="font-serif text-xl font-bold text-[#2B1519]">Order &amp; Payment Inquiries</h2>
          <p className="mt-2 text-xs sm:text-sm leading-6 text-[#8A7879]">
            Please keep your Order ID and payment receipt handy when contacting our support team. We verify all transactions directly through 256-bit encrypted banking channels.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="rounded-md bg-[#6B1D2F] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#541524]"
            >
              Shop Jewellery
            </Link>
            <Link
              href="/shipping"
              className="rounded-md border border-[#DFD4C7] bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#2B1519] transition hover:bg-[#FAF7F2]"
            >
              Shipping Information
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
