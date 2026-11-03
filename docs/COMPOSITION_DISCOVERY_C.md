# 構図120件 — C担当：目的別探索とAI向け構造化（2026-11-04）

**状態：未レビューの実装案。独立D受入・公開・マージ・Deployは未実施。**

## 改修と正本

- `data/composition-guides.json` は不変更。Aの文章校訂・Bの図解改訂との競合を回避し、後でEが統合する。
- `data/composition-discovery.json` は8目的（孤独感、静けさ、不穏さ、力強さ、奥行き、視線誘導、文字の余白、モバイル縦長）、各6〜7件の候補と理由・不向きな条件、20件の根拠付き片方向関連リンクを保持。
- `data/composition-discovery.ts` はUI向け型と取得関数。 `pages/Composition.tsx` は選択理由、制約、関連構図と直接URLを提示。
- `scripts/export-knowledge.cjs` は正本から生成する `/knowledge/composition-guides.json` に `discovery` を合成。文章を重複保存しないため、Aの校訂が後から適用されても派生例・制約が同期する。
- `scripts/check-composition-discovery.cjs` は全120件と元180件のリンク・出力・レビュー状態を検証。既存 `scripts/browser-smoke.mjs` に目的選択、孤独感のC-073直接URL、390px、ゼロ件を追加。

## AI向けJSON契約

ルートの `schemaVersion:1` と従来のフィールドは維持。トップレベル `discovery` に `schemaVersion`・`status`・`note`・`purposes` を追加。

全 `guides[i].discovery` には `useCases`（配置例）、`limitations`（対照例・図の限界）、`media`／`subjects`（分野単位の候補）、`priorityConditions`（見比べるポイント）、`relatedComposition`（既存ID・関係種別・理由）、`purposes`、`aiGuidance:{composition,style:null}`、`discoveryStatus:"draft_unreviewed"` を付与。

対照例を誤りとは扱わず、参考媒体・被写体を個別に検証済みとは表示しない。モデルでの再現性試験は未実施。既存の `reviewStatus`・`evidenceStatus` は不変更。

## 操作例

`/#/composition?view=atlas` → 「孤独感」を選択 → 6候補から C-073「孤独を示す小さな人物」を選択 → `/#/composition?purpose=solitude&id=C-073` → 選んだ理由、壮大さとも解釈され得る注意、配置例・対照例、AI指示を読む。

## Eへ引継ぎ

最終HEADで `npm run composition:verify` → `npm run build` → Chromium smoke を実行すること。A/Bの編集と統合後に実際のHTTP JSON、表示、Clipboard、360/390/768/1280px、200%ズーム、キーボードを確認。実行していない検査をPASSにしない。Dによる独立受入は別途必要。
