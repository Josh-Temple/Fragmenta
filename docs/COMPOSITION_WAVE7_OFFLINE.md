# Wave 7 offline React verification

This follow-up retains `HOLD_NO_MERGE / NO_DEPLOY` and the existing Draft PR #49.
It does not constitute independent D acceptance.

The first real React captures at 360/390 CSS pixels exposed two issues:

- C-008's 16 square-ended river segments produced protruding corners. Only
  C-008's example uses round line caps now; the 16 segment coordinates and all
  composition data remain unchanged. The result remains a polygonal approximation.
- Full-document CDP screenshots placed the fixed mobile navigation at the
  previous viewport's scroll offset, obscuring text in some captures. The optional
  capture helper now settles at the document end before measuring and capturing.
  It does not hide navigation or alter page styles.

Node 22 offline build, existing data regressions, generated pattern fixtures and
the full Chromium smoke passed locally after generating the same fixtures as CI.
An initial smoke attempt omitted `pattern-artifacts.cjs`/`pattern-manifest.cjs`;
its unrelated missing-fixture failure is retained in the external evidence log.
Focused provisional images of C-002/008/023/041 at 360/390 were directly opened.
They show fixed architecture with horizontal person movement (002), S-shaped
segments versus a straight river (008), a recognizable face cut at the left edge
(023), and identical mountains/red person with only the rail removed (041).

Final committed-HEAD images, per-file SHA-256/bytes/dimensions/timestamps,
review counts, CI links and private handoff availability are recorded in PR #49
and the external evidence package, rather than committing PNGs here. Provisional
dirty-worktree images must not be reported as exact final-commit evidence.

Independent D, human direct operation, external OS Clipboard, Android, assistive
technology and expert/source/rights review remain separate acceptance tasks.
C-093/119 retain their existing P2 limitations.
