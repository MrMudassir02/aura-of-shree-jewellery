import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/require-admin";
import { productUseCases } from "@/server/use-cases/ProductUseCases";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) return NextResponse.json({ success: false, message: auth.status === 401 ? "Authentication required" : "Admin access required" }, { status: auth.status });
    const body = await request.json();
    const ids = Array.isArray(body.ids) ? body.ids.filter((id: unknown) => typeof id === "string" && Types.ObjectId.isValid(id)) : [];
    const action = body.action;
    if (!ids.length) return NextResponse.json({ success: false, message: "Select at least one valid product." }, { status: 400 });
    if (action === "DELETE") {
      const result = await productUseCases.deleteProducts(ids);
      return NextResponse.json({ success: true, message: `${result.deletedCount ?? 0} products deleted.` });
    }
    if (!["ACTIVE", "DRAFT", "ARCHIVED"].includes(action)) return NextResponse.json({ success: false, message: "Unsupported bulk action." }, { status: 400 });
    const result = await productUseCases.setProductStatus(ids, action);
    return NextResponse.json({ success: true, message: `${result.modifiedCount} products updated.` });
  } catch (error) {
    console.error("Bulk product action failed:", error);
    return NextResponse.json({ success: false, message: "Bulk action failed." }, { status: 500 });
  }
}
