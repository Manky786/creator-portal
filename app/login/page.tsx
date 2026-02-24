'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

type LoginType = 'select' | 'creator' | 'team';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteCode = searchParams.get('invite');

  const [loginType, setLoginType] = useState<LoginType>(inviteCode ? 'creator' : 'select');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profile?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/creator');
        }
      }
    };
    checkSession();
  }, [router]);

  // Google Sign In for Creators
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback${inviteCode ? `?invite=${inviteCode}` : ''}`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  // Team Login (STAGE Email)
  const handleTeamLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const fullEmail = email.includes('@') ? email : `${email}@stage.in`;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: fullEmail,
        password,
      });

      if (error) throw error;

      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Team Signup (STAGE Email - auto admin)
  const handleTeamSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const fullEmail = email.includes('@') ? email : `${email}@stage.in`;

    // Verify it's a @stage.in email
    if (!fullEmail.endsWith('@stage.in')) {
      setError('Only @stage.in emails can register as team members');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: fullEmail,
        password,
        options: {
          data: {
            full_name: fullName || email.split('@')[0],
            role: 'admin',
          },
        },
      });

      if (error) throw error;

      setSuccess('Account created! Check your email to verify, then login.');
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Creator Email Signup (for invited creators)
  const handleCreatorSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'creator',
            invite_code: inviteCode || '',
          },
        },
      });

      if (error) throw error;

      // Handle invite code
      if (inviteCode && data.user) {
        const { data: invite } = await supabase
          .from('creator_invites')
          .select('project_id')
          .eq('invite_code', inviteCode.toUpperCase())
          .single();

        if (invite?.project_id) {
          await supabase
            .from('projects')
            .update({ assigned_creator_id: data.user.id })
            .eq('id', invite.project_id);
        }

        await supabase
          .from('creator_invites')
          .update({ status: 'accepted', accepted_at: new Date().toISOString() })
          .eq('invite_code', inviteCode.toUpperCase());
      }

      setSuccess('Account created! Please check your email to verify your account.');
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Creator Email Login
  const handleCreatorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Handle invite code if present
      if (inviteCode) {
        await supabase
          .from('creator_invites')
          .update({ status: 'accepted', accepted_at: new Date().toISOString() })
          .eq('invite_code', inviteCode.toUpperCase());
      }

      router.push('/creator');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-6 flex flex-col items-center">
        <Image
          src="/images/stage-logo-official.png"
          alt="STAGE"
          width={180}
          height={60}
          className="h-14 w-auto mb-4"
        />
        {/* Badge */}
        <div className={`px-4 py-2 rounded-full border ${
          loginType === 'team'
            ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
            : 'border-red-500/50 bg-red-500/10 text-red-400'
        } text-sm font-medium flex items-center gap-2`}>
          {loginType === 'team' ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Internal Team Portal
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Creator Portal
            </>
          )}
        </div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md">
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8">

          {/* Selection View */}
          {loginType === 'select' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white mb-2">Welcome to STAGE</h1>
                <p className="text-gray-400">Select your login type</p>
              </div>

              {/* Creator Login Option */}
              <button
                onClick={() => setLoginType('creator')}
                className="w-full p-4 bg-[#252525] hover:bg-[#2a2a2a] border border-gray-700 hover:border-red-500/50 rounded-xl transition-all flex items-center gap-4 group"
              >
                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-bold text-white group-hover:text-red-400 transition-colors">Creator Login</div>
                  <div className="text-sm text-gray-400">Writers, directors, producers</div>
                </div>
              </button>

              {/* Team Login Option */}
              <button
                onClick={() => setLoginType('team')}
                className="w-full p-4 bg-[#252525] hover:bg-[#2a2a2a] border border-gray-700 hover:border-amber-500/50 rounded-xl transition-all flex items-center gap-4 group"
              >
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-bold text-white group-hover:text-amber-400 transition-colors">STAGE Team</div>
                  <div className="text-sm text-gray-400">Content managers & reviewers</div>
                </div>
              </button>
            </div>
          )}

          {/* Creator Login View */}
          {loginType === 'creator' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  {isSignup ? 'Create Account' : 'Welcome back'}
                </h1>
                <p className="text-gray-400">
                  {isSignup ? 'Sign up to access your dashboard' : 'Sign in to continue to your dashboard'}
                </p>
              </div>

              {/* Invite Banner */}
              {inviteCode && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎉</span>
                    <div>
                      <p className="text-green-400 font-bold">You've been invited!</p>
                      <p className="text-green-300/70 text-sm">Create an account to start your project</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <p className="text-green-400 text-sm">{success}</p>
                </div>
              )}

              {/* Email Form */}
              <form onSubmit={isSignup ? handleCreatorSignup : handleCreatorLogin} className="space-y-4">
                {isSignup && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      required
                      className="w-full px-4 py-3 bg-[#252525] border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-3 bg-[#252525] border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isSignup ? "Create a password" : "Enter your password"}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 bg-[#252525] border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all disabled:opacity-50"
                >
                  {loading ? 'Please wait...' : (isSignup ? 'Create Account' : 'Sign In')}
                </button>
              </form>

              {/* Toggle Signup/Login */}
              <div className="text-center border-t border-gray-700 pt-4">
                <p className="text-gray-400">
                  {isSignup ? "Already have an account? " : "Don't have an account? "}
                  <button
                    onClick={() => { setIsSignup(!isSignup); setError(''); setSuccess(''); }}
                    className="text-red-500 hover:text-red-400 font-semibold"
                  >
                    {isSignup ? 'Sign In' : 'Create Account'}
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Team Login View */}
          {loginType === 'team' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  {isSignup ? 'Join STAGE Team' : 'Team Login'}
                </h1>
                <p className="text-gray-400">
                  {isSignup ? 'Create your admin account' : 'Access the content review dashboard'}
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <p className="text-green-400 text-sm">{success}</p>
                </div>
              )}

              <form onSubmit={isSignup ? handleTeamSignup : handleTeamLogin} className="space-y-4">
                {isSignup && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      required
                      className="w-full px-4 py-3 bg-[#252525] border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">STAGE Email</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="yourname"
                      required
                      className="w-full px-4 py-3 pr-24 bg-[#252525] border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                      @stage.in
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isSignup ? "Create a password" : "Enter your password"}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 bg-[#252525] border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold rounded-xl transition-all disabled:opacity-50"
                >
                  {loading ? 'Please wait...' : (isSignup ? 'Create Admin Account' : 'Sign In to Dashboard')}
                </button>
              </form>

              {/* Toggle Login/Signup */}
              <div className="text-center border-t border-gray-700 pt-4">
                <p className="text-gray-400">
                  {isSignup ? "Already have an account? " : "New team member? "}
                  <button
                    onClick={() => { setIsSignup(!isSignup); setError(''); setSuccess(''); }}
                    className="text-amber-500 hover:text-amber-400 font-semibold"
                  >
                    {isSignup ? 'Sign In' : 'Create Account'}
                  </button>
                </p>
                <p className="text-gray-500 text-xs mt-2">Only @stage.in emails allowed</p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Links */}
        <div className="mt-6 flex items-center justify-center gap-4 text-sm">
          <Link href="/" className="text-gray-500 hover:text-white transition-colors">
            Back to Home
          </Link>
          {loginType !== 'select' && (
            <>
              <span className="text-gray-700">|</span>
              <button
                onClick={() => { setLoginType(loginType === 'team' ? 'creator' : 'team'); setError(''); setEmail(''); setPassword(''); }}
                className="text-gray-500 hover:text-white transition-colors"
              >
                {loginType === 'team' ? 'Creator Login' : 'STAGE Team Login'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Loading fallback
function LoginLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

// Main export with Suspense boundary
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginContent />
    </Suspense>
  );
}
