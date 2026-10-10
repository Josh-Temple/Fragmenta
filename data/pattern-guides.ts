export interface PatternGuide {
  codeFormat: string;
  useWhen: string;
  integrationSteps: string[];
  limitations: string[];
}

// Describe the current generated examples, not certified components.
// Update these notes when a definition's output changes.
export const patternGuides: Record<string, PatternGuide> = {
  'elastic-button': {
    codeFormat: 'HTML + CSS',
    useWhen: 'Give an ordinary button a small hover and press response without changing its purpose.',
    integrationSteps: [
      'Copy the button markup and its style block together; replace the example label with the actual action.',
      'Use type="button" for a local action, or type="submit" inside a form. Connect the action in your application.',
      'Start with the default lift, scale, and duration, then adjust one value and compare the copied result.',
    ],
    limitations: [
      'The example supplies a visual treatment, not an application action, disabled state, or loading state.',
      'Hover is optional feedback. Keep a visible keyboard focus and a working touch target with reduced motion.',
    ],
  },
  'smart-skeleton': {
    codeFormat: 'HTML + CSS',
    useWhen: 'Show the approximate shape of content while a real request is pending.',
    integrationSteps: [
      'Copy the placeholder markup and CSS into the same region that will receive the loaded content.',
      'Let the application replace the skeleton with content, an empty result, or an error when the request finishes.',
      'Keep one useful loading announcement and hide decorative placeholder shapes from assistive technology.',
    ],
    limitations: [
      'This is a loading appearance, not a fetch implementation, progress estimate, or error recovery flow.',
      'Stop the shimmer when loading ends. Check a static version with reduced motion and provide a way to pause non-essential continuous motion when needed.',
    ],
  },
  'glass-tilt': {
    codeFormat: 'React JSX',
    useWhen: 'Add decorative depth to a small card whose information is still readable without hover.',
    integrationSteps: [
      'Copy the entire JSX output, including React imports, the exported component, and its included styles.',
      'Use it in a project that compiles JSX and provides React; this output is not a plain HTML snippet.',
      'Replace the sample card content and check pointer leave, touch, keyboard access, and reduced motion in the surrounding page.',
    ],
    limitations: [
      'Tilt and glare are decoration. Do not hide essential information or actions behind pointer movement.',
      'The example includes idle motion and blur. Decide whether idle motion should be removed or paused, and measure rendering cost on the devices you support.',
    ],
  },
  'fluid-toggle': {
    codeFormat: 'HTML + CSS',
    useWhen: 'Represent an on/off setting with a visible switch.',
    integrationSteps: [
      'Copy the label, native checkbox, and CSS together. The standalone example does not require JavaScript for switching.',
      'Add a visible setting label and give the input an accessible name that matches it.',
      'Connect the checked state to the setting in your application; add a name if it must be submitted with a form.',
    ],
    limitations: [
      'The checked appearance does not save a preference or call an API. Those effects belong to the host application.',
      'Check Space, focus visibility, the on/off announcement, and the touch target. Keep the label stable as the state changes.',
    ],
  },
  'glitch-text': {
    codeFormat: 'HTML + CSS',
    useWhen: 'Use a short decorative title where text distortion supports the page and is optional.',
    integrationSteps: [
      'Copy the text markup, pseudo-element styles, and keyframes together.',
      'When replacing GLITCH, keep the visible text, data-text, and accessible label consistent.',
      'Keep long explanations as ordinary readable text and test the heading at a narrow width.',
    ],
    limitations: [
      'The generated example uses an image role for its effect; it does not supply semantic heading structure for your page.',
      'Reduced motion removes the animation. For continuous decorative motion, consider a static treatment or a pause control; do not infer photosensitivity safety from this demo.',
    ],
  },
  'morph-fab': {
    codeFormat: 'HTML + CSS + JavaScript',
    useWhen: 'Explore the transition between a compact action trigger and an expanded surface.',
    integrationSteps: [
      'Copy the button, CSS, and script together; keep the script after the markup or run it after the DOM is ready.',
      'The example toggles aria-expanded and its accessible label. Preserve that state relationship when adapting it.',
      'If adding real actions, implement separate controls with their own labels, handlers, and a deliberate focus order.',
    ],
    limitations: [
      'Edit, Delete, and Share are illustrative text, not working actions. This example is not a complete accessible menu.',
      'For multiple instances, scope the script and state to each instance. Verify opening, closing, focus, and reduced motion after adaptation.',
    ],
  },
  'warm-neo-brutalist-editorial': {
    codeFormat: 'HTML + CSS',
    useWhen: 'Give a short editorial section strong type, warm surfaces, outlines, and offset shadows.',
    integrationSteps: [
      'Copy the HTML and its style block; replace sample headings, metadata, and body text with real content.',
      'Choose appropriate heading levels in the host page and keep source order meaningful.',
      'Adjust radius, outline, shadow, and spacing, then check long Japanese and English text in the actual layout.',
    ],
    limitations: [
      'This is a visual treatment, not a complete site, a reading typography system, or a set of working controls.',
      'Scope the generic .meta and .badge selectors to .editorial-card when embedding the example in a larger page.',
      'Check contrast with your own colors and keep shadows inside the available width. Decorative status labels must not imply application state.',
    ],
  },
  'editorial-split-layout': {
    codeFormat: 'HTML + CSS',
    useWhen: 'Place dates, sources, or other supporting metadata beside a main reading column.',
    integrationSteps: [
      'Copy the semantic section, aside, article, and CSS into a normal HTML page.',
      'Replace the example copy and preserve the metadata-before-article DOM order.',
      'Check the generated layout on both sides of its 640px breakpoint, including long source titles and body text.',
    ],
    limitations: [
      'The compact gallery preview illustrates the two-column arrangement. The generated CSS uses a viewport breakpoint; resizing only its container does not trigger that media query.',
      'This is a metadata rail, not a table of contents, current-section tracker, or sticky navigation implementation.',
    ],
  },
};
