import { getStore } from '@netlify/blobs';

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'Access-Control-Allow-Origin': '*',
};

export default async (request) => {
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), { status: 405, headers });
  }
  try {
    const url = new URL(request.url);
    const giftId = String(url.searchParams.get('id') || '').trim().toUpperCase();
    if (!giftId) {
      return new Response(JSON.stringify({ ok: false, error: 'Gift ID required' }), { status: 400, headers });
    }
    const store = getStore('eraberu-gifts');
    const data = await store.get(giftId, { type: 'json' });
    if (!data) {
      return new Response(JSON.stringify({ ok: false, error: 'Gift not found' }), { status: 404, headers });
    }
    const cardStore = getStore('eraberu-cards');
    const card = await cardStore.get(giftId, { type: 'json' }).catch(() => null);
    // Build invoice if address & selection exist
    let invoice = null;
    if (data.selectedItemId && data.recipientAddress) {
      const item = (data.items || []).find(i => i.id === data.selectedItemId);
      invoice = {
        item: item || null,
        address: data.recipientAddress,
        totalPrice: item?.price || 0,
        issuedAt: data.recipientAddress.submittedAt,
      };
    }
    return new Response(JSON.stringify({ ok: true, gift: data, card: card || null, invoice }), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500, headers });
  }
};
