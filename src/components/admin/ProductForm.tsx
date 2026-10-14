"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type Category = {
  _id: string;
  name: string;
};

type ProductFormProduct = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  sku: string;
  images: Array<{
    url: string;
    publicId: string;
  }>;
  isFeatured: boolean;
};

type ProductFormProps = {
  product?: ProductFormProduct;
};

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();

  const isEditMode = Boolean(product);
  const productId = product?._id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [slugEdited, setSlugEdited] = useState(isEditMode);

  const [form, setForm] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    category: product?.category ?? "",
    price: product?.price?.toString() ?? "",
    compareAtPrice: product?.compareAtPrice?.toString() ?? "",
    stock: product?.stock?.toString() ?? "",
    sku: product?.sku ?? "",
    imageUrl: product?.images?.[0]?.url ?? "",
    publicId: product?.images?.[0]?.publicId ?? "",
    isFeatured: product?.isFeatured ?? false,
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/admin/categories");

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load categories");
        }

        setCategories(data.categories);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load categories",
        );
      } finally {
        setLoadingCategories(false);
      }
    }

    fetchCategories();
  }, []);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = event.target;

    setForm((previous) => {
      const updated = {
        ...previous,
        [name]: value,
      };

      if (name === "name" && !slugEdited) {
        updated.slug = value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
      }

      return updated;
    });
  }

  function handleFeaturedChange(event: React.ChangeEvent<HTMLInputElement>) {
    setForm((previous) => ({
      ...previous,
      isFeatured: event.target.checked,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      if (isEditMode && !productId) {
        throw new Error("Product ID is missing");
      }

      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
        category: form.category,
        price: Number(form.price),

        ...(form.compareAtPrice !== ""
          ? {
              compareAtPrice: Number(form.compareAtPrice),
            }
          : {}),

        stock: Number(form.stock),
        sku: form.sku.trim(),

        images: [
          {
            url: form.imageUrl.trim(),
            publicId: form.publicId.trim() || "manual-entry",
          },
        ],

        isFeatured: form.isFeatured,
      };

      const endpoint =
        isEditMode && productId
          ? `/api/admin/products/${productId}`
          : "/api/admin/products";

      const method = isEditMode ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const validationErrors = data.errors?.fieldErrors;

        if (validationErrors) {
          const firstError = Object.values(validationErrors)
            .flat()
            .find((message) => typeof message === "string");

          throw new Error(
            firstError ||
              data.message ||
              `Failed to ${isEditMode ? "update" : "create"} product`,
          );
        }

        throw new Error(
          data.message ||
            `Failed to ${isEditMode ? "update" : "create"} product`,
        );
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-[#E8DFD5] bg-[#FAF7F2]/40 px-4 py-3 text-sm text-[#2B1519] placeholder-[#8A7879] outline-none transition focus:bg-white focus:border-[#6B1D2F] focus:ring-2 focus:ring-[#6B1D2F]/10";

  const labelClass =
    "block text-xs font-semibold uppercase tracking-wider text-[#524043]";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-9 rounded-2xl border border-[#E8DFD5] bg-white p-6 shadow-xs sm:p-10"
    >
      {/* Basic Information */}
      <section className="space-y-6">
        <div className="flex items-center gap-2.5 border-b border-[#E8DFD5] pb-3.5">
          <span className="text-[#C5A059] font-serif text-lg">01</span>
          <h2 className="font-serif text-lg font-semibold text-[#2B1519]">
            Basic Information
          </h2>
        </div>

        <div>
          <label className={labelClass} htmlFor="name">
            Product Name *
          </label>

          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. Traditional Royal Kundan Necklace"
            minLength={2}
            maxLength={150}
            required
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="slug">
            URL Slug *
          </label>

          <input
            id="slug"
            name="slug"
            value={form.slug}
            onChange={(event) => {
              setSlugEdited(true);
              handleChange(event);
            }}
            className={inputClass}
            placeholder="traditional-royal-kundan-necklace"
            required
          />

          <p className="mt-1.5 text-xs text-[#8A7879]">
            The URL path for this jewellery item. Must consist of lowercase letters, numbers, and hyphens.
          </p>
        </div>

        <div>
          <label className={labelClass} htmlFor="description">
            Artisanal Description *
          </label>

          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            className={inputClass}
            rows={5}
            minLength={10}
            maxLength={3000}
            placeholder="Describe the craftsmanship, metal purity, gemstone setting, weight, and styling advice..."
            required
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="category">
            Jewellery Category *
          </label>

          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className={inputClass}
            required
            disabled={loadingCategories || categories.length === 0}
          >
            <option value="">
              {loadingCategories
                ? "Loading categories..."
                : categories.length === 0
                  ? "No categories available"
                  : "Select a jewellery category"}
            </option>

            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Pricing & Stock Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2.5 border-b border-[#E8DFD5] pb-3.5">
          <span className="text-[#C5A059] font-serif text-lg">02</span>
          <h2 className="font-serif text-lg font-semibold text-[#2B1519]">
            Pricing & Inventory
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="price">
              Selling Price (₹) *
            </label>

            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              className={inputClass}
              placeholder="14999"
              required
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="compareAtPrice">
              Original / MRP Price (₹)
            </label>

            <input
              id="compareAtPrice"
              name="compareAtPrice"
              type="number"
              min="0"
              step="0.01"
              value={form.compareAtPrice}
              onChange={handleChange}
              className={inputClass}
              placeholder="19999"
            />
            <p className="mt-1.5 text-xs text-[#8A7879]">
              Optional. If higher than selling price, a discount badge will be displayed.
            </p>
          </div>

          <div>
            <label className={labelClass} htmlFor="stock">
              Available Inventory Stock *
            </label>

            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={handleChange}
              className={inputClass}
              placeholder="12"
              required
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="sku">
              SKU (Stock Keeping Unit) *
            </label>

            <input
              id="sku"
              name="sku"
              value={form.sku}
              onChange={handleChange}
              className={inputClass}
              maxLength={50}
              placeholder="AOS-NKL-001"
              required
            />
          </div>
        </div>
      </section>

      {/* Photography Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2.5 border-b border-[#E8DFD5] pb-3.5">
          <span className="text-[#C5A059] font-serif text-lg">03</span>
          <h2 className="font-serif text-lg font-semibold text-[#2B1519]">
            Photography & Media
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="sm:col-span-2 space-y-4">
            <div>
              <label className={labelClass} htmlFor="imageUrl">
                Primary Image URL *
              </label>

              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                value={form.imageUrl}
                onChange={handleChange}
                className={inputClass}
                placeholder="https://images.unsplash.com/photo-... or Cloudinary URL"
                required
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="publicId">
                Image Reference Identifier
              </label>

              <input
                id="publicId"
                name="publicId"
                value={form.publicId}
                onChange={handleChange}
                className={inputClass}
                placeholder="img-ref-001"
              />

              <p className="mt-1.5 text-xs text-[#8A7879]">
                Media asset identifier for Cloudinary or storage tracking.
              </p>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#DFD4C7] bg-[#FAF7F2] p-4 text-center">
            {form.imageUrl ? (
              <div className="relative h-44 w-full overflow-hidden rounded-lg border border-[#E8DFD5]">
                <Image
                  src={form.imageUrl}
                  alt="Product preview"
                  fill
                  unoptimized
                  sizes="200px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="py-8 text-xs text-[#8A7879]">
                <span className="block text-2xl text-[#C5A059] mb-1">◇</span>
                <span>Image preview will render here</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Setting */}
      <section className="rounded-xl border border-[#E8DFD5] bg-[#FAF7F2]/50 p-5">
        <label className="flex cursor-pointer items-center gap-3.5">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={handleFeaturedChange}
            className="h-4 w-4 accent-[#6B1D2F] rounded"
          />

          <div>
            <span className="text-sm font-semibold text-[#2B1519]">
              Feature this piece on homepage bestsellers & collections
            </span>
            <p className="text-xs text-[#8A7879]">
              Featured jewellery items receive prominent placement on the storefront.
            </p>
          </div>
        </label>
      </section>

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-800"
        >
          {error}
        </div>
      )}

      {/* Submit / Cancel Actions */}
      <div className="flex flex-wrap gap-4 border-t border-[#E8DFD5] pt-6">
        <button
          type="submit"
          disabled={submitting || loadingCategories || categories.length === 0}
          className="rounded-xl bg-[#6B1D2F] px-8 py-3.5 text-sm font-semibold text-white shadow-xs transition hover:bg-[#541524] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? isEditMode
              ? "Saving Changes…"
              : "Creating Listing…"
            : isEditMode
              ? "Update Jewellery Listing"
              : "Publish Jewellery Listing"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-xl border border-[#DFD4C7] bg-[#FAF7F2] px-8 py-3.5 text-sm font-semibold text-[#2B1519] transition hover:bg-white hover:border-[#6B1D2F]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
