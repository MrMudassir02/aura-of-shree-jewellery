import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import CheckoutClient from "@/components/checkout/CheckoutClient";

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/checkout");
  }

  return <CheckoutClient />;
}
