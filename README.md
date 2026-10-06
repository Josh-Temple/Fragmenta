# Fragmenta

**A live gallery of reusable web UI patterns, with copy-ready code and AI prompts.**

Fragmenta began as a CSS and JavaScript animation gallery. Its direction is expanding to cover practical web UI patterns more broadly: motion, microinteractions, visual styles, component treatments, layouts, and text or visual effects.

The project is intentionally more than an inspiration board. Each gallery item should become a reproducible browser implementation that users can preview, inspect, adapt, and take away as code or an AI-ready prompt.

## Current capabilities

The current app already supports:

- live animation previews
- category browsing and search
- adjustable parameters
- generated implementation code
- generated AI prompts
- performance and accessibility information
- collections and best-practice guidance

Existing examples include elastic buttons, loading skeletons, glass tilt, fluid toggles, glitch text, and morphing action buttons.

## Product direction

The canonical product direction is documented in [`docs/PRODUCT_DIRECTION.md`](./docs/PRODUCT_DIRECTION.md).

The next major step is to preserve the existing animation gallery while generalizing the data model and detail view so Fragmenta can also represent static visual styles and layout patterns.

## Run locally

**Prerequisite:** Node.js

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Current stack

- React
- TypeScript
- Vite
- React Router

## Original AI Studio project

The original AI Studio version remains available here:

https://ai.studio/apps/drive/1uJLAuPEgNAGCtksgP7BBwyuN_sue_Ee2
