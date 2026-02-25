'use client';

import { useState, useEffect } from 'react';

interface ProjectStats {
  total: number;
  byStatus: { [key: string]: number };
  byCulture: { [key: string]: { count: number; budget: number } };
  byFormat: { [key: string]: { count: number; budget: number } };
  totalBudget: number;
  paidAmount: number;
  pendingAmount: number;
  monthlyData: { month: string; projects: number; budget: number }[];
}

export default function DashboardAnalytics() {
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchAnalytics();
  }, [selectedYear]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics?year=${selectedYear}`);
      const data = await response.json();
      setStats(data.stats);
    } catch (e) {
      console.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatBudget = (amount: number) => {
    if (!amount) return '₹0';
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    return `₹${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12 text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Year Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Annual Report - {selectedYear}</h2>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-xl font-medium"
        >
          {[2024, 2025, 2026].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="text-4xl font-black text-gray-800">{stats.total}</div>
          <div className="text-sm font-medium text-gray-500">Total Projects</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-5">
          <div className="text-3xl font-black text-green-600">{formatBudget(stats.totalBudget)}</div>
          <div className="text-sm font-medium text-green-700">Total Budget</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-5">
          <div className="text-3xl font-black text-blue-600">{formatBudget(stats.paidAmount)}</div>
          <div className="text-sm font-medium text-blue-700">Paid</div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-5">
          <div className="text-3xl font-black text-amber-600">{formatBudget(stats.pendingAmount)}</div>
          <div className="text-sm font-medium text-amber-700">Pending</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-5">
          <div className="text-3xl font-black text-purple-600">{stats.byStatus?.in_production || 0}</div>
          <div className="text-sm font-medium text-purple-700">In Production</div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Project Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(stats.byStatus || {}).map(([status, count]) => (
            <div key={status} className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-gray-800">{count}</div>
              <div className="text-xs font-medium text-gray-500 capitalize">{status.replace(/_/g, ' ')}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Culture-wise Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Culture-wise Projects</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {Object.entries(stats.byCulture || {}).sort((a, b) => b[1].budget - a[1].budget).map(([culture, data]) => (
              <div key={culture} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-bold text-gray-800">{culture}</div>
                  <div className="text-sm text-gray-500">{data.count} projects</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">{formatBudget(data.budget)}</div>
                </div>
              </div>
            ))}
            {Object.keys(stats.byCulture || {}).length === 0 && (
              <div className="text-center py-8 text-gray-400">No data</div>
            )}
          </div>
        </div>

        {/* Format-wise Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Format-wise Projects</h3>
          <div className="space-y-3">
            {Object.entries(stats.byFormat || {}).sort((a, b) => b[1].budget - a[1].budget).map(([format, data]) => {
              const formatLabels: {[key: string]: string} = {
                film: 'Feature Film',
                web_series: 'Web Series',
                microdrama: 'Microdrama',
                documentary: 'Documentary',
                other: 'Other'
              };
              return (
                <div key={format} className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-gray-800">{formatLabels[format] || format}</div>
                    <div className="text-sm font-medium text-gray-500">{data.count} projects</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                        style={{ width: `${Math.min((data.budget / stats.totalBudget) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="font-bold text-gray-700 min-w-[80px] text-right">{formatBudget(data.budget)}</div>
                  </div>
                </div>
              );
            })}
            {Object.keys(stats.byFormat || {}).length === 0 && (
              <div className="text-center py-8 text-gray-400">No data</div>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Monthly Production Trend</h3>
        <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, idx) => {
            const monthData = stats.monthlyData?.find(m => m.month === month) || { projects: 0, budget: 0 };
            const maxProjects = Math.max(...(stats.monthlyData?.map(m => m.projects) || [1]));
            const height = maxProjects > 0 ? (monthData.projects / maxProjects) * 100 : 0;
            return (
              <div key={month} className="text-center">
                <div className="h-24 flex items-end justify-center mb-2">
                  <div
                    className="w-8 bg-gradient-to-t from-red-500 to-orange-400 rounded-t-lg transition-all"
                    style={{ height: `${Math.max(height, 5)}%` }}
                    title={`${monthData.projects} projects - ${formatBudget(monthData.budget)}`}
                  ></div>
                </div>
                <div className="text-xs font-medium text-gray-500">{month}</div>
                <div className="text-xs font-bold text-gray-700">{monthData.projects}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            const reportData = {
              year: selectedYear,
              generatedAt: new Date().toISOString(),
              ...stats
            };
            const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `STAGE_Annual_Report_${selectedYear}.json`;
            a.click();
          }}
          className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-xl transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Annual Report
        </button>
      </div>
    </div>
  );
}
