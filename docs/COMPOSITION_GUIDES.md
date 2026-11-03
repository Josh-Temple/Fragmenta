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
