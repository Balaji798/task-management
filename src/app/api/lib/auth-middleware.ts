import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function authenticateRequest(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'No token provided', user: null };
    }

    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return { error: 'Invalid token', user: null };
    }

    return { error: null, user };
  } catch (error) {
    return { error: 'Authentication failed', user: null };
  }
}