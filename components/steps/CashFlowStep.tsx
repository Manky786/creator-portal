'use client';

import { useState, useEffect } from 'react';
import { BudgetFormData } from '@/types/budget';
import { amountInWords } from '@/utils/numberToWords';

interface Props {
  formData: Partial<BudgetFormData>;
  setFormData: (data: Partial<BudgetFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

interface PaymentTranche {
  id: string;
  name: string;
  description: string;
  percentage: number;
  amount: number;
  expectedDate: string;
  actualDate: string;
  status: 'pending' | 'in-progress' | 'completed';
}

type ProjectType = 'feature' | 'mini' | 'longSeries' | 'limitedSeries' | 'microdrama';

const projectTypes = {
  feature: 'Feature Film',
  mini: 'Mini Film',
  longSeries: 'Long Series',
  limitedSeries: 'Limited Series',
  microdrama: 'Microdrama',
};

// Default payment tranches for each project type
const defaultTranches: Record<ProjectType, Omit<PaymentTranche, 'id' | 'amount' | 'expectedDate' | 'actualDate'>[]> = {
  feature: [
    { name: 'Tranche 1 - Agreement Signing', description: 'Upon signing of the agreement. Payment released within 15 days of approved invoice.', percentage: 25, status: 'pending' },
    { name: 'Tranche 2 - Offline Edit Approval', description: 'Following the successful completion and approval of the offline edit. Payment released within 15 days of approved invoice.', percentage: 25, status: 'pending' },
    { name: 'Tranche 3 - Final Delivery & QC', description: 'After final Technical Check (TC), Quality Check (QC), and approval of all project deliverables. Payment released within 15 days of approved invoice.', percentage: 40, status: 'pending' },
    { name: 'Tranche 4 - Post-Delivery Payment', description: 'Payable 60 days after the final delivery, contingent upon the receipt of a duly approved invoice. Payment released within 15 days thereafter.', percentage: 10, status: 'pending' },
  ],
  mini: [
    { name: 'Tranche 1 - Agreement Signing', description: 'Upon signing of the agreement. Payment released within 15 days of approved invoice.', percentage: 25, status: 'pending' },
    { name: 'Tranche 2 - Offline Edit Approval', description: 'Following the successful completion and approval of the offline edit. Payment released within 15 days of approved invoice.', percentage: 25, status: 'pending' },
    { name: 'Tranche 3 - Final Delivery & QC', description: 'After final Technical Check (TC), Quality Check (QC), and approval of all project deliverables. Payment released within 15 days of approved invoice.', percentage: 40, status: 'pending' },
    { name: 'Tranche 4 - Post-Delivery Payment', description: 'Payable 60 days after the final delivery, contingent upon the receipt of a duly approved invoice. Payment released within 15 days thereafter.', percentage: 10, status: 'pending' },
  ],
  longSeries: [
    { name: 'Tranche 1 - Episodes 1-5 + Pre-Production', description: 'Payment for the initial five episodes, along with the one-time pre-production cost, will be processed after the creator agreement is signed and before the shoot begins.', percentage: 25, status: 'pending' },
    { name: 'Tranche 2 - Episodes 6-10', description: 'Payment will be disbursed upon delivery and successful technical compliance/quality control (TC/QC) of the first 10 episodes.', percentage: 20, status: 'pending' },
    { name: 'Tranche 3 - Episodes 11-15', description: 'Payment will be made after delivery and TC/QC approval of episodes 11-15.', percentage: 20, status: 'pending' },
    { name: 'Tranche 4 - Episodes 16-20', description: 'Payment will be made after delivery and TC/QC approval of episodes 16-20.', percentage: 20, status: 'pending' },
    { name: 'Tranche 5 - Episodes 21-26 (Final)', description: 'Payment for the concluding six episodes (episodes 21–26) will be rendered after delivery and successful TC/QC of all episodes.', percentage: 15, status: 'pending' },
  ],
  limitedSeries: [
    { name: 'Tranche 1 - Agreement Signing', description: 'Upon signing of the agreement. Payment released within 15 days of approved invoice.', percentage: 25, status: 'pending' },
    { name: 'Tranche 2 - Offline Edit Approval', description: 'Following the successful completion and approval of the offline edit. Payment released within 15 days of approved invoice.', percentage: 25, status: 'pending' },
    { name: 'Tranche 3 - Final Delivery & QC', description: 'After final Technical Check (TC), Quality Check (QC), and approval of all project deliverables. Payment released within 15 days of approved invoice.', percentage: 40, status: 'pending' },
    { name: 'Tranche 4 - Post-Delivery Payment', description: 'Payable 60 days after the final delivery, contingent upon the receipt of a duly approved invoice. Payment released within 15 days thereafter.', percentage: 10, status: 'pending' },
  ],
  microdrama: [
    { name: 'Tranche 1 - Agreement Signing', description: 'Due upon the signing of the agreement, against a duly approved invoice. Payment will be made within 15 days of the approved invoice date.', percentage: 50, status: 'pending' },
    { name: 'Tranche 2 - Final Deliverables', description: 'Due after the submission and approval of all final deliverables (TC, QC, and any other agreed-upon items), against a duly approved invoice. Payment will be processed within 15 days of the approved invoice date.', percentage: 50, status: 'pending' },
  ],
};

export default function CashFlowStep({ formData, setFormData, onNext, onBack }: Props) {
  // Auto-sync budget from Budget Step or use cashFlowTotalBudget
  const budgetFromBudgetStep = formData.estimatedBudget ? parseFloat(formData.estimatedBudget) : 0;
  const initialBudget = formData.cashFlowTotalBudget || budgetFromBudgetStep || 0;

  const [selectedProjectType, setSelectedProjectType] = useState<ProjectType>(
    (formData.cashFlowProjectType as ProjectType) || 'feature'
  );
  const [totalBudget, setTotalBudget] = useState<number>(initialBudget);
  const [tranches, setTranches] = useState<PaymentTranche[]>(
    formData.cashFlowTranches || generateDefaultTranches('feature', initialBudget)
  );
  const [isLocked, setIsLocked] = useState<boolean>(
    (formData as any).cashFlowIsLocked || false
  );

  const toggleLock = () => {
    const newLockedState = !isLocked;
    setIsLocked(newLockedState);
    setFormData({ ...formData, cashFlowIsLocked: newLockedState } as any);
  };

  // Auto-sync budget from Budget Step
  useEffect(() => {
    const budgetFromBudgetStep = formData.estimatedBudget ? parseFloat(formData.estimatedBudget) : 0;
    if (budgetFromBudgetStep > 0 && budgetFromBudgetStep !== totalBudget) {
      setTotalBudget(budgetFromBudgetStep);
      // Update tranches with new budget
      const updatedTranches = tranches.map(t => ({
        ...t,
        amount: Math.round((budgetFromBudgetStep * t.percentage) / 100),
      }));
      setTranches(updatedTranches);
      setFormData({
        ...formData,
        cashFlowTotalBudget: budgetFromBudgetStep,
        cashFlowTranches: updatedTranches,
      });
    }
  }, [formData.estimatedBudget]);

  // Hot reload fix: Sync with formData changes
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (formData.cashFlowProjectType && formData.cashFlowProjectType !== selectedProjectType) {
        setSelectedProjectType(formData.cashFlowProjectType as ProjectType);
      }
      if (formData.cashFlowTranches && formData.cashFlowTranches.length > 0) {
        setTranches(formData.cashFlowTranches as PaymentTranche[]);
      }
    }
  }, [formData.cashFlowProjectType, formData.cashFlowTranches]);

  function generateDefaultTranches(projectType: ProjectType, budget: number): PaymentTranche[] {
    return defaultTranches[projectType].map((t, index) => ({
      id: `${projectType}-${index + 1}`,
      name: t.name,
      description: t.description,
      percentage: t.percentage,
      amount: Math.round((budget * t.percentage) / 100),
      expectedDate: '',
      actualDate: '',
      status: t.status,
    }));
  }

  const handleProjectTypeChange = (type: ProjectType) => {
    setSelectedProjectType(type);
    const newTranches = generateDefaultTranches(type, totalBudget);
    setTranches(newTranches);
    setFormData({
      ...formData,
      cashFlowProjectType: type,
      cashFlowTranches: newTranches,
    } as any);
  };

  const handleBudgetChange = (budget: number) => {
    setTotalBudget(budget);
    const updatedTranches = tranches.map(t => ({
      ...t,
      amount: Math.round((budget * t.percentage) / 100),
    }));
    setTranches(updatedTranches);
    setFormData({
      ...formData,
      cashFlowTotalBudget: budget,
      cashFlowTranches: updatedTranches,
    });
  };

  const handleTrancheChange = (
    id: string,
    field: keyof PaymentTranche,
    value: string | number
  ) => {
    const updatedTranches = tranches.map(t => {
      if (t.id === id) {
        const updated = { ...t, [field]: value };

        // If percentage changes, recalculate amount
        if (field === 'percentage') {
          updated.amount = Math.round((totalBudget * (value as number)) / 100);
        }
        // If amount changes, recalculate percentage
        if (field === 'amount' && totalBudget > 0) {
          updated.percentage = parseFloat((((value as number) / totalBudget) * 100).toFixed(2));
        }

        return updated;
      }
      return t;
    });

    setTranches(updatedTranches);
    setFormData({ ...formData, cashFlowTranches: updatedTranches });
  };

  const addTranche = () => {
    const newTranche: PaymentTranche = {
      id: `custom-${Date.now()}`,
      name: 'Custom Milestone',
      description: '',
      percentage: 0,
      amount: 0,
      expectedDate: '',
      actualDate: '',
      status: 'pending',
    };
    const updatedTranches = [...tranches, newTranche];
    setTranches(updatedTranches);
    setFormData({ ...formData, cashFlowTranches: updatedTranches });
  };

  const removeTranche = (id: string) => {
    const updatedTranches = tranches.filter(t => t.id !== id);
    setTranches(updatedTranches);
    setFormData({ ...formData, cashFlowTranches: updatedTranches });
  };

  const getTotalPercentage = () => {
    return tranches.reduce((sum, t) => sum + t.percentage, 0);
  };

  const getTotalAmount = () => {
    return tranches.reduce((sum, t) => sum + t.amount, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateGST = (amount: number) => {
    return Math.round(amount * 0.18);
  };

  const calculateTotalWithGST = (amount: number) => {
    return amount + calculateGST(amount);
  };

  const totalPercentage = getTotalPercentage();
  const totalAmount = getTotalAmount();
  const totalGST = calculateGST(totalAmount);
  const totalWithGST = calculateTotalWithGST(totalAmount);
  const isBalanced = Math.abs(totalPercentage - 100) < 0.01;

  // Platform-level lock - Unlocked for creators to manage payment terms
  const isPlatformLocked = false; // Unlocked for creator control

  return (
    <div className="max-w-7xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-5xl font-black bg-gradient-to-r from-purple-700 via-pink-600 to-red-600 bg-clip-text text-transparent mb-4 tracking-tight">
          💰 Cash Flow & Payment Schedule
        </h2>
        <p className="text-gray-700 text-lg font-semibold">
          Manage your payment milestones and cash flow structure for the project
        </p>

        {/* Warning when no budget data */}
        {totalBudget === 0 && (
          <div className="mt-4 bg-gradient-to-r from-orange-50 via-yellow-50 to-orange-50 border-2 border-orange-400 rounded-xl p-4 flex items-start gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xl">⚠️</span>
            </div>
            <div>
              <h4 className="font-black text-orange-900 text-base mb-1">Budget Data Not Found</h4>
              <p className="text-sm font-semibold text-orange-800">
                Please fill the Budget Step first to see auto-calculated project cost and payment tranches.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Project Type & Budget Info */}
      <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 border-2 border-cyan-300 rounded-xl p-6 mb-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]" style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all">
            <span className="text-3xl">💼</span>
          </div>
          <div>
            <h3 className="text-2xl font-black bg-gradient-to-r from-cyan-700 to-blue-600 bg-clip-text text-transparent">
              Project Setup
            </h3>
            <p className="text-xs font-semibold text-cyan-700">Project type & auto-calculated total project cost</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Project Type */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
              📽️ Project Type
            </label>
            <select
              value={selectedProjectType}
              onChange={(e) => handleProjectTypeChange(e.target.value as ProjectType)}
              disabled={isPlatformLocked}
              className="w-full px-4 py-4 text-base font-black text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none bg-white hover:border-cyan-400 transition-colors shadow-sm hover:shadow-md appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23111827'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '1.5em 1.5em',
                color: '#111827'
              }}
            >
              <option value="feature" style={{ color: '#111827', fontWeight: '700' }}>Feature Film</option>
              <option value="mini" style={{ color: '#111827', fontWeight: '700' }}>Mini Film</option>
              <option value="longSeries" style={{ color: '#111827', fontWeight: '700' }}>Long Series</option>
              <option value="limitedSeries" style={{ color: '#111827', fontWeight: '700' }}>Limited Series</option>
              <option value="microdrama" style={{ color: '#111827', fontWeight: '700' }}>Microdrama</option>
            </select>
          </div>

          {/* Total Project Cost - Auto from Budget */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
              💰 Total Project Cost (₹)
            </label>
            {totalBudget > 0 ? (
              <>
                <div className="w-full px-4 py-4 text-base font-black text-green-900 border-2 border-green-500 rounded-lg bg-green-50 shadow-sm text-center">
                  ₹{totalBudget.toLocaleString('en-IN')}
                </div>
                <div className="text-sm font-semibold text-gray-700 mt-2 italic">
                  {amountInWords(totalBudget)}
                </div>
                <p className="text-xs text-green-700 font-bold mt-2 flex items-center gap-1">
                  <span>✅</span>
                  <span>Auto-calculated from Budget Step</span>
                </p>
              </>
            ) : (
              <>
                <div className="w-full px-4 py-4 text-base font-bold text-gray-500 border-2 border-gray-300 rounded-lg bg-gray-50 shadow-sm text-center">
                  ₹0
                </div>
                <p className="text-xs text-orange-700 font-bold mt-2 flex items-center gap-1">
                  <span>⚠️</span>
                  <span>Fill Budget Step to see project cost</span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Payment Terms Note - Feature Film & Mini Film - Dynamic from Table */}
      {(selectedProjectType === 'feature' || selectedProjectType === 'mini') && tranches.length > 0 && (
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-l-4 border-blue-600 p-4 mb-4 rounded-lg shadow-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="bg-blue-600 rounded-full p-1.5">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                <span>📋</span>
                <span>Payment Terms & Conditions</span>
              </h3>
              <div className="text-xs text-blue-900 space-y-1.5">
                <p className="font-bold text-blue-800">Payment Schedule:</p>
                <ul className="list-none space-y-1.5 ml-0">
                  {tranches.map((tranche, index) => (
                    <li key={tranche.id} className="flex items-start gap-2 bg-white p-2 rounded-md shadow-sm">
                      <span className="font-bold text-green-600 text-base">✓</span>
                      <span>
                        <strong className="text-purple-700">{tranche.percentage}%:</strong>{' '}
                        {tranche.description || tranche.name}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 font-bold bg-gradient-to-r from-blue-100 to-indigo-100 p-2 rounded-md border-2 border-blue-300 shadow-sm">
                  <p className="flex items-center gap-2 text-blue-900">
                    <span className="text-base">ℹ️</span>
                    <span>Payment within 15 days of approved invoice, subject to milestone completion.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Terms Note - Long Series - Dynamic from Table */}
      {selectedProjectType === 'longSeries' && tranches.length > 0 && (
        <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-l-4 border-green-600 p-4 mb-4 rounded-lg shadow-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="bg-green-600 rounded-full p-1.5">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-bold text-green-900 mb-2 flex items-center gap-2">
                <span>📋</span>
                <span>Payment Terms - Long Series</span>
              </h3>
              <div className="text-xs text-green-900 space-y-1.5">
                <p className="font-bold text-green-800">Payment Schedule:</p>
                <ul className="list-none space-y-1.5 ml-0">
                  {tranches.map((tranche, index) => (
                    <li key={tranche.id} className="flex items-start gap-2 bg-white p-2 rounded-md shadow-sm">
                      <span className="font-bold text-green-600 text-base">✓</span>
                      <span>
                        <strong className="text-emerald-700">{tranche.percentage}%:</strong>{' '}
                        {tranche.description || tranche.name}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 font-bold bg-gradient-to-r from-green-100 to-emerald-100 p-2 rounded-md border-2 border-green-300 shadow-sm">
                  <p className="flex items-center gap-2 text-green-900">
                    <span className="text-base">ℹ️</span>
                    <span>Payment after delivery and TC/QC approval of respective episodes.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Terms Note - Limited Series - Dynamic from Table */}
      {selectedProjectType === 'limitedSeries' && tranches.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 border-l-4 border-indigo-600 p-4 mb-4 rounded-lg shadow-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="bg-indigo-600 rounded-full p-1.5">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
                <span>📋</span>
                <span>Payment Terms - Limited Series</span>
              </h3>
              <div className="text-xs text-indigo-900 space-y-1.5">
                <p className="font-bold text-indigo-800">Payment Schedule:</p>
                <ul className="list-none space-y-1.5 ml-0">
                  {tranches.map((tranche, index) => (
                    <li key={tranche.id} className="flex items-start gap-2 bg-white p-2 rounded-md shadow-sm">
                      <span className="font-bold text-green-600 text-base">✓</span>
                      <span>
                        <strong className="text-blue-700">{tranche.percentage}%:</strong>{' '}
                        {tranche.description || tranche.name}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 font-bold bg-gradient-to-r from-indigo-100 to-blue-100 p-2 rounded-md border-2 border-indigo-300 shadow-sm">
                  <p className="flex items-center gap-2 text-indigo-900">
                    <span className="text-base">ℹ️</span>
                    <span>Payment within 15 days of approved invoice, subject to milestone completion.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Terms Note - Microdrama - Dynamic from Table */}
      {selectedProjectType === 'microdrama' && tranches.length > 0 && (
        <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 border-l-4 border-purple-600 p-4 mb-4 rounded-lg shadow-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="bg-purple-600 rounded-full p-1.5">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-bold text-purple-900 mb-2 flex items-center gap-2">
                <span>📋</span>
                <span>Payment Terms - Microdrama</span>
              </h3>
              <div className="text-xs text-purple-900 space-y-1.5">
                <p className="font-bold text-purple-800">Payment Schedule:</p>
                <ul className="list-none space-y-1.5 ml-0">
                  {tranches.map((tranche, index) => (
                    <li key={tranche.id} className="flex items-start gap-2 bg-white p-2 rounded-md shadow-sm">
                      <span className="font-bold text-green-600 text-base">✓</span>
                      <span>
                        <strong className="text-pink-700">{tranche.percentage}%:</strong>{' '}
                        {tranche.description || tranche.name}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 font-bold bg-gradient-to-r from-purple-100 to-pink-100 p-2 rounded-md border-2 border-purple-300 shadow-sm">
                  <p className="flex items-center gap-2 text-purple-900">
                    <span className="text-base">ℹ️</span>
                    <span>Payment subject to invoice approval and milestone completion.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Financial Summary */}
      <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-300 rounded-xl p-6 mb-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all">
            <span className="text-3xl">💵</span>
          </div>
          <div>
            <h3 className="text-2xl font-black bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
              Financial Summary
            </h3>
            <p className="text-xs font-semibold text-green-700">Total budget, percentages, and GST calculations</p>
          </div>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5" style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className={`p-6 rounded-xl shadow-2xl transform hover:scale-105 transition-all border-2 ${
          totalBudget > 0
            ? 'bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-800 border-blue-500'
            : 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 border-gray-500'
        } text-white`}>
          <div className="flex items-center gap-2 text-sm font-bold opacity-90 mb-2 tracking-wide">
            <span className="text-xl">💰</span>
            <span>Total Project Cost</span>
          </div>
          <div className="text-4xl font-black tracking-tight">
            {totalBudget > 0 ? formatCurrency(totalBudget) : '₹0'}
          </div>
          {totalBudget > 0 && (
            <div className="text-xs mt-1 font-semibold opacity-80 italic">
              {amountInWords(totalBudget)}
            </div>
          )}
          <div className="text-xs mt-2 font-bold opacity-90">
            {totalBudget > 0 ? 'Auto-synced from Budget' : 'Awaiting budget data'}
          </div>
        </div>
        <div className={`bg-gradient-to-br ${isBalanced ? 'from-green-700 via-green-800 to-emerald-800 border-green-500' : 'from-orange-700 via-orange-800 to-red-800 border-orange-500'} text-white p-6 rounded-xl shadow-2xl transform hover:scale-105 transition-all border-2`}>
          <div className="flex items-center gap-2 text-sm font-bold opacity-90 mb-2 tracking-wide">
            <span className="text-xl">📊</span>
            <span>Total Percentage</span>
          </div>
          <div className="text-4xl font-black tracking-tight">
            {totalPercentage.toFixed(1)}%
            {!isBalanced && <span className="text-xl ml-2">⚠️</span>}
          </div>
        </div>
        <div className="bg-gradient-to-br from-pink-700 via-red-700 to-orange-700 text-white p-6 rounded-xl shadow-2xl transform hover:scale-105 transition-all border-4 border-yellow-400">
          <div className="flex items-center gap-2 text-sm font-bold opacity-90 mb-2 tracking-wide">
            <span className="text-xl">🎯</span>
            <span>Final Amount (+ GST)</span>
          </div>
          <div className="text-4xl font-black tracking-tight">{formatCurrency(totalWithGST)}</div>
          <div className="text-xs mt-2 font-bold opacity-95">GST (18%): {formatCurrency(totalGST)}</div>
        </div>
      </div>
      </div>

      {!isBalanced && (
        <div className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 border-2 border-orange-400 rounded-xl p-6 mb-6 shadow-lg hover:shadow-xl transition-all" style={{ fontFamily: 'Inter, sans-serif' }}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-white text-3xl font-black">⚠️</span>
            </div>
            <div>
              <h4 className="font-black text-orange-900 text-xl mb-2 tracking-tight">Warning: Percentages don't add up to 100%</h4>
              <p className="text-base text-orange-900 font-semibold">
                Current total: <span className="text-red-800 font-black text-lg">{totalPercentage.toFixed(1)}%</span>. Please adjust percentages to equal 100%.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Tranches Table */}
      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 border-2 border-purple-300 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all">
            <span className="text-3xl">📊</span>
          </div>
          <div>
            <h3 className="text-2xl font-black bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
              Payment Milestones & Tranches
            </h3>
            <p className="text-xs font-semibold text-purple-700">Payment schedule with 18% GST included</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xl border-2 border-purple-300 overflow-hidden">

        <div className="overflow-visible">
          <table className="w-full table-auto border-collapse" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
            <colgroup>
              <col style={{ width: '4%' }} />
              <col style={{ width: '18%' }} />
              <col style={{ width: '28%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '6%' }} />
              <col style={{ width: '2%' }} />
            </colgroup>
            <thead className="bg-gradient-to-r from-purple-700 via-pink-600 to-red-600 border-b-4 border-yellow-400">
              <tr>
                <th className="px-2 py-3 text-center text-xs font-extrabold text-white uppercase tracking-wider">
                  #
                </th>
                <th className="px-2 py-3 text-left text-xs font-extrabold text-white uppercase tracking-wider">
                  📝 Milestone
                </th>
                <th className="px-2 py-3 text-left text-xs font-extrabold text-white uppercase tracking-wider">
                  📋 Description
                </th>
                <th className="px-2 py-3 text-center text-xs font-extrabold text-white uppercase tracking-wider">
                  📊 %
                </th>
                <th className="px-2 py-3 text-right text-xs font-extrabold text-white uppercase tracking-wider">
                  💵 Amount
                </th>
                <th className="px-2 py-3 text-right text-xs font-extrabold text-yellow-200 uppercase tracking-wider">
                  🎯 + GST
                </th>
                <th className="px-2 py-3 text-center text-xs font-extrabold text-white uppercase tracking-wider">
                  📅 Date
                </th>
                <th className="px-2 py-3 text-center text-xs font-extrabold text-white uppercase tracking-wider">
                  🚦
                </th>
                <th className="px-2 py-3 text-center text-xs font-extrabold text-white uppercase tracking-wider">
                  ⚙️
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-purple-300 bg-white">
              {tranches.map((tranche, index) => {
                const trancheWithGST = calculateTotalWithGST(tranche.amount);
                const trancheGST = calculateGST(tranche.amount);
                return (
                  <tr key={tranche.id} className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all border-b-2 border-purple-200">
                    <td className="px-1 py-2 text-base font-black text-white bg-gradient-to-br from-purple-700 to-purple-800 text-center">
                      {index + 1}
                    </td>
                    <td className="px-2 py-2 bg-gradient-to-br from-purple-100 to-purple-200">
                      <input
                        type="text"
                        value={tranche.name}
                        onChange={(e) => handleTrancheChange(tranche.id, 'name', e.target.value)}
                        disabled={isPlatformLocked}
                        className="w-full px-3 py-2 text-sm font-black tracking-tight text-purple-900 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                        style={{ fontFamily: '"SF Pro Display", "Helvetica Neue", Inter, -apple-system, sans-serif' }}
                      />
                    </td>
                    <td className="px-2 py-2 bg-gradient-to-br from-pink-100 to-red-100">
                      <textarea
                        value={tranche.description}
                        onChange={(e) => handleTrancheChange(tranche.id, 'description', e.target.value)}
                        disabled={isPlatformLocked}
                        rows={2}
                        className="w-full px-3 py-2 text-xs font-semibold leading-tight text-gray-800 border-2 border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none bg-white resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                        style={{ fontFamily: '"SF Pro Text", "Helvetica Neue", Inter, -apple-system, sans-serif' }}
                      />
                    </td>
                    <td className="px-2 py-2 bg-gradient-to-br from-blue-100 to-indigo-100 text-center">
                      <input
                        type="number"
                        value={tranche.percentage}
                        onChange={(e) => handleTrancheChange(tranche.id, 'percentage', parseFloat(e.target.value) || 0)}
                        disabled={isPlatformLocked}
                        step="0.1"
                        min="0"
                        max="100"
                        className="w-full px-2 py-2 text-lg font-black text-center text-blue-900 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                        style={{ fontFamily: '"SF Pro Display", Inter, -apple-system, sans-serif' }}
                      />
                    </td>
                    <td className="px-2 py-2 text-right bg-gradient-to-br from-green-100 to-emerald-100">
                      <input
                        type="number"
                        value={tranche.amount}
                        onChange={(e) => handleTrancheChange(tranche.id, 'amount', parseFloat(e.target.value) || 0)}
                        disabled={isPlatformLocked}
                        className="w-full px-2 py-2 text-sm font-black text-right text-green-900 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                        style={{ fontFamily: '"SF Pro Display", Inter, -apple-system, sans-serif' }}
                      />
                    </td>
                    <td className="px-2 py-2 text-right bg-gradient-to-br from-pink-200 to-red-200 border-l-4 border-pink-600">
                      <div className="bg-white px-2 py-2 rounded-lg shadow-lg border-2 border-pink-500">
                        <div className="font-black text-pink-900 text-sm tracking-tight" style={{ fontFamily: '"SF Pro Display", Inter, sans-serif' }}>
                          {formatCurrency(trancheWithGST)}
                        </div>
                        <div className="text-xs text-pink-800 font-bold mt-0.5">
                          +₹{trancheGST.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-2 bg-gradient-to-br from-orange-100 to-yellow-100">
                      <input
                        type="date"
                        value={tranche.expectedDate}
                        onChange={(e) => handleTrancheChange(tranche.id, 'expectedDate', e.target.value)}
                        disabled={isPlatformLocked}
                        className="w-full px-2 py-2 text-xs font-bold text-center text-orange-900 border-2 border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                        style={{ fontFamily: '"SF Pro Text", Inter, sans-serif' }}
                      />
                    </td>
                    <td className="px-1 py-2 bg-gradient-to-br from-indigo-100 to-purple-100">
                      <select
                        value={tranche.status}
                        onChange={(e) => handleTrancheChange(tranche.id, 'status', e.target.value)}
                        disabled={isPlatformLocked}
                        className="w-full px-2 py-2 text-xs font-bold text-indigo-900 border-2 border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                        style={{ fontFamily: '"SF Pro Text", Inter, sans-serif' }}
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="in-progress">🔄 Progress</option>
                        <option value="completed">✅ Done</option>
                      </select>
                    </td>
                    <td className="px-1 py-2 text-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <button
                        onClick={() => removeTranche(tranche.id)}
                        disabled={isPlatformLocked}
                        className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all shadow-md hover:shadow-lg hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
                        title="Delete milestone"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gradient-to-r from-yellow-500 via-orange-600 to-red-600 border-t-4 border-purple-800" style={{ fontFamily: 'Inter, sans-serif' }}>
              <tr>
                <td colSpan={3} className="px-2 py-3 text-sm font-black text-white uppercase tracking-wider">
                  💰 TOTAL PROJECT COST
                </td>
                <td className="px-2 py-3 text-center bg-blue-700">
                  <span className={`text-xl font-black ${isBalanced ? 'text-green-200' : 'text-red-200'}`}>
                    {totalPercentage.toFixed(1)}%
                  </span>
                </td>
                <td className="px-2 py-3 text-right bg-green-700">
                  <div className="text-base font-black text-white tracking-tight">
                    {formatCurrency(totalAmount)}
                  </div>
                  <div className="text-xs text-green-200 font-bold">
                    Base Amount
                  </div>
                </td>
                <td className="px-2 py-3 text-right bg-gradient-to-br from-pink-700 to-red-700 border-l-4 border-yellow-400">
                  <div className="text-lg font-black text-white tracking-tight">
                    {formatCurrency(totalWithGST)}
                  </div>
                  <div className="text-xs text-yellow-200 font-bold">
                    With 18% GST
                  </div>
                </td>
                <td colSpan={3} className="bg-gradient-to-r from-red-600 to-orange-600"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Add Milestone Button */}
        <div className="px-4 py-4 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-t-2 border-green-300">
          <div className="flex items-center justify-center">
            <button
              onClick={addTranche}
              disabled={isPlatformLocked}
              className="px-8 py-3 rounded-xl text-base font-black transition-all duration-200 flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-xl">➕</span>
              <span>Add Custom Milestone</span>
            </button>
          </div>
        </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between" style={{ fontFamily: 'Inter, sans-serif' }}>
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
