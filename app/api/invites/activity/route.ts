import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Log activity
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { invite_code, activity_type, description, metadata } = body;

    // Find invite by code
    const { data: invite } = await supabase
      .from('creator_invites')
      .select('id')
      .eq('invite_code', invite_code.toUpperCase())
      .single();

    if (!invite) {
      return NextResponse.json({ error: 'Invite not found' }, { status: 404 });
    }

    // Log activity
    const { error } = await supabase.from('invite_activities').insert({
      invite_id: invite.id,
      activity_type,
      description,
      metadata: metadata || {},
    });

    if (error) {
      console.error('Error logging activity:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Update invite status if needed
    if (activity_type === 'signup_completed') {
      await supabase
        .from('creator_invites')
        .update({ status: 'accepted', accepted_at: new Date().toISOString() })
        .eq('id', invite.id);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Get activities for an invite
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const inviteId = searchParams.get('invite_id');
    const inviteCode = searchParams.get('invite_code');

    let query = supabase
      .from('invite_activities')
      .select('*')
      .order('created_at', { ascending: false });

    if (inviteId) {
      query = query.eq('invite_id', inviteId);
    } else if (inviteCode) {
      // First get invite id
      const { data: invite } = await supabase
        .from('creator_invites')
        .select('id')
        .eq('invite_code', inviteCode.toUpperCase())
        .single();

      if (invite) {
        query = query.eq('invite_id', invite.id);
      } else {
        return NextResponse.json({ activities: [] });
      }
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ activities: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
