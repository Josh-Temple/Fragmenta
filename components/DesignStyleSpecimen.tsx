import React, { type CSSProperties } from 'react';
import type { DesignStyle } from '../data/design-styles';
import { designFont, type DemoScreen } from '../data/design-style-export';

const patternMap: Record<DesignStyle['tokens']['pattern'], string> = {
  none: 'none',
  grid: 'linear-gradient(#88888821 1px, transparent 1px), linear-gradient(90deg, #88888821 1px, transparent 1px)',
  dots: 'radial-gradient(#77777730 1.5px, transparent 1.5px)',
  diagonal: 'repeating-linear-gradient(135deg, #77777716 0 2px, transparent 2px 28px)',
  gradient: 'none',
};

const lightAccentBackground = new Set(['glass', 'maximalism', 'vaporwave', 'cyberpunk', 'art-deco', 'retro-futurism']);

export const DesignStyleSpecimen: React.FC<{ style: DesignStyle; screen: DemoScreen }> = ({ style, screen }) => {
  const t = style.tokens;
  const panel: CSSProperties = {
    background: t.surface,
    color: t.text,
    border: String(t.borderWidth) + 'px solid ' + t.border,
    borderRadius: t.radius,
    boxShadow: t.shadow,
    backdropFilter: style.id === 'glass' ? 'blur(14px)' : undefined,
  };
  const muted: CSSProperties = { color: t.muted };
  const accent: CSSProperties = {
    background: t.accent,
    color: lightAccentBackground.has(style.id) ? '#131625' : '#FFFFFF',
    borderRadius: t.radius,
    border: t.borderWidth >= 3 ? String(t.borderWidth) + 'px solid ' + t.border : 'none',
    boxShadow: ['neo-brutalism', 'bauhaus', 'pixel-art'].includes(style.id) ? t.shadow : undefined,
  };
  return (
    <section
      aria-label={style.name + ' ' + screen + ' preview'}
      className="relative isolate min-w-0 overflow-hidden p-4"
      style={{
        background: t.background,
        color: t.text,
        fontFamily: designFont(style),
        backgroundImage: patternMap[t.pattern] === 'none' ? undefined : patternMap[t.pattern],
        backgroundSize: t.pattern === 'grid' ? '22px 22px' : t.pattern === 'dots' ? '24px 24px' : undefined,
        borderRadius: 12,
      }}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2 text-xs" style={muted}>
          <span className="font-bold tracking-wide">ATLAS / Studio</span>
          <span aria-hidden="true" className="font-bold" style={{ color: t.accent }}>✦</span>
        </div>
        <div className="mt-4">
          <p className="text-xs font-semibold" style={muted}>{screen === 'dashboard' ? 'Your workspace' : 'Field notes / Issue 04'}</p>
          <h3 className="mt-1 text-2xl leading-tight font-bold break-words" style={{
            letterSpacing: t.font === 'mono' ? '-0.01em' : '-0.04em',
            textTransform: ['bauhaus', 'constructivism', 'brutalism'].includes(style.id) ? 'uppercase' : undefined,
          }}>
            {screen === 'dashboard' ? 'プロジェクトの概要' : 'デザインと言葉'}
          </h3>
          <p className="mt-2 text-xs leading-relaxed" style={muted}>
            {screen === 'dashboard' ? '今日の進捗をひと目で確認できます。' : '余白、文字、色の関係から体験を考える。'}
          </p>
        </div>
        {screen === 'dashboard' ? (
          <>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {[{ label: 'Projects', value: '12' }, { label: 'Complete', value: '86%' }].map(item => (
                <div key={item.label} style={panel} className="min-w-0 p-3">
                  <p className="text-xs" style={muted}>{item.label}</p>
                  <p className="mt-1 text-xl font-bold tabular-nums">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3" style={panel}>
              <p className="text-xs font-semibold">Weekly activity</p>
              <div className="flex h-12 items-end gap-2 mt-2" aria-label="Seven decorative activity bars" role="img">
                {[32, 52, 40, 77, 60, 98, 78].map((height, i) => (
                  <span key={i} className="flex-1 min-w-0" style={{
                    height: String(height) + '%',
                    background: t.accent,
                    opacity: i % 2 ? 1 : .65,
                    borderRadius: t.radius > 8 ? '6px 6px 0 0' : 0,
                  }}/>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="mt-4 p-4" style={panel}>
            <p className="text-[11px] uppercase tracking-widest font-bold" style={muted}>Design / Journal</p>
            <p className="mt-3 text-sm leading-loose">良いデザインには、伝えたいことと、それを支える明確な構造があります。</p>
            <div className="my-3 border-t" style={{ borderColor: t.border }}/>
            <p className="text-xs leading-relaxed" style={muted}>同じ文章を使い、色、質感、形、文字組みの違いを比べます。</p>
          </div>
        )}
        <div className="mt-3 px-4 py-3 text-center text-xs font-bold" style={accent}>Sample action</div>
      </div>
    </section>
  );
};
