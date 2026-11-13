# 知識ベース：デザイン史4項目の出典と編集（2026-11-14）

参考資料が未登録だった4項目について、美術館が公開する解説を読み、扱う地域・時期・作品の範囲を示して説明を書き直した。資料は研究機関による解説であり、同時代の原典や、すべての作品の調査ではない。各項目の `draft_unreviewed` / `not_checked` は維持し、資料が一部を支える状態として `partial` を付けた。

| 項目 | 照合した資料 | 確認範囲と限界 |
| --- | --- | --- |
| idea-visual-history-01 アール・ヌーヴォー | [V&A: Art Nouveau – an international style](https://www.vam.ac.uk/articles/art-nouveau-an-international-style) の導入と地域別解説 | 19世紀末に複数地域で展開し、自然形態や曲線のほか、幾何学や非対称を含む。作家や作品の網羅的な検証ではない。 |
| idea-visual-history-02 デ・ステイル | [MoMA: Contra-Construction Project](https://www.moma.org/collection/works/232) の作品解説とDe Stijlの紹介 | 1917年の雑誌と、矩形・線・三原色などを使う抽象表現を確認。ある作品や解説を、所属作家の全作品に共通する規則として扱わない。 |
| idea-visual-history-03 ミッドセンチュリー・モダン | [Met: Design, 1950–75](https://www.metmuseum.org/essays/design-1950-75) | 関連する時期の各地域・素材の事例を確認。この資料の対象期間は、呼称全体の厳密な定義や開始・終了年を意味しない。 |
| idea-visual-history-04 アーツ・アンド・クラフツ | [V&A: Arts and Crafts: an introduction](https://www.vam.ac.uk/articles/arts-and-crafts-an-introduction) | 主に英国の成立と制作・生産に関する理念を確認。運動を単一の模様や「機械の全面否定」に還元しない。英国以外の展開は別資料が必要。 |

## データの保全と未実施

- 変更対象は上記4項目と参考資料4件。180件のID・カテゴリ・proposal状態、152件の関連、既存資料を保持した。
- `knowledge-baseline.json` の最初の3項目の草稿ハッシュと、`knowledge-provenance-baseline.json` の資料数・参照数・ハッシュを今回の編集に合わせて更新した。変更前はGit履歴で追跡可能。更新は独立受入・公開承認ではない。
- 先頭項目が出典なしであることに依存していた否定テストを修正し、出典のない項目に `partial` を付ける場合と、出典がある項目を `not_checked` にする場合の両方を拒否するよう確認する。
- URLと自分の言葉による要約のみを追加し、図版や作品を複製していない。作品ごとの画像・文章・意匠の使用条件は未確認。
- 原典との突合、地域や時代の広い範囲を対象とする専門家・人間レビュー、画面上の表示と支援技術による確認は未実施。現代のUIに与える効果はこれらの歴史資料からは検証できない。
