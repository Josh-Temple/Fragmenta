# 構図ガイド：先行24件の編集と表示修正（2026-11-13）

起点は PR #49 の `638963da6c5cbd214bff613c13ec64cb5bdfd1e3`。先に main `204fa175fb3aa31e8fba9afab68a83e827e5d7ec` を取り込み、その後、厳格な型検査を有効にした main `49640c2f3134dabc1243fa5102c2694e8a3a4b80` を取り込んだ。第9Waveの [A教材監査](https://github.com/Josh-Temple/Fragmenta/pull/49#issuecomment-6808954610)、[B出典・権利監査](https://github.com/Josh-Temple/Fragmenta/pull/49#issuecomment-6809015325)、[C利用者視点監査](https://github.com/Josh-Temple/Fragmenta/pull/49#issuecomment-6808914383) を参照して修正した。これらの監査は起点HEADの記録であり、変更後の独立受入を意味しない。

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

新しい参照先を加えた項目も、項目内の全主張が検証済みという意味ではない。B監査では元の48主張のうち35主張に未検証部分があり、模式図の制作過程・参照元・利用権限は未確認だった。修正後に同じ件数を再判定していない。第9Wave時点では先行24件以外の96件を編集監査していない。後続の10件については下記の限定的な図文照合を行ったが、96件全体の編集・根拠監査は未完了。

## 検証と未実施

- `npm run build` と構図・既存知識ベースの検査を実行。構図120件・240図、既存180案と関連グラフの構造検査、およびSVG説明・C-033/C-063の形状に関する回帰検査を通過。
- C-033とC-063の4図は実際のReactコンポーネントをサーバー側でSVGに変換して画像化し、配置を目視確認した。これは実ブラウザでの画面操作ではない。
- この実行環境ではChromiumが起動時に `socket() failed: Operation not permitted`、ローカルのプレビューサーバーも起動できなかった。新しい候補に対するローカル実ブラウザ操作は未実施。
- mainを取り込んだHEAD `580dc143abca884a70be72d6e9cd173ef393da80` の [CI](https://github.com/Josh-Temple/Fragmenta/actions/runs/43372821545) では、型検査・ビルド成功後、Chromiumの起動待ちが25秒でタイムアウトした。直前HEADではブラウザ操作が成功しているが、今回の原因は未確定。待ち時間を45秒とし、再発時にChromiumの終了状態と標準エラーを記録するよう検査を改善した。次のHEADで改めて判定する。
- 真の200%ズーム、Android実機、スクリーンリーダー、外部OSクリップボード、人間・専門家によるレビュー、素材の権利判断は未実施。自動検査の成功で代替しない。

## 公開状態

PR #49 は下書きを維持し、包括的な公開受入は未完了。変更後HEADのCIと、編集者以外による内容・権利・利用者操作の確認が必要。実行した検証範囲と未達を区別し、未確認を承認済みとして扱わない。

## 先行24件以外の追加修正（2026-11-13）

先行24件以外から、文章と図の条件が食い違う10件を選んで修正した。これは全フィールド・全主張の監査ではなく、残り86件に問題がないという判断でもない。全120件の `reviewStatus` と `evidenceStatus` は未レビュー・未確認のまま。

| ID | 修正内容・残る限界 |
| --- | --- |
| C-020 | 図の小矩形の数は同じだが、配置と淡色の壁の有無が変わることを明示。 |
| C-042 | 同じ位置の円を使い大きさを変える比較と、距離感の条件依存性を明記。相対的な大きさと奥行きの関係について既登録論文の抄録を参照。 |
| C-049 | 人物拡大後も背景が同じ模式図であり、撮影範囲の変化や顔の接写を再現していないことを明示。 |
| C-066 | 対照図には背景と暗い柱の明度差が残ることを明示。ハイキーの説明と図の色も調整。 |
| C-072 | 実際には輪郭のぼかしが変わらず建物の明度だけが変わると明記。エッジの硬さを見せる図自体は未完成。 |
| C-076 | 開口の広さは一定で、変化するのは明度だと明記。 |
| C-089 | 三コマの配置差を記述し、体感時間や強調の効果を断定しない。 |
| C-103 | 器の横移動で重なりと間隔が同時に変わることを明記。 |
| C-111 | 位置指定が再現を保証するという表現を緩和。人物の模式図を移動し、その外接範囲の中心が横20%・縦約75%の補助線と一致するよう修正。OpenAIの画像指示ガイドは位置・制約の指定方法の参考に限る。 |
| C-113 | 実際の図はカメラ・矢印・建物の模式図であり、旅人や距離は描いていないことを明示。 |

ローカルのbuild・120項目の構造／出力検査に加え、C-111の数値位置を回帰検査した。C-066／072／076／111はReactのサーバー描画SVGから計8図を画像化して表示内容を点検した。ブラウザ画面や支援技術の検証とは別である。権利・制作経緯・原典の全面確認、人間・専門家レビュー、独立受入は引き続き未実施。

