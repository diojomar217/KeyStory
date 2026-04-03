import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequestAuthorized, unauthorizedAdminResponse } from '@/lib/api/admin-auth';
import { claimDueJobs, completeJob, failJob } from '@/lib/reliability/job-queue';
import { retrySiteMediaUpload } from '@/lib/reliability/upload-retry-jobs';
import { captureError } from '@/lib/reliability/monitoring';
import { recordAdminAudit } from '@/lib/reliability/audit';

export async function POST(req: NextRequest) {
  if (!isAdminRequestAuthorized(req)) {
    return unauthorizedAdminResponse();
  }

  try {
    const jobs = await claimDueJobs(25);
    const results: Array<{ id: string; status: 'done' | 'failed'; message?: string }> = [];

    for (const job of jobs) {
      try {
        if (job.job_type === 'retry_site_media_upload') {
          const siteId = String(job.payload.siteId || '');
          if (!siteId) {
            throw new Error('Missing siteId in payload');
          }

          const run = await retrySiteMediaUpload(siteId);
          await completeJob(job.id);
          results.push({ id: job.id, status: 'done', message: `updatedPhotos=${run.updatedPhotos}, updatedHero=${run.updatedHero}` });
          continue;
        }

        throw new Error(`Unsupported job type: ${job.job_type}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        await failJob(job.id, job.attempts, job.max_attempts, message);
        results.push({ id: job.id, status: 'failed', message });
      }
    }

    await recordAdminAudit(req, {
      action: 'jobs.process',
      targetType: 'background_jobs',
      success: true,
      details: { total: jobs.length, results },
    });

    return NextResponse.json({ success: true, total: jobs.length, results });
  } catch (error) {
    await captureError('admin-jobs-process', error);
    await recordAdminAudit(req, {
      action: 'jobs.process',
      targetType: 'background_jobs',
      success: false,
      details: { error: error instanceof Error ? error.message : String(error) },
    });

    return NextResponse.json({ success: false, message: 'Job processing failed' }, { status: 500 });
  }
}
