import { NextResponse } from "next/server";

import { authUseCases } from "@/server/use-cases/AuthUseCases";
import { requestPasswordResetSchema } from "@/server/validators/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendOtpEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = requestPasswordResetSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email address",
        },
        { status: 400 },
      );
    }

    const { email } = parsed.data;
    const rateLimit = await checkRateLimit(
      `forgot-password:${email}`,
      5,
      15 * 60 * 1000,
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many requests. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimit.retryAfter.toString(),
          },
        },
      );
    }
    const otp = await authUseCases.generatePasswordResetOtp(email);

    if (otp) {
      await sendOtpEmail(email, otp, "password_reset");
    }

    // Intentionally generic response.
    // Do not reveal whether an account exists.
    return NextResponse.json(
      {
        success: true,
        message:
          "If an account exists for this email, a password reset code has been sent.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Password reset request error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to process password reset request",
      },
      { status: 500 },
    );
  }
}
