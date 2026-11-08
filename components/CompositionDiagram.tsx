import React from 'react';
import type { CompositionGuide, Shape } from '../data/composition';

type Variant = 'example' | 'comparison';
const colors = ['#241e18', '#77716b', '#b6aca1', '#c9c0b4', '#b13c29'];
function draw(shape: Shape, index: number, roundLineEnds = false): React.ReactNode {
  const [kind, ...values] = shape;
  const n = (i: number) => Number(values[i]);
  if (kind === 'rect') return <rect key={index} x={n(0)} y={n(1)} width={n(2)} height={n(3)} fill={colors[n(4)]} />;
  if (kind === 'circle') return <circle key={index} cx={n(0)} cy={n(1)} r={n(2)} fill={colors[n(3)]} />;
  if (kind === 'line') return <line key={index} x1={n(0)} y1={n(1)} x2={n(2)} y2={n(3)}
    stroke={colors[n(4)]} strokeWidth={n(5)} strokeLinecap={roundLineEnds ? 'round' : 'square'} />;
  if (kind === 'poly') return <polygon key={index} points={String(values[0])} fill={colors[n(1)]} />;
  if (kind === 'text') return <text key={index} x={n(0)} y={n(1)}
    fill={colors[n(3)]} fontSize={n(4)} fontFamily="sans-serif" fontWeight="600"
    aria-hidden="true">{String(values[2])}</text>;
  return null;
}
const inspectionModes = {
  grayscale: { label: 'グレースケール', detail: '色だけをグレーへ変換。形・位置・表示寸法は元図と同じ。' },
  quarter: { label: '縮小25%', detail: '幅・高さを元図の25%へ。全図形を同じ比率で縮小。' },
  tiny: { label: '縮小6.25%（失敗条件）', detail: '失敗条件：人物や脚の形を判別しにくい。幅・高さを6.25%へ縮小。' },
  silhouette: { label: 'シルエット', detail: '全図形の塗りを黒一色へ。門の開口部と人物の外形を比較。' },
  outline: { label: '輪郭（SVG境界）', detail: '塗りなし・黒線幅2で各形状の境界を表示。画像の自動エッジ抽出ではない。' },
} as const;
type InspectionMode = keyof typeof inspectionModes;
const InspectionDiagram: React.FC<{ guide: CompositionGuide }> = ({ guide }) => {
  const [mode, setMode] = React.useState<InspectionMode>('grayscale');
  const selectId = React.useId();
  const scale = mode === 'quarter' ? 0.25 : mode === 'tiny' ? 0.0625 : 1;
  return <div data-composition-inspection={mode}>
    <svg viewBox="0 0 240 150" role="img" aria-label={guide.titleJa + 'の検査表示：' + inspectionModes[mode].label}
      className="w-full h-auto rounded-lg border border-ink-border" xmlns="http://www.w3.org/2000/svg">
      <title>{'共通元図 → ' + inspectionModes[mode].label}</title>
      <rect x="0" y="0" width="240" height="150" fill="#f1e9de" />
      <g data-inspection-transform={mode} transform={`translate(${120 * (1 - scale)} ${75 * (1 - scale)}) scale(${scale})`}
        style={mode === 'grayscale' ? { filter: 'grayscale(1)' } : undefined}>
        {guide.diagram.example.map((shape, index) => {
          const element = draw(shape, index);
          if ((mode !== 'silhouette' && mode !== 'outline') || !React.isValidElement(element)) return element;
          return React.cloneElement(element as React.ReactElement<React.SVGProps<SVGElement>>, {
            fill: mode === 'outline' ? 'none' : colors[0],
            stroke: mode === 'outline' ? colors[0] : undefined,
            strokeWidth: mode === 'outline' ? 2 : undefined,
          });
        })}
      </g>
    </svg>
    <label htmlFor={selectId} className="mt-3 block text-sm font-semibold">同じ元図の検査表示</label>
    <select id={selectId} value={mode} data-inspection-select="true"
      onChange={event => setMode(event.target.value as InspectionMode)}
      className="mt-2 min-h-11 w-full rounded-lg border border-ink/40 bg-paper p-3 text-base">
      {Object.entries(inspectionModes).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}
    </select>
    <p className="mt-2 text-sm leading-relaxed" role="status">{inspectionModes[mode].detail}</p>
  </div>;
};
const CompositionDiagram: React.FC<{ guide: CompositionGuide; variant: Variant }> = ({ guide, variant }) => {
  if (guide.id === 'C-119' && variant === 'comparison') return <InspectionDiagram guide={guide} />;
  const label = guide.id === 'C-110'
    ? (variant === 'example' ? '画風A' : '画風B')
    : guide.id === 'C-119' ? '元図' : (variant === 'example' ? '配置例' : '対照例');
  return <svg viewBox="0 0 240 150" role="img" aria-label={guide.titleJa + 'の' + label + '。説明は図の下の文章を参照してください。'}
    className="w-full h-auto rounded-lg border border-ink-border" xmlns="http://www.w3.org/2000/svg">
    <title>{guide.titleJa + '・' + label}</title>
    <rect x="0" y="0" width="240" height="150" fill="#f1e9de" />
    {guide.diagram[variant].map((shape, index) => draw(shape, index, guide.id === 'C-008' && variant === 'example'))}
  </svg>;
};
export default CompositionDiagram;
