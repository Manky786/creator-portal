'use client';

import { BudgetFormData } from '@/types/budget';

interface Props {
  formData: Partial<BudgetFormData>;
  setFormData: (data: Partial<BudgetFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function TimelineStep({ formData, setFormData, onNext, onBack }: Props) {
  const contentTimeline = formData.contentTimeline || {
    detailedScreenplaySubmission: '',
    detailedScreenplayComments: '',
    scriptSubmission: '',
    scriptComments: '',
    preProductionStart: '',
    preProductionEnd: '',
    preProductionDuration: '',
    preProductionComments: '',
    shootStartDate: '',
    shootEndDate: '',
    shootDays: '',
    principalPhotographyComments: '',
    firstCutDate: '',
    firstCutComments: '',
    postProductionStart: '',
    postProductionEnd: '',
    postProductionDuration: '',
    postProductionComments: '',
    finalCutQCDate: '',
    finalCutComments: '',
    finalDeliveryDate: '',
    finalDeliveryComments: '',
  };

  const handleChange = (field: string, value: string, extraFields?: Record<string, string>) => {
    setFormData({
      ...formData,
      contentTimeline: {
        ...contentTimeline,
        [field]: value,
        ...extraFields,
      },
    });
  };

  const handleClearContents = () => {
    if (confirm('Are you sure you want to clear all timeline data? This action cannot be undone.')) {
      setFormData({
        ...formData,
        contentTimeline: {
          detailedScreenplaySubmission: '',
          detailedScreenplayComments: '',
          scriptSubmission: '',
          scriptComments: '',
          preProductionStart: '',
          preProductionEnd: '',
          preProductionDuration: '',
          preProductionComments: '',
          shootStartDate: '',
          shootEndDate: '',
          shootDays: '',
          principalPhotographyComments: '',
          firstCutDate: '',
          firstCutComments: '',
          postProductionStart: '',
          postProductionEnd: '',
          postProductionDuration: '',
          postProductionComments: '',
          finalCutQCDate: '',
          finalCutComments: '',
          finalDeliveryDate: '',
          finalDeliveryComments: '',
        },
      });
    }
  };

  // Calculate duration in days
  const calculateDuration = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return '';
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return 'invalid';
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end day
    return `${diffDays} days`;
  };

  // Auto-calculate durations
  const handleDateChange = (field: string, value: string) => {
    let extraFields: Record<string, string> = {};

    // Auto-calculate pre-production duration
    if (field === 'preProductionStart' || field === 'preProductionEnd') {
      const start = field === 'preProductionStart' ? value : contentTimeline.preProductionStart;
      const end = field === 'preProductionEnd' ? value : contentTimeline.preProductionEnd;
      if (start && end) {
        extraFields.preProductionDuration = calculateDuration(start, end);
      } else {
        extraFields.preProductionDuration = '';
      }
    }

    // Auto-calculate post-production duration
    if (field === 'postProductionStart' || field === 'postProductionEnd') {
      const start = field === 'postProductionStart' ? value : contentTimeline.postProductionStart;
      const end = field === 'postProductionEnd' ? value : contentTimeline.postProductionEnd;
      if (start && end) {
        extraFields.postProductionDuration = calculateDuration(start, end);
      } else {
        extraFields.postProductionDuration = '';
      }
    }

    // Auto-calculate shoot days
    if (field === 'shootStartDate' || field === 'shootEndDate') {
      const start = field === 'shootStartDate' ? value : contentTimeline.shootStartDate;
      const end = field === 'shootEndDate' ? value : contentTimeline.shootEndDate;
      if (start && end) {
        extraFields.shootDays = calculateDuration(start, end);
      } else {
        extraFields.shootDays = '';
      }
    }

    handleChange(field, value, extraFields);
  };

  return (
    <div className="max-w-6xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Filmmaker Quote */}
      <div className="mb-6 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/20 rounded-xl p-6 backdrop-blur-lg">
        <div className="flex items-start gap-4">
          <span className="text-4xl">📅</span>
          <div className="flex-1">
            <p className="text-lg md:text-xl font-bold text-amber-900 italic mb-2">
              "समय सिनेमा की सबसे बड़ी कसौटी है।"
            </p>
            <p className="text-sm font-bold text-amber-800/80">— ऋषिकेश मुखर्जी (Hrishikesh Mukherjee)</p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-5xl font-black bg-gradient-to-r from-purple-700 via-pink-600 to-red-600 bg-clip-text text-transparent tracking-tight">
            📅 Content Creation Timeline
          </h2>
          <button
            onClick={handleClearContents}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-200 flex items-center gap-2 border-2 border-red-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear Contents
          </button>
        </div>
        <p className="text-gray-700 text-lg font-semibold">
          Define your project timeline from development to final delivery
        </p>
      </div>

      <div className="space-y-6">
        {/* Development Phase */}
        <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 border-2 border-purple-300 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl animate-bounce">📝</span>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">Development Phase</h3>
              <p className="text-sm text-gray-700 font-semibold">Script and screenplay development</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Detailed Screenplay */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                Detailed Screenplay Submission Date
              </label>
              <input
                type="date"
                value={contentTimeline.detailedScreenplaySubmission}
                onChange={(e) => handleChange('detailedScreenplaySubmission', e.target.value)}
                className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold bg-white hover:border-purple-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                Comments / Notes
              </label>
              <textarea
                value={contentTimeline.detailedScreenplayComments}
                onChange={(e) => handleChange('detailedScreenplayComments', e.target.value)}
                rows={2}
                placeholder="Add any comments or notes about the screenplay..."
                className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal resize-none"
              />
            </div>

            {/* Script */}
            <div className="pt-4 border-t border-purple-200">
              <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                Final Script Submission Date
              </label>
              <input
                type="date"
                value={contentTimeline.scriptSubmission}
                onChange={(e) => handleChange('scriptSubmission', e.target.value)}
                className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold bg-white hover:border-purple-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                Comments / Notes
              </label>
              <textarea
                value={contentTimeline.scriptComments}
                onChange={(e) => handleChange('scriptComments', e.target.value)}
                rows={2}
                placeholder="Add any comments or notes about the script..."
                className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal resize-none"
              />
            </div>
          </div>
        </div>

        {/* Pre-Production Phase */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 border-2 border-blue-300 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl animate-pulse">🎯</span>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">Pre-Production Phase</h3>
              <p className="text-sm text-gray-700 font-semibold">Planning, casting, location scouting, scheduling</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  Start Date
                </label>
                <input
                  type="date"
                  value={contentTimeline.preProductionStart}
                  onChange={(e) => handleDateChange('preProductionStart', e.target.value)}
                  className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 font-semibold bg-white hover:border-blue-400 transition-colors cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  End Date
                </label>
                <input
                  type="date"
                  value={contentTimeline.preProductionEnd}
                  onChange={(e) => handleDateChange('preProductionEnd', e.target.value)}
                  min={contentTimeline.preProductionStart || undefined}
                  className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 font-semibold bg-white hover:border-blue-400 transition-colors cursor-pointer"
                />
              </div>
            </div>

            {contentTimeline.preProductionDuration && (
              <div className={`border-2 rounded-lg px-5 py-3 shadow-sm ${
                contentTimeline.preProductionDuration === 'invalid'
                  ? 'bg-gradient-to-r from-red-100 to-pink-100 border-red-300'
                  : 'bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-300'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{contentTimeline.preProductionDuration === 'invalid' ? '⚠️' : '⏱️'}</span>
                  <span className={`text-base font-bold ${
                    contentTimeline.preProductionDuration === 'invalid' ? 'text-red-700' : 'text-blue-900'
                  }`}>
                    {contentTimeline.preProductionDuration === 'invalid'
                      ? 'End date must be after start date!'
                      : `Duration: ${contentTimeline.preProductionDuration}`}
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                Comments / Notes
              </label>
              <textarea
                value={contentTimeline.preProductionComments}
                onChange={(e) => handleChange('preProductionComments', e.target.value)}
                rows={2}
                placeholder="Add any comments or notes about pre-production..."
                className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal resize-none"
              />
            </div>
          </div>
        </div>

        {/* Production Phase (Principal Photography) */}
        <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 border-2 border-green-300 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl animate-bounce">🎬</span>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">Production Phase (Principal Photography)</h3>
              <p className="text-sm text-gray-700 font-semibold">Main shooting schedule</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  Shoot Start Date
                </label>
                <input
                  type="date"
                  value={contentTimeline.shootStartDate}
                  onChange={(e) => handleDateChange('shootStartDate', e.target.value)}
                  className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900 font-semibold bg-white hover:border-green-400 transition-colors cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  Shoot End Date
                </label>
                <input
                  type="date"
                  value={contentTimeline.shootEndDate}
                  onChange={(e) => handleDateChange('shootEndDate', e.target.value)}
                  min={contentTimeline.shootStartDate || undefined}
                  className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900 font-semibold bg-white hover:border-green-400 transition-colors cursor-pointer"
                />
              </div>
            </div>

            {contentTimeline.shootDays && (
              <div className={`border-2 rounded-lg px-5 py-3 shadow-sm ${
                contentTimeline.shootDays === 'invalid'
                  ? 'bg-gradient-to-r from-red-100 to-pink-100 border-red-300'
                  : 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-300'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{contentTimeline.shootDays === 'invalid' ? '⚠️' : '🎬'}</span>
                  <span className={`text-base font-bold ${
                    contentTimeline.shootDays === 'invalid' ? 'text-red-700' : 'text-green-900'
                  }`}>
                    {contentTimeline.shootDays === 'invalid'
                      ? 'End date must be after start date!'
                      : `Total Shoot Days: ${contentTimeline.shootDays}`}
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                Comments / Notes
              </label>
              <textarea
                value={contentTimeline.principalPhotographyComments}
                onChange={(e) => handleChange('principalPhotographyComments', e.target.value)}
                rows={2}
                placeholder="Add any comments or notes about principal photography..."
                className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal resize-none"
              />
            </div>
          </div>
        </div>

        {/* Post-Production Phase */}
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 border-2 border-amber-300 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl animate-pulse">✂️</span>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">Post-Production Phase</h3>
              <p className="text-sm text-gray-700 font-semibold">Editing, VFX, color grading, sound design</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* First Cut */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                First Cut for STAGE QC (Estimated Date)
              </label>
              <input
                type="date"
                value={contentTimeline.firstCutDate}
                onChange={(e) => handleChange('firstCutDate', e.target.value)}
                className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900 font-semibold bg-white hover:border-purple-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                Comments / Notes
              </label>
              <textarea
                value={contentTimeline.firstCutComments}
                onChange={(e) => handleChange('firstCutComments', e.target.value)}
                rows={2}
                placeholder="Add any comments or notes about first cut..."
                className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal resize-none"
              />
            </div>

            {/* Post-Production Duration */}
            <div className="pt-4 border-t border-amber-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                    Post-Production Start Date
                  </label>
                  <input
                    type="date"
                    value={contentTimeline.postProductionStart}
                    onChange={(e) => handleDateChange('postProductionStart', e.target.value)}
                    className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-900 font-semibold bg-white hover:border-amber-400 transition-colors cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                    Post-Production End Date
                  </label>
                  <input
                    type="date"
                    value={contentTimeline.postProductionEnd}
                    onChange={(e) => handleDateChange('postProductionEnd', e.target.value)}
                    min={contentTimeline.postProductionStart || undefined}
                    className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-900 font-semibold bg-white hover:border-amber-400 transition-colors cursor-pointer"
                  />
                </div>
              </div>

              {contentTimeline.postProductionDuration && (
                <div className={`border-2 rounded-lg px-5 py-3 shadow-sm mt-4 ${
                  contentTimeline.postProductionDuration === 'invalid'
                    ? 'bg-gradient-to-r from-red-100 to-pink-100 border-red-300'
                    : 'bg-gradient-to-r from-amber-100 to-orange-100 border-amber-300'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{contentTimeline.postProductionDuration === 'invalid' ? '⚠️' : '⏱️'}</span>
                    <span className={`text-base font-bold ${
                      contentTimeline.postProductionDuration === 'invalid' ? 'text-red-700' : 'text-amber-900'
                    }`}>
                      {contentTimeline.postProductionDuration === 'invalid'
                        ? 'End date must be after start date!'
                        : `Duration: ${contentTimeline.postProductionDuration}`}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                Comments / Notes
              </label>
              <textarea
                value={contentTimeline.postProductionComments}
                onChange={(e) => handleChange('postProductionComments', e.target.value)}
                rows={2}
                placeholder="Add any comments or notes about post-production..."
                className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal resize-none"
              />
            </div>
          </div>
        </div>

        {/* Final Delivery */}
        <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 border-2 border-rose-300 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl animate-bounce">🎉</span>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-rose-700 to-pink-600 bg-clip-text text-transparent">Final Delivery</h3>
              <p className="text-sm text-gray-700 font-semibold">Quality check and project handover</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Final Cut QC */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                Final Cut for QC Date
              </label>
              <input
                type="date"
                value={contentTimeline.finalCutQCDate}
                onChange={(e) => handleChange('finalCutQCDate', e.target.value)}
                className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-900 font-semibold bg-white hover:border-purple-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                Comments / Notes
              </label>
              <textarea
                value={contentTimeline.finalCutComments}
                onChange={(e) => handleChange('finalCutComments', e.target.value)}
                rows={2}
                placeholder="Add any comments or notes about final cut QC..."
                className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal resize-none"
              />
            </div>

            {/* Final Delivery */}
            <div className="pt-4 border-t border-yellow-200">
              <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                Final Project Delivery Date
              </label>
              <input
                type="date"
                value={contentTimeline.finalDeliveryDate}
                onChange={(e) => handleChange('finalDeliveryDate', e.target.value)}
                className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-900 font-semibold bg-white hover:border-purple-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                Comments / Notes
              </label>
              <textarea
                value={contentTimeline.finalDeliveryComments}
                onChange={(e) => handleChange('finalDeliveryComments', e.target.value)}
                rows={2}
                placeholder="Add any comments or notes about final delivery..."
                className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-10 flex justify-between">
        <button
          onClick={onBack}
          className="px-8 py-4 rounded-xl text-lg font-black transition-all duration-200 flex items-center gap-3 bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-600 text-white hover:from-purple-600 hover:via-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-2xl hover:scale-105 border-2 border-white/20"
        >
          <span className="text-xl">←</span>
          <span>Previous Step</span>
        </button>
        <button
          onClick={onNext}
          className="px-10 py-4 rounded-xl text-lg font-black transition-all duration-200 flex items-center gap-3 bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-2xl hover:scale-105 border-2 border-white/20"
        >
          <span>Continue to Next Step</span>
          <span className="text-xl">→</span>
        </button>
      </div>
    </div>
  );
}
