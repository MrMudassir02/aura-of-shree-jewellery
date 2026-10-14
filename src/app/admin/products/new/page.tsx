import Link from "next/link";
import { redirect } from "next/navigation";

import ProductForm from "@/components/admin/ProductForm";
import { requireAdmin } from "@/server/auth/require-admin";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-7 p-5 sm:p-8 lg:p-10">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#8A7879]">
        <Link href="/admin" className="hover:text-[#6B1D2F] transition">
          Atelier Dashboard
        </Link>
        <span>/</span>
        <Link href="/admin/products" className="hover:text-[#6B1D2F] transition">
          Catalogue
        </Link>
        <span>/</span>
        <span className="font-medium text-[#2B1519]">Add Listing</span>
      </nav>

      {/* Header */}
      <header className="border-b border-[#E8DFD5] pb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-bold">
          Creative Atelier Workflow
        </span>
        <h1 className="mt-1 font-serif text-3xl sm:text-4xl text-[#2B1519]">
          Add New Jewellery Listing
        </h1>
        <p className="mt-1.5 text-sm text-[#524043]">
          Publish a new handcrafted piece with accurate pricing, inventory details, and high-resolution imagery.
        </p>
      </header>

      {/* Form Card */}
      <ProductForm />
    </div>
  );
}
