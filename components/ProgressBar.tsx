interface Step {
  id: number;
  name: string;
}

interface Props {
  currentStep: number;
  totalSteps: number;
  steps: Step[];
  onStepClick?: (stepId: number) => void;
}

export default function ProgressBar({ currentStep, totalSteps, steps, onStepClick }: Props) {
  return (
    <div className="w-full bg-gradient-to-br from-white via-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 p-8 shadow-xl" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Title and subtitle */}
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-black bg-gradient-to-r from-purple-700 via-pink-600 to-red-600 bg-clip-text text-transparent mb-3 tracking-tight">
          {steps[currentStep - 1]?.name || 'Technical'}
        </h1>
        <p className="text-gray-700 text-lg font-semibold">
          Fill in the details below to complete your project onboarding. You can navigate to any section anytime.
        </p>
      </div>

      {/* Step indicators - horizontal scroll on mobile */}
      <div className="overflow-x-auto">
        <div className="flex items-start justify-center gap-4 min-w-max pb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center relative group">
              {/* Circle with number/check */}
              <div className="relative">
                <button
                  onClick={() => onStepClick?.(step.id)}
                  className={`w-16 h-16 rounded-full flex items-center justify-center font-black text-xl transition-all border-4 cursor-pointer relative overflow-hidden ${
                    step.id < currentStep
                      ? 'bg-gradient-to-br from-green-400 to-green-600 border-green-500 text-white hover:scale-110 shadow-lg hover:shadow-2xl'
                      : step.id === currentStep
                      ? 'bg-gradient-to-br from-red-500 via-pink-600 to-red-600 border-red-600 text-white ring-4 ring-red-200 shadow-2xl hover:scale-110 animate-pulse'
                      : 'bg-white border-gray-300 text-gray-400 hover:border-purple-400 hover:text-purple-600 hover:scale-105 shadow-md'
                  }`}
                  title={step.name}
                >
                  {step.id < currentStep ? (
                    <span className="text-3xl">✓</span>
                  ) : (
                    <span className="text-2xl font-black">{step.id}</span>
                  )}

                  {/* Shine effect for active step */}
                  {step.id === currentStep && (
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></span>
                  )}
                </button>

                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div className="absolute top-8 left-16 w-8 flex items-center">
                    <div
                      className={`h-1 w-full transition-all duration-500 ${
                        step.id < currentStep
                          ? 'bg-gradient-to-r from-green-500 to-red-500 shadow-md'
                          : 'bg-gray-300'
                      }`}
                    />
                  </div>
                )}
              </div>

              {/* Step name */}
              <span
                className={`text-sm mt-3 text-center font-bold min-w-[80px] transition-all ${
                  step.id === currentStep
                    ? 'text-red-600 scale-110'
                    : step.id < currentStep
                    ? 'text-green-700'
                    : 'text-gray-500'
                }`}
              >
                {step.name}
              </span>

              {/* Hover tooltip */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10 shadow-xl">
                {step.id < currentStep ? '✓ Completed' : step.id === currentStep ? 'Current Step' : 'Click to jump'}
                <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gray-900"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress percentage */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg border-2 border-purple-200">
          <span className="text-sm font-bold text-gray-600">Progress:</span>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-500 rounded-full"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
            <span className="text-lg font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {Math.round((currentStep / totalSteps) * 100)}%
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
