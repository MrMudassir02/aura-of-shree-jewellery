import { Types } from "mongoose";
import { MongoServerError } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/server/auth/require-admin";
import { productUseCases } from "@/server/use-cases/ProductUseCases";
import {
  createProductSchema,
  productQuerySchema,
} from "@/server/validators/product";

export async function GET(request: NextRequest) {
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

    const query = productQuerySchema.safeParse(
      Object.fromEntries(request.nextUrl.searchParams),
    );

    if (!query.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid query parameters",
        },
        { status: 400 },
      );
    }

    const products = await productUseCases.getProducts({
      category: query.data.category,
      featured: query.data.featured,
      limit: query.data.limit,
      skip: query.data.skip,
    });

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Admin products GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();

    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product data",
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { category, ...productData } = parsed.data;

    if (!Types.ObjectId.isValid(category)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid category ID",
        },
        { status: 400 },
      );
    }

    const product = await productUseCases.createProduct({
      ...productData,
      category: new Types.ObjectId(category),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        product,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Admin products POST error:", error);

    if (error instanceof MongoServerError && error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern ?? {})[0];

      const message =
        duplicateField === "slug"
          ? "A product with this slug already exists."
          : duplicateField === "sku"
            ? "A product with this SKU already exists."
            : "A product with this unique value already exists.";

      return NextResponse.json(
        {
          success: false,
          message,
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create product",
      },
      { status: 500 },
    );
  }
}
