import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F5EBDD] text-[#3A1A1B]">
      <section className="mx-auto max-w-5xl px-5 py-20 sm:py-28">
        <Link href="/" className="text-sm text-[#806D60] hover:text-[#3A1A1B]">
          ← Back to home
        </Link>
        <p className="mt-16 text-xs uppercase tracking-[0.3em] text-[#967344]">
          Our story
        </p>
        <h1 className="mt-5 max-w-3xl font-serif text-5xl leading-tight sm:text-7xl">
          Jewellery for your moments.
        </h1>
        <p className="mt-8 max-w-2xl text-base leading-8 text-[#806D60]">
          At Aura of Shree Jewellery, we believe the right piece can make an
          everyday moment feel special. Our collection brings together
          thoughtful designs for personal style, meaningful occasions, and the
          memories you carry with you.
        </p>
        <div className="my-14 h-px bg-[#3A1A1B]/15" />
        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl">Timeless by nature</h2>
            <p className="mt-4 text-sm leading-7 text-[#806D60]">
              Discover pieces selected to complement your style, whether you are
              dressing for a celebration or adding a finishing touch to your
              everyday look.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl">Personal by design</h2>
            <p className="mt-4 text-sm leading-7 text-[#806D60]">
              Jewellery is more than an accessory. It can mark a milestone,
              express individuality, or become a gift that means something.
            </p>
          </div>
        </div>
        <Link
          href="/products"
          className="mt-12 inline-block bg-[#3A1A1B] px-7 py-4 text-sm text-[#FFF9F0] hover:bg-[#54292A]"
        >
          Explore the collection
        </Link>
      </section>
    </main>
  );
}
