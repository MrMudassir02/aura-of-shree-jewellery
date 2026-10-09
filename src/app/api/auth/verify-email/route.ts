import { NextResponse } from "next/server";

import { authUseCases } from "@/server/use-cases/AuthUseCases";
import { verifyEmailOtpSchema } from "@/server/validators/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = verifyEmailOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid verification details",
        },
        { status: 400 },
      );
    }

    const { email, otp } = parsed.data;
    const rateLimit = await checkRateLimit(
      `verify-email:${email}`,
      5,
      15 * 60 * 1000,
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many verification attempts. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimit.retryAfter.toString(),
          },
        },
      );
    }

    const verified = await authUseCases.verifyEmailOtp(email, otp);

    if (!verified) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired verification code",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Email verified successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Email verification error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to verify email",
      },
      { status: 500 },
    );
  }
}
