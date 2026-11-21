import React, { type CSSProperties } from 'react';
import type { DesignStyle } from '../data/design-styles';
import { designFont, type DemoScreen } from '../data/design-style-export';
import { compositionFor, type Composition, clampSecondaryWeight } from '../data/design-style-composition';
import { getStyleMotion } from '../data/design-style-motion';

const patternMap: Record<DesignStyle['tokens']['pattern'], string> = {
  none: 'none',
  grid: 'linear-gradient(#88888821 1px, transparent 1px), linear-gradient(90deg, #88888821 1px, transparent 1px)',
  dots: 'radial-gradient(#77777730 1.5px, transparent 1.5px)',
  diagonal: 'repeating-linear-gradient(135deg, #77777716 0 2px, transparent 2px 28px)',
  gradient: 'none',
};

const layoutGrid = (shape: Composition): string => {
  switch (shape) {
    case 'editorial': return '1.55fr .8fr';
    case 'quiet': return '1fr';
    case 'instrument': return '.85fr 1.15fr';
    case 'diagonal': return '1.15fr .85fr';
    default: return '1fr 1fr';
  }
};

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
  const motion = getStyleMotion(style.id);
  const shape = compositionFor(style);
  const mix = secondaryStyle && secondaryStyle.id !== style.id ? clampSecondaryWeight(secondaryWeight) : 0;
  const secondaryAccent = mix && secondaryStyle ? secondaryStyle.tokens.accent : t.accent;
  const panel: CSSProperties = {
    background: t.surface,
    color: t.text,
    border: String(t.borderWidth) + 'px solid ' + t.border,
    borderRadius: shape === 'stacked' || shape === 'strict-grid' ? 0 : t.radius,
    boxShadow: t.shadow,
    backdropFilter: style.id === 'glass' ? 'blur(14px)' : undefined,
  };
  const muted: CSSProperties = { color: t.muted };
  const accent: CSSProperties = {
    background: t.accent,
    color: foregroundForAccent(t.accent),
    borderRadius: t.radius,
    border: t.borderWidth >= 3 ? String(t.borderWidth) + 'px solid ' + t.border : 'none',
    boxShadow: ['neo-brutalism', 'bauhaus', 'pixel-art'].includes(style.id) ? t.shadow : undefined,
  };
  const isEditorial = shape === 'editorial' || shape === 'quiet';
  const headline: CSSProperties = {
    fontFamily: designFont(style),
    fontSize: shape === 'editorial' ? 35 : shape === 'stacked' ? 29 : shape === 'quiet' ? 24 : 27,
    lineHeight: shape === 'editorial' ? 1.04 : 1.2,
    fontWeight: ['brutalism', 'neo-brutalism', 'bauhaus', 'constructivism'].includes(style.id) ? 900 : 700,
    letterSpacing: shape === 'editorial' ? '-.055em' : shape === 'instrument' ? '.025em' : '-.025em',
    textAlign: style.id === 'art-deco' ? 'center' : 'left',
    textTransform: ['bauhaus', 'constructivism', 'brutalism'].includes(style.id) ? 'uppercase' : undefined,
  };

  return (
    <section aria-label={style.name + ' ' + screen + ' preview'}
      className="relative isolate min-w-0 overflow-hidden p-4"
      style={{
        '--specimen-enter-x': motion.offsetX + 'px',
        '--specimen-enter-y': motion.offsetY + 'px',
        '--specimen-enter-scale': motion.scale,
        '--specimen-enter-duration': motion.durationMs + 'ms',
        '--specimen-enter-ease': motion.easing,
        background: t.background,
        color: t.text,
        fontFamily: designFont(style),
        backgroundImage: patternMap[t.pattern] === 'none' ? undefined : patternMap[t.pattern],
        backgroundSize: t.pattern === 'grid' ? '22px 22px' : t.pattern === 'dots' ? '24px 24px' : undefined,
        borderRadius: 12,
      } as CSSProperties}
    >
      <div key={style.id + ':' + screen} className="style-motion-enter relative z-10" style={{ padding: shape === 'quiet' ? '8px 5px 18px' : undefined }}>
        <div className="flex items-center justify-between gap-2 text-xs" style={{
          ...muted, borderBottom: ['strict-grid', 'stacked', 'instrument', 'retro'].includes(shape) ? '1px solid ' + t.border : undefined,
          paddingBottom: ['strict-grid', 'stacked', 'instrument', 'retro'].includes(shape) ? 10 : undefined,
        }}>
          <span className="font-bold tracking-wider">{shape === 'instrument' ? 'SYS / 07' : shape === 'editorial' ? 'THE STUDIO • 04' : 'ATLAS / Studio'}</span>
          <span aria-hidden="true" className="font-bold" style={{ color: t.accent }}>{shape === 'instrument' ? '◉' : shape === 'strict-grid' ? '＋' : '✦'}</span>
        </div>

        {['diagonal', 'retro', 'editorial', 'instrument'].includes(shape) && (
          <div aria-hidden="true" className="relative mt-3 h-7 overflow-hidden" style={{
            background: shape === 'retro' ? 'repeating-linear-gradient(90deg,' + t.accent + ' 0 8px,transparent 8px 14px)'
              : shape === 'diagonal' ? 'linear-gradient(155deg,' + t.accent + ' 0 48%, transparent 49%)'
              : shape === 'instrument' ? 'repeating-linear-gradient(90deg,' + t.accent + ' 0 2px, transparent 2px 18px)'
              : 'linear-gradient(90deg,' + t.accent + ' 0 65%, transparent 65%)',
            opacity: shape === 'instrument' ? .7 : .9,
          }}/>
        )}

        <div style={{
          marginTop: shape === 'quiet' ? 34 : shape === 'editorial' ? 24 : shape === 'stacked' ? 10 : 16,
          paddingLeft: shape === 'strict-grid' ? 10 : undefined,
          borderLeft: shape === 'strict-grid' ? '4px solid ' + t.accent : undefined,
        }}>
          <p className="text-xs font-semibold" style={muted}>{screen === 'dashboard' ? 'Your workspace' : 'Field notes / Issue 04'}</p>
          <h3 className="mt-2 break-words" style={headline}>{screen === 'dashboard' ? 'プロジェクトの概要' : 'デザインと言葉'}</h3>
          <p className="mt-3 text-xs leading-relaxed" style={muted}>{screen === 'dashboard' ? '今日の進捗をひと目で確認できます。' : '余白、文字、色の関係から体験を考える。'}</p>
        </div>

        {screen === 'dashboard' ? (
          <>
            <div className="grid mt-5" style={{ gridTemplateColumns: layoutGrid(shape), gap: shape === 'quiet' ? 16 : shape === 'stacked' ? 0 : 10 }}>
              {[{ label: 'Projects', value: '12' }, { label: 'Complete', value: '86%' }].map((item, index) => (
                <div key={item.label} style={{
                  ...panel,
                  padding: shape === 'quiet' ? 15 : shape === 'instrument' ? '15px 9px' : 12,
                  marginTop: shape === 'diagonal' && index === 1 ? 14 : undefined,
                  borderTop: shape === 'stacked' && index === 1 ? 'none' : undefined,
                }}>
                  <p className="text-xs" style={muted}>{item.label}</p>
                  <p className="mt-1 text-xl font-bold tabular-nums">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4" style={{
              ...panel,
              padding: shape === 'quiet' ? 19 : 12,
              borderLeft: shape === 'instrument' ? '5px solid ' + t.accent : panel.border,
            }}>
              <p className="text-xs font-semibold">{shape === 'instrument' ? 'ACTIVITY / SIGNAL' : 'Weekly activity'}</p>
              <div className="flex h-14 items-end gap-2 mt-2" aria-label="Seven sample activity bars" role="img">
                {[32, 52, 40, 77, 60, 98, 78].map((height, index) => (
                  <span key={index} className="flex-1 min-w-0" style={{
                    height: height + '%',
                    background: t.accent,
                    opacity: index % 2 ? 1 : .65,
                    borderRadius: ['soft-cards', 'quiet'].includes(shape) ? '8px 8px 0 0' : 0,
                    transform: shape === 'diagonal' && index % 2 ? 'translateY(-4px)' : undefined,
                  }}/>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="mt-5" style={{
            ...panel,
            padding: isEditorial ? 22 : 15,
            marginLeft: shape === 'diagonal' ? 12 : 0,
            borderTop: shape === 'editorial' ? '4px double ' + t.border : panel.border,
          }}>
            <p className="text-[11px] uppercase tracking-widest font-bold" style={muted}>Design / Journal</p>
            <p className="mt-4 text-sm" style={{ lineHeight: isEditorial ? 2.15 : 1.75, fontFamily: designFont(style) }}>
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
