'use client';

import { useState, useEffect } from 'react';

interface PipelineProject {
  id: string;
  project_name: string;
  creator?: string;
  culture?: string;
  format?: string;
  genre?: string;
  total_budget: number;
  episodes?: number;
  status: string;
  production_poc?: string;
  production_poc_phone?: string;
  production_poc_email?: string;
  logline?: string;
  language?: string;
  created_at: string;
}

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'bg-gray-500' },
  { value: 'approved', label: 'Approved', color: 'bg-green-500' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-500' },
  { value: 'in-production', label: 'In Production', color: 'bg-blue-500' },
  { value: 'on-hold', label: 'On Hold', color: 'bg-amber-500' },
  { value: 'completed', label: 'Completed', color: 'bg-emerald-500' },
];

const CULTURE_OPTIONS = ['Haryanvi', 'Rajasthani', 'Bhojpuri', 'Punjabi', 'Marathi', 'Gujarati', 'Bengali', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Other'];
const FORMAT_OPTIONS = ['Feature Film', 'Web Series', 'Microdrama', 'Documentary', 'Short Film', 'Other'];

export default function PipelineManager() {
  const [projects, setProjects] = useState<PipelineProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCulture, setFilterCulture] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    project_name: '',
    creator: '',
    culture: 'Haryanvi',
    format: 'Feature Film',
    genre: '',
    total_budget: '',
    episodes: '',
    status: 'pending',
    production_poc: '',
    logline: '',
    language: 'Hindi',
  });

  useEffect(() => {
    fetchProjects();
  }, [filterStatus, filterCulture]);

  const fetchProjects = async () => {
    try {
      let url = '/api/pipeline?';
      if (filterStatus !== 'all') url += `status=${filterStatus}&`;
      if (filterCulture !== 'all') url += `culture=${filterCulture}`;

      const response = await fetch(url);
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (e) {
      console.error('Failed to fetch pipeline');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const response = await fetch('/api/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          total_budget: parseFloat(formData.total_budget) || 0,
          episodes: formData.episodes ? parseInt(formData.episodes) : null,
        }),
      });

      if (!response.ok) throw new Error('Failed to create');

      setShowAddModal(false);
      setFormData({
        project_name: '',
        creator: '',
        culture: 'Haryanvi',
        format: 'Feature Film',
        genre: '',
        total_budget: '',
        episodes: '',
        status: 'pending',
        production_poc: '',
        logline: '',
        language: 'Hindi',
      });
      fetchProjects();
    } catch (e) {
      alert('Failed to create project');
    } finally {
      setFormLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/pipeline/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchProjects();
    } catch (e) {
      alert('Failed to update status');
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Delete this project from pipeline?')) return;
    try {
      await fetch(`/api/pipeline/${id}`, { method: 'DELETE' });
      fetchProjects();
    } catch (e) {
      alert('Failed to delete');
    }
  };

  const formatBudget = (amount: number) => {
    if (!amount) return '—';
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
    return `₹${amount.toLocaleString()}`;
  };

  const getStatusInfo = (status: string) => {
    return STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];
  };

  // Filter by search
  const filteredProjects = projects.filter(p => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      p.project_name?.toLowerCase().includes(query) ||
      p.creator?.toLowerCase().includes(query) ||
      p.culture?.toLowerCase().includes(query)
    );
  });

  // Stats
  const stats = {
    total: projects.length,
    pending: projects.filter(p => p.status === 'pending').length,
    approved: projects.filter(p => p.status === 'approved').length,
    inProduction: projects.filter(p => p.status === 'in-production').length,
    totalBudget: projects.reduce((sum, p) => sum + (p.total_budget || 0), 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <div className="text-3xl font-black text-gray-800">{stats.total}</div>
          <div className="text-sm text-gray-500">Total Pipeline</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-3xl font-black text-amber-600">{stats.pending}</div>
          <div className="text-sm text-gray-500">Pending</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-3xl font-black text-green-600">{stats.approved}</div>
          <div className="text-sm text-gray-500">Approved</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-3xl font-black text-blue-600">{stats.inProduction}</div>
          <div className="text-sm text-gray-500">In Production</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-2xl font-black text-purple-600">{formatBudget(stats.totalBudget)}</div>
          <div className="text-sm text-gray-500">Total Value</div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="px-4 py-2 border rounded-xl w-48"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-xl"
          >
            <option value="all">All Status</option>
            {STATUS_OPTIONS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <select
            value={filterCulture}
            onChange={(e) => setFilterCulture(e.target.value)}
            className="px-4 py-2 border rounded-xl"
          >
            <option value="all">All Cultures</option>
            {CULTURE_OPTIONS.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-xl flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add to Pipeline
        </button>
      </div>

      {/* Projects Table */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed">
          <div className="text-4xl mb-4">🎬</div>
          <h3 className="text-lg font-bold text-gray-700">No projects in pipeline</h3>
          <p className="text-gray-500">Add projects to track pre-production</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Project</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Culture</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Format</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Budget</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProjects.map((project) => {
                const statusInfo = getStatusInfo(project.status);
                return (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-gray-800">{project.project_name}</div>
                      <div className="text-sm text-gray-500">{project.creator || 'No creator'}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                        {project.culture || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">{project.format || '—'}</td>
                    <td className="px-4 py-4 font-bold text-gray-800">{formatBudget(project.total_budget)}</td>
                    <td className="px-4 py-4">
                      <select
                        value={project.status}
                        onChange={(e) => updateStatus(project.id, e.target.value)}
                        className={`px-2 py-1 rounded-lg text-xs font-bold text-white ${statusInfo.color} border-0 cursor-pointer`}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s.value} value={s.value} className="text-gray-800 bg-white">
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Add to Pipeline</h2>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={formData.project_name}
                  onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Culture</label>
                  <select
                    value={formData.culture}
                    onChange={(e) => setFormData({ ...formData, culture: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl"
                  >
                    {CULTURE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                  <select
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl"
                  >
                    {FORMAT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget (₹)</label>
                  <input
                    type="number"
                    value={formData.total_budget}
                    onChange={(e) => setFormData({ ...formData, total_budget: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Creator Name</label>
                  <input
                    type="text"
                    value={formData.creator}
                    onChange={(e) => setFormData({ ...formData, creator: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logline</label>
                <textarea
                  value={formData.logline}
                  onChange={(e) => setFormData({ ...formData, logline: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border rounded-xl resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={formLoading}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl disabled:opacity-50"
              >
                {formLoading ? 'Adding...' : 'Add to Pipeline'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
