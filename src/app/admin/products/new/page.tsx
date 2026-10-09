import Link from "next/link";
import { redirect } from "next/navigation";

import ProductForm from "@/components/admin/ProductForm";
import { requireAdmin } from "@/server/auth/require-admin";

export default async function NewProductPage() {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#F5EBDD] px-6 py-10 text-[#3A1A1B]">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin/products"
          className="mb-6 inline-flex text-sm font-medium text-[#6B4A4A] transition hover:text-[#3A1A1B]"
        >
          ← Back to Products
        </Link>

        <header className="mb-8">
          <p className="mb-2 text-sm uppercase tracking-[0.2em]">
            Aura of Shree Jewellery
          </p>

          <h1 className="text-3xl font-bold">Add New Product</h1>

          <p className="mt-2 text-sm text-[#6B4A4A]">
            Add a jewelry product to your store inventory.
          </p>
        </header>

        <ProductForm />
      </div>
    </main>
  );
}
