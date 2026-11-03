# Fragmenta — 構図ガイド（先行24項目）

**状態：編集下書き・未レビュー／図解は独自制作の模式図。**

- 元計画：[GitHub Issue #48](https://github.com/Josh-Temple/Fragmenta/issues/48)（10分野・120候補）。
- 今回の範囲：優先24項目について、名称・定義・配置例・対照例・AI指示・模式図の2案・参照情報を追加。
- 正本：`data/composition-guides.json`。 `public/knowledge/composition-guides.json` はビルド時に出力する派生ファイル。
- UI：`/#/composition`。既存の `/#/knowledge`（180件・15分野）は維持する。
- 図は「正しい／誤り」ではなく位置・形・量の違いを説明するための対照。比較側の配置が常に悪いという意味ではない。
- 構図原理と画風を区別し、AI指示例は配置・明暗の条件をなるべく具体化する。
- 出典が紐付く項目も、現時点では説明全体の独立検証は完了していない。画像や図版の転用権を含まない。

## 図解の比較品質（2026-11-03 更新）
- C-014（余白）、C-015（重心）、C-048（平面的な奥行き）、C-061（二値の明暗）、C-062（黒面の連結）、C-063（シルエット）、C-073（小さな人物）、C-075（建築の尺度）、C-110（構図と画風）を修正。
- 比較条件を限定するため、同じ人物位置・建築の外形・画面占有率などをできるだけ固定した。9項目に「見比べるポイント」を明示した。
- C-110はどちらも同じ構図で、画風だけが異なるため、「配置例／対照例」ではなく「画風A／画風B」と表記。
- 図は幾何学的な模式図であり、美術表現としての完成度や感情表現の再現性は未検証。図版の人手による目視審査は引き続き必要。

## 次の編集と受入
1. 二値の明暗・重心・平面的奥行き・構図と画風の分離など、独立の図解を人が見て意味が通るか点検する。
2. スマートフォンで検索、選択、表示、戻る、キーボード・読み上げを確認する。
3. 項目ごとの出典・専門用語の整理、反例の作成、AIモデルによる指示再現性の比較を実施する。
4. 24件の受入後に、残る96件を段階的に展開する。
5. 旧カタログの件数固定や関連グラフ基準の変更は、別の移行設計と独立レビューを経てから行う。

## 参考資料（限定的な参照）
- Nikon USA, [5 Easy Composition Guidelines](https://www.nikonusa.com/learn-and-explore/c/tips-and-techniques/5-easy-composition-guidelines)
- Nikon UK, [Essential composition techniques](https://www.nikon.co.uk/en_GB/learn-and-explore/magazine/tips-and-tricks/essential-composition-techniques)
- Nikon UK, [What are leading lines?](https://www.nikon.co.uk/en_GB/learn-and-explore/magazine/tips-and-tricks/what-are-leading-lines)
- Interaction Design Foundation, [The Gestalt Principles](https://ixdf.org/literature/topics/gestalt-principles)
