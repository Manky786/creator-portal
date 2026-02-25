'use client';

import { useState, useEffect } from 'react';

interface Creator {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
}

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
  assigned_creator_id?: string;
  creator?: Creator;
  created_at: string;
  updated_at: string;
}

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft', color: 'bg-gray-500' },
  { value: 'in_review', label: 'In Review', color: 'bg-blue-500' },
  { value: 'approved', label: 'Approved', color: 'bg-green-500' },
  { value: 'locked', label: 'Locked', color: 'bg-orange-500' },
  { value: 'in_production', label: 'In Production', color: 'bg-purple-500' },
  { value: 'post_production', label: 'Post Production', color: 'bg-indigo-500' },
  { value: 'delivered', label: 'Delivered', color: 'bg-teal-500' },
  { value: 'released', label: 'Released', color: 'bg-emerald-500' },
  { value: 'on_hold', label: 'On Hold', color: 'bg-amber-500' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500' },
];

const FORMAT_OPTIONS = [
  { value: 'film', label: 'Feature Film' },
  { value: 'web_series', label: 'Web Series' },
  { value: 'microdrama', label: 'Microdrama' },
  { value: 'documentary', label: 'Documentary' },
  { value: 'other', label: 'Other' },
];
const LANGUAGE_OPTIONS = ['Hindi', 'English', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Bengali', 'Marathi', 'Punjabi', 'Gujarati'];
const PRIORITY_OPTIONS = ['low', 'medium', 'high', 'urgent'];

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [lockLoading, setLockLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    language: 'Hindi',
    format: 'film',
    genre: '',
    total_budget: '',
    status: 'draft',
    priority: 'medium',
    start_date: '',
    end_date: '',
    episode_count: '',
    runtime_minutes: '',
    assigned_creator_id: '',
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchProjects();
    fetchCreators();
  }, [filterStatus]);

  const fetchProjects = async () => {
    try {
      const url = filterStatus === 'all'
        ? '/api/projects'
        : `/api/projects?status=${filterStatus}`;
      const response = await fetch(url);
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (e) {
      console.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchCreators = async () => {
    try {
      const response = await fetch('/api/creators');
      const data = await response.json();
      setCreators(data.creators || []);
    } catch (e) {
      console.error('Failed to fetch creators');
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          total_budget: parseFloat(formData.total_budget) || 0,
          episode_count: formData.episode_count ? parseInt(formData.episode_count) : null,
          runtime_minutes: formData.runtime_minutes ? parseInt(formData.runtime_minutes) : null,
          assigned_creator_id: formData.assigned_creator_id || null,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setShowCreateModal(false);
      resetForm();
      fetchProjects();
    } catch (err: any) {
      setFormError(err.message || 'Failed to create project');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    setFormLoading(true);
    setFormError('');

    try {
      const response = await fetch(`/api/projects/${selectedProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          total_budget: parseFloat(formData.total_budget) || 0,
          episode_count: formData.episode_count ? parseInt(formData.episode_count) : null,
          runtime_minutes: formData.runtime_minutes ? parseInt(formData.runtime_minutes) : null,
          assigned_creator_id: formData.assigned_creator_id || null,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setShowEditModal(false);
      setSelectedProject(null);
      resetForm();
      fetchProjects();
    } catch (err: any) {
      setFormError(err.message || 'Failed to update project');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      fetchProjects();
    } catch (err: any) {
      alert(err.message || 'Failed to delete project');
    }
  };

  const handleLockProject = async (project: Project) => {
    if (!project.assigned_creator_id) {
      alert('Cannot lock: Please assign a creator first');
      return;
    }

    if (!confirm(`Lock "${project.title}"? This will:\n\n1. Freeze project details\n2. Create payment tranches based on format\n3. Allow invoice submissions\n\nThis action cannot be undone.`)) {
      return;
    }

    setLockLoading(true);
    try {
      const response = await fetch(`/api/projects/${project.id}/lock`, {
        method: 'POST',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      alert(`Project locked successfully!\n\n${data.tranches?.length || 0} payment tranches created.`);
      setShowDetailModal(false);
      setDetailProject(null);
      fetchProjects();
    } catch (err: any) {
      alert(err.message || 'Failed to lock project');
    } finally {
      setLockLoading(false);
    }
  };

  const viewProjectDetails = (project: Project) => {
    setDetailProject(project);
    setShowDetailModal(true);
  };

  const openEditModal = (project: Project) => {
    setSelectedProject(project);
    setFormData({
      title: project.title,
      description: project.description || '',
      language: project.language,
      format: project.format,
      genre: project.genre || '',
      total_budget: project.total_budget?.toString() || '',
      status: project.status,
      priority: project.priority,
      start_date: project.start_date || '',
      end_date: project.end_date || '',
      episode_count: project.episode_count?.toString() || '',
      runtime_minutes: project.runtime_minutes?.toString() || '',
      assigned_creator_id: project.assigned_creator_id || '',
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      language: 'Hindi',
      format: 'film',
      genre: '',
      total_budget: '',
      status: 'draft',
      priority: 'medium',
      start_date: '',
      end_date: '',
      episode_count: '',
      runtime_minutes: '',
      assigned_creator_id: '',
    });
    setFormError('');
  };

  const getStatusInfo = (status: string) => {
    return STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];
  };

  const getFormatLabel = (format: string) => {
    const found = FORMAT_OPTIONS.find(f => f.value === format);
    return found ? found.label : format;
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

  // Filter projects by search
  const filteredProjects = projects.filter(project => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      project.title.toLowerCase().includes(query) ||
      project.creator?.full_name?.toLowerCase().includes(query) ||
      project.language.toLowerCase().includes(query) ||
      project.format.toLowerCase().includes(query)
    );
  });

  // Stats
  const stats = {
    total: projects.length,
    draft: projects.filter(p => p.status === 'draft').length,
    inProduction: projects.filter(p => p.status === 'in_production').length,
    completed: projects.filter(p => ['delivered', 'released'].includes(p.status)).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-3xl font-black text-gray-800">{stats.total}</div>
          <div className="text-sm font-medium text-gray-500">Total Projects</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-3xl font-black text-gray-500">{stats.draft}</div>
          <div className="text-sm font-medium text-gray-500">Draft</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-3xl font-black text-purple-600">{stats.inProduction}</div>
          <div className="text-sm font-medium text-gray-500">In Production</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-3xl font-black text-green-600">{stats.completed}</div>
          <div className="text-sm font-medium text-gray-500">Completed</div>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full md:max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:border-purple-500 outline-none"
          >
            <option value="all">All Status</option>
            {STATUS_OPTIONS.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
          <button
            onClick={() => { resetForm(); setShowCreateModal(true); }}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </button>
        </div>
      </div>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎬</span>
          </div>
          <h3 className="text-lg font-bold text-gray-700 mb-1">No projects found</h3>
          <p className="text-gray-500">Click "New Project" to create your first project</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <div className="col-span-3">Project</div>
            <div className="col-span-2">Creator</div>
            <div className="col-span-2">Format / Language</div>
            <div className="col-span-2">Budget</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {filteredProjects.map((project) => {
              const statusInfo = getStatusInfo(project.status);
              return (
                <div
                  key={project.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
                >
                  {/* Project Info */}
                  <div className="col-span-3">
                    <div className="font-semibold text-gray-800">{project.title}</div>
                    <div className="text-sm text-gray-500">{project.genre || 'No genre'}</div>
                  </div>

                  {/* Creator */}
                  <div className="col-span-2">
                    {project.creator ? (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">
                          {project.creator.full_name.charAt(0)}
                        </div>
                        <div className="text-sm text-gray-700">{project.creator.full_name}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">Unassigned</span>
                    )}
                  </div>

                  {/* Format / Language */}
                  <div className="col-span-2 text-sm">
                    <div className="text-gray-800">{getFormatLabel(project.format)}</div>
                    <div className="text-gray-500">{project.language}</div>
                  </div>

                  {/* Budget */}
                  <div className="col-span-2">
                    <span className="font-semibold text-gray-800">
                      {formatBudget(project.total_budget)}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-white ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => viewProjectDetails(project)}
                      className="p-2 text-purple-500 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                      title="View details"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => openEditModal(project)}
                      className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit project"
                      disabled={project.status === 'locked' || project.status === 'in_production'}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete project"
                      disabled={project.status === 'locked' || project.status === 'in_production'}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowCreateModal(false); setShowEditModal(false); setSelectedProject(null); }}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  {showEditModal ? 'Edit Project' : 'Create New Project'}
                </h2>
                <button
                  onClick={() => { setShowCreateModal(false); setShowEditModal(false); setSelectedProject(null); }}
                  className="text-white/80 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={showEditModal ? handleUpdateProject : handleCreateProject} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{formError}</p>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-purple-500 outline-none"
                  placeholder="Enter project title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-purple-500 outline-none resize-none"
                  placeholder="Project description or logline"
                />
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-2 gap-4">
                {/* Format */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                  <select
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-purple-500 outline-none"
                  >
                    {FORMAT_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-purple-500 outline-none"
                  >
                    {LANGUAGE_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                {/* Genre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                  <input
                    type="text"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-purple-500 outline-none"
                    placeholder="Drama, Comedy, Thriller..."
                  />
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Budget (₹)</label>
                  <input
                    type="number"
                    value={formData.total_budget}
                    onChange={(e) => setFormData({ ...formData, total_budget: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-purple-500 outline-none"
                    placeholder="5000000"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-purple-500 outline-none"
                  >
                    {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-purple-500 outline-none"
                  >
                    {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-purple-500 outline-none"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-purple-500 outline-none"
                  />
                </div>

                {/* Episodes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Episode Count</label>
                  <input
                    type="number"
                    value={formData.episode_count}
                    onChange={(e) => setFormData({ ...formData, episode_count: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-purple-500 outline-none"
                    placeholder="8"
                  />
                </div>

                {/* Runtime */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Runtime (minutes)</label>
                  <input
                    type="number"
                    value={formData.runtime_minutes}
                    onChange={(e) => setFormData({ ...formData, runtime_minutes: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-purple-500 outline-none"
                    placeholder="120"
                  />
                </div>
              </div>

              {/* Assign Creator */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign Creator</label>
                <select
                  value={formData.assigned_creator_id}
                  onChange={(e) => setFormData({ ...formData, assigned_creator_id: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-purple-500 outline-none"
                >
                  <option value="">-- Select Creator --</option>
                  {creators.map(creator => (
                    <option key={creator.id} value={creator.id}>{creator.full_name} ({creator.email})</option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all disabled:opacity-50"
                >
                  {formLoading ? 'Saving...' : (showEditModal ? 'Update Project' : 'Create Project')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      {showDetailModal && detailProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowDetailModal(false); setDetailProject(null); }}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{detailProject.title}</h2>
                  <p className="text-white/80 text-sm">{getFormatLabel(detailProject.format)} • {detailProject.language}</p>
                </div>
                <button
                  onClick={() => { setShowDetailModal(false); setDetailProject(null); }}
                  className="text-white/80 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
              {/* Project Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-1">Status</div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold text-white ${getStatusInfo(detailProject.status).color}`}>
                    {getStatusInfo(detailProject.status).label}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-1">Budget</div>
                  <div className="font-bold text-gray-800">{formatBudget(detailProject.total_budget)}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-1">Priority</div>
                  <div className="font-semibold text-gray-800 capitalize">{detailProject.priority}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-1">Genre</div>
                  <div className="font-semibold text-gray-800">{detailProject.genre || '-'}</div>
                </div>
              </div>

              {/* Creator Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs font-medium text-gray-500 uppercase mb-2">Assigned Creator</div>
                {detailProject.creator ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                      {detailProject.creator.full_name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{detailProject.creator.full_name}</div>
                      <div className="text-sm text-gray-500">{detailProject.creator.email}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 italic">No creator assigned yet</div>
                )}
              </div>

              {/* Description */}
              {detailProject.description && (
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase mb-2">Description</div>
                  <p className="text-gray-700">{detailProject.description}</p>
                </div>
              )}

              {/* Payment Tranches Preview */}
              <div className="border border-orange-200 bg-orange-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-bold text-orange-800">Payment Tranches (Format: {getFormatLabel(detailProject.format)})</div>
                  {detailProject.status === 'locked' && (
                    <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded-full font-bold">LOCKED</span>
                  )}
                </div>
                <div className="space-y-2">
                  {detailProject.format === 'film' && (
                    <>
                      <div className="flex justify-between text-sm"><span>1. Signing Amount</span><span className="font-semibold">20% - {formatBudget(detailProject.total_budget * 0.20)}</span></div>
                      <div className="flex justify-between text-sm"><span>2. Pre-Production</span><span className="font-semibold">30% - {formatBudget(detailProject.total_budget * 0.30)}</span></div>
                      <div className="flex justify-between text-sm"><span>3. Production Complete</span><span className="font-semibold">30% - {formatBudget(detailProject.total_budget * 0.30)}</span></div>
                      <div className="flex justify-between text-sm"><span>4. Final Delivery</span><span className="font-semibold">20% - {formatBudget(detailProject.total_budget * 0.20)}</span></div>
                    </>
                  )}
                  {detailProject.format === 'web_series' && (
                    <>
                      <div className="flex justify-between text-sm"><span>1. Signing Amount</span><span className="font-semibold">15% - {formatBudget(detailProject.total_budget * 0.15)}</span></div>
                      <div className="flex justify-between text-sm"><span>2. Pre-Production</span><span className="font-semibold">20% - {formatBudget(detailProject.total_budget * 0.20)}</span></div>
                      <div className="flex justify-between text-sm"><span>3. 50% Shoot Complete</span><span className="font-semibold">25% - {formatBudget(detailProject.total_budget * 0.25)}</span></div>
                      <div className="flex justify-between text-sm"><span>4. Shoot Wrapped</span><span className="font-semibold">25% - {formatBudget(detailProject.total_budget * 0.25)}</span></div>
                      <div className="flex justify-between text-sm"><span>5. Final Delivery</span><span className="font-semibold">15% - {formatBudget(detailProject.total_budget * 0.15)}</span></div>
                    </>
                  )}
                  {detailProject.format === 'microdrama' && (
                    <>
                      <div className="flex justify-between text-sm"><span>1. Signing Amount</span><span className="font-semibold">30% - {formatBudget(detailProject.total_budget * 0.30)}</span></div>
                      <div className="flex justify-between text-sm"><span>2. Production Complete</span><span className="font-semibold">40% - {formatBudget(detailProject.total_budget * 0.40)}</span></div>
                      <div className="flex justify-between text-sm"><span>3. Final Delivery</span><span className="font-semibold">30% - {formatBudget(detailProject.total_budget * 0.30)}</span></div>
                    </>
                  )}
                  {detailProject.format === 'documentary' && (
                    <>
                      <div className="flex justify-between text-sm"><span>1. Signing Amount</span><span className="font-semibold">25% - {formatBudget(detailProject.total_budget * 0.25)}</span></div>
                      <div className="flex justify-between text-sm"><span>2. Research/Pre-Production</span><span className="font-semibold">25% - {formatBudget(detailProject.total_budget * 0.25)}</span></div>
                      <div className="flex justify-between text-sm"><span>3. Production Complete</span><span className="font-semibold">30% - {formatBudget(detailProject.total_budget * 0.30)}</span></div>
                      <div className="flex justify-between text-sm"><span>4. Final Delivery</span><span className="font-semibold">20% - {formatBudget(detailProject.total_budget * 0.20)}</span></div>
                    </>
                  )}
                  {detailProject.format === 'other' && (
                    <>
                      <div className="flex justify-between text-sm"><span>1. Signing Amount</span><span className="font-semibold">30% - {formatBudget(detailProject.total_budget * 0.30)}</span></div>
                      <div className="flex justify-between text-sm"><span>2. Mid-Project</span><span className="font-semibold">40% - {formatBudget(detailProject.total_budget * 0.40)}</span></div>
                      <div className="flex justify-between text-sm"><span>3. Final Delivery</span><span className="font-semibold">30% - {formatBudget(detailProject.total_budget * 0.30)}</span></div>
                    </>
                  )}
                </div>
              </div>

              {/* Lock Project Action */}
              {detailProject.status === 'approved' && (
                <div className="border-2 border-dashed border-orange-300 bg-orange-50 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-orange-800 mb-2">Ready to Lock Project?</h3>
                  <p className="text-sm text-orange-600 mb-4">
                    Locking will create payment tranches and move project to production. This action cannot be undone.
                  </p>
                  <button
                    onClick={() => handleLockProject(detailProject)}
                    disabled={lockLoading || !detailProject.assigned_creator_id}
                    className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 mx-auto"
                  >
                    {lockLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Locking...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Lock Project & Create Tranches
                      </>
                    )}
                  </button>
                  {!detailProject.assigned_creator_id && (
                    <p className="text-xs text-red-500 mt-2">Please assign a creator before locking</p>
                  )}
                </div>
              )}

              {/* Already Locked Notice */}
              {detailProject.status === 'locked' && (
                <div className="border-2 border-green-300 bg-green-50 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-green-800 mb-2">Project Locked</h3>
                  <p className="text-sm text-green-600">
                    Payment tranches have been created. Creator can now submit invoices for each milestone.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
