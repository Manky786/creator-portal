import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Get invoices
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project_id');
    const creatorId = searchParams.get('creator_id');
    const status = searchParams.get('status');

    let query = supabase
      .from('invoices')
      .select(`
        *,
        project:projects(id, title, format, total_budget),
        creator:profiles!invoices_creator_id_fkey(id, full_name, email)
      `)
      .order('created_at', { ascending: false });

    if (projectId) {
      query = query.eq('project_id', projectId);
    }
    if (creatorId) {
      query = query.eq('creator_id', creatorId);
    }
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching invoices:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ invoices: data || [] });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Create/Submit invoice
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      project_id,
      creator_id,
      tranche_number,
      tranche_name,
      amount,
      gst_percentage = 18,
      invoice_number,
      invoice_date,
      due_date,
      invoice_file_url,
      notes,
      milestone,
    } = body;

    // Calculate GST and total
    const gst_amount = Math.round(amount * (gst_percentage / 100));
    const total_amount = amount + gst_amount;

    const { data: invoice, error } = await supabase
      .from('invoices')
      .insert({
        project_id,
        creator_id,
        tranche_number,
        tranche_name,
        amount,
        gst_amount,
        total_amount,
        invoice_number,
        invoice_date,
        due_date,
        invoice_file_url,
        notes,
        milestone,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating invoice:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, invoice });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
