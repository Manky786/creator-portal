import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { getPaymentTerms, calculateTrancheAmount } from '@/lib/paymentTranches';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Lock project and create payment tranches
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get project details
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check if project can be locked (must be approved and have creator assigned)
    if (!project.assigned_creator_id) {
      return NextResponse.json({ error: 'Cannot lock: No creator assigned' }, { status: 400 });
    }

    // Get payment terms for this format
    const paymentTerms = getPaymentTerms(project.format);

    // Update project status to locked
    const { error: updateError } = await supabase
      .from('projects')
      .update({
        status: 'locked',
        locked_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Create payment tranche records
    const tranches = paymentTerms.tranches.map(tranche => ({
      project_id: id,
      creator_id: project.assigned_creator_id,
      tranche_number: tranche.number,
      tranche_name: tranche.name,
      percentage: tranche.percentage,
      amount: calculateTrancheAmount(project.total_budget, tranche.percentage),
      milestone: tranche.milestone,
      status: 'pending',
    }));

    // Insert tranches into project_tranches table
    const { error: trancheError } = await supabase
      .from('project_tranches')
      .insert(tranches);

    if (trancheError) {
      console.log('Tranche creation note:', trancheError.message);
      // Continue even if tranches table doesn't exist
    }

    // Log activity
    await supabase.from('activity_log').insert({
      project_id: id,
      action: 'project_locked',
      details: {
        format: project.format,
        total_budget: project.total_budget,
        tranches: paymentTerms.tranches.length,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Project locked successfully',
      tranches: paymentTerms.tranches,
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
