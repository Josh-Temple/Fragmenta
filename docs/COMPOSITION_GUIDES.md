# Fragmenta — 構図ガイド（全120項目）

**状態：編集下書き（全件未レビュー）／Deploy・マージ未実施。**

## 保存先と実装
- 収録企画：[Issue #48](https://github.com/Josh-Temple/Fragmenta/issues/48)（10分野×12項目）。
- 内容の正本：`data/composition-guides.json`。既存の `data/content-ideas.json`（180項目・15分野）は一切変更しない。
- 詳細表示：`/#/composition`。図解一覧：`/#/composition?view=atlas`。
- 120項目それぞれに、定義、配置例、対照例、比較ポイント、AI指示文、独自SVG模式図2点（計240図）を収録した。
- キーワード検索、10分野の絞り込み、24件ずつの図解一覧、個別の比較表示、コピー操作を実装した。
- `/knowledge/composition-guides.json`：ビルド時に生成するAI向けJSON。元の知識ベース180件のエクスポートは維持する。
- 既存の `/#/knowledge` には構図ガイドへのリンクを設置済み。

## 内容と図版の注意
- **240図はすべて編集用の模式図。** 主に矩形・円・直線・多角形で原理の違いを示す。写真や完成イラストではない。
- 対照例は意図的に条件を変えているが、「常に悪い構図」を意味しない。
- 語義、歴史的背景、心理効果、撮影・透視図法の技術的厳密さを全面的に確認したものではない。
- 参考URLを紐づけた項目についても、説明全体の根拠を検証したものではない。第三者の画像の転載許諾も含まない。
- 特に C-012（黄金比）、C-039（三点透視）、C-060（焦点距離と撮影距離）、C-092（180度ルール）、C-120（参照画像と権利）の図は教育上の単純化に注意し、人手で厳密に点検する。

## 自動検査
- 全120 IDの完全性、分類10×12件、未レビュー状態、説明・比較ポイント・AI指示文、240模式図の有無と差異、図形パラメータの座標・サイズ・色範囲、参照ID・参照URLを確認する。
- Chromiumの組込みブラウザ検査で、画面表示、検索、分類、一覧、24→48件の追加表示、図の描画、コピー成功・失敗、360/768/1280pxの横方向のはみ出しを確認する。
- 型検査、lint、ビルド、元の180項目・関連グラフの回帰検査を維持する。
- **CI成功は独立した目視評価・出典監修・AI画像生成での再現性を意味しない。**

## 後で確認する順序
1. `/#/composition?view=atlas` から120項目を眺め、分野ごとに図の内容と名前が一致しているか確認する。
2. 気になる項目を開き、二図の差分と「見比べるポイント」が対応するか確認する。
3. 薄い差分、図の説明不足、矛盾や専門用語の曖昧さをIssue #48かPR #49に記録する。
4. 代表的な構図について実際の画像生成指示を比較し、モデル依存性を点検する。
5. 人手レビューを経て採用項目の `reviewStatus` を個別に更新する。変更後は回帰検査を再実行する。

## 出典候補（項目との部分対応）
- [Nielsen Norman Group — 近接の法則](https://www.nngroup.com/articles/gestalt-proximity/)
- [Nielsen Norman Group — 類同の法則](https://www.nngroup.com/articles/gestalt-similarity/)
- [Nielsen Norman Group — 共通領域の法則](https://www.nngroup.com/articles/common-region/)
- [Adobe — 180度ルール](https://www.adobe.com/creativecloud/video/discover/what-is-the-180-degree-rule.html)

## 公開制御
`docs/DEPLOYMENT_POLICY.md` に従い、Git連携の自動Deployは無効のまま。ユーザーの後日確認が済むまでPRはDraftを維持し、VercelへのDeploy・PRマージ・Production変更を行わない。

## 追加の独立品質点検（2026-11-04）
- 120項目の模式図を系統別に点検し、初回実装の12項目を独立にラスタライズして図の意味を確認した。
- C-012：黄金比の分割だけを示す模式図に、黄金螺旋そのものは描いていないと明記。黄金比が普遍的な美的法則だと断定しない。
- C-026：図と地の入替が分かるよう、同じ境界の色分けを変更。
- C-036：住所と連絡先の意味のあるグループ分けを、記号だけでなく「住」「連」の文字で可視化。
- C-039：横の二方向と縦方向を意識した三点透視の簡略図へ変更。厳密な作図ではないと注記。
- C-060：撮影位置と画角を区別し、前景の人物の大きさを固定したまま背景の相対的サイズ差を説明。
- C-086：赤いアクションラインだけでなく人物の胴・脚の向きも変えた。
- C-090：日本語の右開き漫画の読み順を矢印と番号で可視化。誌面の慣行により異なることに注意。
- C-092：人物を丸、カメラを三角形として区別。軸の同側から反対側への移動を表示。
- C-097：立ち絵の全身と顔に寄った切り取りを区別。
- C-120：一般原理の抽出と固有表現の模倣の違いを概念図で表現。図だけで法的な結論は出ない。
- 図中のテキストを表示・検査できるようSVG描画器とデータ検証器を拡張。

### 外部資料の限定的な照合
- [Nikon USA: 5 Easy Composition Guidelines](https://www.nikonusa.com/learn-and-explore/c/tips-and-techniques/5-easy-composition-guidelines) — 構図の一般的な選択肢。
- [NN/g: Gestalt Proximity](https://www.nngroup.com/articles/gestalt-proximity/) — 近接により視覚的な群を感じる傾向。
- [Adobe: 180-degree rule](https://www.adobe.com/creativecloud/video/discover/what-is-the-180-degree-rule.html) — 軸を越える際の意図と映像の連続性。
- [Cambridge in Colour: Telephoto Lenses](https://www.cambridgeincolour.com/tutorials/telephoto-lenses.htm) — 焦点距離とカメラ位置、見かけの遠近関係の区別。
- [Adobe: Architecture photography tips](https://www.adobe.com/creativecloud/photography/type/architecture-photography.html) — 建築を見上げたときの収束線。
- [Nainiら: The golden ratio—dispelling the myth](https://pmc.ncbi.nlm.nih.gov/articles/PMC10792139/) — 顔面・人体の美的比率に関する批判的検討。構図全般への結論として一般化しない。

資料の読み取りは対象分野の限定的な確認であり、120件全体の内容審査完了を意味しない。

### 受入画面の改善
- 図解一覧（`/#/composition?view=atlas`）は、各項目の配置例・対照例を**2枚とも**描画し、比較ポイントを同じカードに表示する。模式図の限界を持つ項目は注意書きもその場に表示する。
- 狭い画面では図を縦積み、広い画面では並列にし、文字・細部が極端に小さくならないようにする。
- 構図の個別詳細へ移動した際は見出しへフォーカスを移し、キーボード・支援技術でページ変更を認識しやすくする。
- 内部の静的模式図は生成AI出力画像とは異なり、絵画的な完成作例の代替にはならない。

## E統合とD指摘への対応（2026-11-04、Draft維持）

- **統合**：Aの文章校訂（17件、全120件source_only監査原票）、Cの目的別探索（8目的・50候補・20関連リンク）、Bの独立ブランチ修正と120行原票を既存PR #49へ統合。全120件・240図・図形1,266個。全件`draft_unreviewed`を維持。
- **修正**：C-037はBの一点透視図の対照図を採用。C-073は人物の位置と足元を固定して大きさのみ変更。C-117は図に合わせ「横位置のみ変えた管理された比較」と説明。C-118は窓の密度だけを変更した比較へ変更。C-038の対照図の説明も二方向への収束の有無に修正。
- **AI参照データ**：`useCases=[配置例]`・`limitations=[対照例]`は意味を誤るため廃止。用途候補は未検証の目的別選択から、制約は選択候補の注意や模式図の留保からのみ生成。未校訂のときは空配列とし画面でも明示。`applicationExample`と`comparisonExample`を別属性で提供。画風指定は`style:null`のまま。
- **Bの検査証拠**：`docs/COMPOSITION_B_VISUAL_AUDIT.csv`（120 ID）、`docs/COMPOSITION_B_VISUAL_AUDIT.md`、`scripts/render-composition-contact-sheets.cjs`を統合。Bの新規目視はC-037の2図のみで、残り119項目・238図は`NOT_RUN`。Dは7項目・14図を独自に再構成して実見したが、統合HEADのReact実画面の受入ではない。旧Waveの12項目の目視を今回の実施数に加えない。
- **未完了**：全240図の目視、用途・制約の個別120件校訂、専門資料の主張単位での照合、専門監修、Android実機、Clipboardの実readback、200%拡大、AIモデル画像再現性。CI成功をこれらの証拠にしない。
- **オフライン手順**：`node scripts/render-composition-contact-sheets.cjs --out /tmp/fragmenta-composition-review --capture`で接触シート・原票を生成。目視したIDに限り原票を更新し、自動生成の原票は`NOT_RUN`から開始する。
- **後日レビュー**：配信された候補の`/#/composition?view=atlas`で分野を巡回し、C-037/038/073/117/118/120を重点確認。目的別の候補理由と制約を読み、図と説明を対照する。現Waveで新規PreviewやProductionは作らない。
- **公開統制**：`HOLD_NO_MERGE / NO_DEPLOY`。PR #49をDraftに保ち、ユーザー確認と次Waveの明示許可までマージ・公開しない。

E修正後のHEADとテスト結果はPR #49コメントで確定させる。


## 2026-11-04 第2Wave E統合（A/B/C成果とD暫定指摘）

- **統合基点**：`fbd5fc79564637c44018b387ac9cb021654fb9d3`。A=`d23f50cbc5847f9bf1cc17c7d7fa733b7592931d`、B=`9477dd62f574f9b3c931f2d1bff15c2b52603bea`、C=`54daa42c8a6947542f6513b3491e0a2bb3e74ce0`。最終SHAとCI結果はPR #49のEコメントを参照。
- **A**：13項目の変更フィールドを限定統合し、出典2件を追加。7資料に関する限定的な主張照合の記録は `docs/COMPOSITION_GUIDES_A_EDITORIAL_AUDIT.md`。全面監修、出典リンク登録だけでの検証済み扱いはしない。
- **B**：C-001/005/103の図形だけ採用。Bの120行原票とB報告を統合。Bの簡易PNG幾何ラスタによる**モデル視認120項目・240図**は旧HEADからの再構成で、実SVG/React画面を実見した数は**0図 / NOT_RUN**。42項目に対し本文・幾何の重点照合、残78の全文意味照合は未実施。原票の`target_head_sha`・`source_blob_sha`は実見時の**旧版**を示し、新統合HEADの実SVG受入とは異なる。B修正後3組の簡易ラスタ視認もSVG目視ではない。
- **C**：sidecarと型・UI・検査2点・担当記録の6ファイルを採用。8目的・50候補・関連20を維持。C-017注意、C-110→117/C-063→119関連種別、目的別詳細・フォーカス・無効ID・AI JSONの全件一致検査・240 SVGのDOM確認とコピー元/スタブの一致を追加した。テストコードの追加を実行済みPASSとしない。
- **D暫定P1 C-106**：文字領域と建物を固定し、人物だけを移動。対照図で顔が見出し領域に重なるよう図形座標と説明を修正し、文字矩形という模式図の限界を明示。修正後の実SVG再描画・視認、React画面、独立D再受入は**NOT_RUN**。
- **保存前の構造検査**：120 unique ID、10分野各12、240図、図形1,275、出典16・guide→資料参照31（不明ID0）、全件`draft_unreviewed` / `not_checked`。これは静的JSONの検査であり、新HEADのCI/実画面証拠ではない。
- **BのP2課題**：C-013/023/041/093/119、C-106の修正後実画像確認。用途候補の全120件の立証、専門家監修、実Clipboard readback、200% zoom、Android/支援技術、AI画像生成再現性、全240図の実SVG目視は未完了。
- **再検証**：`npm ci`, `npm run typecheck`, `npm run lint`, `npm run composition:verify`, `npm run design:verify`, `npm run build`, Chromium smokeを**最終HEAD**で実施・確認。SVG接触シートは `node scripts/render-composition-contact-sheets.cjs --out /tmp/fragmenta-composition-review --capture` で再現可能。未実行は`NOT_RUN`。
- **後日レビュー**：`docs/COMPOSITION_B_VISUAL_AUDIT.csv`、`docs/COMPOSITION_GUIDES_A_EDITORIAL_AUDIT.md`、`docs/COMPOSITION_DISCOVERY_C.md`、配信後の`/#/composition?view=atlas`。C-001/005/037/073/103/106/117/118/120を優先。
- **公開制御**：`HOLD_NO_MERGE / NO_DEPLOY`。Draft維持、mainマージ・Preview/Production Deploy・Vercel設定変更なし。


## 2026-11-05 第3Wave E第一次統合とD引渡し

- 基点PR HEAD `7df55546cc34941116e050d326726a8026d57b9f`。A `b04a99e8605d4f3750492fd5731de7a0d9894a8a`、B `cf8e50dc3a838502d680db84be72ff0dd0b8748b`、C `fdf393ab2e99b5bc608cfdc3ccaa4000a175e87e` を既存Draft PR #49へ競合のないファイル単位で統合した。最終統合HEADとCI状態はPRの最新Eコメントを参照。
- A: 12 IDの文章・AI指示・比較条件の校訂と出典1件、監査記録。B: 6 ID/12図の実SVG独立再構成に基づく**モデル視認**、旧履歴を保った120行CSV、B報告、図形ハッシュmanifest。C: Chromium smokeのClipboard API、再フォーカス、4幅のC-106スクリーンショット、C記録。元scriptの全240図目視やReact実画面検証の実績ではない。
- E修正: C-090の比較図で、左→右の矢印と番号が逆転していたため対照図の番号を左①・右②に直し、比較本文も合わせた。コマと赤丸の形は固定。図の実ブラウザ再視認は別途必要。
- データ構造: 120 ID、10分野×12、240図、1,275図形、出典17件・参照32件。全件`draft_unreviewed`／`not_checked`維持。Bの開始旧HEAD `7df55546cc34941116e050d326726a8026d57b9f`・旧JSON SHA/PNG SHAは**歴史的な部分視認証拠**として保存し、新HEADのハッシュに置換しない。Bの元ブラウザ視認12/240（6 ID）は最終HEADの全件受入に読み替えない。人間視認0図、未見114 ID・228図。
- 未実施: 元contact-sheet生成script全10ページ実行と最終HEADの全240 SVG/React目視、最終HEAD実Chromium操作と真の200%ズーム、OS Clipboard readback、Android/支援技術、120件の原典主張単位照合、専門監修、AI生成再現性。追加コードと実行済みPASSを混同しない。
- DはE確定HEADを別セッション/環境で独立取得し、C-090/C-106/C-041/C-092/C-093/C-119や一覧・原票・実図を再現・反証すること。独立Dが固定HEADで判断するまで`D_FINAL=NOT_READY`。
- **HOLD_NO_MERGE / NO_DEPLOY**。Draft維持・本番/PreviewのDeployなし・mainマージなし。


## 2026-11-05 第4Wave E統合・独立受入の状態

- **統合対象**: Bの既存PR直書きコミット `245136cff404e12b6cc3e2a45c0fc2a357029172` の監査CSV120行・manifest・報告を保持し、Aブランチ `7474366d906c097902d9fd34206955971b478b0c` とCブランチ `94caa13212a3c759a297fc74b0fda19c840beccc` の非重複ファイルを統合。最終HEAD、CI、D受入判定はPR #49の本Wave Eコメントを優先して確認する。
- **Aの文面校訂**: C-023/041/093/119の計19テキストフィールドを修正（図形タプルは不変）。C-023の顔記号、C-041の複数要因、C-093の視線空間接続、C-119の未実施の縮小・白黒・輪郭処理について、図が立証しない範囲を明示。A監査には新規閲覧3 URL・既存1 URL再照合（主張単位で限定）を追記。専門家監修・120件出典立証済みとはしない。
- **Bの視覚点検**: Bが図形tupleとの独立照合のうえ、CairoSVG再構成で18 ID×2の**36図をモデル実画像視認**（旧入力データHEAD `7530bd0...`、画像は会話添付のみでGitHubに画像実体なし）。旧履歴を上書きせず120行CSVとmanifestに追記。**元contact-sheetスクリプトで最終HEADの240 SVGを視認した件数は0、React実画面視認0、人間視認0**。Aの文面変更後は本文・図の最終一致について再確認が必要。Dの別セッション32図はBの36図に加算しない。
- **Cの検査強化**: 複合フィルタ（C-073）、C-023/041/090/093/119の4 CSS幅・SVG2図・横溢れ、任意PNG画像hash出力のsmokeコードを追加。**コード追加自体は実ブラウザでの新テスト成功を意味しない**。既存CIの成功結果を新HEADへ自動継承しない。
- **Dの独立反証**: 第4WaveのDは**旧 `7530bd0...` のみ**を固定して16 ID×2＝32図をChromium上の独立SVG再構成でモデル視認。P0/P1は確認した16 ID内で0件、C-023/041/093/119はP2継続。元script、React独立操作は未実施。**新HEADの独立D再受入は `NOT_RUN / D_FINAL=NOT_READY`**。
- **公開判定**: `HOLD_NO_MERGE / NO_DEPLOY`。PRはDraftで保持し、mainマージ、Preview/Productionデプロイ、Vercel設定変更をしない。実200%ブラウザズーム、外部OS Clipboard、Android、支援技術、権利判定、生成AI再現性はいずれも`NOT_RUN`（別の実証があればPR最新Eコメントで明記）。

**残作業の順序**：新HEADのCIとデータ構造確認 → Bが元scriptにより240図を生成・実際の画像で全件照合 → CがReact実画面のブラウザ画像と操作を検証 → 同HEADをDが独立再取得し反証 → Eが最終記録。自動DOM試験やCairoSVG代替画像を元scriptの視認実績に算入しない。


## 2026-11-06 第5Wave E第一次統合 — SVG視覚証拠とReact全高撮影

- 起点 PR #49 HEAD `11d97bae2de12fc4da29a18ac813fc4ee8930b6f`（Draft/open）、base `ce47d522d6e2356c2a18db56d2d7eb0bef08171f`。
- Bは元contact-sheet scriptから生成した実Chromium 30タイル（120 ID×2=240図）をモデル視認。日本語字形をIPAフォントで再撮影し、GitHub Private branch `docs/evidence/composition/20261105_ci_42018740345/` に30 PNGを保存。GitHub artifact ZIPは容量上限で0件。B原票120行・manifestの原履歴を維持。**人間視認0**。
- D別セッションは旧HEAD `d0187578516a24ef2b0d2e13bd1c304b3e6a6b5f` で元scriptの240図を独立視認、P2は C-002/008/023/041/093/119、`D_FINAL=NOT_READY`。Dの旧HEAD結果はE後の新HEADに自動継承しない。
- Cの `ddfda6e5c1c32c9332925d97f5f6e52228435a1a` から `scripts/browser-smoke.mjs` と担当監査追記を非競合で採用。全高CDP capture・PNG画素寸法・図範囲・SHA-256・sidecarを検査。CIのPR #49のみ撮影を有効化し、28 React候補画像を検証、うち代表6 PNGをActionsログへBase64分割保存する。runnerの`CAPTURED`はモデル実見を意味しない。
- 項目・図形・本文・AI側データは変更しない。したがって、Bの元データ図形画像との同一性は保持する一方、**Reactの新しい撮影結果と独立D同一HEAD受入は新CI結果と別セッション記録が必要**。Aが提案したC-002/008の注意書き、6件のP2図形修正は未採用として明示して残す。
- 固定HEADと新CI URL・実画像視認実数・スクリーンショット結果・新D判定はPR #49のEコメントに追記して確定する。真200% browser zoom、外部OS Clipboard、Android、支援技術、120件専門監修、権利判断、生成AI再現性は未検証。
- **HOLD_NO_MERGE / NO_DEPLOY**。main/本番、Draft状態、Vercel設定を変更しない。
