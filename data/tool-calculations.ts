// WCAG 2.2 sRGB relative luminance; opaque #RGB / #RRGGBB only.
// https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
export function normalizeHex(input: string): string | null {
  const hex = input.trim();
  if (/^#[0-9a-f]{3}$/i.test(hex)) {
    return '#' + [...hex.slice(1)].map(char => char + char).join('').toLowerCase();
  }
  return /^#[0-9a-f]{6}$/i.test(hex) ? hex.toLowerCase() : null;
}

export function relativeLuminance(input: string): number {
  const color = normalizeHex(input);
  if (!color) throw new Error('Expected an opaque #RGB or #RRGGBB color');
  const [red, green, blue] = [1, 3, 5].map(index => {
    const channel = parseInt(color.slice(index, index + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function contrastRatio(foreground: string, background: string): number {
  const first = relativeLuminance(foreground);
  const second = relativeLuminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

export function contrastChecks(ratio: number) {
  // Compare the full value. Display rounding must never turn a failure into a pass.
  return [
    { label: '通常の文字 · AA', minimum: 4.5, pass: ratio >= 4.5 },
    { label: '通常の文字 · AAA', minimum: 7, pass: ratio >= 7 },
    { label: '大きな文字 · AA', minimum: 3, pass: ratio >= 3 },
    { label: '大きな文字 · AAA', minimum: 4.5, pass: ratio >= 4.5 },
    { label: 'UI・意味のある図形 · AA', minimum: 3, pass: ratio >= 3 },
  ];
}

export const typographyFonts = {
  sans: 'system-ui, "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif',
  serif: '"Hiragino Mincho ProN", "Yu Mincho", serif',
} as const;

export interface TypographySettings {
  size: number;
  leading: number;
  spacing: number;
  width: number;
  font: keyof typeof typographyFonts;
}

export const defaultTypography: TypographySettings = { size: 17, leading: 1.9, spacing: 0.02, width: 36, font: 'sans' };

export function typographyCss(settings: TypographySettings): string {
  return `.fragmenta-prose {\n  font-family: ${typographyFonts[settings.font]};\n  font-size: ${settings.size}px;\n  line-height: ${settings.leading};\n  letter-spacing: ${settings.spacing}em;\n  max-inline-size: ${settings.width}rem;\n  margin-inline: auto;\n  overflow-wrap: anywhere;\n}\n\n.fragmenta-prose h2 {\n  font-size: 1.5em;\n  line-height: 1.5;\n  margin-block: 0 1em;\n}\n\n.fragmenta-prose p {\n  margin-block: 0 1.25em;\n  white-space: pre-wrap;\n}\n\n.fragmenta-prose a {\n  color: inherit;\n  text-decoration: underline;\n  text-underline-offset: 0.2em;\n}`;
}
