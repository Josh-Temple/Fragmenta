# Fragmenta — Product Direction

## Purpose

Fragmenta will evolve from a CSS/JavaScript animation gallery into a broader **web UI pattern gallery**.

The core value should remain practical: users should be able to **see a pattern working, understand how it is built, adjust it when useful, and take away either implementation code or an AI-ready prompt**.

Fragmenta should not become a generic inspiration board. Each entry should remain reproducible and usable in a real web interface.

## Scope

Fragmenta should cover six established areas of web UI design:

1. **Motion and animation**
   - hover and press motion
   - transitions
   - loading states
   - entrance and exit animation
   - scroll-linked motion where appropriate

2. **Microinteractions**
   - toggles
   - buttons
   - menus
   - form feedback
   - selection and state changes

3. **Visual styles**
   - typography treatments
   - borders and outlines
   - shadows
   - surfaces and backgrounds
   - color treatment
   - visual combinations such as warm neo-brutalist editorial UI

4. **Component treatments**
   - cards
   - navigation
   - buttons
   - inputs
   - badges
   - alerts and status elements

5. **Layout patterns**
   - editorial layouts
   - landing-page sections
   - dashboards
   - lists and feeds
   - article and documentation layouts

6. **Text and visual effects**
   - text animation
   - gradients
   - masks
   - glass effects
   - texture and depth effects

## What every gallery item should provide

Where relevant, each item should contain:

- live preview
- short explanation of the pattern and suitable use cases
- adjustable parameters
- implementation code
- AI prompt for recreating or adapting the pattern
- responsive and mobile notes
- accessibility guidance
- `prefers-reduced-motion` handling for motion
- performance notes
- tags and category
- license information
- source or inspiration attribution when an external reference is used

The current animation entries already establish much of this structure and should be preserved.

## Product principles

### 1. Working examples over screenshots

A visual reference can start an entry, but the useful artifact is an actual browser-rendered implementation.

### 2. Reusable patterns over exact copies

Fragmenta should describe and reproduce general design characteristics rather than clone a specific product, brand, page, logo, or copyrighted composition.

For example, a reference may become:

> Warm off-white background, heavy dark typography, rounded outlined containers, offset shadows, muted green and orange accents, generous spacing, editorial hierarchy.

That description can then be implemented as an original reusable pattern.

### 3. Code and AI prompts are equal outputs

Many users will want code directly. Others will want to reproduce the same design in ChatGPT, Codex, Claude, v0, or another coding tool.

Both should remain first-class outputs.

### 4. Mobile-first preview

Patterns should be useful on a phone as well as desktop. The current compact gallery format is a good basis for this.

### 5. Accessibility and performance remain part of the artifact

A visually attractive pattern is incomplete if it causes avoidable motion problems, poor contrast, unusable focus states, or unnecessary rendering cost.

## Information architecture

The gallery should gradually move toward these top-level filters:

- All
- Motion
- Interaction
- Styles
- Components
- Layouts
- Text & Effects

Existing categories such as Buttons, Loaders, Cards, Inputs, and Text FX can remain as tags or subcategories.

Search should support both component terms and visual-language terms, for example:

- elastic
- editorial
- neo-brutalist
- minimal
- glass
- tactile
- warm
- monochrome
- outlined
- offset shadow

## Data model direction

The current `AnimationDefinition` model is a strong starting point, but it is too narrow for non-animation entries.

The implementation should eventually generalize it to a pattern definition that can represent:

- category / kind
- title and description
- tags
- live preview
- parameters
- generated code
- generated AI prompt
- accessibility notes
- performance notes
- optional source / inspiration metadata

Existing animation definitions should be migrated without losing functionality.

This should be an incremental refactor rather than a rewrite.

## Near-term implementation priorities

### Phase 1 — Broaden the model without breaking the current gallery

- preserve all existing animation entries
- generalize the underlying definition type
- add `Styles` and `Layouts` as gallery categories
- make the existing detail page work for both animated and static patterns
- keep code, AI prompt, and parameter views

### Phase 2 — Add the first non-animation entries

Add several original patterns that prove the broader model works.

The first candidate should be a **warm neo-brutalist editorial UI** based on general characteristics such as:

- warm off-white background
- heavy dark sans-serif headings
- monospace metadata
- muted orange and green accents
- thick dark outlines
- rounded containers
- offset dark shadows
- generous whitespace
- strong editorial information hierarchy

The implementation should not copy any source page's identity, text, branding, or exact composition.

Other early entries should test different dimensions, such as a layout pattern and a component treatment.

### Phase 3 — Improve discovery

- richer filters
- tag search
- related patterns
- collections by use case
- saved items when persistence is justified

## Out of scope for now

To keep Fragmenta coherent, do not prioritize:

- complete website templates
- a general-purpose design asset marketplace
- icon or illustration libraries
- exact clones of third-party websites
- account systems or social features
- a CMS before the local data model becomes difficult to maintain
- framework proliferation without a demonstrated need

## Success criteria for the next milestone

The next milestone is successful when:

1. all six existing animation entries still work;
2. at least one static visual-style entry and one layout-oriented entry can use the same gallery/detail architecture;
3. each new entry has a working browser preview;
4. code and AI-prompt copy remain available;
5. mobile browsing remains usable;
6. accessibility and performance guidance can be stored for non-animation entries as well as animation entries;
7. adding a new pattern requires primarily adding its definition and preview, not changing application routing.

## Guiding question

For every proposed feature or gallery entry, ask:

**Does this help someone turn a visual or interaction idea into a reusable web implementation?**

If not, it probably does not belong in Fragmenta yet.
