# 🎁 OKURIATO — 気持ちを、ギフトに変えよう

## プロジェクト概要

**OKURIATO** は、**感情起点のギフト体験**を提供する次世代ギフトサービスです。  
「応援」「感謝」「労い」などの感情を選ぶだけでギフトを提案し、アバター演出で気持ちを届け、受け取り手がリアクションを返せる双方向ギフトプラットフォームです。

---

## 🚀 機能一覧（実装済み）

### 🏠 LP（index.html）
- ✅ フルスクリーン LP（サービス紹介・特徴・課題解決・フロー・ユーザーボイス）
- ✅ LP内CTAボタン（ギフトを贈る / もらった画面を見る / みんなの投稿 / AIに相談）
- ✅ 感情バブルクリックでgift.htmlへ直接遷移（URLパラメータ付き）
- ✅ ヘッダー固定・スクロールで背景変化
- ✅ **スマホ向けハンバーガーメニュー**（`lp-hamburger` / `lp-drawer`）— 767px以下でナビゲーションをドロワーに収納（`lpToggleDrawer()` / `lpCloseDrawer()`）

### 🎁 ギフト選択（gift.html）
- ✅ **気持ちから選ぶタブ**：7感情選択（応援/感謝/労い/下心/裏心/義務感/自己満足）→ 単品ギフト提案 + 3択セット提案
- ✅ **全ギフトから選ぶタブ**：単品ブラウズ（カテゴリ・価格帯・検索）+ セット一覧ブラウズ
- ✅ URLパラメータ（?emotion=xxx）で感情プリセット
- ✅ カート機能・複数ギフト追加対応
- ✅ オリジナル3択セットビルダー
- ✅ **アバター確認モーダル** — カートから進む際にアバターON/OFFを選択
  - ON → avatar.html（アバター作成）
  - OFF → message-simple.html（アバターなし版）
- ✅ 商品写真クロップ表示（background-position CSS技法）
- ~~旅（Journey）機能~~ → **完全削除済み**

### 🤖 Giftalk AIチャット（giftalk.html）
- ✅ **5段階チャットフロー**（気持ち→相手・状況→予算→深掘り→提案）
- ✅ ステップ進捗バー表示（どのフェーズかリアルタイム確認）
- ✅ 収集した情報をコンテキストバーに表示
- ✅ クイック返信チップ（各フェーズに応じて変化）
- ✅ 単品ギフト＋3択セットを同時提案
- ✅ 「他のも見せて」「もっと安いもの」など追加深掘り対応
- ✅ チャット内ギフトカードからアバター作成へ直接遷移
- ✅ **チャット精度大幅向上（最新改善）**
  - `EMOTION_MAP` 拡充：長フレーズ優先マッチで誤検出防止（「応援したい」→「応援」より優先）
  - `TARGET_MAP` 拡充：「親友」「幼なじみ」「両親」「お父さん」「同期」等詳細追加
  - `OCCASION_MAP` 拡充：「誕生日プレゼント」「結婚記念日」「バースデイ」等より自然な表現追加
  - `PREF_MAP` 精度向上：より自然な表現でのキーワードマッチ
  - `extractAllInfo()` 新設：1回の発言から感情・相手・シーン・予算・好みを**同時抽出**
  - `calcNextPhase()` 新設：取得済み情報に基づきフェーズを自動スキップ
  - **フェーズスキップ対応**：「友達の誕生日に感謝5000円で」→ 感情/相手/シーン/予算を一度に取得し深掘りへ直行
  - `TARGET_GIFT_BONUS` 新設：相手別ギフトスコアボーナス（友人/恋人/上司/家族/同僚）
  - `OCCASION_GIFT_BONUS` 新設：シーン別ギフトスコアボーナス（誕生日/退職/結婚/出産/母の日等12種）
  - `buildSuggestions()` 複合スコア化：感情×相手×シーン×好み×プレミアム/カジュアルの多次元スコアリング
  - セット提案もシーン・相手に応じたスコアリングに対応
  - `isSkipIntent()` / `isNoBudget()` 新設：正規表現による意図検出
  - `processMessage()` 全面刷新：フェーズをまたいだ先読み情報活用
  - `handlePostProposal()` 強化：「おしゃれ系に変えて」「食べ物系にして」等の好み変更コマンド追加
  - `QR_VALUE_MAP` 新設：クイックリプライボタンの表示ラベルと送信値を分離し検出精度向上
  - quickbar チップも送信値最適化（絵文字プレフィックスなしで正確な検出）
  - `buildProposalResponse()` 強化：感情・相手・シーン・予算を組み合わせた文脈ある提案文生成
  - `afterRefine1` / `afterRefine2` に分割（深掘り2ターン化）
  - `resetConv()` 新設：「最初からやり直す」でフル状態リセット
  - `buildProposalResponse()` 強化：3パターンintro・予算・シーン情報を文中に表示
  - `handlePostProposal()` 大幅拡張：セット専用/単品専用コマンド・代替プール再提案
  - `updateQuickBar()` 全フェーズ（Phase0〜5）のチップ刷新
  - クイックリプライ・ギフトカード・クイックバーを `onclick` → `data-*` + `addEventListener` 方式に変換（XSS安全）
  - セットギフトIDを固定値 `'set'` → 実際の `s.id`（`'s1'`〜`'s8'`）に変更

### 👤 アバター作成（avatar.html）
- ✅ アバターカスタマイズ（肌・髪型・髪色・目・アクセサリー・服装）
- ✅ 表情選択（うれしい/愛してる/感謝/クール/感激/恥ずかしい/お祝い/応援）
- ✅ モーション選択（ジャンプ/手を振る/くるくる/ドキドキ/やったー/静止）
- ✅ アバターのリアルタイムプレビュー（Canvas描画 200×240px）
- ✅ 過去アバター再利用
- ✅ **高品質Canvas描画エンジン v2**（2025-05 刷新）
  - **髪型**：3層グラデーション（`mHairGrd`ヘルパー）+ tapered毛束 + スカルプハイライト（short/long/wavy/bun/hat 全5種）
  - **目**：虹彩3層放射グラデーション + 瞳孔 + キャッチライト2点 + まぶた折り目 + lashDataカーブまつ毛（happy三日月/loveハートグラデーション/coolアビエーターサングラス/normal・sparkle・sleepy 全対応）
  - **アクセサリー**：べっ甲メガネ（グラデーション+ドット模様+湾曲ブリッジ）/ リボン（ベジェ翼+テールループ+球状ノット）/ 8枚花弁（放射グラデーション+しべドット）/ イヤリング（4ストップグラデーション+ドロップ）
  - **服装**：casual（リブ編みネック+ポケットステッチ）/ formal（プラケット+カラー+タイストライプ）/ dress（スウィートハートネック+ウエストリボン+レースヘム）/ yukata（斜め地模様+左前衿+多ストップ帯+帯留+花柄）
- ✅ **アニメキャラクタースタイル v3**（2025-05 刷新）
  - **頭部**：`bezierCurveTo` による逆三角形シルエット（広い額・細い顎）+ ほっぺブラッシュ（radialGradient, opacity 0.13）。顎シャドウ・ソケットシャドウを完全削除
  - **耳**：グラデーション・内耳ディテールを廃止 → シンプルな単色楕円
  - **眉毛**：6点 quadraticCurveTo アーチ（`[x1,y1, cx,cy, x2,y2]`）lineWidth=2.2 の細めシャープライン
  - **鼻**：鼻翼・鼻孔を廃止 → `quadraticCurveTo` 1本の極小曲線のみ（lineWidth=1.5）
  - **目（normal/sparkle）**：eyeR=9（従来7.5→大型化）、irisR=eyeR×0.76 の大虹彩、瞳孔=irisR×0.42、キャッチライト=irisR×0.28、太いアッパーラッシュバー（lineWidth=3.2）、まぶた折り目ライン廃止
  - **目（happy/celebrate/cheer/excited）**：塗りつぶし三日月シェイプ（`#1a1a1a` fill）+ 内部shine
  - **目（sleepy）**：eyeR=7、肌色楕円で上半分を覆う半開き + lineWidth=2.8 アウトライン

### 🎭 アバター管理（avatars.html）← NEW
- ✅ 保存済みアバターの一覧表示（Canvasリアルタイムアニメーション付き）
- ✅ 新しいアバターをストックに保存（肌/髪型/髪色/目/アクセサリー/服装/表情/モーション）
- ✅ 既存アバターの編集（全項目変更可能）
- ✅ アバターの削除（確認ダイアログ付き）
- ✅ 「使う」ボタンでsessionStorageにセット→自動でgift.htmlへ遷移
- ✅ スケルトンローディング・空のエンプティステート
- ✅ index.html / avatar.html トップナビにリンク追加

### 📝 メッセージ・決済（checkout.html）※アバターあり版
- ✅ アバター作成後のメッセージ入力・決済
- ✅ アバターミニプレビュー（Canvas）
- ✅ 決済モック（クレジット/PayPay/LINE Pay/コンビニ）
- ✅ ギフトURL発行・LINE/メール/コピーで共有（`receive.html` へ）
- ~~journey_enabled / gift_journey orderPayload~~ → **完全削除済み**

### ✉️ メッセージ入力（message-simple.html）★NEW（アバターなし版）
- ✅ ステップバー（ギフト選択→**メッセージ**→確認・送信）
- ✅ 送り手・受け取り手お名前入力
- ✅ メッセージテキストエリア（300文字）
- ✅ クイックメッセージチップ（6種）
- ✅ 入力内容を `sessionStorage` に保存 → `checkout-simple.html` へ遷移

### 💳 確認・お支払い（checkout-simple.html）★NEW（アバターなし版）
- ✅ ステップバー（ギフト選択→メッセージ→**確認・送信**）
- ✅ 内容確認（ギフト・送り手・受け取り手・メッセージ全文）
- ✅ 決済モック（クレジット/PayPay/LINE Pay/コンビニ）
- ✅ `orders` テーブルへ保存（`simple_mode:1`、`avatar_data:'{}'`）
- ✅ ギフトURL発行（`receive-simple.html?id=xxx`）・LINE/メール/コピーで共有

### 🎁 受け取り手ページ（receive.html）※アバターあり版
- ✅ 星空演出オープニング
- ✅ ギフトボックスタップで開封体験
- ✅ アバターモーション付き登場・メッセージ表示
- ✅ **セットギフト3択選択UI** — 3枚カードから受け取り手が1つを選択
- ✅ 絵文字リアクション（6種）・テキスト返信
- ✅ **🎴 ギフトカードを作って投稿する**
  - **BABYMONSTERポスタースタイル** 9:14縦型カード
  - **6テーマ** Canvas背景グラデーション
- ✅ **高品質Canvas描画エンジン v2（avatar.htmlと同期済み）**
  - `mDrawHairBack/mDrawHairFront`：mHairGrdヘルパー + tapered毛束 + 放射グラデーション団子 + 帽子クラウン/バンド/バッジ
  - `mDrawEye`ヘルパー：虹彩3層グラデーション + lashDataカーブまつ毛
  - `mDrawEyes`：happy/love/cool/normal/sparkle/sleepy 全対応（mDrawHeartPath追加）
  - `mDrawAccessory`：べっ甲メガネ/リボン球状ノット/8枚花弁
  - `mDrawEarrings`：4ストップグラデーションスタッド+ドロップ+スペキュラー
  - `mDrawBody` outfit詳細：casual/formal/dress/yukata 各高品質版
- ✅ **アニメキャラクタースタイル v3（avatar.htmlと同期済み）**（2025-05 刷新）
  - **`mDrawHead()`**：ベジェパス逆三角形（MCX/MHR=52 スケール対応）+ ほっぺブラッシュ、顎シャドウ・ソケットシャドウ完全削除
  - **`mDrawEars()`**：グラデーション・内耳廃止 → シンプル単色楕円
  - **`mDrawEyebrows()`**：6点アーチ lineWidth=2.6
  - **`mDrawEye()`**：eyeR=11（normal）、irisR=eyeR×0.76 大虹彩、太いアッパーラッシュバー（lineWidth=3.8）、まぶた折り目ライン廃止
  - **`mDrawEyes()`**：happy 塗りつぶし三日月・sleepy 半被覆楕円・love mDrawHeartPath グラデーションハート・全表情アニメスタイル対応
  - **`mDrawNose()`**：`quadraticCurveTo` 極小曲線（lineWidth=1.8）、鼻翼・鼻孔廃止
- ~~旅ボタン #journeyBtnWrap・旅モーダル（Canvas Videoエンジン）~~ → **完全削除済み**

### 🎁 受け取り手ページ（receive-simple.html）★NEW（アバターなし版）
- ✅ 星空演出オープニング（receive.htmlと同じ演出）
- ✅ ギフトボックスタップで開封体験
- ✅ アバターなし — ギフト絵文字大表示 + テキストメッセージカード
- ✅ セットギフト3択選択UI（receive.htmlと同等）
- ✅ 絵文字リアクション（6種）・テキスト返信
- ✅ リアクション送信後にギフトを贈るリンク表示

### 📊 リアクション確認（reactions.html）
- ✅ 送ったギフト一覧・ステータス表示
- ✅ リアクション確認・統計
- ✅ 自動リフレッシュ（15秒ごと）

### 📸 コミュニティ SNS（community.html）
- ✅ ギフト受け取り体験の投稿・閲覧
- ✅ 新着順・人気順・感情タグ別フィルター
- ✅ いいね機能（ローカルセッション対応）
- ✅ 新規投稿モーダル（ニックネーム・ギフト・感情タグ・本文）
- ✅ サンプル投稿8件（初期データ）
- ✅ **ポスタースタイルカード表示** — `card_theme` フィールドがある投稿はBABYMONSTERスタイルの縦型ポスターカードで表示（Canvas背景グラデーション）
- ✅ **匿名バッジ** — `is_anonymous=1` の投稿に「🫥 匿名」バッジを表示
- ✅ `comment` / `message` フィールド両対応（後方互換）

---

## 📂 ファイル構成

```
index.html             — LP（ランディングページ）※サービス紹介専用
gift.html              — ギフト選択（感情タブ + 全ギフトタブ）
avatar.html            — アバター作成・編集（アバターありルート）
checkout.html          — メッセージ・決済・URL発行（アバターありルート）
message-simple.html    ★ メッセージ入力（アバターなしルート）
checkout-simple.html   ★ 確認・決済・URL発行（アバターなしルート）
receive.html           — 受け取り手用演出ページ（アバターありルート）
receive-simple.html    ★ 受け取り手用ページ（アバターなしルート）
reactions.html         — リアクション確認（送り手用）
giftalk.html           — AIギフト相談チャット（Giftalk・5段階フロー）
community.html         — ギフト体験投稿・SNS閲覧
csv/style.css          — 共通スタイル
css/style.css          — 共通スタイル
README.md              — このファイル
```

---

## 🔗 ページ遷移フロー

### 送り手フロー（アバターあり）
```
index.html（LP）→ gift.html（感情・ギフト選択）
  ↓ カートへ追加 → アバター確認モーダル（ON）
avatar.html（アバター作成）
  ↓
checkout.html（メッセージ → 決済 → URL発行）
  ↓
receive.html?id={orderId}（受け取り手）
```

### 送り手フロー（アバターなし）★NEW
```
gift.html（感情・ギフト選択）
  ↓ カートへ追加 → アバター確認モーダル（OFF）
message-simple.html（お名前 + メッセージ入力）
  ↓
checkout-simple.html（内容確認 → 決済 → URL発行）
  ↓
receive-simple.html?id={orderId}（受け取り手・アバターなし）
```

### 受け取り手フロー（アバターあり）
```
receive.html?id={orderId}
  ↓ 星空演出 → タップで開封
  ↓ アバター演出 → メッセージ確認
  ↓ リアクション送信
```

### 受け取り手フロー（アバターなし）★NEW
```
receive-simple.html?id={orderId}
  ↓ 星空演出 → タップで開封
  ↓ ギフト絵文字大表示 + テキストメッセージカード
  ↓ リアクション送信
```

### Giftalk フロー
```
giftalk.html → AIとフリーチャット → ギフトカード提案
  ↓ アバター確認モーダル（ON）→ avatar.html
  ↓ アバター確認モーダル（OFF）→ message-simple.html
```

---

## 🗄️ データモデル

### gift_posts（コミュニティ投稿）
| フィールド | 型 | 説明 |
|---|---|---|
| id | text | 投稿ID |
| poster_name | text | 投稿者名 |
| poster_emoji | text | アバター絵文字 |
| gift_name | text | もらったギフト名 |
| gift_emoji | text | ギフト絵文字 |
| gift_price | number | ギフト価格 |
| message | rich_text | 投稿本文（旧フィールド・後方互換） |
| comment | rich_text | 投稿コメント（新フィールド） |
| sender_relation | text | 贈り手との関係 |
| sender_name | text | 贈り手の名前 |
| order_id | text | 注文ID（ordersテーブル参照） |
| is_anonymous | number | 匿名フラグ（0=公開/1=匿名） |
| card_theme | text | カードテーマID（aurora/sunset/ocean/forest/night/gold） |
| card_image | rich_text | カード画像base64 PNG（先頭8000文字） |
| emotion_tag | text | 感情タグ |
| image_emoji | text | イメージ絵文字 |
| likes | number | いいね数 |
| liked_by | text | いいねしたユーザーID（カンマ区切り） |

### orders（注文情報）
| フィールド | 型 | 説明 |
|---|---|---|
| id | text | 注文ID（`order_TIMESTAMP_RANDOM`） |
| sender_name | text | 送り手名 |
| recipient_name | text | 受け取り手名 |
| gift_id | text | ギフトID |
| gift_name | text | ギフト名 |
| gift_emoji | text | ギフト絵文字 |
| gift_price | number | ギフト価格 |
| gift_is_set | number | セットギフトフラグ（0/1） |
| gift_set_items | text | セットアイテム配列（JSON文字列） |
| journey_enabled | number | 旅記録を受け取り手に届けるか（0=OFF/1=ON・Round 10追加） |
| gift_journey | rich_text | 送り手のギフト選び旅ログ（JSON文字列・Round 9追加） |
| chosen_item_name | text | 受け取り手が選んだアイテム名 |
| chosen_item_emoji | text | 受け取り手が選んだアイテム絵文字 |
| chosen_item_index | number | 受け取り手が選んだアイテムのインデックス |
| avatar_data | text | アバター設定JSON |
| expression | text | アバター表情 |
| motion | text | アバターモーション |
| message | text | メッセージ |
| status | text | 状態（pending/opened/chosen/reacted） |

### avatars / reactions（既存テーブル）
- アバター情報・リアクション情報の保存に使用

---

## 🎭 感情タグ一覧

| ID | ラベル | 説明 |
|---|---|---|
| cheer | 応援 | 頑張っている人への応援ギフト |
| thanks | 感謝 | お礼の気持ちを伝えるギフト |
| care | 労い | 疲れを癒やすリラックスギフト |
| hidden | 下心 | ちょっとドキドキするギフト |
| secret | 裏心 | 何かを狙っているギフト |
| duty | 義務感 | 気持ちより義理のギフト |
| self | 自己満足 | 自分が選びたいから贈るギフト |
| other | その他 | 気分で選ぶランダムギフト |

---

## 🔧 技術スタック

- **HTML5 / CSS3 / Vanilla JavaScript**（フレームワークなし）
- **Canvas API**（アバター描画・アニメーション・ギフトカード背景生成）
- **RESTful Table API**（データ永続化）
- **Google Fonts**（Noto Sans JP / Nunito）
- **Font Awesome**（アイコン）
- **CSS Custom Properties**（デザイントークン）
- **インラインSVG**（Okuri-Bit/Giftalkロゴを各ページにインライン埋め込み・色制御）

### ブランドロゴ実装方針
| ロゴ | フォント/スタイル | 色 | 実装方式 |
|---|---|---|---|
| Okuri-Bit ワードマーク | スラブセリフ系太字（Rockwell/Georgia代替） | 背景に応じて白/ピンク | インラインSVG `<text>` |
| Okuri-Bit アイコン（OB） | 角丸四角+OBモノグラム | 背景に応じて白 | インラインSVG |
| Giftalk ロゴ | ギフト箱アイコン＋太サンセリフ（Inter系） | ライト背景: `#7166F0`、ダーク背景: `white` | インラインSVG |

**`<img src="*.svg">` 方式を廃止**し、インラインSVGで `fill` / `stroke` を直接指定することで、ダーク/ライト両背景に確実に対応。

---

## 📌 URIパラメータ

| ページ | パラメータ | 説明 |
|---|---|---|
| `receive.html` | `?id={orderId}` | ギフト注文IDを指定 |
| `receive.html` | `?demo=1` | デモ表示モード（アバター有り） |
| `receive.html` | `?demo=2` | デモ表示モード（アバター無し） |

---

## 🗺 旅アニメーション機能（Round 9・実装済み）

送り手がギフトを選ぶ過程を「旅」として記録し、受け取り手に届ける機能。

### データフロー
1. **gift.html** — `journeyLog[]` に各ステップを記録（感情選択・ギフト選択・アバター遷移）
2. **sessionStorage(`giftJourney`)** — avatar.htmlを経由してcheckout.htmlに受け渡し
3. **checkout.html** — `orderPayload.gift_journey` としてordersテーブルに保存
4. **receive.html** — `orderData.gift_journey` を取得し旅モーダルに表示

### journeyLogのステップ型
| type | 記録タイミング | 主なフィールド |
|---|---|---|
| `emotion_selected` | 感情選択時 | emotionId, emotionLabel, emotionEmoji, elapsed |
| `gift_selected` | 単品ギフト選択時 | giftId, giftName, giftEmoji, giftPrice, fromEmotion, elapsed |
| `set_selected` | セットギフト選択時 | setId, setLabel, setPrice, setItems[], fromEmotion, elapsed |
| `go_avatar` | アバターへ進む時 | finalGiftName, finalGiftEmoji, totalElapsed |

### 旅Canvas動画のシーン構成（5チャプター） ← Round 10 リニューアル
- **Canvas 1枚**でリアルタイムアニメーション（requestAnimationFrame ループ）
- 各シーン3.6秒・フェードイントランジション付き
- パーティクル（シーン別カラー）・星フィールド・バウンス絵文字・テキスト描画

| # | CHAPTER | 絵文字 | 内容 |
|---|---|---|---|
| 1 | CHAPTER 1 | ✨ | 旅のはじまり（固定） |
| 2 | CHAPTER 2 | 感情emoji | emotionStep から生成 |
| 3 | CHAPTER 3 | ギフトemoji | gift/set step から生成 |
| 4 | CHAPTER 4 | 🧑‍🎨 | アバターに気持ちを込めた（固定） |
| 5 | 到着 ✨ | 🚀 | あなたへ旅立った（固定） |

**UIコントロール:** 再生/停止・シークバー（全体進捗）・シーンサムネイル一覧（タップでジャンプ）・シーンカウンター

---

## 🚧 今後の開発予定

- [ ] 実際の決済連携（Stripe等）
- [ ] ユーザー認証・ログイン機能
- [x] ~~Giftalk AI の外部LLM API連携（本格AI化）~~ → **案3: ルールベースAI大幅改良で代替（Request 4完了）**
- [x] ~~3択セット受け取り手ページ対応（どれを選んだか通知）~~ → **実装済み**
- [x] ~~送り手のギフト選びの旅アニメーション機能~~ → **Round 9で実装済み**
- [ ] コミュニティ投稿への返信・コメント機能
- [ ] プッシュ通知（リアクション受信時）
- [ ] ギフト画像のアップロード・表示
- [ ] アバターの3D化・Live2D対応
- [ ] グループギフト（複数人から1人へ）
