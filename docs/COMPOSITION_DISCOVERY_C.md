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
| 120件AI出力の全属性検査 | メモリ上での検証PASS／実CLIはNOT_RUN | 元JSONとsidecarから生成規約を再構成して検査関数を実行。正例PASS、関連種別・画風分離・対照例の意図的改変3件をFAIL検出。npm実行は未実施 |
| 120件一覧・240 SVGのDOM検査 | テスト強化 | ブラウザsmokeへ追加。画像の全件視認ではない |
| 360/390/768/1280px・HashRouter・フォーカス | テスト強化 | 自動ブラウザコードへ追加。今回このセッションで実ブラウザは未実行 |
| 200%ブラウザズーム・実Clipboard readback | NOT_RUN | スタブのコピー成功とは区別。E/Dで実ブラウザ確認が必要 |
| 実Android・支援技術・生成AI再現性 | NOT_RUN | 実機・外部生成モデル検証なし |
| 240図実目視・出典の原典確認・専門監修 | Cの対象外／未完 | B・A・Dの証拠と混同しない |

`public/knowledge/composition-guides.json` はGit追跡ファイルではなく、`npm run catalog:export` で生成される。Cでは生成済みファイルをGitに別途追加しない。最終HEADの検査順序は `npm run catalog:export` → `npm run composition:verify` → `npm run build` → ブラウザsmoke。

ブラウザsmoke本体と検査スクリプトは、GitHub読戻し後にJavaScriptとして静的構文解析を行い、どちらもPASS。Chromiumを実行した証拠ではない。

## Eへの引継ぎ

- PR #49の開始HEADとCブランチHEADを比較して **Cブランチの変更ファイルのみ**を取り込む。A/Bの並行差分を上書きしない。
- 意味的に重要な確認点は C-017（目的とAI指示例の差）、C-110→C-117（固定する変数の逆転）、C-063→C-119（必須前提ではない関係）の3件。
- 生成JSONの検査は `catalog:export` 後に実行。CI・Chromium・200%ズーム・実Clipboard・Android実機は未実行のものをPASSと記さない。
- Eの統合後、Dはその固定HEADを独立受入する。本Waveの公開制御は **HOLD_NO_MERGE / NO_DEPLOY**。


## 2026-11-04 第3Wave：担当C オフライン実ブラウザ検査補強（統合待ち）

- **基準PR HEAD**: `7df55546cc34941116e050d326726a8026d57b9f`。この時点でPR #49はDraft/open、Vercel自動Deploy無効。
- **専用ブランチ**: `feature/20261104-composition-c-browser-acceptance`。A/Bの共通JSON・図形・原票には触れない。
- **修正内容**: Chromium browser-smokeへ、コピー用スタブ解除後の**ブラウザ実Clipboard API writeText/readText（許可可能な場合のみ）**、同一IDの図解一覧→詳細への見出し再フォーカス、C-106実SVG表示の360/390/768/1280pxでの2図積み重ねと横溢れ点検を追加。任意の `COMPOSITION_SCREENSHOT_DIR` 指定で、各幅の一覧とC-106詳細の実Chromium PNGを保存し、標準出力にSHA-256を記録する。
- **証拠区分**: 実Clipboard APIが使えない場合は `NOT_RUN` と記録する。headless ChromiumのClipboard API readbackは外部OSのClipboard readbackを保証しない。CDP viewport変更は**実ブラウザ200%ズームとは異なる**ので `NOT_RUN` を維持する。
- **本セッションで実行**: GitHub上の既存ソースを固定HEADで取得し、C専用の検査コードを編集。変更後コードのJavaScript構文解析とGitHub readbackを実施（実行結果は別途PRコメントを参照）。
- **本セッションでNOT_RUN**: 対象Repoをローカルで起動したChromium実測、PNGの実保存、OS Clipboard、実200%ズーム、Android実機、支援技術、C側での240図目視。実ブラウザでのPASSを主張しない。

### Eへの再現手順

```sh
git checkout feature/20261104-composition-c-browser-acceptance
npm ci
npm run catalog:export
npm run composition:verify
npm run build
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort &
preview_pid=$!
COMPOSITION_SCREENSHOT_DIR=/tmp/fragmenta-c-browser \
  CHROME_BIN="$(command -v google-chrome || command -v chromium)" \
  node scripts/browser-smoke.mjs
kill "$preview_pid"
```

- 出力した各PNGのSHA-256、Chromium/OS版、実行時JST、各幅と実際の結果をEが別途記録する。**コマンド記載だけでは実行証拠にならない**。
- Cの変更をA/Bと競合しないようEが既存PRに取り込み、統合後の固定HEADで本番配信を伴わないChromium実測と独立D受入へ進む。
- **公開制御: HOLD_NO_MERGE / NO_DEPLOY**。

## 2026-11-05 第4Wave C：React候補画面・AIデータ整合の追検査（E統合待ち）

- **対象PR固定HEAD**: `7530bd0420bcf7970cadee6707b800b532b3c8ab`、base `ce47d522d6e2356c2a18db56d2d7eb0bef08171f`。Draft/open/未マージ。C専用ブランチ `feature/20261105-composition-c-react-evidence`。
- **GitHub正本のfresh read**: `data/composition-guides.json` blob `ed93ca8a15c183f71727174f72a58efd7344122f`、`data/composition-discovery.json` blob `d1ef68cff926376c8a370178756414c5a2d43523`、既存180件 `data/content-ideas.json` blob `21213701cd16f7d0cbfa6d3d8ff19767a4c8ecdf`。
- **この担当によるソース再計数**: 120 ID/10分野/240図/1,275図形、8目的/50候補/41一意候補/20関連、既存180件。孤立・不明カテゴリ、不明関連先/旧項目リンク、AI指示 `composition` と正本の不一致、`style:null`・未レビュー状態の違反は検出0。生成仕様に従うメモリ上でのAI sidecar再構成と対照であり、`npm run catalog:export` を今回このセッションで実行した証拠ではない。
- **既存固定HEADのCIを再利用**: [CI 41933535206](https://github.com/Josh-Temple/Fragmenta/actions/runs/41933535206) は成功。ジョブログで図解一覧24→48→72→96→120件／240 SVG DOM、目的/検索/HashRouter、C-106の360/390/768/1280pxのSVG2件と360/390px縦積み、ブラウザ内Clipboard API readback成功を確認。**C自身による実React操作や画像視認ではない**。CI artifactにスクリーンショット保存物なし。
- **今回のCコード実装**: `scripts/browser-smoke.mjs` に①カテゴリ＋目的＋キーワードを同時選択してC-073のみが抽出される複合条件試験、②C-023/041/090/093/119を4 CSS viewport幅で詳細React SVG2図・横溢れ・狭幅縦積み検査、③ `COMPOSITION_SCREENSHOT_DIR` があるときのみ対象図の各幅PNGとSHA-256を生成する処理を追加。独立した既存Cブランチへコミット。JavaScript構文検査・GitHub readbackをPASS。**新規検査コードはChromium未実行、スクリーンショットは未生成**。
- **このセッションのブラウザ実行障害**: Node `v22.16.0`、Chromium `144.0.7559.96`、Playwrightは利用可能。Private GitHubへの `git ls-remote` はDNS解決失敗、Playwrightの `http://127.0.0.1` と `data:` の `goto` は `net::ERR_BLOCKED_BY_ADMINISTRATOR`。ローカルReactアプリを取得・起動できず、`npm ci`/build/preview/browser-smokeはこの環境でNOT_RUN。CDP/Playwright `set_content` は利用できるが本来のReact候補画面の代替として扱わない。ブランクページでのキーボードズーム操作は観測倍率が変わらず、真の200%ズームPASSとはしていない。
- **明確な未実施**: 新CコミットでのCI/Node buildと実Reactスクリーンショットの生成・視認、真の200%ブラウザズーム、外部OS Clipboard、Android実機、支援技術。データ構造PASSは意味的レビュー、専門家監修、生成AI再現性のPASSではない。

### Eへの引継ぎ
1. 現PR #49とCブランチの最新コミットを比較し、`scripts/browser-smoke.mjs` とこの監査文書のみを競合解決して統合。共通JSON・A/B図形・B CSV原票は未変更。
2. Eが固定した最終HEADで `npm ci` → `npm run catalog:export` → `npm run composition:verify` → `npm run build` → localhost preview → `COMPOSITION_SCREENSHOT_DIR=/tmp/fragmenta-c-browser CHROME_BIN=/usr/bin/chromium node scripts/browser-smoke.mjs` を実行。生成PNGの実ファイル・hash、4幅、重点ID、環境を読戻しする。最終HEADが変わった場合はそのSHAで再検証する。
3. スクリーンショットは**生成だけで視認済みにしない**。Reactの実画面を開いて文字可読性・図と説明の一致を個別判定。元script/独立SVG再構成とも混同しない。
4. Dの最終受入は別セッション・固定HEADで行う。**公開制御: `HOLD_NO_MERGE / NO_DEPLOY`**。新PR、Vercel Preview、mainマージ、Draft解除は実行しない。


## 2026-11-05 第5Wave C：Reactスクリーンショットの全高撮影と証拠区分（E統合待ち）

- **入力PR固定HEAD**：`7f08cf28c1cc052d13ef083637d020e13e891352`、base `ce47d522d6e2356c2a18db56d2d7eb0bef08171f`。取得時のPR #49はDraft/open/未マージ。
- **C作業ブランチ**：`feature/20261105-composition-c-fullpage-react-evidence`。A/Bの`data/composition-guides.json`、図形タプル、`docs/COMPOSITION_B_VISUAL_AUDIT.csv`、SVG manifestは変更しない。
- **今回の実装**：`scripts/browser-smoke.mjs`の任意スクリーンショット出力を変更。旧`captureBeyondViewport:false`による900pxの画面内だけの切り取りをやめ、React画面で文書の実寸と対象SVGの境界を計測し、`captureBeyondViewport:true`＋全高の明示clipを使用。PNGのIHDR幅・高さを再読込し、ページサイズに足りない画像や対象SVG不足は失敗させる。各PNGにsha256/PNG寸法/CSS寸法/route/対象図数/図形領域/取得時刻/checkout SHAをJSONで併記する。
- **出力対象**：目的フィルタ済み一覧6件（4幅×1画面）、C-106の詳細（4幅）、C-023/041/090/093/119の詳細（5 ID×4幅）。最大28 PNG＋28 JSONを**環境変数`COMPOSITION_SCREENSHOT_DIR`を指定した場合にのみ**生成する。対象図は一部が同じものの4幅反復であり、全240図視認ではない。
- **取得状態**：今回、実ReactアプリからのPNG生成は**0枚**、モデル画像視認は**0枚**、人間視認は**0枚**。画像ファイル・CI artifactはまだ存在しない。既存PR HEADのCI 42002796026はSUCCESSだが、このCIのartifact一覧は空で、これまでスクリーンショット出力を有効にしていなかった。E/Bによる最終候補HEADのrunner実行・artifact回収が必要。
- **構文確認**：変更後のbrowser-smokeコードはV8の非実行構文解析PASS（ESM import宣言を除いたasync関数本体をパース）。GitHub上での`npm ci`・Node実行・build・React操作を意味しない。
- **撮影方式の限定実機検証**：Node 22.16.0 / Linux x86_64 / Chromium 144.0.7559.96のローカル環境で、`about:blank`へ書き込んだ合成HTML（高さ2624 CSS px、2 SVG）をCDP `Page.captureScreenshot`で撮影し、PNG IHDR **389×2624px**、下部要素のDOM存在を確認してPASS。**FragmentaのReact画面ではない**。`file://`直接遷移はこの実行環境ではブロックされ、Private Repoの`git ls-remote`はDNS解決失敗。合成HTMLでの撮影成功をアプリ画面の実測へ転用しない。
- **AI元データ読戻し**：同固定HEADの`data/composition-guides.json` blob `e62e89a40dbb83932dea7af662208f6a5334f6ed` と`data/composition-discovery.json` blob `d1ef68cff926376c8a370178756414c5a2d43523`を確認。120一意ID、240の図配列、8目的、50候補、20関連、全件`draft_unreviewed`／`not_checked`、AI指示の空欄0、候補の不明ID/理由・注意の空欄0。静的構造点検で違反0。**実エクスポートの新規生成、120件の意味的審査、原典照合は今回NOT_RUN**。
- **依然NOT_RUN**：React実画面のPNG生成・実画像モデル視認、真のChrome 200% browser zoom、外部OS Clipboard、Android実機、支援技術。既存CIのDOM/layout・ブラウザ内Clipboard readbackを転記して今回の独自実行としていない。

### E/Bへの引継ぎ（C成果の取り込み）

1. C作業ブランチから**`scripts/browser-smoke.mjs`とこのC監査ファイルだけ**を既存Draft PR #49へ統合する。A/Bの並行編集結果、図形・監査原票を上書きしない。
2. 固定した最終HEADのオフラインReact候補ビルドで以下を実行し、生成物実体・PNG寸法・sha256と画面末尾が写ったかを確認する。CI runnerで実行する場合は、Bが調整する限定的なartifactアップロードと統合し、期限付き保存を用いる。CはCI workflow・権限設定を変更していない。

    `COMPOSITION_SCREENSHOT_DIR=/tmp/fragmenta-react-visual CHROME_BIN=/path/to/chromium node scripts/browser-smoke.mjs`

3. JSON sidecarの`state: CAPTURED_NOT_VISUALLY_REVIEWED`は画像を生成した事実のみを表し、モデルが実際に画像表示した場合にのみ視認数を別記する。全高captureとPNG IHDRだけでは文字可読性を保証しない。真の200% zoom・外部OS Clipboard・Android/ATは独立して検査する。
4. 新HEADのCI/画像・実React操作後に別セッションDへ引き渡す。**公開制御：`HOLD_NO_MERGE / NO_DEPLOY`、Draft維持。**
