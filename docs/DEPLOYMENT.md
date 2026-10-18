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

The lockfile-bearing candidate declares:

- Framework: Vite
- Node.js: 22.x
- Install command: `npm ci`, provided by the candidate's `vercel.json`
- Build command: `npm run build`
- Output directory: `dist`

GitHub Actions independently runs:

```bash
npm ci
npx tsc --noEmit
npm run build
```

Verify the effective install command in the build events for the exact deployment. A configured command alone does not prove it ran. The existing Production deployment and its older build contract remain separate until a release is verified.

A change must pass the applicable CI and authenticated Preview acceptance before release. In the current release candidate, dependency-risk handling and rollback/operator confirmation are also required; a green build or a READY deployment does not override those gates.

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
5. Review the exact Vercel Preview Deployment, especially on mobile for visual changes. Keep authentication enabled.
6. Confirm security-risk handling, the current Production alias, the rollback target, and the authorized operator before merging the single release candidate to `main`.
7. Confirm the automatic Production Deployment reaches `READY`, serves the actual new `main` SHA, and ran the locked install/build.
8. Verify the application and key interactions on Production independently. If rendering differs from the accepted Preview, treat the release as incomplete and follow the verified recovery procedure.

## Source-controlled install command

The candidate contains a small `vercel.json` that sets `installCommand` to `npm ci`. This applies the locked dependency contract to new deployments built from this source without changing project-wide settings for an older source that lacks a lockfile.

No rewrite is needed for `HashRouter`. Do not infer rollback authorization or a successful rollback from this file; recovery must use the confirmed deployment, alias, and operator procedure.
