import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { authenticateRequest } from '../../lib/auth-middleware';
import { handleApiError } from '../../lib/error-handler';

export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await authenticateRequest(request);
    if (authError) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    // Get user profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user!.id)
      .single();

    return NextResponse.json({ 
      user: {
        ...user,
        profile
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}