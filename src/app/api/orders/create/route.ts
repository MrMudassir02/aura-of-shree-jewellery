import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

import { orderUseCases } from "@/server/use-cases/OrderUseCases";
import { createOrderSchema } from "@/server/validators/order";
import {
  getRazorpayClient,
  getRazorpayKeyId,
} from "@/server/payments/razorpay";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
        },
        { status: 401 },
      );
    }

    const body = await request.json();

    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order data",
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const preparedOrder = await orderUseCases.prepareOrder(
      session.user.id,
      parsed.data.items,
      parsed.data.shippingAddress,
    );

    if (!Types.ObjectId.isValid(session.user.id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user ID",
        },
        { status: 400 },
      );
    }

    const razorpay = getRazorpayClient();

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(preparedOrder.total * 100),
      currency: "INR",
      receipt: `aura_${Date.now()}`,
    });

    const order = await orderUseCases.createOrder({
      ...preparedOrder,
      user: new Types.ObjectId(session.user.id),
      razorpayOrderId: razorpayOrder.id,
      status: "pending",
      paymentStatus: "pending",
    });

    return NextResponse.json(
      {
        success: true,
        order: {
          id: order._id.toString(),
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          razorpayOrderId: razorpayOrder.id,
          razorpayKeyId: getRazorpayKeyId(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create order error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to create order";

    if (message.includes("Razorpay credentials")) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment gateway is not configured yet",
        },
        { status: 503 },
      );
    }

    if (message.includes("Insufficient stock")) {
      return NextResponse.json(
        {
          success: false,
          message,
        },
        { status: 409 },
      );
    }

    if (message.includes("unavailable") || message.includes("not found")) {
      return NextResponse.json(
        {
          success: false,
          message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create order",
      },
      { status: 500 },
    );
  }
}
