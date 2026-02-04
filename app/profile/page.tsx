'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
    } else {
      setUser(user);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-red-600/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-600/20 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 pt-8 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Image
            src="/images/stage-logo-official.png"
            alt="STAGE OTT"
            width={200}
            height={60}
            className="h-14 w-auto"
          />
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-8 py-12">
        {/* Welcome Card */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white text-3xl font-black">
              {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">
                Welcome, {user?.user_metadata?.full_name || 'Creator'}! 👋
              </h1>
              <p className="text-gray-400 font-semibold">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm font-bold text-gray-400">Account Status</div>
              <div className="text-lg font-black text-green-400">✓ Active</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm font-bold text-gray-400">Member Since</div>
              <div className="text-lg font-black text-white">
                {new Date(user?.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Creator Portal */}
          <Link
            href="/creator"
            className="group bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-red-600/20 hover:from-purple-600/30 hover:via-pink-600/30 hover:to-red-600/30 border border-white/20 rounded-2xl p-8 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl"
          >
            <div className="text-5xl mb-4">🎬</div>
            <h2 className="text-2xl font-black text-white mb-2">Creator Portal</h2>
            <p className="text-gray-300 font-semibold mb-4">
              Submit your project for STAGE OTT platform
            </p>
            <div className="text-red-400 font-bold group-hover:text-red-300 flex items-center gap-2">
              Get Started <span>→</span>
            </div>
          </Link>

          {/* My Projects */}
          <Link
            href="/my-projects"
            className="group bg-gradient-to-br from-blue-600/20 via-cyan-600/20 to-teal-600/20 hover:from-blue-600/30 hover:via-cyan-600/30 hover:to-teal-600/30 border border-white/20 rounded-2xl p-8 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl"
          >
            <div className="text-5xl mb-4">📂</div>
            <h2 className="text-2xl font-black text-white mb-2">My Projects</h2>
            <p className="text-gray-300 font-semibold mb-4">
              View and manage your submitted projects
            </p>
            <div className="text-blue-400 font-bold group-hover:text-blue-300 flex items-center gap-2">
              View Projects <span>→</span>
            </div>
          </Link>

          {/* Settings */}
          <div className="bg-gradient-to-br from-green-600/20 via-emerald-600/20 to-teal-600/20 border border-white/20 rounded-2xl p-8 opacity-60 cursor-not-allowed">
            <div className="text-5xl mb-4">⚙️</div>
            <h2 className="text-2xl font-black text-white mb-2">Settings</h2>
            <p className="text-gray-300 font-semibold mb-4">
              Manage your account and preferences
            </p>
            <div className="text-gray-500 font-bold">Coming Soon</div>
          </div>

          {/* Support */}
          <div className="bg-gradient-to-br from-orange-600/20 via-amber-600/20 to-yellow-600/20 border border-white/20 rounded-2xl p-8 opacity-60 cursor-not-allowed">
            <div className="text-5xl mb-4">💬</div>
            <h2 className="text-2xl font-black text-white mb-2">Support</h2>
            <p className="text-gray-300 font-semibold mb-4">
              Get help and contact our team
            </p>
            <div className="text-gray-500 font-bold">Coming Soon</div>
          </div>
        </div>
      </div>
    </div>
  );
}
