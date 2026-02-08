'use client';

import { useState } from 'react';
import { BudgetFormData } from '@/types/budget';
import { budgetTemplate, categoryNames, industryBenchmarks } from '@/data/budgetTemplate';
import FilmmakerQuote from '@/components/FilmmakerQuote';

interface Props {
  formData: Partial<BudgetFormData>;
  setFormData: (data: Partial<BudgetFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
  onGoToStep?: (step: number) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function ReviewStep({ formData, setFormData, onBack, onSubmit, onGoToStep }: Props) {
  const [backupData, setBackupData] = useState<Partial<BudgetFormData> | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showMissingModal, setShowMissingModal] = useState(false);
  const budgetData = formData.budgetData || {};

  // Clear all form data
  const handleClearAll = () => {
    setBackupData({ ...formData });
    setFormData({});
    setShowClearConfirm(false);
  };

  // Restore backed up data
  const handleRestore = () => {
    if (backupData) {
      setFormData(backupData);
      setBackupData(null);
    }
  };

  // Use Total Project Cost from Budget page (already includes production + margin + insurance + celebrity)
  const getTotalProjectCost = () => {
    return formData.estimatedBudget ? parseFloat(formData.estimatedBudget) : 0;
  };

  const getGrandTotal = () => {
    return Object.values(budgetData).reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  const getCategoryTotal = (category: string) => {
    return budgetTemplate
      .filter((item) => item.category === category)
      .reduce((sum, item) => {
        const data = budgetData[item.id];
        return sum + (data?.amount || 0);
      }, 0);
  };

  const getCategoryPercentage = (category: string) => {
    const total = getGrandTotal();
    if (total === 0) return 0;
    return ((getCategoryTotal(category) / total) * 100);
  };

  const getCompletenessScore = () => {
    let score = 0;
    let totalFields = 10;

    if (formData.projectName) score++;
    if (formData.estimatedBudget) score++;
    if (formData.creatorName) score++;
    if (formData.director) score++;
    if (formData.dop) score++;
    if (formData.shootStartDate) score++;
    if (formData.shootEndDate) score++;
    if (formData.technicalSpecs?.cameraModel) score++;
    if (getGrandTotal() > 0) score++;
    if (formData.castData?.primaryCast?.length) score++;

    return Math.round((score / totalFields) * 100);
  };

  const getWarnings = () => {
    const warnings: { section: string; field: string; step: number; stepName: string }[] = [];

    // Basic Info (Step 1)
    if (!formData.projectName) warnings.push({ section: 'Project', field: 'Project name', step: 1, stepName: 'Project' });
    if (!formData.productionCompany) warnings.push({ section: 'Project', field: 'Production company', step: 1, stepName: 'Project' });
    if (!formData.culture) warnings.push({ section: 'Project', field: 'Culture', step: 1, stepName: 'Project' });
    if (!formData.format) warnings.push({ section: 'Project', field: 'Format', step: 1, stepName: 'Project' });
    if (!formData.genre) warnings.push({ section: 'Project', field: 'Genre', step: 1, stepName: 'Project' });

    // Budget (Step 3)
    if (!formData.estimatedBudget) warnings.push({ section: 'Budget', field: 'Estimated budget', step: 3, stepName: 'Budget' });

    // Creator Details (Step 2)
    if (!formData.creatorName) warnings.push({ section: 'Creator', field: 'Creator name', step: 2, stepName: 'Creator' });
    if (!formData.officialEmail) warnings.push({ section: 'Creator', field: 'Email', step: 2, stepName: 'Creator' });
    if (!formData.phone) warnings.push({ section: 'Creator', field: 'Phone', step: 2, stepName: 'Creator' });
    if (!formData.yearsOfExperience) warnings.push({ section: 'Creator', field: 'Years of experience', step: 2, stepName: 'Creator' });

    // Crew (Step 5)
    if (!formData.director) warnings.push({ section: 'Crew', field: 'Director', step: 5, stepName: 'Crew' });
    if (!formData.dop) warnings.push({ section: 'Crew', field: 'DOP', step: 5, stepName: 'Crew' });
    if (!formData.editor) warnings.push({ section: 'Crew', field: 'Editor', step: 5, stepName: 'Crew' });

    // Budget breakdown (Step 9)
    if (getGrandTotal() === 0) warnings.push({ section: 'SOPs', field: 'Budget breakdown', step: 9, stepName: 'SOPs' });

    // Cast (Step 6)
    if (!formData.castData?.primaryCast?.length) warnings.push({ section: 'Cast', field: 'Primary cast members', step: 6, stepName: 'Cast' });

    // Technical Specs (Step 7)
    if (!formData.technicalSpecs?.cameraModel) warnings.push({ section: 'Technical', field: 'Camera model', step: 7, stepName: 'Technical' });

    // Timeline (Step 4)
    if (!formData.shootStartDate) warnings.push({ section: 'Timeline', field: 'Shoot start date', step: 4, stepName: 'Timeline' });
    if (!formData.shootEndDate) warnings.push({ section: 'Timeline', field: 'Shoot end date', step: 4, stepName: 'Timeline' });
    if (!formData.contentTimeline?.finalDeliveryDate) warnings.push({ section: 'Timeline', field: 'Final delivery date', step: 4, stepName: 'Timeline' });

    // Files (Step 10)
    if (!formData.uploadedFiles?.length && !formData.cloudLinks?.length) {
      warnings.push({ section: 'Documents', field: 'Project files (script, screenplay, etc.)', step: 10, stepName: 'Documents' });
    }

    return warnings;
  };

  // Handle submit with missing fields check
  const handleSubmitClick = () => {
    const missingFields = getWarnings();
    if (missingFields.length > 0) {
      setShowMissingModal(true);
    } else {
      onSubmit();
    }
  };

  // Navigate to step for a missing field
  const handleGoToField = (step: number) => {
    setShowMissingModal(false);
    if (onGoToStep) {
      onGoToStep(step);
    }
  };

  const grandTotal = getGrandTotal();
  const totalProjectCost = getTotalProjectCost();
  const completeness = getCompletenessScore();
  const warnings = getWarnings();

  return (
    <div className="max-w-7xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-5xl font-black bg-gradient-to-r from-purple-700 via-pink-600 to-red-600 bg-clip-text text-transparent mb-4 tracking-tight">
          📋 Final Review & Submission
        </h2>
        <p className="text-gray-700 text-lg font-semibold">
          Review all details before submitting your project for evaluation
        </p>
      </div>

      {/* Filmmaker Quotes */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <FilmmakerQuote
          quote="हर विवरण मायने रखता है। छोटी से छोटी चीज़ भी कहानी कहती है।"
          filmmaker="Gulzar"
          title="Legendary Poet & Filmmaker"
          imageUrl="/images/filmmakers/gulzar.png"
          language="hindi"
          theme="light"
        />
        <FilmmakerQuote
          quote="A film is - or should be - more like music than like fiction."
          filmmaker="Stanley Kubrick"
          title="Visionary Director"
          imageUrl="/images/filmmakers/stanley-kubrick-new.jpg"
          language="english"
          theme="light"
        />
      </div>

      {/* Action Buttons - Clear/Restore and Quick Navigation */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl p-4 mb-8 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left Side - Clear/Restore */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <span>🗑️</span>
              <span>Clear All Data</span>
            </button>
            {backupData && (
              <button
                type="button"
                onClick={handleRestore}
                className="px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 animate-pulse"
              >
                <span>↩️</span>
                <span>Restore Data</span>
              </button>
            )}
          </div>

          {/* Right Side - Quick Navigation */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-gray-600">Jump to:</span>
            {[
              { step: 1, label: 'Project', icon: '📋' },
              { step: 2, label: 'Creator', icon: '👤' },
              { step: 3, label: 'Budget', icon: '💰' },
              { step: 4, label: 'Timeline', icon: '📅' },
              { step: 5, label: 'Crew', icon: '👥' },
              { step: 6, label: 'Cast', icon: '⭐' },
              { step: 7, label: 'Technical', icon: '📹' },
              { step: 8, label: 'Cash Flow', icon: '💳' },
              { step: 9, label: 'SOPs', icon: '📑' },
              { step: 10, label: 'Documents', icon: '📁' },
            ].map((item) => (
              <button
                key={item.step}
                type="button"
                onClick={() => onGoToStep?.(item.step)}
                className="px-3 py-1.5 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-700 text-xs font-bold rounded-lg transition-all flex items-center gap-1"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 p-6 text-white">
              <div className="flex items-center gap-3">
                <span className="text-4xl">⚠️</span>
                <div>
                  <h3 className="text-2xl font-black">Clear All Data?</h3>
                  <p className="text-sm font-semibold opacity-90">This will remove all form data</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 font-semibold mb-4">
                Are you sure you want to clear all the data you've entered across all 11 pages?
              </p>
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-2">
                  <span className="text-xl">💡</span>
                  <p className="text-sm font-semibold text-green-800">
                    Don't worry! You can restore the data using the "Restore Data" button after clearing.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>🗑️</span>
                  <span>Yes, Clear All</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Executive Summary Card */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-2xl p-8 mb-8 text-white shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-4xl font-black mb-2">{formData.projectName || 'Untitled Project'}</h3>
            <p className="text-xl font-semibold opacity-90">
              {formData.format?.replace('-', ' ').toUpperCase()} • {formData.genre || 'Genre Not Set'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold opacity-80">Total Project Cost</div>
            <div className="text-4xl font-black">
              {totalProjectCost > 0
                ? `₹${(totalProjectCost / 10000000).toFixed(2)}Cr`
                : 'Not Set'}
            </div>
            {totalProjectCost > 0 && (
              <div className="text-xs font-semibold opacity-70 mt-1">
                Auto-synced from Budget
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 pt-6 border-t border-white/30">
          <div>
            <div className="text-sm font-semibold opacity-80">Duration</div>
            <div className="text-2xl font-bold">{formData.totalDuration || 'N/A'} mins</div>
          </div>
          <div>
            <div className="text-sm font-semibold opacity-80">Shoot Days</div>
            <div className="text-2xl font-bold">{formData.shootDays || 'N/A'}</div>
          </div>
          <div>
            <div className="text-sm font-semibold opacity-80">Production</div>
            <div className="text-xl font-bold truncate">{formData.productionCompany || 'N/A'}</div>
          </div>
          <div>
            <div className="text-sm font-semibold opacity-80">Culture</div>
            <div className="text-2xl font-bold capitalize">{formData.culture || 'N/A'}</div>
          </div>
        </div>
      </div>

      {/* Readiness Score */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-300 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">✅</span>
            <span className="text-sm font-bold text-green-700">READINESS</span>
          </div>
          <div className="text-4xl font-black text-green-700 mb-2">{completeness}%</div>
          <div className="h-3 bg-green-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all" style={{ width: `${completeness}%` }}></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-100 border-2 border-blue-300 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">💰</span>
            <span className="text-sm font-bold text-blue-700">TOTAL PROJECT COST</span>
          </div>
          <div className="text-4xl font-black text-blue-700 mb-2">
            {totalProjectCost > 0
              ? `₹${totalProjectCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
              : 'Not Set'}
          </div>
          <div className="text-sm font-semibold text-blue-600">
            {totalProjectCost > 0
              ? `${(totalProjectCost / 10000000).toFixed(2)} Crore (Auto-synced)`
              : 'Fill Budget section'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-300 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">💡</span>
            <span className="text-sm font-bold text-blue-700">SUGGESTIONS</span>
          </div>
          <div className="text-4xl font-black text-blue-700 mb-2">{warnings.length}</div>
          <div className="text-sm font-semibold text-blue-600">{warnings.length === 0 ? 'All Set!' : 'Optional Items'}</div>
        </div>
      </div>

      {/* Missing/Incomplete Information */}
      {warnings.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex items-start gap-3">
            <span className="text-4xl">⚠️</span>
            <div className="flex-1">
              <h4 className="text-2xl font-black text-amber-900 mb-2">Missing or Incomplete Information</h4>
              <p className="text-sm text-amber-700 font-semibold mb-4">
                Click on any field to go directly to that section and fill in the details.
              </p>

              {/* Group warnings by step */}
              {(() => {
                const grouped: { [key: number]: typeof warnings } = {};
                warnings.forEach((w) => {
                  if (!grouped[w.step]) grouped[w.step] = [];
                  grouped[w.step].push(w);
                });

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(grouped)
                      .sort(([a], [b]) => Number(a) - Number(b))
                      .map(([step, fields]) => (
                      <button
                        type="button"
                        key={step}
                        onClick={() => onGoToStep?.(Number(step))}
                        className="bg-white rounded-lg p-4 border-2 border-amber-200 hover:border-red-400 hover:bg-red-50 transition-all cursor-pointer text-left group"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-full flex items-center justify-center text-xs font-black">
                              {step}
                            </span>
                            <h5 className="text-sm font-black text-amber-900 group-hover:text-red-700">{fields[0].stepName}</h5>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
                              {fields.length} missing
                            </span>
                            <span className="text-red-500 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                              →
                            </span>
                          </div>
                        </div>
                        <ul className="space-y-1">
                          {fields.map((field, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-amber-800 font-semibold group-hover:text-red-700">
                              <span className="text-amber-500 group-hover:text-red-500">•</span>
                              {field.field}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 pt-2 border-t border-amber-100 text-xs font-bold text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          Click to fill these details →
                        </div>
                      </button>
                    ))}
                  </div>
                );
              })()}

              <div className="mt-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-4 border border-blue-300">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <h5 className="font-black text-blue-900 text-sm mb-1">You can still submit!</h5>
                    <p className="text-xs font-semibold text-blue-700">
                      These are optional fields. Click any card above to fill the details, or click "Submit Project" to proceed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Data Review Section */}
      <div className="mb-8">
        <h3 className="text-3xl font-black text-gray-900 mb-6 flex items-center gap-3">
          <span>📋</span>
          <span>Complete Submission Review</span>
        </h3>

        {/* Tabbed Review Sections */}
        <div className="space-y-6">

          {/* 1. Project Details */}
          <div className="bg-white border-2 border-purple-200 rounded-xl p-6 shadow-lg">
            <h4 className="text-xl font-black text-purple-900 mb-4 flex items-center gap-2">
              <span>🎬</span>
              <span>Project Details</span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className={!formData.projectName ? 'opacity-40' : ''}>
                <div className="text-xs font-bold text-gray-500 mb-1">PROJECT NAME</div>
                <div className="text-sm font-bold text-gray-900">{formData.projectName || '❌ Not provided'}</div>
              </div>
              <div className={!formData.productionCompany ? 'opacity-40' : ''}>
                <div className="text-xs font-bold text-gray-500 mb-1">PRODUCTION COMPANY</div>
                <div className="text-sm font-bold text-gray-900">{formData.productionCompany || '❌ Not provided'}</div>
              </div>
              <div className={!formData.culture ? 'opacity-40' : ''}>
                <div className="text-xs font-bold text-gray-500 mb-1">CULTURE</div>
                <div className="text-sm font-bold text-gray-900">{formData.culture || '❌ Not provided'}</div>
              </div>
              <div className={!formData.format ? 'opacity-40' : ''}>
                <div className="text-xs font-bold text-gray-500 mb-1">FORMAT</div>
                <div className="text-sm font-bold text-gray-900">{formData.format || '❌ Not provided'}</div>
              </div>
              <div className={!formData.genre ? 'opacity-40' : ''}>
                <div className="text-xs font-bold text-gray-500 mb-1">GENRE</div>
                <div className="text-sm font-bold text-gray-900">{formData.genre || '❌ Not provided'}</div>
              </div>
              <div className={!formData.subGenre ? 'opacity-40' : ''}>
                <div className="text-xs font-bold text-gray-500 mb-1">SUB-GENRE</div>
                <div className="text-sm font-bold text-gray-900">{formData.subGenre || '❌ Not provided'}</div>
              </div>
              <div className={!formData.contentRating ? 'opacity-40' : ''}>
                <div className="text-xs font-bold text-gray-500 mb-1">CONTENT RATING</div>
                <div className="text-sm font-bold text-gray-900">{formData.contentRating || '❌ Not provided'}</div>
              </div>
              <div className={!formData.productionType ? 'opacity-40' : ''}>
                <div className="text-xs font-bold text-gray-500 mb-1">PRODUCTION TYPE</div>
                <div className="text-sm font-bold text-gray-900">{formData.productionType || '❌ Not provided'}</div>
              </div>
              <div className={!formData.sourceMaterial ? 'opacity-40' : ''}>
                <div className="text-xs font-bold text-gray-500 mb-1">SOURCE MATERIAL</div>
                <div className="text-sm font-bold text-gray-900">{formData.sourceMaterial || '❌ Not provided'}</div>
              </div>
              {formData.format?.includes('series') && (
                <>
                  <div className={!formData.numberOfSeasons ? 'opacity-40' : ''}>
                    <div className="text-xs font-bold text-gray-500 mb-1">SEASONS</div>
                    <div className="text-sm font-bold text-gray-900">{formData.numberOfSeasons || '❌ Not provided'}</div>
                  </div>
                  <div className={!formData.episodesPerSeason ? 'opacity-40' : ''}>
                    <div className="text-xs font-bold text-gray-500 mb-1">EPISODES/SEASON</div>
                    <div className="text-sm font-bold text-gray-900">{formData.episodesPerSeason || '❌ Not provided'}</div>
                  </div>
                  <div className={!formData.episodeDuration ? 'opacity-40' : ''}>
                    <div className="text-xs font-bold text-gray-500 mb-1">EPISODE DURATION</div>
                    <div className="text-sm font-bold text-gray-900">{formData.episodeDuration || '❌ Not provided'} mins</div>
                  </div>
                </>
              )}
              <div className={!formData.totalDuration ? 'opacity-40' : ''}>
                <div className="text-xs font-bold text-gray-500 mb-1">TOTAL DURATION</div>
                <div className="text-sm font-bold text-gray-900">{formData.totalDuration || '❌ Not provided'} mins</div>
              </div>
              <div className={!formData.shootDays ? 'opacity-40' : ''}>
                <div className="text-xs font-bold text-gray-500 mb-1">SHOOT DAYS</div>
                <div className="text-sm font-bold text-gray-900">{formData.shootDays || '❌ Not provided'}</div>
              </div>
            </div>
          </div>

          {/* 2. Creator Information */}
          <div className="bg-white border-2 border-blue-200 rounded-xl p-6 shadow-lg">
            <h4 className="text-xl font-black text-blue-900 mb-4 flex items-center gap-2">
              <span>👤</span>
              <span>Creator Information</span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className={!formData.creatorName ? 'opacity-40' : ''}>
                <div className="text-xs font-bold text-gray-500 mb-1">CREATOR NAME</div>
                <div className="text-sm font-bold text-gray-900">{formData.creatorName || '❌ Not provided'}</div>
              </div>
              <div className={!formData.creatorAge ? 'opacity-40' : ''}>
                <div className="text-xs font-bold text-gray-500 mb-1">AGE</div>
                <div className="text-sm font-bold text-gray-900">{formData.creatorAge || '❌ Not provided'}</div>
              </div>
              <div className={!formData.officialEmail ? 'opacity-40' : ''}>
                <div className="text-xs font-bold text-gray-500 mb-1">EMAIL</div>
                <div className="text-sm font-bold text-gray-900">{formData.officialEmail || '❌ Not provided'}</div>
              </div>
              <div className={!formData.phone ? 'opacity-40' : ''}>
                <div className="text-xs font-bold text-gray-500 mb-1">PHONE</div>
                <div className="text-sm font-bold text-gray-900">{formData.phone || '❌ Not provided'}</div>
              </div>
              <div className={!formData.panNumber ? 'opacity-40' : ''}>
                <div className="text-xs font-bold text-gray-500 mb-1">PAN NUMBER</div>
                <div className="text-sm font-bold text-gray-900">{formData.panNumber || '❌ Not provided'}</div>
              </div>
              <div className={!formData.gstNumber ? 'opacity-40' : ''}>
                <div className="text-xs font-bold text-gray-500 mb-1">GST NUMBER</div>
                <div className="text-sm font-bold text-gray-900">{formData.gstNumber || '❌ Not provided'}</div>
              </div>
              <div className={!formData.yearsOfExperience ? 'opacity-40' : ''}>
                <div className="text-xs font-bold text-gray-500 mb-1">EXPERIENCE</div>
                <div className="text-sm font-bold text-gray-900">{formData.yearsOfExperience || '❌ Not provided'} years</div>
              </div>
              <div className={!formData.companyType ? 'opacity-40' : ''}>
                <div className="text-xs font-bold text-gray-500 mb-1">COMPANY TYPE</div>
                <div className="text-sm font-bold text-gray-900">{formData.companyType || '❌ Not provided'}</div>
              </div>
              <div className={!formData.teamSize ? 'opacity-40' : ''}>
                <div className="text-xs font-bold text-gray-500 mb-1">TEAM SIZE</div>
                <div className="text-sm font-bold text-gray-900">{formData.teamSize || '❌ Not provided'}</div>
              </div>
            </div>
            {formData.previousProjects && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="text-xs font-bold text-gray-500 mb-1">PREVIOUS PROJECTS</div>
                <div className="text-sm font-semibold text-gray-900">{formData.previousProjects}</div>
              </div>
            )}
          </div>

          {/* 3. Uploaded Files & Links */}
          <div className="bg-white border-2 border-green-200 rounded-xl p-6 shadow-lg">
            <h4 className="text-xl font-black text-green-900 mb-4 flex items-center gap-2">
              <span>📁</span>
              <span>Project Documents</span>
            </h4>

            {formData.uploadedFiles && formData.uploadedFiles.length > 0 ? (
              <div className="mb-4">
                <div className="text-sm font-bold text-gray-700 mb-2">Uploaded Files ({formData.uploadedFiles.length})</div>
                <div className="space-y-2">
                  {formData.uploadedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-green-50 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">📄</span>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{file.name}</div>
                          <div className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                      </div>
                      <span className="text-green-600 font-bold text-xs">✓ Uploaded</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {formData.cloudLinks && formData.cloudLinks.length > 0 ? (
              <div>
                <div className="text-sm font-bold text-gray-700 mb-2">Cloud Links ({formData.cloudLinks.length})</div>
                <div className="space-y-2">
                  {formData.cloudLinks.map((link, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-green-50 rounded-lg p-3">
                      <span className="text-xl">🔗</span>
                      <div className="flex-1 truncate text-sm font-semibold text-blue-600">{link}</div>
                      <span className="text-green-600 font-bold text-xs">✓ Added</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {(!formData.uploadedFiles || formData.uploadedFiles.length === 0) &&
             (!formData.cloudLinks || formData.cloudLinks.length === 0) && (
              <div className="text-center py-8 opacity-40">
                <span className="text-4xl mb-2 block">📭</span>
                <div className="text-sm font-bold text-gray-500">No files or links uploaded</div>
                <div className="text-xs text-gray-400 mt-1">Consider adding scripts, screenplay, or vision deck</div>
              </div>
            )}
          </div>

          {/* 4. Complete Crew Breakdown */}
          <div className="bg-white border-2 border-indigo-200 rounded-xl p-6 shadow-lg">
            <h4 className="text-xl font-black text-indigo-900 mb-4 flex items-center gap-2">
              <span>👥</span>
              <span>Complete Crew & Team</span>
            </h4>

            <div className="space-y-4">
              {/* Direction */}
              {(formData.director || formData.associateDirector || formData.assistantDirector1) && (
                <div className="bg-indigo-50 rounded-lg p-4">
                  <div className="text-xs font-bold text-indigo-700 mb-3">🎬 DIRECTION DEPARTMENT</div>
                  <div className="grid grid-cols-2 gap-3">
                    {formData.director && (
                      <div>
                        <div className="text-xs text-gray-500">Director</div>
                        <div className="text-sm font-bold text-gray-900">{formData.director}</div>
                      </div>
                    )}
                    {formData.associateDirector && (
                      <div>
                        <div className="text-xs text-gray-500">Associate Director</div>
                        <div className="text-sm font-bold text-gray-900">{formData.associateDirector}</div>
                      </div>
                    )}
                    {formData.assistantDirector1 && (
                      <div>
                        <div className="text-xs text-gray-500">Assistant Director</div>
                        <div className="text-sm font-bold text-gray-900">{formData.assistantDirector1}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Camera */}
              {(formData.dop || formData.firstCameraOperator || formData.cameraOperator) && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-xs font-bold text-blue-700 mb-3">📹 CAMERA DEPARTMENT</div>
                  <div className="grid grid-cols-2 gap-3">
                    {formData.dop && (
                      <div>
                        <div className="text-xs text-gray-500">DOP</div>
                        <div className="text-sm font-bold text-gray-900">{formData.dop}</div>
                      </div>
                    )}
                    {formData.firstCameraOperator && (
                      <div>
                        <div className="text-xs text-gray-500">1st Camera Operator</div>
                        <div className="text-sm font-bold text-gray-900">{formData.firstCameraOperator}</div>
                      </div>
                    )}
                    {formData.steadicamOperator && (
                      <div>
                        <div className="text-xs text-gray-500">Steadicam Operator</div>
                        <div className="text-sm font-bold text-gray-900">{formData.steadicamOperator}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Editing */}
              {(formData.editor || formData.colorist) && (
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-xs font-bold text-green-700 mb-3">✂️ EDITING DEPARTMENT</div>
                  <div className="grid grid-cols-2 gap-3">
                    {formData.editor && (
                      <div>
                        <div className="text-xs text-gray-500">Editor</div>
                        <div className="text-sm font-bold text-gray-900">{formData.editor}</div>
                      </div>
                    )}
                    {formData.colorist && (
                      <div>
                        <div className="text-xs text-gray-500">Colorist</div>
                        <div className="text-sm font-bold text-gray-900">{formData.colorist}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Sound */}
              {(formData.soundRecordist || formData.soundDesigner) && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-xs font-bold text-purple-700 mb-3">🎙️ SOUND DEPARTMENT</div>
                  <div className="grid grid-cols-2 gap-3">
                    {formData.soundRecordist && (
                      <div>
                        <div className="text-xs text-gray-500">Sound Recordist</div>
                        <div className="text-sm font-bold text-gray-900">{formData.soundRecordist}</div>
                      </div>
                    )}
                    {formData.soundDesigner && (
                      <div>
                        <div className="text-xs text-gray-500">Sound Designer</div>
                        <div className="text-sm font-bold text-gray-900">{formData.soundDesigner}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Music */}
              {(formData.musicComposer || formData.bgmComposer || formData.playbackSinger) && (
                <div className="bg-pink-50 rounded-lg p-4">
                  <div className="text-xs font-bold text-pink-700 mb-3">🎵 MUSIC DEPARTMENT</div>
                  <div className="grid grid-cols-2 gap-3">
                    {formData.musicComposer && (
                      <div>
                        <div className="text-xs text-gray-500">Music Composer</div>
                        <div className="text-sm font-bold text-gray-900">{formData.musicComposer}</div>
                      </div>
                    )}
                    {formData.bgmComposer && (
                      <div>
                        <div className="text-xs text-gray-500">BGM Composer</div>
                        <div className="text-sm font-bold text-gray-900">{formData.bgmComposer}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Art & Production Design */}
              {(formData.productionDesigner || formData.artDirector || formData.setDesigner) && (
                <div className="bg-amber-50 rounded-lg p-4">
                  <div className="text-xs font-bold text-amber-700 mb-3">🎨 ART DEPARTMENT</div>
                  <div className="grid grid-cols-2 gap-3">
                    {formData.productionDesigner && (
                      <div>
                        <div className="text-xs text-gray-500">Production Designer</div>
                        <div className="text-sm font-bold text-gray-900">{formData.productionDesigner}</div>
                      </div>
                    )}
                    {formData.artDirector && (
                      <div>
                        <div className="text-xs text-gray-500">Art Director</div>
                        <div className="text-sm font-bold text-gray-900">{formData.artDirector}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Costume & Makeup */}
              {(formData.costumeDesigner || formData.makeupArtist || formData.hairStylist) && (
                <div className="bg-rose-50 rounded-lg p-4">
                  <div className="text-xs font-bold text-rose-700 mb-3">👗 COSTUME & MAKEUP</div>
                  <div className="grid grid-cols-2 gap-3">
                    {formData.costumeDesigner && (
                      <div>
                        <div className="text-xs text-gray-500">Costume Designer</div>
                        <div className="text-sm font-bold text-gray-900">{formData.costumeDesigner}</div>
                      </div>
                    )}
                    {formData.makeupArtist && (
                      <div>
                        <div className="text-xs text-gray-500">Makeup Artist</div>
                        <div className="text-sm font-bold text-gray-900">{formData.makeupArtist}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* No crew data */}
              {!formData.director && !formData.dop && !formData.editor && (
                <div className="text-center py-8 opacity-40">
                  <span className="text-4xl mb-2 block">👥</span>
                  <div className="text-sm font-bold text-gray-500">No crew members added yet</div>
                  <div className="text-xs text-gray-400 mt-1">Add key crew members to strengthen your submission</div>
                </div>
              )}
            </div>
          </div>

          {/* 5. Cast Information */}
          {formData.castData && (formData.castData.primaryCast?.length || formData.castData.secondaryCast?.length || formData.castData.tertiaryCast?.length) ? (
            <div className="bg-white border-2 border-pink-200 rounded-xl p-6 shadow-lg">
              <h4 className="text-xl font-black text-pink-900 mb-4 flex items-center gap-2">
                <span>⭐</span>
                <span>Cast Members</span>
              </h4>

              <div className="space-y-4">
                {formData.castData.primaryCast && formData.castData.primaryCast.length > 0 && (
                  <div>
                    <div className="text-sm font-bold text-pink-700 mb-2">Primary Cast ({formData.castData.primaryCast.length})</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {formData.castData.primaryCast.map((cast, idx) => (
                        <div key={idx} className="bg-pink-50 rounded-lg p-3">
                          <div className="text-sm font-bold text-gray-900">{cast.artistName}</div>
                          <div className="text-xs text-gray-600">as {cast.characterName}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {formData.castData.secondaryCast && formData.castData.secondaryCast.length > 0 && (
                  <div>
                    <div className="text-sm font-bold text-pink-700 mb-2">Secondary Cast ({formData.castData.secondaryCast.length})</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {formData.castData.secondaryCast.map((cast, idx) => (
                        <div key={idx} className="bg-pink-50 rounded-lg p-3">
                          <div className="text-sm font-bold text-gray-900">{cast.artistName}</div>
                          <div className="text-xs text-gray-600">as {cast.characterName}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {formData.castData.tertiaryCast && formData.castData.tertiaryCast.length > 0 && (
                  <div>
                    <div className="text-sm font-bold text-pink-700 mb-2">Tertiary Cast ({formData.castData.tertiaryCast.length})</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {formData.castData.tertiaryCast.map((cast, idx) => (
                        <div key={idx} className="bg-pink-50 rounded-lg p-3">
                          <div className="text-sm font-bold text-gray-900">{cast.artistName}</div>
                          <div className="text-xs text-gray-600">as {cast.characterName}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* 6. Technical Specifications */}
          {formData.technicalSpecs && formData.technicalSpecs.cameraModel && (
            <div className="bg-white border-2 border-cyan-200 rounded-xl p-6 shadow-lg">
              <h4 className="text-xl font-black text-cyan-900 mb-4 flex items-center gap-2">
                <span>🎥</span>
                <span>Technical Specifications</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.technicalSpecs.cameraModel && (
                  <div className="bg-cyan-50 rounded-lg p-4">
                    <div className="text-xs font-bold text-cyan-700 mb-1">CAMERA MODEL</div>
                    <div className="text-sm font-bold text-gray-900">{formData.technicalSpecs.cameraModel}</div>
                    {formData.technicalSpecs.cameraSetupType && (
                      <div className="text-xs text-gray-600 mt-1">Setup: {formData.technicalSpecs.cameraSetupType}</div>
                    )}
                  </div>
                )}

                {formData.technicalSpecs.lensTypes && formData.technicalSpecs.lensTypes.length > 0 && (
                  <div className="bg-cyan-50 rounded-lg p-4">
                    <div className="text-xs font-bold text-cyan-700 mb-1">LENSES</div>
                    <div className="text-sm font-bold text-gray-900">{formData.technicalSpecs.lensTypes.length} types configured</div>
                  </div>
                )}

                {formData.technicalSpecs.lightingEquipment && formData.technicalSpecs.lightingEquipment.length > 0 && (
                  <div className="bg-cyan-50 rounded-lg p-4">
                    <div className="text-xs font-bold text-cyan-700 mb-1">LIGHTING EQUIPMENT</div>
                    <div className="text-sm font-bold text-gray-900">{formData.technicalSpecs.lightingEquipment.length} items</div>
                  </div>
                )}

                {formData.technicalSpecs.soundEquipment && formData.technicalSpecs.soundEquipment.length > 0 && (
                  <div className="bg-cyan-50 rounded-lg p-4">
                    <div className="text-xs font-bold text-cyan-700 mb-1">SOUND EQUIPMENT</div>
                    <div className="text-sm font-bold text-gray-900">{formData.technicalSpecs.soundEquipment.length} items</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 7. Timeline Details */}
          <div className="bg-white border-2 border-teal-200 rounded-xl p-6 shadow-lg">
            <h4 className="text-xl font-black text-teal-900 mb-4 flex items-center gap-2">
              <span>📅</span>
              <span>Production Timeline</span>
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className={!formData.shootStartDate ? 'opacity-40' : ''}>
                <div className="text-xs font-bold text-gray-500 mb-1">SHOOT START</div>
                <div className="text-sm font-bold text-gray-900">{formData.shootStartDate || '❌ Not provided'}</div>
              </div>
              <div className={!formData.shootEndDate ? 'opacity-40' : ''}>
                <div className="text-xs font-bold text-gray-500 mb-1">SHOOT END</div>
                <div className="text-sm font-bold text-gray-900">{formData.shootEndDate || '❌ Not provided'}</div>
              </div>
              <div className={!formData.contentTimeline?.preProductionDuration ? 'opacity-40' : ''}>
                <div className="text-xs font-bold text-gray-500 mb-1">PRE-PRODUCTION</div>
                <div className="text-sm font-bold text-gray-900">{formData.contentTimeline?.preProductionDuration || '❌ Not provided'}</div>
              </div>
              <div className={!formData.contentTimeline?.postProductionDuration ? 'opacity-40' : ''}>
                <div className="text-xs font-bold text-gray-500 mb-1">POST-PRODUCTION</div>
                <div className="text-sm font-bold text-gray-900">{formData.contentTimeline?.postProductionDuration || '❌ Not provided'}</div>
              </div>
              <div className={!formData.contentTimeline?.finalDeliveryDate ? 'opacity-40' : ''}>
                <div className="text-xs font-bold text-gray-500 mb-1">FINAL DELIVERY</div>
                <div className="text-sm font-bold text-gray-900">{formData.contentTimeline?.finalDeliveryDate || '❌ Not provided'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* Creator & Production House */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-xl p-6 shadow-lg">
          <h3 className="text-2xl font-black text-purple-900 mb-4 flex items-center gap-2">
            <span className="text-3xl">👤</span>
            Creator & Production
          </h3>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-4">
              <div className="text-xs font-bold text-gray-500 mb-1">CREATOR NAME</div>
              <div className="text-lg font-black text-gray-900">{formData.creatorName || 'Not Provided'}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3">
                <div className="text-xs font-bold text-gray-500 mb-1">COMPANY</div>
                <div className="text-sm font-bold text-gray-900">{formData.companyType || 'N/A'}</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-xs font-bold text-gray-500 mb-1">EXPERIENCE</div>
                <div className="text-sm font-bold text-gray-900">{formData.yearsOfExperience || 'N/A'} years</div>
              </div>
            </div>
            {formData.imdbLink && (
              <div className="bg-white rounded-lg p-3">
                <div className="text-xs font-bold text-gray-500 mb-1">IMDB PROFILE</div>
                <a href={formData.imdbLink} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-purple-600 hover:underline">
                  View Profile →
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Key Personnel */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl p-6 shadow-lg lg:col-span-2">
          <h3 className="text-2xl font-black text-blue-900 mb-4 flex items-center gap-2">
            <span className="text-3xl">🎬</span>
            Key Personnel
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Director */}
            <div className="bg-white rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-gray-500">DIRECTOR</div>
                <div className="text-sm font-black text-gray-900 truncate">{formData.director || 'Not Assigned'}</div>
              </div>
              {formData.directorLink && (
                <a href={formData.directorLink} target="_blank" className="text-blue-600 hover:text-blue-700">
                  <span className="text-xl">🔗</span>
                </a>
              )}
            </div>

            {/* Show Runner */}
            <div className="bg-white rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-gray-500">SHOW RUNNER</div>
                <div className="text-sm font-black text-gray-900 truncate">{formData.showRunner || 'Not Assigned'}</div>
              </div>
              {formData.showRunnerLink && (
                <a href={formData.showRunnerLink} target="_blank" className="text-blue-600 hover:text-blue-700">
                  <span className="text-xl">🔗</span>
                </a>
              )}
            </div>

            {/* Creative Director */}
            <div className="bg-white rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-gray-500">CREATIVE DIRECTOR</div>
                <div className="text-sm font-black text-gray-900 truncate">{formData.creativeDirector || 'Not Assigned'}</div>
              </div>
              {formData.creativeDirectorLink && (
                <a href={formData.creativeDirectorLink} target="_blank" className="text-blue-600 hover:text-blue-700">
                  <span className="text-xl">🔗</span>
                </a>
              )}
            </div>

            {/* Head of Production */}
            <div className="bg-white rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-gray-500">HEAD OF PRODUCTION</div>
                <div className="text-sm font-black text-gray-900 truncate">{formData.headOfProduction || 'Not Assigned'}</div>
              </div>
              {formData.headOfProductionLink && (
                <a href={formData.headOfProductionLink} target="_blank" className="text-blue-600 hover:text-blue-700">
                  <span className="text-xl">🔗</span>
                </a>
              )}
            </div>

            {/* Executive Producer */}
            <div className="bg-white rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-gray-500">EXECUTIVE PRODUCER</div>
                <div className="text-sm font-black text-gray-900 truncate">{formData.executiveProducer || 'Not Assigned'}</div>
              </div>
              {formData.executiveProducerLink && (
                <a href={formData.executiveProducerLink} target="_blank" className="text-blue-600 hover:text-blue-700">
                  <span className="text-xl">🔗</span>
                </a>
              )}
            </div>

            {/* DOP */}
            <div className="bg-white rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-gray-500">DOP</div>
                <div className="text-sm font-black text-gray-900 truncate">{formData.dop || 'Not Assigned'}</div>
              </div>
              {formData.dopLink && (
                <a href={formData.dopLink} target="_blank" className="text-blue-600 hover:text-blue-700">
                  <span className="text-xl">🔗</span>
                </a>
              )}
            </div>

            {/* Editor */}
            <div className="bg-white rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-gray-500">EDITOR</div>
                <div className="text-sm font-black text-gray-900 truncate">{formData.editor || 'Not Assigned'}</div>
              </div>
              {formData.editorLink && (
                <a href={formData.editorLink} target="_blank" className="text-blue-600 hover:text-blue-700">
                  <span className="text-xl">🔗</span>
                </a>
              )}
            </div>

            {/* Art Director */}
            <div className="bg-white rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-gray-500">ART DIRECTOR</div>
                <div className="text-sm font-black text-gray-900 truncate">{formData.artDirector || 'Not Assigned'}</div>
              </div>
              {formData.artDirectorLink && (
                <a href={formData.artDirectorLink} target="_blank" className="text-blue-600 hover:text-blue-700">
                  <span className="text-xl">🔗</span>
                </a>
              )}
            </div>

            {/* Costume Designer */}
            <div className="bg-white rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-gray-500">COSTUME DESIGNER</div>
                <div className="text-sm font-black text-gray-900 truncate">{formData.costumeDesigner || 'Not Assigned'}</div>
              </div>
              {formData.costumeDesignerLink && (
                <a href={formData.costumeDesignerLink} target="_blank" className="text-blue-600 hover:text-blue-700">
                  <span className="text-xl">🔗</span>
                </a>
              )}
            </div>

            {/* Music Composer */}
            <div className="bg-white rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-gray-500">MUSIC COMPOSER</div>
                <div className="text-sm font-black text-gray-900 truncate">{formData.musicComposer || 'Not Assigned'}</div>
              </div>
              {formData.musicComposerLink && (
                <a href={formData.musicComposerLink} target="_blank" className="text-blue-600 hover:text-blue-700">
                  <span className="text-xl">🔗</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Cast Overview */}
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-300 rounded-xl p-6 shadow-lg">
          <h3 className="text-2xl font-black text-pink-900 mb-4 flex items-center gap-2">
            <span className="text-3xl">⭐</span>
            Cast Overview
          </h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl font-black text-pink-600">{formData.castData?.primaryCast?.length || 0}</div>
              <div className="text-xs font-bold text-gray-600 mt-1">Primary</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl font-black text-pink-600">{formData.castData?.secondaryCast?.length || 0}</div>
              <div className="text-xs font-bold text-gray-600 mt-1">Secondary</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl font-black text-pink-600">{formData.castData?.tertiaryCast?.length || 0}</div>
              <div className="text-xs font-bold text-gray-600 mt-1">Tertiary</div>
            </div>
          </div>
          {formData.castData?.primaryCast && formData.castData.primaryCast.length > 0 && (
            <div className="bg-white rounded-lg p-4">
              <div className="text-xs font-bold text-gray-500 mb-2">LEAD CAST</div>
              <div className="space-y-2">
                {formData.castData.primaryCast.slice(0, 3).map((cast, idx) => (
                  <div key={idx} className="text-sm font-bold text-gray-900">
                    • {cast.artistName} as {cast.characterName}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Timeline Summary */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6 shadow-lg">
          <h3 className="text-2xl font-black text-green-900 mb-4 flex items-center gap-2">
            <span className="text-3xl">📅</span>
            Timeline Summary
          </h3>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-4">
              <div className="text-xs font-bold text-gray-500 mb-2">SHOOT PERIOD</div>
              <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                <span>{formData.shootStartDate || 'TBD'}</span>
                <span className="text-green-600">→</span>
                <span>{formData.shootEndDate || 'TBD'}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3">
                <div className="text-xs font-bold text-gray-500 mb-1">PRE-PROD</div>
                <div className="text-sm font-bold text-gray-900">{formData.contentTimeline?.preProductionDuration || 'N/A'}</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-xs font-bold text-gray-500 mb-1">POST-PROD</div>
                <div className="text-sm font-bold text-gray-900">{formData.contentTimeline?.postProductionDuration || 'N/A'}</div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-xs font-bold text-gray-500 mb-1">FINAL DELIVERY</div>
              <div className="text-lg font-black text-green-700">{formData.contentTimeline?.finalDeliveryDate || 'Not Set'}</div>
            </div>
          </div>
        </div>

        {/* Technical Specs */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-xl p-6 shadow-lg">
          <h3 className="text-2xl font-black text-indigo-900 mb-4 flex items-center gap-2">
            <span className="text-3xl">📹</span>
            Technical Specs
          </h3>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-4">
              <div className="text-xs font-bold text-gray-500 mb-1">CAMERA</div>
              <div className="text-lg font-black text-gray-900">{formData.technicalSpecs?.cameraModel || 'Not Specified'}</div>
              {formData.technicalSpecs?.cameraSetupType && (
                <div className="text-sm font-semibold text-indigo-600 mt-1">
                  {formData.technicalSpecs.cameraSetupType} Camera Setup
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3">
                <div className="text-xs font-bold text-gray-500 mb-1">LENSES</div>
                <div className="text-sm font-bold text-gray-900">{formData.technicalSpecs?.lensTypes?.length || 0} Types</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-xs font-bold text-gray-500 mb-1">LIGHTING</div>
                <div className="text-sm font-bold text-gray-900">{formData.technicalSpecs?.lightingEquipment?.length || 0} Items</div>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Breakdown */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-xl p-6 shadow-lg">
          <h3 className="text-2xl font-black text-amber-900 mb-4 flex items-center gap-2">
            <span className="text-3xl">💵</span>
            Budget Breakdown
          </h3>
          <div className="space-y-2">
            {categoryNames.slice(0, 5).map((category) => {
              const total = getCategoryTotal(category);
              const percentage = getCategoryPercentage(category);
              if (total === 0) return null;
              return (
                <div key={category} className="bg-white rounded-lg p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-gray-700">{category}</span>
                    <span className="text-sm font-black text-amber-700">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500" style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Terms - Cash Flow */}
        <div className="bg-gradient-to-br from-cyan-50 to-teal-50 border-2 border-cyan-300 rounded-xl p-6 shadow-lg lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-black text-cyan-900 flex items-center gap-2">
              <span className="text-3xl">💳</span>
              Payment Terms & Cash Flow
            </h3>
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-bold text-sm flex items-center gap-2">
              🔓 EDITABLE
            </span>
          </div>

          {formData.cashFlowTranches && formData.cashFlowTranches.length > 0 ? (
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4 mb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xs font-bold text-gray-500">PROJECT TYPE</div>
                    <div className="text-lg font-black text-cyan-900 uppercase">
                      {formData.cashFlowProjectType?.replace(/([A-Z])/g, ' $1').trim() || formData.format || 'N/A'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-gray-500">TOTAL BUDGET</div>
                    <div className="text-lg font-black text-cyan-900">
                      ₹{(formData.cashFlowTotalBudget || grandTotal).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3">
                {formData.cashFlowTranches.map((tranche, idx) => (
                  <div key={tranche.id} className="bg-white rounded-lg p-4 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-teal-600 text-white rounded-full flex items-center justify-center font-black text-sm">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="text-sm font-black text-gray-900">{tranche.name}</div>
                            <div className="text-xs text-gray-600 font-semibold">{tranche.description}</div>
                          </div>
                        </div>
                        <div className="ml-11 flex items-center gap-4 text-xs font-semibold text-gray-600">
                          <span>📅 {tranche.expectedDate || 'TBD'}</span>
                          {tranche.status && (
                            <span className={`px-2 py-1 rounded-full ${
                              tranche.status === 'completed' ? 'bg-green-100 text-green-700' :
                              tranche.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {tranche.status === 'completed' ? '✓ Completed' :
                               tranche.status === 'in-progress' ? '⏳ In Progress' :
                               '⏸️ Pending'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-lg font-black text-cyan-700">{tranche.percentage}%</div>
                        <div className="text-xs font-bold text-gray-600">
                          ₹{tranche.amount.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-cyan-100 to-teal-100 rounded-lg p-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-black text-cyan-900">TOTAL PAYMENT TRANCHES</span>
                  <span className="text-2xl font-black text-cyan-900">{formData.cashFlowTranches.length}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-8 text-center">
              <span className="text-6xl mb-4 inline-block">💰</span>
              <p className="text-lg font-bold text-gray-700 mb-2">
                Payment structure based on {formData.format?.replace('-', ' ').toUpperCase() || 'format'}
              </p>
              <p className="text-sm text-gray-600 font-semibold">
                Payment terms will be finalized after project approval
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Final Submission Section */}
      <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-100 border-2 border-green-400 rounded-2xl p-8 mb-8 shadow-xl">
        <div className="flex items-start gap-4">
          <span className="text-5xl">🚀</span>
          <div className="flex-1">
            <h3 className="text-3xl font-black text-green-900 mb-3">Submit Your Project</h3>
            <p className="text-lg font-semibold text-green-800 mb-4">
              You can submit your project at any stage! Don't worry if some details are incomplete - you can always edit and resubmit later.
            </p>
            <div className="bg-white rounded-xl p-4 mb-4">
              <h4 className="font-black text-gray-900 mb-2">What Happens Next:</h4>
              <ul className="space-y-2 text-sm font-semibold text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  Platform team reviews your submission within 24-48 hours
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  You'll receive feedback or approval notification via email
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  You can update and resubmit anytime before approval
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  Approved projects move to content development phase
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  Contract and payment terms will be finalized
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-4 border-2 border-blue-300">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📝</span>
                <div>
                  <h5 className="font-black text-blue-900 text-sm">Need to Make Changes?</h5>
                  <p className="text-xs font-semibold text-blue-700">
                    Click on any step in the progress bar above to go back and edit. All changes are auto-saved!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={onBack}
          className="px-8 py-4 rounded-xl text-lg font-black transition-all duration-200 flex items-center gap-3 bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-600 text-white hover:from-purple-600 hover:via-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-2xl hover:scale-105 border-2 border-white/20"
        >
          <span className="text-xl">←</span>
          <span>Previous Step</span>
        </button>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-bold text-gray-700">
              Completion: <span className="text-green-600">{completeness}%</span>
            </div>
            <div className="text-xs text-gray-500 font-semibold">
              {completeness >= 70 ? 'Ready to submit!' : 'Submit anytime - update later!'}
            </div>
          </div>
          {(formData as any).sopAcknowledged ? (
            <button
              type="button"
              onClick={handleSubmitClick}
              className="px-12 py-4 rounded-xl text-lg font-black transition-all duration-200 flex items-center gap-3 bg-gradient-to-r from-green-500 via-emerald-600 to-green-600 text-white hover:from-green-600 hover:via-emerald-700 hover:to-green-700 shadow-lg hover:shadow-2xl hover:scale-105 border-2 border-white/20"
            >
              <span>🚀</span>
              <span>Submit Project</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onGoToStep?.(9)}
              className="px-12 py-4 rounded-xl text-lg font-black transition-all duration-200 flex items-center gap-3 bg-gradient-to-r from-red-500 via-orange-500 to-red-600 text-white hover:from-red-600 hover:via-orange-600 hover:to-red-700 shadow-lg hover:shadow-2xl animate-pulse border-2 border-white/20"
            >
              <span>⚠️</span>
              <span>SOP Acknowledge करें</span>
            </button>
          )}
        </div>
      </div>

      {/* SOP Not Acknowledged Warning */}
      {!(formData as any).sopAcknowledged && (
        <div className="bg-gradient-to-r from-red-500 via-orange-500 to-red-600 rounded-2xl p-6 mb-6 shadow-xl border-2 border-red-400">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-4xl">🚫</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black text-white mb-1">SOP Acknowledgment Required!</h3>
              <p className="text-red-100 font-semibold">
                आपको project submit करने से पहले SOP Terms & Conditions acknowledge करना अनिवार्य है।
                कृपया Step 9 (SOPs) पर जाएं और checkbox check करें।
              </p>
            </div>
            <button
              onClick={() => onGoToStep?.(9)}
              className="px-6 py-3 bg-white text-red-600 font-black rounded-xl hover:bg-red-50 transition-all flex items-center gap-2 shadow-lg"
            >
              <span>📋</span>
              <span>Go to SOPs</span>
            </button>
          </div>
        </div>
      )}

      {/* Missing Fields Modal */}
      {showMissingModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">⚠️</span>
                  <div>
                    <h3 className="text-2xl font-black">Missing Information</h3>
                    <p className="text-sm font-semibold opacity-90">
                      {warnings.length} field{warnings.length > 1 ? 's' : ''} need{warnings.length === 1 ? 's' : ''} your attention
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMissingModal(false)}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-xl font-bold transition-all"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[50vh] overflow-y-auto">
              <p className="text-gray-600 font-semibold mb-4">
                Click on any field below to go directly to that section and fill in the details:
              </p>

              {/* Group warnings by step */}
              {(() => {
                const grouped: { [key: number]: typeof warnings } = {};
                warnings.forEach((w) => {
                  if (!grouped[w.step]) grouped[w.step] = [];
                  grouped[w.step].push(w);
                });

                return (
                  <div className="space-y-4">
                    {Object.entries(grouped)
                      .sort(([a], [b]) => Number(a) - Number(b))
                      .map(([step, fields]) => (
                        <div key={step} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-full flex items-center justify-center text-sm font-black">
                                {step}
                              </span>
                              <h5 className="text-lg font-black text-gray-900">{fields[0].stepName}</h5>
                            </div>
                            <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
                              {fields.length} missing
                            </span>
                          </div>
                          <div className="space-y-2">
                            {fields.map((field, idx) => (
                              <button
                                type="button"
                                key={idx}
                                onClick={() => handleGoToField(field.step)}
                                className="w-full flex items-center justify-between bg-white hover:bg-red-50 border-2 border-gray-200 hover:border-red-300 rounded-lg p-3 transition-all group cursor-pointer"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-red-500 text-lg">•</span>
                                  <span className="text-sm font-bold text-gray-700 group-hover:text-red-700">{field.field}</span>
                                </div>
                                <span className="text-red-500 font-bold text-sm group-hover:translate-x-1 transition-transform">
                                  Go to Step →
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-2">
                    <span className="text-2xl">💡</span>
                    <div>
                      <p className="text-sm font-bold text-gray-700">You can still submit!</p>
                      <p className="text-xs text-gray-500">These fields are optional but recommended for a stronger submission.</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowMissingModal(false)}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl transition-all"
                  >
                    Go Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMissingModal(false);
                      onSubmit();
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                  >
                    <span>🚀</span>
                    <span>Submit Anyway</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
