"use client";

import { signOut } from "next-auth/react";

export default function AccountActions() {
  return (
    <button
      type="button"
      onClick={() =>
        signOut({
          callbackUrl: "/",
        })
      }
      className="hidden text-sm transition hover:text-[#9A7545] sm:inline"
    >
      Logout
    </button>
  );
}
