import { practicalExamples } from './patterns/practical-patterns';

/**
 * Rights inventory for all entries in data/definitions.tsx.
 *
 * These are review findings, NOT copyright grants. Changing an entry to
 * CONFIRMED must be coupled with a legally reviewed, complete, ID-scoped
 * operative license and copy UX. Do not infer rights from commit authorship.
 */
export type PatternRightsStatus = 'CONFIRMED' | 'UNCLEAR' | 'EXCLUDED';

export interface PatternRightsRecord {
  status: PatternRightsStatus;
  grantActive: boolean;
  sourcePath: string;
  outputFormat: string;
  dependencyNote: string;
  sampleTextNote: string;
}

export const patternRights: Record<string, PatternRightsRecord> = {
  ...Object.fromEntries(practicalExamples.map(example => [example.id, {
    status: 'UNCLEAR' as const, grantActive: false,
    sourcePath: 'data/patterns/practical-patterns.tsx', outputFormat: 'HTML + native nested CSS',
    dependencyNote: 'Written during the ten-pattern addition; no imported template, remote asset, or runtime script.',
    sampleTextNote: 'Illustrative sample copy written for this addition; independent clearance and operative license remain pending.',
  }])),
  'elastic-button': {
    status: 'UNCLEAR', grantActive: false,
    sourcePath: 'data/animations/elastic-button.tsx', outputFormat: 'HTML + CSS',
    dependencyNote: 'System fonts; no remote asset in generated output.',
    sampleTextNote: 'Illustrative button label; its origin has not been independently verified.',
  },
  'smart-skeleton': {
    status: 'UNCLEAR', grantActive: false,
    sourcePath: 'data/animations/smart-skeleton.tsx', outputFormat: 'HTML + CSS',
    dependencyNote: 'Native checkbox; no remote library in generated output.',
    sampleTextNote: 'UI labels and loading status; provenance not independently verified.',
  },
  'glass-tilt': {
    status: 'UNCLEAR', grantActive: false,
    sourcePath: 'data/animations/glass-tilt.tsx', outputFormat: 'React JSX + CSS',
    dependencyNote: 'Requires React and JSX build; React has a separate third-party license.',
    sampleTextNote: 'Illustrative card content; provenance not independently verified.',
  },
  'fluid-toggle': {
    status: 'UNCLEAR', grantActive: false,
    sourcePath: 'data/animations/fluid-toggle.tsx', outputFormat: 'HTML + CSS',
    dependencyNote: 'Native checkbox; no remote library in generated output.',
    sampleTextNote: 'Sample switch label; provenance not independently verified.',
  },
  'glitch-text': {
    status: 'UNCLEAR', grantActive: false,
    sourcePath: 'data/animations/glitch-text.tsx', outputFormat: 'HTML + CSS',
    dependencyNote: 'CSS and native pause checkbox; no remote library in generated output.',
    sampleTextNote: 'Example GLITCH label; provenance not independently verified.',
  },
  'morph-fab': {
    status: 'UNCLEAR', grantActive: false,
    sourcePath: 'data/animations/morph-fab.tsx', outputFormat: 'HTML + CSS + JavaScript',
    dependencyNote: 'Inline JavaScript; no remote library in generated output.',
    sampleTextNote: 'Edit/Delete/Share are illustrative, not active commands.',
  },
  'warm-neo-brutalist-editorial': {
    status: 'UNCLEAR', grantActive: false,
    sourcePath: 'data/patterns/warm-neo-brutalist-editorial.tsx', outputFormat: 'HTML + CSS',
    dependencyNote: 'System font stack; no remote image or font in generated output.',
    sampleTextNote: 'Bilingual sample prose: authorship and reuse rights unverified; exclude pending clearance.',
  },
  'editorial-split-layout': {
    status: 'UNCLEAR', grantActive: false,
    sourcePath: 'data/patterns/editorial-split-layout.tsx', outputFormat: 'HTML + CSS',
    dependencyNote: 'System font stack; no remote image or font in generated output.',
    sampleTextNote: 'Bilingual sample prose: authorship and reuse rights unverified; exclude pending clearance.',
  },
};

