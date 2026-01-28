import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { ApiError, handleApiError } from "../../lib/error-handler";

export async function GET(request: NextRequest) {
  try {
    // Get the current session using getSession()
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw new ApiError("Failed to get session", 500);
    }

    if (!sessionData.session) {
      throw new ApiError("No active session found", 401);
    }

    const user = sessionData.session.user;

    // Check if email is verified
    if (!user.email_confirmed_at) {
      return NextResponse.json({
        verified: false,
        message: "Email not verified",
        user: {
          id: user.id,
          email: user.email,
          email_confirmed_at: user.email_confirmed_at,
        },
      });
    }

    // Email is verified
    return NextResponse.json({
      verified: true,
      message: "Email verified successfully",
      user: {
        id: user.id,
        email: user.email,
        email_confirmed_at: user.email_confirmed_at,
      },
      session: sessionData.session,
    });

  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Optionally accept a token in the request body for verification
    if (body.token) {
      // Verify the token and get session
      const { data: sessionData, error: sessionError } = await supabase.auth.getUser(body.token);

      if (sessionError) {
        throw new ApiError("Invalid token", 401);
      }

      if (!sessionData.user) {
        throw new ApiError("User not found", 404);
      }

      const user = sessionData.user;

      return NextResponse.json({
        verified: !!user.email_confirmed_at,
        message: user.email_confirmed_at ? "Email verified" : "Email not verified",
        user: {
          id: user.id,
          email: user.email,
          email_confirmed_at: user.email_confirmed_at,
        },
      });
    }

    // If no token, fall back to session-based verification
    return await GET(request);

  } catch (error) {
    return handleApiError(error);
  }
}