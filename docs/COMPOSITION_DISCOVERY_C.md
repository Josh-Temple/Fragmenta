# Fragmenta 構図120件 — 担当C：AI参照・目的別探索・UI（第2 Wave）

- 作業日：2026-11-04（JST）
- 指示書：`2026-11-04_fragmenta_composition120_full_visual_editorial_independent_offline_acceptance_wave_instructions.md`
- 開始HEAD：`fbd5fc79564637c44018b387ac9cb021654fb9d3`（Draft PR #49）
- C作業ブランチ：`feature/20261104-composition-c-discovery-audit`
- 状態：**Cのコード編集を実施。E統合・D独立受入・mainマージ・Vercel Deployは未実施。**
- 編集対象はC専有ファイルのみ。A/Bの共通正本 `data/composition-guides.json`、模式図、目視原票は変更しない。

## 実際の校訂

1. 8目的・計50候補を構図の定義・比較点と読み比べ、用途を「編集候補」として維持。全120件を個別に専門監修したわけではない。
2. 「力強さ → C-017」：現行AI指示例は人物の高さを約15%にする小さな構図であり、力強さの候補としてそのままコピーすることには注意が必要。注意欄に、人物占有率を高める案を別途比較することを追加。
3. 関連 C-110 → C-117：旧 `complement` と説明「構図固定で画風の差を比較」は、C-117が**画風を固定して人物位置を変える**ことを捉えていなかった。`contrast` に改め、両者の固定変数の違いを明示。
4. 関連 C-063 → C-119：縮小・白黒・輪郭検査はシルエット構図の必須前提ではないため、`prerequisite` を `complement` へ変更。
5. 目的別の注意欄は「注意点・適用条件」と表示し、対照図が直ちに不向き・誤りを意味するような読み方を避ける。

## 実装・構造チェック

- `data/composition-discovery.json`：上の3か所のみ意味を修正。目的数8・候補50・理由付き関連20を維持。`status:draft_unreviewed` は変更しない。
- `data/composition-discovery.ts`：UI取得関数に `purposes`（該当目的ID）を追加し、生成JSONの個別 `discovery` 属性との形の差を減らした。
- `scripts/check-composition-discovery.cjs`：50候補・20関連・関連元/先・分類候補・出力120 ID・180件参照を検査。**全ガイドの**用途・制約・例/対照の区別・媒体/被写体候補・比較条件・関連の種類と理由・目的ID・AI指示・画風分離・未レビュー状態と元の全フィールドが、正本から生成したJSONと一致するかを照合。構造PASSを意味の独立検証と混同しない。
- `pages/Composition.tsx`：目的フィルターで現在項目が候補外の場合、「選んで詳しく見る」は最初の該当項目へ進むよう修正。図解一覧から詳細へ戻る際、同じIDでも見出しへフォーカスを戻す。存在しないIDの直リンクは仮表示であることを警告。コピー元の指示文テキストをテストで特定できる属性を追加。
- `scripts/browser-smoke.mjs`：一覧を24→48→72→96→120と進め、240 SVGのDOM存在を検査するコードを追加。**DOM描画数は240図の人手目視を意味しない。** コピーAPIのスタブで取得した値と公開JSON・画面テキストの厳密一致、目的からの詳細リンク、HashRouterの戻る、360/390/768/1280pxの横溢れと44pxタッチ領域、無効IDの警告を検査するコードを追加。

## 検査証拠と未完了

| 区分 | 状態 | 根拠と限界 |
| --- | --- | --- |
| GitHub正本取得・C差分保存 | 実施 | C作業ブランチのコミットとファイルの読戻しで確認 |
| 50候補・20関連の人手読み比べ | 実施 | 定義・比較点との編集確認。個別原典による立証ではない |
| 120件AI出力の全属性検査 | テスト強化 | 検査コードを追加。最終統合HEADでのコマンド実行はEの担当 |
| 120件一覧・240 SVGのDOM検査 | テスト強化 | ブラウザsmokeへ追加。画像の全件視認ではない |
| 360/390/768/1280px・HashRouter・フォーカス | テスト強化 | 自動ブラウザコードへ追加。今回このセッションで実ブラウザは未実行 |
| 200%ブラウザズーム・実Clipboard readback | NOT_RUN | スタブのコピー成功とは区別。E/Dで実ブラウザ確認が必要 |
| 実Android・支援技術・生成AI再現性 | NOT_RUN | 実機・外部生成モデル検証なし |
| 240図実目視・出典の原典確認・専門監修 | Cの対象外／未完 | B・A・Dの証拠と混同しない |

`public/knowledge/composition-guides.json` はGit追跡ファイルではなく、`npm run catalog:export` で生成される。Cでは生成済みファイルをGitに別途追加しない。最終HEADの検査順序は `npm run catalog:export` → `npm run composition:verify` → `npm run build` → ブラウザsmoke。

## Eへの引継ぎ

- PR #49の開始HEADとCブランチHEADを比較して **Cブランチの変更ファイルのみ**を取り込む。A/Bの並行差分を上書きしない。
- 意味的に重要な確認点は C-017（目的とAI指示例の差）、C-110→C-117（固定する変数の逆転）、C-063→C-119（必須前提ではない関係）の3件。
- 生成JSONの検査は `catalog:export` 後に実行。CI・Chromium・200%ズーム・実Clipboard・Android実機は未実行のものをPASSと記さない。
- Eの統合後、Dはその固定HEADを独立受入する。本Waveの公開制御は **HOLD_NO_MERGE / NO_DEPLOY**。
