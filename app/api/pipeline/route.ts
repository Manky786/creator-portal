import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Get all pipeline projects
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const culture = searchParams.get('culture');

    let query = supabase
      .from('pipeline_projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (culture && culture !== 'all') {
      query = query.eq('culture', culture);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Pipeline fetch error:', error);
      return NextResponse.json({ projects: [] });
    }

    return NextResponse.json({ projects: data || [] });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Create new pipeline project
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { data: project, error } = await supabase
      .from('pipeline_projects')
      .insert({
        project_name: body.project_name || body.projectName,
        creator: body.creator,
        culture: body.culture,
        format: body.format,
        genre: body.genre,
        total_budget: body.total_budget || body.totalBudget || 0,
        episodes: body.episodes,
        status: body.status || 'pending',
        production_poc: body.production_poc || body.productionPOC,
        production_poc_phone: body.production_poc_phone || body.productionPOCPhone,
        production_poc_email: body.production_poc_email || body.productionPOCEmail,
        content_poc: body.content_poc || body.contentPOC,
        content_poc_phone: body.content_poc_phone || body.contentPOCPhone,
        content_poc_email: body.content_poc_email || body.contentPOCEmail,
        logline: body.logline,
        synopsis: body.synopsis,
        language: body.language,
        production_company: body.production_company || body.productionCompany,
        notes: body.notes,
        activity_log: [{
          action: 'created',
          timestamp: new Date().toISOString(),
          details: 'Project added to pipeline'
        }],
      })
      .select()
      .single();

    if (error) {
      console.error('Pipeline create error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
