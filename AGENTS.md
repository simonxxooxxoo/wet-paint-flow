# Wet Paint Flow repository instructions

This repository is the source of truth for all future flow-field painting work.

- Keep flow-field analysis, stroke integration, graphite analysis views, pointillism experiments, wet-paint shading, and performance work in this repository.
- Do not edit or synchronize the retired copy under `browser-npr-material-lab/experiments/van-gogh-flow-field` unless the user explicitly requests it.
- Preserve visual quality when optimizing: do not silently lower stroke counts, render scale, MSAA, shader detail, export resolution, or material passes.
- Keep uploaded images local to the browser and preserve their aspect ratio.
- Run `npm run check` after code changes.
- For visual or performance changes, also test the browser at the default 14,000 strokes and the maximum 24,000 strokes; report any quality or frame-rate regression.
- Keep the canvas free of promotional banners or debug overlays. User controls belong in the side panel.
