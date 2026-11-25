import React from 'react';
import { Link } from 'react-router-dom';
import { PatternDefinition } from '../types';
import { getPatternKind } from '../data/definitions';
import { patternChoices } from '../data/pattern-choices';

interface PatternCardProps {
  definition: PatternDefinition;
  className?: string;
}
const kindLabels: Record<ReturnType<typeof getPatternKind>, string> = {
  motion: 'モーション', interaction: '操作', style: 'スタイル',
  component: '部品', layout: 'レイアウト', 'text-effect': '文字効果',
};
const PatternCard: React.FC<PatternCardProps> = ({ definition, className = '' }) => {
  const defaultValues = Object.fromEntries(definition.params.map(param => [param.key, param.default]));
  return (
    <article className={'pattern-card ' + className}>
      <div className="pattern-cover" aria-hidden="true" inert>
        <div><definition.Preview values={defaultValues} paused /></div>
      </div>
      <div className="pattern-caption">
        <p className="pattern-kind">{kindLabels[getPatternKind(definition)]}</p>
        <h3><Link to={'/p/' + definition.id}><span lang="en">{definition.title}</span><span aria-hidden="true">↗</span></Link></h3>
        <p className="pattern-use">{patternChoices[definition.id]?.useJa ?? definition.description}</p>
      </div>
    </article>
  );
};
export default PatternCard;
