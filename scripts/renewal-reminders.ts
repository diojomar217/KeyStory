import fetch from 'node-fetch';

async function run() {
  const url = process.env.RENEWAL_REMINDERS_URL || 'http://localhost:3000/api/admin/sites/renewal-reminders';
  const windowDays = Number(process.env.RENEWAL_REMINDERS_WINDOW_DAYS || '30');
  const limit = Number(process.env.RENEWAL_REMINDERS_LIMIT || '200');

  const query = new URLSearchParams({
    windowDays: String(windowDays),
    limit: String(limit),
  });

  try {
    const res = await fetch(`${url}?${query.toString()}`);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`renewal-reminders failed ${res.status}: ${text}`);
    }

    const data = await res.json();
    console.log('Renewal reminder candidates:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Renewal reminder run failed:', error);
    process.exit(1);
  }
}

run();
