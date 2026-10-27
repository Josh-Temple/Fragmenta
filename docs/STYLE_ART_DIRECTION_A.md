# Fragmenta — Worker A: 24 Style Art Direction (source matrix)

**Base:** `3e68427b4d8737b905823f0e410c0b0a92ab77f2` (2026-10-27 JST).  
**Branch:** `worker-a/20261027-design-styles-art-direction-24`. **Scope:** A's recipes, specimen rendering, source tests.  
**Evidence class:** SOURCE_ONLY for the matrix; no browser screenshot or visually observed before/after is claimed.

## Baseline and change

Before A, 24 style IDs shared eight layout grammars. Each grammar determined headline sizing, spacing, banner, metric layout and article composition; style IDs primarily changed tokens, including color, borders, fonts and shadow. After A, each ID has an explicit recipe controlling a headline, spacing, alignment, border structure, metric split, panel treatment, chart marks and original CSS geometric motif. The *same words, numbers and sample action* remain across all styles.

**Dashboard:** two values (`Projects=12`, `Complete=86%`), seven activity bars and sample action.  
**Article:** common title/body/short supporting copy and sample action. Both screens use the same ID-specific recipe.

## 24 × 2 source-defined variants

| Style | Screen | Existing grammar | Heading px / alignment | Grid | Edge / panel | Ornament | Chart |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `minimalism` | Dashboard | quiet | 28 / left | single | none / open | none | thin |
| `minimalism` | Article | quiet | 28 / left | single | none / open | none | thin |
| `swiss` | Dashboard | strict-grid | 36 / left | wide-first | left / rule | ruler | square |
| `swiss` | Article | strict-grid | 36 / left | wide-first | left / rule | ruler | square |
| `bauhaus` | Dashboard | diagonal | 35 / left | wide-second | bottom / heavy | geometry | square |
| `bauhaus` | Article | diagonal | 35 / left | wide-second | bottom / heavy | geometry | square |
| `editorial` | Dashboard | 大きな見出しと幅の異なる情報ブロック | 43 / left | wide-first | bottom / rule | double-rule | thin |
| `editorial` | Article | 大きな見出しと幅の異なる情報ブロック | 43 / left | wide-first | bottom / rule | double-rule | thin |
| `scandinavian` | Dashboard | soft-cards | 30 / left | equal | none / soft | disc | rounded |
| `scandinavian` | Article | soft-cards | 30 / left | equal | none / soft | disc | rounded |
| `constructivism` | Dashboard | diagonal | 39 / left | wide-second | bottom / heavy | diagonal | offset |
| `constructivism` | Article | diagonal | 39 / left | wide-second | bottom / heavy | diagonal | offset |
| `brutalism` | Dashboard | stacked | 31 / left | single | top / heavy | crosshair | square |
| `brutalism` | Article | stacked | 31 / left | single | top / heavy | crosshair | square |
| `neo-brutalism` | Dashboard | stacked | 35 / left | wide-first | bottom / raised | ticket | square |
| `neo-brutalism` | Article | stacked | 35 / left | wide-first | bottom / raised | ticket | square |
| `memphis` | Dashboard | diagonal | 32 / left | wide-second | none / raised | confetti | rounded |
| `memphis` | Article | diagonal | 32 / left | wide-second | none / raised | confetti | rounded |
| `maximalism` | Dashboard | editorial | 42 / left | wide-first | double / ornate | collage | offset |
| `maximalism` | Article | editorial | 42 / left | wide-first | double / ornate | collage | offset |
| `postmodern` | Dashboard | diagonal | 36 / left | wide-second | left / double | collage | offset |
| `postmodern` | Article | diagonal | 36 / left | wide-second | left / double | collage | offset |
| `flat` | Dashboard | strict-grid | 29 / left | equal | bottom / rule | tiles | square |
| `flat` | Article | strict-grid | 29 / left | equal | bottom / rule | tiles | square |
| `glass` | Dashboard | soft-cards | 34 / left | wide-first | none / glass | frosted | rounded |
| `glass` | Article | soft-cards | 34 / left | wide-first | none / glass | frosted | rounded |
| `neumorphism` | Dashboard | soft-cards | 28 / left | equal | none / inset | emboss | rounded |
| `neumorphism` | Article | soft-cards | 28 / left | equal | none / inset | emboss | rounded |
| `skeuomorphism` | Dashboard | instrument | 31 / left | wide-second | top / inset | dial | rounded |
| `skeuomorphism` | Article | instrument | 31 / left | wide-second | top / inset | dial | rounded |
| `claymorphism` | Dashboard | soft-cards | 32 / left | equal | none / soft | pill | rounded |
| `claymorphism` | Article | soft-cards | 32 / left | equal | none / soft | pill | rounded |
| `art-deco` | Dashboard | editorial | 39 / center | equal | double / ornate | arch | thin |
| `art-deco` | Article | editorial | 39 / center | equal | double / ornate | arch | thin |
| `y2k` | Dashboard | retro | 35 / center | wide-first | none / raised | chrome | rounded |
| `y2k` | Article | retro | 35 / center | wide-first | none / raised | chrome | rounded |
| `vaporwave` | Dashboard | retro | 36 / center | wide-second | bottom / double | horizon | thin |
| `vaporwave` | Article | retro | 36 / center | wide-second | bottom / double | horizon | thin |
| `retro-futurism` | Dashboard | instrument | 34 / left | wide-second | top / inset | dial | segmented |
| `retro-futurism` | Article | instrument | 34 / left | wide-second | top / inset | dial | segmented |
| `pixel-art` | Dashboard | stacked | 28 / left | single | bottom / heavy | pixel | segmented |
| `pixel-art` | Article | stacked | 28 / left | single | bottom / heavy | pixel | segmented |
| `cyberpunk` | Dashboard | instrument | 35 / left | wide-first | left / heavy | terminal | thin |
| `cyberpunk` | Article | instrument | 35 / left | wide-first | left / heavy | terminal | thin |
| `organic` | Dashboard | quiet | 31 / left | equal | none / soft | leaf | rounded |
| `organic` | Article | quiet | 31 / left | equal | none / soft | leaf | rounded |
| `wabi-sabi` | Dashboard | quiet | 29 / left | single | bottom / open | brush | thin |
| `wabi-sabi` | Article | quiet | 29 / left | single | bottom / open | brush | thin |

Metric and chart parameters only appear in Dashboard; the Article variant uses the same headline, ornament and panel rules with its own body spacing. Columns remain source-level configuration, not a verified browser rendering.

## Representative eight: before → after (code comparison, not screenshot)

| ID | Before (shared grammar) | After (individual art direction) |
| --- | --- | --- |
| `swiss` | strict-grid generic two-column metrics and generic top glyph | 36px strongly aligned type, left headline rule, unequal metrics, ruler motif and square chart bars |
| `editorial` | editorial grammar shared with Art Deco and Maximalism | 43px restrained serif display, generous line spacing, double rule, fine chart bars and print-like measure |
| `neo-brutalism` | stacked grammar shared with Brutalism and Pixel Art | 35px high-weight type, staggered metric widths, thick outlines, hard raised panels and graphic ticket strip |
| `glass` | soft-cards grammar shared with several soft surfaces | layered frosted band, distinct translucent bordered panels, 34px title and rounded activity marks |
| `bauhaus` | diagonal grammar shared with Memphis, Postmodern and Constructivism | 35px emphatic type, basic-circle-and-square motif, bottom rule and thick utilitarian frames |
| `art-deco` | generic editorial structure and centered headline | 39px centered spaced display, symmetric repeat-arch border motif, double edging and narrow restrained chart |
| `cyberpunk` | instrument grammar shared with Retro-futurism and Skeuomorphism | 35px compact technical hierarchy, neon-tipped terminal rules, high-density information bands and thin bars |
| `wabi-sabi` | quiet grammar shared with Minimalism and Organic | 29px light heading, unusually large deliberate whitespace, subtle asymmetrical brush-like mark and uncluttered single-column information |

## Distinctiveness and rights

Each of 24 named IDs has three explicit decisions in `data/design-style-art-direction.ts`, in addition to the parameter fields shown above. The motifs are drawn with authored CSS gradients, borders or shapes; no external images, icon packs, hosted fonts, third-party clone assets or motion have been introduced.

The matrix and parameter signatures are checked by `node scripts/check-style-art-direction.cjs --matrix`, which is also invoked by the existing `design:verify` script. This asserts 24 IDs, 24 different multi-axis signatures, three distinct decisions per ID, safe layout bounds, 48 code-defined configurations and wiring into the renderer.

**Not yet accepted:** live screenshots for any of 48 configurations, before/after images, measured text contrast on translucent backgrounds, responsive overflow at 360px/390px, 200% zoom, keyboard/assistive technology, authenticated Preview UI, Android device or clipboard. These belong to independent browser acceptance and must not be inferred from build status.

## Scope protection

No changes to 18 existing live pattern definitions, planned patterns/tools, licensing rights/grants, A/B mix calculation, export or Morph, or to main/production/aliases/protection. The preview's artistic changes are source-authored examples, not official style standards or conformity certifications.
