import { getStore } from '@netlify/blobs';

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'Access-Control-Allow-Origin': '*',
};

const safe = (v, n) => String(v || '').trim().slice(0, n);

export default async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), { status: 405, headers });
  }
  try {
    const { giftId, address } = await request.json();

    const normalId = String(giftId || '').trim().toUpperCase();
    if (!/^[A-Z0-9-]{4,32}$/.test(normalId)) {
      return new Response(JSON.stringify({ ok: false, error: 'Invalid gift ID' }), { status: 400, headers });
    }

    const store = getStore('eraberu-gifts');
    const gift = await store.get(normalId, { type: 'json' });
    if (!gift) {
      return new Response(JSON.stringify({ ok: false, error: 'Gift not found' }), { status: 404, headers });
    }
    if (!gift.selectedItemId) {
      return new Response(JSON.stringify({ ok: false, error: 'No item selected yet' }), { status: 400, headers });
    }

    const normalizedAddress = {
      name:       safe(address?.name, 30),
      postalCode: safe(address?.postalCode, 10).replace(/[^0-9-]/g, ''),
      prefecture: safe(address?.prefecture, 10),
      address1:   safe(address?.address1, 80),
      address2:   safe(address?.address2, 80),
      phone:      safe(address?.phone, 15).replace(/[^0-9-]/g, ''),
      submittedAt: new Date().toISOString(),
    };

    const updated = { ...gift, recipientAddress: normalizedAddress };
    await store.setJSON(normalId, updated);

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500, headers });
  }
};
