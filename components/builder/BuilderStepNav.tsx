'use client';

import React from 'react';
import { BuilderStep } from '@/lib/types';
import { WIZARD_STEPS } from '@/config/wizardStepsConfig';

interface BuilderStepNavProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
}

export default function BuilderStepNav({ 
  currentStep, 
  completedSteps, 
  onStepClick 
}: BuilderStepNavProps) {
  const steps = WIZARD_STEPS;

  return (
    <nav className="space-y-1">
      {steps.map((step: any, index: number) => {
        const isActive = currentStep === step.id;
        const isCompleted = completedSteps.includes(step.id);
        const isClickable = step.id <= currentStep || completedSteps.includes(step.id - 1);
        
        return (
          <button
            key={step.id}
            type="button"
            onClick={() => isClickable && onStepClick(step.id)}
            disabled={!isClickable}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200
              ${isActive 
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md' 
                : isCompleted 
                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  : isClickable
                    ? 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                    : 'bg-slate-50 text-slate-400 cursor-not-allowed'
              }
            `}
          >
            {/* Step Number / Check Icon */}
            <div className={`
              flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold
              ${isActive 
                ? 'bg-white/20 text-white' 
                : isCompleted 
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-200 text-slate-500'
              }
            `}>
              {isCompleted ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.id
              )}
            </div>

            {/* Step Info */}
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-medium truncate ${isActive ? 'text-white' : ''}`}>
                {step.title}
              </div>
              <div className={`text-xs truncate ${isActive ? 'text-white/70' : 'text-slate-400'}`}>
                {step.subtitle}
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className={`
                absolute left-[22px] top-10 w-0.5 h-5 -z-10
                ${isCompleted ? 'bg-emerald-300' : 'bg-slate-200'}
              `} />
            )}
          </button>
        );
      })}
    </nav>
  );
}

