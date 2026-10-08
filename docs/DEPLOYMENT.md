# Deployment

## Decision

Fragmenta uses **GitHub as the source of truth** and **Vercel as the deployment platform**.

The repository should remain deployable as a conventional Vite static application. Vercel is the preferred operational environment, not a required application runtime.

## Environments

### Production

- Source branch: `main`
- URL: https://fragmenta-brown.vercel.app
- Access: public
- Deployment: automatic after changes reach `main`

### Preview

- Source: pull requests / non-production branches
- Deployment: automatic Vercel Preview Deployment
- Access: Vercel authentication is enabled
- Purpose: visual and interaction review before merge

Preview deployments are particularly important for Fragmenta because a successful type-check and build do not prove that a visual pattern looks or behaves correctly on a real browser or mobile device.

## Build contract

Vercel is configured with:

- Framework: Vite
- Node.js: 22.x
- Install command: `npm ci` (after the committed lockfile is incorporated)
- Build command: `npm run build`
- Output directory: `dist`

GitHub Actions independently runs:

```bash
npm ci
npx tsc --noEmit
npm run build
```

A change should pass CI before merge. For UI changes, a Preview Deployment should also be checked when practical.

## Routing

Fragmenta currently uses `HashRouter`.

This keeps client-side routes such as pattern details usable on static hosting without requiring Vercel-specific rewrite rules. The general detail route is `/p/:id`, with legacy `/a/:id` support retained for compatibility.

Do not add a Vercel-specific SPA rewrite merely to support the current router.

## Portability

Avoid introducing Vercel-only application dependencies unless a concrete feature requires them.

The preferred boundary is:

- GitHub: source, history, pull requests, review, CI
- Vercel: Preview Deployments and Production Deployment
- Vite output: portable static artifact in `dist`

If Fragmenta later needs server-side APIs or other runtime capabilities, evaluate those requirements separately rather than coupling the current static gallery to a hosting vendor in advance.

## Release workflow

1. Create a focused branch.
2. Implement the pattern or gallery change.
3. Open a pull request.
4. Wait for GitHub CI.
5. Review the Vercel Preview Deployment, especially on mobile for visual changes.
6. Merge to `main`.
7. Confirm the automatic Production Deployment reaches `READY`.
8. If production rendering differs from the preview, treat the deployment as incomplete and investigate before adding more patterns.

## No `vercel.json` by default

Fragmenta does not currently need a `vercel.json`.

The build contract is represented by the normal Vite project plus Vercel project settings. Add `vercel.json` only when a source-controlled Vercel-specific behavior such as redirects, headers, or another explicit platform feature becomes necessary.
