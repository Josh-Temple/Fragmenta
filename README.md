# Fragmenta

**A live gallery of reusable web UI patterns, with copy-ready code and AI prompts.**

Fragmenta began as a CSS and JavaScript animation gallery. It now uses the same preview-and-copy workflow for motion, microinteractions, visual styles, component treatments, layouts, and text or visual effects.

The project is intentionally more than an inspiration board. Each gallery item should become a reproducible browser implementation that users can preview, inspect, adapt, and take away as code or an AI-ready prompt.

## Production

Fragmenta is deployed to Vercel from the GitHub repository.

- Production: https://fragmenta-brown.vercel.app
- Production branch: `main`
- Pull requests: Vercel Preview Deployments
- Production is public; previews require Vercel authentication
- Framework: Vite
- Node.js: 22.x
- Install: `npm install`
- Build: `npm run build`
- Output: `dist`

GitHub remains the source of truth. Vercel is the deployment and preview environment. The app intentionally remains a standard Vite build rather than depending on Vercel-specific runtime features, so it can be moved to another static host if needed.

See [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) for the deployment policy and workflow.

## Current capabilities

The app supports:

- live browser previews for animated and static patterns
- top-level browsing across Motion, Interaction, Styles, Components, Layouts, and Text & Effects
- tag and text search
- adjustable parameters
- generated implementation code
- generated AI prompts
- performance, accessibility, and responsive guidance
- collections and best-practice guidance

Current examples include the original animation set plus:

- **Warm Neo-Brutalist Editorial** — a reusable visual style with warm paper tones, heavy type, outlined surfaces, and offset shadows
- **Editorial Split Layout** — a responsive metadata-rail and reading-column layout

## Architecture direction

The original `AnimationDefinition` model has been generalized to `PatternDefinition`. Compatibility aliases remain so the original animation entries can migrate incrementally rather than through a rewrite.

New entries should primarily consist of:

1. a pattern definition;
2. a live preview;
3. generated code;
4. an AI prompt;
5. accessibility, performance, and responsive notes where relevant.

The general pattern route is `/p/:id`. The original `/a/:id` route remains supported for compatibility.

## Product direction

The canonical product direction is documented in [`docs/PRODUCT_DIRECTION.md`](./docs/PRODUCT_DIRECTION.md).

The guiding question is:

> Does this help someone turn a visual or interaction idea into a reusable web implementation?

## Run locally

**Prerequisite:** Node.js 22

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
- Tailwind CSS browser build used by the existing prototype

## Original AI Studio project

The original AI Studio version remains available here:

https://ai.studio/apps/drive/1uJLAuPEgNAGCtksgP7BBwyuN_sue_Ee2
