# Working design tools and content discovery

The home page prioritizes three tasks: choose a visual direction, inspect a UI pattern, and tune colors or typography. Planned content remains accessible in a compact disclosure. No original pattern or style is removed.

## Content

- `/tools`: two working design tools and a link to the ten remaining proposals.
- `/tools/contrast`: opaque sRGB foreground/background comparison, live sample, WCAG thresholds and scoped CSS copy.
- `/tools/typography`: editable Japanese/English sample, font size, line height, letter spacing, maximum text width, system font choice and scoped CSS copy.
- `/search`: the 18 existing patterns, 24 styles and 2 working tools. Japanese aliases supplement source metadata. Whitespace-separated words must all match; Unicode compatibility normalization supports full-width English input. Future proposals are excluded.
- Search results link to a specific style with `/styles?style=<existing-id>`.
- `/saved` redirects to Collections; `/settings` redirects Home. There was no implemented saved data or settings behavior on the source base.

The original twelve proposed tool definitions are retained in source. Live tool IDs are filtered out of the planned list, so the two states cannot be shown simultaneously. Live tools do not enter the UI-pattern registry or change its reuse permissions.

## Limits

Inputs remain in component memory; they are neither persisted nor sent to a server. Navigating away resets them. Clipboard access happens only when Copy is pressed; failure leaves selectable output and an explanatory message.

The contrast tool accepts only `#RGB` and `#RRGGBB`. It does not evaluate transparency, images, gradients or whole-page accessibility. A full-precision ratio is compared to each threshold before display rounding. The non-text row applies only to the visual information identified by SC 1.4.11 and adjacent colors.

The typography preview is constrained by both the selected maximum width and the available screen width. It is not device emulation. Font rendering depends on installed system fonts. Exported rules are scoped to `.fragmenta-prose`; headings use `h2` and paragraphs use `p`.

## Primary references

- [W3C: Contrast minimum, including the sRGB luminance formula](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [W3C: Contrast enhanced](https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html)
- [W3C: Non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)

## Verification

`npm run build` includes TypeScript, AST lint, existing design atlas checks and `tools:verify`. The latter verifies known contrast fixtures, exact threshold boundaries, grayscale symmetry/monotonicity, invalid input rejection, CSS settings, search normalization, and disjoint live/planned catalogs. The existing artifact/manifest checks retain 18 pattern IDs and 36 generated outputs.

The existing browser route matrix now includes the three new tool routes and the ten-proposal page. Browser results, clipboard readback, mobile/zoom and protected Preview acceptance must be recorded separately from successful source checks. A passing build is not browser acceptance.

## Integration

Based on main `3e68427b4d8737b905823f0e410c0b0a92ab77f2`. This change does not integrate or release PR #37, #39, the Morph experiments or deployment-policy PR #36. Layout, App, Home and the small style deep-link change overlap those branches; reconcile against their final accepted versions. Preserve their release gates and any independently tested behavior.
