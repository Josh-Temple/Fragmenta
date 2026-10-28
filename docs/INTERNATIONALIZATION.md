# Initial English/Japanese implementation (Draft)

A locale context provides English/Japanese language selection, browser-language default, localStorage persistence, and HTML language updates. The design atlas can search English and Japanese descriptions for 24 styles and independently generate English or Japanese single-style and blended AI prompts. Existing CSS export and reuse rights remain unchanged.

Partial only: Other pages (including the home page, pattern descriptions, licensing, guides, collections, and specimen labels) have not yet been fully translated. Some atlas microcopy also remains Japanese. Do not claim full-site localization.

Required acceptance: npm ci, npm run typecheck, npm run lint, npm run build, real mobile/desktop browser verification, persisted locale, HTML lang, English/Japanese prompt copy readback, 24 styles and blend weights, keyboard access and no change to rights wording. PR #37 modifies overlapping files; coordinate rebase and independent acceptance before any merge or release.
