import React from 'react';
import { Link } from 'react-router-dom';
import { PatternDefinition } from '../types';
import { getPatternKind } from '../data/definitions';

interface PatternCardProps {
  definition: PatternDefinition;
  className?: string;
}

const kindLabels: Record<ReturnType<typeof getPatternKind>, string> = {
  motion: 'Motion',
  interaction: 'Interaction',
  style: 'Style',
  component: 'Component',
  layout: 'Layout',
  'text-effect': 'Text & FX',
};

const PatternCard: React.FC<PatternCardProps> = ({ definition, className = '' }) => {
  const defaultValues: Record<string, number> = {};
  definition.params.forEach(param => {
    defaultValues[param.key] = param.default;
  });

  const kind = getPatternKind(definition);

  return (
    <div className={`group relative flex flex-col bg-surface rounded-xl overflow-hidden border border-ink-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-paper-lg ${className}`}>
      <Link to={`/p/${definition.id}`} className="absolute inset-0 z-0" aria-label={`View ${definition.title}`} />

      <div aria-hidden="true" inert className="h-32 w-full bg-paper bg-grid-pattern flex items-center justify-center relative overflow-hidden p-4 z-10 pointer-events-none">
        <div className="scale-75 select-none flex items-center justify-center w-full h-full transition-opacity duration-300 [&_*]:[animation-play-state:paused] group-hover:[&_*]:[animation-play-state:running]">
          <definition.Preview values={defaultValues} paused />
        </div>
      </div>

      <div className="p-3 flex flex-col gap-2 border-t border-ink-border/50 bg-surface flex-1 pointer-events-none">
        <div className="flex justify-between items-start gap-2">
          <h4 className="text-sm font-bold text-ink leading-tight group-hover:text-primary transition-colors font-display line-clamp-2">
            {definition.title}
          </h4>
          <div className="size-6 rounded-full bg-paper/50 flex items-center justify-center text-primary/50 group-hover:bg-primary group-hover:text-paper transition-colors shrink-0">
            <span className="material-symbols-outlined text-[16px]">code</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-auto">
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary font-body border border-primary/20">
            {kindLabels[kind]}
          </span>
          {definition.tags[0] && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-ink/5 text-ink/60 font-body border border-ink/5">
              {definition.tags[0]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatternCard;
