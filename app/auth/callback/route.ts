import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const inviteCode = requestUrl.searchParams.get('invite');
  const origin = requestUrl.origin;

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: authData } = await supabase.auth.exchangeCodeForSession(code);

    if (authData?.user) {
      const user = authData.user;

      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('id', user.id)
        .single();

      if (!existingProfile) {
        // Create profile for new Google user (always creator)
        await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || 'Creator',
            role: 'creator',
          });
      }

      // Handle invite code if present
      if (inviteCode) {
        const { data: invite } = await supabase
          .from('creator_invites')
          .select('project_id')
          .eq('invite_code', inviteCode.toUpperCase())
          .single();

        if (invite?.project_id) {
          await supabase
            .from('projects')
            .update({ assigned_creator_id: user.id })
            .eq('id', invite.project_id);
        }

        await supabase
          .from('creator_invites')
          .update({ status: 'accepted', accepted_at: new Date().toISOString() })
          .eq('invite_code', inviteCode.toUpperCase());
      }

      // Redirect based on role
      const role = existingProfile?.role || 'creator';
      if (role === 'admin') {
        return NextResponse.redirect(`${origin}/admin`);
      } else {
        return NextResponse.redirect(`${origin}/creator`);
      }
    }
  }

  // Redirect to login on error
  return NextResponse.redirect(`${origin}/login`);
}
