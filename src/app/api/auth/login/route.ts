import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { ApiError, handleApiError } from "../../lib/error-handler";
import { validateAuthData } from "../../lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    validateAuthData(body, "login");
    console.log("body", body);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });
    console.log("data", data);
    console.log("error", error);
    if (error) {
      if (error.message.includes("Email not confirmed")) {
        throw new ApiError("Please verify your email before logging in", 403);
      }
      throw new ApiError("Invalid credentials", 401);
    }

    return NextResponse.json({
      user: data.user,
      session: data.session,
      message: "Login successful",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
