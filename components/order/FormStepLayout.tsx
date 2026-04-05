import { ReactNode } from 'react';

type FormStepLayoutProps = {
  title: string;
  description: string;
  step: number;
  totalSteps: number;
  children: ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
  isNextDisabled?: boolean;
  isSubmitting?: boolean;
};

export default function FormStepLayout({
  title,
  description,
  step,
  totalSteps,
  children,
  onBack,
  onNext,
  nextLabel = 'Next',
  backLabel = 'Back',
  isNextDisabled,
  isSubmitting,
}: FormStepLayoutProps) {
  return (
    <section className="rounded-3xl border border-[#0f172a]/10 bg-white p-6 shadow-[0_20px_60px_-42px_rgba(2,6,23,0.6)] md:p-8">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#64748b]">
          Step {step} of {totalSteps}
        </p>
        <h2 className="mt-2 text-2xl font-black text-[#0f172a] md:text-3xl">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#475569]">{description}</p>
      </div>

      <div className="space-y-4">{children}</div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={!onBack}
          className="rounded-full border border-[#0f172a]/20 px-5 py-2.5 text-sm font-semibold text-[#0f172a] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {backLabel}
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled || isSubmitting}
          className="rounded-full bg-[#0f172a] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#1e293b] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Submitting...' : nextLabel}
        </button>
      </div>
    </section>
  );
}
