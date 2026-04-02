import fetch from 'node-fetch';

async function run() {
  const url = process.env.JOB_PROCESSOR_URL || 'http://localhost:3000/api/admin/jobs/process';

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`job queue failed ${res.status}: ${text}`);
    }

    const data = await res.json();
    console.log('Job queue processed:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Job queue run failed:', error);
    process.exit(1);
  }
}

run();
