"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type ProductRow = {
  _id: string;
  name: string;
  sku: string;
  slug: string;
  price: number;
  stock: number;
  isActive: boolean;
  status?: "ACTIVE" | "DRAFT" | "ARCHIVED";
  isSample?: boolean;
  images?: Array<{ url: string }>;
  category?: { _id?: string; name?: string; slug?: string } | string;
};

type Category = { _id: string; name: string };

const statusOf = (p: ProductRow) =>
  p.status || (p.isActive ? "ACTIVE" : "DRAFT");

export default function ProductDashboard({
  categories,
}: {
  categories: Category[];
}) {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [savingId, setSavingId] = useState("");
  const [inline, setInline] = useState<
    Record<string, { price: string; stock: string }>
  >({});
  const limit = 10;

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
        category,
        status,
      });
      const res = await fetch(`/api/admin/products?${query}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Could not load products.");
      }
      setProducts(data.products);
      setPages(data.pages);
      setTotal(data.total);
      setSelected([]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load products.");
    } finally {
      setLoading(false);
    }
  }, [page, search, category, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void load();
    }, 250);
    return () => clearTimeout(timer);
  }, [load]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  }

  async function patch(
    id: string,
    body: Record<string, unknown>,
    success: string,
  ) {
    setSavingId(id);
    setError("");
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Save failed.");
      }
      notify(success);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSavingId("");
    }
  }

  async function bulk(action: string) {
    if (!selected.length) {
      notify("Select at least one product.");
      return;
    }
    if (
      action === "DELETE" &&
      !window.confirm(
        `Permanently delete ${selected.length} selected jewellery products?`,
      )
    ) {
      return;
    }
    setError("");
    try {
      const res = await fetch("/api/admin/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selected, action }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Bulk action failed.");
      }
      notify(data.message);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bulk action failed.");
    }
  }

  async function inlineSave(p: ProductRow) {
    const values = inline[p._id] || {
      price: String(p.price),
      stock: String(p.stock),
    };
    const price = Number(values.price);
    const stock = Number(values.stock);
    if (
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      setError(
        "Price must be non-negative and stock must be a non-negative whole number.",
      );
      return;
    }
    await patch(p._id, { price, stock }, "Price and stock saved.");
    setInline((old) => {
      const copy = { ...old };
      delete copy[p._id];
      return copy;
    });
  }

  const inputStyle =
    "w-full rounded-xl border border-[#E8DFD5] bg-white px-4 py-2.5 text-sm text-[#2B1519] placeholder-[#8A7879] outline-none transition focus:border-[#6B1D2F] focus:ring-2 focus:ring-[#6B1D2F]/10";

  return (
    <section className="space-y-5">
      {/* Toast Alert */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-[#541524] border border-[#C5A059]/40 px-5 py-3 text-sm text-[#FAF7F2] shadow-2xl"
        >
          <span className="text-[#C5A059]">◆</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div
          role="alert"
          className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-800"
        >
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="text-base font-bold text-red-800 hover:text-red-950"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input
          className={inputStyle}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name or SKU…"
          aria-label="Search name or SKU"
        />

        <select
          className={inputStyle}
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          aria-label="Filter category"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          className={inputStyle}
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          aria-label="Filter status"
        >
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active (Live)</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </select>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6B1D2F] px-4 py-2.5 text-center text-sm font-semibold text-white shadow-xs transition hover:bg-[#541524]"
        >
          <span>＋ Add Product</span>
        </Link>
      </div>

      {/* Bulk Operations Toolbar */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#E8DFD5] bg-white p-3.5 shadow-xs">
        <span className="mr-2 text-xs font-semibold text-[#6B1D2F]">
          {selected.length} selected
        </span>

        <button
          onClick={() => void bulk("ACTIVE")}
          className="rounded-lg border border-[#E8DFD5] bg-[#FAF7F2] px-3 py-1.5 text-xs font-semibold text-[#2B1519] transition hover:border-[#6B1D2F] hover:text-[#6B1D2F]"
        >
          Activate
        </button>

        <button
          onClick={() => void bulk("ARCHIVED")}
          className="rounded-lg border border-[#E8DFD5] bg-[#FAF7F2] px-3 py-1.5 text-xs font-semibold text-[#524043] transition hover:border-[#8A7879]"
        >
          Archive
        </button>

        <button
          onClick={() => void bulk("DELETE")}
          className="rounded-lg border border-red-200 bg-red-50/50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100"
        >
          Delete selected
        </button>

        <span className="ml-auto text-xs text-[#8A7879] font-medium">
          {total} products in catalogue
        </span>
      </div>

      {/* Table & Data Representation */}
      {loading ? (
        <div
          className="rounded-2xl border border-[#E8DFD5] bg-white p-14 text-center text-sm text-[#8A7879]"
          role="status"
        >
          <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-[#6B1D2F] border-t-transparent" />
          <p>Loading jewellery collection…</p>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-[#E8DFD5] bg-white p-14 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FAF7F2] text-[#C5A059] text-xl">
            ◇
          </div>
          <h2 className="font-serif text-2xl text-[#2B1519]">
            No jewellery products found
          </h2>
          <p className="mt-2 text-sm text-[#8A7879]">
            Try adjusting your search criteria or add a new piece to your
            catalogue.
          </p>
          <Link
            href="/admin/products/new"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#6B1D2F] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#541524]"
          >
            ＋ Add First Product
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#E8DFD5] bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-[#FAF7F2] border-b border-[#E8DFD5] text-[11px] font-semibold uppercase tracking-wider text-[#6B1D2F]">
                <tr>
                  <th className="p-4 w-12 text-center">
                    <input
                      type="checkbox"
                      aria-label="Select all on this page"
                      className="accent-[#6B1D2F] h-4 w-4 rounded"
                      checked={
                        products.length > 0 &&
                        products.every((p) => selected.includes(p._id))
                      }
                      onChange={(e) =>
                        setSelected(
                          e.target.checked ? products.map((p) => p._id) : [],
                        )
                      }
                    />
                  </th>
                  <th className="p-4">Product Details</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price (₹)</th>
                  <th className="p-4">Inventory</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5ECE1]">
                {products.map((p) => {
                  const currentStatus = statusOf(p);
                  const values = inline[p._id] || {
                    price: String(p.price),
                    stock: String(p.stock),
                  };
                  const categoryName =
                    typeof p.category === "object" ? p.category?.name : "";

                  return (
                    <tr
                      key={p._id}
                      className="hover:bg-[#FAF7F2]/40 transition duration-100 align-middle"
                    >
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          aria-label={`Select ${p.name}`}
                          className="accent-[#6B1D2F] h-4 w-4 rounded"
                          checked={selected.includes(p._id)}
                          onChange={(e) =>
                            setSelected((old) =>
                              e.target.checked
                                ? [...old, p._id]
                                : old.filter((id) => id !== p._id),
                            )
                          }
                        />
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-3.5">
                          <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-[#FAF7F2] border border-[#E8DFD5]">
                            {p.images?.[0]?.url && (
                              <Image
                                src={p.images[0].url}
                                alt=""
                                fill
                                unoptimized
                                sizes="48px"
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-[#2B1519]">
                              {p.name}
                            </p>
                            <p className="mt-1 flex items-center gap-1.5 text-xs text-[#8A7879]">
                              <span>{p.sku}</span>
                              {p.isSample && (
                                <span className="rounded bg-[#FAF7F2] border border-[#DFD4C7] px-1.5 py-0.2 text-[10px] font-semibold text-[#6B1D2F]">
                                  SAMPLE
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="text-xs font-medium text-[#524043]">
                          {categoryName || "—"}
                        </span>
                      </td>

                      <td className="p-4">
                        <input
                          className="w-28 rounded-lg border border-[#E8DFD5] bg-[#FAF7F2]/40 px-2.5 py-1.5 text-xs text-[#2B1519] outline-none focus:bg-white focus:border-[#6B1D2F] focus:ring-1 focus:ring-[#6B1D2F]"
                          aria-label={`Price for ${p.name}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={values.price}
                          onChange={(e) =>
                            setInline((old) => ({
                              ...old,
                              [p._id]: { ...values, price: e.target.value },
                            }))
                          }
                        />
                      </td>

                      <td className="p-4">
                        <input
                          className="w-20 rounded-lg border border-[#E8DFD5] bg-[#FAF7F2]/40 px-2.5 py-1.5 text-xs text-[#2B1519] outline-none focus:bg-white focus:border-[#6B1D2F] focus:ring-1 focus:ring-[#6B1D2F]"
                          aria-label={`Stock for ${p.name}`}
                          type="number"
                          min="0"
                          step="1"
                          value={values.stock}
                          onChange={(e) =>
                            setInline((old) => ({
                              ...old,
                              [p._id]: { ...values, stock: e.target.value },
                            }))
                          }
                        />
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            currentStatus === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200/80"
                              : currentStatus === "ARCHIVED"
                                ? "bg-stone-100 text-stone-700 border border-stone-200"
                                : "bg-amber-50 text-amber-800 border border-amber-200/80"
                          }`}
                        >
                          {currentStatus}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            disabled={savingId === p._id}
                            onClick={() => void inlineSave(p)}
                            className="rounded-lg border border-[#DFD4C7] bg-[#FAF7F2] px-2.5 py-1.5 text-xs font-medium text-[#2B1519] transition hover:border-[#6B1D2F] hover:text-[#6B1D2F] disabled:opacity-50"
                          >
                            {savingId === p._id ? "Saving…" : "Save Quick"}
                          </button>

                          <select
                            aria-label={`Status for ${p.name}`}
                            className="rounded-lg border border-[#DFD4C7] bg-white px-2 py-1.5 text-xs text-[#2B1519] outline-none focus:border-[#6B1D2F]"
                            value={currentStatus}
                            onChange={(e) =>
                              void patch(
                                p._id,
                                { status: e.target.value },
                                "Product status updated.",
                              )
                            }
                          >
                            <option value="ACTIVE">Active</option>
                            <option value="DRAFT">Draft</option>
                            <option value="ARCHIVED">Archived</option>
                          </select>

                          <Link
                            href={`/admin/products/${p._id}/edit`}
                            className="rounded-lg border border-[#6B1D2F] bg-white px-3 py-1.5 text-xs font-medium text-[#6B1D2F] transition hover:bg-[#6B1D2F] hover:text-white"
                          >
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-between gap-3 text-sm pt-2">
        <span className="text-xs text-[#8A7879] font-medium">
          Showing Page {page} of {pages}
        </span>
        <div className="flex gap-2">
          <button
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-xl border border-[#E8DFD5] bg-white px-4 py-2 text-xs font-medium text-[#2B1519] transition hover:bg-[#FAF7F2] hover:border-[#6B1D2F] disabled:opacity-40"
          >
            ← Previous
          </button>
          <button
            disabled={page >= pages || loading}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-xl border border-[#E8DFD5] bg-white px-4 py-2 text-xs font-medium text-[#2B1519] transition hover:bg-[#FAF7F2] hover:border-[#6B1D2F] disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>
    </section>
  );
}
