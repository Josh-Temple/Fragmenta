# Fragmenta: controlled Vercel deployments

## Policy

Fragmenta uses **manual deployments from an exact Git SHA**. Pushing an
implementation commit, opening a draft PR, or updating its branch must **not**
automatically create Vercel Preview or Production deployments.

- Development: edit and validate locally, then push only meaningful batches.
- Integration acceptance: deploy **one reviewed candidate SHA** to a
  Vercel Preview when browser testing is required; repeat only after a
  material change or a failed build. Verify the Preview commit SHA.
- Production: requires separate, explicit approval of the integrated PR
  and the exact release SHA. Do not equate a merge, READY build, or an
  accepted Draft PR with approval to publish.
- GitHub Actions should not be re-run merely to prove deployment behavior;
  the available Actions quota may be exhausted.
- Existing Preview SSO protection, production aliases, and rights/release
  gates remain in force.

## Repository control

`vercel.json` sets `git.deploymentEnabled: false`. This disables **Git
integration's automatic deployments** for commits whose source includes
this configuration. It does not disable deliberate deployments through
Vercel's deployment API/CLI.

Do not change `git.deploymentEnabled` to `true` just to make a Preview:
use an explicit deployment request for the reviewed SHA.

**Important transition condition:** older, already-open branches that do
not contain this `vercel.json` change may still trigger automatic Preview
deployments if project-wide Preview deployments are re-enabled. Before
re-enabling, either update active branches to include this file or stop
their pushes and coordinate a bounded manual acceptance window.

## Temporary project-wide safeguard

On 2026-10-27, the Vercel project `fragmenta` was requested to set
`previewDeploymentsDisabled: true` through the project settings API,
as a temporary protection while the repository control is reviewed.

This temporarily prevents ordinary new Preview deployments, including
the expected Preview used for integration acceptance. It must be
explicitly relaxed for a controlled manual Preview test when supported.
Do not leave it relaxed during uncontrolled parallel branch pushes.
Verify the actual current API setting before changing it; do not rely
on this historical note alone.

Project: `josh-temples-projects/fragmenta`
(`prj_TjxQ2SH9RZFDHNypChXUzviLguVp`).

## Checks before any deployment

1. Fresh-read GitHub `main`, PR HEAD, and the intended release SHA.
   Verify no unrelated Morph changes, rights changes, or PR #32
   overlap are accidentally incorporated.
2. On the exact candidate revision run:
   ```sh
   npm ci
   npm run typecheck
   npm run lint
   npm run design:verify
   npm run build
   ```
3. Record the SHA, commands, results, and the decision to deploy.
   A successful local build is not a browser acceptance test.
4. Confirm the intended deployment target is **Preview**, not Production,
   and that existing Preview authentication is still enabled.

## On-demand integration Preview

1. Coordinate a short Preview window; ensure no uncontrolled pushes
   are occurring from legacy branches lacking the repository setting.
2. If needed, temporarily set project
   `previewDeploymentsDisabled: false` through the Vercel project API.
3. Request exactly one Vercel deployment from the connected
   `Josh-Temple/Fragmenta` repository and the **verified commit SHA**,
   with `target` omitted (Preview) — never `production`.
4. Await READY; compare reported Git SHA with the intended SHA.
   Use an authenticated browser to test the actual Preview and record
   tests not run as NOT_RUN.
5. If more code changes are needed, return to local validation and
   request another Preview only for the final revised candidate.
6. Restore `previewDeploymentsDisabled: true` if legacy branch traffic
   is still uncontrolled. Otherwise, after independently verifying
   `git.deploymentEnabled: false` on all active branches, the
   project-level temporary block may be removed.

## Approved Production deployment

1. Obtain separate user approval naming the integrated PR/release
   and exact release SHA. Approval of this configuration policy alone
   does **not** authorize publishing application changes.
2. Check the final branch, source SHA, deployment protection, and
   production alias mappings.
3. Deploy the approved revision explicitly with
   `target: production` using the connected Vercel Git source.
4. Check READY, SHA, production aliases, and browser smoke tests.
   If checks fail, stop and use the existing approved rollback
   procedure; do not repeatedly rebuild to chase success.

## Recovery

If manual deployment cannot be started, diagnose Preview-disabled state,
Git source access, and SHA first. Avoid reverting the automatic Git
trigger solely as a workaround. A restoration of automatic production
deployments is a release-policy change requiring explicit approval.

Vercel reference:
https://vercel.com/docs/project-configuration/git-configuration
