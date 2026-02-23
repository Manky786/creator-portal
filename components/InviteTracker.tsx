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
  expires_at: string;
  subject?: string;
  message?: string;
}

export default function InviteTracker() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchInvites();
  }, []);

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
    } catch (e) {
      alert('Error deleting invite');
    }
  };

  const resendInvite = (invite: Invite) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const inviteLink = `${baseUrl}/login?invite=${invite.invite_code}`;

    const emailBody = `Hi ${invite.full_name},

This is a reminder about your invitation to join STAGE Creator Portal.

Click the link below to create your account and get started:
${inviteLink}

Your Invite Code: ${invite.invite_code}

Welcome to STAGE!

Best regards,
STAGE Team`;

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(invite.email)}&su=${encodeURIComponent(invite.subject || 'Reminder: STAGE Creator Portal Invite')}&body=${encodeURIComponent(emailBody)}`;
    window.open(gmailUrl, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-12 bg-gray-100 rounded"></div>
            <div className="h-12 bg-gray-100 rounded"></div>
            <div className="h-12 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-xl">📋</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Invite Tracker</h3>
              <p className="text-purple-100 text-sm">{invites.length} invites sent</p>
            </div>
          </div>
          <button
            onClick={fetchInvites}
            className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {invites.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-4xl mb-3 block">📭</span>
            <p className="text-gray-500">No invites sent yet</p>
            <p className="text-gray-400 text-sm">Click "Invite Creator" to send your first invite</p>
          </div>
        ) : (
          <div className="space-y-3">
            {invites.map((invite) => (
              <div
                key={invite.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-800 truncate">{invite.full_name}</h4>
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${getStatusColor(isExpired(invite.expires_at) ? 'expired' : invite.status)}`}>
                        {isExpired(invite.expires_at) ? 'Expired' : invite.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{invite.email}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>Code: <span className="font-mono font-bold text-gray-600">{invite.invite_code}</span></span>
                      <span>Sent: {formatDate(invite.created_at)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Resend Button */}
                    {invite.status === 'pending' && !isExpired(invite.expires_at) && (
                      <button
                        onClick={() => resendInvite(invite)}
                        className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm font-medium rounded-lg transition-colors"
                        title="Resend invite via Gmail"
                      >
                        📧 Resend
                      </button>
                    )}

                    {/* Delete Button */}
                    {deleteConfirm === invite.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => deleteInvite(invite.id)}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(invite.id)}
                        className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium rounded-lg transition-colors"
                        title="Delete invite"
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
