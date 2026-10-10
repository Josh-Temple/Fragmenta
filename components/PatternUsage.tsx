import React from 'react';
import type { PatternGuide } from '../data/pattern-guides';

const PatternUsage: React.FC<{ guide: PatternGuide }> = ({ guide }) => (
  <div className="space-y-4 text-sm leading-relaxed text-ink-muted">
    <p>{guide.useWhen}</p>
    <p><span className="font-semibold text-ink">Code format:</span> {guide.codeFormat}</p>
    <div>
      <h3 className="font-semibold text-ink mb-2">Integration steps</h3>
      <ol className="list-decimal pl-5 space-y-2">
        {guide.integrationSteps.map(step => <li key={step}>{step}</li>)}
      </ol>
    </div>
    <div>
      <h3 className="font-semibold text-ink mb-2">Before using it</h3>
      <ul className="list-disc pl-5 space-y-2">
        {guide.limitations.map(note => <li key={note}>{note}</li>)}
      </ul>
    </div>
  </div>
);

export default PatternUsage;
