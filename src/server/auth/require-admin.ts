import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      authorized: false as const,
      status: 401,
    };
  }

  if (session.user.role !== "admin") {
    return {
      authorized: false as const,
      status: 403,
    };
  }

  return {
    authorized: true as const,
    user: session.user,
  };
}
