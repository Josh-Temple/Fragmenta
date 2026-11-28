import React from 'react';
import type { CompositionGuide, Shape } from '../data/composition';

type Variant = 'example' | 'comparison';
/* Palette roles (see scripts/composition/AUTHORING.md):
   0 ink, 1 graphite, 2 stone, 3 mist, 4 vermilion (subject), 5 paper, 6 sand, 7 cobalt (annotation). */
export const compositionPalette = ['#17181b', '#4b4d53', '#8f8d87', '#c2bfb5', '#e2432a', '#eceae2', '#d9d5c9', '#2555ff'];
const colors = compositionPalette;
const paint = (value: unknown) => (Number(value) < 0 ? 'none' : colors[Number(value)]);
function draw(shape: Shape, index: number): React.ReactNode {
  const [kind, ...values] = shape;
  const n = (i: number) => Number(values[i]);
  if (kind === 'rect') return <rect key={index} x={n(0)} y={n(1)} width={n(2)} height={n(3)} fill={paint(n(4))} />;
  if (kind === 'circle') return <circle key={index} cx={n(0)} cy={n(1)} r={n(2)} fill={paint(n(3))} />;
  if (kind === 'line') return <line key={index} x1={n(0)} y1={n(1)} x2={n(2)} y2={n(3)}
    stroke={paint(n(4))} strokeWidth={n(5)} strokeLinecap="round" />;
  if (kind === 'poly') return <polygon key={index} points={String(values[0])} fill={paint(n(1))} />;
  if (kind === 'path') return <path key={index} d={String(values[0])} fill={paint(n(1))} stroke={paint(n(2))}
    strokeWidth={n(3) || 0} strokeDasharray={values[4] ? String(values[4]) : undefined}
    strokeLinecap="round" strokeLinejoin="round" />;
  if (kind === 'text') return <text key={index} x={n(0)} y={n(1)}
    fill={paint(n(3))} fontSize={n(4)} fontFamily="sans-serif" fontWeight="600"
    aria-hidden="true">{String(values[2])}</text>;
  return null;
}
/* Structure guides: thin dashed cobalt lines, emphasised by the X-RAY toggle. */
function drawGuide(shape: Shape, index: number): React.ReactNode {
  const [kind, ...values] = shape;
  const n = (i: number) => Number(values[i]);
  const stroke = colors[7];
  if (kind === 'line') return <line key={index} x1={n(0)} y1={n(1)} x2={n(2)} y2={n(3)} stroke={stroke}
    strokeWidth={n(5) || 0.8} strokeDasharray="3 2" vectorEffect="non-scaling-stroke" />;
  if (kind === 'path') return <path key={index} d={String(values[0])} fill={n(1) < 0 ? 'none' : stroke} stroke={stroke}
    strokeWidth={n(3) || 0.8} strokeDasharray={values[4] ? String(values[4]) : '3 2'} vectorEffect="non-scaling-stroke" />;
  if (kind === 'circle') return <circle key={index} cx={n(0)} cy={n(1)} r={n(2)} fill="none" stroke={stroke} strokeWidth={1} vectorEffect="non-scaling-stroke" />;
  if (kind === 'rect') return <rect key={index} x={n(0)} y={n(1)} width={n(2)} height={n(3)} fill="none" stroke={stroke}
    strokeWidth={0.8} strokeDasharray="3 2" vectorEffect="non-scaling-stroke" />;
  if (kind === 'poly') return <polygon key={index} points={String(values[0])} fill={stroke} />;
  if (kind === 'text') return <text key={index} x={n(0)} y={n(1)} fill={stroke} fontSize={n(4)}
    fontFamily="sans-serif" fontWeight="600" aria-hidden="true">{String(values[2])}</text>;
  return null;
}
const inspectionModes = {
  grayscale: { label: 'グレースケール', detail: '色だけをグレーへ変換。形・位置・表示寸法は元図と同じ。' },
  quarter: { label: '縮小25%', detail: '幅・高さを元図の25%へ。全図形を同じ比率で縮小。' },
  tiny: { label: '縮小6.25%（失敗条件）', detail: '失敗条件：ここまで縮めると人物や細部は判別しにくい。大きな明暗の形だけが残るかを見る。幅・高さを6.25%へ縮小。' },
  silhouette: { label: 'シルエット', detail: '全図形の塗りを黒一色へ。主題の外形が背景の形から分離して読めるかを比較。' },
  outline: { label: '輪郭（SVG境界）', detail: '塗りなし・黒線幅2で各形状の境界を表示。画像の自動エッジ抽出ではない。' },
} as const;
type InspectionMode = keyof typeof inspectionModes;
const InspectionDiagram: React.FC<{ guide: CompositionGuide }> = ({ guide }) => {
  const [mode, setMode] = React.useState<InspectionMode>('grayscale');
  const selectId = React.useId();
  const descriptionId = React.useId();
  const scale = mode === 'quarter' ? 0.25 : mode === 'tiny' ? 0.0625 : 1;
  return <div data-composition-inspection={mode}>
    <svg viewBox="0 0 240 150" role="img" aria-label={guide.titleJa + 'の検査表示：' + inspectionModes[mode].label}
      aria-describedby={descriptionId}
      className="w-full h-auto rounded-lg border border-ink-border" xmlns="http://www.w3.org/2000/svg">
      <title>{'共通元図 → ' + inspectionModes[mode].label}</title>
      <desc id={descriptionId}>{guide.example + ' ' + inspectionModes[mode].detail}</desc>
      <rect x="0" y="0" width="240" height="150" fill="#fff" />
      <g data-inspection-transform={mode} transform={`translate(${120 * (1 - scale)} ${75 * (1 - scale)}) scale(${scale})`}
        style={mode === 'grayscale' ? { filter: 'grayscale(1)' } : undefined}>
        <rect data-inspection-background="true" x="0" y="0" width="240" height="150" fill={colors[5]} />
        {guide.diagram.example.map((shape, index) => {
          const element = draw(shape, index);
          if ((mode !== 'silhouette' && mode !== 'outline') || !React.isValidElement(element)) return element;
          const props = (element as React.ReactElement<React.SVGProps<SVGElement>>).props;
          const stroked = props.fill === 'none';
          return React.cloneElement(element as React.ReactElement<React.SVGProps<SVGElement>>, {
            fill: mode === 'outline' || stroked ? 'none' : colors[0],
            stroke: mode === 'outline' ? colors[0] : stroked ? colors[0] : props.stroke,
            strokeWidth: mode === 'outline' ? 2 : props.strokeWidth,
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
export const variantLabel = (guide: CompositionGuide, variant: Variant) => guide.id === 'C-110'
  ? (variant === 'example' ? '画風A' : '画風B')
  : guide.id === 'C-119' ? (variant === 'example' ? '元図' : '検査表示') : (variant === 'example' ? '配置例' : '対照例');
const CompositionDiagram: React.FC<{ guide: CompositionGuide; variant: Variant; guides?: boolean }> = ({ guide, variant, guides = true }) => {
  const descriptionId = React.useId();
  if (guide.id === 'C-119' && variant === 'comparison') return <InspectionDiagram guide={guide} />;
  const label = variantLabel(guide, variant);
  const structure = guides ? guide.diagram.guides?.[variant] ?? [] : [];
  return <svg viewBox="0 0 240 150" role="img" aria-label={guide.titleJa + 'の' + label + '。説明は図の下の文章を参照してください。'}
    aria-describedby={descriptionId} data-variant={variant}
    className="w-full h-auto rounded-lg border border-ink-border" xmlns="http://www.w3.org/2000/svg">
    <title>{guide.titleJa + '・' + label}</title>
    <desc id={descriptionId}>{(variant === 'example' ? guide.example : guide.contrast) + ' ' + (guide.comparisonPoint ?? '')}</desc>
    <rect x="0" y="0" width="240" height="150" fill={colors[5]} />
    <g data-layer="scene">{guide.diagram[variant].map((shape, index) => draw(shape, index))}</g>
    {structure.length > 0 && <g data-layer="guides" className="composition-guides" aria-hidden="true">
      {structure.map((shape, index) => drawGuide(shape, index))}
    </g>}
  </svg>;
};
export default CompositionDiagram;
