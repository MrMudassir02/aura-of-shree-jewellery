import { NextResponse } from "next/server";

import { requireAdmin } from "@/server/auth/require-admin";
import { categoryUseCases } from "@/server/use-cases/CategoryUseCases";

export async function GET() {
  try {
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

    const categories = await categoryUseCases.getCategories();

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Admin categories GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}
