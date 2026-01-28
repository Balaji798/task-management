import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { authenticateRequest } from "../../lib/auth-middleware";
import { ApiError, handleApiError } from "../../lib/error-handler";
import { validateTaskData } from "../../lib/validation";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;
    const { user, error: authError } = await authenticateRequest(request);
    if (authError) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    const { data: task, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .eq("user_id", user!.id)
      .single();

    if (error) {
      throw new ApiError("Task not found", 404);
    }

    return NextResponse.json({ task });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;
    const { user, error: authError } = await authenticateRequest(request);
    if (authError) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    const body = await request.json();
    validateTaskData(body);

    // Check if task exists and belongs to user
    const { data: existingTask, error: fetchError } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .eq("user_id", user!.id)
      .single();

    if (fetchError || !existingTask) {
      throw new ApiError("Task not found", 404);
    }

    const updateData = {
      title: body.title.trim(),
      description: body.description?.trim() || null,
      status: body.status,
      priority: body.priority,
      updated_at: new Date().toISOString(),
    };

    const { data: task, error } = await supabase
      .from("tasks")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new ApiError("Failed to update task", 500);
    }

    return NextResponse.json({ task });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;
    const { user, error: authError } = await authenticateRequest(request);
    if (authError) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    // Check if task exists and belongs to user
    const { data: existingTask, error: fetchError } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .eq("user_id", user!.id)
      .single();

    if (fetchError || !existingTask) {
      throw new ApiError("Task not found", 404);
    }

    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      throw new ApiError("Failed to delete task", 500);
    }

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}
