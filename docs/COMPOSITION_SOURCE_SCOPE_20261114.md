# 構図ガイド：参照資料の追加と支持範囲（2026-11-14）

先行24件のうち参考URLがなかった項目を優先し、一次著作・教科書・制作上の解説を実際に開いて、対応する説明だけを追加した。関連する他の項目にも同じ資料を紐付けている。資料はあくまで限定的な参照であり、項目内のすべての主張、掲載図形の著作権、専門家による受入を意味しない。全120項目の `reviewStatus` / `evidenceStatus` はそれぞれ `draft_unreviewed` / `not_checked` のままである。

| 対象 | 参照した資料・該当箇所 | 支持する範囲と限界 |
| --- | --- | --- |
| C-005 | [Adobe「写真のリーディングラインに関するガイド」](https://www.adobe.com/jp/creativecloud/photography/discover/leading-lines-photography.html) の「斜めのライン」 | 写真家が斜線を動きや距離の表現に使うという制作上の考え方。特定図の視線誘導や注意分散は実測していない。 |
| C-033／043／048／080 | [OpenStax, Psychology 2e, 5.3 Vision](https://openstax.org/books/psychology-2e/pages/5-3-vision) の単眼性の奥行き手掛かり | 物体の部分的な重なりが奥行きの手掛かりになるという教科書の説明。前後の距離の数値や、各模式図の読まれ方は保証しない。C-048では重なりに限る。 |
| C-061／062 | [Arthur Wesley Dow, Composition, 9th ed. (1914)](https://www.gutenberg.org/files/45410/45410-h/45410-h.html) の第9章「Two Values」と第10章「Spotting」 | 二つの明度と暗部の大きな面を使う当時の制作・教育方法。C-062の連結だけによる量感の変化や現代の読者への効果を実証するものではない。 |
| C-063 | [Adobe, Create contrast with silhouette portrait photography](https://www.adobe.com/creativecloud/photography/type/silhouette-photography.html) の「What is silhouette photography?」 | 明るい背景の前に置く暗い被写体と輪郭の説明。どの形も識別できるという保証ではない。 |
| C-067 | [Adobe, A guide to high-contrast photography](https://www.adobe.com/creativecloud/photography/technique/high-contrast.html) の「Tonal contrast」 | 明暗差を用いる写真上の制作方法。特定の配置での視線移動や注意分散の実験ではない。 |
| C-073 | [StudioBinder, The Wide Shot in Film](https://www.studiobinder.com/camera-shots/shot-size/wide-shot/) の「Loneliness」「When should you use a wide shot?」 | 広い画面内の人物と余白で孤立感を意図する映画制作上の用例。全員が孤独と感じることの実験的証拠ではない。 |
| C-119 | [Margaret Owen, Understanding Art Through Thumbnail Sketching, RISD Museum](https://risdmuseum.org/manual/441_understanding_art_through_thumbnail_sketching) の冒頭と「Simplifying into Three Values」 | 小さなスケッチで大きな形と明暗を整理する手順の参考。画面の縮小・グレースケール・SVG境界表示の機能や、その有効性を直接実証するものではない。表示変換の実装は `components/CompositionDiagram.tsx` を参照。 |

C-005は視線の誘導が観察済みであるかのような比較文を改め、C-033は遮蔽から距離の数値が分かるように読める表現を修正。C-061は遠方からの可読性が未実測と明記し、C-063はシルエットが必ず識別できるという断定を避けた。各資料の本文・図版・写真は転載していない。参照先の利用条件、模式図の作成履歴と参照作品、作者・利用許諾は引き続き未確認。

先行24件すべてに何らかの参照リンクは付いたが、C-119のリンクは関連する制作手順のみを支持し、他にも支持が一部にとどまる項目がある。**リンクがあることを各項目の根拠確認完了として扱わない。** 全主張の出典照合、第三者素材と模式図の制作経緯・権利、人間・専門家レビュー、独立受入は未了。閲覧：2026-11-14 JST。
