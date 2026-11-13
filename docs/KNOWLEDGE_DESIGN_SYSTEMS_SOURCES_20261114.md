# 知識ベース：デザインシステム4項目の出典と編集（2026-11-14）

参考資料が未登録だった4項目について、各提供元の公開資料を読み、資料の対象に合わせて概要・使い方・確認事項を書き直した。いずれも未レビューの草稿であり、資料の登録状態 `partial` は記載内容の一部に参照先があることを示す。個別の部品、利用条件、実装への適合を確認済みという意味ではない。

| 項目 | 照合した資料 | 今回記載した範囲と限界 |
| --- | --- | --- |
| idea-design-systems-01 Material Design | [Google: Material 3のテーマ作成](https://developer.android.com/codelabs/m3-design-theming)、特に「Theming overview」「Roles and tokens」 | 色・文字・形、役割とトークンのテーマ設計。特定の部品や他環境の実装は確認していない。例として主色と文字色の組合せを調べるが、実画面のコントラストは未測定。 |
| idea-design-systems-02 Carbon | [IBM: About Carbon](https://www.carbondesignsystem.com/getting-started/about-carbon)、特に「What is Carbon」「Adoption」 | 共通基盤と用途別の拡張、資料・コード等の概要。個々のパッケージの機能、版、利用条件は未確認。 |
| idea-design-systems-03 Fluent | [Microsoft: Fluent 2 Design System](https://fluent2.microsoft.design/)、特に「Components」 | Web、iOS、Android、Windowsの資料への入口があること。全プラットフォームで部品や挙動が同一であることは示さない。 |
| idea-design-systems-04 Apple HIG | [Apple Developer: Design Pathway](https://developer.apple.com/design/get-started/)、特に「Interface with the HIG」 | 基礎、パターン、部品、入力方法などへの公式案内。各OS版の規定やApp Store審査基準の全面的な確認ではない。 |

## データの保全と未実施

- 変更対象は上記4項目と参考資料4件。180件のID・カテゴリ・proposal状態、152件の関連、既存資料を保持した。全項目の `draft_unreviewed` / `not_checked` を維持。
- `knowledge-baseline.json` に固定されていた最初の3項目の草稿ハッシュと、`knowledge-provenance-baseline.json` の資料数・参照数・ハッシュを今回の編集に合わせて更新した。変更前の内容とハッシュはGit履歴で追跡でき、この更新は独立受入や公開承認を意味しない。
- 参考資料はリンクと自分の言葉による要約のみを追加。提供元の図版・コードを取り込んでいない。リンク先の画像、コード、商標、デザイン資産の使用許諾や再配布条件を確認したわけではない。
- 対象コンポーネントの個別仕様、各プラットフォームでの操作、支援技術、ライセンス、人間による内容レビューは未実施。個別の素材や実装を利用する際は、その都度公式資料と条件を確認する。
