'use client';

import React from 'react';

interface Step {
  num: number;
  title: string;
  subtitle: string;
}

interface EditStepNavProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
}

const STEPS: Step[] = [
  { num: 1, title: 'Info', subtitle: 'Update details' },
  { num: 2, title: 'Theme', subtitle: 'Style choices' },
  { num: 3, title: 'Sections', subtitle: 'Select sections' },
  { num: 4, title: 'Templates', subtitle: 'Design picks' },
  { num: 5, title: 'Content', subtitle: 'Fill in your sections' },
  { num: 6, title: 'Review', subtitle: 'Final check' }
];

export default function EditStepNav({ currentStep, completedSteps, onStepClick }: EditStepNavProps) {
  const isStepClickable = (stepNum: number) => stepNum <= currentStep || completedSteps.includes(stepNum - 1);
  const isStepActive = (stepNum: number) => stepNum === currentStep;
  const isStepCompleted = (stepNum: number) => completedSteps.includes(stepNum);

  // Calculate progress width for desktop (percentage based on currentStep)
  const progressWidth = ((Math.min(currentStep, 6) - 1) / 5) * 100;

  return (
    <div className="mb-6">
      {/* Mobile: Horizontal scroll */}
      <div className="lg:hidden overflow-x-auto pb-2 -mx-2 px-2">
        <div className="flex gap-2 min-w-max">
          {STEPS.map((step) => {
            const clickable = isStepClickable(step.num);
            const active = isStepActive(step.num);
            
            return (
              <button
                key={step.num}
                onClick={() => clickable && onStepClick(step.num)}
                disabled={!clickable}
                className={`
                  flex flex-col items-center justify-center p-3 rounded-xl border-2 min-w-[70px] transition-all duration-300
                  ${active 
                    ? 'border-rose-500 bg-rose-50 scale-105' 
                    : clickable && isStepCompleted(step.num)
                      ? 'border-emerald-400 bg-emerald-50'
                      : 'border-slate-200 bg-white opacity-60'
                  }
                `}
              >
                <div className={`
                  w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold mb-1 transition-all duration-300
                  ${active 
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-300/50' 
                    : isStepCompleted(step.num)
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-300/50'
                      : 'bg-slate-200 text-slate-500'
                  }
                `}>
                  {step.num}
                </div>
                <span className={`
                  text-xs font-medium transition-colors duration-300
                  ${active ? 'text-rose-600' : isStepCompleted(step.num) ? 'text-emerald-600' : 'text-slate-600'}
                `}>
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop: Progress bar */}
      <div className="hidden lg:flex items-center justify-between">
        {STEPS.map((step, index) => (
          <React.Fragment key={step.num}>
            <button
              onClick={() => isStepClickable(step.num) && onStepClick(step.num)}
              disabled={!isStepClickable(step.num)}
              className={`
                flex flex-col items-center relative z-10 group
                ${isStepClickable(step.num) ? 'cursor-pointer' : 'cursor-not-allowed'}
              `}
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-all duration-500
                ${isStepActive(step.num)
                  ? 'bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-300/50 scale-110'
                  : isStepCompleted(step.num)
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-300/50'
                    : 'bg-slate-200 text-slate-500 group-hover:bg-slate-300 group-hover:scale-105 transition-transform'
                }
              `}>
                {step.num}
              </div>
              <div className="text-center">
                <span className={`
                  text-sm font-semibold block transition-colors duration-300
                  ${isStepActive(step.num) ? 'text-rose-600' 
                    : isStepCompleted(step.num) ? 'text-emerald-600'
                    : 'text-slate-400 group-hover:text-slate-600'
                  }
                `}>
                  {step.title}
                </span>
                <span className={`
                  text-xs transition-colors duration-300
                  ${isStepActive(step.num) ? 'text-rose-400' 
                    : isStepCompleted(step.num) ? 'text-emerald-400'
                    : 'text-slate-400 group-hover:text-slate-500'
                  }
                `}>
                  {step.subtitle}
                </span>
              </div>
            </button>

            {/* Progress bar between steps */}
            {index < STEPS.length - 1 && (
              <div className="flex-1 mx-4 relative">
                <div className="h-1 bg-slate-200 rounded-full transition-colors duration-300"></div>
                <div 
                  className="h-1 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full absolute top-0 left-0 transition-all duration-700 ease-out"
                  style={{ width: `${progressWidth}%` }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

