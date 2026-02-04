'use client';

import { useEffect, useState } from 'react';
import { BudgetFormData } from '@/types/budget';
import { amountInWords } from '@/utils/numberToWords';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  uploadDate: string;
}

interface Props {
  formData: Partial<BudgetFormData>;
  setFormData: (data: Partial<BudgetFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function BasicInfoStep({ formData, setFormData, onNext }: Props) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(formData.uploadedFiles || []);
  const [cloudLinks, setCloudLinks] = useState<string[]>(formData.cloudLinks || []);
  const [newLink, setNewLink] = useState('');

  const handleChange = (field: string, value: string | number) => {
    const updates: Partial<BudgetFormData> = { [field]: value };

    // Auto-calculate shoot end date when start date or shoot days change
    if (field === 'shootStartDate' && value && formData.shootDays) {
      const startDate = new Date(value as string);
      const days = parseInt(formData.shootDays as string, 10);
      if (!isNaN(days) && days > 0) {
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + days - 1); // -1 because start day counts
        updates.shootEndDate = endDate.toISOString().split('T')[0];
      }
    }

    if (field === 'shootDays' && value && formData.shootStartDate) {
      const startDate = new Date(formData.shootStartDate as string);
      const days = parseInt(value as string, 10);
      if (!isNaN(days) && days > 0) {
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + days - 1);
        updates.shootEndDate = endDate.toISOString().split('T')[0];
      }
    }

    // Auto-calculate shoot days when end date changes (if start date exists)
    if (field === 'shootEndDate' && value && formData.shootStartDate) {
      const startDate = new Date(formData.shootStartDate as string);
      const endDate = new Date(value as string);
      const diffTime = endDate.getTime() - startDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both days
      if (diffDays > 0) {
        updates.shootDays = diffDays.toString();
      }
    }

    setFormData({ ...formData, ...updates });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newFiles: UploadedFile[] = files.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString(),
      }));

      const updatedFiles = [...uploadedFiles, ...newFiles];
      setUploadedFiles(updatedFiles);
      setFormData({ ...formData, uploadedFiles: updatedFiles });
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);
    setFormData({ ...formData, uploadedFiles: updatedFiles });
  };

  const handleAddLink = () => {
    if (newLink.trim()) {
      const updatedLinks = [...cloudLinks, newLink.trim()];
      setCloudLinks(updatedLinks);
      setFormData({ ...formData, cloudLinks: updatedLinks });
      setNewLink('');
    }
  };

  const handleRemoveLink = (index: number) => {
    const updatedLinks = cloudLinks.filter((_, i) => i !== index);
    setCloudLinks(updatedLinks);
    setFormData({ ...formData, cloudLinks: updatedLinks });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleClearContents = () => {
    if (confirm('Are you sure you want to clear all basic information? This action cannot be undone.')) {
      setFormData({
        projectName: '',
        productionCompany: '',
        culture: '',
        format: '',
        estimatedBudget: '',
        totalDuration: '',
        shootDays: '',
        shootStartDate: '',
        shootEndDate: '',
        genre: '',
        subGenre: '',
        contentRating: '',
        productionType: '',
        sourceMaterial: '',
        ipRightsStatus: '',
        numberOfSeasons: '',
        episodesPerSeason: '',
        episodeDuration: '',
      });
    }
  };

  // Check if budget was calculated from Budget Step
  // Budget page directly sets formData.estimatedBudget with Total Project Cost
  // We just need to check if budgetCategories has data to determine if it's auto-calculated
  const isBudgetAutoCalculated = formData.budgetCategories &&
    formData.budgetCategories.length > 0 &&
    formData.budgetCategories.some((cat: any) => cat.amount > 0);

  // Get the budget value from formData (already set by Budget Step with full calculation)
  const budgetFromBudgetStep = isBudgetAutoCalculated && formData.estimatedBudget
    ? parseFloat(formData.estimatedBudget)
    : 0;

  return (
    <div className="max-w-6xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Welcome Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-2xl p-8 mb-8 shadow-2xl border-4 border-white/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-32 -translate-x-32"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-6xl animate-bounce">🎬</span>
            <div>
              <h1 className="text-5xl font-black text-white mb-2 tracking-tight drop-shadow-lg">
                Welcome to STAGE Creator Portal
              </h1>
              <p className="text-xl font-semibold text-white/90">
                Let's bring your vision to life! Start by sharing your project details.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/30">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border-2 border-white/30">
              <div className="text-3xl font-black text-white mb-1">11</div>
              <div className="text-sm font-bold text-white/80">Total Steps</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border-2 border-white/30">
              <div className="text-3xl font-black text-white mb-1">💾</div>
              <div className="text-sm font-bold text-white/80">Auto-Save</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border-2 border-white/30">
              <div className="text-3xl font-black text-white mb-1">⚡</div>
              <div className="text-sm font-bold text-white/80">Quick Submit</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filmmaker Quote */}
      <div className="mb-6 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/20 rounded-xl p-6 backdrop-blur-lg">
        <div className="flex items-start gap-4">
          <span className="text-4xl">🎬</span>
          <div className="flex-1">
            <p className="text-lg md:text-xl font-bold text-amber-900 italic mb-2">
              "हर फिल्म की शुरुआत एक सपने से होती है।"
            </p>
            <p className="text-sm font-bold text-amber-800/80">— राज कपूर (Raj Kapoor)</p>
          </div>
        </div>
      </div>

      {/* Main Title */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-5xl font-black bg-gradient-to-r from-purple-700 via-pink-600 to-red-600 bg-clip-text text-transparent tracking-tight">
            📋 Project Information
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
          Tell us about your project - the foundation of your creative journey
        </p>
      </div>

      <div className="space-y-6">
        {/* Basic Project Information */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 rounded-xl border-2 border-blue-300 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all">
              <span className="text-3xl">🎯</span>
            </div>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                Basic Project Information
              </h3>
              <p className="text-xs font-semibold text-blue-700">Essential details about your project</p>
            </div>
          </div>

        {/* Row 1: Project Title & Production Company */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
              Project Title
            </label>
            <input
              type="text"
              value={formData.projectName || ''}
              onChange={(e) => handleChange('projectName', e.target.value)}
              placeholder="Enter project title"
              className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal hover:border-purple-400 transition-colors bg-white/60 shadow-sm hover:shadow-md"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
              Production Company
            </label>
            <input
              type="text"
              value={formData.productionCompany || ''}
              onChange={(e) => handleChange('productionCompany', e.target.value)}
              placeholder="Enter production company name"
              className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal hover:border-purple-400 transition-colors bg-white/60 shadow-sm hover:shadow-md"
            />
          </div>
        </div>

        {/* Row 2: Culture & Format */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
              Culture
            </label>
            <select
              value={formData.culture || ''}
              onChange={(e) => handleChange('culture', e.target.value)}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none appearance-none bg-white text-gray-900 font-medium"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
            >
              <option value="">Select culture</option>
              <option value="haryanvi">Haryanvi</option>
              <option value="rajasthani">Rajasthani</option>
              <option value="bhojpuri">Bhojpuri</option>
              <option value="gujarati">Gujarati</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
              Format
            </label>
            <select
              value={formData.format || ''}
              onChange={(e) => handleChange('format', e.target.value)}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none appearance-none bg-white text-gray-900 font-medium"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
            >
              <option value="">Select format</option>
              <option value="feature-film">Feature Film</option>
              <option value="long-series">Long Series</option>
              <option value="limited-series">Limited Series</option>
              <option value="mini-film">Mini Film</option>
              <option value="microdrama">Microdrama</option>
            </select>
          </div>
        </div>

        {/* Row 3: Budget */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
            💰 Estimated Budget (₹)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={formData.estimatedBudget || ''}
              onChange={(e) => handleChange('estimatedBudget', e.target.value)}
              placeholder="e.g., 5000000"
              readOnly={budgetFromBudgetStep > 0}
              className={`w-full md:w-1/2 px-4 py-3 text-lg font-bold border-2 rounded-lg focus:ring-2 outline-none ${
                budgetFromBudgetStep > 0
                  ? 'bg-green-50 border-green-500 text-green-900 cursor-not-allowed'
                  : 'border-purple-400 focus:ring-purple-600 focus:border-purple-600 text-gray-900'
              }`}
              style={{ fontFamily: '"SF Pro Display", Inter, sans-serif' }}
            />
            {budgetFromBudgetStep > 0 && (
              <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-2 rounded-lg border-2 border-green-400">
                ✅ Auto-calculated from Budget Step
              </span>
            )}
          </div>
          {formData.estimatedBudget && parseFloat(formData.estimatedBudget) > 0 && (
            <div className="mt-2 text-sm font-semibold text-gray-700 italic">
              {amountInWords(parseFloat(formData.estimatedBudget))}
            </div>
          )}
          {budgetFromBudgetStep === 0 && (
            <p className="text-xs text-gray-600 mt-2 font-semibold">
              💡 This will be auto-calculated from Budget section
            </p>
          )}
        </div>
        </div>

        {/* Content Classification */}
        <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 rounded-xl border-2 border-purple-300 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all">
              <span className="text-3xl">🎭</span>
            </div>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
                Content Classification
              </h3>
              <p className="text-xs font-semibold text-purple-700">Genre, rating and content type</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Genre
              </label>
              <select
                value={formData.genre || ''}
                onChange={(e) => handleChange('genre', e.target.value)}
                className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none appearance-none bg-white/60 text-gray-900 font-semibold hover:border-purple-400 transition-colors shadow-sm hover:shadow-md"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
              >
                <option value="">Select genre</option>
                <option value="drama">Drama</option>
                <option value="action">Action</option>
                <option value="comedy">Comedy</option>
                <option value="thriller">Thriller</option>
                <option value="romance">Romance</option>
                <option value="horror">Horror</option>
                <option value="sci-fi">Sci-Fi</option>
                <option value="fantasy">Fantasy</option>
                <option value="mystery">Mystery</option>
                <option value="crime">Crime</option>
                <option value="family">Family</option>
                <option value="musical">Musical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Sub-Genre
              </label>
              <input
                type="text"
                value={formData.subGenre || ''}
                onChange={(e) => handleChange('subGenre', e.target.value)}
                placeholder="e.g., Romantic Comedy"
                className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal hover:border-purple-400 transition-colors bg-white/60 shadow-sm hover:shadow-md"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Content Rating
              </label>
              <select
                value={formData.contentRating || ''}
                onChange={(e) => handleChange('contentRating', e.target.value)}
                className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none appearance-none bg-white/60 text-gray-900 font-semibold hover:border-purple-400 transition-colors shadow-sm hover:shadow-md"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
              >
                <option value="">Select rating</option>
                <option value="U">U (Universal)</option>
                <option value="UA">UA (Parental Guidance)</option>
                <option value="A">A (Adults Only)</option>
                <option value="S">S (Restricted)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Production Type */}
        <div className="bg-gradient-to-br from-rose-50 via-red-50 to-rose-100 rounded-xl border-2 border-rose-300 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all">
              <span className="text-3xl">🎨</span>
            </div>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-rose-700 to-red-600 bg-clip-text text-transparent">
                Production Type
              </h3>
              <p className="text-xs font-semibold text-rose-700">Original, remake, or adaptation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Production Type
              </label>
              <select
                value={formData.productionType || ''}
                onChange={(e) => handleChange('productionType', e.target.value)}
                className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none appearance-none bg-white/60 text-gray-900 font-semibold hover:border-purple-400 transition-colors shadow-sm hover:shadow-md"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
              >
                <option value="">Select type</option>
                <option value="original">Original Content</option>
                <option value="remake">Remake</option>
                <option value="adaptation">Adaptation (Book/Play/etc)</option>
                <option value="sequel">Sequel</option>
                <option value="prequel">Prequel</option>
                <option value="spin-off">Spin-off</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Source Material (if applicable)
              </label>
              <input
                type="text"
                value={formData.sourceMaterial || ''}
                onChange={(e) => handleChange('sourceMaterial', e.target.value)}
                placeholder="e.g., Novel name, Original film name"
                className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal hover:border-purple-400 transition-colors bg-white/60 shadow-sm hover:shadow-md"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                IP Rights Status
              </label>
              <select
                value={formData.ipRightsStatus || ''}
                onChange={(e) => handleChange('ipRightsStatus', e.target.value)}
                className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none appearance-none bg-white/60 text-gray-900 font-semibold hover:border-purple-400 transition-colors shadow-sm hover:shadow-md"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
              >
                <option value="">Select IP rights status</option>
                <option value="owned">Fully Owned by Production</option>
                <option value="licensed">Licensed from Rights Holder</option>
                <option value="partnership">Partnership/Co-ownership</option>
                <option value="pending">Rights Acquisition Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Episode Details (for Series) */}
        {(formData.format === 'long-series' || formData.format === 'limited-series' || formData.format === 'microdrama') && (
        <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-cyan-100 rounded-xl border-2 border-cyan-300 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all">
              <span className="text-3xl">📺</span>
            </div>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-cyan-700 to-blue-600 bg-clip-text text-transparent">
                Episode Details
              </h3>
              <p className="text-xs font-semibold text-cyan-700">Series structure and episode count</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Number of Seasons
              </label>
              <input
                type="number"
                value={formData.numberOfSeasons || ''}
                onChange={(e) => handleChange('numberOfSeasons', e.target.value)}
                placeholder="e.g., 1"
                min="1"
                className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal hover:border-purple-400 transition-colors bg-white/60 shadow-sm hover:shadow-md"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Episodes per Season
              </label>
              <input
                type="number"
                value={formData.episodesPerSeason || ''}
                onChange={(e) => handleChange('episodesPerSeason', e.target.value)}
                placeholder="e.g., 10"
                min="1"
                className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal hover:border-purple-400 transition-colors bg-white/60 shadow-sm hover:shadow-md"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Episode Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.episodeDuration || ''}
                onChange={(e) => handleChange('episodeDuration', e.target.value)}
                placeholder="e.g., 45"
                min="1"
                className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal hover:border-purple-400 transition-colors bg-white/60 shadow-sm hover:shadow-md"
              />
            </div>
          </div>
        </div>
        )}

        {/* Production Schedule Section */}
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 rounded-xl border-2 border-amber-300 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all">
              <span className="text-3xl">📅</span>
            </div>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
                Production Schedule
              </h3>
              <p className="text-xs font-semibold text-amber-700">Timeline and shoot duration</p>
            </div>
          </div>

          {/* Row 4: Duration & Shoot Days */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Total Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.totalDuration || ''}
                onChange={(e) => handleChange('totalDuration', e.target.value)}
                placeholder="e.g., 650"
                className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal hover:border-purple-400 transition-colors bg-white/60 shadow-sm hover:shadow-md"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Number of Shoot Days
              </label>
              <input
                type="number"
                value={formData.shootDays || ''}
                onChange={(e) => handleChange('shootDays', e.target.value)}
                placeholder="e.g., 30"
                className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal hover:border-purple-400 transition-colors bg-white/60 shadow-sm hover:shadow-md"
              />
            </div>
          </div>

          {/* Row 5: Shoot Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Shoot Start Date
              </label>
              <input
                type="date"
                value={formData.shootStartDate || ''}
                onChange={(e) => handleChange('shootStartDate', e.target.value)}
                className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold bg-white hover:border-purple-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Shoot End Date
              </label>
              <input
                type="date"
                value={formData.shootEndDate || ''}
                onChange={(e) => handleChange('shootEndDate', e.target.value)}
                className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold bg-white hover:border-purple-400 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Project Documents Upload */}
      <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 rounded-xl border-2 border-green-300 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] mb-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all">
            <span className="text-3xl">📄</span>
          </div>
          <div>
            <h3 className="text-2xl font-black bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
              Project Documents
            </h3>
            <p className="text-xs font-semibold text-green-700">Upload script, screenplay, vision deck & other documents</p>
          </div>
        </div>

        {/* File Upload Info Box */}
        <div className="bg-white/60 rounded-lg p-4 mb-4 border-2 border-green-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            📎 Upload your project documents to help us analyze and budget your project accurately
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-bold text-green-800">
            <div className="flex items-center gap-1">
              <span>✓</span>
              <span>Script</span>
            </div>
            <div className="flex items-center gap-1">
              <span>✓</span>
              <span>Screenplay</span>
            </div>
            <div className="flex items-center gap-1">
              <span>✓</span>
              <span>Dialogue</span>
            </div>
            <div className="flex items-center gap-1">
              <span>✓</span>
              <span>Vision Deck</span>
            </div>
            <div className="flex items-center gap-1">
              <span>✓</span>
              <span>Bible/Guide</span>
            </div>
            <div className="flex items-center gap-1">
              <span>✓</span>
              <span>Pitch Deck</span>
            </div>
            <div className="flex items-center gap-1">
              <span>✓</span>
              <span>Storyboard</span>
            </div>
            <div className="flex items-center gap-1">
              <span>✓</span>
              <span>Others</span>
            </div>
          </div>
        </div>

        {/* File Upload Button */}
        <div className="flex items-center justify-center mb-4">
          <label className="w-full cursor-pointer group">
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx"
              className="hidden"
              onChange={handleFileUpload}
            />
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl p-6 border-2 border-white/20 shadow-lg group-hover:shadow-2xl transition-all duration-200 group-hover:scale-105">
              <div className="flex items-center justify-center gap-4">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <div>
                  <div className="text-2xl font-black mb-1">
                    📎 Click to Upload Documents
                  </div>
                  <div className="text-sm font-semibold opacity-90">
                    PDF, DOC, DOCX, TXT, PPT, PPTX, XLS, XLSX (Max 50MB per file)
                  </div>
                </div>
              </div>
            </div>
          </label>
        </div>

        {/* OR Divider */}
        <div className="flex items-center gap-4 my-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-300 to-transparent"></div>
          <span className="text-sm font-bold text-green-700">OR</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-300 to-transparent"></div>
        </div>

        {/* Google Drive/Dropbox Link */}
        <div className="bg-white/60 rounded-lg p-4 border-2 border-green-200 mb-4">
          <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
            🔗 Share Google Drive / Dropbox Link
          </label>
          <p className="text-xs font-semibold text-gray-600 mb-3">
            If files are too large, share a Google Drive or Dropbox link with view access
          </p>
          <div className="flex gap-2">
            <input
              type="url"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              placeholder="https://drive.google.com/... or https://dropbox.com/..."
              className="flex-1 px-4 py-3 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal"
            />
            <button
              onClick={handleAddLink}
              disabled={!newLink.trim()}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed"
            >
              Add Link
            </button>
          </div>
        </div>

        {/* Cloud Links List */}
        {cloudLinks.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-bold text-gray-700 mb-2">Shared Links ({cloudLinks.length})</div>
            <div className="space-y-2">
              {cloudLinks.map((link, index) => (
                <div key={index} className="bg-white rounded-lg p-3 flex items-center justify-between border-2 border-green-200 hover:border-green-400 transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-2xl">🔗</span>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-blue-600 hover:text-blue-800 underline truncate"
                    >
                      {link}
                    </a>
                  </div>
                  <button
                    onClick={() => handleRemoveLink(index)}
                    className="ml-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors flex-shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Uploaded Files List */}
        <div>
          <div className="text-sm font-bold text-gray-700 mb-2">Uploaded Documents ({uploadedFiles.length})</div>
          {uploadedFiles.length === 0 ? (
            <div className="bg-white/40 rounded-lg p-4 text-center text-sm font-semibold text-gray-500 border-2 border-dashed border-green-300">
              No documents uploaded yet. Upload your project documents or share a link to get started.
            </div>
          ) : (
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="bg-white rounded-lg p-3 flex items-center justify-between border-2 border-green-200 hover:border-green-400 transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">📄</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-gray-900 truncate">{file.name}</div>
                      <div className="text-xs font-semibold text-gray-500">
                        {formatFileSize(file.size)} • {new Date(file.uploadDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="ml-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Helpful Tips */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-300 rounded-2xl p-6 mb-8 shadow-lg">
        <div className="flex items-start gap-4">
          <span className="text-4xl">💡</span>
          <div>
            <h3 className="text-xl font-black text-indigo-900 mb-3">Quick Tips for Success</h3>
            <ul className="space-y-2 text-sm font-semibold text-indigo-800">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-0.5">✓</span>
                <span>All fields auto-save - you can return anytime to complete or edit</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-0.5">✓</span>
                <span>Upload your complete project documents - script, screenplay, vision deck, bible - for accurate budget analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-0.5">✓</span>
                <span>Budget will be automatically calculated in the Budget section based on your documents</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-0.5">✓</span>
                <span>Click any step in the progress bar to jump to that section</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-0.5">✓</span>
                <span>You can submit at any stage and update later before final approval</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-6 flex justify-end">
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
