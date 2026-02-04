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

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
  };

  const handleSubmit = async () => {
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
        const submissionData = {
          ...formData,
          id: `project_${Date.now()}`,
          submitted_at: new Date().toISOString(),
          status: 'pending_review',
        };
        saveToLocalSubmissions(submissionData);
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

  const saveToLocalSubmissions = (data: any) => {
    const existingSubmissions = JSON.parse(localStorage.getItem('stage_submissions') || '[]');
    existingSubmissions.push(data);
    localStorage.setItem('stage_submissions', JSON.stringify(existingSubmissions));
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl py-8">
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

      {/* Success Modal */}
      {submitSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Submission Successful!</h2>
            <p className="text-gray-600 font-semibold mb-6">
              Your project "{formData.projectName || 'Untitled'}" has been submitted for review.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <p className="text-green-800 font-semibold text-sm">
                Our team will review your submission and get back to you within 24-48 hours.
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/profile')}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => {
                  setSubmitSuccess(false);
                  router.push('/creator');
                }}
                className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all"
              >
                Submit Another Project
              </button>
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
