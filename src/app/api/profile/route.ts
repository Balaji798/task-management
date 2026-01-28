import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { authenticateRequest } from '../lib/auth-middleware';
import { handleApiError, ApiError } from '../lib/error-handler';

export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await authenticateRequest(request);
    if (authError) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user!.id)
      .single();

    if (error) {
      throw new ApiError('Profile not found', 404);
    }

    return NextResponse.json({ profile });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { user, error: authError } = await authenticateRequest(request);
    if (authError) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    const body = await request.json();
    const updateData = {
      full_name: body.full_name || null,
      avatar_url: body.avatar_url || null,
      updated_at: new Date().toISOString(),
    };

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user!.id)
      .select()
      .single();

    if (error) {
      throw new ApiError('Failed to update profile', 500);
    }

    return NextResponse.json({ profile });
  } catch (error) {
    return handleApiError(error);
  }
}