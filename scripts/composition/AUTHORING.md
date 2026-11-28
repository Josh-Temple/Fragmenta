# 構図図鑑 — 執筆・作図ガイド (authoring guide)

This directory is the **source of truth** for the 120 composition entries.
`data/composition-guides.json` is generated from it by `node scripts/composition/build.cjs`.

```
scripts/composition/
  lib.cjs           shared drawing vocabulary (person, bust, tree, building, road, arrow, guides …)
  render.cjs        string SVG renderer (same look as components/CompositionDiagram.tsx)
  build.cjs         entries → data/composition-guides.json (+ --check)
  preview.cjs       contact sheet PNG for visual review
  entries/NN-*.cjs  one file per category, 12 entries each
```

Reference implementation: **`entries/01-basics.cjs`**. Read it before writing anything.

## 1. The one rule: controlled comparison

Every entry has two figures drawn from **one scene function**:

* **配置例 (example)** — the composition principle applied well.
* **対照例 (comparison)** — the *identical* scene with **exactly one variable changed**
  (position, size, direction, presence of one element, line shape, camera position, value …).

Everything else — every other shape, colour, size and coordinate — must be identical.
Write the scene as `const scene = (v) => [...]` and return `{ example: scene(a), comparison: scene(b) }`.
The changed variable is written in the `changed` field as `要素（例の状態 → 対照の状態）`.

The comparison should **not** be a strawman. It should be a plausible alternative that a
designer might actually produce, so the reader learns what the principle *adds*.

## 2. Visual language

Canvas 240 × 150. Background is paper (`#eceae2`) automatically — do not paint it.

| index | name | role |
|---|---|---|
| 0 | ink | key dark masses, strong structure |
| 1 | graphite | secondary dark masses, non-subject figures |
| 2 | stone | mid tones, far buildings, roads |
| 3 | mist | light tones, distant hills, skin |
| 4 | **vermilion** | **THE subject.** Ideally exactly one thing per figure |
| 5 | paper | knock-outs (windows, gaps, highlights) |
| 6 | sand | ground planes, floors, soft fields |
| 7 | cobalt | annotation arrows / numbers inside the scene (rare) |

* Flat shapes, no outlines unless the motif needs a stroke (bicycle, panel borders).
* Make scenes **recognisable**: a street needs buildings, a corridor needs a floor and walls,
  a landscape needs a horizon. Abstract dots/rectangles only when the topic is abstract
  (gestalt grouping, UI layout).
* Scale: a standing person is usually 16–40 units tall. Use `L.person`, `L.bust`, `L.face`.
* Keep at least ~6 units of breathing room between unrelated shapes; avoid accidental tangents.
* Text inside figures (`L.text`) ≤ 16 chars, size 8–18; prefer no text.

### Guides (structure layer)

`figure()` may return `guides: { example: [...], comparison: [...] }` built with `L.g.*`
(`g.thirds()`, `g.center()`, `g.line()`, `g.path()`, `g.rays(vx, vy, targets)`, `g.ring()`,
`g.label()`, `g.box()`, `g.arrow()`, `g.golden()`, `g.spiral()`).
They render as thin dashed cobalt lines on top of the scene and are emphasised by X-RAY.
Use them to *explain*: the thirds grid, the vanishing point, the eye-line, the axis, the triangle.
Draw guides for **both** figures so the difference is measurable.

Optionally return `cover: [...]` (a scene) if the list thumbnail should differ from the example;
by default the example is used as the list cover.

## 3. Text fields (Japanese, です・ます調ではなく常体)

| field | content | length |
|---|---|---|
| `definition` | What it is, in plain words. | 1–2 sentences, 40–90字 |
| `whyItWorks` | Perceptual/compositional mechanism. Hedge claims about emotion (〜しやすい, 〜と受け取られやすい). | 1–2 sentences, 60–120字 |
| `useCases` | 2–3 concrete situations (media + subject). | each 15–45字 |
| `pitfalls` | 2–3 common failures, each with the fix or the reason. | each 15–50字 |
| `example` | Caption of the left figure: what is placed where. | 25–70字 |
| `contrast` | Caption of the right figure. Start with 同じ… and name the single change. | 20–60字 |
| `changed` | `要素（例 → 対照）` | ≤ 30字 |
| `comparisonPoint` | What the reader should notice and what difference results. | 1–2 sentences, 50–110字 |
| `aiInstruction` | Prompt-ready instruction: subject, position, size, camera, what to keep empty. | 40–110字 |
| `diagramNote` (optional) | Limits of the schematic. Required where noted below. | ≥ 28字 |
| `review` (optional) | `{ checkJa, alternativeId, alternativeReasonJa }` — overrides data/composition-discovery.json `reviewByGuide[id]` when the old one no longer fits the new figure. `alternativeId` must be an existing C-xxx. | |

Style: concrete, confident, practical. No filler such as 「この図だけでは判断できない」 unless it is a
real limit (then put it in `diagramNote`). Do not claim scientific effects that are not established;
describe tendencies. Never mention specific copyrighted works.

## 4. Fixed constraints (validated by scripts/check-composition-guides.cjs)

* Keep `id`s; titles come from the catalogue (you may set `titleJa` only to fix an error).
* `diagramNote` (≥ 28字) is required for **C-012, C-036, C-039, C-060, C-090, C-092, C-120**.
* **C-120** `diagramNote` must contain 「判定できない」.
* **C-119** example and comparison must be the identical shape list (the detail page applies
  live inspections — grayscale, 25 %, 6.25 %, silhouette, outline — to the example).
* **C-110** is labelled 画風A / 画風B (same composition, different rendering style).
* **C-093** and **C-119** are shown stacked (full width), others side by side.
* Example and comparison must differ for every id except C-119.

## 5. Workflow

```
node scripts/composition/preview.cjs 02-balance      # renders /tmp/composition-preview/02-balance.png
node scripts/composition/preview.cjs C-013 C-014     # zoom on a few entries
```

Look at the PNG (zoom on 3–4 entries at a time) and iterate until every pair reads clearly
at thumbnail size. Do **not** run `build.cjs` (the lead integrates all categories) and do
**not** edit `lib.cjs`; put category-specific motif helpers at the top of your own file.
