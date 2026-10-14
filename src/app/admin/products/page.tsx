import Link from "next/link";
import { redirect } from "next/navigation";
import ProductDashboard from "@/app/admin/products/ProductDashboard";
import { requireAdmin } from "@/server/auth/require-admin";
import { categoryUseCases } from "@/server/use-cases/CategoryUseCases";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    redirect("/login");
  }

  const categories = await categoryUseCases.getCategories();
  const categoryOptions = categories.map((c: { _id: unknown; name: string }) => ({
    _id: String(c._id),
    name: c.name,
  }));

  return (
    <div className="mx-auto max-w-[1440px] space-y-7 p-5 sm:p-8 lg:p-10">
      {/* Breadcrumb & Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#8A7879]">
        <Link href="/admin" className="hover:text-[#6B1D2F] transition">
          Atelier Dashboard
        </Link>
        <span>/</span>
        <span className="font-medium text-[#2B1519]">Catalogue</span>
      </nav>

      {/* Page Header */}
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#E8DFD5] pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-bold">
            Atelier Inventory
          </span>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl text-[#2B1519]">
            Product Catalogue
          </h1>
          <p className="mt-1.5 text-sm text-[#524043]">
            Curate jewellery listings, adjust prices, monitor stock counts, and control visibility.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[#6B1D2F] px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-[#541524]"
        >
          <span>＋</span>
          <span>Add New Product</span>
        </Link>
      </header>

      {/* Interactive Products Table & Controls */}
      <ProductDashboard categories={categoryOptions} />
    </div>
  );
}
