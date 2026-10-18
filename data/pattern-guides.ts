import { practicalExamples } from './patterns/practical-patterns';

export interface PatternGuide {
  codeFormat: string;
  useWhen: string;
  integrationSteps: string[];
  limitations: string[];
  parameterTips: string[];
  verificationChecks: string[];
}

// Describe the current generated examples, not certified components.
// Update these notes when a definition's output changes.
export const patternGuides: Record<string, PatternGuide> = {
  ...Object.fromEntries(practicalExamples.map(example => [example.id, {
    codeFormat: 'HTML + native nested CSS',
    useWhen: example.description,
    integrationSteps: ['Copy the complete section and style block into your page. No external library is required.', 'Replace sample text, data, and destinations. Prefix IDs again if using two copies of this same pattern.', 'Use a browser with native CSS nesting support and verify in your actual host layout.'],
    limitations: [example.guidance, 'Preview runs in a sandboxed document. Parent-page routing, forms, fonts, and security policy must be tested after integration. Reuse licensing remains pending.'],
    parameterTips: ['Content Spacing adjusts gaps and padding in pixels.', 'Corner Radius changes decorative corners without changing interaction behavior.'],
    verificationChecks: ['Test 360px, 768px, and 1280px layouts and keyboard navigation.', 'Check default and changed parameters, long text, and multiple instances. No performance or accessibility certification is claimed.'],
  }])),
  'elastic-button': {
    codeFormat: 'HTML + CSS',
    useWhen: 'Give an ordinary button a small hover and press response without changing its purpose.',
    parameterTips: [
      'Duration changes the timing, not the action. Compare keyboard focus and pointer feedback separately.',
      'Lift Distance moves the button upward; keep enough space around it so the outline is not clipped.',
      'Press Scale makes the pressed button smaller. Check that the label remains legible and nearby controls do not move.',
    ],
    verificationChecks: ['Activate the real action with keyboard and touch; check disabled and pending states in the host application.', 'Check the button inside its actual overflow container with reduced motion enabled.'],
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
    parameterTips: ['Speed is the duration of one sweep, not the expected request time. A higher value makes the sweep slower.', 'Shimmer Opacity changes decorative contrast. Compare the paused and reduced-motion versions as well.'],
    verificationChecks: ['Resolve the request as content, an empty result, and an error; the skeleton must disappear in all three cases.', 'Tab to Pause shimmer and press Space. Check that another instance keeps its own pause state.'],
    integrationSteps: [
      'Copy the placeholder markup and CSS into the same region that will receive the loaded content.',
      'Let the application replace the skeleton with content, an empty result, or an error when the request finishes.',
      'Keep one useful loading announcement and hide decorative placeholder shapes from assistive technology.',
    ],
    limitations: [
      'This is a loading appearance, not a fetch implementation, progress estimate, or error recovery flow.',
      'The copied example includes Pause shimmer. Keep that control available while the placeholder moves, and remove the placeholder when loading ends.',
    ],
  },
  'glass-tilt': {
    codeFormat: 'React JSX',
    useWhen: 'Add decorative depth to a small card whose information is still readable without hover.',
    parameterTips: ['Tilt Intensity changes the movement around the pointer. Try a smaller value before increasing it.', 'Blur changes backdrop filtering; measure it on the actual background and devices rather than treating it as a quality score.'],
    verificationChecks: ['Pause while the card is tilted; it must reset and ignore further pointer movement until resumed.', 'Check pointer leave, touch, reduced motion, and the card content without any movement.'],
    integrationSteps: [
      'Copy the entire JSX output, including React imports, the exported component, and its included styles.',
      'Use it in a project that compiles JSX and provides React; this output is not a plain HTML snippet.',
      'Replace the sample card content and check pointer leave, touch, keyboard access, and reduced motion in the surrounding page.',
    ],
    limitations: [
      'Tilt and glare are decoration. Do not hide essential information or actions behind pointer movement.',
      'The generated example includes Pause motion. Keep it reachable and measure the cost of blur in the host page.',
      'The copied decorative card has an image role. If adding real links or buttons, replace that role with suitable semantic markup so the controls remain exposed.',
    ],
  },
  'fluid-toggle': {
    codeFormat: 'HTML + CSS',
    useWhen: 'Represent an on/off setting with a visible switch.',
    parameterTips: ['Duration changes the transition between states; the underlying checked state must still change immediately.', 'Stretch Width changes the handle shape. Check both endpoints and make sure the handle stays inside the track.'],
    verificationChecks: ['Keep the setting label unchanged while toggling; check the announced on/off state with assistive technology.', 'Reload the host page to check its actual preference behavior; this example itself does not persist settings.'],
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
    parameterTips: ['Shake Amount changes the horizontal offset of the sliced layers. Compare the title paused before judging whether the effect helps.'],
    verificationChecks: ['Use Space on Pause animation and confirm that both sliced layers stop while the text remains visible.', 'Replace the sample title, then check the visible text, data-text, accessible label, and narrow-screen wrapping together.'],
    integrationSteps: [
      'Copy the text markup, pseudo-element styles, and keyframes together.',
      'When replacing GLITCH, keep the visible text, data-text, and accessible label consistent.',
      'Keep long explanations as ordinary readable text and test the heading at a narrow width.',
    ],
    limitations: [
      'The generated example uses an image role for its effect; it does not supply semantic heading structure for your page.',
      'The copied example includes Pause animation and reduced-motion handling. These features do not establish photosensitivity safety or full accessibility conformance.',
    ],
  },
  'morph-fab': {
    codeFormat: 'HTML + CSS + JavaScript',
    useWhen: 'Explore the transition between a compact action trigger and an expanded surface.',
    parameterTips: ['Expanded Radius changes the expanded shape, not the closed circular trigger. Compare both states after changing it.'],
    verificationChecks: ['Open and close with Enter and Space; verify aria-expanded after each operation.', 'If you add actual actions, check focus order, closing behavior, and every action handler independently.'],
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
    parameterTips: ['Corner Radius softens the outlined surface. Compare it with the outline width rather than using it as a layout control.', 'Outline Width adds visual weight and takes space inside the border-box.', 'Shadow Offset needs free space outside the element. Zero keeps the shadow at zero on narrow screens too.', 'Inner Spacing changes the space around real text. Check the longest heading and both languages after changing it.'],
    verificationChecks: ['Place differently configured instances together; each must keep its own radius, border, shadow, and spacing.', 'Add unrelated .meta and .badge elements outside the example; their styles must remain unchanged.'],
    integrationSteps: [
      'Copy the HTML and its style block; replace sample headings, metadata, and body text with real content.',
      'Choose appropriate heading levels in the host page and keep source order meaningful.',
      'Adjust radius, outline, shadow, and spacing, then check long Japanese and English text in the actual layout.',
    ],
    limitations: [
      'This is a visual treatment, not a complete site, a reading typography system, or a set of working controls.',
      'Metadata and badge selectors are scoped to .editorial-card, and parameters are set on each instance. Rename the component namespace if it already exists in your page.',
      'Check contrast with your own colors and keep shadows inside the available width. Decorative status labels must not imply application state.',
    ],
  },
  'editorial-split-layout': {
    codeFormat: 'HTML + CSS',
    useWhen: 'Place dates, sources, or other supporting metadata beside a main reading column.',
    parameterTips: ['Rail Width allocates room to context. A wider rail leaves less space for the main argument.', 'Column Gap separates the two regions. Test it with long source titles and real paragraphs.', 'Rule Width emphasizes the separator; it does not change the reading order.'],
    verificationChecks: ['Open the standalone output below and above 640px; check the horizontal/vertical separator and metadata-first reading order.', 'Try long Japanese and English headings, zoomed text, and two instances with different parameters.'],
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

