import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Create new invite
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, email, invite_code, project_id, subject, message } = body;

    // Insert invite
    const { data: invite, error } = await supabase
      .from('creator_invites')
      .insert({
        full_name,
        email,
        invite_code,
        project_id: project_id || null,
        status: 'pending',
        subject,
        message,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating invite:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log activity - Invite Created
    await supabase.from('invite_activities').insert({
      invite_id: invite.id,
      activity_type: 'invite_created',
      description: `Invitation created for ${full_name}`,
      metadata: { email, subject },
    });

    return NextResponse.json({ success: true, invite });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Get all invites
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('creator_invites')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ invites: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
