import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { authenticateRequest } from '../../lib/auth-middleware';
import { ApiError, handleApiError } from '../../lib/error-handler';

export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await authenticateRequest(request);
    if (authError) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new ApiError('Failed to logout', 500);
    }

    return NextResponse.json({ message: 'Logout successful' });
  } catch (error) {
    return handleApiError(error);
  }
}