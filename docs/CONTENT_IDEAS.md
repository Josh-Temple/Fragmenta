# Fragmenta — コンテンツ候補180案（人間・AI共用の索引）

> 正本: [`data/content-ideas.json`](../data/content-ideas.json)。本資料はその可読性の高い派生表示です。すべて企画段階であり、公開済みコンテンツではありません。

更新: 2026-10-31。15分野×12案、固有ID、関連アイデアへの相互参照、既存の公開パターン・スタイルへの参照を収録。

## 見方

- `idea-...` は企画用の安定ID。名称が変わってもIDを維持する。
- [関連案](#idea-layout-01) はこの文書内の別項目へ移動する。関係は手作業で選定した企画上の関連性で、同義語を意味しない。
- 公開済みパターンはアプリの `/#/p/<id>` へ、既存スタイルは `/#/styles` の一覧へ移動する。スタイル別の固定URLは現在提供されていない。
- 各案にある `proposal` は未制作を意味する。外部資料の出典・ライセンス調査、プレビュー、実装、AI指示文は今後追加する。
- 追加する際には [既存の24スタイル](../data/design-styles.ts)、[既存18パターン](../data/definitions.tsx)、[予定12パターン](../data/planned-patterns.ts)、[予定ツール](../data/planned-tools.ts) と照合する。

## 分野別一覧

- [デザイン様式・美術史](#category-visual-history)
- [レイアウト・画面構成](#category-layout)
- [タイポグラフィ・文字組み](#category-typography)
- [配色・質感・視覚表現](#category-color)
- [UIコンポーネント・ナビゲーション](#category-components)
- [フォーム・ユーザー操作の流れ](#category-forms)
- [アニメーション・動きの設計](#category-motion)
- [グラフ・データ可視化](#category-data-viz)
- [情報設計・読みやすいコンテンツ](#category-information)
- [アクセシビリティ・使いやすさ](#category-accessibility)
- [AIアプリ特有のUI](#category-ai-ui)
- [用途別のデザイン実例](#category-use-cases)
- [既存デザインシステムの比較資料](#category-design-systems)
- [デザインの比較・判断・失敗例](#category-review)
- [AIが利用するためのデータ・テンプレート](#category-ai-reference)

## category-visual-history

**デザイン様式・美術史**（12案）

- [アール・ヌーヴォー](#idea-visual-history-01)
- [デ・ステイル](#idea-visual-history-02)
- [ミッドセンチュリー・モダン](#idea-visual-history-03)
- [アーツ・アンド・クラフツ](#idea-visual-history-04)
- [ポップアート](#idea-visual-history-05)
- [オプ・アート](#idea-visual-history-06)
- [サイケデリック・アート](#idea-visual-history-07)
- [グランジ](#idea-visual-history-08)
- [コラージュ](#idea-visual-history-09)
- [ソーラーパンク](#idea-visual-history-10)
- [ダークアカデミア](#idea-visual-history-11)
- [コテージコア](#idea-visual-history-12)

### idea-visual-history-01

**アール・ヌーヴォー**  ・  状態：企画段階
関連案：[博物館・美術館サイト](#idea-use-cases-04)

### idea-visual-history-02

**デ・ステイル**  ・  状態：企画段階
関連案：[スタイル定義のJSON](#idea-ai-reference-01) / [タイル型ポータル](#idea-layout-05) / [形状のモーフィング](#idea-motion-05)
既存の関連項目：[バウハウス（同時代の造形思想の対照）](https://fragmenta-brown.vercel.app/#/styles)

### idea-visual-history-03

**ミッドセンチュリー・モダン**  ・  状態：企画段階
関連案：[類似色配色](#idea-color-02)
既存の関連項目：[北欧モダン（現代的な方向性との比較）](https://fragmenta-brown.vercel.app/#/styles)

### idea-visual-history-04

**アーツ・アンド・クラフツ**  ・  状態：企画段階
関連案：[ノイズ・紙の質感](#idea-color-10)

### idea-visual-history-05

**ポップアート**  ・  状態：企画段階
関連案：[補色配色](#idea-color-03)
既存の関連項目：[メンフィス（表現豊かな様式の比較）](https://fragmenta-brown.vercel.app/#/styles)

### idea-visual-history-06

**オプ・アート**  ・  状態：企画段階
関連案：[高コントラスト表示](#idea-accessibility-03) / [ハーフトーン表現](#idea-color-09)

### idea-visual-history-07

**サイケデリック・アート**  ・  状態：企画段階
関連案：[グラデーションの設計](#idea-color-11)

### idea-visual-history-08

**グランジ**  ・  状態：企画段階
関連案：[ノイズ・紙の質感](#idea-color-10)

### idea-visual-history-09

**コラージュ**  ・  状態：企画段階
関連案：[メーソンリー型](#idea-layout-02)

### idea-visual-history-10

**ソーラーパンク**  ・  状態：企画段階
関連案：[博物館・美術館サイト](#idea-use-cases-04)
既存の関連項目：[サイバーパンク（世界観の対照）](https://fragmenta-brown.vercel.app/#/styles)

### idea-visual-history-11

**ダークアカデミア**  ・  状態：企画段階
関連案：[明朝体とゴシック体の使い分け](#idea-typography-09)

### idea-visual-history-12

**コテージコア**  ・  状態：企画段階
関連案：[類似色配色](#idea-color-02)

## category-layout

**レイアウト・画面構成**（12案）

- [マスター・ディテール型](#idea-layout-01)
- [メーソンリー型](#idea-layout-02)
- [固定サイドバー型](#idea-layout-03)
- [3カラムのドキュメント型](#idea-layout-04)
- [タイル型ポータル](#idea-layout-05)
- [全画面セクション型](#idea-layout-06)
- [ヒーロー＋特徴紹介型](#idea-layout-07)
- [フィード＋詳細パネル型](#idea-layout-08)
- [横スクロールギャラリー型](#idea-layout-09)
- [複数パネルの編集画面](#idea-layout-10)
- [画面分割型ワークスペース](#idea-layout-11)
- [高密度・低密度ダッシュボード比較](#idea-layout-12)

### idea-layout-01

**マスター・ディテール型**  ・  状態：企画段階
関連案：[ツリービュー](#idea-components-04) / [検索結果のグルーピング](#idea-information-11) / [フィード＋詳細パネル型](#idea-layout-08)

### idea-layout-02

**メーソンリー型**  ・  状態：企画段階
関連案：[博物館・美術館サイト](#idea-use-cases-04) / [コラージュ](#idea-visual-history-09)

### idea-layout-03

**固定サイドバー型**  ・  状態：企画段階
関連案：[スキップリンク](#idea-accessibility-02) / [階層型サイドナビゲーション](#idea-components-10)

### idea-layout-04

**3カラムのドキュメント型**  ・  状態：企画段階
関連案：[出典・引用の表示](#idea-information-02) / [スマホで崩れるレイアウトの修正](#idea-review-05)

### idea-layout-05

**タイル型ポータル**  ・  状態：企画段階
関連案：[ツリーマップ](#idea-data-viz-09) / [デ・ステイル](#idea-visual-history-02)

### idea-layout-06

**全画面セクション型**  ・  状態：企画段階
関連案：[ページ遷移アニメーション](#idea-motion-01)

### idea-layout-07

**ヒーロー＋特徴紹介型**  ・  状態：企画段階
関連案：[EC・商品販売サイト](#idea-use-cases-06)

### idea-layout-08

**フィード＋詳細パネル型**  ・  状態：企画段階
関連案：[マスター・ディテール型](#idea-layout-01)

### idea-layout-09

**横スクロールギャラリー型**  ・  状態：企画段階
関連案：[カルーセル](#idea-components-09)

### idea-layout-10

**複数パネルの編集画面**  ・  状態：企画段階
関連案：[AIが提案したコードの差分表示](#idea-ai-ui-08) / [Atlassian Design System](#idea-design-systems-10)

### idea-layout-11

**画面分割型ワークスペース**  ・  状態：企画段階
関連案：[JSONなどの構造化出力の表示](#idea-ai-ui-04)

### idea-layout-12

**高密度・低密度ダッシュボード比較**  ・  状態：企画段階
関連案：[ミニマリズムと情報不足の違い](#idea-review-01) / [情報密度の調整](#idea-review-07)
既存の関連項目：[ミニマリズム（情報密度との比較）](https://fragmenta-brown.vercel.app/#/styles)

## category-typography

**タイポグラフィ・文字組み**（12案）

- [日本語と欧文の混植](#idea-typography-01)
- [縦書きレイアウト](#idea-typography-02)
- [見出しの文字サイズ設計](#idea-typography-03)
- [可変フォント](#idea-typography-04)
- [長文の行長と行間](#idea-typography-05)
- [ルビ・ふりがな](#idea-typography-06)
- [日本語の禁則処理](#idea-typography-07)
- [数字の等幅表示](#idea-typography-08)
- [明朝体とゴシック体の使い分け](#idea-typography-09)
- [ウェイトによる情報の階層化](#idea-typography-10)
- [日本語・英語併記の組版](#idea-typography-11)
- [小画面での長い見出しの処理](#idea-typography-12)

### idea-typography-01

**日本語と欧文の混植**  ・  状態：企画段階
関連案：[日本語・英語併記の組版](#idea-typography-11)

### idea-typography-02

**縦書きレイアウト**  ・  状態：企画段階
関連案：[博物館・美術館サイト](#idea-use-cases-04)

### idea-typography-03

**見出しの文字サイズ設計**  ・  状態：企画段階
関連案：[段階的な情報開示](#idea-information-10) / [視覚的な情報階層の改善前後](#idea-review-06)

### idea-typography-04

**可変フォント**  ・  状態：企画段階
関連案：[ウェイトによる情報の階層化](#idea-typography-10)

### idea-typography-05

**長文の行長と行間**  ・  状態：企画段階
関連案：[出典・引用の表示](#idea-information-02) / [メディア・記事サイト](#idea-use-cases-10)

### idea-typography-06

**ルビ・ふりがな**  ・  状態：企画段階
関連案：[スクリーンリーダー向けの見出し構造](#idea-accessibility-06)

### idea-typography-07

**日本語の禁則処理**  ・  状態：企画段階
関連案：[文字拡大・200%ズーム](#idea-accessibility-04)

### idea-typography-08

**数字の等幅表示**  ・  状態：企画段階
関連案：[スパークライン](#idea-data-viz-04)

### idea-typography-09

**明朝体とゴシック体の使い分け**  ・  状態：企画段階
関連案：[似た書体・スタイルの見分け方](#idea-review-08) / [ダークアカデミア](#idea-visual-history-11)
既存の関連項目：[エディトリアル（文字表現の比較）](https://fragmenta-brown.vercel.app/#/styles)

### idea-typography-10

**ウェイトによる情報の階層化**  ・  状態：企画段階
関連案：[視覚的な情報階層の改善前後](#idea-review-06) / [可変フォント](#idea-typography-04)

### idea-typography-11

**日本語・英語併記の組版**  ・  状態：企画段階
関連案：[右から左に読む言語への対応](#idea-accessibility-12) / [日本語・英語の別名・同義語辞書](#idea-ai-reference-03) / [Fluent](#idea-design-systems-03) / [日本語と欧文の混植](#idea-typography-01) / [オンライン学習サイト](#idea-use-cases-03)

### idea-typography-12

**小画面での長い見出しの処理**  ・  状態：企画段階
関連案：[文字拡大・200%ズーム](#idea-accessibility-04)

## category-color

**配色・質感・視覚表現**（12案）

- [モノクローム配色](#idea-color-01)
- [類似色配色](#idea-color-02)
- [補色配色](#idea-color-03)
- [分割補色配色](#idea-color-04)
- [デュオトーン](#idea-color-05)
- [ライトモードとダークモード](#idea-color-06)
- [状態を伝える色の使い分け](#idea-color-07)
- [色覚多様性を考慮した配色](#idea-color-08)
- [ハーフトーン表現](#idea-color-09)
- [ノイズ・紙の質感](#idea-color-10)
- [グラデーションの設計](#idea-color-11)
- [影・輪郭線・透明度の組み合わせ](#idea-color-12)

### idea-color-01

**モノクローム配色**  ・  状態：企画段階
関連案：[コントラスト不足の改善例](#idea-review-03) / [配色の失敗と修正](#idea-review-11)

### idea-color-02

**類似色配色**  ・  状態：企画段階
関連案：[医療・健康情報サイト](#idea-use-cases-11) / [ミッドセンチュリー・モダン](#idea-visual-history-03) / [コテージコア](#idea-visual-history-12)

### idea-color-03

**補色配色**  ・  状態：企画段階
関連案：[配色の失敗と修正](#idea-review-11) / [ポップアート](#idea-visual-history-05)

### idea-color-04

**分割補色配色**  ・  状態：企画段階
関連案：[アイコンと文字の併用](#idea-accessibility-07)

### idea-color-05

**デュオトーン**  ・  状態：企画段階
関連案：[メディア・記事サイト](#idea-use-cases-10)

### idea-color-06

**ライトモードとダークモード**  ・  状態：企画段階
関連案：[OSの強制配色モードへの対応](#idea-accessibility-10) / [色・文字・余白などのデザイントークン](#idea-ai-reference-04)

### idea-color-07

**状態を伝える色の使い分け**  ・  状態：企画段階
関連案：[アイコンと文字の併用](#idea-accessibility-07)

### idea-color-08

**色覚多様性を考慮した配色**  ・  状態：企画段階
関連案：[アイコンと文字の併用](#idea-accessibility-07) / [配色の失敗と修正](#idea-review-11)

### idea-color-09

**ハーフトーン表現**  ・  状態：企画段階
関連案：[オプ・アート](#idea-visual-history-06)

### idea-color-10

**ノイズ・紙の質感**  ・  状態：企画段階
関連案：[アーツ・アンド・クラフツ](#idea-visual-history-04) / [グランジ](#idea-visual-history-08)

### idea-color-11

**グラデーションの設計**  ・  状態：企画段階
関連案：[スクロール連動の視覚効果](#idea-motion-04) / [サイケデリック・アート](#idea-visual-history-07)

### idea-color-12

**影・輪郭線・透明度の組み合わせ**  ・  状態：企画段階
関連案：[異なるスタイルの組み合わせ失敗例](#idea-review-12)
既存の関連項目：[グラスモーフィズム（質感の例）](https://fragmenta-brown.vercel.app/#/styles)

## category-components

**UIコンポーネント・ナビゲーション**（12案）

- [メガメニュー](#idea-components-01)
- [コンボボックス](#idea-components-02)
- [日付・時刻ピッカー](#idea-components-03)
- [ツリービュー](#idea-components-04)
- [ステッパー](#idea-components-05)
- [ページネーション](#idea-components-06)
- [インライン編集](#idea-components-07)
- [スプリットボタン](#idea-components-08)
- [カルーセル](#idea-components-09)
- [階層型サイドナビゲーション](#idea-components-10)
- [ステータスバナー](#idea-components-11)
- [権限に応じたアクションメニュー](#idea-components-12)

### idea-components-01

**メガメニュー**  ・  状態：企画段階
関連案：[Material Design](#idea-design-systems-01) / [作業別ナビゲーション](#idea-information-09) / [ナビゲーションの状態変化](#idea-motion-02)

### idea-components-02

**コンボボックス**  ・  状態：企画段階
関連案：[必須・任意項目の表示](#idea-forms-07)

### idea-components-03

**日付・時刻ピッカー**  ・  状態：企画段階
関連案：[日本の住所入力](#idea-forms-02)

### idea-components-04

**ツリービュー**  ・  状態：企画段階
関連案：[マスター・ディテール型](#idea-layout-01)

### idea-components-05

**ステッパー**  ・  状態：企画段階
関連案：[複数ステップの申請フォーム](#idea-forms-01)

### idea-components-06

**ページネーション**  ・  状態：企画段階
関連案：[検索結果のグルーピング](#idea-information-11)

### idea-components-07

**インライン編集**  ・  状態：企画段階
関連案：[AIが提案したコードの差分表示](#idea-ai-ui-08) / [ドラッグによる並べ替え](#idea-motion-10)

### idea-components-08

**スプリットボタン**  ・  状態：企画段階
関連案：[タッチ操作領域の確保](#idea-accessibility-05) / [重要な操作の再確認](#idea-forms-10) / [操作フィードバックの微細な動き](#idea-motion-12)

### idea-components-09

**カルーセル**  ・  状態：企画段階
関連案：[横スクロールギャラリー型](#idea-layout-09)

### idea-components-10

**階層型サイドナビゲーション**  ・  状態：企画段階
関連案：[キーボード操作とフォーカス](#idea-accessibility-01) / [作業別ナビゲーション](#idea-information-09) / [固定サイドバー型](#idea-layout-03)

### idea-components-11

**ステータスバナー**  ・  状態：企画段階
関連案：[Salesforce Lightning Design System](#idea-design-systems-09) / [セッション期限切れの案内](#idea-forms-11)

### idea-components-12

**権限に応じたアクションメニュー**  ・  状態：企画段階
関連案：[AIの操作に対する人間の承認画面](#idea-ai-ui-01) / [AIモデルの選択画面](#idea-ai-ui-06)

## category-forms

**フォーム・ユーザー操作の流れ**（12案）

- [複数ステップの申請フォーム](#idea-forms-01)
- [日本の住所入力](#idea-forms-02)
- [入力内容の確認・修正画面](#idea-forms-03)
- [入力途中の保存と再開](#idea-forms-04)
- [条件分岐する質問フォーム](#idea-forms-05)
- [入力エラーからの復帰](#idea-forms-06)
- [必須・任意項目の表示](#idea-forms-07)
- [同意・確認の取得](#idea-forms-08)
- [削除操作の確認](#idea-forms-09)
- [重要な操作の再確認](#idea-forms-10)
- [セッション期限切れの案内](#idea-forms-11)
- [完了後の次の行動の提示](#idea-forms-12)

### idea-forms-01

**複数ステップの申請フォーム**  ・  状態：企画段階
関連案：[ステッパー](#idea-components-05) / [入力内容の確認・修正画面](#idea-forms-03) / [自治体の電子申請サイト](#idea-use-cases-01)

### idea-forms-02

**日本の住所入力**  ・  状態：企画段階
関連案：[日付・時刻ピッカー](#idea-components-03) / [自治体の電子申請サイト](#idea-use-cases-01) / [旅行計画サイト](#idea-use-cases-12)

### idea-forms-03

**入力内容の確認・修正画面**  ・  状態：企画段階
関連案：[Shopify Polaris](#idea-design-systems-07) / [複数ステップの申請フォーム](#idea-forms-01)

### idea-forms-04

**入力途中の保存と再開**  ・  状態：企画段階
関連案：[セッション期限切れの案内](#idea-forms-11)

### idea-forms-05

**条件分岐する質問フォーム**  ・  状態：企画段階
関連案：[判断フローチャート](#idea-information-05)

### idea-forms-06

**入力エラーからの復帰**  ・  状態：企画段階
関連案：[エラー通知のアクセシビリティ](#idea-accessibility-08) / [エラー表示の悪い例・良い例](#idea-review-10)
既存の関連項目：[入力エラーの実装例](https://fragmenta-brown.vercel.app/#/p/inline-validation)

### idea-forms-07

**必須・任意項目の表示**  ・  状態：企画段階
関連案：[認知負荷を抑えた画面構成](#idea-accessibility-11) / [コンボボックス](#idea-components-02)

### idea-forms-08

**同意・確認の取得**  ・  状態：企画段階
関連案：[AIの操作に対する人間の承認画面](#idea-ai-ui-01) / [ダークパターンと適切なUI](#idea-review-09)

### idea-forms-09

**削除操作の確認**  ・  状態：企画段階
関連案：[重要な操作の再確認](#idea-forms-10)

### idea-forms-10

**重要な操作の再確認**  ・  状態：企画段階
関連案：[AIの操作に対する人間の承認画面](#idea-ai-ui-01) / [スプリットボタン](#idea-components-08) / [削除操作の確認](#idea-forms-09)

### idea-forms-11

**セッション期限切れの案内**  ・  状態：企画段階
関連案：[失敗時の再試行・修正](#idea-ai-ui-10) / [ステータスバナー](#idea-components-11) / [入力途中の保存と再開](#idea-forms-04)

### idea-forms-12

**完了後の次の行動の提示**  ・  状態：企画段階
関連案：[ステップ別の操作ガイド](#idea-information-06)

## category-motion

**アニメーション・動きの設計**（12案）

- [ページ遷移アニメーション](#idea-motion-01)
- [ナビゲーションの状態変化](#idea-motion-02)
- [コンテンツの出現・退出](#idea-motion-03)
- [スクロール連動の視覚効果](#idea-motion-04)
- [形状のモーフィング](#idea-motion-05)
- [アニメーションの速度と緩急](#idea-motion-06)
- [数値のカウントアップ](#idea-motion-07)
- [グラフのアニメーション](#idea-motion-08)
- [読み込み進捗の表現](#idea-motion-09)
- [ドラッグによる並べ替え](#idea-motion-10)
- [動きを減らした代替表現](#idea-motion-11)
- [操作フィードバックの微細な動き](#idea-motion-12)

### idea-motion-01

**ページ遷移アニメーション**  ・  状態：企画段階
関連案：[全画面セクション型](#idea-layout-06) / [コンテンツの出現・退出](#idea-motion-03)

### idea-motion-02

**ナビゲーションの状態変化**  ・  状態：企画段階
関連案：[メガメニュー](#idea-components-01)

### idea-motion-03

**コンテンツの出現・退出**  ・  状態：企画段階
関連案：[ページ遷移アニメーション](#idea-motion-01) / [動きを減らした代替表現](#idea-motion-11)

### idea-motion-04

**スクロール連動の視覚効果**  ・  状態：企画段階
関連案：[動きを減らす設定への対応](#idea-accessibility-09) / [グラデーションの設計](#idea-color-11) / [アニメーション過多の改善例](#idea-review-04)

### idea-motion-05

**形状のモーフィング**  ・  状態：企画段階
関連案：[デ・ステイル](#idea-visual-history-02)
既存の関連項目：[形状変化の実装例](https://fragmenta-brown.vercel.app/#/p/morph-fab)

### idea-motion-06

**アニメーションの速度と緩急**  ・  状態：企画段階
関連案：[アニメーション過多の改善例](#idea-review-04)

### idea-motion-07

**数値のカウントアップ**  ・  状態：企画段階
関連案：[箱ひげ図](#idea-data-viz-07)

### idea-motion-08

**グラフのアニメーション**  ・  状態：企画段階
関連案：[折れ線グラフ](#idea-data-viz-03)

### idea-motion-09

**読み込み進捗の表現**  ・  状態：企画段階
関連案：[ツール実行状況の表示](#idea-ai-ui-02)
既存の関連項目：[読み込み状態の実装例](https://fragmenta-brown.vercel.app/#/p/smart-skeleton)

### idea-motion-10

**ドラッグによる並べ替え**  ・  状態：企画段階
関連案：[インライン編集](#idea-components-07)

### idea-motion-11

**動きを減らした代替表現**  ・  状態：企画段階
関連案：[動きを減らす設定への対応](#idea-accessibility-09) / [コンテンツの出現・退出](#idea-motion-03)

### idea-motion-12

**操作フィードバックの微細な動き**  ・  状態：企画段階
関連案：[スプリットボタン](#idea-components-08)

## category-data-viz

**グラフ・データ可視化**（12案）

- [棒グラフ](#idea-data-viz-01)
- [積み上げ棒グラフ](#idea-data-viz-02)
- [折れ線グラフ](#idea-data-viz-03)
- [スパークライン](#idea-data-viz-04)
- [散布図](#idea-data-viz-05)
- [ヒストグラム](#idea-data-viz-06)
- [箱ひげ図](#idea-data-viz-07)
- [ヒートマップ](#idea-data-viz-08)
- [ツリーマップ](#idea-data-viz-09)
- [ウォーターフォールチャート](#idea-data-viz-10)
- [ファネルチャート](#idea-data-viz-11)
- [信頼区間・不確実性の可視化](#idea-data-viz-12)

### idea-data-viz-01

**棒グラフ**  ・  状態：企画段階
関連案：[使用量・制限の表示](#idea-ai-ui-05) / [積み上げ棒グラフ](#idea-data-viz-02) / [Carbon Design System](#idea-design-systems-02) / [SaaS管理画面](#idea-use-cases-07) / [金融情報ダッシュボード](#idea-use-cases-08)
既存の関連項目：[数値の表示パターン](https://fragmenta-brown.vercel.app/#/p/metric-summary)

### idea-data-viz-02

**積み上げ棒グラフ**  ・  状態：企画段階
関連案：[棒グラフ](#idea-data-viz-01) / [ウォーターフォールチャート](#idea-data-viz-10)

### idea-data-viz-03

**折れ線グラフ**  ・  状態：企画段階
関連案：[スパークライン](#idea-data-viz-04) / [信頼区間・不確実性の可視化](#idea-data-viz-12) / [グラフのアニメーション](#idea-motion-08)

### idea-data-viz-04

**スパークライン**  ・  状態：企画段階
関連案：[折れ線グラフ](#idea-data-viz-03) / [情報密度の調整](#idea-review-07) / [数字の等幅表示](#idea-typography-08) / [金融情報ダッシュボード](#idea-use-cases-08)
既存の関連項目：[小さな指標表示の参考](https://fragmenta-brown.vercel.app/#/p/metric-summary)

### idea-data-viz-05

**散布図**  ・  状態：企画段階
関連案：[ヒストグラム](#idea-data-viz-06) / [ヒートマップ](#idea-data-viz-08)

### idea-data-viz-06

**ヒストグラム**  ・  状態：企画段階
関連案：[散布図](#idea-data-viz-05) / [箱ひげ図](#idea-data-viz-07)

### idea-data-viz-07

**箱ひげ図**  ・  状態：企画段階
関連案：[ヒストグラム](#idea-data-viz-06) / [信頼区間・不確実性の可視化](#idea-data-viz-12) / [数値のカウントアップ](#idea-motion-07)

### idea-data-viz-08

**ヒートマップ**  ・  状態：企画段階
関連案：[散布図](#idea-data-viz-05)

### idea-data-viz-09

**ツリーマップ**  ・  状態：企画段階
関連案：[タイル型ポータル](#idea-layout-05)

### idea-data-viz-10

**ウォーターフォールチャート**  ・  状態：企画段階
関連案：[積み上げ棒グラフ](#idea-data-viz-02)

### idea-data-viz-11

**ファネルチャート**  ・  状態：企画段階
関連案：[EC・商品販売サイト](#idea-use-cases-06)

### idea-data-viz-12

**信頼区間・不確実性の可視化**  ・  状態：企画段階
関連案：[不確実性の伝え方](#idea-ai-ui-07) / [折れ線グラフ](#idea-data-viz-03) / [箱ひげ図](#idea-data-viz-07)

## category-information

**情報設計・読みやすいコンテンツ**（12案）

- [用語集・定義の表示](#idea-information-01)
- [出典・引用の表示](#idea-information-02)
- [文書の改訂履歴](#idea-information-03)
- [関連情報の推薦](#idea-information-04)
- [判断フローチャート](#idea-information-05)
- [ステップ別の操作ガイド](#idea-information-06)
- [インラインヘルプ](#idea-information-07)
- [根拠・証拠の比較表示](#idea-information-08)
- [作業別ナビゲーション](#idea-information-09)
- [段階的な情報開示](#idea-information-10)
- [検索結果のグルーピング](#idea-information-11)
- [複雑な規則の条件・例外表示](#idea-information-12)

### idea-information-01

**用語集・定義の表示**  ・  状態：企画段階
関連案：[スタイルごとのMarkdown参照資料](#idea-ai-reference-02) / [インラインヘルプ](#idea-information-07)

### idea-information-02

**出典・引用の表示**  ・  状態：企画段階
関連案：[出典・ライセンス・更新履歴](#idea-ai-reference-11) / [AI回答の出典表示](#idea-ai-ui-03) / [3カラムのドキュメント型](#idea-layout-04) / [長文の行長と行間](#idea-typography-05) / [学術論文の検索サイト](#idea-use-cases-05)
既存の関連項目：[出典のある読み物の例](https://fragmenta-brown.vercel.app/#/p/readable-article)

### idea-information-03

**文書の改訂履歴**  ・  状態：企画段階
関連案：[AIの操作履歴](#idea-ai-ui-09) / [SAP Fiori](#idea-design-systems-11)

### idea-information-04

**関連情報の推薦**  ・  状態：企画段階
関連案：[関連・対照スタイルの参照情報](#idea-ai-reference-07) / [コミュニティサイト](#idea-use-cases-09)

### idea-information-05

**判断フローチャート**  ・  状態：企画段階
関連案：[条件分岐する質問フォーム](#idea-forms-05) / [法令・制度の情報サイト](#idea-use-cases-02)

### idea-information-06

**ステップ別の操作ガイド**  ・  状態：企画段階
関連案：[完了後の次の行動の提示](#idea-forms-12)

### idea-information-07

**インラインヘルプ**  ・  状態：企画段階
関連案：[認知負荷を抑えた画面構成](#idea-accessibility-11) / [用語集・定義の表示](#idea-information-01)

### idea-information-08

**根拠・証拠の比較表示**  ・  状態：企画段階
関連案：[不確実性の伝え方](#idea-ai-ui-07) / [AIに渡す資料・権限の管理](#idea-ai-ui-12)

### idea-information-09

**作業別ナビゲーション**  ・  状態：企画段階
関連案：[メガメニュー](#idea-components-01) / [階層型サイドナビゲーション](#idea-components-10)
既存の関連項目：[ナビゲーションの実装例](https://fragmenta-brown.vercel.app/#/p/breadcrumb-trail)

### idea-information-10

**段階的な情報開示**  ・  状態：企画段階
関連案：[認知負荷を抑えた画面構成](#idea-accessibility-11) / [見出しの文字サイズ設計](#idea-typography-03)

### idea-information-11

**検索結果のグルーピング**  ・  状態：企画段階
関連案：[ページネーション](#idea-components-06) / [マスター・ディテール型](#idea-layout-01)

### idea-information-12

**複雑な規則の条件・例外表示**  ・  状態：企画段階
関連案：[法令・制度の情報サイト](#idea-use-cases-02)

## category-accessibility

**アクセシビリティ・使いやすさ**（12案）

- [キーボード操作とフォーカス](#idea-accessibility-01)
- [スキップリンク](#idea-accessibility-02)
- [高コントラスト表示](#idea-accessibility-03)
- [文字拡大・200%ズーム](#idea-accessibility-04)
- [タッチ操作領域の確保](#idea-accessibility-05)
- [スクリーンリーダー向けの見出し構造](#idea-accessibility-06)
- [アイコンと文字の併用](#idea-accessibility-07)
- [エラー通知のアクセシビリティ](#idea-accessibility-08)
- [動きを減らす設定への対応](#idea-accessibility-09)
- [OSの強制配色モードへの対応](#idea-accessibility-10)
- [認知負荷を抑えた画面構成](#idea-accessibility-11)
- [右から左に読む言語への対応](#idea-accessibility-12)

### idea-accessibility-01

**キーボード操作とフォーカス**  ・  状態：企画段階
関連案：[階層型サイドナビゲーション](#idea-components-10) / [Ant Design](#idea-design-systems-12)

### idea-accessibility-02

**スキップリンク**  ・  状態：企画段階
関連案：[固定サイドバー型](#idea-layout-03)

### idea-accessibility-03

**高コントラスト表示**  ・  状態：企画段階
関連案：[U.S. Web Design System](#idea-design-systems-06) / [コントラスト不足の改善例](#idea-review-03) / [オプ・アート](#idea-visual-history-06)

### idea-accessibility-04

**文字拡大・200%ズーム**  ・  状態：企画段階
関連案：[日本語の禁則処理](#idea-typography-07) / [小画面での長い見出しの処理](#idea-typography-12)

### idea-accessibility-05

**タッチ操作領域の確保**  ・  状態：企画段階
関連案：[スプリットボタン](#idea-components-08) / [Apple Human Interface Guidelines](#idea-design-systems-04)

### idea-accessibility-06

**スクリーンリーダー向けの見出し構造**  ・  状態：企画段階
関連案：[ルビ・ふりがな](#idea-typography-06)

### idea-accessibility-07

**アイコンと文字の併用**  ・  状態：企画段階
関連案：[分割補色配色](#idea-color-04) / [状態を伝える色の使い分け](#idea-color-07) / [色覚多様性を考慮した配色](#idea-color-08) / [医療・健康情報サイト](#idea-use-cases-11)

### idea-accessibility-08

**エラー通知のアクセシビリティ**  ・  状態：企画段階
関連案：[入力エラーからの復帰](#idea-forms-06)

### idea-accessibility-09

**動きを減らす設定への対応**  ・  状態：企画段階
関連案：[スクロール連動の視覚効果](#idea-motion-04) / [動きを減らした代替表現](#idea-motion-11)
既存の関連項目：[継続アニメーションの注意点](https://fragmenta-brown.vercel.app/#/p/glitch-text)

### idea-accessibility-10

**OSの強制配色モードへの対応**  ・  状態：企画段階
関連案：[ライトモードとダークモード](#idea-color-06)

### idea-accessibility-11

**認知負荷を抑えた画面構成**  ・  状態：企画段階
関連案：[必須・任意項目の表示](#idea-forms-07) / [インラインヘルプ](#idea-information-07) / [段階的な情報開示](#idea-information-10) / [美しい画面と使いやすい画面の違い](#idea-review-02)

### idea-accessibility-12

**右から左に読む言語への対応**  ・  状態：企画段階
関連案：[日本語・英語併記の組版](#idea-typography-11)

## category-ai-ui

**AIアプリ特有のUI**（12案）

- [AIの操作に対する人間の承認画面](#idea-ai-ui-01)
- [ツール実行状況の表示](#idea-ai-ui-02)
- [AI回答の出典表示](#idea-ai-ui-03)
- [JSONなどの構造化出力の表示](#idea-ai-ui-04)
- [使用量・制限の表示](#idea-ai-ui-05)
- [AIモデルの選択画面](#idea-ai-ui-06)
- [不確実性の伝え方](#idea-ai-ui-07)
- [AIが提案したコードの差分表示](#idea-ai-ui-08)
- [AIの操作履歴](#idea-ai-ui-09)
- [失敗時の再試行・修正](#idea-ai-ui-10)
- [AIメモリの確認・制御](#idea-ai-ui-11)
- [AIに渡す資料・権限の管理](#idea-ai-ui-12)

### idea-ai-ui-01

**AIの操作に対する人間の承認画面**  ・  状態：企画段階
関連案：[AIに渡す資料・権限の管理](#idea-ai-ui-12) / [権限に応じたアクションメニュー](#idea-components-12) / [同意・確認の取得](#idea-forms-08) / [重要な操作の再確認](#idea-forms-10)

### idea-ai-ui-02

**ツール実行状況の表示**  ・  状態：企画段階
関連案：[読み込み進捗の表現](#idea-motion-09)

### idea-ai-ui-03

**AI回答の出典表示**  ・  状態：企画段階
関連案：[出典・引用の表示](#idea-information-02)

### idea-ai-ui-04

**JSONなどの構造化出力の表示**  ・  状態：企画段階
関連案：[スタイル定義のJSON](#idea-ai-reference-01) / [サンプル実装と検証条件](#idea-ai-reference-10) / [画面分割型ワークスペース](#idea-layout-11)

### idea-ai-ui-05

**使用量・制限の表示**  ・  状態：企画段階
関連案：[棒グラフ](#idea-data-viz-01)

### idea-ai-ui-06

**AIモデルの選択画面**  ・  状態：企画段階
関連案：[権限に応じたアクションメニュー](#idea-components-12)

### idea-ai-ui-07

**不確実性の伝え方**  ・  状態：企画段階
関連案：[信頼区間・不確実性の可視化](#idea-data-viz-12) / [根拠・証拠の比較表示](#idea-information-08)

### idea-ai-ui-08

**AIが提案したコードの差分表示**  ・  状態：企画段階
関連案：[インライン編集](#idea-components-07) / [GitHub Primer](#idea-design-systems-08) / [複数パネルの編集画面](#idea-layout-10) / [視覚的な情報階層の改善前後](#idea-review-06)

### idea-ai-ui-09

**AIの操作履歴**  ・  状態：企画段階
関連案：[文書の改訂履歴](#idea-information-03)

### idea-ai-ui-10

**失敗時の再試行・修正**  ・  状態：企画段階
関連案：[セッション期限切れの案内](#idea-forms-11)

### idea-ai-ui-11

**AIメモリの確認・制御**  ・  状態：企画段階
関連案：[AIに渡す資料・権限の管理](#idea-ai-ui-12)

### idea-ai-ui-12

**AIに渡す資料・権限の管理**  ・  状態：企画段階
関連案：[AIの操作に対する人間の承認画面](#idea-ai-ui-01) / [AIメモリの確認・制御](#idea-ai-ui-11) / [根拠・証拠の比較表示](#idea-information-08)

## category-use-cases

**用途別のデザイン実例**（12案）

- [自治体の電子申請サイト](#idea-use-cases-01)
- [法令・制度の情報サイト](#idea-use-cases-02)
- [オンライン学習サイト](#idea-use-cases-03)
- [博物館・美術館サイト](#idea-use-cases-04)
- [学術論文の検索サイト](#idea-use-cases-05)
- [EC・商品販売サイト](#idea-use-cases-06)
- [SaaS管理画面](#idea-use-cases-07)
- [金融情報ダッシュボード](#idea-use-cases-08)
- [コミュニティサイト](#idea-use-cases-09)
- [メディア・記事サイト](#idea-use-cases-10)
- [医療・健康情報サイト](#idea-use-cases-11)
- [旅行計画サイト](#idea-use-cases-12)

### idea-use-cases-01

**自治体の電子申請サイト**  ・  状態：企画段階
関連案：[GOV.UK Design System](#idea-design-systems-05) / [複数ステップの申請フォーム](#idea-forms-01) / [日本の住所入力](#idea-forms-02)

### idea-use-cases-02

**法令・制度の情報サイト**  ・  状態：企画段階
関連案：[用途と制約に基づく適合性の一覧](#idea-ai-reference-05) / [判断フローチャート](#idea-information-05) / [複雑な規則の条件・例外表示](#idea-information-12)
既存の関連項目：[長い制度解説の目次例](https://fragmenta-brown.vercel.app/#/p/article-table-of-contents)

### idea-use-cases-03

**オンライン学習サイト**  ・  状態：企画段階
関連案：[日本語・英語併記の組版](#idea-typography-11)

### idea-use-cases-04

**博物館・美術館サイト**  ・  状態：企画段階
関連案：[メーソンリー型](#idea-layout-02) / [縦書きレイアウト](#idea-typography-02) / [アール・ヌーヴォー](#idea-visual-history-01) / [ソーラーパンク](#idea-visual-history-10)

### idea-use-cases-05

**学術論文の検索サイト**  ・  状態：企画段階
関連案：[出典・引用の表示](#idea-information-02)

### idea-use-cases-06

**EC・商品販売サイト**  ・  状態：企画段階
関連案：[ファネルチャート](#idea-data-viz-11) / [ヒーロー＋特徴紹介型](#idea-layout-07)

### idea-use-cases-07

**SaaS管理画面**  ・  状態：企画段階
関連案：[棒グラフ](#idea-data-viz-01)

### idea-use-cases-08

**金融情報ダッシュボード**  ・  状態：企画段階
関連案：[棒グラフ](#idea-data-viz-01) / [スパークライン](#idea-data-viz-04)

### idea-use-cases-09

**コミュニティサイト**  ・  状態：企画段階
関連案：[関連情報の推薦](#idea-information-04)

### idea-use-cases-10

**メディア・記事サイト**  ・  状態：企画段階
関連案：[画面用途別のAIプロンプト](#idea-ai-reference-09) / [デュオトーン](#idea-color-05) / [長文の行長と行間](#idea-typography-05)
既存の関連項目：[読み物レイアウトの例](https://fragmenta-brown.vercel.app/#/p/readable-article)

### idea-use-cases-11

**医療・健康情報サイト**  ・  状態：企画段階
関連案：[アイコンと文字の併用](#idea-accessibility-07) / [類似色配色](#idea-color-02)

### idea-use-cases-12

**旅行計画サイト**  ・  状態：企画段階
関連案：[日本の住所入力](#idea-forms-02)

## category-design-systems

**既存デザインシステムの比較資料**（12案）

- [Material Design](#idea-design-systems-01)
- [Carbon Design System](#idea-design-systems-02)
- [Fluent](#idea-design-systems-03)
- [Apple Human Interface Guidelines](#idea-design-systems-04)
- [GOV.UK Design System](#idea-design-systems-05)
- [U.S. Web Design System](#idea-design-systems-06)
- [Shopify Polaris](#idea-design-systems-07)
- [GitHub Primer](#idea-design-systems-08)
- [Salesforce Lightning Design System](#idea-design-systems-09)
- [Atlassian Design System](#idea-design-systems-10)
- [SAP Fiori](#idea-design-systems-11)
- [Ant Design](#idea-design-systems-12)

### idea-design-systems-01

**Material Design**  ・  状態：企画段階
関連案：[メガメニュー](#idea-components-01)

### idea-design-systems-02

**Carbon Design System**  ・  状態：企画段階
関連案：[棒グラフ](#idea-data-viz-01)

### idea-design-systems-03

**Fluent**  ・  状態：企画段階
関連案：[日本語・英語併記の組版](#idea-typography-11)

### idea-design-systems-04

**Apple Human Interface Guidelines**  ・  状態：企画段階
関連案：[タッチ操作領域の確保](#idea-accessibility-05)

### idea-design-systems-05

**GOV.UK Design System**  ・  状態：企画段階
関連案：[自治体の電子申請サイト](#idea-use-cases-01)

### idea-design-systems-06

**U.S. Web Design System**  ・  状態：企画段階
関連案：[高コントラスト表示](#idea-accessibility-03)

### idea-design-systems-07

**Shopify Polaris**  ・  状態：企画段階
関連案：[入力内容の確認・修正画面](#idea-forms-03)

### idea-design-systems-08

**GitHub Primer**  ・  状態：企画段階
関連案：[AIが提案したコードの差分表示](#idea-ai-ui-08)

### idea-design-systems-09

**Salesforce Lightning Design System**  ・  状態：企画段階
関連案：[ステータスバナー](#idea-components-11)

### idea-design-systems-10

**Atlassian Design System**  ・  状態：企画段階
関連案：[複数パネルの編集画面](#idea-layout-10)

### idea-design-systems-11

**SAP Fiori**  ・  状態：企画段階
関連案：[文書の改訂履歴](#idea-information-03)

### idea-design-systems-12

**Ant Design**  ・  状態：企画段階
関連案：[キーボード操作とフォーカス](#idea-accessibility-01)

## category-review

**デザインの比較・判断・失敗例**（12案）

- [ミニマリズムと情報不足の違い](#idea-review-01)
- [美しい画面と使いやすい画面の違い](#idea-review-02)
- [コントラスト不足の改善例](#idea-review-03)
- [アニメーション過多の改善例](#idea-review-04)
- [スマホで崩れるレイアウトの修正](#idea-review-05)
- [視覚的な情報階層の改善前後](#idea-review-06)
- [情報密度の調整](#idea-review-07)
- [似た書体・スタイルの見分け方](#idea-review-08)
- [ダークパターンと適切なUI](#idea-review-09)
- [エラー表示の悪い例・良い例](#idea-review-10)
- [配色の失敗と修正](#idea-review-11)
- [異なるスタイルの組み合わせ失敗例](#idea-review-12)

### idea-review-01

**ミニマリズムと情報不足の違い**  ・  状態：企画段階
関連案：[高密度・低密度ダッシュボード比較](#idea-layout-12)

### idea-review-02

**美しい画面と使いやすい画面の違い**  ・  状態：企画段階
関連案：[認知負荷を抑えた画面構成](#idea-accessibility-11)

### idea-review-03

**コントラスト不足の改善例**  ・  状態：企画段階
関連案：[高コントラスト表示](#idea-accessibility-03) / [モノクローム配色](#idea-color-01)
既存の関連項目：[文字の読みやすさの比較](https://fragmenta-brown.vercel.app/#/p/readable-article)

### idea-review-04

**アニメーション過多の改善例**  ・  状態：企画段階
関連案：[スクロール連動の視覚効果](#idea-motion-04) / [アニメーションの速度と緩急](#idea-motion-06)

### idea-review-05

**スマホで崩れるレイアウトの修正**  ・  状態：企画段階
関連案：[3カラムのドキュメント型](#idea-layout-04)

### idea-review-06

**視覚的な情報階層の改善前後**  ・  状態：企画段階
関連案：[AIが提案したコードの差分表示](#idea-ai-ui-08) / [見出しの文字サイズ設計](#idea-typography-03) / [ウェイトによる情報の階層化](#idea-typography-10)

### idea-review-07

**情報密度の調整**  ・  状態：企画段階
関連案：[スパークライン](#idea-data-viz-04) / [高密度・低密度ダッシュボード比較](#idea-layout-12)

### idea-review-08

**似た書体・スタイルの見分け方**  ・  状態：企画段階
関連案：[明朝体とゴシック体の使い分け](#idea-typography-09)

### idea-review-09

**ダークパターンと適切なUI**  ・  状態：企画段階
関連案：[同意・確認の取得](#idea-forms-08)

### idea-review-10

**エラー表示の悪い例・良い例**  ・  状態：企画段階
関連案：[入力エラーからの復帰](#idea-forms-06)

### idea-review-11

**配色の失敗と修正**  ・  状態：企画段階
関連案：[モノクローム配色](#idea-color-01) / [補色配色](#idea-color-03) / [色覚多様性を考慮した配色](#idea-color-08)

### idea-review-12

**異なるスタイルの組み合わせ失敗例**  ・  状態：企画段階
関連案：[非推奨の表現・条件](#idea-ai-reference-06) / [A/Bデザイン組み合わせのレシピ](#idea-ai-reference-08) / [影・輪郭線・透明度の組み合わせ](#idea-color-12)

## category-ai-reference

**AIが利用するためのデータ・テンプレート**（12案）

- [スタイル定義のJSON](#idea-ai-reference-01)
- [スタイルごとのMarkdown参照資料](#idea-ai-reference-02)
- [日本語・英語の別名・同義語辞書](#idea-ai-reference-03)
- [色・文字・余白などのデザイントークン](#idea-ai-reference-04)
- [用途と制約に基づく適合性の一覧](#idea-ai-reference-05)
- [非推奨の表現・条件](#idea-ai-reference-06)
- [関連・対照スタイルの参照情報](#idea-ai-reference-07)
- [A/Bデザイン組み合わせのレシピ](#idea-ai-reference-08)
- [画面用途別のAIプロンプト](#idea-ai-reference-09)
- [サンプル実装と検証条件](#idea-ai-reference-10)
- [出典・ライセンス・更新履歴](#idea-ai-reference-11)
- [AI向けの検索・取得用インデックス](#idea-ai-reference-12)

### idea-ai-reference-01

**スタイル定義のJSON**  ・  状態：企画段階
関連案：[AI向けの検索・取得用インデックス](#idea-ai-reference-12) / [JSONなどの構造化出力の表示](#idea-ai-ui-04) / [デ・ステイル](#idea-visual-history-02)
既存の関連項目：[既存のスタイル定義例](https://fragmenta-brown.vercel.app/#/styles)

### idea-ai-reference-02

**スタイルごとのMarkdown参照資料**  ・  状態：企画段階
関連案：[用語集・定義の表示](#idea-information-01)

### idea-ai-reference-03

**日本語・英語の別名・同義語辞書**  ・  状態：企画段階
関連案：[日本語・英語併記の組版](#idea-typography-11)

### idea-ai-reference-04

**色・文字・余白などのデザイントークン**  ・  状態：企画段階
関連案：[ライトモードとダークモード](#idea-color-06)

### idea-ai-reference-05

**用途と制約に基づく適合性の一覧**  ・  状態：企画段階
関連案：[法令・制度の情報サイト](#idea-use-cases-02)

### idea-ai-reference-06

**非推奨の表現・条件**  ・  状態：企画段階
関連案：[異なるスタイルの組み合わせ失敗例](#idea-review-12)

### idea-ai-reference-07

**関連・対照スタイルの参照情報**  ・  状態：企画段階
関連案：[関連情報の推薦](#idea-information-04)

### idea-ai-reference-08

**A/Bデザイン組み合わせのレシピ**  ・  状態：企画段階
関連案：[異なるスタイルの組み合わせ失敗例](#idea-review-12)

### idea-ai-reference-09

**画面用途別のAIプロンプト**  ・  状態：企画段階
関連案：[メディア・記事サイト](#idea-use-cases-10)

### idea-ai-reference-10

**サンプル実装と検証条件**  ・  状態：企画段階
関連案：[JSONなどの構造化出力の表示](#idea-ai-ui-04)
既存の関連項目：[コード・実例の構造](https://fragmenta-brown.vercel.app/#/p/responsive-data-table)

### idea-ai-reference-11

**出典・ライセンス・更新履歴**  ・  状態：企画段階
関連案：[出典・引用の表示](#idea-information-02)

### idea-ai-reference-12

**AI向けの検索・取得用インデックス**  ・  状態：企画段階
関連案：[スタイル定義のJSON](#idea-ai-reference-01)

## 保存・運用方針

1. JSONを唯一の編集元とする。Markdownを変更する場合はJSONから再生成する。
2. 追加・統合・廃止時は参照先IDを検証し、リンク切れを作らない。
3. コンテンツ公開とコードの利用許諾、外部リンクの検証は別の受入項目として扱う。
4. 本番サイト・既存ルート・ビルドを変更しない。AI公開用のJSON配信/API/MCPは別途設計・受入する。
