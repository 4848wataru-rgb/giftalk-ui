import { getStore } from '@netlify/blobs';

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'Access-Control-Allow-Origin': '*',
};

const STYLE_TONES = {
  celebrate: 'テンションが高く、お祝いムード全開で、明るく弾む文章で書いてください。',
  heartfelt: '静かで心に染みる、真心が伝わる温かい文章で書いてください。',
  gratitude: '感謝と敬意が伝わる、丁寧で温もりのある文章で書いてください。',
  casual: 'フランクで気軽、友達に話しかけるような自然な文章で書いてください。',
};

const buildMessagePrompt = (gift) => {
  const tone = STYLE_TONES[gift.presentationStyle] || STYLE_TONES.casual;
  return `
あなたはギフトの妖精「えらべる」です。贈り手の情報をもとに、受け取り手への日本語メッセージカードを書いてください。

贈り手: ${gift.senderName}
一言メッセージ: ${gift.occasionText || '（なし）'}
選んだギフト:
${gift.items.map(i => `・${i.name}「${i.comment || 'コメントなし'}」`).join('\n')}

文章のトーン: ${tone}

条件:
- 130〜170文字で書いてください
- 絵文字を2〜3個使う
- メッセージ本文のみ出力（前置き不要）
`.trim();
};

const buildImagePrompt = (gift) =>
  `A beautiful soft watercolor gift card illustration, warm pastel pink and orange tones, featuring ${gift.items.map(i => i.name).join(', ')}, Japanese aesthetic, cozy and heartfelt, bokeh light effects, no text, no letters`;

export default async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), { status: 405, headers });
  }

  try {
    const { giftId } = await request.json();
    const normalId = String(giftId || '').trim().toUpperCase();

    const giftStore = getStore('eraberu-gifts');
    const gift = await giftStore.get(normalId, { type: 'json' });
    if (!gift) {
      return new Response(JSON.stringify({ ok: false, error: 'Gift not found' }), { status: 404, headers });
    }

    let message = gift.occasionText || `${gift.senderName} さんからギフトが届いています！`;
    let imageUrl = null;

    // ── Text generation (Groq) ──
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey) {
      try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${groqKey}` },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: buildMessagePrompt(gift) }],
            max_tokens: 300,
            temperature: 0.85,
          }),
        });
        const data = await res.json();
        const raw = data.choices?.[0]?.message?.content?.trim();
        if (raw) message = raw;
      } catch (e) {
        console.warn('Groq error:', e.message);
      }
    }

    // ── Image generation (DALL-E 3, optional) ──
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      try {
        const res = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openaiKey}` },
          body: JSON.stringify({
            model: 'dall-e-3',
            prompt: buildImagePrompt(gift),
            n: 1,
            size: '1024x1024',
            quality: 'standard',
          }),
        });
        const data = await res.json();
        imageUrl = data.data?.[0]?.url || null;
      } catch (e) {
        console.warn('DALL-E error:', e.message);
      }
    }

    const card = { message, imageUrl, generatedAt: new Date().toISOString() };
    const cardStore = getStore('eraberu-cards');
    await cardStore.setJSON(normalId, card);

    return new Response(JSON.stringify({ ok: true, card }), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500, headers });
  }
};
