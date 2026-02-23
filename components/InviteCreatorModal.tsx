'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface InviteCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  projectTitle?: string;
  onInviteSent?: (inviteData: any) => void;
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
  const [subject, setSubject] = useState(projectTitle ? `Invitation to join ${projectTitle}` : 'Invitation to join STAGE Creator Portal');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

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
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const link = `${baseUrl}/login?invite=${code}`;

      // Save to database
      try {
        const { error: dbError } = await supabase
          .from('creator_invites')
          .insert({
            full_name: fullName,
            email: email,
            invite_code: code,
            project_id: projectId || null,
            status: 'pending',
            subject: subject,
            message: message,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          });

        if (dbError) {
          console.log('Database insert info:', dbError.message);
        }
      } catch (e) {
        console.log('Database operation skipped');
      }

      setInviteCode(code);
      setInviteLink(link);

      // Notify parent component
      if (onInviteSent) {
        onInviteSent({
          fullName,
          email,
          inviteCode: code,
          inviteLink: link,
          subject,
          message,
          projectId,
          projectTitle,
          sentAt: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create invite');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getEmailBody = () => {
    return `Hi ${fullName},

${message || 'You have been invited to join STAGE Creator Portal.'}

${projectTitle ? `Project: ${projectTitle}` : ''}

Click the link below to create your account and get started:
${inviteLink}

Your Invite Code: ${inviteCode}
(Valid for 7 days)

Welcome to STAGE!

Best regards,
STAGE Team`.trim();
  };

  // Open Gmail directly in browser
  const openGmail = () => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(getEmailBody())}`;
    window.open(gmailUrl, '_blank');
    setEmailSent(true);
  };

  // Fallback mailto
  const sendMailto = () => {
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(getEmailBody())}`;
    window.location.href = mailtoLink;
    setEmailSent(true);
  };

  const copyFullInvite = () => {
    navigator.clipboard.writeText(getEmailBody());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setFullName('');
    setEmail('');
    setSubject(projectTitle ? `Invitation to join ${projectTitle}` : 'Invitation to join STAGE Creator Portal');
    setMessage('');
    setInviteCode('');
    setInviteLink('');
    setError('');
    setCopied(false);
    setEmailSent(false);
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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📨</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Invite Creator</h2>
                <p className="text-blue-100 text-sm">Send personalized invite via Email</p>
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

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Email Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Invitation to join STAGE"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Personal Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a personal message for the creator..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
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
                <p className="text-green-800 font-bold">Invite Ready!</p>
                <p className="text-green-600 text-sm">Send to {fullName} ({email})</p>
              </div>

              {/* Invite Link - Prominent */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
                <p className="text-xs text-blue-600 uppercase font-bold mb-2">Invite Link</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inviteLink}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm text-gray-700 font-medium"
                  />
                  <button
                    onClick={() => copyToClipboard(inviteLink)}
                    className={`px-4 py-2 ${copied ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold rounded-lg text-sm transition-colors`}
                  >
                    {copied ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Invite Code */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase font-bold mb-2">Invite Code</p>
                <p className="text-2xl font-mono font-black text-gray-800 tracking-wider">{inviteCode}</p>
              </div>

              {/* Send Email Buttons */}
              <div className="space-y-2">
                {/* Gmail Direct */}
                <button
                  onClick={openGmail}
                  className={`w-full py-3 ${emailSent ? 'bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors`}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                  </svg>
                  {emailSent ? '✓ Gmail Opened' : 'Open in Gmail'}
                </button>

                {/* Default Mail App */}
                <button
                  onClick={sendMailto}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Open in Default Mail App
                </button>

                {/* Copy Full Message */}
                <button
                  onClick={copyFullInvite}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy Full Message
                </button>
              </div>

              {/* Preview Message */}
              <details className="bg-gray-50 border border-gray-200 rounded-lg">
                <summary className="px-4 py-3 cursor-pointer text-sm font-bold text-gray-600 hover:text-gray-800">
                  Preview Email Message
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600 whitespace-pre-line border-t border-gray-200 pt-3">
                  <p><strong>To:</strong> {email}</p>
                  <p><strong>Subject:</strong> {subject}</p>
                  <hr className="my-2" />
                  <p className="whitespace-pre-wrap">{getEmailBody()}</p>
                </div>
              </details>

              {/* Done Button */}
              <button
                onClick={handleClose}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg"
              >
                Done - Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
