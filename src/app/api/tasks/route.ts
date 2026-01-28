import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { authenticateRequest } from '../lib/auth-middleware';
import { ApiError, handleApiError } from '../lib/error-handler';
import { validateTaskData } from '../lib/validation';

export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await authenticateRequest(request);
    if (authError) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');
    const sortField = searchParams.get('sortField') || 'created_at';
    const sortDirection = searchParams.get('sortDirection') || 'desc';

    // Build Supabase query
    let query = supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user!.id);

    // Apply filters
    if (status) {
      query = query.eq("status", status);
    }
    if (priority) {
      query = query.eq("priority", priority);
    }
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,description.ilike.%${search}%`
      );
    }

    // Apply sorting
    query = query.order(sortField, { ascending: sortDirection === "asc" });

    const { data: tasks, error } = await query;

    if (error) {
      throw new ApiError('Failed to fetch tasks', 500);
    }

    return NextResponse.json({ tasks });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await authenticateRequest(request);
    if (authError) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    const body = await request.json();
    validateTaskData(body);

    const taskData = {
      title: body.title.trim(),
      description: body.description?.trim() || null,
      status: body.status || 'pending',
      priority: body.priority || 'medium',
      user_id: user!.id,
    };

    const { data: task, error } = await supabase
      .from('tasks')
      .insert(taskData)
      .select()
      .single();

    if (error) {
      throw new ApiError('Failed to create task', 500);
    }

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}