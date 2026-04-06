import fetch from 'node-fetch';

async function run() {
  const url = process.env.ORDER_CLEANUP_URL || 'http://localhost:3000/api/admin/orders/cleanup-stale';
  const staleMinutes = Number(process.env.PENDING_ORDER_ABANDON_MINUTES || '120');
  const secret = (process.env.ORDER_CLEANUP_SECRET || process.env.CRON_SECRET || '').trim();

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(secret ? { 'x-order-cleanup-secret': secret } : {}),
      },
      body: JSON.stringify({ staleMinutes }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`cleanup-stale-orders failed ${res.status}: ${text}`);
    }

    const data = await res.json();
    console.log('Cleanup stale orders executed:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Cleanup stale orders run failed:', err);
    process.exit(1);
  }
}

run();