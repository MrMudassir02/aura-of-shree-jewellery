import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import ProductForm from "@/components/admin/ProductForm";
import { requireAdmin } from "@/server/auth/require-admin";
import { productUseCases } from "@/server/use-cases/ProductUseCases";

export const dynamic = "force-dynamic";

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

  if (!product) {
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
        <span className="font-medium text-[#2B1519]">Edit: {product.name}</span>
      </nav>

      {/* Header */}
      <header className="border-b border-[#E8DFD5] pb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-bold">
          Jewellery Modification
        </span>
        <h1 className="mt-1 font-serif text-3xl sm:text-4xl text-[#2B1519]">
          Edit Jewellery Listing
        </h1>
        <p className="mt-1.5 text-sm text-[#524043]">
          Update details, adjust selling price, modify stock levels, or swap photography for{" "}
          <span className="font-semibold text-[#2B1519]">{product.name}</span>.
        </p>
      </header>

      {/* Form Card */}
      <ProductForm product={formProduct} />
    </div>
  );
}
