'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface InviteCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  projectTitle?: string;
  onInviteSent?: (inviteCode: string, inviteLink: string) => void;
}

export default function InviteCreatorModal({
  isOpen,
  onClose,
  projectId,
  projectTitle,
  onInviteSent,
}: InviteCreatorModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [inviteLink, setInviteLink] = useState('');

  const generateInviteCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const code = generateInviteCode();

      // Try to save to database
      try {
        const { error: dbError } = await supabase
          .from('creator_invites')
          .insert({
            full_name: fullName,
            email: email,
            invite_code: code,
            project_id: projectId || null,
            status: 'pending',
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
          });

        if (dbError) {
          console.log('Database insert skipped (tables may not exist yet):', dbError.message);
        }
      } catch (e) {
        console.log('Database not configured yet, generating local invite');
      }

      // Generate invite link
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const link = `${baseUrl}/login?invite=${code}`;

      setInviteCode(code);
      setInviteLink(link);

      if (onInviteSent) {
        onInviteSent(code, link);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create invite');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const handleClose = () => {
    setFullName('');
    setEmail('');
    setInviteCode('');
    setInviteLink('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📨</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Invite Creator</h2>
                <p className="text-blue-100 text-sm">Send invite link via Email</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white p-1"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {projectTitle && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-700">
                <span className="font-bold">Project:</span> {projectTitle}
              </p>
            </div>
          )}

          {!inviteCode ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Creator's Full Name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter creator's name"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Creator's Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="creator@example.com"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !fullName || !email}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Creating Invite...' : 'Generate Invite Link'}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Success */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <span className="text-4xl mb-2 block">✅</span>
                <p className="text-green-800 font-bold">Invite Created!</p>
                <p className="text-green-600 text-sm">Share the link with {fullName}</p>
              </div>

              {/* Invite Code */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase font-bold mb-2">Invite Code</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-mono font-black text-gray-800 tracking-wider">{inviteCode}</p>
                  <button
                    onClick={() => copyToClipboard(inviteCode)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-bold"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Invite Link */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase font-bold mb-2">Invite Link</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inviteLink}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600"
                  />
                  <button
                    onClick={() => copyToClipboard(inviteLink)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Send Email Button */}
              <button
                onClick={() => {
                  const subject = `STAGE Creator Portal Invite${projectTitle ? ` - ${projectTitle}` : ''}`;
                  const body = `Hi ${fullName},%0D%0A%0D%0AYou've been invited to join STAGE Creator Portal.%0D%0A%0D%0AClick here to get started: ${inviteLink}%0D%0A%0D%0AInvite Code: ${inviteCode}%0D%0A%0D%0AWelcome to STAGE!`;
                  window.open(`mailto:${email}?subject=${subject}&body=${body}`);
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Email to {email}
              </button>

              {/* Done Button */}
              <button
                onClick={handleClose}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
