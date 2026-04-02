import { supabase } from '@/lib/supabase';

export type JobType = 'retry_site_media_upload';

export type QueueJob = {
  id: string;
  job_type: JobType;
  payload: Record<string, unknown>;
  status: 'queued' | 'processing' | 'failed' | 'done';
  attempts: number;
  max_attempts: number;
  scheduled_at: string;
};

const nextBackoffSeconds = (attempt: number): number => Math.min(3600, Math.pow(2, Math.max(1, attempt)) * 15);

export async function enqueueJob(jobType: JobType, payload: Record<string, unknown>, maxAttempts = 5) {
  const { error } = await supabase.from('background_jobs').insert({
    job_type: jobType,
    payload,
    status: 'queued',
    attempts: 0,
    max_attempts: maxAttempts,
    scheduled_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(`enqueueJob failed: ${error.message}`);
  }
}

export async function claimDueJobs(limit = 20): Promise<QueueJob[]> {
  const nowIso = new Date().toISOString();

  const { data, error } = await supabase
    .from('background_jobs')
    .select('*')
    .in('status', ['queued', 'failed'])
    .lte('scheduled_at', nowIso)
    .order('scheduled_at', { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(`claimDueJobs read failed: ${error.message}`);
  }

  const jobs = (data || []) as QueueJob[];
  const claimed: QueueJob[] = [];

  for (const job of jobs) {
    const { data: updated, error: updateError } = await supabase
      .from('background_jobs')
      .update({ status: 'processing', updated_at: new Date().toISOString() })
      .eq('id', job.id)
      .in('status', ['queued', 'failed'])
      .select('*')
      .maybeSingle();

    if (!updateError && updated) {
      claimed.push(updated as QueueJob);
    }
  }

  return claimed;
}

export async function completeJob(id: string) {
  const { error } = await supabase
    .from('background_jobs')
    .update({ status: 'done', updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    throw new Error(`completeJob failed: ${error.message}`);
  }
}

export async function failJob(id: string, attempts: number, maxAttempts: number, errorMessage: string) {
  const nextAttempts = attempts + 1;
  const terminal = nextAttempts >= maxAttempts;
  const scheduledAt = new Date(Date.now() + nextBackoffSeconds(nextAttempts) * 1000).toISOString();

  const { error } = await supabase
    .from('background_jobs')
    .update({
      status: terminal ? 'failed' : 'queued',
      attempts: nextAttempts,
      last_error: errorMessage.slice(0, 1000),
      scheduled_at: terminal ? null : scheduledAt,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    throw new Error(`failJob failed: ${error.message}`);
  }
}
