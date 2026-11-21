import React, { type CSSProperties } from 'react';
import type { DesignStyle } from '../data/design-styles';
import { designFont, type DemoScreen } from '../data/design-style-export';
import { compositionFor, clampSecondaryWeight } from '../data/design-style-composition';
import { artDirectionFor, type ArtDirectionRecipe, type Ornament } from '../data/design-style-art-direction';

const patternMap: Record<DesignStyle['tokens']['pattern'], string> = {
  none: 'none',
  grid: 'linear-gradient(#88888821 1px, transparent 1px), linear-gradient(90deg, #88888821 1px, transparent 1px)',
  dots: 'radial-gradient(#77777730 1.5px, transparent 1.5px)',
  diagonal: 'repeating-linear-gradient(135deg, #77777716 0 2px, transparent 2px 28px)',
  gradient: 'none',
};

// All motifs are locally drawn CSS geometry; they have no semantic or interactive role.
function ornamentStyle(ornament: Ornament, accent: string, border: string): CSSProperties {
  const base: CSSProperties = { height: 24, width: '100%', marginTop: 10, overflow: 'hidden', pointerEvents: 'none' };
  const themes: Partial<Record<Ornament, CSSProperties>> = {
    ruler: { height: 16, background: 'repeating-linear-gradient(90deg,' + border + ' 0 1px,transparent 1px 22px)', borderBottom: '2px solid ' + accent },
    disc: { height: 28, width: 72, borderRadius: 40, background: 'radial-gradient(circle at 24px 14px,' + accent + ' 0 12px,transparent 13px)' },
    geometry: { height: 28, background: 'radial-gradient(circle at 20px 14px,' + accent + ' 0 13px,transparent 14px),linear-gradient(90deg,transparent 51px,' + border + ' 51px 76px,transparent 76px)' },
    'double-rule': { height: 11, borderTop: '1px solid ' + border, borderBottom: '3px double ' + accent },
    diagonal: { height: 27, background: 'linear-gradient(154deg,' + accent + ' 0 34%,transparent 35%)' },
    crosshair: { width: 56, height: 21, background: 'linear-gradient(90deg,transparent 25px,' + accent + ' 25px 29px,transparent 29px),linear-gradient(transparent 8px,' + border + ' 8px 12px,transparent 12px)' },
    ticket: { height: 24, background: 'repeating-linear-gradient(90deg,' + accent + ' 0 35px,transparent 35px 45px)', border: '2px solid ' + border },
    confetti: { height: 26, background: 'radial-gradient(circle at 12px 9px,' + accent + ' 0 6px,transparent 7px),linear-gradient(120deg,transparent 27px,' + border + ' 28px 33px,transparent 34px),radial-gradient(circle at 73px 17px,' + accent + ' 0 4px,transparent 5px)', backgroundRepeat: 'repeat-x', backgroundSize: '106px 26px' },
    collage: { height: 29, background: 'linear-gradient(115deg,' + accent + ' 0 24%,transparent 25%),repeating-linear-gradient(90deg,transparent 0 45px,' + border + ' 45px 51px,transparent 51px 69px)' },
    tiles: { height: 18, background: 'repeating-linear-gradient(90deg,' + accent + ' 0 25px,transparent 25px 32px)', backgroundSize: '128px 18px' },
    frosted: { height: 26, border: '1px solid ' + border, borderRadius: 12, background: 'linear-gradient(110deg,transparent,' + accent + '66,transparent)', backdropFilter: 'blur(8px)' },
    emboss: { height: 19, width: 76, borderRadius: 22, border: '1px solid ' + border, boxShadow: 'inset 2px 2px 5px #0002,inset -2px -2px 5px #fff8' },
    dial: { height: 30, width: 90, borderRadius: 18, border: '3px double ' + border, background: 'radial-gradient(circle at 45px 15px,' + accent + ' 0 9px,transparent 10px)' },
    pill: { height: 23, width: 90, background: accent, borderRadius: 50, boxShadow: '0 4px 0 #0002' },
    arch: { height: 29, background: 'repeating-radial-gradient(ellipse 35px 30px at 35px 32px,transparent 0 15px,' + accent + ' 16px 17px,transparent 18px 25px)', backgroundSize: '70px 30px' },
    chrome: { height: 25, borderRadius: 30, background: 'linear-gradient(180deg,#fff9,' + accent + ' 48%,#0004 52%,#fff6)' },
    horizon: { height: 30, background: 'repeating-linear-gradient(180deg,transparent 0 5px,' + accent + ' 6px 7px,transparent 8px 11px)' },
    terminal: { height: 18, background: 'repeating-linear-gradient(90deg,' + accent + ' 0 2px,transparent 2px 17px)', borderBottom: '1px solid ' + border },
    pixel: { height: 23, background: 'linear-gradient(90deg,' + accent + ' 0 16px,transparent 16px 23px,' + accent + ' 23px 46px,transparent 46px 53px,' + accent + ' 53px 68px)', backgroundSize: '72px 23px', backgroundRepeat: 'no-repeat' },
    signal: { height: 20, background: 'repeating-linear-gradient(90deg,' + accent + ' 0 3px,transparent 3px 12px)' },
    leaf: { height: 27, width: 66, background: accent, borderRadius: '2px 95% 4px 95%', transform: 'rotate(-8deg)', opacity: .75 },
    brush: { height: 14, width: '58%', background: 'linear-gradient(90deg,transparent,' + accent + '99 16%, ' + accent + '66 59%,transparent)', transform: 'rotate(-1deg)' },
  };
  return { ...base, ...(themes[ornament] ?? {}) };
}

function metricColumns(recipe: ArtDirectionRecipe): string {
  switch (recipe.metricLayout) {
    case 'single': return '1fr';
    case 'wide-first': return '1.28fr minmax(0,.72fr)';
    case 'wide-second': return 'minmax(0,.74fr) 1.26fr';
    default: return 'repeat(2,minmax(0,1fr))';
  }
}

function treatment(recipe: ArtDirectionRecipe, style: DesignStyle): CSSProperties {
  const t = style.tokens;
  switch (recipe.panelTreatment) {
    case 'open': return { background: t.surface, borderWidth: 0, boxShadow: 'none' };
    case 'rule': return { boxShadow: 'none', borderWidth: 1 };
    case 'double': return { borderStyle: 'double', borderWidth: 3 };
    case 'heavy': return { borderWidth: Math.max(2, t.borderWidth), borderRadius: 0 };
    case 'soft': return { borderRadius: Math.max(t.radius, 18), boxShadow: t.shadow };
    case 'raised': return { borderWidth: Math.max(2, t.borderWidth), boxShadow: t.shadow };
    case 'inset': return { borderWidth: Math.max(1, t.borderWidth), boxShadow: t.shadow };
    case 'glass': return { borderWidth: 1, backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' };
    case 'ornate': return { borderStyle: 'double', borderWidth: 3 };
  }
}

function foregroundForAccent(value: string): string {
  const rgb = /^#([0-9a-f]{6})$/i.exec(value);
  if (!rgb) return '#10141C';
  const n = rgb[1];
  const channels = [0, 2, 4].map(i => parseInt(n.slice(i, i + 2), 16) / 255).map(v =>
    v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const luminance = 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  return luminance > 0.179 ? '#11141B' : '#FFFFFF';
}

export const DesignStyleSpecimen: React.FC<{
  style: DesignStyle;
  screen: DemoScreen;
  secondaryStyle?: DesignStyle | null;
  secondaryWeight?: number;
}> = ({ style, screen, secondaryStyle, secondaryWeight = 0 }) => {
  const t = style.tokens;
  const shape = compositionFor(style);
  const art = artDirectionFor(style);
  const mix = secondaryStyle && secondaryStyle.id !== style.id ? clampSecondaryWeight(secondaryWeight) : 0;
  const secondaryAccent = mix && secondaryStyle ? secondaryStyle.tokens.accent : t.accent;
  const panel: CSSProperties = {
    background: t.surface,
    color: t.text,
    border: String(t.borderWidth) + 'px solid ' + t.border,
    borderRadius: t.radius,
    boxShadow: t.shadow,
    ...treatment(art, style),
  };
  const muted: CSSProperties = { color: t.muted };
  const accent: CSSProperties = {
    background: t.accent,
    color: foregroundForAccent(t.accent),
    borderRadius: t.radius,
    border: t.borderWidth >= 3 ? String(t.borderWidth) + 'px solid ' + t.border : 'none',
    boxShadow: ['neo-brutalism', 'bauhaus', 'pixel-art'].includes(style.id) ? t.shadow : undefined,
  };
  const headline: CSSProperties = {
    fontFamily: designFont(style),
    fontSize: 'clamp(22px, 8cqw, ' + art.headlineSize + 'px)',
    lineHeight: shape === 'editorial' ? 1.08 : 1.18,
    fontWeight: art.headlineWeight,
    letterSpacing: art.headlineTracking,
    textAlign: art.headlineAlign,
    textTransform: ['bauhaus', 'constructivism', 'brutalism'].includes(style.id) ? 'uppercase' : undefined,
  };

  return (
    <section aria-label={style.name + ' ' + screen + ' preview'}
      className="relative isolate min-w-0 overflow-hidden p-4"
      style={{
        containerType: 'inline-size',
        background: t.background,
        color: t.text,
        fontFamily: designFont(style),
        backgroundImage: patternMap[t.pattern] === 'none' ? undefined : patternMap[t.pattern],
        backgroundSize: t.pattern === 'grid' ? '22px 22px' : t.pattern === 'dots' ? '24px 24px' : undefined,
        borderRadius: 12,
      }}
    >
      <div className="relative z-10" style={{ padding: shape === 'quiet' ? '8px 5px 18px' : undefined }}>
        <div className="flex items-center justify-between gap-2 text-xs" style={{
          ...muted, borderBottom: ['strict-grid', 'stacked', 'instrument', 'retro'].includes(shape) ? '1px solid ' + t.border : undefined,
          paddingBottom: ['strict-grid', 'stacked', 'instrument', 'retro'].includes(shape) ? 10 : undefined,
        }}>
          <span className="font-bold tracking-wider">{shape === 'instrument' ? 'SYS / 07' : shape === 'editorial' ? 'THE STUDIO • 04' : 'ATLAS / Studio'}</span>
          <span aria-hidden="true" className="font-bold" style={{ color: t.accent }}>{shape === 'instrument' ? '◉' : shape === 'strict-grid' ? '＋' : '✦'}</span>
        </div>

        {art.ornament !== 'none' && (
          <div aria-hidden="true" style={ornamentStyle(art.ornament, t.accent, t.border)}/>
        )}

        <div style={{
          marginTop: art.heroSpacing,
          paddingLeft: art.heroRule === 'left' ? 12 : undefined,
          paddingTop: art.heroRule === 'top' ? 10 : undefined,
          paddingBottom: ['bottom', 'double'].includes(art.heroRule) ? 12 : undefined,
          borderLeft: art.heroRule === 'left' ? '4px solid ' + t.accent : undefined,
          borderTop: art.heroRule === 'top' ? '3px solid ' + t.accent : undefined,
          borderBottom: art.heroRule === 'bottom' ? '2px solid ' + t.accent : art.heroRule === 'double' ? '4px double ' + t.accent : undefined,
        }}>
          <p className="text-xs font-semibold" style={muted}>{screen === 'dashboard' ? 'Your workspace' : 'Field notes / Issue 04'}</p>
          <h3 className="mt-2 break-words" style={headline}>{screen === 'dashboard' ? 'プロジェクトの概要' : 'デザインと言葉'}</h3>
          <p className="mt-3 text-xs leading-relaxed" style={muted}>{screen === 'dashboard' ? '今日の進捗をひと目で確認できます。' : '余白、文字、色の関係から体験を考える。'}</p>
        </div>

        {screen === 'dashboard' ? (
          <>
            <div className="grid mt-5 min-w-0" style={{ gridTemplateColumns: art.metricLayout === 'single' ? '1fr' : metricColumns(art), gap: art.cardGap }}>
              {[{ label: 'Projects', value: '12' }, { label: 'Complete', value: '86%' }].map((item, index) => (
                <div key={item.label} style={{
                  ...panel,
                  padding: art.articleInset,
                  minWidth: 0,
                  marginTop: ['diagonal', 'retro'].includes(shape) && index === 1 ? 10 : undefined,
                  borderTop: art.cardGap === 0 && index === 1 ? 'none' : undefined,
                }}>
                  <p className="text-xs" style={muted}>{item.label}</p>
                  <p className="mt-1 font-bold tabular-nums" style={{ fontSize: art.headlineSize > 36 ? 26 : 22, letterSpacing: art.headlineTracking }}>{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4" style={{
              ...panel,
              padding: art.articleInset,
              borderLeft: shape === 'instrument' ? '5px solid ' + t.accent : panel.border,
            }}>
              <p className="text-xs font-semibold">{shape === 'instrument' ? 'ACTIVITY / SIGNAL' : 'Weekly activity'}</p>
              <div className="flex h-14 items-end gap-2 mt-2" aria-label="Seven sample activity bars" role="img">
                {[32, 52, 40, 77, 60, 98, 78].map((height, index) => (
                  <span key={index} className="flex-1 min-w-0" style={{
                    height: height + '%',
                    background: art.barTreatment === 'segmented'
                      ? 'repeating-linear-gradient(to top,' + t.accent + ' 0 7px,transparent 7px 10px)'
                      : t.accent,
                    opacity: index % 2 ? 1 : .72,
                    maxWidth: art.barTreatment === 'thin' ? 12 : undefined,
                    marginInline: art.barTreatment === 'thin' ? 'auto' : undefined,
                    borderRadius: art.barTreatment === 'rounded' ? '10px 10px 0 0' : 0,
                    transform: art.barTreatment === 'offset' && index % 2 ? 'translateY(-5px)' : undefined,
                  }}/>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="mt-5" style={{
            ...panel,
            padding: art.articleInset,
            marginLeft: shape === 'diagonal' ? 10 : 0,
            borderTop: shape === 'editorial' ? '4px double ' + t.border : panel.border,
          }}>
            <p className="text-[11px] uppercase tracking-widest font-bold" style={muted}>Design / Journal</p>
            <p className="mt-4 text-sm" style={{ lineHeight: art.articleLeading, fontFamily: designFont(style) }}>
              良いデザインには、伝えたいことと、それを支える明確な構造があります。
            </p>
            <div className="my-3 border-t" style={{ borderColor: t.border }}/>
            <p className="text-xs leading-relaxed" style={muted}>同じ文章を使い、色、質感、形、文字組みの違いを比べます。</p>
          </div>
        )}
        <div className="mt-4 px-4 py-3 text-center text-xs font-bold" style={{
          ...accent,
          textAlign: shape === 'editorial' ? 'left' : 'center',
          paddingLeft: shape === 'editorial' ? 18 : undefined,
          letterSpacing: shape === 'instrument' ? '.12em' : undefined,
        }}>Sample action</div>
        {mix > 0 && secondaryStyle && (
          <div className="mt-3 text-xs" style={muted}>
            <p>副次スタイルのアクセント見本（{mix}%）</p>
            <div aria-hidden="true" className="flex mt-1 h-2 overflow-hidden rounded-full" style={{ background: t.accent }}>
              <span style={{ width: mix + '%', background: secondaryAccent, marginLeft: 'auto' }}/>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
