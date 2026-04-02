export type RetryOptions = {
  retries: number;
  minDelayMs: number;
  maxDelayMs: number;
  factor: number;
  jitter: boolean;
  shouldRetry?: (error: unknown) => boolean;
};

const defaultRetryOptions: RetryOptions = {
  retries: 3,
  minDelayMs: 300,
  maxDelayMs: 5000,
  factor: 2,
  jitter: true,
};

const sleep = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const computeDelay = (attempt: number, options: RetryOptions): number => {
  const raw = Math.min(options.maxDelayMs, options.minDelayMs * Math.pow(options.factor, attempt));
  if (!options.jitter) return raw;
  return Math.round(raw * (0.7 + Math.random() * 0.6));
};

export async function withRetry<T>(fn: () => Promise<T>, overrides: Partial<RetryOptions> = {}): Promise<T> {
  const options: RetryOptions = {
    ...defaultRetryOptions,
    ...overrides,
  };

  let lastError: unknown;

  for (let attempt = 0; attempt <= options.retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const retryable = options.shouldRetry ? options.shouldRetry(error) : true;
      if (!retryable || attempt === options.retries) {
        break;
      }

      await sleep(computeDelay(attempt, options));
    }
  }

  throw lastError;
}
