import { NextResponse } from "next/server";

import { requireAdmin } from "@/server/auth/require-admin";

export async function GET() {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return NextResponse.json(
      {
        success: false,
        message:
          auth.status === 401
            ? "Authentication required"
            : "Admin access required",
      },
      { status: auth.status },
    );
  }

  return NextResponse.json({
    success: true,
    message: "Admin access granted",
    user: auth.user,
  });
}
