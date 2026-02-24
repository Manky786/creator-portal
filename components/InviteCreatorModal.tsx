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
  const [step, setStep] = useState<'compose' | 'ready'>('compose');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(projectTitle ? `Invitation: ${projectTitle} - STAGE Creator Portal` : 'Invitation to join STAGE Creator Portal');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const generateInviteCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleGenerateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const code = generateInviteCode();
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const link = `${baseUrl}/login?invite=${code}`;

      // Save to database
      try {
        await supabase
          .from('creator_invites')
          .insert({
            full_name: fullName,
            email: email,
            invite_code: code,
            project_id: projectId || null,
            status: 'pending',
            subject: subject,
            message: message,
          });
      } catch (e) {
        console.log('Database operation skipped');
      }

      setInviteCode(code);
      setInviteLink(link);
      setStep('ready');

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

  const getEmailBody = () => {
    return `Hi ${fullName},

${message || 'You have been invited to join STAGE Creator Portal as a content creator.'}

${projectTitle ? `Project: ${projectTitle}\n` : ''}
Click the link below to create your account and get started:
${inviteLink}

Your Invite Code: ${inviteCode}

Looking forward to working with you!

Best regards,
STAGE Team`;
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const openGmail = () => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(getEmailBody())}`;
    window.open(gmailUrl, '_blank');
  };

  const openDefaultMail = () => {
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(getEmailBody())}`;
    window.location.href = mailtoLink;
  };

  const handleClose = () => {
    setStep('compose');
    setFullName('');
    setEmail('');
    setSubject(projectTitle ? `Invitation: ${projectTitle} - STAGE Creator Portal` : 'Invitation to join STAGE Creator Portal');
    setMessage('');
    setInviteCode('');
    setInviteLink('');
    setError('');
    setCopied(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose}></div>

      {/* Modal */}
      <div className="relative bg-[#1a1a1a] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-800">

        {/* Header - Gmail Style */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {step === 'ready' && (
                <button
                  onClick={() => setStep('compose')}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              {step === 'compose' && (
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div>
                <h2 className="text-lg font-bold text-white">
                  {step === 'compose' ? 'Compose Invitation' : 'Invitation Ready'}
                </h2>
                <p className="text-red-100 text-sm">
                  {step === 'compose' ? 'Invite a creator to STAGE' : 'Send via Gmail or copy link'}
                </p>
              </div>
            </div>
            <button onClick={handleClose} className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'compose' ? (
            <form onSubmit={handleGenerateInvite} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {projectTitle && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 flex items-center gap-2">
                  <span className="text-blue-400">🎬</span>
                  <span className="text-blue-300 text-sm">Project: <strong>{projectTitle}</strong></span>
                </div>
              )}

              {/* To Field */}
              <div className="flex items-center gap-4 border-b border-gray-700 pb-4">
                <label className="text-gray-400 text-sm w-16">To:</label>
                <div className="flex-1 flex gap-3">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Creator's Name"
                    required
                    className="flex-1 px-3 py-2 bg-[#252525] border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-red-500 outline-none text-sm"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    required
                    className="flex-1 px-3 py-2 bg-[#252525] border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-red-500 outline-none text-sm"
                  />
                </div>
              </div>

              {/* Subject Field */}
              <div className="flex items-center gap-4 border-b border-gray-700 pb-4">
                <label className="text-gray-400 text-sm w-16">Subject:</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Email subject line"
                  className="flex-1 px-3 py-2 bg-[#252525] border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-red-500 outline-none text-sm"
                />
              </div>

              {/* Message Field */}
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Message (Optional):</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a personal message for the creator...

Example: We loved your work on XYZ project and would like to invite you to collaborate with us on an exciting new regional content project."
                  rows={5}
                  className="w-full px-4 py-3 bg-[#252525] border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-red-500 outline-none text-sm resize-none"
                />
              </div>

              {/* Generate Button */}
              <button
                type="submit"
                disabled={loading || !fullName || !email}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Invite...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Generate Invite Link
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              {/* Success Banner */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-green-400 font-bold">Invitation Created!</p>
                <p className="text-green-300/70 text-sm">For {fullName} ({email})</p>
              </div>

              {/* Invite Link - Copy Section */}
              <div className="bg-[#252525] rounded-xl p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-xs uppercase font-bold">Invite Link</span>
                  <button
                    onClick={() => copyToClipboard(inviteLink, 'link')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      copied === 'link'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {copied === 'link' ? '✓ Copied!' : 'Copy Link'}
                  </button>
                </div>
                <div className="bg-[#1a1a1a] rounded-lg px-3 py-2 text-sm text-gray-300 font-mono break-all">
                  {inviteLink}
                </div>
              </div>

              {/* Invite Code */}
              <div className="bg-[#252525] rounded-xl p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-xs uppercase font-bold">Invite Code</span>
                  <button
                    onClick={() => copyToClipboard(inviteCode, 'code')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      copied === 'code'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {copied === 'code' ? '✓ Copied!' : 'Copy Code'}
                  </button>
                </div>
                <div className="text-2xl font-mono font-black text-white tracking-widest">
                  {inviteCode}
                </div>
              </div>

              {/* Full Email - Copy Section */}
              <div className="bg-[#252525] rounded-xl p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-xs uppercase font-bold">Full Email Content</span>
                  <button
                    onClick={() => copyToClipboard(getEmailBody(), 'email')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      copied === 'email'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {copied === 'email' ? '✓ Copied!' : 'Copy Email'}
                  </button>
                </div>
                <div className="bg-[#1a1a1a] rounded-lg px-3 py-2 text-xs text-gray-400 max-h-32 overflow-y-auto whitespace-pre-wrap">
                  {getEmailBody()}
                </div>
              </div>

              {/* Send Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={openGmail}
                  className="py-3 bg-white hover:bg-gray-100 text-gray-800 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                  </svg>
                  Open Gmail
                </button>
                <button
                  onClick={openDefaultMail}
                  className="py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Default Mail
                </button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    setStep('compose');
                    setFullName('');
                    setEmail('');
                    setSubject(projectTitle ? `Invitation: ${projectTitle} - STAGE Creator Portal` : 'Invitation to join STAGE Creator Portal');
                    setMessage('');
                    setInviteCode('');
                    setInviteLink('');
                    setCopied(null);
                  }}
                  className="py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Invite
                </button>
                <button
                  onClick={handleClose}
                  className="py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
