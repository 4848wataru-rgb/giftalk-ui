import { getStore } from '@netlify/blobs';

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'Access-Control-Allow-Origin': '*',
};

const genCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const seg = (n) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `ER-${seg(4)}-${seg(4)}`;
};

export default async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), { status: 405, headers });
  }
  try {
    const { trigger, sessionId } = await request.json();
    // trigger: 'share_sender' | 'share_recipient' | 'comment'

    const store = getStore('eraberu-coupons');
    const sid = String(sessionId || '').slice(0, 64);

    // Prevent duplicate issuance per session+trigger
    const key = `session_${sid}_${trigger}`;
    const existing = await store.get(key, { type: 'json' }).catch(() => null);
    if (existing) {
      return new Response(JSON.stringify({ ok: true, coupon: existing }), { status: 200, headers });
    }

    const coupon = {
      code: genCode(),
      discount: '10%OFF',
      trigger,
      validDays: 30,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      issuedAt: new Date().toISOString(),
    };

    await store.setJSON(key, coupon);
    return new Response(JSON.stringify({ ok: true, coupon }), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500, headers });
  }
};
