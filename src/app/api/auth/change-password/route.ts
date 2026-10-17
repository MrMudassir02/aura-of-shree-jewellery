import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { authUseCases } from "@/server/use-cases/AuthUseCases";
import { changePasswordSchema } from "@/server/validators/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be signed in to change your password.",
        },
        { status: 401 },
      );
    }

    const body = await request.json();
    const parsed = changePasswordSchema.safeParse(body);

    if (!parsed.success) {
      const errorMsg =
        parsed.error.issues[0]?.message || "Invalid password details provided.";
      return NextResponse.json(
        {
          success: false,
          message: errorMsg,
        },
        { status: 400 },
      );
    }

    const { currentPassword, newPassword } = parsed.data;

    const result = await authUseCases.changePassword(
      session.user.id,
      currentPassword,
      newPassword,
    );

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: result.message,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Change password route error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Unable to update password at this time. Please try again.",
      },
      { status: 500 },
    );
  }
}

