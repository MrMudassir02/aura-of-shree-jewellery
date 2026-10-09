import { NextResponse } from "next/server";

import { authUseCases } from "@/server/use-cases/AuthUseCases";
import { registerSchema } from "@/server/validators/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendOtpEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid registration details",
        },
        { status: 400 },
      );
    }

    const { name, email, password } = parsed.data;
    const rateLimit = await checkRateLimit(
      `register:${email}`,
      3,
      15 * 60 * 1000,
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many registration attempts. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimit.retryAfter.toString(),
          },
        },
      );
    }

    const user = await authUseCases.register({
      name,
      email,
      password,
    });

    const otp = await authUseCases.generateEmailVerificationOtp(email);

    await sendOtpEmail(email, otp, "email_verification");

    return NextResponse.json(
      {
        success: true,
        message: "Account created. Please verify your email using the OTP.",
        user,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
      return NextResponse.json(
        {
          success: false,
          message: "Unable to create account",
        },
        { status: 400 },
      );
    }

    console.error("Registration error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create account",
      },
      { status: 500 },
    );
  }
}
