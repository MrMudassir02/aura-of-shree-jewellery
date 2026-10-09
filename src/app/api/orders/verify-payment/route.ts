import crypto from "crypto";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { orderUseCases } from "@/server/use-cases/OrderUseCases";

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

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

    if (
      typeof razorpayOrderId !== "string" ||
      typeof razorpayPaymentId !== "string" ||
      typeof razorpaySignature !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment verification data",
        },
        { status: 400 },
      );
    }

    const order =
      await orderUseCases.getOrderByRazorpayOrderId(razorpayOrderId);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        { status: 404 },
      );
    }

    if (!Types.ObjectId.isValid(session.user.id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user ID",
        },
        { status: 400 },
      );
    }

    if (order.user.toString() !== session.user.id) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to verify this order",
        },
        { status: 403 },
      );
    }

    if (order.paymentStatus === "paid") {
      return NextResponse.json({
        success: true,
        message: "Payment already verified",
        orderId: order._id.toString(),
      });
    }

    if (order.paymentStatus !== "pending") {
      return NextResponse.json(
        {
          success: false,
          message: "Order is not awaiting payment",
        },
        { status: 409 },
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment gateway is not configured yet",
        },
        { status: 503 },
      );
    }
    

    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    const generatedSignatureBuffer = Buffer.from(generatedSignature, "utf8");

    const providedSignatureBuffer = Buffer.from(razorpaySignature, "utf8");

    const signaturesMatch =
      generatedSignatureBuffer.length === providedSignatureBuffer.length &&
      crypto.timingSafeEqual(generatedSignatureBuffer, providedSignatureBuffer);


    if (!signaturesMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment verification failed",
        },
        { status: 400 },
      );
    }

    await orderUseCases.updateOrder(order._id.toString(), {
      razorpayPaymentId,
      razorpaySignature,
    });

    const updatedOrder = await orderUseCases.confirmPaidOrder(
      order._id.toString(),
    );

    if (!updatedOrder) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update order",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      orderId: updatedOrder._id.toString(),
    });
  } catch (error) {
    console.error("Verify payment error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to verify payment",
      },
      { status: 500 },
    );
  }
}
