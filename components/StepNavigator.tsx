'use client';
import React from 'react';

type Step = {
  id: number;
  title: string;
  subtitle: string;
};

const steps: Step[] = [
  { id: 1, title: 'Your Details', subtitle: 'Let\'s start' },
  { id: 2, title: 'Hero & Message', subtitle: 'Your love story' },
  { id: 3, title: 'Choose Style', subtitle: 'Pick the mood' },
  { id: 4, title: 'Page Layout', subtitle: 'Select sections' },
  { id: 5, title: 'Templates', subtitle: 'Design picks' },
  { id: 6, title: 'Memories', subtitle: 'Add moments' },
  { id: 7, title: 'Review', subtitle: 'Almost done!' },
];

type Props = {
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
};

export default function StepNavigator({ currentStep, completedSteps, onStepClick }: Props) {
  return (
    <div className="w-full mb-8">
      {/* Mobile: Horizontal scrollable */}
      <div className="lg:hidden overflow-x-auto pb-2 -mx-2 px-2">
        <div className="flex gap-2 min-w-max">
          {steps.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = completedSteps.includes(step.id);
            
            return (
              <button
                key={step.id}
                onClick={() => onStepClick(step.id)}
                disabled={step.id > currentStep && !completedSteps.includes(step.id - 1)}
                className={`
                  flex flex-col items-center justify-center p-3 rounded-xl border-2 min-w-[70px] transition-all duration-300
                  ${isActive 
                    ? 'border-rose-500 bg-rose-50 scale-105' 
                    : isCompleted 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-slate-200 bg-white opacity-60'
                  }
                `}
              >
                <div className={`
                  w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold mb-1 transition-all duration-300
                  ${isActive ? 'bg-rose-500 text-white shadow-lg shadow-rose-300/50' : isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}
                `}>
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                <span className={`text-xs font-medium transition-colors duration-300 ${isActive ? 'text-rose-600' : 'text-slate-600'}`}>
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop: Horizontal with lines */}
      <div className="hidden lg:flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = completedSteps.includes(step.id);
          const isClickable = step.id <= currentStep || completedSteps.includes(step.id - 1);
          
          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => isClickable && onStepClick(step.id)}
                disabled={!isClickable}
                className={`
                  flex flex-col items-center relative z-10 group
                  ${!isClickable ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-all duration-500
                  ${isActive 
                    ? 'bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-300/50 scale-110' 
                    : isCompleted 
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-300/50' 
                      : 'bg-slate-200 text-slate-500 group-hover:bg-slate-300 group-hover:scale-105 transition-transform'
                  }
                `}>
                  {isCompleted ? (
                    <svg className="w-5 h-5 animate-scale-in" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                <div className="text-center">
                  <span className={`text-sm font-semibold block transition-colors duration-300 ${isActive ? 'text-rose-600' : isCompleted ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                    {step.title}
                  </span>
                  <span className="text-xs text-slate-400 group-hover:text-slate-500 transition-colors duration-300">{step.subtitle}</span>
                </div>
              </button>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4 relative">
                  <div className="h-1 bg-slate-200 rounded-full transition-colors duration-300"></div>
                  <div 
                    className={`h-1 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full absolute top-0 left-0 transition-all duration-700 ease-out ${
                      isCompleted ? 'w-full' : 'w-0'
                    }`}
                  ></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export { steps };

