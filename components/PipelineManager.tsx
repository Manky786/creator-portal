'use client';

import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

interface BudgetBreakdown {
  celebrity_fee?: number;
  overhead_cost?: number;
  production_cost?: number;
  post_production?: number;
  marketing?: number;
  others?: number;
}

interface PipelineProject {
  id: string;
  project_name: string;
  creator?: string;
  culture?: string;
  format?: string;
  total_budget: number;
  budget_breakdown?: BudgetBreakdown;
  episodes?: number;
  duration?: string;
  status: string;
  production_poc?: string;
  production_poc_phone?: string;
  production_poc_email?: string;
  content_poc?: string;
  content_poc_phone?: string;
  content_poc_email?: string;
  production_company?: string;
  notes?: string;
  created_at: string;
}

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'bg-amber-500', light: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'approved', label: 'Approved', color: 'bg-green-500', light: 'bg-green-50 text-green-700 border-green-200' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-500', light: 'bg-red-50 text-red-700 border-red-200' },
  { value: 'in-production', label: 'In Production', color: 'bg-blue-500', light: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'on-hold', label: 'On Hold', color: 'bg-orange-500', light: 'bg-orange-50 text-orange-700 border-orange-200' },
  { value: 'completed', label: 'Completed', color: 'bg-emerald-500', light: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
];

const CULTURE_OPTIONS = ['Haryanvi', 'Rajasthani', 'Bhojpuri', 'Gujarati'];
const FORMAT_OPTIONS = ['Feature Film', 'Long Series', 'Binge Series', 'Microdrama'];
const DEFAULT_PRODUCTION_POC = ['Mayank', 'Haidar', 'Sumeet'];
const DEFAULT_CONTENT_POC = ['Mayank', 'Haidar', 'Sumeet'];

const BUDGET_CATEGORIES = [
  { key: 'celebrity_fee', label: 'Celebrity Fee', icon: '⭐' },
  { key: 'overhead_cost', label: 'Overhead Cost', icon: '🏢' },
  { key: 'production_cost', label: 'Production Cost', icon: '🎬' },
  { key: 'post_production', label: 'Post Production', icon: '🎞️' },
  { key: 'marketing', label: 'Marketing', icon: '📢' },
  { key: 'others', label: 'Others', icon: '📦' },
];

const DEFAULT_COLUMNS = [
  { id: 'sno', label: 'S.No', width: 50 },
  { id: 'project_name', label: 'Project', width: 180 },
  { id: 'creator', label: 'Creator', width: 130 },
  { id: 'culture', label: 'Culture', width: 100 },
  { id: 'format', label: 'Format', width: 110 },
  { id: 'total_budget', label: 'Budget', width: 110 },
  { id: 'episodes', label: 'Eps', width: 50 },
  { id: 'production_poc', label: 'Prod. POC', width: 100 },
  { id: 'content_poc', label: 'Content POC', width: 100 },
  { id: 'status', label: 'Status', width: 150 },
  { id: 'actions', label: '', width: 50 },
];

export default function PipelineManager() {
  const [projects, setProjects] = useState<PipelineProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showAddRow, setShowAddRow] = useState(false);
  const [draggedColumn, setDraggedColumn] = useState<number | null>(null);
  const [draggedRow, setDraggedRow] = useState<number | null>(null);

  // Filters
  const [filterCulture, setFilterCulture] = useState('all');
  const [filterFormat, setFilterFormat] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProdPOC, setFilterProdPOC] = useState('all');
  const [filterContentPOC, setFilterContentPOC] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Budget Modal
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [selectedProjectForBudget, setSelectedProjectForBudget] = useState<PipelineProject | null>(null);
  const [budgetBreakdown, setBudgetBreakdown] = useState<BudgetBreakdown>({});

  // Export dropdown
  const [showExportMenu, setShowExportMenu] = useState(false);

  // POC Tab
  const [selectedPOCTab, setSelectedPOCTab] = useState<string | null>(null);

  // Dynamic POC options with Add Member
  const [productionPOCOptions, setProductionPOCOptions] = useState(DEFAULT_PRODUCTION_POC);
  const [contentPOCOptions, setContentPOCOptions] = useState(DEFAULT_CONTENT_POC);
  const [showAddProdPOC, setShowAddProdPOC] = useState(false);
  const [showAddContentPOC, setShowAddContentPOC] = useState(false);
  const [newPOCName, setNewPOCName] = useState('');

  const [newRow, setNewRow] = useState({
    project_name: '',
    creator: '',
    culture: '',
    format: '',
    total_budget: '',
    episodes: '',
    production_poc: '',
    content_poc: '',
    status: 'pending',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/pipeline');
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (e) {
      console.error('Failed to fetch pipeline');
    } finally {
      setLoading(false);
    }
  };

  // Filter projects
  const filteredProjects = projects.filter(p => {
    if (filterCulture !== 'all' && p.culture !== filterCulture) return false;
    if (filterFormat !== 'all' && p.format !== filterFormat) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (filterProdPOC !== 'all' && p.production_poc !== filterProdPOC) return false;
    if (filterContentPOC !== 'all' && p.content_poc !== filterContentPOC) return false;
    if (selectedPOCTab && p.production_poc !== selectedPOCTab) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.project_name?.toLowerCase().includes(q) || p.creator?.toLowerCase().includes(q);
    }
    return true;
  });

  // Export functions
  const exportToExcel = (data: any[], filename: string) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pipeline');
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  const handleExport = (type: string) => {
    let data: any[] = [];
    let filename = 'pipeline';

    const formatData = (projs: PipelineProject[]) => projs.map(p => ({
      'Project Name': p.project_name,
      'Creator': p.creator,
      'Culture': p.culture,
      'Format': p.format,
      'Budget': p.total_budget,
      'Episodes': p.episodes,
      'Production POC': p.production_poc,
      'Content POC': p.content_poc,
      'Status': p.status,
    }));

    if (type === 'all') {
      data = formatData(projects);
      filename = 'pipeline_all';
    } else if (type === 'culture') {
      CULTURE_OPTIONS.forEach(culture => {
        const filtered = projects.filter(p => p.culture === culture);
        if (filtered.length > 0) {
          exportToExcel(formatData(filtered), `pipeline_${culture.toLowerCase()}`);
        }
      });
      setShowExportMenu(false);
      return;
    } else if (type === 'format') {
      FORMAT_OPTIONS.forEach(format => {
        const filtered = projects.filter(p => p.format === format);
        if (filtered.length > 0) {
          exportToExcel(formatData(filtered), `pipeline_${format.toLowerCase().replace(' ', '_')}`);
        }
      });
      setShowExportMenu(false);
      return;
    } else if (type === 'poc') {
      productionPOCOptions.forEach(poc => {
        const filtered = projects.filter(p => p.production_poc === poc);
        if (filtered.length > 0) {
          exportToExcel(formatData(filtered), `pipeline_${poc.toLowerCase()}`);
        }
      });
      setShowExportMenu(false);
      return;
    } else if (type === 'filtered') {
      data = formatData(filteredProjects);
      filename = 'pipeline_filtered';
    }

    exportToExcel(data, filename);
    setShowExportMenu(false);
  };

  const handleCellClick = (id: string, field: string, value: any, project?: PipelineProject) => {
    if (field === 'sno' || field === 'actions' || field === 'status') return;

    if (field === 'total_budget' && project) {
      setSelectedProjectForBudget(project);
      setBudgetBreakdown(project.budget_breakdown || {});
      setShowBudgetModal(true);
      return;
    }

    setEditingCell({ id, field });
    setEditValue(value?.toString() || '');
  };

  const handleCellSave = async () => {
    if (!editingCell) return;
    try {
      await fetch(`/api/pipeline/${editingCell.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [editingCell.field]: editValue }),
      });
      fetchProjects();
    } catch (e) {
      alert('Failed to update');
    }
    setEditingCell(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCellSave();
    if (e.key === 'Escape') setEditingCell(null);
  };

  const handleSaveBudget = async () => {
    if (!selectedProjectForBudget) return;
    const total = Object.values(budgetBreakdown).reduce((sum, val) => sum + (val || 0), 0);
    try {
      await fetch(`/api/pipeline/${selectedProjectForBudget.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ total_budget: total, budget_breakdown: budgetBreakdown }),
      });
      fetchProjects();
      setShowBudgetModal(false);
    } catch (e) {
      alert('Failed to save budget');
    }
  };

  const handleAddRow = async () => {
    if (!newRow.project_name) { alert('Project name required'); return; }
    try {
      await fetch('/api/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newRow,
          total_budget: parseFloat(newRow.total_budget) || 0,
          episodes: newRow.episodes ? parseInt(newRow.episodes) : null,
        }),
      });
      setNewRow({ project_name: '', creator: '', culture: '', format: '', total_budget: '', episodes: '', production_poc: '', content_poc: '', status: 'pending' });
      setShowAddRow(false);
      fetchProjects();
    } catch (e) {
      alert('Failed to add');
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Delete?')) return;
    await fetch(`/api/pipeline/${id}`, { method: 'DELETE' });
    fetchProjects();
  };

  const handleColumnDragStart = (index: number) => setDraggedColumn(index);
  const handleColumnDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedColumn === null || draggedColumn === index) return;
    const newCols = [...columns];
    const [removed] = newCols.splice(draggedColumn, 1);
    newCols.splice(index, 0, removed);
    setColumns(newCols);
    setDraggedColumn(index);
  };
  const handleColumnDragEnd = () => setDraggedColumn(null);

  const handleRowDragStart = (index: number) => setDraggedRow(index);
  const handleRowDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedRow === null || draggedRow === index) return;
  };
  const handleRowDragEnd = () => setDraggedRow(null);

  const moveRow = (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= filteredProjects.length) return;
    // Just visual reorder for now
  };

  const formatBudget = (amount: number) => {
    if (!amount) return '—';
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    return `₹${amount.toLocaleString()}`;
  };

  const getStatusInfo = (status: string) => STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];

  const renderCell = (project: PipelineProject, field: string, index: number) => {
    const isEditing = editingCell?.id === project.id && editingCell?.field === field;

    if (field === 'sno') return <span className="text-gray-400 font-mono text-xs">{index + 1}</span>;

    if (field === 'actions') {
      return (
        <div className="flex gap-1">
          <button onClick={() => moveRow(index, 'up')} className="text-gray-400 hover:text-gray-600 text-xs" title="Move Up">↑</button>
          <button onClick={() => moveRow(index, 'down')} className="text-gray-400 hover:text-gray-600 text-xs" title="Move Down">↓</button>
          <button onClick={() => deleteProject(project.id)} className="text-red-400 hover:text-red-600 text-xs">🗑️</button>
        </div>
      );
    }

    if (field === 'status') {
      const statusInfo = getStatusInfo(project.status);
      return (
        <div className="flex items-center gap-1">
          <select
            value={project.status}
            onChange={async (e) => {
              await fetch(`/api/pipeline/${project.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: e.target.value }),
              });
              fetchProjects();
            }}
            className={`flex-1 px-2 py-1 rounded-full border text-xs font-semibold cursor-pointer ${statusInfo.light}`}
          >
            {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <button
            onClick={() => setShowAddRow(true)}
            className="w-6 h-6 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-bold flex items-center justify-center"
            title="Add Row"
          >
            +
          </button>
        </div>
      );
    }

    if ((field === 'culture' || field === 'format' || field === 'production_poc' || field === 'content_poc') && isEditing) {
      const options = field === 'culture' ? CULTURE_OPTIONS : field === 'format' ? FORMAT_OPTIONS : field === 'production_poc' ? productionPOCOptions : contentPOCOptions;
      const isPOC = field === 'production_poc' || field === 'content_poc';
      return (
        <select
          value={editValue}
          onChange={(e) => {
            if (e.target.value === '__add_member__') {
              if (field === 'production_poc') {
                setShowAddProdPOC(true);
              } else {
                setShowAddContentPOC(true);
              }
              setEditingCell(null);
            } else {
              setEditValue(e.target.value);
            }
          }}
          onBlur={handleCellSave}
          autoFocus
          className="w-full px-2 py-1 border-2 border-blue-400 rounded text-xs bg-blue-50"
        >
          <option value="">Select</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
          {isPOC && <option value="__add_member__">➕ Add Member</option>}
        </select>
      );
    }

    if (isEditing) {
      return <input type={field === 'episodes' ? 'number' : 'text'} value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={handleCellSave} onKeyDown={handleKeyDown} autoFocus className="w-full px-2 py-1 border-2 border-blue-400 rounded text-xs bg-blue-50" />;
    }

    const value = (project as any)[field];

    if (field === 'total_budget') return <span className="font-semibold text-green-600 cursor-pointer hover:underline">{formatBudget(value)} 📊</span>;
    if (field === 'culture' && value) return <span className="px-2 py-0.5 bg-purple-50 text-purple-600 border border-purple-200 rounded-full text-xs">{value}</span>;
    if (field === 'format' && value) return <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-full text-xs">{value}</span>;
    if (field === 'production_poc' && value) return <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-full text-xs cursor-pointer" onClick={() => setSelectedPOCTab(value)}>{value}</span>;
    if (field === 'content_poc' && value) return <span className="px-2 py-0.5 bg-teal-50 text-teal-600 border border-teal-200 rounded-full text-xs">{value}</span>;
    if (field === 'project_name') return <span className="font-semibold text-gray-800">{value}</span>;
    return <span className="text-gray-600 text-sm">{value || '—'}</span>;
  };

  // POC Stats
  const pocStats = productionPOCOptions.map(poc => ({
    name: poc,
    count: projects.filter(p => p.production_poc === poc).length,
    budget: projects.filter(p => p.production_poc === poc).reduce((sum, p) => sum + (p.total_budget || 0), 0),
  }));

  const handleAddPOCMember = (type: 'production' | 'content') => {
    if (!newPOCName.trim()) return;
    if (type === 'production') {
      setProductionPOCOptions([...productionPOCOptions, newPOCName.trim()]);
      setShowAddProdPOC(false);
    } else {
      setContentPOCOptions([...contentPOCOptions, newPOCName.trim()]);
      setShowAddContentPOC(false);
    }
    setNewPOCName('');
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-5 text-white shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-black flex items-center gap-3">📊 Pipeline Tracker</h2>
            <p className="text-slate-300 text-sm mt-1">{filteredProjects.length} of {projects.length} projects</p>
          </div>
          <div className="relative">
            <button onClick={() => setShowExportMenu(!showExportMenu)} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg flex items-center gap-2 text-sm">
              📥 Export
            </button>
            {showExportMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border z-50 min-w-48">
                <button onClick={() => handleExport('all')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-gray-700">Export All</button>
                <button onClick={() => handleExport('filtered')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-gray-700">Export Filtered</button>
                <hr />
                <button onClick={() => handleExport('culture')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-gray-700">Export by Culture</button>
                <button onClick={() => handleExport('format')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-gray-700">Export by Format</button>
                <button onClick={() => handleExport('poc')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-gray-700">Export by POC</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border shadow-sm p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="🔍 Search..." className="px-3 py-2 border rounded-lg w-40 text-sm" />
          <select value={filterCulture} onChange={(e) => setFilterCulture(e.target.value)} className="px-3 py-2 border rounded-lg text-sm bg-purple-50">
            <option value="all">All Cultures</option>
            {CULTURE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterFormat} onChange={(e) => setFilterFormat(e.target.value)} className="px-3 py-2 border rounded-lg text-sm bg-indigo-50">
            <option value="all">All Formats</option>
            {FORMAT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border rounded-lg text-sm bg-amber-50">
            <option value="all">All Status</option>
            {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <select value={filterProdPOC} onChange={(e) => setFilterProdPOC(e.target.value)} className="px-3 py-2 border rounded-lg text-sm bg-blue-50">
            <option value="all">All Prod. POC</option>
            {productionPOCOptions.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={filterContentPOC} onChange={(e) => setFilterContentPOC(e.target.value)} className="px-3 py-2 border rounded-lg text-sm bg-teal-50">
            <option value="all">All Content POC</option>
            {contentPOCOptions.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          {(filterCulture !== 'all' || filterFormat !== 'all' || filterStatus !== 'all' || filterProdPOC !== 'all' || filterContentPOC !== 'all' || searchQuery || selectedPOCTab) && (
            <button onClick={() => { setFilterCulture('all'); setFilterFormat('all'); setFilterStatus('all'); setFilterProdPOC('all'); setFilterContentPOC('all'); setSearchQuery(''); setSelectedPOCTab(null); }} className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium">✕ Clear</button>
          )}
        </div>
      </div>

      {/* POC Tabs */}
      <div className="bg-white rounded-xl border shadow-sm p-4">
        <h3 className="text-sm font-bold text-gray-500 mb-3">PRODUCTION POC</h3>
        <div className="flex gap-3 flex-wrap">
          {pocStats.map(poc => (
            <button
              key={poc.name}
              onClick={() => setSelectedPOCTab(selectedPOCTab === poc.name ? null : poc.name)}
              className={`px-4 py-3 rounded-xl border-2 transition-all ${
                selectedPOCTab === poc.name
                  ? 'bg-blue-500 border-blue-500 text-white shadow-lg'
                  : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <div className="text-lg font-black">{poc.name}</div>
              <div className="text-xs opacity-80">{poc.count} projects • {formatBudget(poc.budget)}</div>
            </button>
          ))}
        </div>

        {/* POC Project Details */}
        {selectedPOCTab && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-bold text-blue-600 mb-3">📁 {selectedPOCTab}'s Projects</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.filter(p => p.production_poc === selectedPOCTab).map(project => {
                const statusInfo = getStatusInfo(project.status);
                return (
                  <div key={project.id} className="bg-gradient-to-br from-slate-50 to-white rounded-xl border-2 border-slate-200 p-4 hover:border-blue-300 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h5 className="font-bold text-gray-800 text-lg">{project.project_name}</h5>
                        <p className="text-gray-500 text-sm">{project.creator}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusInfo.light}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Culture:</span>
                        <span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full text-xs">{project.culture || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Format:</span>
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-xs">{project.format || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Budget:</span>
                        <span className="font-bold text-green-600">{formatBudget(project.total_budget)}</span>
                      </div>
                      {project.episodes && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Episodes:</span>
                          <span className="font-semibold">{project.episodes}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-500">Content POC:</span>
                        <span className="px-2 py-0.5 bg-teal-50 text-teal-600 rounded-full text-xs">{project.content_poc || '—'}</span>
                      </div>
                    </div>
                    {project.budget_breakdown && Object.keys(project.budget_breakdown).length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="text-xs text-gray-500 mb-2">Budget Breakdown:</div>
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          {BUDGET_CATEGORIES.map(cat => {
                            const val = (project.budget_breakdown as any)?.[cat.key];
                            if (!val) return null;
                            return (
                              <div key={cat.key} className="flex justify-between">
                                <span>{cat.icon} {cat.label}:</span>
                                <span className="font-semibold">{formatBudget(val)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {projects.filter(p => p.production_poc === selectedPOCTab).length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-400">
                  <div className="text-3xl mb-2">📭</div>
                  <p>No projects assigned to {selectedPOCTab}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: '1100px' }}>
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-200">
                {columns.map((col, index) => (
                  <th
                    key={col.id}
                    draggable={col.id !== 'sno' && col.id !== 'actions'}
                    onDragStart={() => handleColumnDragStart(index)}
                    onDragOver={(e) => handleColumnDragOver(e, index)}
                    onDragEnd={handleColumnDragEnd}
                    className={`px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-100 select-none ${col.id !== 'sno' && col.id !== 'actions' ? 'cursor-grab hover:bg-slate-100' : ''} ${draggedColumn === index ? 'bg-blue-100' : ''}`}
                    style={{ width: col.width }}
                  >
                    <div className="flex items-center gap-1">
                      {col.id !== 'sno' && col.id !== 'actions' && <span className="text-slate-300">⋮⋮</span>}
                      {col.label}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {showAddRow && (
                <tr className="bg-green-50 border-b-2 border-green-200">
                  {columns.map((col) => (
                    <td key={col.id} className="px-2 py-2 border-r border-green-100">
                      {col.id === 'sno' ? <span className="text-green-600 font-bold text-xs">+</span> :
                       col.id === 'actions' ? (
                        <div className="flex gap-1">
                          <button onClick={handleAddRow} className="text-green-600">✓</button>
                          <button onClick={() => setShowAddRow(false)} className="text-red-500">✕</button>
                        </div>
                      ) : col.id === 'status' ? (
                        <select value={newRow.status} onChange={(e) => setNewRow({ ...newRow, status: e.target.value })} className="w-full px-2 py-1 border rounded text-xs">
                          {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                      ) : col.id === 'culture' ? (
                        <select value={newRow.culture} onChange={(e) => setNewRow({ ...newRow, culture: e.target.value })} className="w-full px-2 py-1 border rounded text-xs">
                          <option value="">Select</option>
                          {CULTURE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      ) : col.id === 'format' ? (
                        <select value={newRow.format} onChange={(e) => setNewRow({ ...newRow, format: e.target.value })} className="w-full px-2 py-1 border rounded text-xs">
                          <option value="">Select</option>
                          {FORMAT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                      ) : col.id === 'production_poc' ? (
                        <select value={newRow.production_poc} onChange={(e) => {
                          if (e.target.value === '__add_member__') {
                            setShowAddProdPOC(true);
                          } else {
                            setNewRow({ ...newRow, production_poc: e.target.value });
                          }
                        }} className="w-full px-2 py-1 border rounded text-xs">
                          <option value="">Select</option>
                          {productionPOCOptions.map(p => <option key={p} value={p}>{p}</option>)}
                          <option value="__add_member__">➕ Add Member</option>
                        </select>
                      ) : col.id === 'content_poc' ? (
                        <select value={newRow.content_poc} onChange={(e) => {
                          if (e.target.value === '__add_member__') {
                            setShowAddContentPOC(true);
                          } else {
                            setNewRow({ ...newRow, content_poc: e.target.value });
                          }
                        }} className="w-full px-2 py-1 border rounded text-xs">
                          <option value="">Select</option>
                          {contentPOCOptions.map(p => <option key={p} value={p}>{p}</option>)}
                          <option value="__add_member__">➕ Add Member</option>
                        </select>
                      ) : (
                        <input type={col.id === 'total_budget' || col.id === 'episodes' ? 'number' : 'text'} value={(newRow as any)[col.id] || ''} onChange={(e) => setNewRow({ ...newRow, [col.id]: e.target.value })} placeholder={col.label} className="w-full px-2 py-1 border rounded text-xs" />
                      )}
                    </td>
                  ))}
                </tr>
              )}
              {filteredProjects.map((project, index) => (
                <tr
                  key={project.id}
                  draggable
                  onDragStart={() => handleRowDragStart(index)}
                  onDragOver={(e) => handleRowDragOver(e, index)}
                  onDragEnd={handleRowDragEnd}
                  className={`border-b border-slate-100 hover:bg-blue-50/30 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'} ${draggedRow === index ? 'bg-blue-100' : ''}`}
                >
                  {columns.map((col) => (
                    <td key={col.id} onClick={() => handleCellClick(project.id, col.id, (project as any)[col.id], project)} className={`px-3 py-2.5 border-r border-slate-50 ${col.id !== 'sno' && col.id !== 'actions' && col.id !== 'status' ? 'cursor-pointer hover:bg-blue-50' : ''}`} style={{ width: col.width }}>
                      {renderCell(project, col.id, index)}
                    </td>
                  ))}
                </tr>
              ))}
              {filteredProjects.length === 0 && !showAddRow && (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-16 text-center text-gray-400">
                    <div className="text-5xl mb-3">📋</div>
                    <div className="font-semibold text-lg">No projects found</div>
                    <button onClick={() => setShowAddRow(true)} className="mt-3 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-bold">+ Add Project</button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Budget Modal */}
      {showBudgetModal && selectedProjectForBudget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowBudgetModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">💰 Budget Breakdown</h3>
                  <p className="text-green-100 text-sm">{selectedProjectForBudget.project_name}</p>
                </div>
                <button onClick={() => setShowBudgetModal(false)} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30">✕</button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {BUDGET_CATEGORIES.map(cat => (
                <div key={cat.key} className="flex items-center gap-3">
                  <span className="text-2xl w-10">{cat.icon}</span>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-600">{cat.label}</label>
                    <input type="number" value={(budgetBreakdown as any)[cat.key] || ''} onChange={(e) => setBudgetBreakdown({ ...budgetBreakdown, [cat.key]: parseFloat(e.target.value) || 0 })} placeholder="₹ 0" className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 outline-none mt-1" />
                  </div>
                </div>
              ))}
              <div className="border-t-2 pt-4 mt-4">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total Budget:</span>
                  <span className="text-green-600">{formatBudget(Object.values(budgetBreakdown).reduce((sum, val) => sum + (val || 0), 0))}</span>
                </div>
              </div>
              <button onClick={handleSaveBudget} className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700">Save Budget</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Production POC Member Modal */}
      {showAddProdPOC && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowAddProdPOC(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">👤 Add Production POC</h3>
                <button onClick={() => setShowAddProdPOC(false)} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30">✕</button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <input
                type="text"
                value={newPOCName}
                onChange={(e) => setNewPOCName(e.target.value)}
                placeholder="Enter member name"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none"
                autoFocus
              />
              <button
                onClick={() => handleAddPOCMember('production')}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Content POC Member Modal */}
      {showAddContentPOC && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowAddContentPOC(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">👤 Add Content POC</h3>
                <button onClick={() => setShowAddContentPOC(false)} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30">✕</button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <input
                type="text"
                value={newPOCName}
                onChange={(e) => setNewPOCName(e.target.value)}
                placeholder="Enter member name"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 outline-none"
                autoFocus
              />
              <button
                onClick={() => handleAddPOCMember('content')}
                className="w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-bold rounded-xl hover:from-teal-700 hover:to-cyan-700"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
