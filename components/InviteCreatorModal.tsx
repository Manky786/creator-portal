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
  const [phone, setPhone] = useState('');
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
            email: email || null,
            phone: phone || null,
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

  const shareViaWhatsApp = () => {
    const message = `🎬 *STAGE Creator Portal Invite*

Hi ${fullName}!

You've been invited to join STAGE Creator Portal${projectTitle ? ` for the project: *${projectTitle}*` : ''}.

Click the link below to create your account and get started:
${inviteLink}

*Invite Code:* ${inviteCode}
(Valid for 7 days)

Welcome to the STAGE family! 🎉`;

    const whatsappUrl = `https://wa.me/${phone ? phone.replace(/\D/g, '') : ''}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleClose = () => {
    setFullName('');
    setEmail('');
    setPhone('');
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
                <p className="text-blue-100 text-sm">Send invite link via WhatsApp/Email</p>
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
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="creator@example.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Phone Number (for WhatsApp)
                </label>
                <div className="flex">
                  <span className="px-4 py-3 bg-gray-100 border border-gray-200 border-r-0 rounded-l-lg text-gray-600 font-medium">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    maxLength={10}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-r-lg focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !fullName}
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

              {/* Share Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={shareViaWhatsApp}
                  className="py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </button>
                <button
                  onClick={() => {
                    const subject = `STAGE Creator Portal Invite${projectTitle ? ` - ${projectTitle}` : ''}`;
                    const body = `Hi ${fullName},%0D%0A%0D%0AYou've been invited to join STAGE Creator Portal.%0D%0A%0D%0AClick here to get started: ${inviteLink}%0D%0A%0D%0AInvite Code: ${inviteCode}%0D%0A%0D%0AWelcome to STAGE!`;
                    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
                  }}
                  className="py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </button>
              </div>

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
