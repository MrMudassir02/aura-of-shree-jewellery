import Link from "next/link";
import { redirect } from "next/navigation";
import ProductDashboard from "@/app/admin/products/ProductDashboard";
import { requireAdmin } from "@/server/auth/require-admin";
import { categoryUseCases } from "@/server/use-cases/CategoryUseCases";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const auth = await requireAdmin();
  if (!auth.authorized) redirect("/login");
  const categories = await categoryUseCases.getCategories();
  const categoryOptions = categories.map((c: { _id: unknown; name: string }) => ({ _id: String(c._id), name: c.name }));
  return <main className="min-h-screen bg-[#F5EBDD] px-4 py-7 text-[#3A1A1B] sm:px-8 sm:py-10">
    <div className="mx-auto max-w-[1500px]">
      <Link href="/admin" className="text-sm text-[#6B4A4A] hover:underline">← Admin dashboard</Link>
      <header className="mb-7 mt-5 flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-xs uppercase tracking-[0.2em] text-[#806D60]">Aura of Shree Jewellery</p><h1 className="mt-2 font-serif text-3xl sm:text-4xl">Product catalogue</h1><p className="mt-2 text-sm text-[#806D60]">Manage catalogue, pricing, inventory and visibility.</p></div>
        <Link href="/admin/products/new" className="rounded-lg bg-[#3A1A1B] px-5 py-3 text-sm font-semibold text-white hover:bg-[#542829]">+ Add product</Link>
      </header>
      <ProductDashboard categories={categoryOptions} />
    </div>
  </main>;
}
