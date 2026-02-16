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
  const [creatorComment, setCreatorComment] = useState('');
  const [showCommentModal, setShowCommentModal] = useState(false);

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

    // If editing, show comment modal first
    const editingId = (formData as any)._editingProjectId;
    if (editingId && !showCommentModal) {
      setShowCommentModal(true);
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

        // Prepare submission data matching Supabase table schema
        const submissionData = {
          project_name: formData.projectName || '',
          creator_name: formData.creatorName || '',
          creator_email: user?.email || formData.officialEmail || 'anonymous',
          phone: formData.phone || '',
          culture: formData.culture || '',
          format: formData.format || '',
          budget: parseFloat(String(formData.totalBudget || 0).replace(/[^\d.]/g, '')) || 0,
          form_data: formData, // Store complete form data as JSONB
          status: 'pending_review',
        };

        // Try to save to Supabase Project submissions table
        const { error } = await supabase
          .from('Project submissions')
          .insert([submissionData]);

        if (error) {
          console.warn('Supabase save failed, using local storage:', error);
          // Fall back to localStorage
          const localData = {
            ...formData,
            submitted_at: new Date().toISOString(),
            status: 'pending_review',
          };
          saveToLocalSubmissions(localData, undefined, creatorComment);
        }
      } else {
        // No Supabase - save to localStorage submissions
        const submissionData = {
          ...formData,
          id: editingId || `project_${Date.now()}`,
          submitted_at: new Date().toISOString(),
          updated_at: editingId ? new Date().toISOString() : undefined,
          status: editingId ? (formData as any).status || 'pending_review' : 'pending_review',
        };
        // Remove internal fields
        delete (submissionData as any)._editingProjectId;
        delete (submissionData as any)._lastSaved;
        delete (submissionData as any)._started;

        saveToLocalSubmissions(submissionData, editingId, creatorComment);
      }

      // Clear the draft and comment
      onClearDraft?.();
      setCreatorComment('');
      setShowCommentModal(false);

      // Show success
      setSubmitSuccess(true);

    } catch (error: any) {
      console.error('Submit error:', error);
      setSubmitError(error.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveToLocalSubmissions = (data: any, editingId?: string, comment?: string) => {
    const existingSubmissions = JSON.parse(localStorage.getItem('stage_submissions') || '[]');

    if (editingId) {
      // Update existing submission - track changes
      const index = existingSubmissions.findIndex((s: any) => s.id === editingId);
      if (index !== -1) {
        const oldData = existingSubmissions[index];
        const changes = detectChanges(oldData, data);

        // Group changes by department for summary
        const changesByDept: Record<string, number> = {};
        for (const change of changes) {
          const dept = change.department || 'Other';
          changesByDept[dept] = (changesByDept[dept] || 0) + 1;
        }
        const deptSummary = Object.entries(changesByDept)
          .map(([dept, count]) => `${dept}: ${count}`)
          .join(', ');

        // Add change history to submission
        const changeHistory = oldData.changeHistory || [];
        if (changes.length > 0 || comment) {
          changeHistory.push({
            id: `change_${Date.now()}`,
            timestamp: new Date().toISOString(),
            changedBy: 'creator',
            changes: changes,
            changesByDepartment: changesByDept,
            creatorComment: comment || null,
            summary: changes.length > 0
              ? `Creator updated ${changes.length} field${changes.length > 1 ? 's' : ''} (${deptSummary})`
              : 'Creator resubmitted with comments'
          });
        }

        existingSubmissions[index] = { ...data, changeHistory };

        // Create notification for admin about creator changes
        if (changes.length > 0 || comment) {
          createAdminNotification(data, changes, comment);
        }
      } else {
        existingSubmissions.unshift(data);
      }
    } else {
      // New submission - add to beginning
      existingSubmissions.unshift(data);

      // Create notification for admin about new submission
      createNewSubmissionNotification(data);
    }

    localStorage.setItem('stage_submissions', JSON.stringify(existingSubmissions));
  };

  // Detect what fields changed between old and new data - with department-wise tracking
  const detectChanges = (oldData: any, newData: any): Array<{field: string, oldValue: any, newValue: any, label: string, department?: string, category?: string}> => {
    const changes: Array<{field: string, oldValue: any, newValue: any, label: string, department?: string, category?: string}> = [];

    // Field labels with department categorization
    const fieldConfig: Record<string, { label: string, department: string, category: string }> = {
      // Project Information
      projectName: { label: 'Project Name', department: 'Project Info', category: 'basic' },
      productionCompany: { label: 'Production Company', department: 'Project Info', category: 'basic' },
      culture: { label: 'Culture', department: 'Project Info', category: 'basic' },
      format: { label: 'Format', department: 'Project Info', category: 'basic' },
      genre: { label: 'Genre', department: 'Project Info', category: 'basic' },
      subGenre: { label: 'Sub-Genre', department: 'Project Info', category: 'basic' },
      logline: { label: 'Logline', department: 'Project Info', category: 'content' },
      synopsis: { label: 'Synopsis', department: 'Project Info', category: 'content' },
      targetAudience: { label: 'Target Audience', department: 'Project Info', category: 'content' },

      // Budget & Finance
      estimatedBudget: { label: 'Total Budget', department: 'Budget & Finance', category: 'finance' },

      // Timeline
      totalDuration: { label: 'Total Duration', department: 'Timeline', category: 'schedule' },
      shootDays: { label: 'Shoot Days', department: 'Timeline', category: 'schedule' },
      shootStartDate: { label: 'Shoot Start Date', department: 'Timeline', category: 'schedule' },
      shootEndDate: { label: 'Shoot End Date', department: 'Timeline', category: 'schedule' },
      finalDeliveryDate: { label: 'Final Delivery Date', department: 'Timeline', category: 'schedule' },

      // Creator Details
      creatorName: { label: 'Creator Name', department: 'Creator Details', category: 'creator' },
      officialEmail: { label: 'Email', department: 'Creator Details', category: 'creator' },
      phone: { label: 'Phone', department: 'Creator Details', category: 'creator' },

      // Crew - Direction
      director: { label: 'Director', department: 'Crew - Direction', category: 'crew' },
      associateDirector: { label: 'Associate Director', department: 'Crew - Direction', category: 'crew' },
      assistantDirector1: { label: 'Assistant Director', department: 'Crew - Direction', category: 'crew' },

      // Crew - Camera
      dop: { label: 'DOP', department: 'Crew - Camera', category: 'crew' },
      firstCameraOperator: { label: 'First Camera Operator', department: 'Crew - Camera', category: 'crew' },
      steadicamOperator: { label: 'Steadicam Operator', department: 'Crew - Camera', category: 'crew' },

      // Crew - Post Production
      editor: { label: 'Editor', department: 'Crew - Post Production', category: 'crew' },
      colorist: { label: 'Colorist', department: 'Crew - Post Production', category: 'crew' },
      vfxSupervisor: { label: 'VFX Supervisor', department: 'Crew - Post Production', category: 'crew' },

      // Crew - Sound & Music
      soundRecordist: { label: 'Sound Recordist', department: 'Crew - Sound', category: 'crew' },
      soundDesigner: { label: 'Sound Designer', department: 'Crew - Sound', category: 'crew' },
      musicComposer: { label: 'Music Composer', department: 'Crew - Music', category: 'crew' },
      bgmComposer: { label: 'BGM Composer', department: 'Crew - Music', category: 'crew' },

      // Crew - Production
      executiveProducer: { label: 'Executive Producer', department: 'Crew - Production', category: 'crew' },
      lineProducer: { label: 'Line Producer', department: 'Crew - Production', category: 'crew' },

      // Crew - Art & Design
      productionDesigner: { label: 'Production Designer', department: 'Crew - Art', category: 'crew' },
      artDirector: { label: 'Art Director', department: 'Crew - Art', category: 'crew' },
      costumeDesigner: { label: 'Costume Designer', department: 'Crew - Costume', category: 'crew' },

      // Crew - Writing
      writer: { label: 'Writer', department: 'Crew - Writing', category: 'crew' },
      screenplayBy: { label: 'Screenplay By', department: 'Crew - Writing', category: 'crew' },
      dialoguesBy: { label: 'Dialogues By', department: 'Crew - Writing', category: 'crew' },
    };

    const fieldsToTrack = Object.keys(fieldConfig);

    // Track basic field changes
    for (const field of fieldsToTrack) {
      const oldVal = oldData[field];
      const newVal = newData[field];
      const config = fieldConfig[field];

      // Simple comparison for strings/numbers
      if (typeof oldVal !== 'object' && typeof newVal !== 'object') {
        if (String(oldVal || '') !== String(newVal || '') && (oldVal || newVal)) {
          changes.push({
            field,
            oldValue: oldVal || '(empty)',
            newValue: newVal || '(empty)',
            label: config.label,
            department: config.department,
            category: config.category
          });
        }
      }
    }

    // Track department-wise budget breakdown changes
    if (oldData.budgetBreakdown && newData.budgetBreakdown) {
      const oldBudget = oldData.budgetBreakdown;
      const newBudget = newData.budgetBreakdown;

      // Create a map of old budget items by category
      const oldBudgetMap = new Map(oldBudget.map((item: any) => [item.category, item]));

      // Compare each category
      for (const newItem of newBudget) {
        const oldItem = oldBudgetMap.get(newItem.category) as any;

        if (oldItem) {
          // Check if amount changed
          if (Number(oldItem.amount || 0) !== Number(newItem.amount || 0)) {
            const oldAmount = Number(oldItem.amount || 0);
            const newAmount = Number(newItem.amount || 0);
            const difference = newAmount - oldAmount;
            const changeType = difference > 0 ? 'increased' : 'decreased';

            changes.push({
              field: `budget_${newItem.category.toLowerCase().replace(/\s+/g, '_')}`,
              oldValue: `Rs. ${oldAmount.toLocaleString('en-IN')}`,
              newValue: `Rs. ${newAmount.toLocaleString('en-IN')} (${changeType} by Rs. ${Math.abs(difference).toLocaleString('en-IN')})`,
              label: `${newItem.category} Budget`,
              department: 'Budget & Finance',
              category: 'budget_breakdown'
            });
          }

          // Check if percentage changed
          if (Number(oldItem.percentage || 0) !== Number(newItem.percentage || 0)) {
            changes.push({
              field: `budget_percent_${newItem.category.toLowerCase().replace(/\s+/g, '_')}`,
              oldValue: `${oldItem.percentage}%`,
              newValue: `${newItem.percentage}%`,
              label: `${newItem.category} Allocation`,
              department: 'Budget & Finance',
              category: 'budget_breakdown'
            });
          }
        } else {
          // New category added
          changes.push({
            field: `budget_new_${newItem.category.toLowerCase().replace(/\s+/g, '_')}`,
            oldValue: '(not set)',
            newValue: `Rs. ${Number(newItem.amount || 0).toLocaleString('en-IN')} (${newItem.percentage}%)`,
            label: `${newItem.category} Budget (New)`,
            department: 'Budget & Finance',
            category: 'budget_breakdown'
          });
        }
      }
    }

    return changes;
  };

  // Create notification for admin when creator makes changes
  const createAdminNotification = (data: any, changes: Array<{field: string, oldValue: any, newValue: any, label: string, department?: string, category?: string}>, creatorComment?: string) => {
    // Group changes by department
    const changesByDepartment: Record<string, typeof changes> = {};
    for (const change of changes) {
      const dept = change.department || 'Other';
      if (!changesByDepartment[dept]) {
        changesByDepartment[dept] = [];
      }
      changesByDepartment[dept].push(change);
    }

    // Create summary of departments affected
    const departmentsAffected = Object.keys(changesByDepartment);
    const summary = departmentsAffected.length > 2
      ? `${departmentsAffected.slice(0, 2).join(', ')} and ${departmentsAffected.length - 2} more`
      : departmentsAffected.join(', ');

    const notification = {
      id: `admin_notif_${Date.now()}_${data.id}`,
      type: 'creator_edit',
      projectId: data.id,
      projectName: data.projectName || 'Untitled Project',
      creatorName: data.creatorName || 'Creator',
      creatorEmail: data.officialEmail || '',
      message: `✏️ Creator updated "${data.projectName}" - ${changes.length} change${changes.length > 1 ? 's' : ''} in ${summary}`,
      changes: changes,
      changesByDepartment: changesByDepartment,
      departmentsAffected: departmentsAffected,
      creatorComment: creatorComment || null,
      timestamp: new Date().toISOString(),
      read: false,
    };

    const existingNotifications = JSON.parse(localStorage.getItem('stage_admin_notifications') || '[]');
    localStorage.setItem('stage_admin_notifications', JSON.stringify([notification, ...existingNotifications]));

    // Also add to project's communication log
    const commLog = JSON.parse(localStorage.getItem('stage_project_communications') || '{}');
    if (!commLog[data.id]) {
      commLog[data.id] = [];
    }
    commLog[data.id].unshift({
      id: `comm_${Date.now()}`,
      type: 'creator_update',
      from: 'creator',
      projectId: data.id,
      changes: changes,
      changesByDepartment: changesByDepartment,
      message: creatorComment || `Updated ${changes.length} field${changes.length > 1 ? 's' : ''}`,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('stage_project_communications', JSON.stringify(commLog));
  };

  // Create notification for admin about new submission
  const createNewSubmissionNotification = (data: any) => {
    const notification = {
      id: `admin_notif_${Date.now()}_${data.id}`,
      type: 'new_submission',
      projectId: data.id,
      projectName: data.projectName || 'Untitled Project',
      creatorEmail: data.officialEmail || '',
      culture: data.culture,
      format: data.format,
      budget: data.estimatedBudget,
      message: `🆕 New project submitted: "${data.projectName}" by ${data.creatorName || 'Creator'}`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    const existingNotifications = JSON.parse(localStorage.getItem('stage_admin_notifications') || '[]');
    localStorage.setItem('stage_admin_notifications', JSON.stringify([notification, ...existingNotifications]));
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

      {/* Creator Comment Modal - For resubmissions */}
      {showCommentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
                <div>
                  <h3 className="text-xl font-black">Add Update Note</h3>
                  <p className="text-blue-100 text-sm font-semibold">Describe changes made to this project</p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  What changes did you make? (Optional)
                </label>
                <textarea
                  value={creatorComment}
                  onChange={(e) => setCreatorComment(e.target.value)}
                  placeholder="e.g., Updated budget allocation as per feedback, Changed shoot dates, Added new crew members..."
                  className="w-full h-32 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none text-gray-900 font-medium"
                />
                <p className="text-xs text-gray-500 mt-2">
                  This note will be visible to the admin team and helps them understand your updates.
                </p>
              </div>

              {/* Project being updated */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-black">
                    {(formData.projectName || 'U')[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{formData.projectName || 'Untitled Project'}</div>
                    <div className="text-sm text-gray-500">{formData.format} - {formData.culture}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCommentModal(false);
                    setCreatorComment('');
                  }}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSubmit()}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>Submit Update</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
