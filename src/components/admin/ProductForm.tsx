"use client";

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
            publicId: form.publicId.trim(),
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
    "mt-2 w-full rounded-lg border border-[#DCCBB7] bg-white px-4 py-3 text-sm text-[#3A1A1B] outline-none transition focus:border-[#3A1A1B] focus:ring-2 focus:ring-[#3A1A1B]/10";

  const labelClass = "text-sm font-medium text-[#3A1A1B]";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-xl bg-[#FFF9F0] p-6 shadow-sm sm:p-8"
    >
      <section className="space-y-5">
        <h2 className="border-b border-[#E8D8C4] pb-3 text-lg font-semibold">
          Basic Information
        </h2>

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
            placeholder="e.g. Traditional Gold Necklace"
            minLength={2}
            maxLength={150}
            required
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="slug">
            Product Slug *
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
            placeholder="traditional-gold-necklace"
            required
          />

          <p className="mt-2 text-xs text-[#806565]">
            Used in the product URL. Use lowercase letters, numbers, and
            hyphens.
          </p>
        </div>

        <div>
          <label className={labelClass} htmlFor="description">
            Description *
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
            placeholder="Describe the jewelry, materials, design, and details..."
            required
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="category">
            Category *
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
                  : "Select a category"}
            </option>

            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="border-b border-[#E8D8C4] pb-3 text-lg font-semibold">
          Pricing & Inventory
        </h2>

        <div className="grid gap-5 sm:grid-cols-2">
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
              placeholder="1499"
              required
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="compareAtPrice">
              Original Price (₹)
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
              placeholder="1999"
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="stock">
              Available Stock *
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
              placeholder="10"
              required
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="sku">
              SKU *
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

      <section className="space-y-5">
        <h2 className="border-b border-[#E8D8C4] pb-3 text-lg font-semibold">
          Product Image
        </h2>

        <div>
          <label className={labelClass} htmlFor="imageUrl">
            Image URL *
          </label>

          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            value={form.imageUrl}
            onChange={handleChange}
            className={inputClass}
            placeholder="https://example.com/product-image.jpg"
            required
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="publicId">
            Image Public ID *
          </label>

          <input
            id="publicId"
            name="publicId"
            value={form.publicId}
            onChange={handleChange}
            className={inputClass}
            placeholder="product-image-001"
            required
          />

          <p className="mt-2 text-xs text-[#806565]">
            Temporary field. Cloudinary integration will generate this
            automatically.
          </p>
        </div>
      </section>

      <section className="border-t border-[#E8D8C4] pt-6">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={handleFeaturedChange}
            className="h-4 w-4 accent-[#3A1A1B]"
          />

          <span className="text-sm font-medium">
            Feature this product on the storefront
          </span>
        </label>
      </section>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-4 border-t border-[#E8D8C4] pt-6">
        <button
          type="submit"
          disabled={submitting || loadingCategories || categories.length === 0}
          className="rounded-lg bg-[#3A1A1B] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#542829] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? isEditMode
              ? "Updating Product..."
              : "Creating Product..."
            : isEditMode
              ? "Update Product"
              : "Create Product"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-lg border border-[#DCCBB7] px-7 py-3 text-sm font-semibold text-[#3A1A1B] transition hover:bg-[#F5EBDD]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
