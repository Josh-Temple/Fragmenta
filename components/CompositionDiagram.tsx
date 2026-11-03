import React from 'react';
import type { CompositionGuide, Shape } from '../data/composition';

type Variant = 'example' | 'comparison';
const colors = ['#241e18', '#77716b', '#b6aca1', '#dfd6c9', '#b13c29'];
function draw(shape: Shape, index: number): React.ReactNode {
  const [kind, ...values] = shape;
  const n = (i: number) => Number(values[i]);
  if (kind === 'rect') return <rect key={index} x={n(0)} y={n(1)} width={n(2)} height={n(3)} fill={colors[n(4)]} />;
  if (kind === 'circle') return <circle key={index} cx={n(0)} cy={n(1)} r={n(2)} fill={colors[n(3)]} />;
  if (kind === 'line') return <line key={index} x1={n(0)} y1={n(1)} x2={n(2)} y2={n(3)}
    stroke={colors[n(4)]} strokeWidth={n(5)} strokeLinecap="square" />;
  if (kind === 'poly') return <polygon key={index} points={String(values[0])} fill={colors[n(1)]} />;
  return null;
}
const CompositionDiagram: React.FC<{ guide: CompositionGuide; variant: Variant }> = ({ guide, variant }) => {
  const label = variant === 'example' ? '配置例' : '対照例';
  return <svg viewBox="0 0 240 150" role="img" aria-label={guide.titleJa + 'の' + label + '。説明は図の下の文章を参照してください。'}
    className="w-full h-auto rounded-lg border border-ink-border" xmlns="http://www.w3.org/2000/svg">
    <title>{guide.titleJa + '・' + label}</title>
    <rect x="0" y="0" width="240" height="150" fill="#f1e9de" />
    {guide.diagram[variant].map(draw)}
  </svg>;
};
export default CompositionDiagram;
