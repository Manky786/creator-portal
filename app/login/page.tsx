'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

type AuthMode = 'login' | 'signup' | 'phone';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteCode = searchParams.get('invite');

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Get user role and redirect
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

  // Email + Password Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Get user role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      // Handle invite code if present
      if (inviteCode) {
        await supabase
          .from('creator_invites')
          .update({ status: 'accepted', accepted_at: new Date().toISOString() })
          .eq('invite_code', inviteCode.toUpperCase());
      }

      // Redirect based on role
      if (profile?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/creator');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Email + Password Signup
  const handleEmailSignup = async (e: React.FormEvent) => {
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
            role: 'creator', // New signups are always creators
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
          // Assign project to creator
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

  // Send Phone OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;

      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) throw error;

      setShowOtpInput(true);
      setSuccess('OTP sent to your phone!');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Verify Phone OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;

      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms',
      });

      if (error) throw error;

      // Get user role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user?.id)
        .single();

      // Handle invite code
      if (inviteCode && data.user) {
        await supabase
          .from('creator_invites')
          .update({ status: 'accepted', accepted_at: new Date().toISOString() })
          .eq('invite_code', inviteCode.toUpperCase());
      }

      // Redirect based on role
      if (profile?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/creator');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Demo login for testing
  const handleDemoLogin = async (role: 'admin' | 'creator') => {
    setLoading(true);
    setError('');

    try {
      // For demo, we'll use a simple localStorage approach
      // In production, remove this and use only real auth
      localStorage.setItem('demo_user', JSON.stringify({
        id: `demo-${role}-${Date.now()}`,
        email: role === 'admin' ? 'admin@stage.com' : 'creator@stage.com',
        role: role,
        full_name: role === 'admin' ? 'STAGE Admin' : 'Demo Creator',
      }));

      if (role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/creator');
      }
    } catch (err: any) {
      setError('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-4xl">🎬</span>
          </div>
          <h1 className="text-2xl font-black text-white">STAGE Creator Portal</h1>
          <p className="text-gray-400 text-sm mt-1">Regional Content Production Platform</p>
        </div>

        {/* Invite Banner */}
        {inviteCode && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎉</span>
              <div>
                <p className="text-green-300 font-bold">You've been invited!</p>
                <p className="text-green-200 text-sm">Create an account to start your project</p>
              </div>
            </div>
          </div>
        )}

        {/* Auth Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">

          {/* Mode Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
              className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${
                mode === 'login'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
              className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${
                mode === 'signup'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => { setMode('phone'); setError(''); setSuccess(''); setShowOtpInput(false); }}
              className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${
                mode === 'phone'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Phone OTP
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-4">
              <p className="text-red-200 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-500/20 border border-green-500 rounded-lg p-3 mb-4">
              <p className="text-green-200 text-sm font-medium">{success}</p>
            </div>
          )}

          {/* Email Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          )}

          {/* Email Signup Form */}
          {mode === 'signup' && (
            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password (min 6 characters)"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-lg shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}

          {/* Phone OTP Form */}
          {mode === 'phone' && (
            <>
              {!showOtpInput ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Phone Number</label>
                    <div className="flex">
                      <span className="px-4 py-3 bg-white/10 border border-white/20 border-r-0 rounded-l-lg text-white font-bold">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="9876543210"
                        required
                        maxLength={10}
                        className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-r-lg text-white placeholder:text-gray-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading || phone.length !== 10}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold rounded-lg shadow-lg transition-all disabled:opacity-50"
                  >
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Enter OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit OTP"
                      required
                      maxLength={6}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-center text-2xl tracking-widest placeholder:text-gray-500 focus:border-blue-500 outline-none"
                    />
                    <p className="text-gray-400 text-xs mt-2 text-center">
                      OTP sent to +91{phone}
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold rounded-lg shadow-lg transition-all disabled:opacity-50"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowOtpInput(false)}
                    className="w-full py-2 text-gray-400 hover:text-white text-sm font-medium"
                  >
                    ← Change phone number
                  </button>
                </form>
              )}
            </>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-gray-500">or try demo</span>
            </div>
          </div>

          {/* Demo Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDemoLogin('admin')}
              disabled={loading}
              className="py-3 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/50 text-amber-300 font-bold rounded-lg transition-all text-sm"
            >
              👑 Demo Admin
            </button>
            <button
              onClick={() => handleDemoLogin('creator')}
              disabled={loading}
              className="py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 text-blue-300 font-bold rounded-lg transition-all text-sm"
            >
              🎬 Demo Creator
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-400 hover:text-white font-medium text-sm transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

// Loading fallback
function LoginLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
