'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function WelcomePage() {
  const [mounted, setMounted] = useState(false);
  const [projectCount, setProjectCount] = useState(0);
  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check for existing projects
    if (typeof window !== 'undefined') {
      const submissions = JSON.parse(localStorage.getItem('stage_submissions') || '[]');
      setProjectCount(submissions.length);

      // Check for draft
      const draft = localStorage.getItem('stage_creator_draft');
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          if (parsed._started && parsed.projectName) {
            setHasDraft(true);
          }
        } catch (e) {}
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 pt-8 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Image
              src="/images/stage-logo-official.png"
              alt="STAGE OTT"
              width={200}
              height={60}
              priority
              className="h-14 w-auto"
            />
          </Link>
          <Link
            href="/admin"
            className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-all border border-white/20"
          >
            Admin Panel
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-8 py-16">
        {/* Welcome Header */}
        <div className={`text-center mb-16 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="inline-block mb-6">
            <div className="px-6 py-3 bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500/30 rounded-full backdrop-blur-sm">
              <span className="text-red-400 font-bold text-sm uppercase tracking-wider">Creator Portal</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight">
            Welcome to <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">STAGE</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            India's Premier OTT Platform for Regional Content Creators
          </p>
        </div>

        {/* Draft Alert */}
        {hasDraft && (
          <div className={`mb-8 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-500/50 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">📝</span>
                  <div>
                    <h3 className="text-xl font-black text-amber-400">You have an unfinished draft!</h3>
                    <p className="text-amber-200/80 font-semibold">Continue where you left off</p>
                  </div>
                </div>
                <Link
                  href="/creator"
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Continue Draft →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Main Action Cards */}
        <div className={`grid md:grid-cols-2 gap-8 mb-12 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '0.3s'}}>
          {/* Submit New Project */}
          <Link href="/creator" className="group">
            <div className="h-full bg-gradient-to-br from-red-600/20 via-pink-600/20 to-purple-600/20 backdrop-blur-xl border-2 border-white/10 hover:border-red-500/50 rounded-3xl p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-500/20">
              <div className="flex items-start justify-between mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-500/50 group-hover:scale-110 transition-transform">
                  <span className="text-4xl">🎬</span>
                </div>
                <div className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full">
                  <span className="text-red-400 font-bold text-sm">NEW</span>
                </div>
              </div>
              <h2 className="text-3xl font-black text-white mb-3 group-hover:text-red-400 transition-colors">
                Submit New Project
              </h2>
              <p className="text-gray-400 font-semibold mb-6 leading-relaxed">
                Start your journey with STAGE. Submit your film, web series, or short film for evaluation and funding.
              </p>
              <div className="flex items-center gap-2 text-red-400 font-bold group-hover:gap-4 transition-all">
                <span>Start Submission</span>
                <span className="text-xl">→</span>
              </div>
            </div>
          </Link>

          {/* View My Projects */}
          <Link href="/my-projects" className="group">
            <div className="h-full bg-gradient-to-br from-blue-600/20 via-cyan-600/20 to-teal-600/20 backdrop-blur-xl border-2 border-white/10 hover:border-blue-500/50 rounded-3xl p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="flex items-start justify-between mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/50 group-hover:scale-110 transition-transform">
                  <span className="text-4xl">📂</span>
                </div>
                {projectCount > 0 && (
                  <div className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full">
                    <span className="text-blue-400 font-bold text-sm">{projectCount} PROJECT{projectCount > 1 ? 'S' : ''}</span>
                  </div>
                )}
              </div>
              <h2 className="text-3xl font-black text-white mb-3 group-hover:text-blue-400 transition-colors">
                My Projects
              </h2>
              <p className="text-gray-400 font-semibold mb-6 leading-relaxed">
                View, edit, and track the status of your submitted projects. Manage all your submissions in one place.
              </p>
              <div className="flex items-center gap-2 text-blue-400 font-bold group-hover:gap-4 transition-all">
                <span>View Projects</span>
                <span className="text-xl">→</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Secondary Actions */}
        <div className={`grid md:grid-cols-3 gap-6 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '0.5s'}}>
          {/* Quick Stats */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <div className="text-2xl font-black text-white">{projectCount}</div>
                <div className="text-gray-400 font-semibold text-sm">Projects Submitted</div>
              </div>
            </div>
          </div>

          {/* Help & Support */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-all cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <div className="text-lg font-black text-white">Help & Support</div>
                <div className="text-gray-400 font-semibold text-sm">Get assistance</div>
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-orange-500/50 transition-all cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📖</span>
              </div>
              <div>
                <div className="text-lg font-black text-white">Guidelines</div>
                <div className="text-gray-400 font-semibold text-sm">Submission rules</div>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Stats */}
        <div className={`mt-16 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '0.7s'}}>
          <div className="bg-gradient-to-r from-white/5 to-white/0 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <h3 className="text-2xl font-black text-white mb-8 text-center">STAGE Platform Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '500+', label: 'Projects Funded', icon: '🎬' },
                { value: '50M+', label: 'Total Viewers', icon: '👥' },
                { value: '15+', label: 'Regional Languages', icon: '🗣️' },
                { value: '₹100Cr+', label: 'Creator Earnings', icon: '💰' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-3xl md:text-4xl font-black text-transparent bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 font-semibold text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className={`mt-12 text-center ${mounted ? 'animate-fade-in' : 'opacity-0'}`} style={{animationDelay: '0.9s'}}>
          <Link href="/" className="text-gray-400 hover:text-white font-semibold transition-colors inline-flex items-center gap-2">
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-8 text-center text-gray-500 text-sm">
          <p>© 2026 STAGE OTT Platform. All rights reserved.</p>
        </div>
      </footer>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
