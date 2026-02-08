'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BudgetFormData } from '@/types/budget';
import { supabase } from '@/lib/supabase';
import ProgressBar from './ProgressBar';
import BasicInfoStep from './steps/BasicInfoStep';
import CreatorDetailsStep from './steps/CreatorDetailsStep';
import CrewStep from './steps/CrewStep';
import CastStep from './steps/CastStep';
import TechnicalStep from './steps/TechnicalStep';
import TimelineStep from './steps/TimelineStep';
import BudgetStep from './steps/BudgetStep';
import BudgetEntryStep from './steps/BudgetEntryStep';
import DocumentsStep from './steps/DocumentsStep';
import CashFlowStep from './steps/CashFlowStep';
import ReviewStep from './steps/ReviewStep';

interface Props {
  formData: Partial<BudgetFormData>;
  setFormData: (data: Partial<BudgetFormData>) => void;
  autoSaveStatus?: 'saved' | 'saving' | 'idle';
  lastSaved?: Date | null;
  onClearDraft?: () => void;
}

const steps = [
  { id: 1, name: 'Project', component: BasicInfoStep },
  { id: 2, name: 'Creator', component: CreatorDetailsStep },
  { id: 3, name: 'Budget', component: BudgetStep },
  { id: 4, name: 'Timeline', component: TimelineStep },
  { id: 5, name: 'Crew', component: CrewStep },
  { id: 6, name: 'Cast', component: CastStep },
  { id: 7, name: 'Technical', component: TechnicalStep },
  { id: 8, name: 'Cash Flow', component: CashFlowStep },
  { id: 9, name: 'SOPs', component: BudgetEntryStep },
  { id: 10, name: 'Documents', component: DocumentsStep },
  { id: 11, name: 'Review', component: ReviewStep },
];

export default function BudgetWizard({ formData, setFormData, autoSaveStatus, lastSaved, onClearDraft }: Props) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      scrollToTop();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      scrollToTop();
    }
  };

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
    scrollToTop();
  };

  const handleSubmit = async () => {
    // Check SOP acknowledgment first
    if (!(formData as any).sopAcknowledged) {
      setSubmitError('⚠️ SOP Terms & Conditions acknowledgment is mandatory before submission. Please go to Step 9 (SOPs) and check the acknowledgment checkbox.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Check if Supabase is configured
      const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';

      if (isSupabaseConfigured) {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        // Prepare submission data
        const submissionData = {
          ...formData,
          submitted_at: new Date().toISOString(),
          status: 'pending_review',
          user_id: user?.id || null,
          user_email: user?.email || formData.officialEmail || 'anonymous',
        };

        // Try to save to Supabase projects table
        const { error } = await supabase
          .from('projects')
          .insert([submissionData]);

        if (error) {
          console.warn('Supabase save failed, using local storage:', error);
          // Fall back to localStorage
          saveToLocalSubmissions(submissionData);
        }
      } else {
        // No Supabase - save to localStorage submissions
        const editingId = (formData as any)._editingProjectId;
        const submissionData = {
          ...formData,
          id: editingId || `project_${Date.now()}`,
          submitted_at: new Date().toISOString(),
          updated_at: editingId ? new Date().toISOString() : undefined,
          status: 'pending_review',
        };
        // Remove internal fields
        delete (submissionData as any)._editingProjectId;
        delete (submissionData as any)._lastSaved;
        delete (submissionData as any)._started;

        saveToLocalSubmissions(submissionData, editingId);
      }

      // Clear the draft
      onClearDraft?.();

      // Show success
      setSubmitSuccess(true);

    } catch (error: any) {
      console.error('Submit error:', error);
      setSubmitError(error.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveToLocalSubmissions = (data: any, editingId?: string) => {
    const existingSubmissions = JSON.parse(localStorage.getItem('stage_submissions') || '[]');

    if (editingId) {
      // Update existing submission
      const index = existingSubmissions.findIndex((s: any) => s.id === editingId);
      if (index !== -1) {
        existingSubmissions[index] = data;
      } else {
        existingSubmissions.unshift(data); // Add to beginning if not found
      }
    } else {
      // New submission - add to beginning
      existingSubmissions.unshift(data);
    }

    localStorage.setItem('stage_submissions', JSON.stringify(existingSubmissions));
  };

  const CurrentStepComponent = steps[currentStep - 1].component;
  const isEditing = !!(formData as any)._editingProjectId;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl py-8">
        {/* Editing Banner */}
        {isEditing && (
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-4 mb-6 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✏️</span>
              <div>
                <div className="font-black text-lg">Editing Project: {formData.projectName || 'Untitled'}</div>
                <div className="text-blue-100 text-sm font-semibold">Changes will update your existing submission</div>
              </div>
            </div>
            <button
              onClick={() => router.push('/my-projects')}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-bold transition-all"
            >
              Cancel Edit
            </button>
          </div>
        )}

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <ProgressBar
            currentStep={currentStep}
            totalSteps={steps.length}
            steps={steps}
            onStepClick={handleStepClick}
          />
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <CurrentStepComponent
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onBack={handleBack}
            onSubmit={handleSubmit}
            onGoToStep={handleStepClick}
            isFirstStep={currentStep === 1}
            isLastStep={currentStep === steps.length}
          />
        </div>

        {/* Auto-save indicator */}
        <div className="mt-4 text-center text-sm text-gray-500">
          {autoSaveStatus === 'saving' && (
            <span className="flex items-center justify-center gap-2 text-blue-600">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Saving...
            </span>
          )}
          {autoSaveStatus === 'saved' && (
            <span className="text-green-600 flex items-center justify-center gap-2">
              ✓ Saved {lastSaved ? `at ${lastSaved.toLocaleTimeString()}` : ''}
            </span>
          )}
          {autoSaveStatus === 'idle' && lastSaved && (
            <span className="text-gray-400">
              💾 Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
          {!autoSaveStatus && (
            <span className="text-gray-400">💾 Auto-save enabled</span>
          )}
        </div>
      </div>

      {/* Success Modal - OTT Industry Standard */}
      {submitSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-black/90 via-gray-900/90 to-black/90 backdrop-blur-md">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-white/10">
            {/* Success Header */}
            <div className={`p-6 text-center ${isEditing ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500' : 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500'}`}>
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <span className="text-5xl">{isEditing ? '✏️' : '✓'}</span>
              </div>
              <h2 className="text-3xl font-black text-white mb-1">{isEditing ? 'Project Updated!' : 'Project Submitted!'}</h2>
              <p className="text-white/80 font-semibold text-sm">{isEditing ? 'Your changes have been saved' : 'Successfully sent for review'}</p>
            </div>

            {/* Project Info */}
            <div className="p-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-2xl font-black">
                    {(formData.projectName || 'U')[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-white">{formData.projectName || 'Untitled Project'}</h3>
                    <p className="text-gray-400 text-sm font-semibold">
                      {formData.format?.replace('-', ' ').toUpperCase() || 'Format'} • {formData.culture || 'Culture'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-bold text-sm">Submitted</div>
                    <div className="text-gray-500 text-xs">Just now</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-3 opacity-50">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-gray-400 text-sm">2</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-400 font-bold text-sm">Under Review</div>
                    <div className="text-gray-600 text-xs">24-48 hours</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 opacity-30">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 text-sm">3</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-500 font-bold text-sm">Decision</div>
                    <div className="text-gray-600 text-xs">You'll be notified</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/my-projects')}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-black rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
                >
                  <span>📂</span>
                  <span>View My Projects</span>
                  <span className="text-white/60">Edit & Manage</span>
                </button>
                <button
                  onClick={() => {
                    // Navigate to creator page with ?new=true to start completely fresh
                    router.push('/creator?new=true');
                  }}
                  className="w-full py-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-black rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
                >
                  <span>➕</span>
                  <span>Submit Another Project</span>
                </button>
                <button
                  onClick={() => router.push('/profile')}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-bold rounded-xl transition-all border border-white/10"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {submitError && (
        <div className="fixed bottom-4 right-4 z-50 bg-red-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
          <span className="text-xl">❌</span>
          <div>
            <div className="font-bold">Submission Failed</div>
            <div className="text-sm opacity-90">{submitError}</div>
          </div>
          <button onClick={() => setSubmitError(null)} className="ml-4 text-xl hover:opacity-75">×</button>
        </div>
      )}

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 text-center">
            <svg className="animate-spin h-12 w-12 mx-auto mb-4 text-red-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <div className="text-xl font-bold text-gray-900">Submitting Project...</div>
            <div className="text-gray-500 font-semibold mt-2">Please wait</div>
          </div>
        </div>
      )}
    </div>
  );
}
