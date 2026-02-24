import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Get all projects
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get('creator_id');
    const status = searchParams.get('status');

    let query = supabase
      .from('projects')
      .select(`
        *,
        creator:profiles!projects_assigned_creator_id_fkey(id, full_name, email, avatar_url),
        created_by_user:profiles!projects_created_by_fkey(id, full_name, email)
      `)
      .order('created_at', { ascending: false });

    // Filter by creator if specified
    if (creatorId) {
      query = query.eq('assigned_creator_id', creatorId);
    }

    // Filter by status if specified
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ projects: data || [] });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Create new project
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      language,
      format,
      genre,
      total_budget,
      creator_margin_percent,
      status,
      priority,
      start_date,
      end_date,
      episode_count,
      runtime_minutes,
      created_by,
      assigned_creator_id,
      thumbnail_url,
      notes,
      tags,
    } = body;

    // Insert project
    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        title,
        description,
        language: language || 'Hindi',
        format: format || 'Feature Film',
        genre,
        total_budget: total_budget || 0,
        creator_margin_percent: creator_margin_percent || 70,
        status: status || 'draft',
        priority: priority || 'medium',
        start_date,
        end_date,
        episode_count,
        runtime_minutes,
        created_by,
        assigned_creator_id,
        thumbnail_url,
        notes,
        tags: tags || [],
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log activity
    if (project) {
      await supabase.from('activity_log').insert({
        project_id: project.id,
        user_id: created_by,
        action: 'project_created',
        details: { title },
      });
    }

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
