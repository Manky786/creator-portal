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

export default function CreatorDetailsStep({ formData, setFormData, onNext, onBack }: Props) {
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleClearContents = () => {
    if (confirm('Are you sure you want to clear all creator details? This action cannot be undone.')) {
      setFormData({
        ...formData,
        creatorName: '',
        creatorAge: '',
        fatherName: '',
        officialEmail: '',
        phone: '',
        panNumber: '',
        gstNumber: '',
        authorizedSignatory: '',
        permanentAddress: '',
        currentAddress: '',
        companyType: '',
        registrationNumber: '',
        yearsOfExperience: '',
        previousProjects: '',
        imdbLink: '',
        portfolioLink: '',
        notableWorks: '',
        officeSpaceType: '',
        teamSize: '',
        annualRevenue: '',
        concurrentCapacity: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelation: '',
        emergencyContactAddress: '',
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Filmmaker Quote */}
      <div className="mb-6 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/20 rounded-xl p-6 backdrop-blur-lg">
        <div className="flex items-start gap-4">
          <span className="text-4xl">✍️</span>
          <div className="flex-1">
            <p className="text-lg md:text-xl font-bold text-amber-900 italic mb-2">
              "निर्देशक का विज़न ही फिल्म की पहचान बनता है।"
            </p>
            <p className="text-sm font-bold text-amber-800/80">— मृणाल सेन (Mrinal Sen)</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-5xl font-black bg-gradient-to-r from-purple-700 via-pink-600 to-red-600 bg-clip-text text-transparent tracking-tight">
            👤 Creator Details
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
          Tell us about you and your production company
        </p>
      </div>

      <div className="space-y-6">
        {/* Personal Information */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 rounded-xl border-2 border-blue-300 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all">
              <span className="text-3xl">📝</span>
            </div>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                Personal Information
              </h3>
              <p className="text-xs font-semibold text-blue-700">Your basic details</p>
            </div>
          </div>

        {/* Row 1: Creator Name & Age */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
              Creator Name
            </label>
            <input
              type="text"
              value={formData.creatorName || ''}
              onChange={(e) => handleChange('creatorName', e.target.value)}
              placeholder="Enter creator name"
              className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal hover:border-purple-400 transition-colors bg-white/60 shadow-sm hover:shadow-md"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
              Age
            </label>
            <input
              type="number"
              value={formData.creatorAge || ''}
              onChange={(e) => handleChange('creatorAge', e.target.value)}
              placeholder="Age"
              className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal hover:border-purple-400 transition-colors bg-white/60 shadow-sm hover:shadow-md"
            />
          </div>
        </div>

        {/* Row 2: Father's Name & Official Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
              Father's Name
            </label>
            <input
              type="text"
              value={formData.fatherName || ''}
              onChange={(e) => handleChange('fatherName', e.target.value)}
              placeholder="Father's name"
              className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal hover:border-purple-400 transition-colors bg-white/60 shadow-sm hover:shadow-md"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
              Official Email ID
            </label>
            <input
              type="email"
              value={formData.officialEmail || ''}
              onChange={(e) => handleChange('officialEmail', e.target.value)}
              placeholder="official@example.com"
              className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal hover:border-purple-400 transition-colors bg-white/60 shadow-sm hover:shadow-md"
            />
          </div>
        </div>

        {/* Row 3: Phone & PAN Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="10-digit phone number"
              maxLength={10}
              className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal hover:border-purple-400 transition-colors bg-white/60 shadow-sm hover:shadow-md"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
              PAN Number
            </label>
            <input
              type="text"
              value={formData.panNumber || ''}
              onChange={(e) => handleChange('panNumber', e.target.value.toUpperCase())}
              placeholder="ABCDE1234F"
              maxLength={10}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal uppercase"
            />
            <p className="text-sm text-gray-500 mt-1">Format: ABCDE1234F</p>
          </div>
        </div>
        </div>

        {/* Business & Legal Information */}
        <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 rounded-xl border-2 border-green-300 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all">
              <span className="text-3xl">💼</span>
            </div>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                Business & Legal Information
              </h3>
              <p className="text-xs font-semibold text-green-700">Company and legal details</p>
            </div>
          </div>

        {/* Row 4: GST Number & Authorized Signatory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
              GST Number
            </label>
            <input
              type="text"
              value={formData.gstNumber || ''}
              onChange={(e) => handleChange('gstNumber', e.target.value.toUpperCase())}
              placeholder="GST number (if available)"
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal uppercase"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
              Authorized Signatory
            </label>
            <input
              type="text"
              value={formData.authorizedSignatory || ''}
              onChange={(e) => handleChange('authorizedSignatory', e.target.value)}
              placeholder="Name of authorized signatory"
              className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal hover:border-purple-400 transition-colors bg-white/60 shadow-sm hover:shadow-md"
            />
          </div>
        </div>
        </div>

        {/* Address Information */}
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 rounded-xl border-2 border-amber-300 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all">
              <span className="text-3xl">🏠</span>
            </div>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
                Address Information
              </h3>
              <p className="text-xs font-semibold text-amber-700">Permanent and current address</p>
            </div>
          </div>

        {/* Row 5: Permanent Address */}
        <div>
          <label className="block text-base font-medium text-gray-900 mb-2">
            Permanent Address
          </label>
          <textarea
            value={formData.permanentAddress || ''}
            onChange={(e) => handleChange('permanentAddress', e.target.value)}
            placeholder="Full permanent address"
            rows={4}
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal resize-none"
          />
        </div>

        {/* Row 6: Current Address */}
        <div>
          <label className="block text-base font-medium text-gray-900 mb-2">
            Current Address
          </label>
          <textarea
            value={formData.currentAddress || ''}
            onChange={(e) => handleChange('currentAddress', e.target.value)}
            placeholder="Full current address (if different)"
            rows={4}
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal resize-none"
          />
        </div>
        </div>

        {/* Professional Identity & Experience */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 rounded-xl border-2 border-indigo-300 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all">
              <span className="text-3xl">⭐</span>
            </div>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent">
                Professional Identity & Experience
              </h3>
              <p className="text-xs font-semibold text-indigo-700">Your professional background</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  Production Company Type
                </label>
                <select
                  value={formData.companyType || ''}
                  onChange={(e) => handleChange('companyType', e.target.value)}
                  className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none appearance-none bg-white/60 text-gray-900 font-semibold hover:border-purple-400 transition-colors shadow-sm hover:shadow-md"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
                >
                  <option value="">Select company type</option>
                  <option value="individual">Individual Creator</option>
                  <option value="proprietorship">Sole Proprietorship</option>
                  <option value="partnership">Partnership</option>
                  <option value="llp">LLP (Limited Liability Partnership)</option>
                  <option value="private">Private Limited Company</option>
                  <option value="public">Public Limited Company</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  Company Registration Number
                </label>
                <input
                  type="text"
                  value={formData.registrationNumber || ''}
                  onChange={(e) => handleChange('registrationNumber', e.target.value)}
                  placeholder="CIN/ROC Number"
                  className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal hover:border-purple-400 transition-colors bg-white/60 shadow-sm hover:shadow-md"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  Years of Experience
                </label>
                <input
                  type="number"
                  value={formData.yearsOfExperience || ''}
                  onChange={(e) => handleChange('yearsOfExperience', e.target.value)}
                  placeholder="e.g., 5"
                  min="0"
                  className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal hover:border-purple-400 transition-colors bg-white/60 shadow-sm hover:shadow-md"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  Previous Projects Completed
                </label>
                <input
                  type="number"
                  value={formData.previousProjects || ''}
                  onChange={(e) => handleChange('previousProjects', e.target.value)}
                  placeholder="e.g., 10"
                  min="0"
                  className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal hover:border-purple-400 transition-colors bg-white/60 shadow-sm hover:shadow-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  IMDB Profile Link
                </label>
                <input
                  type="url"
                  value={formData.imdbLink || ''}
                  onChange={(e) => handleChange('imdbLink', e.target.value)}
                  placeholder="https://www.imdb.com/name/..."
                  className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal hover:border-purple-400 transition-colors bg-white/60 shadow-sm hover:shadow-md"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  Professional Website/Portfolio
                </label>
                <input
                  type="url"
                  value={formData.portfolioLink || ''}
                  onChange={(e) => handleChange('portfolioLink', e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal hover:border-purple-400 transition-colors bg-white/60 shadow-sm hover:shadow-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Notable Previous Works
              </label>
              <textarea
                value={formData.notableWorks || ''}
                onChange={(e) => handleChange('notableWorks', e.target.value)}
                placeholder="List your notable projects, awards, and achievements..."
                rows={4}
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal hover:border-purple-400 transition-colors bg-white/60 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Production Capacity */}
        <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-teal-100 rounded-xl border-2 border-teal-300 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all">
              <span className="text-3xl">🏭</span>
            </div>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-teal-700 to-cyan-600 bg-clip-text text-transparent">
                Production Capacity
              </h3>
              <p className="text-xs font-semibold text-teal-700">Team size and resources</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  Studio/Office Space
                </label>
                <select
                  value={formData.officeSpaceType || ''}
                  onChange={(e) => handleChange('officeSpaceType', e.target.value)}
                  className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none appearance-none bg-white/60 text-gray-900 font-semibold hover:border-purple-400 transition-colors shadow-sm hover:shadow-md"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
                >
                  <option value="">Select space type</option>
                  <option value="owned">Owned Studio/Office</option>
                  <option value="rented">Rented Studio/Office</option>
                  <option value="coworking">Co-working Space</option>
                  <option value="none">No Fixed Space</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  Full-time Team Size
                </label>
                <input
                  type="number"
                  value={formData.teamSize || ''}
                  onChange={(e) => handleChange('teamSize', e.target.value)}
                  placeholder="e.g., 15"
                  min="0"
                  className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal hover:border-purple-400 transition-colors bg-white/60 shadow-sm hover:shadow-md"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  Annual Revenue Range
                </label>
                <select
                  value={formData.annualRevenue || ''}
                  onChange={(e) => handleChange('annualRevenue', e.target.value)}
                  className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none appearance-none bg-white/60 text-gray-900 font-semibold hover:border-purple-400 transition-colors shadow-sm hover:shadow-md"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
                >
                  <option value="">Select revenue range</option>
                  <option value="under-10L">Under ₹10 Lakhs</option>
                  <option value="10L-50L">₹10 Lakhs - ₹50 Lakhs</option>
                  <option value="50L-1Cr">₹50 Lakhs - ₹1 Crore</option>
                  <option value="1Cr-5Cr">₹1 Crore - ₹5 Crore</option>
                  <option value="5Cr-10Cr">₹5 Crore - ₹10 Crore</option>
                  <option value="above-10Cr">Above ₹10 Crore</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  Concurrent Projects Capacity
                </label>
                <input
                  type="number"
                  value={formData.concurrentCapacity || ''}
                  onChange={(e) => handleChange('concurrentCapacity', e.target.value)}
                  placeholder="e.g., 3"
                  min="0"
                  className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal hover:border-purple-400 transition-colors bg-white/60 shadow-sm hover:shadow-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact Information */}
        <div className="bg-gradient-to-br from-red-50 via-rose-50 to-red-100 rounded-xl border-2 border-red-300 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all">
              <span className="text-3xl">🚨</span>
            </div>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-red-700 to-rose-600 bg-clip-text text-transparent">
                Emergency Contact Information
              </h3>
              <p className="text-xs font-semibold text-red-700">Backup contact details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Emergency Contact Name
              </label>
              <input
                type="text"
                value={formData.emergencyContactName || ''}
                onChange={(e) => handleChange('emergencyContactName', e.target.value)}
                placeholder="Full name"
                className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal hover:border-purple-400 transition-colors bg-white/60 shadow-sm hover:shadow-md"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Emergency Contact Phone
              </label>
              <input
                type="tel"
                value={formData.emergencyContactPhone || ''}
                onChange={(e) => handleChange('emergencyContactPhone', e.target.value)}
                placeholder="10-digit phone number"
                maxLength={10}
                className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal hover:border-purple-400 transition-colors bg-white/60 shadow-sm hover:shadow-md"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Relationship
              </label>
              <select
                value={formData.emergencyContactRelation || ''}
                onChange={(e) => handleChange('emergencyContactRelation', e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none appearance-none bg-white/60 text-gray-900 font-semibold hover:border-purple-400 transition-colors"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
              >
                <option value="">Select relationship</option>
                <option value="spouse">Spouse</option>
                <option value="parent">Parent</option>
                <option value="sibling">Sibling</option>
                <option value="child">Child</option>
                <option value="partner">Business Partner</option>
                <option value="friend">Friend</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Emergency Contact Address
              </label>
              <textarea
                value={formData.emergencyContactAddress || ''}
                onChange={(e) => handleChange('emergencyContactAddress', e.target.value)}
                placeholder="Full address"
                rows={3}
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal hover:border-purple-400 transition-colors bg-white/60 resize-none"
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
