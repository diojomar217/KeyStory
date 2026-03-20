import fetch from 'node-fetch';

async function run() {
  const url = process.env.AUTO_ARCHIVE_URL || 'http://localhost:3000/api/admin/sites/auto-archive';
  const graceDays = Number(process.env.AUTO_ARCHIVE_GRACE_DAYS || '7');

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ graceDays }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`auto-archive failed ${res.status}: ${text}`);
    }

    const data = await res.json();
    console.log('Auto archive executed:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Auto archive run failed:', err);
    process.exit(1);
  }
}

run();
