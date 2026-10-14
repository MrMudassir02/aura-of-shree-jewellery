import Link from "next/link";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/server/models/Product";
import { requireAdmin } from "@/server/auth/require-admin";
import { categoryUseCases } from "@/server/use-cases/CategoryUseCases";

export const dynamic = "force-dynamic";

const managementLinks = [
  {
    number: "01",
    title: "Product catalogue",
    description: "Manage product details, pricing, real-time stock levels, and storefront visibility.",
    href: "/admin/products",
    action: "Manage catalogue",
  },
  {
    number: "02",
    title: "Add new jewellery",
    description: "Create an exquisite product listing with high-resolution imagery and specifications.",
    href: "/admin/products/new",
    action: "Create listing",
  },
];

export default async function AdminDashboardPage() {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    redirect("/login");
  }

  let totalProducts = 0;
  let activeProducts = 0;
  let categoryCount = 0;

  try {
    await connectDB();
    const [total, active, categories] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ $or: [{ status: "ACTIVE" }, { isActive: true }] }),
      categoryUseCases.getCategories(),
    ]);
    totalProducts = total;
    activeProducts = active;
    categoryCount = categories.length;
  } catch (error) {
    console.error("Failed to load admin stats:", error);
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-10">
      {/* Welcome Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#6B1D2F] via-[#541524] to-[#3B0E18] px-7 py-10 sm:px-12 sm:py-14 text-[#FAF7F2] shadow-sm">
        {/* Decorative Gold Circular Accents */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-24 h-80 w-80 rounded-full border border-[#C5A059]/20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-4 top-[-40px] h-64 w-64 rounded-full border border-[#C5A059]/15"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-24 bottom-[-60px] h-48 w-48 rounded-full border border-[#C5A059]/10"
        />

        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/30 bg-white/5 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C5A059] backdrop-blur-sm">
            <span>◆</span> Atelier Control Centre
          </div>

          <h1 className="mt-5 font-serif text-3xl leading-tight sm:text-5xl text-white">
            Welcome to your
            <br />
            jewellery atelier.
          </h1>

          <p className="mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-[#FAF7F2]/80">
            Curate your collections, maintain accurate inventory, and ensure every
            handcrafted piece reflects the timeless elegance of Aura of Shree.
          </p>

          <div className="mt-8 flex flex-wrap gap-3.5">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 rounded-full bg-[#C5A059] px-6 py-3 text-sm font-semibold text-[#2B1519] transition hover:bg-[#D4AF67] shadow-sm"
            >
              <span>Open product catalogue</span>
              <span>→</span>
            </Link>

            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              <span>+ Add a product</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Real-time Stats Grid */}
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#E8DFD5] bg-white p-6 shadow-xs">
          <p className="text-xs uppercase tracking-wider text-[#8A7879] font-medium">
            Total Catalogue Items
          </p>
          <p className="mt-2 font-serif text-3xl font-semibold text-[#2B1519]">
            {totalProducts}
          </p>
          <p className="mt-1 text-xs text-[#524043]">
            Jewellery listings in database
          </p>
        </div>

        <div className="rounded-2xl border border-[#E8DFD5] bg-white p-6 shadow-xs">
          <p className="text-xs uppercase tracking-wider text-[#8A7879] font-medium">
            Active Listings
          </p>
          <p className="mt-2 font-serif text-3xl font-semibold text-[#6B1D2F]">
            {activeProducts}
          </p>
          <p className="mt-1 text-xs text-emerald-700 font-medium">
            Published and purchasable
          </p>
        </div>

        <div className="rounded-2xl border border-[#E8DFD5] bg-white p-6 shadow-xs">
          <p className="text-xs uppercase tracking-wider text-[#8A7879] font-medium">
            Active Categories
          </p>
          <p className="mt-2 font-serif text-3xl font-semibold text-[#2B1519]">
            {categoryCount}
          </p>
          <p className="mt-1 text-xs text-[#524043]">
            Curated jewellery families
          </p>
        </div>

        <div className="rounded-2xl border border-[#E8DFD5] bg-white p-6 shadow-xs">
          <p className="text-xs uppercase tracking-wider text-[#8A7879] font-medium">
            Storefront Status
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <p className="font-serif text-2xl font-semibold text-emerald-800">
              Operational
            </p>
          </div>
          <p className="mt-1 text-xs text-[#524043]">
            Orders and catalogue live
          </p>
        </div>
      </section>

      {/* Main Workspace Navigation Cards */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-semibold">
              Management Suites
            </p>
            <h2 className="mt-1.5 font-serif text-2xl sm:text-3xl text-[#2B1519]">
              Your workspace
            </h2>
          </div>

          <p className="text-xs text-[#8A7879]">
            Select an area to curate your jewellery collections
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {managementLinks.map((item) => (
            <Link
              key={item.number}
              href={item.href}
              className="group rounded-2xl border border-[#E8DFD5] bg-white p-7 transition-all duration-200 hover:-translate-y-1 hover:border-[#C5A059] hover:shadow-[0_12px_30px_rgba(107,29,47,0.06)]"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="font-serif text-4xl text-[#C5A059]">
                  {item.number}
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8DFD5] bg-[#FAF7F2] text-[#6B1D2F] transition group-hover:border-[#6B1D2F] group-hover:bg-[#6B1D2F] group-hover:text-white">
                  ↗
                </span>
              </div>

              <h3 className="mt-6 font-serif text-2xl text-[#2B1519]">
                {item.title}
              </h3>

              <p className="mt-2.5 max-w-md text-sm leading-6 text-[#524043]">
                {item.description}
              </p>

              <div className="mt-6 flex items-center justify-between border-t border-[#F5ECE1] pt-4">
                <span className="text-sm font-semibold text-[#6B1D2F]">
                  {item.action}
                </span>
                <span className="text-[#C5A059] transition group-hover:translate-x-1 font-semibold">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Actions Panel */}
      <section className="rounded-2xl border border-[#E8DFD5] bg-[#F5ECE1]/60 p-6 sm:p-8">
        <p className="text-[10px] uppercase tracking-[0.24em] text-[#C5A059] font-bold">
          Quick Access
        </p>

        <h2 className="mt-1.5 font-serif text-xl sm:text-2xl text-[#2B1519]">
          Store maintenance & shortcuts
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <Link
            href="/admin/products"
            className="rounded-xl border border-[#E8DFD5] bg-white p-5 transition hover:border-[#6B1D2F] hover:shadow-xs group"
          >
            <p className="text-sm font-semibold text-[#2B1519] group-hover:text-[#6B1D2F] transition">
              Review inventory
            </p>
            <p className="mt-1.5 text-xs leading-5 text-[#8A7879]">
              Audit live stock counts and update pricing quickly.
            </p>
          </Link>

          <Link
            href="/admin/products"
            className="rounded-xl border border-[#E8DFD5] bg-white p-5 transition hover:border-[#6B1D2F] hover:shadow-xs group"
          >
            <p className="text-sm font-semibold text-[#2B1519] group-hover:text-[#6B1D2F] transition">
              Update listings
            </p>
            <p className="mt-1.5 text-xs leading-5 text-[#8A7879]">
              Edit descriptions, categories, and featured status.
            </p>
          </Link>

          <Link
            href="/admin/products/new"
            className="rounded-xl border border-[#E8DFD5] bg-white p-5 transition hover:border-[#6B1D2F] hover:shadow-xs group"
          >
            <p className="text-sm font-semibold text-[#2B1519] group-hover:text-[#6B1D2F] transition">
              Expand collection
            </p>
            <p className="mt-1.5 text-xs leading-5 text-[#8A7879]">
              Publish new rings, necklaces, pendants, or gold coins.
            </p>
          </Link>
        </div>
      </section>

      {/* Administration Footer note */}
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E8DFD5] pt-6 text-xs text-[#8A7879]">
        <p>Aura of Shree Jewellery &bull; Atelier Administration</p>
        <p>Secured Authorized Management Session</p>
      </footer>
    </div>
  );
}
