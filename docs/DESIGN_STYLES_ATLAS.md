# Fragmenta — Design Styles Atlas (2026-10-27)

## Product intent

The Design Styles Atlas is a **visual-language dictionary**, not a canonical academic classification.
Visitors can discover a style name, compare the same content under two different styles, and copy
a structured Japanese AI prompt or scoped CSS token starter.

Route: /#/styles
Registry: data/design-styles.ts
Components: pages/DesignStyles.tsx and components/DesignStyleSpecimen.tsx
Export functions: data/design-style-export.ts
Validator: scripts/check-design-styles.cjs

The atlas has 24 styles in five navigational groups: structure/typography, expressive graphics,
surface/material, era/retro, atmosphere/nature.

## Taxonomy limits

The groupings deliberately include terms with different origins and levels of abstraction:
- Swiss Style and Bauhaus represent historical design approaches.
- Glassmorphism and neumorphism are surface treatments.
- Cyberpunk is a world-building aesthetic.
- Wabi-Sabi is a broad aesthetic philosophy and cannot be reduced to a single CSS recipe.

These are NOT synonyms for:
- Layouts such as Bento Grid or split-screen.
- Design systems such as Material Design, Fluent or Carbon.
- Components/patterns such as tabs, dialogs and data tables.

The cards are visual interpretations for comparison, not faithful reconstructions of specific
historical artifacts, official vendor libraries, or claims that one style is intrinsically accessible.

## Actual implementation

- All 24 names, Japanese descriptions, three identifying traits, and two pitfalls are registered.
- Type/filter by name, Japanese name, features and group.
- Dashboard/article example selection; compare style A against style B using the same content.
- Japanese AI prompt varies by selected style and screen type.
- Scoped CSS token export varies by style; explicitly not complete implementation code.
- Copy buttons report clipboard failure and keep selectable text as fallback.
- No tracking, storage, external assets/fonts, AI API requests or new runtime dependencies.

## Boundaries and review

The 18 existing live UI patterns and 24 previously planned pattern/tool slots are not altered.
No separate pattern rights status is modified, and the atlas does not license other pattern code.
No third-party logos, screenshots, images or copied page compositions are embedded.

Typechecking, linting, and the design:verify Node script run as prebuild checks.
To ship confidently, also check actual authenticated browser rendering, keyboard operation,
select/filter behavior, clipboard success/failure, Android, narrow widths, and 200% zoom.
Preview build status alone is not an actual-device/browser acceptance result.

Future work: style mixing, editable tokens, CSS fidelity improvements, layouts catalog,
vendor design-system reference cross-links, side-by-side visual diff, and saved presets.
