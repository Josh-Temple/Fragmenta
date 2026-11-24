# Wave 8: C-093 / C-119 independent reacceptance handoff

Start: `78efa8e97c4a5f58f1c101882803f5a0060e6e29`.
Independent D's prior decision is **BLOCKED**, recorded in PR #49 comment
6690486278. This implementation does not replace that decision with PASS.
Keep Draft and `HOLD_NO_MERGE / NO_DEPLOY` throughout.

## C-093: a scene and corresponding shots

Both diagrams now share a top view: person (60,38), door near (182,38),
camera 1 near (60,67), camera 2 near (122,60). Red arrows are the person's
gaze towards the door; black arrows indicate camera shooting directions.
Numbered lower panels correspond to cameras 1 and 2.

In the example, camera 1 sees a right-looking person, and camera 2 aims at
the door. In the counterexample, only camera 2 turns back towards the person;
its corresponding shot therefore shows the person rather than the door.
Person, door, camera positions, gaze, and shot 1 remain fixed. The checker
verifies that camera 2's direction actually points at the stated target.

This teaches a consistent plane and target correspondence, not complete proof
of a natural film edit. Lens, field of view, height, vertical gaze angle,
perspective projection and actual footage still need separate evaluation.

## C-119: transform the same source

The two JSON diagram arrays are intentionally identical: one source containing
a three-sided gate and a red person. The normal geometry/schema checks remain;
only C-119's former requirement that arrays differ is replaced by an exact
same-source assertion. There are still 120 guides / 240 SVG diagrams.

The inspection select transforms that source in the real React SVG:

| Mode | Actual operation | Compare / limit |
| --- | --- | --- |
| Grayscale | CSS `grayscale(1)` on the source group | Only colour changes; coordinates and dimensions stay fixed |
| 25% | Uniform SVG scale 0.25, centred | Width and height are 25%; no separate drawing |
| 6.25% | Uniform SVG scale 0.0625, centred | Explicit failure condition: the person/legs become difficult to distinguish |
| Silhouette | Source fills become the same dark ink | Same shape positions and sizes; gate opening remains |
| Outline | Fill none, dark stroke width 2 | SVG shape boundaries; not raster edge extraction |

Each mode starts from the original, not from the preceding transformation.
The browser smoke checks same geometry in all five modes, exact scales,
grayscale filter, outline/silhouette properties, label and status. The focused
image runner also samples original PNG pixels to confirm grayscale and fill
changes, and exercises Tab / Shift+Tab through the native select.
Model image observations and human/perceptual acceptance remain separate.

Only these two detail pages retain vertically stacked diagrams at wider widths,
so their annotations and transformations remain readable in the narrow content
column. Other 118 guides, including C-002/008/023/041, retain their content and
rendered SVG markup. No new PNGs belong in the repository.

## Independent D reproduction

Use an authorized private checkout, fetch PR #49's branch and detach at the
final full HEAD in the latest Wave 8 PR comment. First verify HEAD, clean
checkout, Draft state, and `vercel.json` deployment disabled. Do not merge,
deploy, change Drive permissions, or rerun Actions.

With Node 22:

```sh
npm ci
npm run build
node scripts/pattern-artifacts.cjs
node scripts/pattern-manifest.cjs
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

From another terminal:

```sh
CHROME_BIN=/usr/bin/chromium node scripts/browser-smoke.mjs
```

Default smoke captures no PNGs. Independently operate search (including zero
results), solitude + narrative + 孤独 => C-073, pagination 24 to 120,
atlas/detail return, Enter, Tab and heading focus. Check CSS widths 360, 390,
768 and 1280. Open C-093 and C-119, trace each camera/shot correspondence,
and switch all five inspection modes to look for counterexamples.

Wave 7's 28 images remain historical evidence at the old HEAD. Wave 8 uses
focused originals of the two changed pages/modes; no automatic 28-image rerun.
The latest PR comment records final HEAD/tree, CI, original bytes, SHA-256,
image review counts, private retrieval, retention limits and any unresolved
issues. Separate-session D must obtain the originals and actually start React;
the implementer's smoke or screenshots do not count as D's operations.

True 200% browser zoom, external OS Clipboard readback, Android hardware,
assistive technology, human/expert all-120/source/rights review and image-model
reproducibility are not established by this scoped change.
