# Pattern code reuse — licensing decision proposal

**Status: PROPOSAL ONLY — NOT A LICENSE GRANT / NOT RELEASED**  
**Prepared:** 2026-10-13 JST  
**Reference release candidate:** `64514eb32d5725f1f3b307ad380a0e7c4decc95c` (PR #11)  
**Decision already made:** Fragmenta should let visitors copy original displayed implementation examples into their own sites and apps, customize them, and use them in real work.

## Recommended legal scope and terms (not yet approved)

**Recommended option: apply MIT terms solely to the original implementation code emitted by `generateCode` for explicitly cleared pattern IDs.** The MIT license allows personal and commercial use, copying, modification and redistribution, **provided the copyright and permission notice is retained** in copies/substantial portions. The exact copyright holder(s) must be verified and named before issuing any license. Official text: https://opensource.org/license/mit

A broad root `LICENSE` file would risk licensing the gallery application and third-party material unintentionally. Instead, after review:
1. Define an explicit, authoritative scoped license document covering **only** the enumerated, provenance-cleared generated code examples, with the exact copyright holder and complete official MIT text.
2. Link the scope and conditions visibly from the code-copy UI, pattern Details and Licenses page. State that "Copy" indicates a technical operation, not an implicit license.
3. Document how a user preserves required copyright/license notices when adapting or redistributing substantial portions of the snippets. Avoid falsely claiming that attribution is never required.
4. Keep app shell, UI, logo/brand, screenshots, editorial content, third-party dependencies and externally sourced assets **outside the scoped license**, unless separate rights are established. Each dependency retains its own license.
5. Treat `generatePrompt` outputs and external links/attributions separately, not as code license grants. No unmeasured accessibility, performance or compatibility guarantee.

**Until the owner explicitly adopts the final terms, confirms rights and holder, and approves the exact scope:** the existing `pages/Licenses.tsx` notice remains authoritative; viewing or copying code does not by itself confer permission to reuse. The owner approved the **product goal** of reuse, not yet the exact MIT instrument.

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

## Required acceptance before implementing a public license

- [ ] Owner affirms MIT (or chooses another explicit license) and names copyright holder(s); confirm rights to grant it for each cleared snippet.
- [ ] Inventory checked against original AI Studio project, referenced sources and embedded asset/media/font use; exclusions documented.
- [ ] Scoped license and copy UI language undergo review for accurate boundaries, attribution obligations and non-conflicting third-party terms.
- [ ] GitHub tests and authenticated Preview visual/keyboard/copy tests on the **new** candidate SHA; rights text is read in the actual browser.
- [ ] Independent E review; **G7/G8/G9/G10 and all required release gates remain blocking**. No `main` merge, Production action, SSO bypass, audit suppression, or Discovery expansion from this proposal.

This document is intended for review in a **Draft PR against the PR #11 integration branch**, not for automatic Production deployment. It does not modify repository-wide rights.
