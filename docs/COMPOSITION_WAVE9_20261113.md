# 構図ガイド：先行24件の編集と表示修正（2026-11-13）

起点は PR #49 の `638963da6c5cbd214bff613c13ec64cb5bdfd1e3`、取り込み対象の main は `204fa175fb3aa31e8fba9afab68a83e827e5d7ec`。第9Waveの [A教材監査](https://github.com/Josh-Temple/Fragmenta/pull/49#issuecomment-6808954610)、[B出典・権利監査](https://github.com/Josh-Temple/Fragmenta/pull/49#issuecomment-6809015325)、[C利用者視点監査](https://github.com/Josh-Temple/Fragmenta/pull/49#issuecomment-6808914383) を参照して修正した。これらの監査は起点HEADの記録であり、変更後の独立受入を意味しない。

## 変更

- 先行24件の文章を、実際の模式図に描かれた形や変更条件に合わせた。複数条件が変わる例では、一つの要因による効果を断定しない。
- C-033は柱が人物と建物に重なるよう調整。C-063は対照図の目と横線を頭・胴の内部へ収めた。その他の118件の図形は変更していない。
- 図ごとに本文由来のSVG説明を関連付け、C-119の縮小・グレースケールでは背景も元図と一緒に変換する。シルエット・輪郭は前景図形を変換する。
- 詳細画面の検索結果リンクを最大13項目と一覧へのリンクに整理し、現在の項目へ到達できる状態を保つ。IDの文字色を改善し、文書の言語を日本語に指定した。
- 各画面には編集下書きと権利確認中の表示を残す。全120件のレビュー・根拠確認状態は昇格していない。

### 項目別の変更フィールド

| ID | 変更フィールド |
| --- | --- |
| C-001 | `contrast`、`comparisonPoint` |
| C-002 | `example`、`sourceIds` |
| C-004 | `contrast`、`comparisonPoint` |
| C-005 | `example`、`contrast` |
| C-010 | `definition` |
| C-014 | `contrast`、`comparisonPoint` |
| C-015 | `comparisonPoint` |
| C-016 | `contrast`、`comparisonPoint` |
| C-018 | `aiInstruction`、`diagramNote` |
| C-019 | `example`、`contrast`、`sourceIds`、`comparisonPoint` |
| C-025 | `contrast`、`comparisonPoint` |
| C-033 | `example`、`contrast`、`diagram`、`comparisonPoint` |
| C-041 | `example`、`sourceIds` |
| C-048 | `contrast`、`comparisonPoint` |
| C-061 | `example`、`aiInstruction` |
| C-062 | `contrast`、`comparisonPoint` |
| C-063 | `contrast`、`diagram`、`comparisonPoint` |
| C-067 | `contrast` |
| C-073 | `definition` |
| C-075 | `example`、`sourceIds` |
| C-109 | `contrast`、`sourceIds`、`comparisonPoint` |
| C-110 | `aiInstruction`、`sourceIds`、`comparisonPoint` |
| C-115 | `example`、`contrast`、`sourceIds`、`diagramNote` |
| C-119 | `contrast`、`aiInstruction`、`comparisonPoint`、`diagramNote` |

## 参考資料と限界

2026-11-13 JST に下記を閲覧し、登録した説明の範囲を確認した。リンクは資料の参照先であり、掲載画像や図版の転載許諾を示さない。

- C-041：Adobe の[前景・中景・背景](https://www.adobe.com/creativecloud/photography/hub/guides/foreground-middleground-background.html)。写真の層の区別に限る。
- C-075：[Wagemans ほかの論文](https://journals.sagepub.com/doi/10.1068/i0474)の抄録。相対的な大きさと絵画空間の奥行きに関する説明であり、孤独感などの感情効果や本模式図の効果は示さない。全文の検証は未実施。
- C-109・C-110：OpenAI の[画像指示ガイド](https://developers.openai.com/api/docs/guides/image-prompting)。構図・位置・制約を指定し結果を確認する方法であり、再現精度を保証しない。
- C-115：Adobe の[写真構図の基本](https://www.adobe.com/jp/creativecloud/photography/discover/photo-composition.html)。撮影時に用途や文字配置を考慮する助言に限る。
- C-002の参照先は Nikon UK の[構図解説](https://www.nikon.co.uk/en_GB/learn-and-explore/magazine/tips-and-tricks/essential-composition-techniques)に変更。中心配置の記述を確認した。
- C-019の参照先は NN/g の[近接の原則](https://www.nngroup.com/articles/gestalt-proximity/)に変更。距離とグループ化の説明に限り、特定図の注目効果を証明しない。

新しい参照先を加えた項目も、項目内の全主張が検証済みという意味ではない。B監査では元の48主張のうち35主張に未検証部分があり、模式図の制作過程・参照元・利用権限は未確認だった。修正後に同じ件数を再判定していない。先行24件以外の96件についても、今回の編集監査は行っていない。

## 検証と未実施

- `npm run build` と構図・既存知識ベースの検査を実行。構図120件・240図、既存180案と関連グラフの構造検査、およびSVG説明・C-033/C-063の形状に関する回帰検査を通過。
- C-033とC-063の4図は実際のReactコンポーネントをサーバー側でSVGに変換して画像化し、配置を目視確認した。これは実ブラウザでの画面操作ではない。
- この実行環境ではChromiumが起動時に `socket() failed: Operation not permitted`、ローカルのプレビューサーバーも起動できなかった。新しい候補に対するローカル実ブラウザ操作は未実施。
- 真の200%ズーム、Android実機、スクリーンリーダー、外部OSクリップボード、人間・専門家によるレビュー、素材の権利判断は未実施。自動検査の成功で代替しない。

## 公開状態

PR #49 は下書きを維持し、包括的な公開受入は未完了。変更後HEADのCIと、編集者以外による内容・権利・利用者操作の確認が必要。実行した検証範囲と未達を区別し、未確認を承認済みとして扱わない。

