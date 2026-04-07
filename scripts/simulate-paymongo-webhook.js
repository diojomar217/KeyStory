#!/usr/bin/env node
// Protect against accidental execution in production environments
if (process.env.NODE_ENV === 'production') {
  console.error('Refusing to run webhook simulator in production (NODE_ENV=production)');
  process.exit(1);
}

(async function () {
  const fetchFn = globalThis.fetch || (await import('node-fetch')).then(m => m.default || m);
  const args = process.argv.slice(2);
  const url = args[0] || process.env.WEBHOOK_URL || 'http://localhost:3000/api/paymongo/webhook';
  const token = args[1] || process.env.PAYMONGO_WEBHOOK_TOKEN || '';
  const flowType = args[2] || process.env.FLOW_TYPE || 'create';
  const orderId = args[3] || process.env.ORDER_ID || '00000000-0000-0000-0000-000000000000';
  const slug = args[4] || process.env.SLUG || 'mock-site';
  const checkoutSessionId = args[5] || process.env.CHECKOUT_SESSION_ID || `mock_${Date.now()}`;

  // Envelope that mimics PayMongo webhook shape
  const envelope = {
    data: {
      attributes: {
        data: {
          id: checkoutSessionId,
          attributes: {
            id: checkoutSessionId,
            checkout_session_id: checkoutSessionId,
            metadata: { flowType, orderId, slug },
          },
        },
      },
    },
    type: 'checkout.sessions.updated',
    mockSession: {
      data: {
        attributes: {
          paid_at: new Date().toISOString(),
          payments: [],
          payment_intent: null,
          metadata: { flowType, orderId, slug },
        },
      },
    },
  };

  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['x-paymongo-webhook-token'] = token;

  console.log('Posting webhook to', url);
  try {
    const res = await fetchFn(url, { method: 'POST', headers, body: JSON.stringify(envelope) });
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
  } catch (err) {
    console.error('Request failed:', err);
    process.exit(1);
  }
})();
