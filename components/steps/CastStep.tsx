'use client';

import { useState } from 'react';
import { BudgetFormData, CastMember } from '@/types/budget';

interface Props {
  formData: Partial<BudgetFormData>;
  setFormData: (data: Partial<BudgetFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

type CastCategory = 'primaryCast' | 'secondaryCast' | 'tertiaryCast';

export default function CastStep({ formData, setFormData, onNext, onBack }: Props) {
  const [activeTab, setActiveTab] = useState<CastCategory>('primaryCast');

  const castData = formData.castData || {
    primaryCast: [],
    secondaryCast: [],
    tertiaryCast: [],
  };

  const updateCastData = (category: CastCategory, members: CastMember[]) => {
    setFormData({
      ...formData,
      castData: {
        ...castData,
        [category]: members,
      },
    });
  };

  const addCastMember = (category: CastCategory) => {
    const newMember: CastMember = {
      id: Date.now().toString(),
      artistName: '',
      characterName: '',
      socialMediaLink: '',
      photographUrl: '',
    };
    updateCastData(category, [...castData[category], newMember]);
  };

  const removeCastMember = (category: CastCategory, id: string) => {
    const updatedMembers = castData[category].filter((member) => member.id !== id);
    updateCastData(category, updatedMembers);
  };

  const updateCastMember = (
    category: CastCategory,
    id: string,
    field: keyof CastMember,
    value: string
  ) => {
    const updatedMembers = castData[category].map((member) =>
      member.id === id ? { ...member, [field]: value } : member
    );
    updateCastData(category, updatedMembers);
  };

  const handleClearContents = () => {
    if (confirm('Are you sure you want to clear all cast data? This action cannot be undone.')) {
      setFormData({
        ...formData,
        castData: {
          primaryCast: [],
          secondaryCast: [],
          tertiaryCast: [],
        },
      });
    }
  };

  const handleFileUpload = (category: CastCategory, id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In production, upload to server/cloud storage
      // For now, create a local URL
      const url = URL.createObjectURL(file);
      updateCastMember(category, id, 'photographUrl', url);
    }
  };

  const tabs = [
    { key: 'primaryCast' as CastCategory, label: '⭐ Primary Cast', description: 'Lead roles & main characters' },
    { key: 'secondaryCast' as CastCategory, label: '🌟 Secondary Cast', description: 'Supporting characters' },
    { key: 'tertiaryCast' as CastCategory, label: '✨ Tertiary Cast', description: 'Minor roles & extras' },
  ];

  const renderCastMembers = (category: CastCategory) => {
    const members = castData[category];

    return (
      <div className="space-y-4">
        {members.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-gray-500 mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <p className="text-gray-600 mb-2 font-medium">No cast members added yet</p>
            <p className="text-sm text-gray-500">Click the button below to add your first cast member</p>
          </div>
        ) : (
          members.map((member) => (
            <div
              key={member.id}
              className="bg-gradient-to-br from-white to-purple-50 border-3 border-purple-200 rounded-xl p-6 hover:border-purple-400 hover:shadow-xl transition-all duration-300"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Artist Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Artist Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={member.artistName}
                      onChange={(e) =>
                        updateCastMember(category, member.id, 'artistName', e.target.value)
                      }
                      placeholder="Enter artist name"
                      className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal hover:border-purple-400 transition-colors bg-white/80 shadow-sm hover:shadow-md"
                    />
                  </div>

                  {/* Character Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Character Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={member.characterName}
                      onChange={(e) =>
                        updateCastMember(category, member.id, 'characterName', e.target.value)
                      }
                      placeholder="Enter character name"
                      className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal hover:border-purple-400 transition-colors bg-white/80 shadow-sm hover:shadow-md"
                    />
                  </div>

                  {/* Social Media Link */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Social Media Profile
                    </label>
                    <input
                      type="url"
                      value={member.socialMediaLink}
                      onChange={(e) =>
                        updateCastMember(category, member.id, 'socialMediaLink', e.target.value)
                      }
                      placeholder="Instagram, Twitter, or Portfolio URL"
                      className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal hover:border-purple-400 transition-colors bg-white/80 shadow-sm hover:shadow-md"
                    />
                  </div>
                </div>

                {/* Right Column - Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Latest Photograph
                  </label>
                  <div className="space-y-3">
                    {member.photographUrl ? (
                      <div className="relative">
                        <img
                          src={member.photographUrl}
                          alt={member.artistName || 'Cast member'}
                          className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateCastMember(category, member.id, 'photographUrl', '')
                          }
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <label className="block w-full h-48 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-400 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center h-full">
                          <svg
                            className="w-12 h-12 text-gray-400 mb-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="text-sm text-gray-600 font-medium mb-1">
                            Upload Photograph
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG up to 10MB
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(category, member.id, e)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Remove Button */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => removeCastMember(category, member.id)}
                  className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Remove Cast Member
                </button>
              </div>
            </div>
          ))
        )}

        {/* Add Button */}
        <button
          type="button"
          onClick={() => addCastMember(category)}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-700 hover:border-red-400 hover:bg-red-50 hover:text-red-600 transition-all font-medium flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Cast Member
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Filmmaker Quote */}
      <div className="mb-6 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/20 rounded-xl p-6 backdrop-blur-lg">
        <div className="flex items-start gap-4">
          <span className="text-4xl">🎭</span>
          <div className="flex-1">
            <p className="text-lg md:text-xl font-bold text-amber-900 italic mb-2">
              "अभिनेता फिल्म की आत्मा होता है।"
            </p>
            <p className="text-sm font-bold text-amber-800/80">— गुरु दत्त (Guru Dutt)</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-5xl font-black bg-gradient-to-r from-purple-700 via-pink-600 to-red-600 bg-clip-text text-transparent tracking-tight">
            🎭 Cast & Characters
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
          Add your talented cast members across primary, secondary, and tertiary roles
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b-2 border-gray-300 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl p-2">
          <nav className="-mb-px flex space-x-4" aria-label="Tabs">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              const count = castData[tab.key].length;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    group inline-flex items-center py-3 px-4 border-b-4 font-bold text-sm transition-all duration-200 rounded-t-lg
                    ${
                      isActive
                        ? 'border-purple-600 bg-white text-purple-700 shadow-lg scale-105'
                        : 'border-transparent text-gray-600 hover:text-purple-600 hover:border-purple-300 hover:bg-white/50'
                    }
                  `}
                >
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2">
                      <span>{tab.label}</span>
                      {count > 0 && (
                        <span
                          className={`
                          inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium
                          ${isActive ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'}
                        `}
                        >
                          {count}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 mt-0.5">{tab.description}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">{renderCastMembers(activeTab)}</div>

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
