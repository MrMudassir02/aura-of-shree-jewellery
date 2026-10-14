import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/server/auth/require-admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Atelier | Aura of Shree Jewellery",
  description: "Aura of Shree Jewellery atelier administration and catalogue management.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    redirect("/login");
  }

  return <AdminShell user={auth.user}>{children}</AdminShell>;
}

