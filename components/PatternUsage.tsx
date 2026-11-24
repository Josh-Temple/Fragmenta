import CopyReviewBrief from './CopyReviewBrief';
import { getPatternSelection, patternSelectionBrief } from '../data/pattern-selection';
import React from 'react';
import { Link } from 'react-router-dom';
import type { PatternGuide } from '../data/pattern-guides';
import { patternChoices } from '../data/pattern-choices';
import { definitions } from '../data/definitions';

const PatternUsage: React.FC<{ guide: PatternGuide; id: string }> = ({ guide, id }) => (
  <div lang="en" className="space-y-4 text-sm leading-relaxed text-ink-muted">
    <div lang="ja" className="space-y-2">
      <h3 className="font-semibold text-ink">このパターンを選ぶとき</h3>
      <p><strong>向く場面　</strong>{patternChoices[id].useJa}</p>
      <p><strong>向きにくい場面　</strong>{patternChoices[id].avoidJa}</p>
      <p><strong>実画面での確認　</strong>{patternChoices[id].checkJa}</p>
      <p className="text-xs">{getPatternSelection(id).sourceScope}</p>
      <CopyReviewBrief text={patternSelectionBrief(id)} />
    </div>
    <div><h3 className="font-semibold text-ink mb-2">When to use it</h3><p>{guide.useWhen}</p></div>
    {patternChoices[id] && <>
      <div><h3 className="font-semibold text-ink mb-2">When it is not a good fit</h3><p>{patternChoices[id].avoidWhen}</p></div>
      <div><h3 className="font-semibold text-ink mb-2">Where to start</h3><p>{patternChoices[id].startWith}</p></div>
    </>}
    <p><span className="font-semibold text-ink">Code format:</span> {guide.codeFormat}</p>
    <div>
      <h3 className="font-semibold text-ink mb-2">Try the parameters</h3>
      <ul className="list-disc pl-5 space-y-2">
        {guide.parameterTips.map(tip => <li key={tip}>{tip}</li>)}
      </ul>
    </div>
    <div>
      <h3 className="font-semibold text-ink mb-2">Integration steps</h3>
      <ol className="list-decimal pl-5 space-y-2">
        {guide.integrationSteps.map(step => <li key={step}>{step}</li>)}
      </ol>
    </div>
    <div>
      <h3 className="font-semibold text-ink mb-2">Check in your page</h3>
      <ul className="list-disc pl-5 space-y-2">
        {guide.verificationChecks.map(check => <li key={check}>{check}</li>)}
      </ul>
    </div>
    <div>
      <h3 className="font-semibold text-ink mb-2">Before using it</h3>
      <ul className="list-disc pl-5 space-y-2">
        {guide.limitations.map(note => <li key={note}>{note}</li>)}
      </ul>
    </div>
    {patternChoices[id] && <section aria-labelledby={`related-patterns-${id}`} data-pattern-id={id}>
      <h3 id={`related-patterns-${id}`} className="font-semibold text-ink mb-2">Related patterns</h3>
      <ul className="space-y-3">
        {patternChoices[id].related.map(item => <li key={item.id}>
          <Link to={'/p/' + item.id} className="inline-flex min-h-11 items-center py-2 font-semibold text-ink underline underline-offset-4 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">{definitions[item.id].title}</Link>
          <p lang="ja">{item.reasonJa}</p><p>{item.reason}</p>
        </li>)}
      </ul>
    </section>}
  </div>
);

export default PatternUsage;
