import React from 'react';
import { Link } from 'react-router-dom';
import { AnimationDefinition } from '../types';

interface AnimationCardProps {
  definition: AnimationDefinition;
  className?: string;
}

const AnimationCard: React.FC<AnimationCardProps> = ({ definition, className = '' }) => {
  // Extract default values for the preview
  const defaultValues: Record<string, number> = {};
  definition.params.forEach(p => defaultValues[p.key] = p.default);

  return (
    <div className={`group relative flex flex-col bg-surface rounded-xl overflow-hidden border border-ink-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-paper-lg ${className}`}>
      {/* 
        Link wrapper covers the whole card by default via absolute positioning 
        This allows the card to be clickable, but lets us put interactive elements on top
      */}
      <Link to={`/a/${definition.id}`} className="absolute inset-0 z-0" aria-label={`View ${definition.title}`} />

      {/* Preview Area */}
      <div className="h-32 w-full bg-paper bg-grid-pattern flex items-center justify-center relative overflow-hidden p-4 z-10 pointer-events-none">
        {/* 
           Performance Optimization:
           1. pointer-events-none by default: Prevents JS listeners (like glass-tilt) from firing on all cards simultaneously.
           2. group-hover:pointer-events-auto: Enables interaction ONLY when the user is focused on this specific card.
           3. animation-play-state: paused: Forces all CSS animations (keyframes) to freeze to save GPU.
        */}
        <div className="scale-75 select-none flex items-center justify-center w-full h-full 
                        group-hover:pointer-events-auto transition-opacity duration-300
                        [&_*]:[animation-play-state:paused] group-hover:[&_*]:[animation-play-state:running]">
          <definition.Preview values={defaultValues} />
        </div>
      </div>

      {/* Content Area (Clickable via the absolute Link underneath, pointer-events-none allows click-through) */}
      <div className="p-3 flex flex-col gap-2 border-t border-ink-border/50 bg-surface flex-1 pointer-events-none">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-bold text-ink leading-tight group-hover:text-primary transition-colors font-display line-clamp-1">
            {definition.title}
          </h4>
          <div className="size-6 rounded-full bg-paper/50 flex items-center justify-center text-primary/50 group-hover:bg-primary group-hover:text-paper transition-colors shrink-0">
            <span className="material-symbols-outlined text-[16px]">code</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1.5 mt-auto">
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-accent/10 text-ink/80 font-body border border-accent/20">
            {definition.tags[0]}
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-ink/5 text-ink/60 font-body border border-ink/5">
            {definition.tags.includes('React') ? 'React' : definition.tags.includes('Tailwind') ? 'Tailwind' : 'CSS'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnimationCard;