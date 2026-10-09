"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function LogoutPage() {
  useEffect(() => {
    signOut({
      callbackUrl: "/",
    });
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5EBDD]">
      <p className="text-sm text-[#806D60]">
        Signing you out...
      </p>
    </main>
  );
}
