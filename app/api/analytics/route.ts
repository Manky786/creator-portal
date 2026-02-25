import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

    // Get all projects for the year
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (projectsError) {
      console.error('Projects error:', projectsError);
    }

    const projectList = projects || [];

    // Get invoices for payment tracking
    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select('*')
      .eq('status', 'paid');

    if (invoicesError) {
      console.error('Invoices error:', invoicesError);
    }

    const invoiceList = invoices || [];

    // Calculate stats
    const stats = {
      total: projectList.length,
      byStatus: {} as { [key: string]: number },
      byCulture: {} as { [key: string]: { count: number; budget: number } },
      byFormat: {} as { [key: string]: { count: number; budget: number } },
      totalBudget: 0,
      paidAmount: 0,
      pendingAmount: 0,
      monthlyData: [] as { month: string; projects: number; budget: number }[],
    };

    // Calculate by status
    projectList.forEach(project => {
      const status = project.status || 'draft';
      stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
      stats.totalBudget += project.total_budget || 0;
    });

    // Calculate by culture (language as proxy for culture)
    projectList.forEach(project => {
      const culture = project.language || 'Other';
      if (!stats.byCulture[culture]) {
        stats.byCulture[culture] = { count: 0, budget: 0 };
      }
      stats.byCulture[culture].count += 1;
      stats.byCulture[culture].budget += project.total_budget || 0;
    });

    // Calculate by format
    projectList.forEach(project => {
      const format = project.format || 'other';
      if (!stats.byFormat[format]) {
        stats.byFormat[format] = { count: 0, budget: 0 };
      }
      stats.byFormat[format].count += 1;
      stats.byFormat[format].budget += project.total_budget || 0;
    });

    // Calculate paid amount
    stats.paidAmount = invoiceList.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
    stats.pendingAmount = stats.totalBudget - stats.paidAmount;

    // Monthly data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    stats.monthlyData = months.map((month, idx) => {
      const monthProjects = projectList.filter(p => {
        const date = new Date(p.created_at);
        return date.getMonth() === idx;
      });
      return {
        month,
        projects: monthProjects.length,
        budget: monthProjects.reduce((sum, p) => sum + (p.total_budget || 0), 0),
      };
    });

    return NextResponse.json({ stats });
  } catch (error: any) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
