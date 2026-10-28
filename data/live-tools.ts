export const liveTools = [
  {
    id: 'tool-color-contrast',
    title: 'Color & Contrast Checker',
    titleJa: '配色・コントラストチェッカー',
    description: '文字色と背景色を変え、コントラスト比と文字の見え方を確認します。選んだ配色をCSSでコピーできます。',
    path: '/tools/contrast',
    tags: ['color', 'contrast', 'wcag', 'accessibility', '配色', '色', '読みやすさ', 'アクセシビリティ'],
  },
  {
    id: 'tool-japanese-typography',
    title: 'Japanese Typography Playground',
    titleJa: '日本語タイポグラフィ調整',
    description: '自分の文章で、文字サイズ・行間・字間・本文幅を調整します。見出しやリンクも確認し、CSSで持ち帰れます。',
    path: '/tools/typography',
    tags: ['typography', 'font', 'text', 'タイポグラフィ', '文字', '行間', '字間', '日本語', 'フォント', '文章', '読みやすさ'],
  },
] as const;

export const liveToolIds: ReadonlySet<string> = new Set(liveTools.map(tool => tool.id));
