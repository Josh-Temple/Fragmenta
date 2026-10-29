# Browser acceptance

The `browser-acceptance.html` harness is added to Vercel **Preview** output only.
It is absent from the ordinary local and Production builds. It inherits Preview
authentication and does not create a protection bypass or a new public endpoint.
For an intentional local test, run `node scripts/prepare-browser-acceptance.cjs --include`
after building; the output must not be published as Production.

Open the harness on the exact Preview deployment. Its revision must match the
candidate HEAD. Select 360×800, 390×844, 768×1024 and 1280×900; the iframe gives
the complete app a real CSS viewport of that size, including media queries and
fixed navigation. Observe the inner document's client/scroll widths, controls,
text wrapping, navigation and focus. This is desktop Chrome in an iframe:
it does not establish Android, touch input, top-level viewport behavior, browser
zoom or platform-specific clipboard support. Record those independently.

For style acceptance, select B=none, then all 24 styles on Dashboard and Article.
Check rendered geometry and text in all 48 cases. Compare eight representative
styles with Production using the same iframe dimensions. Also check all groups,
NFKC/Japanese/AND search, zero results, direct links and back/reload.

Check mixed prompts at B=10/30/50/70/90, including A=B, B=none and mixing on/off.
The higher-priority style controls structure; at 50/50 A controls structure.
The small mixed preview is conceptual, and CSS output remains A-only.

The paste target has no programmatic connection to any copy source. After a
real copy-button action, use the normal paste command and compare the entire
textarea value with the displayed source, including line breaks. Empty or
unavailable clipboard reads are BLOCKED, not PASS. Never seed the clipboard
with the expected value. The target is neither stored nor transmitted.
