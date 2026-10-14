"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type ProductRow = {
  _id: string; name: string; sku: string; slug: string; price: number; stock: number;
  isActive: boolean; status?: "ACTIVE" | "DRAFT" | "ARCHIVED"; isSample?: boolean;
  images?: Array<{ url: string }>; category?: { _id?: string; name?: string; slug?: string } | string;
};
type Category = { _id: string; name: string };
const money = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
const statusOf = (p: ProductRow) => p.status || (p.isActive ? "ACTIVE" : "DRAFT");

export default function ProductDashboard({ categories }: { categories: Category[] }) {
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
  const [inline, setInline] = useState<Record<string, { price: string; stock: string }>>({});
  const limit = 10;

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const query = new URLSearchParams({ page: String(page), limit: String(limit), search, category, status });
      const res = await fetch(`/api/admin/products?${query}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Could not load products.");
      setProducts(data.products); setPages(data.pages); setTotal(data.total); setSelected([]);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not load products."); }
    finally { setLoading(false); }
  }, [page, search, category, status]);

  useEffect(() => { const timer = setTimeout(() => { void load(); }, 250); return () => clearTimeout(timer); }, [load]);
  function notify(message: string) { setToast(message); window.setTimeout(() => setToast(""), 3000); }

  async function patch(id: string, body: Record<string, unknown>, success: string) {
    setSavingId(id); setError("");
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Save failed.");
      notify(success); await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Save failed."); }
    finally { setSavingId(""); }
  }

  async function bulk(action: string) {
    if (!selected.length) { notify("Select at least one product."); return; }
    if (action === "DELETE" && !window.confirm(`Permanently delete ${selected.length} selected products?`)) return;
    setError("");
    try {
      const res = await fetch("/api/admin/products/bulk", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: selected, action }) });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Bulk action failed.");
      notify(data.message); await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Bulk action failed."); }
  }

  async function inlineSave(p: ProductRow) {
    const values = inline[p._id] || { price: String(p.price), stock: String(p.stock) };
    const price = Number(values.price), stock = Number(values.stock);
    if (!Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) { setError("Price must be non-negative and stock must be a non-negative whole number."); return; }
    await patch(p._id, { price, stock }, "Price and stock saved.");
    setInline((old) => { const copy = { ...old }; delete copy[p._id]; return copy; });
  }

  const input = "w-full rounded-lg border border-[#DCCBB7] bg-white px-3 py-2 text-sm outline-none focus:border-[#3A1A1B]";
  return <section className="space-y-5">
    {toast && <div role="status" className="fixed right-4 top-4 z-50 rounded-lg bg-[#3A1A1B] px-4 py-3 text-sm text-white shadow-lg">{toast}</div>}
    {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}<button onClick={() => setError("")} className="float-right font-bold" aria-label="Dismiss error">×</button></div>}
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <input className={input} value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search name or SKU…" aria-label="Search name or SKU" />
      <select className={input} value={category} onChange={e => { setCategory(e.target.value); setPage(1); }} aria-label="Filter category"><option value="">All categories</option>{categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select>
      <select className={input} value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} aria-label="Filter status"><option value="ALL">All statuses</option><option value="ACTIVE">Active</option><option value="DRAFT">Draft</option><option value="ARCHIVED">Archived</option></select>
      <Link href="/admin/products/new" className="rounded-lg bg-[#3A1A1B] px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-[#542829]">+ Add product</Link>
    </div>
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-[#E8D8C4] bg-white p-3">
      <span className="mr-2 text-sm text-[#6B4A4A]">{selected.length} selected</span>
      <button onClick={() => void bulk("ACTIVE")} className="rounded-md border px-3 py-2 text-xs font-semibold">Activate</button>
      <button onClick={() => void bulk("ARCHIVED")} className="rounded-md border px-3 py-2 text-xs font-semibold">Archive</button>
      <button onClick={() => void bulk("DELETE")} className="rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-700">Delete selected</button>
      <span className="ml-auto text-xs text-[#806D60]">{total} products</span>
    </div>
    {loading ? <div className="rounded-xl bg-white p-12 text-center text-sm text-[#806D60]" role="status">Loading products…</div> :
    products.length === 0 ? <div className="rounded-xl border border-[#E8D8C4] bg-white p-12 text-center"><h2 className="font-serif text-2xl">No products found</h2><p className="mt-2 text-sm text-[#806D60]">Try changing your filters or add a product.</p><Link href="/admin/products/new" className="mt-5 inline-block rounded-lg bg-[#3A1A1B] px-5 py-3 text-sm text-white">Add product</Link></div> :
    <div className="overflow-hidden rounded-xl border border-[#E8D8C4] bg-white">
      <div className="overflow-x-auto"><table className="w-full min-w-[980px] text-left text-sm">
        <thead className="bg-[#F5EBDD] text-xs uppercase tracking-wide text-[#6B4A4A]"><tr>
          <th className="p-4"><input type="checkbox" aria-label="Select all on this page" checked={products.length > 0 && products.every(p => selected.includes(p._id))} onChange={e => setSelected(e.target.checked ? products.map(p => p._id) : [])} /></th>
          <th className="p-4">Product</th><th className="p-4">Category</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4">Status</th><th className="p-4">Actions</th>
        </tr></thead>
        <tbody>{products.map(p => {
          const currentStatus = statusOf(p); const values = inline[p._id] || { price: String(p.price), stock: String(p.stock) };
          const categoryName = typeof p.category === "object" ? p.category?.name : "";
          return <tr key={p._id} className="border-t border-[#F0E5D7] align-middle">
            <td className="p-4"><input type="checkbox" aria-label={`Select ${p.name}`} checked={selected.includes(p._id)} onChange={e => setSelected(old => e.target.checked ? [...old, p._id] : old.filter(id => id !== p._id))} /></td>
            <td className="p-4"><div className="flex items-center gap-3"><div className="relative h-14 w-12 shrink-0 overflow-hidden rounded bg-[#F5EBDD]">{p.images?.[0]?.url && <Image src={p.images[0].url} alt="" fill unoptimized sizes="48px" className="object-cover" />}</div><div><p className="font-semibold text-[#3A1A1B]">{p.name}</p><p className="mt-1 text-xs text-[#806D60]">{p.sku}{p.isSample ? " · SAMPLE" : ""}</p></div></div></td>
            <td className="p-4">{categoryName || "—"}</td>
            <td className="p-4"><input className="w-24 rounded border border-[#DCCBB7] px-2 py-1.5" aria-label={`Price for ${p.name}`} type="number" min="0" step="0.01" value={values.price} onChange={e => setInline(old => ({ ...old, [p._id]: { ...values, price: e.target.value } }))} /></td>
            <td className="p-4"><input className="w-20 rounded border border-[#DCCBB7] px-2 py-1.5" aria-label={`Stock for ${p.name}`} type="number" min="0" step="1" value={values.stock} onChange={e => setInline(old => ({ ...old, [p._id]: { ...values, stock: e.target.value } }))} /></td>
            <td className="p-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${currentStatus === "ACTIVE" ? "bg-green-100 text-green-800" : currentStatus === "ARCHIVED" ? "bg-gray-200 text-gray-700" : "bg-amber-100 text-amber-800"}`}>{currentStatus}</span></td>
            <td className="p-4"><div className="flex flex-wrap gap-2">
              <button disabled={savingId === p._id} onClick={() => void inlineSave(p)} className="rounded border px-2.5 py-1.5 text-xs disabled:opacity-50">{savingId === p._id ? "Saving…" : "Save price/stock"}</button>
              <select aria-label={`Status for ${p.name}`} className="max-w-28 rounded border px-2 py-1.5 text-xs" value={currentStatus} onChange={e => void patch(p._id, { status: e.target.value }, "Product status updated.")}><option value="ACTIVE">Active</option><option value="DRAFT">Draft</option><option value="ARCHIVED">Archived</option></select>
              <Link href={`/admin/products/${p._id}/edit`} className="rounded border px-2.5 py-1.5 text-xs">Edit</Link>
            </div></td>
          </tr>;
        })}</tbody>
      </table></div>
    </div>}
    <div className="flex items-center justify-between gap-3 text-sm"><span className="text-[#806D60]">Page {page} of {pages}</span><div className="flex gap-2"><button disabled={page <= 1 || loading} onClick={() => setPage(p => p - 1)} className="rounded border px-4 py-2 disabled:opacity-40">Previous</button><button disabled={page >= pages || loading} onClick={() => setPage(p => p + 1)} className="rounded border px-4 py-2 disabled:opacity-40">Next</button></div></div>
  </section>;
}
