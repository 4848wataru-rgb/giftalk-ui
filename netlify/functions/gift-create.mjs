import { getStore } from '@netlify/blobs';

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'Access-Control-Allow-Origin': '*',
};

const buildId = () =>
  'ER-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();

const safe = (v, n) => String(v || '').trim().slice(0, n);

export default async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), { status: 405, headers });
  }
  try {
    const body = await request.json();
    const { senderName, occasionText, items, presentationStyle } = body;

    if (!Array.isArray(items) || items.length < 1 || items.length > 3) {
      return new Response(JSON.stringify({ ok: false, error: 'items must be 1–3' }), { status: 400, headers });
    }

    const giftId = buildId();
    const gift = {
      giftId,
      senderName: safe(senderName, 20) || '名無し',
      occasionText: safe(occasionText, 300),
      items: items.map(item => ({
        id: safe(item.id, 64),
        emoji: safe(item.emoji, 10) || '🎁',
        name: safe(item.name, 50),
        brand: safe(item.brand, 50),
        price: Number(item.price) || 0,
        comment: safe(item.comment, 200),
      })),
      presentationStyle: ['celebrate','heartfelt','gratitude','casual'].includes(presentationStyle) ? presentationStyle : 'celebrate',
      selectedItemId: null,
      recipientMessage: null,
      createdAt: new Date().toISOString(),
    };

    const store = getStore('eraberu-gifts');
    await store.setJSON(giftId, gift);

    const origin = new URL(request.url).origin;
    return new Response(JSON.stringify({
      ok: true,
      giftId,
      shareUrl: `${origin}/?gift=${encodeURIComponent(giftId)}`,
    }), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500, headers });
  }
};
