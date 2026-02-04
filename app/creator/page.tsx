'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { BudgetFormData } from '@/types/budget';
import BudgetWizard from '@/components/BudgetWizard';
import FilmmakerQuote from '@/components/FilmmakerQuote';

const STORAGE_KEY = 'stage_creator_draft';

export default function CreatorPage() {
  const [started, setStarted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [formData, setFormData] = useState<Partial<BudgetFormData>>({
    projectName: '',
    productionCompany: '',
    culture: '',
    format: '',
    estimatedBudget: '',
    totalDuration: '',
    shootDays: '',
    shootStartDate: '',
    shootEndDate: '',
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
    // Direction Department
    director: '',
    directorLink: '',
    associateDirector: '',
    associateDirectorLink: '',
    assistantDirector1: '',
    assistantDirector1Link: '',
    assistantDirector2: '',
    assistantDirector2Link: '',
    directionOthers: [],

    // Production Department
    headOfProduction: '',
    headOfProductionLink: '',
    executiveProducer: '',
    executiveProducerLink: '',
    productionController: '',
    productionControllerLink: '',
    lineProducer: '',
    lineProducerLink: '',
    unitProductionManager: '',
    unitProductionManagerLink: '',
    locationManager: '',
    locationManagerLink: '',
    productionOthers: [],

    // Creative Department
    showRunner: '',
    showRunnerLink: '',
    projectHead: '',
    projectHeadLink: '',
    creativeDirector: '',
    creativeDirectorLink: '',
    associateCreativeDirector: '',
    associateCreativeDirectorLink: '',
    creativeOthers: [],

    // Writing Department
    storyBy: '',
    storyByLink: '',
    screenplayBy: '',
    screenplayByLink: '',
    dialoguesBy: '',
    dialoguesByLink: '',
    writingOthers: [],

    // Camera Department
    dop: '',
    dopLink: '',
    firstCameraOperator: '',
    firstCameraOperatorLink: '',
    cameraOperator: '',
    cameraOperatorLink: '',
    focusPuller: '',
    focusPullerLink: '',
    steadicamOperator: '',
    steadicamOperatorLink: '',
    cameraOthers: [],

    // Editing Department
    editor: '',
    editorLink: '',
    onLocationEditor: '',
    onLocationEditorLink: '',
    colorist: '',
    coloristLink: '',
    editingOthers: [],

    // Sound Department
    soundRecordist: '',
    soundRecordistLink: '',
    soundDesigner: '',
    soundDesignerLink: '',
    foleyArtist: '',
    foleyArtistLink: '',
    reRecordingMixer: '',
    reRecordingMixerLink: '',
    soundOthers: [],

    // Music Department
    musicComposer: '',
    musicComposerLink: '',
    bgmComposer: '',
    bgmComposerLink: '',
    playbackSinger: '',
    playbackSingerLink: '',
    musicOthers: [],

    // Art & Design Department
    productionDesigner: '',
    productionDesignerLink: '',
    artDirector: '',
    artDirectorLink: '',
    setDesigner: '',
    setDesignerLink: '',
    artOthers: [],

    // Costume & Makeup Department
    costumeDesigner: '',
    costumeDesignerLink: '',
    makeupArtist: '',
    makeupArtistLink: '',
    hairStylist: '',
    hairStylistLink: '',
    costumeOthers: [],

    // VFX & Post Production
    vfxSupervisor: '',
    vfxSupervisorLink: '',
    diArtist: '',
    diArtistLink: '',
    vfxOthers: [],

    // Action & Choreography
    actionDirector: '',
    actionDirectorLink: '',
    stuntCoordinator: '',
    stuntCoordinatorLink: '',
    choreographer: '',
    choreographerLink: '',
    actionOthers: [],

    // Casting
    castingDirector: '',
    castingDirectorLink: '',
    castingOthers: [],

    // Photography & Documentation
    stillPhotographer: '',
    stillPhotographerLink: '',
    btsVideographer: '',
    btsVideographerLink: '',
    photographyOthers: [],

    budgetData: {},

    // Cast Data
    castData: {
      primaryCast: [],
      secondaryCast: [],
      tertiaryCast: [],
    },

    // Technical Specifications
    technicalSpecs: {
      cameraModel: '',
      cameraSetupType: '',
      lensTypes: [],
      cameraOthers: [],
      lightingEquipment: [],
      lightingOthers: [],
      cinematicTools: [],
      cinematicOthers: [],
      droneModels: [],
      droneOthers: [],
      soundEquipment: [],
      soundOthers: [],
    },

    // Content Creation Timeline
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

  // Load saved draft from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDraft = localStorage.getItem(STORAGE_KEY);
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          // Remove internal fields before setting formData
          const { _lastSaved, _started, ...formFields } = parsed;
          setFormData(prev => ({ ...prev, ...formFields }));
          setLastSaved(new Date(_lastSaved || Date.now()));
          // Auto-resume if user was in the middle of filling form
          if (_started) {
            setStarted(true);
          }
        } catch (e) {
          console.error('Failed to load saved draft:', e);
        }
      }
    }
  }, []);

  // Auto-save to localStorage whenever formData changes
  const saveToStorage = useCallback((data: Partial<BudgetFormData>, isStarted: boolean) => {
    if (typeof window !== 'undefined') {
      setAutoSaveStatus('saving');
      const dataWithTimestamp = {
        ...data,
        _lastSaved: new Date().toISOString(),
        _started: isStarted,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataWithTimestamp));
      setLastSaved(new Date());
      setTimeout(() => {
        setAutoSaveStatus('saved');
        setTimeout(() => setAutoSaveStatus('idle'), 2000);
      }, 500);
    }
  }, []);

  // Debounced auto-save - runs whenever formData changes (even on first step)
  useEffect(() => {
    if (mounted) {
      const timeoutId = setTimeout(() => {
        saveToStorage(formData, started);
      }, 1000); // Save 1 second after last change
      return () => clearTimeout(timeoutId);
    }
  }, [formData, started, mounted, saveToStorage]);

  // Save immediately when user starts the form
  useEffect(() => {
    if (started && mounted) {
      saveToStorage(formData, true);
    }
  }, [started]);

  // Wrapper for setFormData that triggers save
  const updateFormData = useCallback((newData: Partial<BudgetFormData>) => {
    setFormData(newData);
  }, []);

  // Clear draft (for after successful submit)
  const clearDraft = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-12">
          <Link href="/" className={`text-red-400 hover:text-red-300 mb-8 inline-flex items-center gap-2 font-semibold transition-all duration-300 hover:gap-3 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
            ← Back to Home
          </Link>

          <div className="max-w-5xl mx-auto">
            {/* Header Section with Premium Animation */}
            <div className={`mb-12 text-center ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <div className="inline-block mb-4">
                <div className="px-4 py-2 bg-red-600/20 border border-red-500/30 rounded-full backdrop-blur-sm">
                  <span className="text-red-400 font-bold text-sm uppercase tracking-wider">Step-by-Step Process</span>
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
                Creator Onboarding
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Let's get your project submitted with our comprehensive budget template
              </p>
            </div>

            {/* Filmmaker Quotes */}
            <div className={`grid md:grid-cols-2 gap-6 mb-8 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
              <FilmmakerQuote
                quote="डर के आगे जीत है। बस शुरुआत करो, बाकी सब अपने आप होता जाएगा।"
                filmmaker="Anurag Kashyap"
                title="Visionary Director"
                imageUrl="/images/filmmakers/anurag-kashyap.jpg"
                language="hindi"
              />
              <FilmmakerQuote
                quote="Pick up a camera. Shoot something. No matter how small, no matter how cheesy, no matter whether your friends and your sister star in it."
                filmmaker="James Cameron"
                title="Academy Award Winner"
                imageUrl="/images/filmmakers/james-cameron.webp"
                language="english"
              />
            </div>

            {/* Glassmorphism Card - What to Expect */}
            <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 mb-8 shadow-2xl ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '0.3s'}}>
              <h3 className="font-black text-2xl md:text-3xl mb-8 text-white">What to expect:</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { num: '1', title: 'Basic Information', desc: 'Project details, culture, format, schedule', delay: '0.3s' },
                  { num: '2', title: 'Budget Entry', desc: 'Fill amounts in pre-structured template', delay: '0.4s' },
                  { num: '3', title: 'Review & Analysis', desc: 'See instant financial breakdown', delay: '0.5s' },
                  { num: '4', title: 'Submit', desc: 'Send to platform for evaluation', delay: '0.6s' },
                ].map((step) => (
                  <div
                    key={step.num}
                    className={`group flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-red-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
                    style={{animationDelay: step.delay}}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:scale-110 transition-transform">
                      {step.num}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-lg mb-1 text-white group-hover:text-red-400 transition-colors">{step.title}</div>
                      <div className="text-sm text-gray-400">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Glassmorphism Pro Tips Card */}
            <div className={`bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8 shadow-xl ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '0.8s'}}>
              <h3 className="font-black text-xl mb-6 text-white flex items-center gap-3">
                <span className="text-3xl">💡</span>
                Pro Tips
              </h3>
              <ul className="space-y-4">
                {[
                  { icon: '💾', text: 'Your progress is auto-saved every 30 seconds' },
                  { icon: '🎯', text: 'Only fill fields relevant to your project' },
                  { icon: '📊', text: "You'll see real-time percentage calculations" },
                ].map((tip, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-300 hover:text-white transition-colors group">
                    <span className="text-2xl group-hover:scale-125 transition-transform">{tip.icon}</span>
                    <span className="text-base leading-relaxed">{tip.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sample Preview Button */}
            <button
              onClick={() => setShowSampleModal(true)}
              className={`group w-full mb-4 bg-white/5 backdrop-blur-sm border-2 border-white/20 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 hover:border-red-500/50 transition-all duration-300 hover:scale-[1.02] ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{animationDelay: '0.75s'}}
            >
              <span className="flex items-center justify-center gap-3">
                👁️ View Sample Budget Preview
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </span>
            </button>

            {/* Premium CTA Button */}
            <button
              onClick={() => setStarted(true)}
              className={`group relative w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-5 rounded-2xl font-bold text-xl overflow-hidden shadow-2xl shadow-red-500/50 hover:shadow-red-500/70 transition-all duration-300 hover:scale-[1.02] ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{animationDelay: '0.8s'}}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                🚀 Start Budget Submission
                <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>

            {/* Estimated Time */}
            <div className={`mt-6 text-center text-gray-400 text-sm ${mounted ? 'animate-fade-in' : 'opacity-0'}`} style={{animationDelay: '0.9s'}}>
              ⏱️ Estimated time: <span className="text-white font-semibold">15-20 minutes</span>
            </div>
          </div>
        </div>

        {/* Sample Budget Modal */}
        {showSampleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setShowSampleModal(false)}>
            <div className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-black text-white">📋 Sample Budget Preview</h2>
                <button
                  onClick={() => setShowSampleModal(false)}
                  className="text-gray-400 hover:text-white text-3xl font-bold transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Sample Content */}
              <div className="space-y-6">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Project: "Mahapunarjanam"</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Format:</span>
                      <span className="text-white font-semibold ml-2">Web Series</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Culture:</span>
                      <span className="text-white font-semibold ml-2">Haryanvi</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Episodes:</span>
                      <span className="text-white font-semibold ml-2">26 Episodes</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Total Budget:</span>
                      <span className="text-red-400 font-bold ml-2">₹1.10 Cr</span>
                    </div>
                  </div>
                </div>

                {/* Budget Breakdown */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <h4 className="font-bold text-white mb-4">Department-wise Budget Breakdown</h4>
                  <div className="space-y-3">
                    {[
                      { dept: 'Cast (Primary & Secondary)', amount: '16.50 Lakh', percent: '15%' },
                      { dept: 'Post-Production & VFX', amount: '13.20 Lakh', percent: '12%' },
                      { dept: 'Production & Location', amount: '19.80 Lakh', percent: '18%' },
                      { dept: 'Camera & Equipment', amount: '16.50 Lakh', percent: '15%' },
                      { dept: 'Direction & Creative', amount: '15.40 Lakh', percent: '14%' },
                      { dept: 'Music & Songs', amount: '13.20 Lakh', percent: '12%' },
                      { dept: 'Art & Costume', amount: '8.80 Lakh', percent: '8%' },
                      { dept: 'Travel & Accommodation', amount: '6.60 Lakh', percent: '6%' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm hover:bg-white/5 p-2 rounded-lg transition-colors">
                        <span className="text-gray-300">{item.dept}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-white font-semibold">₹{item.amount}</span>
                          <span className="text-red-400 font-bold w-12 text-right">{item.percent}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
                    <span className="text-white font-bold">Total Allocated:</span>
                    <span className="text-red-500 font-black text-lg">₹1.10 Cr</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-6">
                  <p className="text-green-400 font-semibold text-center">
                    ✓ This project was approved and is now streaming on STAGE
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowSampleModal(false);
                    setStarted(true);
                  }}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-red-500/50 transition-all"
                >
                  Start Your Submission →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Premium CSS Animations */}
        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
          }

          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out forwards;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          .animate-spin {
            animation: spin 1s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  return (
    <BudgetWizard
      formData={formData}
      setFormData={updateFormData}
      autoSaveStatus={autoSaveStatus}
      lastSaved={lastSaved}
      onClearDraft={clearDraft}
    />
  );
}
