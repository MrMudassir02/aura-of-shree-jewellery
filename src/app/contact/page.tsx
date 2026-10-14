import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F5EBDD] text-[#3A1A1B]">
      <section className="mx-auto max-w-4xl px-5 py-20 sm:py-28">
        <Link href="/" className="text-sm text-[#806D60] hover:text-[#3A1A1B]">
          ← Back to home
        </Link>
        <p className="mt-16 text-xs uppercase tracking-[0.3em] text-[#967344]">
          Customer care
        </p>
        <h1 className="mt-5 font-serif text-5xl sm:text-6xl">Contact us</h1>
        <p className="mt-6 max-w-2xl text-sm leading-8 text-[#806D60]">
          Need help with a product, an order, or a payment? We want your
          experience with Aura of Shree Jewellery to feel as thoughtful as the
          pieces you choose.
        </p>

        <div className="mt-12 border-y border-[#3A1A1B]/15 py-8">
          <h2 className="font-serif text-2xl">Order or payment enquiry</h2>
          <p className="mt-3 text-sm leading-7 text-[#806D60]">
            Keep your order ID and payment reference available when requesting
            help. Never share your password, OTP, or full payment credentials.
          </p>
          <p className="mt-4 text-sm leading-7 text-[#806D60]">
            If you have already placed an order, retain your order confirmation
            and payment receipt so the transaction can be identified.
          </p>
        </div>

        <div className="mt-8 border-b border-[#3A1A1B]/15 pb-8">
          <h2 className="font-serif text-2xl">Explore while you wait</h2>
          <p className="mt-3 text-sm leading-7 text-[#806D60]">
            Browse our current jewellery collection or review the shipping
            information for details about order fulfilment.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="bg-[#3A1A1B] px-6 py-3 text-sm text-[#FFF9F0] hover:bg-[#54292A]"
            >
              Shop jewellery
            </Link>
            <Link
              href="/shipping"
              className="border border-[#3A1A1B]/25 px-6 py-3 text-sm hover:bg-[#3A1A1B]/5"
            >
              Shipping information
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
