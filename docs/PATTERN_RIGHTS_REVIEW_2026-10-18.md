# Fragmenta generated-code rights review — Worker B (2026-10-18 JST)

**Scope:** PR #18 head `eb2c906a2ea0d6fd0c804bd4d271cb3368a38439`, eight IDs from `data/definitions.tsx`.  
**Conclusion:** 8 `UNCLEAR`, 0 `CONFIRMED`, 0 `EXCLUDED` (no item is categorically identified as infringing); **0 operative reuse licenses**.  
**This is a provenance review and a pending-rights notice, not a legal opinion or grant.** The owner selected MIT and the pen name Josh Temple for examples that are eventually cleared. Neither decision proves ownership or authorizes licensing third-party material.

## Per-pattern inventory

| ID | Definition/source | Generated output format | Dependency and other elements | Provenance evidence | Rights / sample text / grantability |
|---|---|---|---|---|---|
| `elastic-button` | `data/animations/elastic-button.tsx` | HTML + CSS | System font; sample button label; no remote asset detected in output | Repository file in initial application commit `e3fae7f` (Jan 31); source metadata absent | **UNCLEAR**; text origin not separately verified; no active grant |
| `smart-skeleton` | `data/animations/smart-skeleton.tsx` | HTML + CSS | Native checkbox, loading labels; no remote package detected | Initial commit `e3fae7f`; source metadata absent | **UNCLEAR**; label origin not separately verified; no active grant |
| `glass-tilt` | `data/animations/glass-tilt.tsx` | React JSX + CSS | React + JSX bundler required; decorative/sample card text; React has separate license | Initial commit `e3fae7f`; source metadata absent | **UNCLEAR**; card text and underlying implementation authorship need confirmation; no active grant |
| `fluid-toggle` | `data/animations/fluid-toggle.tsx` | HTML + CSS | Native checkbox, UI label; no remote package detected | Initial commit `e3fae7f`; source metadata absent | **UNCLEAR**; no active grant |
| `glitch-text` | `data/animations/glitch-text.tsx` | HTML + CSS | CSS animation, pause checkbox, GLITCH label; no remote package detected | Initial commit `e3fae7f`; source metadata absent | **UNCLEAR**; sample label rights not independently checked; no active grant |
| `morph-fab` | `data/animations/morph-fab.tsx` | HTML + CSS + JS | Inline JS, illustrative action labels; no remote package detected | Initial commit `e3fae7f`; source metadata absent | **UNCLEAR**; illustrative text/action labeling not independently verified; no active grant |
| `warm-neo-brutalist-editorial` | `data/patterns/warm-neo-brutalist-editorial.tsx` | HTML + CSS | System font; bilingual sample prose; no remote photo/font detected | Added in `749f149` (Oct 6); `source` metadata calls it synthesized/original, which is only a claim | **UNCLEAR**; Japanese/English sample prose specifically unverified and excluded from any future grant until replaced or cleared; no active grant |
| `editorial-split-layout` | `data/patterns/editorial-split-layout.tsx` | HTML + CSS | System font; bilingual sample prose; no remote photo/font detected | Added in `749f149` (Oct 6); `source` metadata calls it an original/general layout, which is only a claim | **UNCLEAR**; sample prose unverified and excluded from any future grant until replaced or cleared; no active grant |

**Meaning of states:** `CONFIRMED` = documented authority to license *specified* original elements; `UNCLEAR` = insufficient provenance/permission evidence; `EXCLUDED` = explicitly outside any proposed grant. Current status alone does not authorize use.

## Evidence and limitations

- PR #18 was inspected at the exact head above. `data/definitions.tsx` enumerates eight IDs. Each corresponding `generateCode` implementation and the two existing editorial `source` metadata fields were inspected.
- Path-scoped GitHub commit-history queries returned `e3fae7fe785ec2d5d2f17d2adc62ec0b3f68282f` for all six animation definition files and `749f149656d4aa0ea3ca33d1201461124512d7cd` for the two editorial files. This establishes repository history, **not** original authorship, rights transfer, independent creation or permission to use third-party code.
- Original AI Studio link documented in `README.md`: `https://ai.studio/apps/drive/1uJLAuPEgNAGCtksgP7BBwyuN_sue_Ee2`. Its original content, outside inputs and contributor agreements were **not independently inspected** in this review.
- Generated outputs show no URL-linked third-party photographs, bundled images, CDN-loaded library code or remote fonts in the inspected source. This limited static inspection cannot exclude uncredited derived code, external contributions or indirect host-project assets. Gallery fonts/assets and app code are outside the contemplated snippet grant.
- The `source` field is absent for six animation definitions. The two editorial entries' self-descriptions are not chain-of-title evidence. The code also contains illustrative prose and UI labels; editorial bilingual body text has separate clearance needs.
- No permission to apply MIT to any ID is independently established. The proposed line `Copyright (c) 2026 Josh Temple` is usable **only if** that holder/year and rights scope are validated.

## Copy/License UX patch

- `data/pattern-rights.ts` explicitly inventories each of the eight and records `status: UNCLEAR`, `grantActive: false`, output format, dependency, sample-text warning and source path.
- `pages/AnimationDetail.tsx` explains on the Details tab, the Code tab and immediately above Copy Code that **clipboard copying does not grant reuse rights**. Generated `generateCode` output and the clipboard operation are intentionally not altered; this protects independent string-equality tests and does not silently add unapproved headers.
- `pages/Licenses.tsx` shows all eight current rights states, dependencies and sample-text notes, with links to the corresponding detail pages. It explicitly says 0 of 8 operative MIT grants.
- `docs/REUSE_LICENSING_DECISION.md` remains the pre-existing choice/rights policy. This review augments it but does not activate it. No root `LICENSE`, scoped MIT text, SPDX marker or copyright header has been inserted into copied code. The full MIT permission and warranty language cannot be invoked as a grant until the authority and exact scope are cleared.

## Minimal rights-clearance decision needed from the owner

Provide one attestation/itemized correction addressing **each** of the eight IDs: (1) whether the owner authored/has authority over the original AI Studio starter and these `generateCode` implementations, or identify any separate creators/terms; (2) whether any third-party snippets, code generators' published templates, outside PR contributors, graphics or licensed assets were incorporated, with attribution/permissions; (3) whether the two bilingual editorial sample texts can be licensed, must be replaced with fresh placeholders, or must be excluded; (4) whether any other copyright holders or dates require notices. Evidence (source exports, design/reference list, consent records) should be reviewed privately, not copied into public issues. **Do not treat a yes/no answer as a substitute for examining contradictory source evidence.**

Once individual elements are actually cleared, E may select a minimal eligible subset, attach the **complete unmodified MIT text**, precise ID/definition/version scope and correct copyright notices, add a practical notice-retention mechanism to copies and verify rendered/clipboard code at the exact new SHA. Unclear or excluded items must not display an active reuse grant; third-party dependency licenses remain separate.

## Gates and release controls

**Worker B: PARTIAL_WITH_GAPS / G9 rights component NOT_READY.** No B authority for main merge, Production publication, SSO or Vercel setting changes, secret access, rollback, or independent E sign-off. The draft PR is based on PR #18's fixed head and is for E to inspect and selectively integrate after rights/UX and same-SHA tests. `main` and Production are unchanged by this work.

