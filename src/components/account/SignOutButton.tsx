"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

export default function SignOutButton() {
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    await signOut({ callbackUrl: "/" });
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/60 px-6 py-3 text-xs font-bold uppercase tracking-wider text-red-700 shadow-2xs transition hover:bg-red-100 disabled:opacity-50"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
      </svg>
      <span>{loading ? "Signing out…" : "Sign Out of Account"}</span>
    </button>
  );
}

