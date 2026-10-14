import { Types } from "mongoose";
import { MongoServerError } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/require-admin";
import { productUseCases } from "@/server/use-cases/ProductUseCases";
import { updateProductSchema } from "@/server/validators/product";

type RouteContext = { params: Promise<{ id: string }> };
function authError(status: 401 | 403) {
  return NextResponse.json({ success: false, message: status === 401 ? "Authentication required" : "Admin access required" }, { status });
}
export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) return authError(auth.status);
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) return NextResponse.json({ success: false, message: "Invalid product ID" }, { status: 400 });
    const product = await productUseCases.getProductById(id);
    if (!product) return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to fetch product" }, { status: 500 });
  }
}
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) return authError(auth.status);
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) return NextResponse.json({ success: false, message: "Invalid product ID" }, { status: 400 });
    const parsed = updateProductSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, message: "Invalid product data", errors: parsed.error.flatten() }, { status: 400 });
    const { category, ...data } = parsed.data;
    if (category !== undefined && !Types.ObjectId.isValid(category)) return NextResponse.json({ success: false, message: "Invalid category ID" }, { status: 400 });
    const update = { ...data, ...(category ? { category: new Types.ObjectId(category) } : {}) };
    const product = await productUseCases.updateProduct(id, update as never);
    if (!product) return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Product updated.", product });
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) return NextResponse.json({ success: false, message: "A product with this SKU or slug already exists." }, { status: 409 });
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to update product" }, { status: 500 });
  }
}
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) return authError(auth.status);
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) return NextResponse.json({ success: false, message: "Invalid product ID" }, { status: 400 });
    const product = await productUseCases.deleteProduct(id);
    if (!product) return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Product archived." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to archive product" }, { status: 500 });
  }
}
