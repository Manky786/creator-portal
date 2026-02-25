'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Project {
  id: string;
  title: string;
  description?: string;
  language: string;
  format: string;
  genre?: string;
  total_budget: number;
  working_budget?: number;
  status: string;
  priority: string;
  start_date?: string;
  end_date?: string;
  episode_count?: number;
  runtime_minutes?: number;
  created_at: string;
}

const STATUS_INFO: { [key: string]: { label: string; color: string; bgColor: string } } = {
  draft: { label: 'Draft', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  in_review: { label: 'In Review', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  approved: { label: 'Approved', color: 'text-green-600', bgColor: 'bg-green-100' },
  locked: { label: 'Locked', color: 'text-orange-600', bgColor: 'bg-orange-100' },
  in_production: { label: 'In Production', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  post_production: { label: 'Post Production', color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
  delivered: { label: 'Delivered', color: 'text-teal-600', bgColor: 'bg-teal-100' },
  released: { label: 'Released', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
  on_hold: { label: 'On Hold', color: 'text-amber-600', bgColor: 'bg-amber-100' },
  cancelled: { label: 'Cancelled', color: 'text-red-600', bgColor: 'bg-red-100' },
};

interface Tranche {
  id: string;
  project_id: string;
  tranche_number: number;
  tranche_name: string;
  percentage: number;
  amount: number;
  milestone: string;
  status: string;
  invoice_id?: string;
}

interface Invoice {
  id: string;
  tranche_number: number;
  status: string;
  invoice_number?: string;
  total_amount: number;
  submitted_at?: string;
  approved_at?: string;
  paid_at?: string;
  payment_reference?: string;
}

export default function CreatorDashboard() {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [tranches, setTranches] = useState<Tranche[]>([]);
  const [projectInvoices, setProjectInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        fetchMyProjects(session.user.id);
      }
    } catch (e) {
      console.error('Auth error:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyProjects = async (userId: string) => {
    try {
      const response = await fetch(`/api/projects?creator_id=${userId}`);
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (e) {
      console.error('Failed to fetch projects');
    }
  };

  const fetchProjectTranches = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/tranches`);
      const data = await response.json();
      setTranches(data.tranches || []);
    } catch (e) {
      console.error('Failed to fetch tranches');
      setTranches([]);
    }
  };

  const fetchProjectInvoices = async (projectId: string) => {
    try {
      const response = await fetch(`/api/invoices?project_id=${projectId}`);
      const data = await response.json();
      setProjectInvoices(data.invoices || []);
    } catch (e) {
      console.error('Failed to fetch invoices');
      setProjectInvoices([]);
    }
  };

  const openProjectDetail = async (project: Project) => {
    setSelectedProject(project);
    if (project.status === 'locked' || project.status === 'in_production') {
      await Promise.all([
        fetchProjectTranches(project.id),
        fetchProjectInvoices(project.id),
      ]);
    }
  };

  const getTrancheInvoice = (trancheNumber: number) => {
    return projectInvoices.find(inv => inv.tranche_number === trancheNumber);
  };

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-700';
      case 'under_review': return 'bg-amber-100 text-amber-700';
      case 'approved': return 'bg-green-100 text-green-700';
      case 'paid': return 'bg-emerald-100 text-emerald-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatBudget = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
    return `₹${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusInfo = (status: string) => {
    return STATUS_INFO[status] || STATUS_INFO.draft;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Stats
  const stats = {
    total: projects.length,
    active: projects.filter(p => ['in_production', 'post_production'].includes(p.status)).length,
    completed: projects.filter(p => ['delivered', 'released'].includes(p.status)).length,
    pending: projects.filter(p => ['draft', 'in_review', 'approved'].includes(p.status)).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Projects</h1>
              <p className="text-gray-500">Welcome back, {user?.user_metadata?.full_name || 'Creator'}</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Notifications
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎬</span>
              </div>
              <div>
                <div className="text-3xl font-black text-gray-800">{stats.total}</div>
                <div className="text-sm text-gray-500">Total Projects</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <div className="text-3xl font-black text-green-600">{stats.active}</div>
                <div className="text-sm text-gray-500">Active</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
              <div>
                <div className="text-3xl font-black text-blue-600">{stats.pending}</div>
                <div className="text-sm text-gray-500">Pending</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <div className="text-3xl font-black text-teal-600">{stats.completed}</div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects List */}
        {projects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🎬</span>
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Projects Yet</h3>
            <p className="text-gray-500 mb-6">You don't have any assigned projects yet.<br />Once a project is assigned to you, it will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => {
              const statusInfo = getStatusInfo(project.status);
              return (
                <div
                  key={project.id}
                  className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => openProjectDetail(project)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{project.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusInfo.bgColor} ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      {project.description && (
                        <p className="text-gray-500 mb-4 line-clamp-2">{project.description}</p>
                      )}
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <span>🎭</span> {project.format}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>🗣️</span> {project.language}
                        </span>
                        {project.genre && (
                          <span className="flex items-center gap-1">
                            <span>🎪</span> {project.genre}
                          </span>
                        )}
                        {project.episode_count && (
                          <span className="flex items-center gap-1">
                            <span>📺</span> {project.episode_count} episodes
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-gray-800">{formatBudget(project.total_budget)}</div>
                      <div className="text-sm text-gray-500">Total Budget</div>
                      {project.start_date && (
                        <div className="mt-2 text-xs text-gray-400">
                          Start: {formatDate(project.start_date)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedProject(null)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedProject.title}</h2>
                  <p className="text-red-100">{selectedProject.format} • {selectedProject.language}</p>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-full"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
              {/* Status */}
              <div className="flex items-center gap-4">
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusInfo(selectedProject.status).bgColor} ${getStatusInfo(selectedProject.status).color}`}>
                  {getStatusInfo(selectedProject.status).label}
                </span>
                <span className="text-gray-500">Priority: <strong className="capitalize">{selectedProject.priority}</strong></span>
              </div>

              {/* Description */}
              {selectedProject.description && (
                <div>
                  <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">Description</h4>
                  <p className="text-gray-700">{selectedProject.description}</p>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-500 mb-1">Total Budget</div>
                  <div className="text-2xl font-bold text-gray-800">{formatBudget(selectedProject.total_budget)}</div>
                </div>
                {selectedProject.working_budget && (
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="text-sm text-gray-500 mb-1">Working Budget</div>
                    <div className="text-2xl font-bold text-green-600">{formatBudget(selectedProject.working_budget)}</div>
                  </div>
                )}
                {selectedProject.episode_count && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="text-sm text-gray-500 mb-1">Episodes</div>
                    <div className="text-2xl font-bold text-blue-600">{selectedProject.episode_count}</div>
                  </div>
                )}
                {selectedProject.runtime_minutes && (
                  <div className="bg-purple-50 rounded-xl p-4">
                    <div className="text-sm text-gray-500 mb-1">Runtime</div>
                    <div className="text-2xl font-bold text-purple-600">{selectedProject.runtime_minutes} min</div>
                  </div>
                )}
              </div>

              {/* Dates */}
              {(selectedProject.start_date || selectedProject.end_date) && (
                <div className="grid grid-cols-2 gap-4">
                  {selectedProject.start_date && (
                    <div className="border border-gray-200 rounded-xl p-4">
                      <div className="text-sm text-gray-500 mb-1">Start Date</div>
                      <div className="font-bold text-gray-800">{formatDate(selectedProject.start_date)}</div>
                    </div>
                  )}
                  {selectedProject.end_date && (
                    <div className="border border-gray-200 rounded-xl p-4">
                      <div className="text-sm text-gray-500 mb-1">End Date</div>
                      <div className="font-bold text-gray-800">{formatDate(selectedProject.end_date)}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Genre */}
              {selectedProject.genre && (
                <div>
                  <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">Genre</h4>
                  <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-gray-700">{selectedProject.genre}</span>
                </div>
              )}

              {/* Payment Tranches - Only show for locked projects */}
              {(selectedProject.status === 'locked' || selectedProject.status === 'in_production') && tranches.length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-bold text-gray-500 uppercase mb-4">Payment Tranches</h4>
                  <div className="space-y-3">
                    {tranches.map((tranche) => {
                      const invoice = getTrancheInvoice(tranche.tranche_number);
                      return (
                        <div key={tranche.id} className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-bold text-gray-800">
                                {tranche.tranche_number}. {tranche.tranche_name}
                              </div>
                              <div className="text-sm text-gray-500">{tranche.milestone}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-gray-800">{formatBudget(tranche.amount)}</div>
                              <div className="text-xs text-gray-500">{tranche.percentage}%</div>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            {invoice ? (
                              <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getInvoiceStatusColor(invoice.status)}`}>
                                  {invoice.status === 'submitted' && 'Invoice Received'}
                                  {invoice.status === 'under_review' && 'Under Review'}
                                  {invoice.status === 'approved' && 'Approved'}
                                  {invoice.status === 'paid' && 'Paid'}
                                  {invoice.status === 'rejected' && 'Rejected'}
                                </span>
                                {invoice.status === 'paid' && invoice.payment_reference && (
                                  <span className="text-xs text-gray-500">Ref: {invoice.payment_reference}</span>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Send invoice to accounts@stage.in
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              <button
                onClick={() => { setSelectedProject(null); setTranches([]); setProjectInvoices([]); }}
                className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
