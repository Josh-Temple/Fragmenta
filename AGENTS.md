# AGENTS.md — Fragmenta

Concise, tool-agnostic repository rules for coding agents (compatible with Codex Cloud and Antigravity).

## 1. Repository Overview & Canonical Docs

- **Stack**: React 19, TypeScript, Vite 8, React Router 7, Tailwind CSS 4, Node.js `22.x` (`.nvmrc`).
- **Source of truth**:
  - Overview & stack: `README.md`
  - Product scope: `docs/PRODUCT_DIRECTION.md`, `docs/CONTENT_PLAN.md`
  - Deployment policy: `docs/DEPLOYMENT_POLICY.md`, `docs/DEPLOYMENT.md`
  - Licensing / rights boundaries: `docs/REUSE_LICENSING_DECISION.md`
- Read only the docs relevant to your task; do not pull unrelated documentation into context.

## 2. Standard Commands

- Install dependencies (locked): `npm ci --no-audit --no-fund`
- Fast iteration checks:
  - `npm run typecheck`
  - `npm run lint`
  - Targeted verification scripts in `package.json` (`design:verify`, `tools:verify`, `catalog:verify`, etc.)
- Full verification & build (runs `prebuild` + `vite build`):
  - `npm run build`
- Independent artifact & browser checks (matches `.github/workflows/ci.yml` and `glass-tilt-standalone.yml`):
  - `node scripts/pattern-artifacts.cjs`
  - `node scripts/pattern-manifest.cjs`
  - Headless browser smoke (requires `npm run preview -- --host 127.0.0.1 --port 4173 --strictPort`):
    `CHROME_BIN=google-chrome node scripts/browser-smoke.mjs`
  - Standalone React hydration check:
    `CHROME_BIN=google-chrome node scripts/glass-tilt-hydrated.mjs`

## 3. Hard Guardrails

- **No direct push to `main`, no force push, no merge, no production deploy** without explicit human approval naming the target PR/SHA.
- **Keep automatic Vercel deploys disabled**: Do not change `vercel.json` (`git.deploymentEnabled: false`) unless explicitly approved per `docs/DEPLOYMENT_POLICY.md`.
- **Preserve rights/licensing notices**: Do not grant blanket reuse licenses or weaken licensing disclosures (`docs/REUSE_LICENSING_DECISION.md`).
- **Minimal scoped diffs**: Avoid unrelated formatting, dependency upgrades, or weakening existing verification/regression scripts.
- **No secrets in code, logs, or PRs**: Never print or commit tokens, credentials, or `.env` values.

## 4. Workflow & Reporting

1. Branch from latest `origin/main` on a dedicated feature/test branch; do not share branches across concurrent agents.
2. Run partial checks while iterating; run full `npm run build` (and browser checks when UI changes) before opening or updating a PR.
3. Clearly distinguish **headless browser verification** from **real-device verification** (mark real mobile devices as unverified when only headless Chrome/Playwright was run).
4. In PR descriptions and final reports, include:
   - Base SHA, HEAD SHA, branch name, and PR URL (if created)
   - Commands executed with exit codes and key results
   - Acceptance criteria mapping, unverified items, and residual risks
   - Explicit separation of verified facts vs. assumptions

## 5. Cross-Environment Compatibility

- Keep this file plain Markdown without tool-specific frontmatter or proprietary include syntax so both Codex Cloud and Antigravity can read it cleanly.
- Environment-specific workflows (e.g., Google Drive guide/evidence handling in Antigravity Remote Agents) should live in project resources or skills rather than hard dependencies in this file.
