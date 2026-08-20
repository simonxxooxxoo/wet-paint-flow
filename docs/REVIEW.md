# Project Review

Review date: 2026-08-20
Baseline inspected: `49544b1974bae44ff55da5e142ba04508487319e`

This report separates measured runtime evidence from static checks. Scores
describe engineering and release readiness, not the artistic result.

## Executive decision

- **Current public release: GO.** The project code license, third-party
  notices, and reuse bases for all 11 bundled scenes are recorded.
- **Refactor direction:** keep the current flat application. Remove dead and
  expensive paths first; split files only when a boundary becomes independently
  testable. A framework, service layer, event bus, and defensive fallback tree
  would add more cost than value here.

## Scorecard

| Area | Baseline | Accepted state | Assessment |
| --- | ---: | ---: | --- |
| Architecture | 5.5/10 | 7.0/10 | The render pipeline is coherent and 519 lines of retired sketch/Lamberti code are gone. The large `main.js` is still the main structural cost. |
| Implementation quality | 6.5/10 | 8.5/10 | Heavy work is now event-bounded, idle rendering sleeps, no-op resize is cheap, and 4K export no longer duplicates full-frame CPU buffers. |
| Maintainability | 4.0/10 | 7.5/10 | Dead paths were removed; defaults, dependency constraints, CI, provenance, deployment, and contributor rules are explicit. |
| Performance and loading | 6.1/10 | 8.5/10 | 14k/24k growth stays near 61 FPS on the measured machine; stable state schedules no frames; initial loading no longer fetches the full gallery. Sites still forces revalidation for static assets. |
| Tests and verification | 3.0/10 | 6.5/10 | Static regression coverage, clean install, builds, header simulation, and manual browser acceptance pass. Automated WebGL interaction coverage is still absent. |
| Documentation | 6.0/10 | 9.0/10 | The bilingual README now covers product use, architecture, validation, deployment, contribution, and attribution. |
| Open-source readiness | 2.0/10 | 9.0/10 | MIT licensing, third-party notices, and exact source and reuse records for current bundled assets are in place. |
| Deployment readiness | 8.0/10 | 9.0/10 | The Sites adapter, deterministic build, cache policy, and production project are in place; production readback is recorded below. |
| Overall | **4.9/10** | **8.5/10** | The current public scope is release-ready; automated WebGL coverage and the large-file structure remain the main next steps. |

## Findings and disposition

| Priority | Finding | Disposition |
| --- | --- | --- |
| P0 | The completed scene kept a permanent `requestAnimationFrame` loop and wrote growth UI state every frame, causing 91 layouts and 367 DOM mutations in 1.5 seconds. | Fixed with a single demand scheduler and an early return before DOM writes. |
| P0 | A same-size resize rebuilt all targets, reran synchronous GPU readback, and produced an 86 ms long task. | Fixed by comparing actual output, render, analysis, sample, and quality dimensions before disposal. Same-size resize now costs about 0.1 ms. |
| P0 | Orbiting a model could rerun the full analysis every 180 ms. | Fixed: dragging shows a direct 3D preview; pointer release triggers one final analysis and stroke rebuild. |
| P1 | Idle startup prefetched all 11 full WebPs (3.39 MB total). | Fixed: only the selected full image loads; hover/focus prefetch remains. Thumbnails are versioned and dimensioned. |
| P1 | An unused field texture was allocated, encoded, and uploaded although no shader sampled it. | Removed. |
| P1 | A retired 519-line sketch/Lamberti workflow remained in the runtime with no call sites. | Removed without replacement abstractions. |
| P1 | `GLTFLoader` was part of the initial bundle even when no model was imported. | Moved to a dynamic import; it is not requested on image-only startup. |
| P1 | The UI, tests, README, and repository rule disagreed on the default stroke count. | Unified at 14,000; maximum remains 24,000. |
| P1 | Reduced-motion users still received the initial five-second growth animation. | Initial scene now renders complete; an explicit replay still animates. |
| P1 | 4K PNG export held four full-size GPU targets plus duplicate readback and `ImageData` buffers. | Composite now renders directly into the WebGL canvas and encodes with `toBlob`; this removes one 4K target and two CPU pixel copies. |
| P1 | Hashed assets and WebPs revalidate on every visit, and WebPs are served as `application/octet-stream`. | Confirmed as a Sites delivery-layer limit: known static files bypass the worker, and a `_headers` file is served rather than interpreted. Ineffective app-level header code was removed. |
| P1 | Bundled painting derivatives lacked exact source URLs or redistribution records. | Rebuilt from 11 documented source pages; current reuse bases are recorded in `ASSET_PROVENANCE.md`. |
| P2 | Most automated tests assert source architecture rather than executing WebGL behavior. | Partially mitigated by browser acceptance and CI. A small Playwright/WebGL smoke suite is the next useful test investment. |
| P2 | `main.js` still owns most runtime responsibilities and the initial raw JS remains above Vite's 500 kB warning threshold. | Accepted for now: gzip is much smaller and premature module churn would not reduce transferred code. Split only along the boundaries below. |
| P2 | A 24k reseed remains a 75–76 ms synchronous interaction task. | Accepted quality tradeoff for this pass; it happens on committed changes, not during drag or idle. Worker/off-main-thread analysis is future work only if real devices require it. |

## Browser performance evidence

Measured in Chromium on an RTX 4090. The measurements preserve high quality,
14,000 default strokes, 24,000 maximum strokes, shader passes, and export size.

| Scenario | Accepted result |
| --- | --- |
| 14k growth | 61.16 FPS; reseed 51.9 ms; geometry 42.3 ms |
| 24k growth | 61.62 FPS; reseed 75.9 ms; geometry 65.0 ms |
| Completed scene, 1.51 s | 0 rAF requests, 0 DOM mutations, 0 layout, 0 style recalculation, 0 long tasks |
| Same-size resize | 0.1 ms; field and geometry timing markers unchanged |
| Reduced motion | Built-in scene ready at 179 ms with progress `1`; explicit replay advanced normally |
| Initial requests | One full scene image; no gallery-wide full-image prefetch; no `GLTFLoader` chunk |
| Model orbit | No field/geometry work during a real drag; pointer release produced exactly one 104.9 ms analysis and one 43.0 ms geometry rebuild |
| 4K PNG | 3235 × 4096, 31,915,771 bytes, about 882 ms, non-empty and correctly oriented; canvas restored pixel-identically |
| Growth video | 59.9 FPS preflight; 5.0 s MP4, 1,326,309 bytes, valid signature; recording returned to idle |
| Runtime errors | Application error array empty; no JavaScript exception or render-path console error |

The direct-canvas 4K path removes up to roughly 192 MiB of duplicate storage
for a square 4096 output compared with the previous target + readback +
`ImageData` path. It still performs one synchronous high-resolution render and
PNG encoding when the user explicitly exports.

## Flat refactor boundary

Do not split the application merely to reduce line count. If field/stroke work
continues, the smallest useful target is five flat modules with no new runtime
framework:

1. `main.js` — boot, DOM wiring, and the explicit state transitions;
2. `field.js` — pixel buffers, structure tensor, direction sampling, and trace;
3. `strokes.js` — persistent seeds and instanced Bézier geometry;
4. `render.js` — targets, materials, render passes, and the demand scheduler;
5. `io.js` — image/GLB loading and PNG/video export.

Move code only when the destination can receive direct unit tests. Keep shader
source beside its render pass, pass plain data/functions between modules, and
do not add managers, repositories, dependency injection, or duplicate state.

## Verification gates

- `node --check main.js`
- Vitest: 34/34 passing
- `npm run check`: tests plus production Vite build
- clean-lock `npm ci` in a verified temporary directory
- `npm run build:sites` with `dist/client`, `dist/server/index.js`, and
  `dist/.openai/hosting.json`
- production Sites readback of HTML, hashed JS/CSS, manifest, and WebP headers
- `npm audit`: zero known vulnerabilities at the audit checkpoint
- `git diff --check` and `git fsck --connectivity-only --no-dangling`

Static checks do not replace browser acceptance. The WebGL measurements above
are the acceptance evidence for this change; CI currently covers only the
deterministic static gate.

## Remaining release work

1. Add a small automated browser smoke test when a reliable WebGL CI runner is
   available: load-ready, no runtime errors, same-size resize, reduced motion,
   14k/24k reseed, and one bounded export.
2. Consider off-main-thread field/seed generation only if testing on target
   integrated GPUs shows committed 24k interactions are unacceptable.

## Production readback

The accepted source is deployed at
<https://wet-paint-flow.simonxxoo.chatgpt.site/>. The final commit, Sites
version, HTTP status, asset hashes, MIME, and cache headers are recorded in the
delivery summary for this review. At the audit checkpoint, Sites returned
`public, must-revalidate, max-age=0` for HTML, hashed JS/CSS, manifest, and
versioned WebPs, and returned WebP as `application/octet-stream`; the
application cannot override those static responses with the current Sites
runtime.
