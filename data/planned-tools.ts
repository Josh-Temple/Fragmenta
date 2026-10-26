// Proposed practical tools only. Not released UI patterns and not working tools.
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

export const plannedTools = [
  {
    "id": "tool-markdown-editor",
    "title": "Markdown Editor & Preview",
    "titleJa": "Markdownエディター・プレビュー",
    "category": "writing",
    "description": "Write Markdown, inspect a live preview, and export the result.",
    "purpose": "記事、メモ、手順書をMarkdownで作り、整形結果を確認する。",
    "acceptance": [
      "Live preview supports headings, lists, tables, code blocks and Japanese text.",
      "Unsafe HTML is sanitized or safely disabled; source and preview remain separate.",
      "Copy and file export work on mobile and desktop with honest local-only handling."
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
      "Insertions, deletions and unchanged portions are visibly and textually identifiable.",
      "Japanese, multiline input and long documents remain usable on narrow screens.",
      "Both versions remain editable; clear/reset and optional copy/export give accurate results."
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
      "Switch or compare realistic mobile, tablet and desktop viewport widths.",
      "Untrusted pasted HTML runs only in an appropriately sandboxed preview without access to the host site.",
      "Clearly distinguish simulated viewport checks from real-device/browser acceptance."
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
      "Compute WCAG contrast ratios correctly from user-selected foreground/background colors.",
      "Clearly distinguish AA and AAA normal/large text thresholds and non-text requirements.",
      "Provide a live sample and copyable color values/CSS without presenting contrast as full accessibility conformance."
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
      "Adjust font size, line height, letter spacing and column width with visible feedback.",
      "Test long Japanese/English titles, paragraphs, links and narrow viewport wrapping.",
      "Export scoped CSS and document font fallback; avoid claiming objectively optimal settings."
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
      "Create editable templates with named placeholders and clear missing-field states.",
      "Generate and copy exactly the displayed text, with no fabricated AI execution.",
      "Persistence, if provided, is opt-in/local with clear deletion and privacy messaging."
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
      "Show actionable parse errors without silently dropping malformed records.",
      "Handle CSV quotes, escaped quotes, newlines, UTF-8 BOM and Japanese text.",
      "State clearly when conversion is lossy and export the exact represented data."
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
      "Support pattern, flags, match ranges and visible captures with syntax-error feedback.",
      "Show replacement preview separately from unchanged original text.",
      "Handle zero-length matches safely and guard against expensive expressions/freezing the UI."
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
      "Controls change a real preview for shadows, border radius, outline and gradients.",
      "Generate valid, copyable scoped CSS using the selected values.",
      "Include narrow layout and visible focus/contrast considerations."
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
      "Edit basic shapes, fill/stroke and viewBox using real controls.",
      "Preview or import untrusted SVG safely without script/event-handler execution.",
      "Export readable SVG and test keyboard controls and mobile operation."
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
      "Add, edit, reorder and change heading levels without losing content.",
      "Flag structurally confusing heading jumps and provide keyboard editing paths.",
      "Export a faithful Markdown outline with Japanese text and meaningful empty states."
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
      "Add/edit/remove rows and columns with clear labels and keyboard operation.",
      "Provide horizontally usable tables on narrow screens and preserve semantics.",
      "Export correct Markdown or CSV with escaped special characters and no invented values."
    ],
    "status": "planned"
  }
] as const satisfies readonly PlannedTool[];
