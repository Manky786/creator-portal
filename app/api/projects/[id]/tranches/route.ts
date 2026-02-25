import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Get tranches for a project
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: tranches, error } = await supabase
      .from('project_tranches')
      .select('*')
      .eq('project_id', id)
      .order('tranche_number', { ascending: true });

    if (error) {
      console.log('Tranches fetch error:', error.message);
      return NextResponse.json({ tranches: [] });
    }

    return NextResponse.json({ tranches: tranches || [] });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
