"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ProductActionsProps = {
  productId: string;
  productName: string;
};

export default function ProductActions({
  productId,
  productName,
}: ProductActionsProps) {
  const router = useRouter();

  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${productName}"?`,
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setDeleting(true);

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete product");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => router.push(`/admin/products/${productId}/edit`)}
        className="rounded-lg border border-[#DFD4C7] bg-white px-3 py-1.5 text-xs font-semibold text-[#6B1D2F] transition hover:bg-[#FAF7F2] hover:border-[#6B1D2F]"
      >
        Edit
      </button>

      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="rounded-lg border border-red-200 bg-red-50/50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {deleting ? "Deleting…" : "Delete"}
      </button>

      {error && (
        <span role="alert" className="text-xs text-red-700">
          {error}
        </span>
      )}
    </div>
  );
}
