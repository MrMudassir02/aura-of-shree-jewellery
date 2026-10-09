import { NextResponse } from "next/server";

import { authUseCases } from "@/server/use-cases/AuthUseCases";
import { resetPasswordSchema } from "@/server/validators/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid password reset details",
        },
        { status: 400 },
      );
    }

    const { email, otp, password } = parsed.data;
    const rateLimit = await checkRateLimit(
      `reset-password:${email}`,
      5,
      15 * 60 * 1000,
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many reset attempts. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimit.retryAfter.toString(),
          },
        },
      );
    }

    const reset = await authUseCases.resetPassword(email, otp, password);

    if (!reset) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired password reset code",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Password reset successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Password reset error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to reset password",
      },
      { status: 500 },
    );
  }
}
