import { getStore } from '@netlify/blobs';

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'Access-Control-Allow-Origin': '*',
};

export default async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), { status: 405, headers });
  }
  try {
    const { giftId, selectedItemId, recipientMessage } = await request.json();

    const normalId = String(giftId || '').trim().toUpperCase();
    if (!/^[A-Z0-9-]{4,32}$/.test(normalId)) {
      return new Response(JSON.stringify({ ok: false, error: 'Invalid gift ID' }), { status: 400, headers });
    }
    if (!selectedItemId) {
      return new Response(JSON.stringify({ ok: false, error: 'selectedItemId required' }), { status: 400, headers });
    }

    const store = getStore('eraberu-gifts');
    const gift = await store.get(normalId, { type: 'json' });
    if (!gift) {
      return new Response(JSON.stringify({ ok: false, error: 'Gift not found' }), { status: 404, headers });
    }
    if (gift.selectedItemId) {
      return new Response(JSON.stringify({ ok: false, error: 'Already selected' }), { status: 409, headers });
    }

    const updated = {
      ...gift,
      selectedItemId: String(selectedItemId).slice(0, 64),
      recipientMessage: String(recipientMessage || '').trim().slice(0, 200),
      selectedAt: new Date().toISOString(),
    };
    await store.setJSON(normalId, updated);

    const selected = gift.items.find(i => i.id === selectedItemId);
    return new Response(JSON.stringify({ ok: true, selected }), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500, headers });
  }
};
