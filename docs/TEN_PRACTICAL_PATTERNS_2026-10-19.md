# Ten practical patterns

Adds ten definitions to the existing eight-pattern candidate, plus a collection and individual usage guides. Base: PR #18, `eb2c906a2ea0d6fd0c804bd4d271cb3368a38439`. This change does not incorporate or replace the separate rights-notice PR #19.

## Added

Inline Validation; Article Table of Contents; Readable Article; Native FAQ; Pricing Comparison; Release Timeline; Metric Summary; Breadcrumb Trail; Empty State; Responsive Data Table.

Each has standalone HTML/CSS, an isolated sandboxed iframe preview of the same output, spacing/radius controls, AI prompt, integration notes, limitations, and bilingual sample text where useful. Generated examples contain no remote assets or scripts. Prices, release history, and metric values are visibly illustrative. The input example is a field with browser syntax validation, not a submission service; pricing links lead to an explanatory note, not checkout.

New markup, CSS, and sample text were written during this task rather than imported from third-party templates. This records the implementation process, not independent legal clearance. No existing license decision or grant was changed. Native CSS nesting is required. Duplicate instances of the same pattern need distinct fragment IDs and matching references.

## Local validation

- TypeScript `npx tsc --noEmit`: PASS.
- `npm run build`: PASS.
- Existing `node scripts/pattern-artifacts.cjs`: PASS, all 16 existing default/changed artifacts.
- New `scripts/practical-patterns.cjs`: PASS, ten patterns × two parameter variants × 360/768/1280px (60 browser cases); no document horizontal overflow, scoped nested CSS applied, invalid numeric values fall back to defaults.
- Native FAQ Enter/Space, invalid/valid email feedback, every local fragment target, and keyboard horizontal table scrolling: PASS.
- Local built application: all ten browse links and detail routes, iframe rendering, changed spacing reflected in generated code and live preview, actual browser clipboard equality for all ten, no uncaught page errors: PASS.

Browser: headless Chromium 153.0.8010.0 obtained as a temporary npm-packaged executable; Playwright from the environment. Temporary browser dependencies were not added to package.json or package-lock.json. Browser tests are local, not authenticated hosted Preview or physical Android acceptance. No performance benchmark, screen-reader audit, or cross-browser certification is claimed.

To repeat browser checks, supply Playwright and a Chromium executable:

```sh
PLAYWRIGHT_MODULE=/path/to/playwright CHROME_BIN=/path/to/chromium node scripts/practical-patterns.cjs
```

Optionally set `APP_URL` to a locally served production build to include gallery, parameter, and real clipboard checks. Local browser/server must share a network namespace.

## Integration

Stack this PR on the release-candidate branch, preserving the existing release process. PR #19 can be integrated independently; its rights inventory and license-page counts must be extended to include these ten IDs when combined. No main merge or Production publication was performed in this task.
