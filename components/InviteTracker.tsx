'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Invite {
  id: string;
  full_name: string;
  email: string;
  invite_code: string;
  status: string;
  created_at: string;
  subject?: string;
  message?: string;
  project_id?: string;
}

interface Project {
  id: string;
  title: string;
}

export default function InviteTracker() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [projects, setProjects] = useState<{[key: string]: Project}>({});
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvite, setSelectedInvite] = useState<Invite | null>(null);

  useEffect(() => {
    fetchInvites();
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await supabase
        .from('projects')
        .select('id, title');

      if (data) {
        const projectMap: {[key: string]: Project} = {};
        data.forEach(p => { projectMap[p.id] = p; });
        setProjects(projectMap);
      }
    } catch (e) {
      console.log('Failed to fetch projects');
    }
  };

  const fetchInvites = async () => {
    try {
      const { data, error } = await supabase
        .from('creator_invites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Error fetching invites:', error.message);
        return;
      }

      setInvites(data || []);
    } catch (e) {
      console.log('Failed to fetch invites');
    } finally {
      setLoading(false);
    }
  };

  const deleteInvite = async (id: string) => {
    try {
      const { error } = await supabase
        .from('creator_invites')
        .delete()
        .eq('id', id);

      if (error) {
        alert('Failed to delete invite');
        return;
      }

      setInvites(invites.filter(inv => inv.id !== id));
      setDeleteConfirm(null);
      setSelectedInvite(null);
    } catch (e) {
      alert('Error deleting invite');
    }
  };

  const resendInvite = (invite: Invite) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const inviteLink = `${baseUrl}/login?invite=${invite.invite_code}`;
    const projectTitle = invite.project_id ? projects[invite.project_id]?.title : '';

    const emailBody = `Hi ${invite.full_name},

This is a reminder about your invitation to join STAGE Creator Portal.
${projectTitle ? `\nProject: ${projectTitle}` : ''}

Click the link below to create your account and get started:
${inviteLink}

Your Invite Code: ${invite.invite_code}

Welcome to STAGE!

Best regards,
STAGE Team`;

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(invite.email)}&su=${encodeURIComponent(invite.subject || 'Reminder: STAGE Creator Portal Invite')}&body=${encodeURIComponent(emailBody)}`;
    window.open(gmailUrl, '_blank');
  };

  const copyInviteLink = (invite: Invite) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const inviteLink = `${baseUrl}/login?invite=${invite.invite_code}`;
    navigator.clipboard.writeText(inviteLink);
    alert('Invite link copied!');
  };

  const getStatusInfo = (invite: Invite) => {
    if (invite.status === 'accepted') {
      return { label: 'Accepted', color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50' };
    } else {
      return { label: 'Pending', color: 'bg-amber-500', textColor: 'text-amber-700', bgColor: 'bg-amber-50' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  };

  // Filter invites
  const filteredInvites = invites.filter(invite => {
    const statusInfo = getStatusInfo(invite);
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'accepted' && statusInfo.label === 'Accepted') ||
      (filterStatus === 'pending' && statusInfo.label === 'Pending');

    const matchesSearch = searchQuery === '' ||
      invite.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invite.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invite.invite_code.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Stats
  const stats = {
    total: invites.length,
    pending: invites.filter(i => getStatusInfo(i).label === 'Pending').length,
    accepted: invites.filter(i => getStatusInfo(i).label === 'Accepted').length,
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
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => setFilterStatus('all')}
          className={`p-4 rounded-xl border-2 transition-all ${filterStatus === 'all' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-white hover:border-purple-300'}`}
        >
          <div className="text-3xl font-black text-gray-800">{stats.total}</div>
          <div className="text-sm font-medium text-gray-500">Total Invites</div>
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          className={`p-4 rounded-xl border-2 transition-all ${filterStatus === 'pending' ? 'border-amber-500 bg-amber-50' : 'border-gray-200 bg-white hover:border-amber-300'}`}
        >
          <div className="text-3xl font-black text-amber-600">{stats.pending}</div>
          <div className="text-sm font-medium text-gray-500">Pending</div>
        </button>
        <button
          onClick={() => setFilterStatus('accepted')}
          className={`p-4 rounded-xl border-2 transition-all ${filterStatus === 'accepted' ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-green-300'}`}
        >
          <div className="text-3xl font-black text-green-600">{stats.accepted}</div>
          <div className="text-sm font-medium text-gray-500">Accepted</div>
        </button>
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
            placeholder="Search by name, email, or code..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
          />
        </div>
        <button
          onClick={fetchInvites}
          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Invites List */}
      {filteredInvites.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📭</span>
          </div>
          <h3 className="text-lg font-bold text-gray-700 mb-1">No invites found</h3>
          <p className="text-gray-500">
            {searchQuery ? 'Try a different search term' : 'Click "Invite Creator" to send your first invite'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <div className="col-span-3">Creator</div>
            <div className="col-span-2">Project</div>
            <div className="col-span-2">Code</div>
            <div className="col-span-2">Sent</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {filteredInvites.map((invite) => {
              const statusInfo = getStatusInfo(invite);
              const projectTitle = invite.project_id ? projects[invite.project_id]?.title : null;

              return (
                <div
                  key={invite.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
                >
                  {/* Creator Info */}
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                      {invite.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-800 truncate">{invite.full_name}</div>
                      <div className="text-sm text-gray-500 truncate">{invite.email}</div>
                    </div>
                  </div>

                  {/* Project */}
                  <div className="col-span-2">
                    {projectTitle ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium">
                        🎬 {projectTitle.length > 15 ? projectTitle.substring(0, 15) + '...' : projectTitle}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">General Invite</span>
                    )}
                  </div>

                  {/* Code */}
                  <div className="col-span-2">
                    <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono font-bold text-gray-700">
                      {invite.invite_code}
                    </code>
                  </div>

                  {/* Sent Date */}
                  <div className="col-span-2 text-sm text-gray-500">
                    <div>{formatDate(invite.created_at)}</div>
                    <div className="text-xs text-gray-400">{getTimeAgo(invite.created_at)}</div>
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.color}`}></span>
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => copyInviteLink(invite)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Copy invite link"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                    {statusInfo.label === 'Pending' && (
                      <button
                        onClick={() => resendInvite(invite)}
                        className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Resend via Gmail"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedInvite(invite)}
                      className="p-2 text-purple-500 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                      title="View details"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    {deleteConfirm === invite.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => deleteInvite(invite.id)}
                          className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(invite.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete invite"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedInvite(null)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xl">
                    {selectedInvite.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedInvite.full_name}</h3>
                    <p className="text-purple-100 text-sm">{selectedInvite.email}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedInvite(null)} className="text-white/80 hover:text-white">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs font-bold text-gray-500 uppercase mb-1">Invite Code</div>
                  <div className="font-mono font-black text-xl text-gray-800">{selectedInvite.invite_code}</div>
                </div>
                <div className={`rounded-xl p-4 ${getStatusInfo(selectedInvite).bgColor}`}>
                  <div className="text-xs font-bold text-gray-500 uppercase mb-1">Status</div>
                  <div className={`font-bold text-xl ${getStatusInfo(selectedInvite).textColor}`}>
                    {getStatusInfo(selectedInvite).label}
                  </div>
                </div>
              </div>

              {selectedInvite.project_id && projects[selectedInvite.project_id] && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="text-xs font-bold text-gray-500 uppercase mb-1">Project</div>
                  <div className="font-bold text-blue-700">🎬 {projects[selectedInvite.project_id].title}</div>
                </div>
              )}

              <div>
                <div className="text-xs font-bold text-gray-500 uppercase mb-1">Sent On</div>
                <div className="text-gray-700">{formatDateTime(selectedInvite.created_at)}</div>
              </div>

              {selectedInvite.subject && (
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase mb-1">Email Subject</div>
                  <div className="text-gray-700">{selectedInvite.subject}</div>
                </div>
              )}

              {selectedInvite.message && (
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase mb-1">Personal Message</div>
                  <div className="text-gray-600 text-sm bg-gray-50 rounded-lg p-3">{selectedInvite.message}</div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => copyInviteLink(selectedInvite)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                >
                  Copy Link
                </button>
                {getStatusInfo(selectedInvite).label === 'Pending' && (
                  <button
                    onClick={() => { resendInvite(selectedInvite); setSelectedInvite(null); }}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
                  >
                    Resend Email
                  </button>
                )}
                <button
                  onClick={() => { deleteInvite(selectedInvite.id); }}
                  className="py-2.5 px-4 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-xl transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
