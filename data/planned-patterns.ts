import type { PatternKind } from '../types';

// These entries are reserved content slots, not released PatternDefinitions.
// Keep them out of definitions until preview, code, prompt, and review gates are complete.
export interface PlannedPattern {
  id: string;
  title: string;
  description: string;
  kind: PatternKind;
  icon: string;
  tags: readonly string[];
  acceptance: string;
  status: 'planned';
}

export const plannedPatterns: readonly PlannedPattern[] = [
  {
    id: 'command-palette',
    title: 'Command Palette',
    description: 'A searchable command menu for keyboard-first navigation and actions.',
    kind: 'interaction',
    icon: 'terminal',
    tags: ['Keyboard', 'Search'],
    acceptance: 'Working search and selection, arrow-key navigation, Enter and Escape, focus return, and meaningful real commands.',
    status: 'planned',
  },
  {
    id: 'modal-dialog-drawer',
    title: 'Modal Dialog / Drawer',
    description: 'An accessible modal and a responsive slide-in drawer.',
    kind: 'component',
    icon: 'dialogs',
    tags: ['Dialog', 'Responsive'],
    acceptance: 'Open and close actions, keyboard focus management, Escape handling, background inertness, and narrow-screen behavior.',
    status: 'planned',
  },
  {
    id: 'toast-notifications',
    title: 'Toast Notifications',
    description: 'Success, warning, and error messages that respond to actual actions.',
    kind: 'interaction',
    icon: 'notifications_active',
    tags: ['Feedback', 'Status'],
    acceptance: 'Triggerable states, appropriate live-region announcements, dismiss controls, and a considered timeout/pause policy.',
    status: 'planned',
  },
  {
    id: 'ai-chat-interface',
    title: 'AI Chat Interface',
    description: 'A chat composition and response-state interface for AI products.',
    kind: 'component',
    icon: 'forum',
    tags: ['AI', 'Chat'],
    acceptance: 'Clearly marked simulated response states, composing, stop/retry actions, accessible message order, and no fake live AI connection.',
    status: 'planned',
  },
  {
    id: 'tabs-segmented-control',
    title: 'Tabs / Segmented Control',
    description: 'Switch between related views or select a single option with clear state.',
    kind: 'interaction',
    icon: 'tab',
    tags: ['Tabs', 'Selection'],
    acceptance: 'Functional selection, appropriate tab or radio semantics, keyboard operation, and reduced-motion support if animated.',
    status: 'planned',
  },
  {
    id: 'filter-chips',
    title: 'Filter Chips',
    description: 'Combinable filter controls that change a visible result list.',
    kind: 'interaction',
    icon: 'filter_alt',
    tags: ['Filter', 'List'],
    acceptance: 'Real result filtering, visible selected states, clear/reset, empty results, and keyboard-accessible controls.',
    status: 'planned',
  },
  {
    id: 'before-after-slider',
    title: 'Before / After Slider',
    description: 'Reveal and compare two example visuals using a draggable divider.',
    kind: 'interaction',
    icon: 'compare',
    tags: ['Comparison', 'Media'],
    acceptance: 'Pointer and keyboard operation, labelled position, responsive clipping, and original or appropriately licensed comparison assets.',
    status: 'planned',
  },
  {
    id: 'scroll-progress-reveal',
    title: 'Scroll Progress & Reveal',
    description: 'Article scroll progress and optional content entrance effects.',
    kind: 'motion',
    icon: 'vertical_align_bottom',
    tags: ['Scroll', 'Progress'],
    acceptance: 'Progress linked to the actual scroll region, smooth narrow-screen behavior, reduced-motion handling, and no hidden essential content.',
    status: 'planned',
  },
  {
    id: 'aurora-gradient',
    title: 'Aurora Gradient',
    description: 'A customizable ambient background with softly shifting colors.',
    kind: 'style',
    icon: 'gradient',
    tags: ['Gradient', 'Background'],
    acceptance: 'Adjustable colors and speed, animation pause/reduced motion, legible foreground contrast, and no unsupported performance claim.',
    status: 'planned',
  },
  {
    id: 'kinetic-typography',
    title: 'Kinetic Typography',
    description: 'Text entrance and transformation effects built around readable copy.',
    kind: 'text-effect',
    icon: 'text_fields',
    tags: ['Typography', 'Motion'],
    acceptance: 'Configurable timing, preserved accessible text, pause/reduced-motion handling, and long Japanese/English text testing.',
    status: 'planned',
  },
  {
    id: 'responsive-bento-grid',
    title: 'Responsive Bento Grid',
    description: 'An asymmetrical card grid that reflows across screen sizes.',
    kind: 'layout',
    icon: 'dashboard',
    tags: ['Cards', 'Responsive'],
    acceptance: 'Adjustable spans and spacing, stable reading order, long-content wrapping, and meaningful mobile/desktop layouts.',
    status: 'planned',
  },
  {
    id: 'file-upload-dropzone',
    title: 'File Upload Dropzone',
    description: 'A drag-and-drop file selection surface with keyboard fallback.',
    kind: 'component',
    icon: 'upload_file',
    tags: ['Input', 'Files'],
    acceptance: 'Native file-picker fallback, drag/drop states, file-type and size feedback, explicit local-only behavior, and no implied server upload.',
    status: 'planned',
  },
];
