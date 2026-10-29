export interface PatternChoice {
  avoidWhen: string;
  startWith: string;
  related: readonly { id: string; reason: string }[];
}

// Selection advice describes the existing examples; it does not grant reuse rights.
export const patternChoices: Readonly<Record<string, PatternChoice>> = {
  'elastic-button': {
    avoidWhen: 'Avoid extra movement on dense toolbars or actions where a stable target matters more than decoration.',
    startWith: 'Reduce Lift Distance first. Keep the action label, focus outline and touch area stable before changing timing.',
    related: [{ id: 'fluid-toggle', reason: 'Use a switch for a persistent on/off setting.' }, { id: 'smart-skeleton', reason: 'Use a loading placeholder while an action is pending.' }],
  },
  'smart-skeleton': {
    avoidWhen: 'Do not use for an empty result, a failed request, or progress that you can measure accurately.',
    startWith: 'Match the shape to the content that will arrive. Then reduce shimmer opacity and compare with motion paused.',
    related: [{ id: 'empty-state', reason: 'Explain a successful search with no results.' }, { id: 'metric-summary', reason: 'Show the real values when loading finishes.' }],
  },
  'glass-tilt': {
    avoidWhen: 'Avoid on long reading sections, dense data tables, or content that must depend on pointer movement.',
    startWith: 'Start with a small tilt and low blur. Confirm readability without motion before increasing either value.',
    related: [{ id: 'warm-neo-brutalist-editorial', reason: 'Compare a static card with a clear outline.' }, { id: 'readable-article', reason: 'Use restrained typography for longer text.' }],
  },
  'fluid-toggle': {
    avoidWhen: 'Do not use for one-time actions, navigation, or choices with more than two states.',
    startWith: 'Keep a stable label and connect the checked state to a real setting. Adjust the transition only after both states work.',
    related: [{ id: 'elastic-button', reason: 'Use a button for a one-time action.' }, { id: 'inline-validation', reason: 'Give form fields persistent labels and feedback.' }],
  },
  'glitch-text': {
    avoidWhen: 'Avoid essential instructions, long paragraphs, or status messages that must be read immediately.',
    startWith: 'Use a short title. Compare the paused text first, then add the smallest distortion that supports the page.',
    related: [{ id: 'readable-article', reason: 'Keep the main explanation in readable text.' }, { id: 'warm-neo-brutalist-editorial', reason: 'Compare strong typography without text distortion.' }],
  },
  'morph-fab': {
    avoidWhen: 'Do not treat the sample labels as working actions or use the example as a complete accessible menu.',
    startWith: 'Check opening, closing and aria-expanded before changing the expanded radius. Add real actions with their own focus behavior.',
    related: [{ id: 'elastic-button', reason: 'Use a simpler button when expansion is unnecessary.' }, { id: 'native-faq', reason: 'Use native disclosure for question-and-answer content.' }],
  },
  'warm-neo-brutalist-editorial': {
    avoidWhen: 'Avoid repeating heavy outlines and offset shadows around every paragraph or dense row of data.',
    startWith: 'Set Inner Spacing around the longest heading. Then balance Outline Width and Shadow Offset against available width.',
    related: [{ id: 'readable-article', reason: 'Compare a quieter treatment for long articles.' }, { id: 'editorial-split-layout', reason: 'Give source notes their own metadata column.' }],
  },
  'editorial-split-layout': {
    avoidWhen: 'Avoid when the side column has no useful context or leaves the main text too narrow.',
    startWith: 'Set Rail Width using the longest source title. Check the stacked layout below 640px before widening the gap.',
    related: [{ id: 'article-table-of-contents', reason: 'Use real heading links when readers need section navigation.' }, { id: 'readable-article', reason: 'Use a single reading column when metadata is brief.' }],
  },
  'inline-validation': {
    avoidWhen: 'Do not use browser email syntax validation as proof of delivery, account ownership, or server acceptance.',
    startWith: 'Write the label and persistent instructions first. Then test an empty, invalid and valid value in the real form.',
    related: [{ id: 'fluid-toggle', reason: 'Represent a separate on/off preference.' }, { id: 'empty-state', reason: 'Explain an empty result after a successful query.' }],
  },
  'article-table-of-contents': {
    avoidWhen: 'A short article with few headings may not need a contents rail. Active-section tracking is not included.',
    startWith: 'Replace the headings and update every matching anchor ID. Test the destination below any sticky header.',
    related: [{ id: 'editorial-split-layout', reason: 'Use a metadata rail without section navigation.' }, { id: 'breadcrumb-trail', reason: 'Show the page location within the site hierarchy.' }],
  },
  'readable-article': {
    avoidWhen: 'Do not use a reading column as a substitute for a dense table, interactive dashboard, or full publishing system.',
    startWith: 'Use your actual text and font stack. Set the reading width first, then compare font size and line height.',
    related: [{ id: 'article-table-of-contents', reason: 'Add navigation for a longer article.' }, { id: 'warm-neo-brutalist-editorial', reason: 'Compare a more emphatic editorial treatment.' }],
  },
  'native-faq': {
    avoidWhen: 'Keep essential instructions visible. This example does not enforce one open answer at a time.',
    startWith: 'Write each question as a useful label. Check long answers and multiple expanded items before adding decoration.',
    related: [{ id: 'article-table-of-contents', reason: 'Use heading links for content that should stay visible.' }, { id: 'inline-validation', reason: 'Put field-specific instructions beside the input.' }],
  },
  'pricing-comparison': {
    avoidWhen: 'Do not present the invented prices as a real offer or expect billing, payment or subscription switching.',
    startWith: 'Replace the sample prices and features together. Verify each destination and explain the actual billing terms.',
    related: [{ id: 'responsive-data-table', reason: 'Compare many features in rows and columns.' }, { id: 'native-faq', reason: 'Explain separate plan questions in disclosures.' }],
  },
  'release-timeline': {
    avoidWhen: 'Do not use the static release list to imply planned delivery dates or calculated project progress.',
    startWith: 'Use verified dates and changes, preserve datetime values, and keep the chronological order explicit.',
    related: [{ id: 'metric-summary', reason: 'Show measured totals with a reporting period.' }, { id: 'readable-article', reason: 'Explain a release in a longer article.' }],
  },
  'metric-summary': {
    avoidWhen: 'Do not use sample values as live data, or add trends without defined denominators and aggregation.',
    startWith: 'State the unit, period, timezone and freshness with each real value before adjusting spacing.',
    related: [{ id: 'responsive-data-table', reason: 'Show the detailed rows behind a summary.' }, { id: 'smart-skeleton', reason: 'Reserve space while real metrics are loading.' }],
  },
  'breadcrumb-trail': {
    avoidWhen: 'Do not use for arbitrary browsing history or a site with no meaningful ancestor hierarchy.',
    startWith: 'Replace ancestor destinations, keep the current page as text, and test the longest labels at a narrow width.',
    related: [{ id: 'article-table-of-contents', reason: 'Navigate between sections of the current article.' }, { id: 'editorial-split-layout', reason: 'Present source context beside the main content.' }],
  },
  'empty-state': {
    avoidWhen: 'Do not show a zero-result message while loading or when permissions or the network prevented a successful query.',
    startWith: 'Explain what was searched and provide one real recovery action. Keep errors and loading as separate states.',
    related: [{ id: 'smart-skeleton', reason: 'Show a pending request before its result is known.' }, { id: 'inline-validation', reason: 'Explain invalid input before a query is submitted.' }],
  },
  'responsive-data-table': {
    avoidWhen: 'Do not expect built-in sorting, pagination or sticky columns. A table may be unnecessary for a few independent metrics.',
    startWith: 'Keep the caption and column scopes. Replace data, test long cells, and confirm keyboard scrolling within the table region.',
    related: [{ id: 'metric-summary', reason: 'Use a compact summary for a few independent values.' }, { id: 'pricing-comparison', reason: 'Use plan cards for a small number of offers.' }],
  },
};
