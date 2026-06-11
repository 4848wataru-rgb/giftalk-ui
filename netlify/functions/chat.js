/**
 * ================================================================
 * Netlify Function: chat.js
 * エンドポイント: /.netlify/functions/chat
 * ================================================================
 *
 * 【セットアップ手順】
 *
 * 1. Netlify ダッシュボードで環境変数を登録する
 *    Site settings → Environment variables → Add variable
 *    --------------------------------------------------
 *    キー名  : GROQ_API_KEY
 *    値      : gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *    --------------------------------------------------
 *    ※ APIキーはここのコードには絶対に書かないこと！
 *    ※ Groq APIキーは https://console.groq.com で無料取得できます
 *
 * 2. giftalk.html の AI_CONFIG を有効化する
 *    USE_AI_API: true  に変更
 *
 * 3. Netlifyにデプロイして動作確認
 *
 * ================================================================
 */

// ローカル開発時に .env を読み込む（Netlify本番では不要だが害はない）
try { require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') }); } catch(e) {}

exports.handler = async function(event, context) {

  // CORS ヘッダー（任意のオリジンから呼べるように設定）
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // プリフライトリクエスト対応
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // POST のみ受け付け
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  // ── 環境変数からAPIキーを取得 ──
  // Netlify ダッシュボードの Environment variables に
  // GROQ_API_KEY を設定してください（https://console.groq.com で無料取得）
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'APIキーが設定されていません。Netlifyの環境変数 GROQ_API_KEY を確認してください。'
      }),
    };
  }

  // ── リクエストボディのパース ──
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid JSON' }),
    };
  }

  const {
    model = 'llama-3.1-8b-instant',
    systemPrompt = '',
    messages = [],
    userMessage = '',
  } = body;

  // ── メッセージ構築 ──
  const chatMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.slice(-20), // 直近20件の会話履歴（トークン節約）
    { role: 'user', content: userMessage },
  ];

  // ── Groq API 呼び出し ──
  try {
    const openaiRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: chatMessages,
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    if (!openaiRes.ok) {
      const errData = await openaiRes.json();
      console.error('[chat.js] OpenAI API Error:', errData);
      return {
        statusCode: openaiRes.status,
        headers,
        body: JSON.stringify({
          error: errData.error?.message || 'OpenAI API Error',
        }),
      };
    }

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content || '';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply }),
    };

  } catch (err) {
    console.error('[chat.js] Fetch Error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal Server Error: ' + err.message }),
    };
  }
};
