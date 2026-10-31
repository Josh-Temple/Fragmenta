# Fragmenta — 知識ベースの内部改善と後日レビュー

更新日：2026-10-31（JST）  
対象ブランチ：`feature/20261031-knowledge-base-ui`  
管理Issue：[ #45 ](https://github.com/Josh-Temple/Fragmenta/issues/45)

## 位置付け

本ブランチはレビュー前の候補です。**mainへの統合、PR作成、Vercel Preview/Productionへのデプロイは行わない。**

目標は、人間に読みやすいデザイン参照ページと、ChatGPT・Museなどが扱える機械可読データを同一の情報源から供給すること。

## データ管理

- 正本：`data/content-ideas.json`。15分野、180項目、固有IDと関連ID。
- 企画項目同士：154組の双方向リンク（JSON上の参照は308件）。
- 既存のスタイル/実装パターン：20件の参照。参照先のIDとURL形式はソース検査の対象。
- うち57件に説明下書き：概要・向く用途・注意点・確認事項を記載。
- すべての企画案は`status: proposal`。説明のある項目も`editorial.reviewStatus: draft_unreviewed`、`editorial.evidenceStatus: not_checked`。名称や説明は一次資料による検証前。
- `docs/CONTENT_IDEAS.md`は相互リンクをたどるための人間向け索引。説明の正本ではない。
- `scripts/export-knowledge.cjs`が`/knowledge/ideas.json`、`/knowledge/ideas.md`、`/llms.txt`をビルド時に静的生成。API/DBサーバー/外部AI送信は追加していない。

## 後で人間が確認する代表項目

| ID | 主な確認点 |
| --- | --- |
| `idea-visual-history-01` | 歴史・美術用語の根拠が不足していないか |
| `idea-layout-01` | 一覧と詳細の導線を実際に使い分けられるか |
| `idea-typography-01` | 日本語・英語混植の説明に誤解がないか |
| `idea-color-06` | 明暗の切替とアクセシビリティの注意書き |
| `idea-forms-01` | 入力の中断・復帰、条件付きフォームの扱い |
| `idea-information-12` | 規則の条件・例外の正確な表現 |
| `idea-ai-ui-01` | AI操作前の同意と実行済み状態の明確な区別 |
| `idea-use-cases-02` | 法令・制度サイトの原典と更新日の見せ方 |
| `idea-design-systems-01` | 公式ガイドとFragmentaの編集解釈を分離できているか |
| `idea-ai-reference-01` | 機械可読データのID・状態・更新・利用条件 |

※ここにある判断基準はレビュー項目であり、結果の合格を示さない。

## ローカル受入手順（デプロイ不要）

Node.js 22で作業用チェックアウトを作った環境にて：

```sh
npm ci
npm run catalog:verify
npm run catalog:export
npm run catalog:smoke
npm run typecheck
npm run lint
npm run build
```

ローカルで`npm run dev`を実行し、`/#/knowledge`と`/#/knowledge/idea-layout-01`などを確認する。実ブラウザで360px/390px、200%ズーム、Android、キーボード、検索条件の戻る/再読み込み、関連リンク、存在しないID、ファイルのHTTP 200と内容一致を別途検証する。**ソース検査やビルド成功をブラウザ受入と同一視しない。**

## 編集レビューの基準

1. 主張と出典を対応付ける。デザインシステムは公式原典を優先し、参照した版・日付を示す。
2. 見本の解釈と歴史的事実、製品公式の仕様を分ける。
3. 可読性・操作性・アクセシビリティは適用条件と実測・確認結果を伴うこと。
4. 著作権・利用許諾が不明なコード、ロゴ、画像、サンプルを自動的に再利用可としない。
5. 同じIDに関連する候補は、同義・類似・補完・対照のどの関係か必要に応じて明示する。
6. 内容が未確認の間は`draft_unreviewed`を維持し、独立レビューとソース確認後に限り公開コンテンツへの昇格を検討する。

## 公開判断

- Vercelの利用上限が回復するまで、Previewを含め新規デプロイは作成しない。
- 独立の実ビルド・ブラウザ確認・外部参照先の品質と権利確認が終わるまでは、PR/merge/productionは保留。
- 調査中の表示を利用者向けの確定情報として表現しない。
