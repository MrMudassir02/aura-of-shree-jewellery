import { Types } from "mongoose";
import { MongoServerError } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/server/auth/require-admin";
import { productUseCases } from "@/server/use-cases/ProductUseCases";
import { updateProductSchema } from "@/server/validators/product";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function unauthorizedResponse(status: number) {
  return NextResponse.json(
    {
      success: false,
      message:
        status === 401 ? "Authentication required" : "Admin access required",
    },
    {
      status,
    },
  );
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return unauthorizedResponse(auth.status);
    }

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product ID",
        },
        {
          status: 400,
        },
      );
    }

    const product = await productUseCases.getProductById(id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Admin product GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch product",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return unauthorizedResponse(auth.status);
    }

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product ID",
        },
        {
          status: 400,
        },
      );
    }

    const body = await request.json();

    const parsed = updateProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product data",
          errors: parsed.error.flatten(),
        },
        {
          status: 400,
        },
      );
    }

    const { category, ...productData } = parsed.data;

    // Validate the category BEFORE creating the ObjectId.
    if (category !== undefined && !Types.ObjectId.isValid(category)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid category ID",
        },
        {
          status: 400,
        },
      );
    }

    const updateData = {
      ...productData,
      ...(category !== undefined
        ? {
            category: new Types.ObjectId(category),
          }
        : {}),
    };

    const product = await productUseCases.updateProduct(id, updateData);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Admin product PATCH error:", error);

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
        {
          status: 409,
        },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update product",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return unauthorizedResponse(auth.status);
    }

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product ID",
        },
        {
          status: 400,
        },
      );
    }

    const product = await productUseCases.deleteProduct(id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Admin product DELETE error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete product",
      },
      {
        status: 500,
      },
    );
  }
}
