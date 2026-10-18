# Pattern code reuse — MIT chosen, rights clearance pending

**Status: MIT CHOSEN / DISPLAY NAME CHOSEN / PER-PATTERN RIGHTS PENDING — NO LICENSE GRANT / NOT RELEASED**  
**Prepared:** 2026-10-13 JST  
**Reference release candidate:** `64514eb32d5725f1f3b307ad380a0e7c4decc95c` (PR #11)  
**Decision already made:** Fragmenta should let visitors copy original displayed implementation examples into their own sites and apps, customize them, and use them in real work.

## Approved choice and remaining rights conditions

**Owner decision (2026-10-14 JST): adopt MIT for original implementation code emitted by `generateCode` for individually rights-cleared pattern IDs. The approved public attribution is `Copyright (c) 2026 Josh Temple` (pen name).** The MIT license allows personal and commercial use, copying, modification and redistribution, **provided the copyright and permission notice is retained** in copies/substantial portions. This approved public display name does not independently establish copyright ownership or the right to license every existing pattern. Earlier copyright holders or contributors must be credited if applicable. Official text: https://opensource.org/license/mit

A broad root `LICENSE` file would risk licensing the gallery application and third-party material unintentionally. Instead, after review:
1. Define an explicit, authoritative scoped license document covering **only** the enumerated, provenance-cleared generated code examples, with the exact copyright holder and complete official MIT text.
2. Link the scope and conditions visibly from the code-copy UI, pattern Details and Licenses page. State that "Copy" indicates a technical operation, not an implicit license.
3. Document how a user preserves required copyright/license notices when adapting or redistributing substantial portions of the snippets. Avoid falsely claiming that attribution is never required.
4. Keep app shell, UI, logo/brand, screenshots, editorial content, third-party dependencies and externally sourced assets **outside the scoped license**, unless separate rights are established. Each dependency retains its own license.
5. Treat `generatePrompt` outputs and external links/attributions separately, not as code license grants. No unmeasured accessibility, performance or compatibility guarantee.

**Until the individually listed code rights and any other holders/contributors are verified and the scoped operative license is implemented and reviewed:** the existing `pages/Licenses.tsx` notice remains authoritative; viewing or copying code does not by itself confer permission to reuse. The owner has now approved the **product goal**, **MIT license choice**, and **Josh Temple pseudonym**. None of those decisions alone confirms title to the underlying snippets or activates a license.

## Candidate inventory — provenance and grant status

| Pattern ID | Output format to verify | Rights review | Current grant |
| --- | --- | --- | --- |
| `elastic-button` | `generateCode` implementation | OWNERSHIP/THIRD-PARTY CHECK PENDING | NONE |
| `smart-skeleton` | `generateCode` implementation | OWNERSHIP/THIRD-PARTY CHECK PENDING | NONE |
| `glass-tilt` | React JSX + embedded CSS | OWNERSHIP/THIRD-PARTY CHECK PENDING | NONE |
| `fluid-toggle` | `generateCode` implementation | OWNERSHIP/THIRD-PARTY CHECK PENDING | NONE |
| `glitch-text` | `generateCode` implementation | OWNERSHIP/THIRD-PARTY CHECK PENDING | NONE |
| `morph-fab` | `generateCode` implementation | OWNERSHIP/THIRD-PARTY CHECK PENDING | NONE |
| `warm-neo-brutalist-editorial` | HTML + CSS | OWNERSHIP/THIRD-PARTY CHECK PENDING | NONE |
| `editorial-split-layout` | `generateCode` implementation | OWNERSHIP/THIRD-PARTY CHECK PENDING | NONE |

Inventory is tied to `data/definitions.tsx` at the reference SHA. All eight are **proposed** candidates, not eight completed rights-clearance results. Source/inspiration metadata and starter-project provenance must be checked per item; calling an example "original" is not dispositive proof of rights.

## Required acceptance before activating the public license

- [x] Owner selected MIT (SPDX: MIT) and public display name `Josh Temple` for copyright notices on eligible original 2026 work.
- [ ] Confirm the owner's authority to license each cleared implementation snippet, including the original AI Studio version, original creators and any outside contributions; record exclusions or additional credit.
- [ ] Inventory checked against original AI Studio project, referenced sources and embedded asset/media/font use; exclusions documented.
- [ ] Scoped license and copy UI language undergo review for accurate boundaries, attribution obligations and non-conflicting third-party terms.
- [ ] GitHub tests and authenticated Preview visual/keyboard/copy tests on the **new** candidate SHA; rights text is read in the actual browser.
- [ ] Independent E review; **G7/G8/G9/G10 and all required release gates remain blocking**. No `main` merge, Production action, SSO bypass, audit suppression, or Discovery expansion from this proposal.

This document is intended for review in a **Draft PR against the PR #11 integration branch**, not for automatic Production deployment. It does not modify repository-wide rights.


## 2026-10-13 source inspection and implementation proposal (not a grant)

Inspected generated-code definitions at PR #17 candidate `5136f4d6dcad1d5048f0c974bf7d862195956dd2`. Runtime preview utility renames in that candidate do not change the emitted `generateCode` strings. Existing eight Guides already provide integration steps and limitations.

| ID | Source | Emitted output / dependencies | Provenance evidence and remaining decision |
| --- | --- | --- | --- |
| elastic-button | data/animations/elastic-button.tsx | HTML + scoped CSS; system fonts; no external package/asset request | Original-project origin and right to sublicense not established |
| smart-skeleton | data/animations/smart-skeleton.tsx | HTML + CSS, native pause checkbox; no external package/asset request | Original-project origin and right to sublicense not established |
| glass-tilt | data/animations/glass-tilt.tsx | JSX + CSS; React/react-dom and JSX build required; decorative glyph and text | Separate React license; original-project origin and right to sublicense not established |
| fluid-toggle | data/animations/fluid-toggle.tsx | HTML + CSS; native checkbox; no external package/asset request | Original-project origin and right to sublicense not established |
| glitch-text | data/animations/glitch-text.tsx | HTML + CSS; pause checkbox and reduced motion | Original-project origin and right to sublicense not established |
| morph-fab | data/animations/morph-fab.tsx | HTML + CSS + inline JS; example labels have no product actions | Original-project origin and right to sublicense not established |
| warm-neo-brutalist-editorial | data/patterns/warm-neo-brutalist-editorial.tsx | HTML + scoped CSS; bilingual sample prose; no external asset request | Metadata says synthesized/original; this is an assertion, not ownership evidence. Confirm sample prose as well as code |
| editorial-split-layout | data/patterns/editorial-split-layout.tsx | Semantic HTML + CSS; system fonts; bilingual sample prose | Metadata says original/general layout; this is an assertion, not ownership evidence. Confirm sample prose as well as code |

Inspection found no embedded third-party photograph, logo, remote font request or remotely imported code in these generated examples. This is a current-source inspection, not proof that the implementation was never derived from third-party work. The initial AI Studio project, inputs, copied references and contributor rights were not available for verification. **No pattern is declared rights-cleared by this inspection.** Gallery Google Fonts/Material Symbols and gallery dependency licenses remain outside any proposed generated-code grant. No blanket relicensing of the repository is proposed.

### Owner decisions resolved and remaining fact checks

1. **RESOLVED:** MIT is the selected license, SPDX `MIT`; canonical text: https://opensource.org/license/mit.
2. **PUBLIC NAME RESOLVED:** `Josh Temple` (pen name), with `Copyright (c) 2026 Josh Temple` for eligible 2026 original code. **STILL OPEN:** establish authority to grant for each pattern ID and whether older code or additional author/rights-holder notices are legally required. Neither a GitHub username nor a commit is adequate proof.
3. Identify copied third-party code/assets, original-project material or contributor portions requiring exclusion or separate permission. Confirm whether the bilingual sample prose is included or excluded; default proposal is to exclude editorial prose pending a separate decision.
4. Approve the explicit scope: only the generated HTML/CSS/JS/JSX implementation for enumerated cleared IDs, including adapted parameter variants; exclude gallery app, branding, screenshots, prompts, third-party libraries/assets and unconfirmed prose.

### Implementation after rights verification (license choice/name now fixed)

- Add an authoritative scoped license document outside a blanket root LICENSE. State the enumerated IDs, definition paths/revision, holder/year, complete MIT text and exclusions.
- Add a short copyright/permission header to copied code, and distribute the complete scoped license alongside it. For HTML use a comment; for JSX/JS use a block comment. Retain the copyright and permission notice with all copies or substantial portions, including commercial redistribution. A link alone must not replace the required notice.
- Show the exact per-pattern status next to Copy and in Details. Rights-cleared examples link to the scoped license; unconfirmed examples say permission is pending. Show a distinct gallery-software status in Licenses.
- Explain that MIT permits personal/commercial use, modification and redistribution subject to notice retention; no obligation to open-source the user's whole application is proposed. Third-party dependencies retain their own terms. Provide the MIT warranty/liability disclaimer as part of the complete text.
- Re-run exact new-SHA tests, actual Preview copy/paste, accessibility and license-screen review. No current UI, copied-code header or LICENSE is changed by this proposal.


## 2026-10-14 decision and source-history recheck

The user selected MIT and authorized the public copyright name **Josh Temple**, expressly a pen name. Japan's Copyright Act Article 19 allows the creator to choose a pseudonym as displayed author name (https://laws.e-gov.go.jp/law/345AC0000000048); this choice by itself establishes neither authorship nor ownership or permission over third-party contributions. The selected display line is `Copyright (c) 2026 Josh Temple` for code actually owned/authorized for that notice.

Inspected GitHub source history: an early repository commit `c542b41b00040238ac4a63eb4a612070ec356429` carried an AI Studio starter README rather than these pattern source files; six animation implementations are present by main commit `77d5a053dfb9f77ef6034c5ee6fd03a7c3497c16`. The two editorial patterns subsequently gained bilingual sample prose through PR #14. These facts establish project history, **not** a chain of title or freedom from third-party code. The original AI Studio project content and any external contributor agreements remain unverified.

**Per-pattern release permission remains PENDING for all eight IDs.** No active MIT licence, copied-code MIT notice, or changed copy permission is implied by a selected legal instrument or pen name. Continue to show that copying code is technically possible, while copyright permission has not yet been established. Once rights are cleared, the release implementation must include the full unmodified MIT permission and warranty text, with the applicable copyright notice, and update both the copy workflow and Licenses page. A link alone is not a substitute for including the required copyright and permission notice in distributed substantial copies.

### Scope of future notice (NOT YET AN OPERATIVE GRANT)

```text
Copyright (c) 2026 Josh Temple
SPDX-License-Identifier: MIT
```

This text is **a planned attribution marker only**. It is not a full MIT license and must not be inserted into generated code before per-ID licensing authority is resolved. Implementation must account for the exact creation/copyright years and any additional rights holders before enabling the grant. For generated JSX with React, retain third-party React's separate licensing terms. For sample prose embedded in editorial HTML, either obtain authority and explicitly include it or replace it with user-provided placeholder copy before granting rights to the resulting implementation.

### Release-control separation

PR #15 is a **Draft** based on the older #11 candidate; PR #17 is a separate tested Tailwind 4 dependency fix stacked on #16. Do not merge this draft without reconciling the stacked history, running new-SHA CI and authenticated Preview UX acceptance, independent review and release approval. GitHub main/Production/SSO remain unchanged by this rights preparation.
