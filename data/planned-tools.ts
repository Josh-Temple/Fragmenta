import { liveToolIds } from './live-tools';

// Retain the original ideas; publish only the entries that are still planned.
// Keep this registry separate from data/definitions.tsx and data/planned-patterns.ts.
export type PlannedToolCategory = 'writing' | 'development' | 'design' | 'content';

export interface PlannedTool {
  readonly id: string;
  readonly title: string;
  readonly titleJa: string;
  readonly category: PlannedToolCategory;
  readonly description: string;
  readonly purpose: string;
  readonly acceptance: readonly string[];
  readonly status: 'planned';
}

const proposedTools = [
  {
    "id": "tool-markdown-editor",
    "title": "Markdown Editor & Preview",
    "titleJa": "Markdownエディター・プレビュー",
    "category": "writing",
    "description": "Write Markdown, inspect a live preview, and export the result.",
    "purpose": "記事、メモ、手順書をMarkdownで作り、整形結果を確認する。",
    "acceptance": [
      "見出し、リスト、表、コードブロック、日本語のプレビュー",
      "安全に表示できるHTMLだけを扱い、入力とプレビューを区別",
      "モバイルとパソコンでのコピーとファイル出力、端末内で処理する旨の案内"
    ],
    "status": "planned"
  },
  {
    "id": "tool-text-diff",
    "title": "Text Diff Viewer",
    "titleJa": "テキスト差分比較",
    "category": "writing",
    "description": "Compare two versions of text or code and highlight changes.",
    "purpose": "文章やコードの修正前後を比較し、変更箇所を確認する。",
    "acceptance": [
      "追加、削除、変更のない部分を色と文字で識別",
      "日本語、複数行、長文を狭い画面でも比較",
      "両方の文章の編集とリセット、表示結果のコピーや出力"
    ],
    "status": "planned"
  },
  {
    "id": "tool-responsive-preview",
    "title": "Responsive Preview Tester",
    "titleJa": "レスポンシブ表示テスター",
    "category": "development",
    "description": "Inspect a supplied HTML/CSS example at multiple viewport widths.",
    "purpose": "スマホ・タブレット・PC幅で自作UIの表示を確認する。",
    "acceptance": [
      "スマートフォン、タブレット、パソコンの表示幅を切り替えて比較",
      "入力したHTMLをサイト本体から隔離してプレビュー",
      "模擬的な画面幅での確認と実機検証の違いを表示"
    ],
    "status": "planned"
  },
  {
    "id": "tool-color-contrast",
    "title": "Color & Contrast Checker",
    "titleJa": "配色・コントラストチェッカー",
    "category": "design",
    "description": "Adjust foreground and background colors and inspect their contrast.",
    "purpose": "文字色と背景色を比較し、読みやすさを判断する。",
    "acceptance": [
      "選んだ文字色と背景色のコントラスト比を計算",
      "通常の文字、大きな文字、文字以外について該当するAA・AAA基準を表示",
      "サンプル表示と色・CSSのコピー。コントラスト以外の適合状況は判定対象外"
    ],
    "status": "planned"
  },
  {
    "id": "tool-japanese-typography",
    "title": "Japanese Typography Playground",
    "titleJa": "日本語タイポグラフィ調整",
    "category": "design",
    "description": "Tune typography, spacing and readable width on realistic Japanese text.",
    "purpose": "日本語の読みやすい文字サイズ、行間、余白を試す。",
    "acceptance": [
      "文字サイズ、行間、字間、行幅を調整",
      "長い日英の見出し、段落、リンクを狭い画面で確認",
      "適用範囲を限定したCSSを出力し、代替フォントを明示。値は実際の文章で確認"
    ],
    "status": "planned"
  },
  {
    "id": "tool-prompt-templates",
    "title": "Prompt Template Builder",
    "titleJa": "プロンプトテンプレート作成",
    "category": "content",
    "description": "Fill reusable placeholders to generate prompts for common tasks.",
    "purpose": "調査・開発・執筆で使うプロンプトを繰り返し組み立てる。",
    "acceptance": [
      "名前の付いた入力欄を持つテンプレートを編集し、未入力欄を表示",
      "表示どおりの指示文を生成してコピー。AIの実行とは区別して案内",
      "保存する場合は利用者が選択し、端末内での保存と削除方法を明示"
    ],
    "status": "planned"
  },
  {
    "id": "tool-json-csv",
    "title": "JSON / CSV Formatter",
    "titleJa": "JSON・CSV整形・変換",
    "category": "development",
    "description": "Validate and format structured text, with carefully scoped conversion.",
    "purpose": "JSONやCSVを整形・検査し、必要に応じて変換する。",
    "acceptance": [
      "解析できない箇所と修正方法を示し、不正なレコードを無断で除外しない処理",
      "CSVの引用符、改行、UTF-8のBOM、日本語の処理",
      "変換時に失われる情報を示し、画面どおりのデータを出力"
    ],
    "status": "planned"
  },
  {
    "id": "tool-regex-tester",
    "title": "Regular Expression Tester",
    "titleJa": "正規表現テスター",
    "category": "development",
    "description": "Try patterns against sample text and inspect matched ranges.",
    "purpose": "文章やデータの検索・置換ルールを検証する。",
    "acceptance": [
      "式、フラグ、一致範囲、キャプチャを表示し、構文エラーを案内",
      "元の文章を残したまま置換結果をプレビュー",
      "長時間かかる式や空文字に一致する式で画面が固まらないための処理"
    ],
    "status": "planned"
  },
  {
    "id": "tool-css-style-generator",
    "title": "CSS Style Generator",
    "titleJa": "CSSスタイルジェネレーター",
    "category": "design",
    "description": "Tune shadows, borders, radii and gradients in an interactive preview.",
    "purpose": "CSSの外観を見ながら調整し、コードを生成する。",
    "acceptance": [
      "影、角丸、枠線、グラデーションの変更をプレビューに反映",
      "対象にだけ適用されるCSSを生成してコピー",
      "狭い画面での表示、フォーカス、コントラストの確認"
    ],
    "status": "planned"
  },
  {
    "id": "tool-svg-editor",
    "title": "SVG Editor",
    "titleJa": "SVGエディター",
    "category": "design",
    "description": "Edit simple vector shapes and inspect the generated SVG.",
    "purpose": "図形や簡単なアイコンの色・形・サイズを調整する。",
    "acceptance": [
      "基本図形、塗り、輪郭線、viewBox の編集",
      "外部のSVGを読み込む際にスクリプトやイベント処理を実行しないプレビュー",
      "読みやすいSVGコードの出力とキーボード・タッチでの編集"
    ],
    "status": "planned"
  },
  {
    "id": "tool-article-outline",
    "title": "Article Outline Editor",
    "titleJa": "記事構成エディター",
    "category": "writing",
    "description": "Reorder and nest headings before drafting a long article.",
    "purpose": "記事・解説文の見出し構成を組み立てる。",
    "acceptance": [
      "本文を保って見出しの追加・編集・並べ替えと階層の変更",
      "見出しレベルの飛びを示し、キーボードでも編集",
      "日本語の見出しを保ったMarkdown出力と、項目がないときの案内"
    ],
    "status": "planned"
  },
  {
    "id": "tool-comparison-table",
    "title": "Comparison Table Builder",
    "titleJa": "比較表ジェネレーター",
    "category": "content",
    "description": "Build and export a comparison table from editable rows and columns.",
    "purpose": "選択肢の評価項目を整理して比較表を作る。",
    "acceptance": [
      "行と列の追加・編集・削除とキーボード操作",
      "狭い画面では横スクロールでき、見出しと値の関係を保つ表",
      "特殊文字を正しく扱い、入力した値をMarkdownまたはCSVで出力"
    ],
    "status": "planned"
  }
] as const satisfies readonly PlannedTool[];

export const plannedTools = proposedTools.filter(tool => !liveToolIds.has(tool.id));
