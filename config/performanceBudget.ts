export type PerformanceBudget = {
  lcpMs: number;
  inpMs: number;
  cls: number;
  ttfbMs: number;
  fcpMs: number;
};

export const PERFORMANCE_BUDGET: PerformanceBudget = {
  lcpMs: 2500,
  inpMs: 200,
  cls: 0.1,
  ttfbMs: 800,
  fcpMs: 1800,
};

export const webVitalOverBudget = (name: string, value: number): boolean => {
  if (name === 'LCP') return value > PERFORMANCE_BUDGET.lcpMs;
  if (name === 'INP') return value > PERFORMANCE_BUDGET.inpMs;
  if (name === 'CLS') return value > PERFORMANCE_BUDGET.cls;
  if (name === 'TTFB') return value > PERFORMANCE_BUDGET.ttfbMs;
  if (name === 'FCP') return value > PERFORMANCE_BUDGET.fcpMs;
  return false;
};
