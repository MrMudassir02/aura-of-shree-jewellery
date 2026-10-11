import { NextResponse } from "next/server";

import { checkRateLimit } from "@/lib/rate-limit";
import { sendOtpEmail } from "@/lib/email";
import { authUseCases } from "@/server/use-cases/AuthUseCases";
import { registerSchema } from "@/server/validators/auth";

const REGISTRATION_MESSAGE =
  "If this email can be registered, check your inbox for the next steps.";

function registrationResponse() {
  return NextResponse.json(
    {
      success: true,
      message: REGISTRATION_MESSAGE,
    },
    { status: 202 },
  );
}

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

    try {
      await authUseCases.register({
        name,
        email,
        password,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
        // Help an existing, unverified account without confirming its existence.
        const otp = await authUseCases.requestEmailVerificationOtp(email);

        if (otp) {
          await sendOtpEmail(email, otp, "email_verification");
        }

        return registrationResponse();
      }

      throw error;
    }

    const otp = await authUseCases.generateEmailVerificationOtp(email);
    await sendOtpEmail(email, otp, "email_verification");

    return registrationResponse();
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to process registration right now.",
      },
      { status: 500 },
    );
  }
}
