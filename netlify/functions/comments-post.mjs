import { getStore } from '@netlify/blobs';

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'Access-Control-Allow-Origin': '*',
};

const safe = (v, n) => String(v || '').trim().slice(0, n);
const VALID_SCENES = ['誕生日', 'お礼', '内祝い', '記念日', '引越し祝い', '手土産', 'その他'];
const VALID_AVATARS = ['😊','😄','🥰','😎','🤗','✨','🌸','☕','🎁','💪','👍','🙌'];

export default async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), { status: 405, headers });
  }
  try {
    const { productId, nickname, avatarEmoji, text, scene } = await request.json();

    const pid = safe(productId, 20);
    const nick = safe(nickname, 12) || '匿名';
    const avatar = VALID_AVATARS.includes(avatarEmoji) ? avatarEmoji : '😊';
    const txt = safe(text, 140);
    const scn = VALID_SCENES.includes(scene) ? scene : 'その他';

    if (!pid || !txt) {
      return new Response(JSON.stringify({ ok: false, error: 'productId and text required' }), { status: 400, headers });
    }

    const store = getStore('eraberu-comments');
    const existing = await store.get(`product_${pid}`, { type: 'json' }).catch(() => null) || [];

    const newComment = {
      id: 'CMT-' + Date.now().toString(36).toUpperCase(),
      productId: pid,
      nickname: nick,
      avatarEmoji: avatar,
      text: txt,
      scene: scn,
      helpful: 0,
      createdAt: new Date().toISOString(),
    };

    existing.unshift(newComment);
    await store.setJSON(`product_${pid}`, existing.slice(0, 200));

    return new Response(JSON.stringify({ ok: true, comment: newComment }), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500, headers });
  }
};
