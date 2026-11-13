# 知識ベース：アクセシビリティ3項目の出典と編集（2026-11-14）

既存180件のうち、参考資料が未登録だった3項目を対象に、公開されているW3C資料を読み、支持される範囲に限定してリンクと補足を追加した。全項目のレビュー状態は `draft_unreviewed`、根拠確認状態は `not_checked` のまま。資料の登録状態 `partial` は一部分の参照先があるという意味であり、項目全体の正確性やWCAG適合の承認を意味しない。

| 項目 | 照合した資料と位置 | 修正内容・限界 |
| --- | --- | --- |
| idea-accessibility-10 強制配色 | [W3C Media Queries Level 5 §12.4](https://www.w3.org/TR/mediaqueries-5/#forced-colors) | 強制配色はブラウザが利用者の配色を適用する状態で、必ずしも高コントラストを意味しない。システム色や対象環境での確認を補足。仕様案の説明であり、実際のOS・ブラウザ・支援技術の動作は未確認。 |
| idea-accessibility-11 認知面に配慮した構成 | [W3C WAI Content Usable — Design Guide](https://www.w3.org/TR/coga-usable/design_guide.html) の4.2.4、4.3.3、4.6.4 | 手順・構造・必要な準備を明確にする提案と照合。利用者の特性と必要な情報は異なるため、分け方や案内の量は対象者と検証する旨を追加。ガイドの採用だけで使いやすさやWCAG適合を保証しない。 |
| idea-accessibility-12 右から左に読む文字への対応 | [W3C Internationalization: Structural markup and right-to-left text](https://www.w3.org/International/questions/qa-html-dir.en.html)、[Authoring HTML: Handling Right-to-left Scripts](https://www.w3.org/International/docs/bp-html-bidi/Overview) | 文書の方向、方向が異なる文字列、CSS論理プロパティを区別。方向不明の挿入文字列には `bdi` / `dir="auto"` を検討する旨を追記。数字・URL・キーボード・読み上げは実環境で別途確認。 |

## データの保全と未実施

- 変更対象は上記3項目と参考資料4件。180件のID・カテゴリ・proposal状態、152件の関係、既存の参照資料は保持した。
- `scripts/knowledge-provenance-baseline.json` の資料件数・参照件数・ハッシュは今回の差分に合わせて更新した。旧値はGit履歴で追跡でき、ハッシュの更新は内容の独立承認を意味しない。
- 参照先はURLのみで、本文・図版・コードを転載していない。リンク先の掲載物や本サイトの既存素材について利用許諾を確認したわけではない。
- 3項目を含む180件全体の専門家・人間レビュー、実OS強制配色・スクリーンリーダー・RTL言語利用者による操作、根拠の全面照合は未実施。実際のブラウザ・環境依存の動作を推測で合格扱いしない。
