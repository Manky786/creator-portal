'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
      setError('⚠️ Authentication not configured yet! Please setup Supabase first.');
      setGoogleLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      setError(error.message || 'Google sign-in failed. Please try again.');
      setGoogleLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
      setError('⚠️ Authentication not configured yet! Please setup Supabase first. Read SUPABASE_SETUP.md for instructions.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/profile`,
        },
      });

      if (error) throw error;

      setSuccess(true);
    } catch (error: any) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-red-600/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-600/20 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/images/stage-logo-official.png"
            alt="STAGE OTT"
            width={200}
            height={60}
            className="h-16 w-auto mx-auto mb-4"
          />
          <p className="text-sm md:text-base font-bold text-gray-300">
            कंपनी नहीं, <span className="text-red-500">हम क्रांति हैं</span>
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl font-black text-white mb-2">Welcome to STAGE! 🎬</h1>
          <p className="text-gray-400 font-semibold mb-6">Sign in to get started</p>

          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-4">
              <p className="text-red-200 text-sm font-semibold">{error}</p>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || success}
            className="w-full py-4 bg-white hover:bg-gray-100 text-gray-800 font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mb-6"
          >
            {googleLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-gray-400 font-semibold">or continue with email</span>
            </div>
          </div>

          {success && (
            <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">✉️</span>
                <div>
                  <p className="text-green-200 font-bold mb-2">Check Your Email!</p>
                  <p className="text-green-200 text-sm font-semibold">
                    We've sent a magic link to <span className="font-black">{email}</span>
                  </p>
                  <p className="text-green-300 text-xs font-semibold mt-2">
                    Click the link in your email to login instantly. No password required! 🚀
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">📧 Your Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@example.com"
                required
                disabled={success}
                className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/50 outline-none transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {!success && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <p className="text-blue-200 text-xs font-semibold flex items-start gap-2">
                  <span>💡</span>
                  <span>No password needed! Just enter your email and we'll send you a magic link to login instantly.</span>
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-black text-lg rounded-lg shadow-lg hover:shadow-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '📨 Sending Magic Link...' : success ? '✓ Email Sent!' : '🚀 Send Magic Link'}
            </button>
          </form>

          {success && (
            <div className="mt-6 text-center">
              <p className="text-gray-400 font-semibold text-sm mb-3">Didn't receive the email?</p>
              <button
                onClick={() => {
                  setSuccess(false);
                  setEmail('');
                }}
                className="text-red-500 hover:text-red-400 font-bold text-sm"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-400 hover:text-white font-semibold text-sm transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
