import Link from "next/link";
import { redirect } from "next/navigation";

import ProductActions from "@/components/admin/ProductActions";
import { requireAdmin } from "@/server/auth/require-admin";
import { productUseCases } from "@/server/use-cases/ProductUseCases";

export default async function AdminProductsPage() {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    redirect("/login");
  }

  const products = await productUseCases.getProducts({
    limit: 50,
  });

  return (
    <main className="min-h-screen bg-[#F5EBDD] px-6 py-10 text-[#3A1A1B]">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.2em]">
              Aura of Shree Jewellery
            </p>

            <h1 className="text-3xl font-bold">Product Management</h1>

            <p className="mt-2 text-sm text-[#6B4A4A]">
              Manage your jewelry inventory and product listings.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="rounded-lg bg-[#3A1A1B] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#542829]"
          >
            + Add Product
          </Link>
        </header>

        <section className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-[#FFF9F0] p-5 shadow-sm">
            <p className="text-sm text-[#6B4A4A]">Active Products</p>

            <p className="mt-2 text-3xl font-bold">{products.length}</p>
          </div>

          <div className="rounded-xl bg-[#FFF9F0] p-5 shadow-sm">
            <p className="text-sm text-[#6B4A4A]">Total Stock</p>

            <p className="mt-2 text-3xl font-bold">
              {products.reduce((total, product) => total + product.stock, 0)}
            </p>
          </div>

          <div className="rounded-xl bg-[#FFF9F0] p-5 shadow-sm">
            <p className="text-sm text-[#6B4A4A]">Featured Products</p>

            <p className="mt-2 text-3xl font-bold">
              {products.filter((product) => product.isFeatured).length}
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl bg-[#FFF9F0] shadow-sm">
          <div className="border-b border-[#E8D8C4] px-6 py-5">
            <h2 className="text-lg font-semibold">All Products</h2>
          </div>

          {products.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-lg font-semibold">No products found</p>

              <p className="mt-2 text-sm text-[#6B4A4A]">
                Add your first product to get started.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F5EBDD] text-[#6B4A4A]">
                  <tr>
                    <th className="px-6 py-4">Product</th>

                    <th className="px-6 py-4">SKU</th>

                    <th className="px-6 py-4">Price</th>

                    <th className="px-6 py-4">Stock</th>

                    <th className="px-6 py-4">Featured</th>

                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.slug}
                      className="border-t border-[#E8D8C4]"
                    >
                      <td className="px-6 py-4 font-medium">{product.name}</td>

                      <td className="px-6 py-4">{product.sku}</td>

                      <td className="px-6 py-4">
                        ₹{product.price.toLocaleString("en-IN")}
                      </td>

                      <td className="px-6 py-4">{product.stock}</td>

                      <td className="px-6 py-4">
                        {product.isFeatured ? "Yes" : "No"}
                      </td>

                      <td className="px-6 py-4">
                        <ProductActions
                          productId={product._id.toString()}
                          productName={product.name}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
