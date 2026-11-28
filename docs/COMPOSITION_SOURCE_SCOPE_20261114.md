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

## 先行24件以外の追加照合

以下は各項目の全フィールドを審査した結果ではなく、列挙した資料の該当箇所を開き、用語や制作上の方法に限って参考リンクを追加した記録。本文・図版の転載や、他の主張の裏付けには用いていない。

| 対象 | 資料と照合箇所 | 限界 |
| --- | --- | --- |
| C-003／006／008／011／046 | [Adobe, 15 photography composition techniques](https://www.adobe.com/au/creativecloud/roc/blog/photography/photography-composition-techniques.html) の対称・三角形・S字・自然の枠 | 写真の制作上の使用例であり、特定の図に対する視線や感情の測定ではない。 |
| C-021／022 | [Nikon, 5 Easy Composition Guidelines](https://www.nikonusa.com/learn-and-explore/c/tips-and-techniques/5-easy-composition-guidelines) の「Patterns & Textures」 | 反復や異なる要素の配置例。図の注目度を実測したものではない。 |
| C-024／035 | [Margaret Owen, RISD Museum](https://risdmuseum.org/manual/441_understanding_art_through_thumbnail_sketching) の小さなスケッチ、形と明暗の整理 | 手描きの制作例。画面での縮小表示・可読性や本図の効果は検証していない。 |
| C-026／029／030 | [OpenStax, Psychology 2e, 5.6](https://openstax.org/books/psychology-2e/pages/5-6-gestalt-principles-of-perception) の図と地・閉合・良い連続 | 知覚傾向の教科書的説明。すべての人が同様に見るという保証ではない。 |
| C-032 | [Nielsen Norman Group, Common Fate](https://www.nngroup.com/videos/common-fate-gestalt/) の概要 | 同時に動く要素の知覚についての説明。静止矢印で実際の運動知覚を再現したものではない。 |
| C-036 | [W3C WAI, Grouping Controls](https://www.w3.org/WAI/tutorials/forms/grouping/) の概要・Related fields | 関連フォーム項目の視覚的・コード上のグループ化。模式図自体は実フォームでも適合性判定でもない。 |
| C-044 | [National Gallery, Aerial perspective](https://www.nationalgallery.org.uk/paintings/glossary/aerial-perspective) | 大気による遠景の色調変化と、それを絵画で用いる方法の説明。気象条件や特定の彩度差の数値は規定しない。 |
| C-045 | [Nikon, What are leading lines?](https://www.nikon.co.uk/en_GB/learn-and-explore/magazine/tips-and-tricks/what-are-leading-lines) | 写真上の線の使い方の参考。個々の閲覧者の視線経路は測っていない。 |
| C-049／050／051／094 | [Adobe, Different types of shots and camera angles in film](https://www.adobe.com/creativecloud/video/discover/types-of-shots-in-films.html) のショットサイズ | 各ショットの概説。C-094の二図での物語効果や撮影条件を証明しない。 |
| C-064 | [National Gallery, Chiaroscuro](https://www.nationalgallery.org.uk/paintings/glossary/chiaroscuro) | 絵画で明暗差を使い量感を表す用語の解説。本図は照明の光学再現ではない。 |
| C-065／066 | [Adobe, High key lighting vs low key lighting](https://www.adobe.com/uk/creativecloud/video/discover/low-key-vs-high-key-lighting.html) | 映像の照明方法の説明。図の色面だけから照明器具や心理効果は確定できない。 |
| C-069 | [Adobe, Silhouette portrait photography](https://www.adobe.com/creativecloud/photography/type/silhouette-photography.html) の逆光と明るい背景 | シルエット写真の一例。逆光を使えば必ず輪郭が見えるという保証ではない。 |

あわせてC-008／022の視線・注目について断定を緩め、C-026／032／044／069の定義を資料に合わせて明確化した。C-035は「近似した形のまとまり」より内容を伝えやすい「大きな形の整理」に名称を変更。C-036はWebフォームでは視覚上だけでなくコード上でも関連を示す必要がある旨を追加した。120件中の参照リンク付き項目は47件から71件になったが、残る49件だけでなくリンク付き項目にも個別主張・権利の未確認部分がある。
