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
    const productId = String(url.searchParams.get('id') || '').trim().slice(0, 20);
    if (!productId) {
      return new Response(JSON.stringify({ ok: false, error: 'id required' }), { status: 400, headers });
    }
    const store = getStore('eraberu-comments');
    const data = await store.get(`product_${productId}`, { type: 'json' }).catch(() => null) || [];
    const sorted = [...data].sort((a, b) => b.helpful - a.helpful);
    return new Response(JSON.stringify({ ok: true, comments: sorted }), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500, headers });
  }
};
