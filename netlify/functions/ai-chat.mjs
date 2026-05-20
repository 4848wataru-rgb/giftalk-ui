const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'Access-Control-Allow-Origin': '*',
};

const PRODUCTS = [
  { id:'g1', name:'コーヒー豆セット',     price:2980, cat:'グルメ',   desc:'丁寧に焙煎した浅煎り豆2種セット',         scene:'お礼・誕生日',       target:'友人・同僚' },
  { id:'g2', name:'高級煎茶ギフト',       price:3500, cat:'グルメ',   desc:'京都老舗の上質な日本茶セット',             scene:'お礼・内祝い',       target:'両親・上司' },
  { id:'g3', name:'クラフトビール 6本',   price:3800, cat:'グルメ',   desc:'個性豊かな地ビールの飲み比べセット',       scene:'誕生日・内祝い',     target:'男性・友人' },
  { id:'g4', name:'ジャム＆ハニーセット', price:3200, cat:'グルメ',   desc:'上質なジャムと蜂蜜のギフトセット',         scene:'お礼・内祝い',       target:'女性・友人' },
  { id:'s1', name:'チョコレートアソート', price:3600, cat:'スイーツ', desc:'北海道の人気チョコレートセット',           scene:'誕生日・バレンタイン',target:'女性全般' },
  { id:'s2', name:'クッキーアソート缶',   price:4200, cat:'スイーツ', desc:'パリ老舗パティスリーのクッキー缶',         scene:'誕生日・内祝い',     target:'女性全般' },
  { id:'s3', name:'プリンセット 6個',     price:2800, cat:'スイーツ', desc:'濃厚でなめらかな神戸プリン6個入り',       scene:'お礼・手土産',       target:'全般' },
  { id:'s4', name:'和菓子詰合せ',         price:4500, cat:'スイーツ', desc:'老舗とらやの季節の和菓子セット',           scene:'内祝い・お礼',       target:'両親・上司' },
  { id:'c1', name:'ハンドクリームセット', price:4200, cat:'コスメ',   desc:'プロヴァンス産の香るハンドケアセット',     scene:'誕生日・内祝い',     target:'女性全般' },
  { id:'c2', name:'アロマキャンドル',     price:3800, cat:'コスメ',   desc:'心が落ち着く上質なアロマキャンドル',       scene:'誕生日・記念日',     target:'女性全般' },
  { id:'c3', name:'バスボムセット',       price:3500, cat:'コスメ',   desc:'カラフルで楽しいバスボム8個セット',         scene:'誕生日・お礼',       target:'女性全般' },
  { id:'z1', name:'レザーノートブック',   price:4800, cat:'雑貨',     desc:'本革の上質なノートブック A5サイズ',         scene:'誕生日・就職祝い',   target:'男女全般' },
  { id:'z2', name:'カラーソックスセット', price:2800, cat:'雑貨',     desc:'遊び心あるカラフルソックス3足セット',       scene:'誕生日・お礼',       target:'男女全般' },
  { id:'z3', name:'デザインカレンダー',   price:3200, cat:'雑貨',     desc:'おしゃれなデザインの卓上カレンダー',       scene:'年末・内祝い',       target:'男女全般' },
  { id:'e1', name:'カフェチケット 2枚組', price:3200, cat:'体験',     desc:'こだわりコーヒーを二人で楽しめる',         scene:'誕生日・お礼',       target:'友人・カップル' },
  { id:'e2', name:'温泉入浴チケット',     price:4500, cat:'体験',     desc:'都内で楽しめる温泉施設のチケット',         scene:'記念日・誕生日',     target:'カップル・友人' },
  { id:'e3', name:'レストランランチ券',   price:6000, cat:'体験',     desc:'人気レストランのランチ2名分チケット',       scene:'記念日・誕生日',     target:'カップル・両親' },
  { id:'f1', name:'プリザーブドフラワー', price:4500, cat:'フラワー', desc:'枯れないお花のギフトボックス',             scene:'誕生日・結婚祝い',   target:'女性全般' },
  { id:'f2', name:'季節の花束',           price:3500, cat:'フラワー', desc:'旬の花を使ったおしゃれな花束',             scene:'誕生日・発表会',     target:'女性全般' },
  { id:'f3', name:'グリーンプランツ',     price:3800, cat:'フラワー', desc:'インテリアになる観葉植物ギフト',           scene:'引越し祝い・誕生日', target:'男女全般' },
];

/* ── ローカルフォールバック（API key なし時） ── */
const localMatch = (messages) => {
  const text = messages.map(m => m.content).join(' ');
  const scores = {};
  PRODUCTS.forEach(p => { scores[p.id] = 0; });

  if (/誕生日/.test(text))      ['s1','s2','f1','c2','e1','e2'].forEach(id => { scores[id] += 3; });
  if (/お礼|感謝/.test(text))   ['g2','s4','f1','c1','e1'].forEach(id => { scores[id] += 3; });
  if (/引越/.test(text))         ['f3','z1','g4'].forEach(id => { scores[id] += 3; });
  if (/内祝い|結婚/.test(text))  ['s4','g2','f1','s2'].forEach(id => { scores[id] += 3; });
  if (/記念日/.test(text))       ['f1','c2','e2','e3'].forEach(id => { scores[id] += 3; });
  if (/手土産/.test(text))       ['g2','s3','s4'].forEach(id => { scores[id] += 3; });
  if (/就職|卒業/.test(text))    ['z1','e1','g1'].forEach(id => { scores[id] += 3; });

  if (/女性|彼女|母|ママ/.test(text))  ['c1','c2','c3','f1','f2','s1','s2'].forEach(id => { scores[id] += 2; });
  if (/男性|彼氏|父|パパ/.test(text))  ['g1','g3','z1','e2','e3'].forEach(id => { scores[id] += 2; });
  if (/上司|先輩/.test(text))          ['g2','s4','z1','e3'].forEach(id => { scores[id] += 2; });
  if (/友人|友達|同僚/.test(text))     ['g1','s1','z2','e1'].forEach(id => { scores[id] += 1; });
  if (/カップル|二人/.test(text))      ['e2','e3','f1','c2'].forEach(id => { scores[id] += 2; });

  if (/グルメ|食べ物|コーヒー|お茶/.test(text))  ['g1','g2','g3','g4'].forEach(id => { scores[id] += 2; });
  if (/スイーツ|お菓子|チョコ/.test(text))       ['s1','s2','s3','s4'].forEach(id => { scores[id] += 2; });
  if (/コスメ|美容|スキンケア/.test(text))       ['c1','c2','c3'].forEach(id => { scores[id] += 2; });
  if (/花|フラワー/.test(text))                  ['f1','f2','f3'].forEach(id => { scores[id] += 2; });
  if (/体験|チケット/.test(text))                ['e1','e2','e3'].forEach(id => { scores[id] += 2; });

  const budgetM = text.match(/(\d+)\s*円/);
  if (budgetM) {
    const b = parseInt(budgetM[1]);
    PRODUCTS.forEach(p => { if (p.price > b + 500) scores[p.id] -= 3; });
  }
  if (/3000/.test(text)) PRODUCTS.filter(p => p.price <= 3500).forEach(p => { scores[p.id] += 1; });
  if (/5000/.test(text)) PRODUCTS.filter(p => p.price <= 5000).forEach(p => { scores[p.id] += 1; });

  const recs = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .filter(([, s]) => s > 0)
    .slice(0, 3)
    .map(([id]) => id);

  if (recs.length === 0) {
    return {
      message: 'もう少し教えてください！\n「誰に」「どんなシーン」「予算」を教えてもらえると、ぴったりの候補を提案します。\n例）「30代の友人に、誕生日プレゼント、予算4000円くらい」',
      recommendations: [],
    };
  }

  const names = recs.map(id => {
    const p = PRODUCTS.find(x => x.id === id);
    return p ? `・${p.name}（¥${p.price.toLocaleString()}）— ${p.desc}` : '';
  }).filter(Boolean).join('\n');

  return {
    message: `キーワードから判断すると、こんなギフトがおすすめです！\n\n${names}\n\n「選ぶ」ボタンでギフト候補に追加できます✨\nもっと詳しく教えてもらえると、さらに絞り込めますよ。`,
    recommendations: recs,
  };
};

/* ── システムプロンプト ── */
const buildSystemPrompt = () => {
  const list = PRODUCTS.map(p =>
    `  [${p.id}] ${p.name} ¥${p.price.toLocaleString()} | ${p.cat} | ${p.desc} | シーン:${p.scene} | ${p.target}向け`
  ).join('\n');

  return `あなたは「えらべる」のギフト相談AI「Giftalk（ギフトーク）」です。
ユーザーが迷っているギフトを一緒に考え、最大3つの候補を提案する、温かく頼れるアシスタントです。

## キャラクター
- 親しみやすく、テンポよく、絵文字を適度に交える
- 押しつけがましくなく「一緒に考える」スタンス
- です・ます調で統一、敬語は自然な範囲で

## 会話の進め方
1. まず相手の状況や気持ちに共感する
2. 「誰に」「どんなシーン・目的」「予算」の3点が揃うまで自然に聞き出す（一度に全部聞かず、1〜2点ずつ）
3. 3点揃ったら、最大3つを自信をもって提案する
   - 商品名・価格を明記する
   - なぜその商品を選んだか理由を一言添える
   - えらべるの特徴「3つ全部選んで相手に好きなものを選んでもらう」方法も自然に紹介する
4. 提案後もフォローアップの質問で会話を続ける

## 取り扱い商品（提案はこの中からのみ行う）
${list}

## 返答形式（厳守）
必ず以下のJSON形式のみで返答してください。JSONの外に文字を出力しないこと：
{"message":"会話メッセージ（改行は\\nで表現）","recommendations":["商品ID","商品ID"]}

- 情報が不足している場合 → recommendations は [] にして質問する
- 提案できる場合 → recommendations に商品IDを最大3つ入れる（IDはリスト内の[id]の値のみ）
- 商品IDに存在しないIDを使わないこと`;
};

/* ── エントリーポイント ── */
export default async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), { status: 405, headers });
  }

  const apiKey = process.env.GROQ_API_KEY;

  try {
    const { messages } = await request.json();

    // API key なし → ローカルマッチングで対応
    if (!apiKey) {
      const result = localMatch(messages);
      return new Response(JSON.stringify({ ok: true, ...result }), { status: 200, headers });
    }

    // 直近10往復に制限してトークン超過を防ぐ
    const history = messages.slice(-20).map(m => ({ role: m.role, content: m.content }));

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 800,
        temperature: 0.75,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          ...history,
        ],
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Groq API error');

    const raw = data.choices?.[0]?.message?.content?.trim() || '';

    // JSON パース（複数フォールバック）
    let parsed = null;
    // 1. そのまま
    try { parsed = JSON.parse(raw); } catch (_) {}
    // 2. JSON ブロック抽出
    if (!parsed) {
      try {
        const m = raw.match(/\{[\s\S]*\}/);
        if (m) parsed = JSON.parse(m[0]);
      } catch (_) {}
    }
    // 3. どちらも失敗 → メッセージとして扱う
    if (!parsed) {
      parsed = { message: raw, recommendations: [] };
    }

    // 存在しない商品IDを除外
    const validIds = new Set(PRODUCTS.map(p => p.id));
    const recs = (parsed.recommendations || []).filter(id => validIds.has(id));

    return new Response(
      JSON.stringify({ ok: true, message: parsed.message || '', recommendations: recs }),
      { status: 200, headers }
    );
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500, headers });
  }
};
