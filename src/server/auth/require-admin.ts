import { getServerSession } from "next-auth";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { userRepository } from "@/server/repositories/UserRepository";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return {
      authorized: false as const,
      status: 401 as const,
    };
  }

  // Do not trust a role stored only in a potentially stale JWT.
  const user = await userRepository.findById(userId);

  if (
    !user ||
    !user.isActive ||
    !user.isEmailVerified ||
    user.role !== "admin"
  ) {
    return {
      authorized: false as const,
      status: 403 as const,
    };
  }

  return {
    authorized: true as const,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    },
  };
}
