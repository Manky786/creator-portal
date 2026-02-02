'use client';

import { useState } from 'react';
import { BudgetFormData } from '@/types/budget';
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

export default function BudgetWizard({ formData, setFormData }: Props) {
  const [currentStep, setCurrentStep] = useState(1);

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

  const handleSubmit = () => {
    // Handle final submission
    console.log('Submitting:', formData);
    alert('Budget submitted successfully! (This is a demo)');
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
          💾 Changes auto-saved
        </div>
      </div>
    </div>
  );
}
