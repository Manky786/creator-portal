'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AnalyticsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load submissions from localStorage
    const savedSubmissions = JSON.parse(localStorage.getItem('stage_submissions') || '[]');
    setSubmissions(savedSubmissions);
    setLoading(false);
  }, []);

  // Calculate stats
  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending' || s.status === 'pending_review').length,
    underReview: submissions.filter(s => s.status === 'under-review').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    agreementSigned: submissions.filter(s => s.status === 'agreement-signed').length,
    inProduction: submissions.filter(s => s.status === 'in-production').length,
    revisionRequested: submissions.filter(s => s.status === 'revision-requested').length,
    onHold: submissions.filter(s => s.status === 'on-hold').length,
    scrapped: submissions.filter(s => s.status === 'scrapped').length,
    totalBudget: submissions.reduce((sum, s) => sum + (s.totalBudget || s.estimatedBudget || 0), 0),
  };

  const formatBudget = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getCultureColor = (culture: string) => {
    switch (culture?.toLowerCase()) {
      case 'haryanvi': return 'from-green-500 to-teal-600';
      case 'rajasthani': return 'from-pink-500 to-purple-600';
      case 'bhojpuri': return 'from-orange-500 to-red-600';
      case 'gujarati': return 'from-amber-500 to-yellow-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  // Generate last 7 days data
  const getLast7DaysData = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-IN', { weekday: 'short' });
      const count = submissions.filter(s => {
        const submitDate = (s.submittedDate || s.submitted_at || '').split('T')[0];
        return submitDate === dateStr;
      }).length;
      days.push({ date: dateStr, day: dayName, count });
    }
    return days;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-xl bg-black/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Image
                  src="/images/stage-logo-official.png"
                  alt="STAGE"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
              <div className="hidden md:block h-8 w-px bg-white/20"></div>
              <h1 className="text-xl md:text-2xl font-black text-white">Analytics Dashboard</h1>
            </div>
            <Link
              href="/admin"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-all flex items-center gap-2"
            >
              <span>←</span>
              <span className="hidden md:inline">Back to Admin</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-2xl p-5">
            <div className="text-4xl mb-2">📊</div>
            <div className="text-3xl font-black text-blue-400">{stats.total}</div>
            <div className="text-sm text-gray-400 font-semibold">Total Projects</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-2xl p-5">
            <div className="text-4xl mb-2">⏳</div>
            <div className="text-3xl font-black text-yellow-400">{stats.pending + stats.underReview}</div>
            <div className="text-sm text-gray-400 font-semibold">In Pipeline</div>
          </div>
          <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-2xl p-5">
            <div className="text-4xl mb-2">✅</div>
            <div className="text-3xl font-black text-green-400">{stats.approved + stats.agreementSigned}</div>
            <div className="text-sm text-gray-400 font-semibold">Approved</div>
          </div>
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-5">
            <div className="text-4xl mb-2">🎬</div>
            <div className="text-3xl font-black text-purple-400">{stats.inProduction}</div>
            <div className="text-sm text-gray-400 font-semibold">In Production</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 rounded-2xl p-5 col-span-2 md:col-span-1">
            <div className="text-4xl mb-2">💰</div>
            <div className="text-2xl font-black text-emerald-400">{formatBudget(stats.totalBudget)}</div>
            <div className="text-sm text-gray-400 font-semibold">Total Value</div>
          </div>
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Submission Trends */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <span>📈</span> Submission Trends (7 Days)
            </h2>
            <div className="h-52 flex items-end gap-3">
              {getLast7DaysData().map((day, idx) => {
                const maxCount = Math.max(...getLast7DaysData().map(d => d.count), 1);
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col items-center justify-end h-40">
                      <span className="text-sm font-black text-white mb-2">{day.count}</span>
                      <div
                        className={`w-full rounded-t-xl transition-all duration-500 ${
                          idx === 6 ? 'bg-gradient-to-t from-red-500 to-pink-500' : 'bg-gradient-to-t from-blue-500 to-cyan-500'
                        }`}
                        style={{ height: `${day.count > 0 ? (day.count / maxCount) * 100 : 8}%`, minHeight: '12px' }}
                      />
                    </div>
                    <div className="text-center">
                      <div className={`text-sm font-bold ${idx === 6 ? 'text-white' : 'text-gray-400'}`}>{day.day}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Approval Rate */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <span>🎯</span> Approval Rate
            </h2>
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#374151" strokeWidth="12" />
                  <circle
                    cx="50" cy="50" r="40" fill="none" stroke="url(#gradient)" strokeWidth="12"
                    strokeDasharray={`${stats.total > 0 ? ((stats.approved + stats.agreementSigned) / stats.total) * 251.2 : 0} 251.2`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-green-400">
                    {stats.total > 0 ? Math.round(((stats.approved + stats.agreementSigned) / stats.total) * 100) : 0}%
                  </span>
                  <span className="text-sm text-gray-400">Approved</span>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center text-gray-400">
              {stats.approved + stats.agreementSigned} of {stats.total} projects approved
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8">
          <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
            <span>📋</span> Status Distribution
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              { label: 'Pending', count: stats.pending, color: 'bg-yellow-500', icon: '⏳' },
              { label: 'Under Review', count: stats.underReview, color: 'bg-blue-500', icon: '👁️' },
              { label: 'Approved', count: stats.approved, color: 'bg-green-500', icon: '✅' },
              { label: 'Agreement Signed', count: stats.agreementSigned, color: 'bg-teal-500', icon: '📄' },
              { label: 'In Production', count: stats.inProduction, color: 'bg-purple-500', icon: '🎬' },
              { label: 'Revision Needed', count: stats.revisionRequested, color: 'bg-orange-500', icon: '📝' },
              { label: 'On Hold', count: stats.onHold, color: 'bg-gray-500', icon: '⏸️' },
              { label: 'Scrapped', count: stats.scrapped, color: 'bg-red-500', icon: '🗑️' },
            ].map((item) => (
              <div key={item.label} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm text-gray-400">{item.label}</span>
                </div>
                <div className="text-2xl font-black text-white">{item.count}</div>
                <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${stats.total > 0 ? (item.count / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Culture & Format Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Culture Distribution */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <span>🌍</span> Culture Distribution
            </h2>
            <div className="space-y-4">
              {['Haryanvi', 'Rajasthani', 'Bhojpuri', 'Gujarati'].map((culture) => {
                const count = submissions.filter(s => s.culture?.toLowerCase() === culture.toLowerCase()).length;
                const budget = submissions
                  .filter(s => s.culture?.toLowerCase() === culture.toLowerCase())
                  .reduce((sum, s) => sum + (s.totalBudget || s.estimatedBudget || 0), 0);
                return (
                  <div key={culture} className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${getCultureColor(culture)}`}></div>
                        <span className="font-bold text-white">{culture}</span>
                      </div>
                      <span className="text-lg font-black text-white">{count}</span>
                    </div>
                    <div className="h-3 bg-gray-700 rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full bg-gradient-to-r ${getCultureColor(culture)} rounded-full`}
                        style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}
                      />
                    </div>
                    <div className="text-sm text-emerald-400 font-semibold">{formatBudget(budget)} total budget</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Format Distribution */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <span>🎬</span> Format Distribution
            </h2>
            <div className="space-y-4">
              {[
                { name: 'Feature Film', icon: '🎬', color: 'from-red-500 to-pink-500' },
                { name: 'Mini Film', icon: '🎞️', color: 'from-amber-500 to-orange-500' },
                { name: 'Long Series', icon: '📺', color: 'from-green-500 to-emerald-500' },
                { name: 'Limited Series', icon: '🎭', color: 'from-purple-500 to-indigo-500' },
                { name: 'Microdrama', icon: '⚡', color: 'from-cyan-500 to-blue-500' },
              ].map((format) => {
                const count = submissions.filter(s => s.format === format.name).length;
                const budget = submissions
                  .filter(s => s.format === format.name)
                  .reduce((sum, s) => sum + (s.totalBudget || s.estimatedBudget || 0), 0);
                return (
                  <div key={format.name} className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{format.icon}</span>
                        <span className="font-bold text-white">{format.name}</span>
                      </div>
                      <span className="text-lg font-black text-white">{count}</span>
                    </div>
                    <div className="h-3 bg-gray-700 rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full bg-gradient-to-r ${format.color} rounded-full`}
                        style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}
                      />
                    </div>
                    <div className="text-sm text-emerald-400 font-semibold">{formatBudget(budget)} total budget</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Budget Analysis */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8">
          <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
            <span>💰</span> Budget Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Budget by Culture */}
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="text-sm font-bold text-gray-400 mb-4">By Culture</h3>
              {['Haryanvi', 'Rajasthani', 'Bhojpuri', 'Gujarati'].map((culture) => {
                const budget = submissions
                  .filter(s => s.culture?.toLowerCase() === culture.toLowerCase())
                  .reduce((sum, s) => sum + (s.totalBudget || s.estimatedBudget || 0), 0);
                const percentage = stats.totalBudget > 0 ? (budget / stats.totalBudget) * 100 : 0;
                return (
                  <div key={culture} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <span className="text-sm text-gray-400">{culture}</span>
                    <div className="text-right">
                      <div className="text-sm font-bold text-emerald-400">{formatBudget(budget)}</div>
                      <div className="text-xs text-gray-500">{Math.round(percentage)}%</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Budget by Status */}
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="text-sm font-bold text-gray-400 mb-4">By Status</h3>
              {[
                { status: 'approved', label: 'Approved' },
                { status: 'in-production', label: 'In Production' },
                { status: 'pending', label: 'Pending' },
                { status: 'under-review', label: 'Under Review' },
              ].map(({ status, label }) => {
                const budget = submissions
                  .filter(s => s.status === status || (status === 'pending' && s.status === 'pending_review'))
                  .reduce((sum, s) => sum + (s.totalBudget || s.estimatedBudget || 0), 0);
                return (
                  <div key={status} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <span className="text-sm text-gray-400">{label}</span>
                    <div className="text-sm font-bold text-emerald-400">{formatBudget(budget)}</div>
                  </div>
                );
              })}
            </div>

            {/* Average Budget */}
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="text-sm font-bold text-gray-400 mb-4">Averages</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500">Avg. Project Budget</div>
                  <div className="text-lg font-black text-emerald-400">
                    {formatBudget(stats.total > 0 ? stats.totalBudget / stats.total : 0)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Highest Budget</div>
                  <div className="text-lg font-black text-blue-400">
                    {formatBudget(Math.max(...submissions.map(s => s.totalBudget || s.estimatedBudget || 0), 0))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Lowest Budget</div>
                  <div className="text-lg font-black text-orange-400">
                    {formatBudget(Math.min(...submissions.filter(s => (s.totalBudget || s.estimatedBudget) > 0).map(s => s.totalBudget || s.estimatedBudget), 0))}
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Ranges */}
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="text-sm font-bold text-gray-400 mb-4">Budget Ranges</h3>
              {[
                { label: 'Under ₹50L', min: 0, max: 5000000 },
                { label: '₹50L - ₹2Cr', min: 5000000, max: 20000000 },
                { label: '₹2Cr - ₹5Cr', min: 20000000, max: 50000000 },
                { label: 'Above ₹5Cr', min: 50000000, max: Infinity },
              ].map(({ label, min, max }) => {
                const count = submissions.filter(s => {
                  const budget = s.totalBudget || s.estimatedBudget || 0;
                  return budget >= min && budget < max;
                }).length;
                return (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <span className="text-sm text-gray-400">{label}</span>
                    <span className="text-sm font-bold text-white">{count} projects</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
            <span>🕐</span> Recent Submissions
          </h2>
          <div className="space-y-3">
            {[...submissions]
              .sort((a, b) => new Date(b.submittedDate || b.submitted_at).getTime() - new Date(a.submittedDate || a.submitted_at).getTime())
              .slice(0, 10)
              .map((project) => (
                <div key={project.id} className="bg-white/5 rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${
                      project.status === 'approved' || project.status === 'agreement-signed' ? 'bg-green-500' :
                      project.status === 'pending' || project.status === 'pending_review' ? 'bg-yellow-500' :
                      project.status === 'in-production' ? 'bg-purple-500' :
                      project.status === 'under-review' ? 'bg-blue-500' : 'bg-gray-500'
                    }`}></div>
                    <div>
                      <div className="font-bold text-white">{project.projectName}</div>
                      <div className="text-sm text-gray-400">{project.culture} • {project.format}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-400 font-bold">{formatBudget(project.totalBudget || project.estimatedBudget || 0)}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(project.submittedDate || project.submitted_at).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}
