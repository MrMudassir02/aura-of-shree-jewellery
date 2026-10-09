import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import ProductForm from "@/components/admin/ProductForm";
import { requireAdmin } from "@/server/auth/require-admin";
import { productUseCases } from "@/server/use-cases/ProductUseCases";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    redirect("/login");
  }

  const { id } = await params;

  const product = await productUseCases.getProductById(id);

  if (!product || !product.isActive) {
    notFound();
  }

  const formProduct = {
    _id: id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    category: product.category.toString(),
    price: product.price,
    compareAtPrice: product.compareAtPrice ?? undefined,
    stock: product.stock,
    sku: product.sku,
    images: product.images.map((image) => ({
      url: image.url,
      publicId: image.publicId,
    })),
    isFeatured: product.isFeatured,
  };

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

          <h1 className="text-3xl font-bold">Edit Product</h1>

          <p className="mt-2 text-sm text-[#6B4A4A]">
            Update the product information, pricing, inventory, and storefront
            settings.
          </p>
        </header>

        <ProductForm product={formProduct} />
      </div>
    </main>
  );
}
