import Link from "next/link";
import SiteNavigation from "@/components/navigation/SiteNavigation";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2B1519]">
      <SiteNavigation />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        <Link href="/" className="text-xs font-semibold uppercase tracking-wider text-[#8A7879] hover:text-[#6B1D2F]">
          ← Back to home
        </Link>
        <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A059]">
          LEGAL &amp; DATA PROTECTION
        </p>
        <h1 className="mt-3 font-serif text-4xl font-bold text-[#6B1D2F] sm:text-5xl">Privacy Policy</h1>
        <p className="mt-2 text-xs text-[#8A7879]">
          Last updated: October 2026
        </p>
        <p className="mt-4 text-xs sm:text-sm leading-7 text-[#524043]">
          Your privacy and digital security are sacred to us. Aura of Shree Jewellery is committed to safeguarding the personal details and payment confidentiality of every customer.
        </p>

        <div className="mt-10 space-y-6">
          <section className="rounded-xl border border-[#E8DFD5] bg-white p-6 shadow-xs">
            <h2 className="font-serif text-lg font-bold text-[#2B1519]">Information We Collect</h2>
            <p className="mt-2 text-xs sm:text-sm leading-6 text-[#8A7879]">
              When you browse our catalogue, register an account, or complete a jewellery purchase, we securely process details such as your name, delivery address, phone number, and verified email address solely to fulfill your order and provide warranty certificates.
            </p>
          </section>

          <section className="rounded-xl border border-[#E8DFD5] bg-white p-6 shadow-xs">
            <h2 className="font-serif text-lg font-bold text-[#2B1519]">Bank-Grade Payment Security</h2>
            <p className="mt-2 text-xs sm:text-sm leading-6 text-[#8A7879]">
              All card and digital payments are routed directly through Razorpay with 256-bit SSL encryption. Aura of Shree never stores your credit card numbers, CVVs, UPI PINs, or banking passwords.
            </p>
          </section>

          <section className="rounded-xl border border-[#E8DFD5] bg-white p-6 shadow-xs">
            <h2 className="font-serif text-lg font-bold text-[#2B1519]">Cookies &amp; Local Storage</h2>
            <p className="mt-2 text-xs sm:text-sm leading-6 text-[#8A7879]">
              We utilize encrypted session cookies and browser storage solely to preserve your active shopping bag, saved wishlist items, and authenticated sign-in state across browsing sessions.
            </p>
          </section>
        </div>

        <div className="mt-10 border-t border-[#E8DFD5] pt-6">
          <Link
            href="/contact"
            className="rounded-md bg-[#6B1D2F] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#541524]"
          >
            Contact Privacy Officer
          </Link>
        </div>
      </main>
    </div>
  );
}
