# Fragmenta composition: actual Chromium SVG image evidence

PR #49, source HEAD d0187578516a24ef2b0d2e13bd1c304b3e6a6b5f, CI run 42018740345.

Source: scripts/render-composition-contact-sheets.cjs --capture --tiles; Chromium on Ubuntu with fonts-ipafont-gothic.
Source data SHA-256: 0eecbe805733d98410004cd7b1c35c6d7c1985c6273c5d8783b94c6cf02eb5ef.
All 30 images are 1400×1024 PNG. Each is four ID cards, each with an example and comparison SVG (240 diagrams overall).
All 30 images were viewed by the model in the B wave, but independent D and human acceptance are not claimed.
Artifact storage quota blocked ZIP upload, therefore the private PR branch holds individual images.
Per-file SHA-256, Git blob and ID mapping are in docs/COMPOSITION_B_SVG_AUDIT_MANIFEST.json, key wave_2026_11_05_ci_font_svg_B.

| PNG | IDs |
| --- | --- |
| [tile-01-01.png](./tile-01-01.png) | C-001, C-002, C-003, C-004 |
| [tile-01-02.png](./tile-01-02.png) | C-005, C-006, C-007, C-008 |
| [tile-01-03.png](./tile-01-03.png) | C-009, C-010, C-011, C-012 |
| [tile-02-01.png](./tile-02-01.png) | C-013, C-014, C-015, C-016 |
| [tile-02-02.png](./tile-02-02.png) | C-017, C-018, C-019, C-020 |
| [tile-02-03.png](./tile-02-03.png) | C-021, C-022, C-023, C-024 |
| [tile-03-01.png](./tile-03-01.png) | C-025, C-026, C-027, C-028 |
| [tile-03-02.png](./tile-03-02.png) | C-029, C-030, C-031, C-032 |
| [tile-03-03.png](./tile-03-03.png) | C-033, C-034, C-035, C-036 |
| [tile-04-01.png](./tile-04-01.png) | C-037, C-038, C-039, C-040 |
| [tile-04-02.png](./tile-04-02.png) | C-041, C-042, C-043, C-044 |
| [tile-04-03.png](./tile-04-03.png) | C-045, C-046, C-047, C-048 |
| [tile-05-01.png](./tile-05-01.png) | C-049, C-050, C-051, C-052 |
| [tile-05-02.png](./tile-05-02.png) | C-053, C-054, C-055, C-056 |
| [tile-05-03.png](./tile-05-03.png) | C-057, C-058, C-059, C-060 |
| [tile-06-01.png](./tile-06-01.png) | C-061, C-062, C-063, C-064 |
| [tile-06-02.png](./tile-06-02.png) | C-065, C-066, C-067, C-068 |
| [tile-06-03.png](./tile-06-03.png) | C-069, C-070, C-071, C-072 |
| [tile-07-01.png](./tile-07-01.png) | C-073, C-074, C-075, C-076 |
| [tile-07-02.png](./tile-07-02.png) | C-077, C-078, C-079, C-080 |
| [tile-07-03.png](./tile-07-03.png) | C-081, C-082, C-083, C-084 |
| [tile-08-01.png](./tile-08-01.png) | C-085, C-086, C-087, C-088 |
| [tile-08-02.png](./tile-08-02.png) | C-089, C-090, C-091, C-092 |
| [tile-08-03.png](./tile-08-03.png) | C-093, C-094, C-095, C-096 |
| [tile-09-01.png](./tile-09-01.png) | C-097, C-098, C-099, C-100 |
| [tile-09-02.png](./tile-09-02.png) | C-101, C-102, C-103, C-104 |
| [tile-09-03.png](./tile-09-03.png) | C-105, C-106, C-107, C-108 |
| [tile-10-01.png](./tile-10-01.png) | C-109, C-110, C-111, C-112 |
| [tile-10-02.png](./tile-10-02.png) | C-113, C-114, C-115, C-116 |
| [tile-10-03.png](./tile-10-03.png) | C-117, C-118, C-119, C-120 |

Release gate: HOLD_NO_MERGE / NO_DEPLOY.
