import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Get single pipeline project
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: project, error } = await supabase
      .from('pipeline_projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ project });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Update pipeline project
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Get current project to update activity log
    const { data: currentProject } = await supabase
      .from('pipeline_projects')
      .select('activity_log')
      .eq('id', id)
      .single();

    const activityLog = currentProject?.activity_log || [];
    activityLog.push({
      action: 'updated',
      timestamp: new Date().toISOString(),
      details: body.activityNote || 'Project updated',
      field: body.changedField,
    });

    const updateData: any = {
      updated_at: new Date().toISOString(),
      activity_log: activityLog,
    };

    // Map fields
    if (body.project_name !== undefined) updateData.project_name = body.project_name;
    if (body.projectName !== undefined) updateData.project_name = body.projectName;
    if (body.creator !== undefined) updateData.creator = body.creator;
    if (body.culture !== undefined) updateData.culture = body.culture;
    if (body.format !== undefined) updateData.format = body.format;
    if (body.genre !== undefined) updateData.genre = body.genre;
    if (body.total_budget !== undefined) updateData.total_budget = body.total_budget;
    if (body.totalBudget !== undefined) updateData.total_budget = body.totalBudget;
    if (body.episodes !== undefined) updateData.episodes = body.episodes;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.production_poc !== undefined) updateData.production_poc = body.production_poc;
    if (body.productionPOC !== undefined) updateData.production_poc = body.productionPOC;
    if (body.logline !== undefined) updateData.logline = body.logline;
    if (body.synopsis !== undefined) updateData.synopsis = body.synopsis;
    if (body.language !== undefined) updateData.language = body.language;
    if (body.notes !== undefined) updateData.notes = body.notes;

    const { data: project, error } = await supabase
      .from('pipeline_projects')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Pipeline update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Delete pipeline project
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from('pipeline_projects')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
