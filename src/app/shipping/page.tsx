import Link from "next/link";

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-[#F5EBDD] text-[#3A1A1B]">
      <section className="mx-auto max-w-4xl px-5 py-20 sm:py-28">
        <Link href="/" className="text-sm text-[#806D60] hover:text-[#3A1A1B]">
          ← Back to home
        </Link>
        <p className="mt-16 text-xs uppercase tracking-[0.3em] text-[#967344]">
          Customer information
        </p>
        <h1 className="mt-5 font-serif text-5xl sm:text-6xl">
          Shipping & returns
        </h1>
        <p className="mt-6 text-sm leading-8 text-[#806D60]">
          We aim to make every order experience clear and straightforward.
          Please review the information below before completing your purchase.
        </p>

        <div className="mt-12 space-y-10">
          <section>
            <h2 className="font-serif text-2xl">Order processing</h2>
            <p className="mt-3 text-sm leading-8 text-[#806D60]">
              Orders are subject to successful payment verification and product
              availability. Please provide an accurate delivery address and
              contact number at checkout.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-2xl">Delivery timelines</h2>
            <p className="mt-3 text-sm leading-8 text-[#806D60]">
              Delivery times can vary by destination, courier service, and order
              processing. A specific delivery guarantee is not stated here.
              Confirm the expected timeline before relying on delivery for a
              particular occasion.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-2xl">Returns and exchanges</h2>
            <p className="mt-3 text-sm leading-8 text-[#806D60]">
              Return and exchange eligibility, including any applicable
              conditions or deadlines, must be confirmed with the store before
              sending an item back. Keep your order details and original
              packaging until your enquiry is resolved.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-2xl">Order issues</h2>
            <p className="mt-3 text-sm leading-8 text-[#806D60]">
              If an item arrives damaged, is missing, or appears different from
              what you ordered, retain the packaging and order confirmation
              while arranging assistance through the store’s official support
              channel.
            </p>
          </section>
        </div>

        <div className="mt-14 border-t border-[#3A1A1B]/15 pt-8">
          <p className="text-sm leading-7 text-[#806D60]">
            This page describes general information, not a confirmed delivery or
            refund guarantee. The store should publish its approved shipping
            charges, delivery estimates, and return conditions before accepting
            customer orders.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-block bg-[#3A1A1B] px-6 py-3 text-sm text-[#FFF9F0] hover:bg-[#54292A]"
          >
            Continue shopping
          </Link>
        </div>
      </section>
    </main>
  );
}
