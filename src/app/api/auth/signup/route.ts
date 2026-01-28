import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { ApiError, handleApiError } from "../../lib/error-handler";
import { validateAuthData } from "../../lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    validateAuthData(body, "signup");

    const { data, error } = await supabase.auth.signUp({
      email: body.email,
      password: body.password,
    });

    if (error) {
      throw new ApiError(error.message, 400);
    }

    return NextResponse.json(
      {
        user: data.user,
        session: data.session,
        message: "Signup successful",
      },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
