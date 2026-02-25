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

    // Build insert data with only defined fields
    const insertData: any = {
      project_name: body.project_name || body.projectName,
      status: body.status || 'pending',
    };

    // Only add fields if they have values
    if (body.creator) insertData.creator = body.creator;
    if (body.culture) insertData.culture = body.culture;
    if (body.format) insertData.format = body.format;
    if (body.total_budget || body.totalBudget) insertData.total_budget = parseFloat(body.total_budget) || parseFloat(body.totalBudget) || 0;
    if (body.episodes) insertData.episodes = parseInt(body.episodes);
    if (body.duration) insertData.duration = body.duration;
    if (body.production_poc || body.productionPOC) insertData.production_poc = body.production_poc || body.productionPOC;
    if (body.production_poc_phone) insertData.production_poc_phone = body.production_poc_phone;
    if (body.production_poc_email) insertData.production_poc_email = body.production_poc_email;
    if (body.content_poc) insertData.content_poc = body.content_poc;
    if (body.content_poc_phone) insertData.content_poc_phone = body.content_poc_phone;
    if (body.content_poc_email) insertData.content_poc_email = body.content_poc_email;
    if (body.production_company) insertData.production_company = body.production_company;
    if (body.notes) insertData.notes = body.notes;
    if (body.budget_breakdown) insertData.budget_breakdown = body.budget_breakdown;

    const { data: project, error } = await supabase
      .from('pipeline_projects')
      .insert(insertData)
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
