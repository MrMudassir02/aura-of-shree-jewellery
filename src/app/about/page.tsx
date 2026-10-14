import Link from "next/link";
import SiteNavigation from "@/components/navigation/SiteNavigation";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2B1519]">
      <SiteNavigation />

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        <Link href="/" className="text-xs font-semibold uppercase tracking-wider text-[#8A7879] hover:text-[#6B1D2F]">
          ← Back to home
        </Link>
        <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A059]">
          OUR HERITAGE &amp; STORY
        </p>
        <h1 className="mt-3 max-w-3xl font-serif text-4xl font-bold leading-tight text-[#6B1D2F] sm:text-6xl">
          Jewellery Crafted For Your Precious Moments.
        </h1>
        <p className="mt-6 max-w-2xl text-sm sm:text-base leading-8 text-[#524043]">
          At Aura of Shree Jewellery, we believe the right piece can elevate an everyday moment into an unforgettable celebration. Our collections bring together thoughtful artisanal designs, pure 100% BIS hallmarked gold, and ethically sourced certified diamonds made to be treasured across generations.
        </p>
        <div className="my-10 h-px bg-[#E8DFD5]" />
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="rounded-xl border border-[#E8DFD5] bg-white p-6 shadow-xs">
            <h2 className="font-serif text-xl font-bold text-[#2B1519]">Timeless by Nature</h2>
            <p className="mt-3 text-xs sm:text-sm leading-6 text-[#8A7879]">
              Every piece is selected to complement your unique personality, whether you are dressing for a royal wedding or adding an understated finishing touch to your everyday attire.
            </p>
          </div>
          <div className="rounded-xl border border-[#E8DFD5] bg-white p-6 shadow-xs">
            <h2 className="font-serif text-xl font-bold text-[#2B1519]">Personal by Design</h2>
            <p className="mt-3 text-xs sm:text-sm leading-6 text-[#8A7879]">
              Jewellery is far more than an accessory. It marks a milestone, celebrates personal achievement, or stands as an eternal symbol of affection.
            </p>
          </div>
        </div>
        <div className="mt-10">
          <Link
            href="/products"
            className="inline-block rounded-md bg-[#6B1D2F] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#541524]"
          >
            Explore The Collection →
          </Link>
        </div>
      </main>
    </div>
  );
}
