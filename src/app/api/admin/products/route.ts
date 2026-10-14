import { Types } from "mongoose";
import { MongoServerError } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/require-admin";
import { productUseCases } from "@/server/use-cases/ProductUseCases";
import { createProductSchema } from "@/server/validators/product";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) return NextResponse.json({ success: false, message: auth.status === 401 ? "Authentication required" : "Admin access required" }, { status: auth.status });
    const params = request.nextUrl.searchParams;
    const page = Math.max(1, Number(params.get("page") || 1));
    const limit = Math.min(50, Math.max(1, Number(params.get("limit") || 10)));
    const result = await productUseCases.getAdminProducts({
      search: params.get("search") || "",
      category: params.get("category") || "",
      status: params.get("status") || "ALL",
      skip: (page - 1) * limit,
      limit,
    });
    return NextResponse.json({ success: true, ...result, page, limit, pages: Math.max(1, Math.ceil(result.total / limit)) });
  } catch (error) {
    console.error("Admin products GET error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) return NextResponse.json({ success: false, message: auth.status === 401 ? "Authentication required" : "Admin access required" }, { status: auth.status });
    const parsed = createProductSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, message: "Invalid product data", errors: parsed.error.flatten() }, { status: 400 });
    const { category, ...productData } = parsed.data;
    if (!Types.ObjectId.isValid(category)) return NextResponse.json({ success: false, message: "Invalid category ID" }, { status: 400 });
    const product = await productUseCases.createProduct({ ...productData, category: new Types.ObjectId(category), status: "ACTIVE", isActive: true } as never);
    return NextResponse.json({ success: true, message: "Product created successfully", product }, { status: 201 });
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) return NextResponse.json({ success: false, message: "A product with this SKU or slug already exists." }, { status: 409 });
    console.error("Admin products POST error:", error);
    return NextResponse.json({ success: false, message: "Failed to create product" }, { status: 500 });
  }
}
