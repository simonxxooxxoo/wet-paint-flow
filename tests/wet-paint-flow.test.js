import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const source = readFileSync(new URL('../main.js', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const sceneManifest = JSON.parse(readFileSync(new URL('../public/scenes/manifest.json', import.meta.url), 'utf8'));

describe('standalone Wet Paint Flow experiment', () => {
  it('publishes canonical social metadata and the generated preview card', () => {
    expect(html).toContain('rel="icon" href="./favicon.svg"');
    expect(html).toContain('rel="canonical" href="https://wet-paint-flow.simonxxoo.chatgpt.site/"');
    expect(html).toContain('property="og:image" content="https://wet-paint-flow.simonxxoo.chatgpt.site/og.png"');
    expect(html).toContain('name="twitter:card" content="summary_large_image"');
    expect(readFileSync(new URL('../public/og.png', import.meta.url)).byteLength).toBeLessThan(1_000_000);
  });

  it('keeps uploaded images local, aspect-safe, and drag-and-drop ready', () => {
    expect(html).toContain('id="source-upload"');
    expect(source).toContain("window.addEventListener('drop'");
    expect(source).toContain("window.addEventListener('paste'");
    expect(source).toContain('URL.createObjectURL(file)');
    expect(source).toContain('uploadedMaterial.uniforms.uScale.value.set');
    expect(source).toContain('保持比例');
    expect(html).not.toContain('class="title-card"');
    expect(html).not.toContain('class="legend"');
    expect(html).not.toContain('class="shortcut-hint"');
    expect(html).not.toContain('id="method-note"');
    expect(html).not.toContain('class="drop-overlay"');
  });

  it('routes images and GLB models through one import control', () => {
    expect((html.match(/type="file"/g) || [])).toHaveLength(1);
    expect(html).toContain('accept="image/png,image/jpeg,image/webp,image/gif,image/*,.glb,model/gltf-binary,model/gltf+binary"');
    expect(html).toContain('导入图片或 GLB');
    expect(html).toContain('id="model-preview-button"');
    expect(html).toContain('id="model-paint-button"');
    expect(source).not.toContain("import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'");
    expect(source).toContain("import('three/addons/loaders/GLTFLoader.js')");
    expect(source).toContain('const [{ GLTFLoader }, arrayBuffer] = await Promise.all([');
    expect(source).toContain("await new GLTFLoader().parseAsync(arrayBuffer, '')");
    expect(source).toContain("resetForSourceChange({ viewMode: 3 })");
    expect(source).toContain("document.documentElement.dataset.sourceMode = modelMode ? 'model'");
    expect(source).toContain("sourceUploadEl.addEventListener('change'");
    expect(source).toContain('if (isGlbFile(file)) loadGlbModel(file)');
    expect(source).toContain('if (modelFile) loadGlbModel(modelFile)');
  });

  it('offers optional live model analysis and always finalizes strokes after orbiting', () => {
    expect(source).toContain("import { OrbitControls } from 'three/addons/controls/OrbitControls.js'");
    expect(source).toContain('const sourceBounds = new THREE.Box3().setFromObject(root)');
    expect(source).toContain('root.scale.setScalar(5.2 / largestDimension)');
    expect(html).toContain('id="live-model-analysis" type="checkbox"');
    expect(html).toContain('data-i18n="liveStrokeFollow"');
    expect(source).toContain("modelOrbitControls.addEventListener('change'");
    expect(source).toContain("modelOrbitControls.addEventListener('end'");
    expect(source).toContain('liveModelAnalysis: false');
    expect(source).toContain('const MODEL_ANALYSIS_INTERVAL = 180');
    expect(source).toContain('const liveModelAdjustmentPending = params.liveModelAnalysis');
    expect(source).toContain('const liveModelAnalysisDue = liveModelAdjustmentPending');
    expect(source).toContain('&& time - lastAnalysisAt > MODEL_ANALYSIS_INTERVAL');
    expect(source).toContain('modelOrbiting = true');
    expect(source).toContain('modelOrbiting = false');
    expect(source).toContain('if (modelViewDirty) fieldDirty = true');
    expect(source).toContain('const replayGrowthAfterOrbit = modelViewDirty');
    expect(source).toContain('if (replayGrowthAfterOrbit) restartGrowth()');
    expect(source).toContain('新笔触正在生长');
    expect(source).toContain('(modelOrbiting && !params.liveModelAnalysis) || params.showBase');
    expect(source).toContain("liveModelAnalysisEl.addEventListener('change'");
    expect(source).toContain('liveStrokeFollow: params.liveModelAnalysis');
    expect(source).toContain('generatePersistentSeeds({ preserveGrowth: refreshModelSeeds })');
    expect(source).toContain('if (uploadedImage || importedModelRoot)');
    expect(source).toContain('semantic === SEMANTIC.IMAGE');
    expect(source).toContain("renderer.setClearColor(importedModelRoot ? 0xd8d4ca : 0x0b1322");
    expect(styles).toContain('#canvas-mount.is-model-source { cursor: grab; }');
    expect(styles).toContain('.model-analysis-toggle input:checked + i');
  });

  it('offers four built-in geometries through the same live model-to-stroke pipeline', () => {
    const geometryIds = [...html.matchAll(/data-default-geometry="([^"]+)"/g)].map((match) => match[1]);
    expect(geometryIds).toEqual(['sphere', 'cube', 'torus', 'knot']);
    expect(html).not.toContain('无需文件，直接生成笔触');
    expect(source).toContain('const DEFAULT_GEOMETRIES = Object.freeze({');
    expect(source).toContain('new THREE.SphereGeometry(2, 64, 40)');
    expect(source).toContain('new THREE.BoxGeometry(3.5, 3.5, 3.5, 10, 10, 10)');
    expect(source).toContain('cameraDistanceScale: 1.16');
    expect(source).toContain('const cameraDistanceScale = source.cameraDistanceScale ?? 1');
    expect(source).toContain('new THREE.TorusGeometry(1.65, 0.62, 32, 96)');
    expect(source).toContain('new THREE.TorusKnotGeometry(1.35, 0.42, 160, 28, 2, 3)');
    expect(source).toContain('async function loadDefaultGeometry(geometryId)');
    expect(source).toContain('configureImportedModel(importedModelRoot, preset)');
    expect(source).toContain("button.addEventListener('click', () => loadDefaultGeometry");
    expect(styles).toContain('.default-geometry-grid');
  });

  it('adds a model color palette and an on-canvas environment-light angle control', () => {
    const modelColors = [...html.matchAll(/data-model-color="([^"]+)"/g)].map((match) => match[1]);
    expect(modelColors).toEqual(['#b9783e', '#526d9d', '#66856c', '#9f5d58', '#c8bda7', '#3e4148']);
    expect(html).toContain('id="model-color-custom" type="color"');
    expect(html).toContain('aria-label="自定义模型颜色"');
    expect(html).toContain('id="model-light-control"');
    expect(html).toContain('id="model-light-angle"');
    expect(html).toContain('环境光角度');
    expect(source).toContain('function applyModelColor(value');
    expect(source).toContain('material.color.copy(color)');
    expect(source).toContain("modelColorCustomEl.addEventListener('input'");
    expect(source).toContain('{ custom: true }');
    expect(source).toContain('function setModelLightAngle(value');
    expect(source).toContain('new THREE.DirectionalLight(0xffffff, 2.8)');
    expect(source).not.toContain('new THREE.DirectionalLight(0xffd88a, 2.8)');
    expect(source).toContain('sunLight.position.set(Math.sin(radians) * 7.5, 8.5, Math.cos(radians) * 7.5)');
    expect(source).toContain('modelLightControlEl.hidden = !modelMode');
    expect(source).toContain("modelLightAngleEl.addEventListener('input'");
    expect(styles).toContain('.model-color-palette');
    expect(styles).toContain('grid-template-columns: repeat(7, 24px)');
    expect(styles).toContain('width: 24px');
    expect(styles).toContain('aspect-ratio: 1');
    expect(styles).toContain('.model-color-custom.is-active');
    expect(styles).toContain('.model-light-control {');
    expect(styles).toContain('position: absolute');
  });

  it('updates model strokes live while the light angle is being adjusted', () => {
    expect(source).toContain('let modelLightAdjusting = false');
    expect(source).toContain('(modelOrbiting || modelLightAdjusting)');
    expect(source).toContain('const liveModelAnalysisDue = liveModelAdjustmentPending');
    expect(source).toContain("modelLightAngleEl.addEventListener('input', () => {");
    expect(source).toContain('modelLightAdjusting = true');
    expect(source).toContain("modelLightAngleEl.addEventListener('change', () => {");
    expect(source).toContain('modelLightAdjusting = false');
    expect(source).toContain('环境光调整中 · 笔触实时跟随');
  });

  it('uses uploaded images directly without exposing an interpretation mode', () => {
    expect(html).not.toContain('id="source-interpretation"');
    expect(html).not.toContain('图片用途');
    expect(html).not.toContain('value="auto"');
    expect(html).not.toContain('value="sketch"');
    expect(html).not.toContain('id="sketch-palette"');
    expect(html).not.toContain('id="color-study-button"');
    expect(html).not.toContain('id="starry-study-button"');
    expect(html).not.toContain('id="sketch-library-grid"');
    expect(source).not.toContain('async function loadBuiltInSketch(');
    expect(source).not.toContain('async function loadStarryStudy(');
    expect(source).not.toContain("fetch('./sketches/manifest.json')");
    expect(source).not.toContain("fetch('./studies/starry-night/manifest.json')");
    expect(source).not.toContain('effectiveSourceInterpretation');
    expect(existsSync(new URL('../public/sketches', import.meta.url))).toBe(false);
    expect(existsSync(new URL('../public/studies/starry-night', import.meta.url))).toBe(false);
  });

  it('ships eleven aspect-safe WebP originals in a persistent three-column dropdown', () => {
    expect(html).toContain('id="scene-library"');
    expect(html).toContain('id="scene-grid"');
    expect(styles).toContain('grid-template-columns: repeat(3, minmax(0, 1fr))');
    expect(html).toContain('data-i18n="elevenWorks">11 幅</small>');
    expect(html.indexOf('id="upload-drop"')).toBeLessThan(html.indexOf('id="scene-library"'));
    expect(sceneManifest).toHaveLength(11);
    expect(new Set(sceneManifest.map((scene) => scene.id)).size).toBe(11);
    expect(sceneManifest.map((scene) => scene.id)).toEqual(expect.arrayContaining(['sunflowers', 'roses']));
    expect(sceneManifest.map((scene) => scene.id)).not.toEqual(expect.arrayContaining([
      'wheat-fields-near-auvers',
      'auvers-clouded-sky',
      'wheat-cornflowers',
      'wheat-field',
      'reaper-sunrise',
    ]));
    sceneManifest.forEach((scene) => {
      expect(scene.src).toMatch(/\.webp$/);
      expect(scene.thumb).toMatch(/\.webp$/);
      expect(scene.assetVersion).toMatch(/^sha256-[0-9a-f]{12}$/);
      expect(scene.width / scene.height).toBeCloseTo(scene.originalWidth / scene.originalHeight, 2);
      expect(Math.max(scene.width, scene.height)).toBeLessThanOrEqual(1280);
      expect(existsSync(new URL(`../public/${scene.src.replace('./', '')}`, import.meta.url))).toBe(true);
      expect(existsSync(new URL(`../public/${scene.thumb.replace('./', '')}`, import.meta.url))).toBe(true);
    });
    expect(source).toContain("fetch('./scenes/manifest.json')");
    expect(source).toContain("fetch(assetUrl, { cache: 'default' })");
    expect(source).toContain("type: 'image/webp'");
    expect(source).toContain("!builtInScene && file.type");
    expect(source).toContain("image.loading = 'lazy'");
    expect(source).toContain('initializeSceneLibrary();');
    expect(source).toContain('Math.floor(Math.random() * builtInScenes.length)');
    expect(source).toContain('selectedBuiltInScene || builtInScenes[0]');
    expect(source).not.toContain('sceneLibraryEl.open = false');
  });

  it('keeps built-in scenes light and prefetches only on user intent', () => {
    const fullSceneBytes = sceneManifest.reduce((total, scene) => {
      const path = new URL(`../public/${scene.src.replace('./', '')}`, import.meta.url);
      return total + readFileSync(path).byteLength;
    }, 0);
    expect(fullSceneBytes).toBeLessThan(4 * 1024 * 1024);
    for (const scene of sceneManifest) {
      const path = new URL(`../public/${scene.src.replace('./', '')}`, import.meta.url);
      const digest = createHash('sha256').update(readFileSync(path)).digest('hex').slice(0, 12);
      expect(scene.assetVersion).toBe(`sha256-${digest}`);
    }
    expect(source).toContain('const builtInSceneBlobCache = new Map()');
    expect(source).toContain('function fetchBuiltInSceneBlob(scene)');
    expect(source).toContain("fetch(assetUrl, { cache: 'default' })");
    expect(source).toContain('encodeURIComponent(scene.assetVersion');
    expect(source).not.toContain('scheduleBuiltInScenePrefetch');
    expect(source).toContain("button.addEventListener('pointerenter'");
    expect(source).toContain("button.addEventListener('focus'");
    expect(source).not.toContain('image.width = Math.max(1, Number(scene.width) || 1)');
    expect(source).not.toContain('image.height = Math.max(1, Number(scene.height) || 1)');
    expect(styles).toContain('.scene-card img');
    expect(styles).toContain('aspect-ratio: 1.48');
    expect(source).toContain('scene.thumb}${separator}v=${encodeURIComponent(scene.assetVersion');
    expect(source).toContain('if (scale >= 0.999) return image');
    expect(source).toContain('dataset.sceneSwitchMs');
  });

  it('separates pigment, height, wetness, and bristle furrows', () => {
    expect(source).toContain('const heightFragmentShader');
    expect(source).toContain('gl_FragColor = vec4(height, wet, furrow, 1.0)');
    expect(source).toContain('distributionGGX');
    expect(source).toContain('wetSpecular');
    expect(source).toContain('clearcoat');
    expect(source).toContain('microRidge');
    expect(source).toContain('uBristleDetail');
  });

  it('removes the wet-paint simulation surface and runtime module', () => {
    expect(html).not.toContain('wet-simulation-toggle');
    expect(html).not.toContain('wet-paint-controls');
    expect(html).not.toContain('data-wet-param');
    expect(source).not.toContain('WetPaintSimulation');
    expect(source).not.toContain('forceFragmentShader');
    expect(source).not.toContain('wetSimulation');
    expect(styles).not.toContain('.wet-brush-cursor');
    expect(existsSync(new URL('../wet-simulation.js', import.meta.url))).toBe(false);
  });

  it('exposes static brush size, dryness, and viscosity as real shader controls', () => {
    expect(html).toContain('data-param="strokeSize" type="range" min="0.35" max="3.2" step="0.01" value="1"');
    expect(html).toContain('data-param="dryness" type="range" min="0" max="1" step="0.01" value="0.69"');
    expect(html).toContain('data-param="viscosity" type="range" min="0" max="1" step="0.01" value="0.58"');
    expect(source).toContain('uniform float uBrushSize');
    expect(source).toContain('uniform float uViscosity');
    expect(source).toContain('uStrokeScale * uBrushSize');
    expect(source).toContain('mix(0.062, 0.108, uViscosity)');
    expect(source).toContain('return THREE.MathUtils.clamp(1 - params.dryness, 0, 1)');
    expect(source).toContain("['strokeSize', 'coverage', 'dryness', 'viscosity', 'bristleDetail']");
  });

  it('places preview quality before the brush-effect sliders', () => {
    expect(html.indexOf('id="quality-mode"')).toBeLessThan(html.indexOf('data-param="strokeSize"'));
    expect(html.indexOf('id="quality-mode"')).toBeLessThan(html.indexOf('data-param="length"'));
    expect(styles).toContain('.quality-row-primary');
  });

  it('places growth controls first and provides a persistent Chinese-English toggle', () => {
    expect(html.indexOf('id="growth-controls"')).toBeLessThan(html.indexOf('id="source-controls"'));
    expect(html).toContain('id="language-toggle"');
    expect(html).toContain('data-i18n="restartGrowth">重新生成</button>');
    expect(html).not.toContain('id="regenerate-button"');
    expect(source).toContain("replayGrowthButtonEl.addEventListener('click', regenerateGrowth)");
    expect(source).toContain('function regenerateGrowth()');
    expect(source).toContain('const I18N = Object.freeze({');
    expect(source).toContain("localStorage.setItem('wet-paint-flow-language', currentLanguage)");
    expect(source).toContain('document.documentElement.dataset.language = currentLanguage');
    expect(styles).toContain('.language-toggle');
    expect(styles).toContain('.growth-section-head');
  });

  it('lets desktop users resize the control panel without rebuilding every drag frame', () => {
    expect(html).toContain('id="panel-resizer"');
    expect(html).toContain('role="separator"');
    expect(html).toContain('aria-controls="control-panel"');
    expect(html).toContain('aria-valuemin="360"');
    expect(styles).toContain('grid-template-columns: minmax(0, 1fr) 10px var(--panel-width)');
    expect(styles).toContain('.panel-resizer {');
    expect(styles).toContain('.panel-resizer { display: none; }');
    expect(source).toContain('const PANEL_MIN_WIDTH = 360');
    expect(source).toContain("panelResizerEl.addEventListener('pointerdown'");
    expect(source).toContain('panelResizerEl.setPointerCapture(event.pointerId)');
    expect(source).toContain("if (event.key === 'Home') nextWidth = PANEL_MIN_WIDTH");
    expect(source).toContain('if (panelResizing) return');
    expect(source).toContain('resizeDirty = true');
  });

  it('offers scalable realtime quality and proportional high-resolution export', () => {
    expect(source).toContain("high: Object.freeze({ renderScale: 1");
    expect(source).toContain("ultra: Object.freeze({ renderScale: 1.25");
    expect(source).toContain('desiredCount');
    expect(source).toContain('params.strokeCountK * 1000');
    expect(html).toContain('data-param="strokeCountK"');
    expect(source).toContain('exportDimensions(maxEdge)');
    expect(source).toContain("renderer.domElement.toBlob(resolve, 'image/png')");
    expect(html).not.toContain('id="export-size"');
    expect(source).toContain('const maxEdge = 4096');
    expect(html).toContain('data-i18n="exportPng">导出 4K PNG</button>');
  });

  it('defaults to the beige pure-stroke view and exposes staged growth', () => {
    expect(source).toContain('viewMode: 5');
    expect(source).toContain('vec3 canvasBeige');
    expect(source).toContain('const GROWTH_DURATION = 5');
    expect(source).toContain('粗层');
    expect(source).toContain('中层＋细层');
    expect(source).toContain('稳定收尾');
  });

  it('uses the approved default brush-effect values', () => {
    expect(source).toContain('length: 1.48');
    expect(source).toContain('strokeSize: 1');
    expect(source).toContain('strokeCountK: 14');
    expect(source).toContain('impasto: 0.04');
    expect(source).toContain('dryness: 0.69');
    expect(source).toContain('viscosity: 0.58');
    expect(source).toContain("qualityMode: 'high'");
    expect(html).toContain('data-param="length" type="range" min="0.55" max="6" step="0.01" value="1.48"');
    expect(source).toContain('const STROKE_TRACE_STEPS = 10');
    expect(source).toContain('new Float32Array(STROKE_TRACE_STEPS * 2)');
    expect(source).toContain('baseLength * 0.5, STROKE_TRACE_STEPS, backwardTraceScratch');
    expect(html).toContain('data-param="strokeCountK" type="range" min="3" max="24" step="1" value="14"');
    expect(html).toContain('data-param="impasto" type="range" min="0" max="1.5" step="0.01" value="0.04"');
    expect(html).toContain('data-param="strokeSize" type="range" min="0.35" max="3.2" step="0.01" value="1"');
    expect(html).toContain('data-param="dryness" type="range" min="0" max="1" step="0.01" value="0.69"');
    expect(html).toContain('data-param="viscosity" type="range" min="0" max="1" step="0.01" value="0.58"');
    expect(html).toContain('<option value="high" selected data-i18n="qualityHigh">高清</option>');
  });

  it('starts real fine-stroke growth with the medium layer and keeps a stable finish', () => {
    expect(html).toContain('id="growth-timeline"');
    expect(html).toContain('id="growth-time-label"');
    expect(source).toContain("growthTimelineEl.addEventListener('input'");
    expect(source).toContain('function seekGrowth(seconds)');
    expect(source).toContain('const fineBirthRandom = hash(');
    expect(source).toContain('births[index] = 0.72 + fineBirthRandom * 1.85');
    expect(source).not.toContain('fineSweep');
    expect(source).not.toContain('vReveal');
    expect(source).not.toContain('attribute float aLayer');
    expect(source).toContain("growthTime < 3.2 ? t('growthMediumFine') : t('growthFinishing')");
  });

  it('fits a soft-edged frame to the source and zooms the whole framed canvas', () => {
    expect(source).toContain('function fitCanvasFrameToSource()');
    expect(source).toContain('uploadedImage.width / Math.max(1, uploadedImage.height)');
    expect(source).toContain('IMAGE_MATTE_SCALE = 0.982');
    expect(source).toContain('mount.style.width');
    expect(source).toContain('mount.style.height');
    expect(source).toContain("mount.addEventListener('wheel', handleCanvasWheel, { passive: false })");
    expect(source).toContain("mount.addEventListener('dblclick', handleCanvasDoubleClick)");
    expect(source).toContain('else resetCanvasZoom()');
    expect(source).toContain("mount.style.setProperty('--canvas-zoom'");
    expect(styles).toContain('transform-origin: 0 0');
    expect(styles).toContain('clip-path: polygon(');
    expect(styles).toContain('drop-shadow(0 24px 24px');
    expect(source).not.toContain('uViewZoom');
  });

  it('fills the available stage when a 3D model is active', () => {
    expect(source).toContain('if (importedModelRoot) {');
    expect(source).toContain("document.documentElement.dataset.canvasFit = 'model-area'");
    expect(source).toContain("document.documentElement.dataset.canvasFit = 'source-aspect'");
    expect(source).toContain("stageEl.classList.toggle('is-model-layout', modelMode)");
    expect(styles).toContain('.stage.is-model-layout { padding: clamp(10px, 1.25vw, 20px); }');
  });

  it('removes the folio rail and the redundant product subtitle', () => {
    expect(html).not.toContain('class="folio-rail"');
    expect(html).not.toContain('<small>笔触生成器</small>');
    expect(styles).not.toContain('.folio-rail');
    expect(styles).toContain('grid-template-columns: minmax(0, 1fr) 10px var(--panel-width)');
  });

  it('exposes independent coarse, medium, and fine brush-layer switches', () => {
    const brushLayerValues = [...html.matchAll(/data-brush-layer="(\d+)"/g)].map((match) => match[1]);
    expect(brushLayerValues).toEqual(['0', '1', '2']);
    expect(html).toContain('data-i18n="coarse">粗层</b>');
    expect(html).toContain('data-i18n="medium">中层</b>');
    expect(html).toContain('data-i18n="fine">细层</b>');
    expect(source).toContain('brushLayers: [true, true, true]');
    expect(source).toContain('attribute float aBrushLayer');
    expect(source).toContain('uniform vec3 uBrushLayerVisibility');
    expect(source).toContain('if (vBrushLayerVisible < 0.5) discard');
    expect(source).toContain('function syncBrushLayerVisibility()');
    expect(source).toContain("input.addEventListener('change'");
  });

  it('keeps runtime diagnostics out of the visible control surface', () => {
    expect(html).not.toContain('class="runtime-pill"');
    expect(html).toContain('id="runtime-status"');
    expect(html).toContain('fps-badge visually-hidden');
    expect(html).toContain('id="stroke-count" class="visually-hidden"');
    expect(html).toContain('id="source-meta" class="visually-hidden"');
  });

  it('keeps two visual layers and adds a graphite flow-field analysis view', () => {
    const layerValues = [...html.matchAll(/name="layer-mode" value="(\d+)"/g)].map((match) => match[1]);
    expect(layerValues).toEqual(['5', '3', '0', '1']);
    expect(html).toContain('data-i18n="brushOnly">纯笔触</strong>');
    expect(html).toContain('id="source-preview-label" data-i18n="original">原图</strong>');
    expect(html).toContain('data-i18n="brushAndOriginal">笔触＋原图</strong>');
    expect(html).toContain('data-i18n="flowSketch">流场手稿</strong>');
    expect(html).not.toContain('id="view-mode"');
    expect(source).toContain('function setLayerMode(mode)');
    expect(source).toContain('[0, 1, 3, 5]');
    expect(source).toContain("? 'brush'");
    expect(source).toContain("? 'flow-sketch' : 'blend'");
    expect(source).toContain('const pencilStrokeMaterial');
    expect(source).toContain('vertexShader: strokeVertexShader');
    expect(source).toContain('strokeMesh.material = sketchActive ? pencilStrokeMaterial : strokeMaterial');
    expect(source).toContain('与最终笔触共用长度、弯度和生长轨迹');
    expect(styles).toContain('grid-template-columns: repeat(4, minmax(0, 1fr))');
    expect(styles).toContain('.layer-choice small { display: none; }');
    expect(styles).toContain('overflow-wrap: anywhere');
    expect(styles).toContain('white-space: normal');
    expect(source).not.toContain('float fieldGuide');
  });

  it('replays model growth when switching from 3D preview to brush output', () => {
    expect(source).toContain("previousMode === 3 && nextMode === 5");
    expect(source).toContain('if (replayModelGrowth) restartGrowth()');
    expect(source).toContain('const replaying = setLayerMode(5)');
    expect(source).toContain('正在生成模型笔触');
  });

  it('keeps stroke-only interactions off the expensive G-buffer path', () => {
    expect(source).toContain('function reseedStrokes()');
    expect(source).toContain("if (key === 'length') strokeGeometryDirty = true");
    expect(source).toContain('else if (strokeGeometryDirty) rebuildStrokeGeometry()');
    expect(source).toContain('traceInto(seed');
    expect(source).toContain('function lineBlend3(');
    expect(source).toContain('if (!resizeDirty && outputWidth > 0 && outputHeight > 0) return false');
    expect(source).toContain('const dimensionsUnchanged = Boolean(');
    expect(source).toContain('&& analysisWidth === nextAnalysisWidth');
    expect(source).toContain('&& sceneTarget.samples === targetSamples');
    expect(source).toContain('if (dimensionsUnchanged) return false');
    expect(source).toContain('(params.movingLight && growthWasActive)');
    expect(source).not.toContain('lineBlend([');
  });

  it('sleeps the render loop when stable and removes the unused field texture upload', () => {
    expect(source).toContain('function requestFrame()');
    expect(source).toContain('animationFrameId = requestAnimationFrame(animate)');
    expect(source).toContain('animationFrameId = 0');
    expect(source).toContain('if (growthActive || liveModelAdjustmentPending || (params.cameraDrift && !params.paused)) requestFrame()');
    expect(source.indexOf('if (!strokeTargetsDirty && (!growthActive || params.paused)) return false'))
      .toBeLessThan(source.indexOf("growthProgressEl.textContent = growthRatio >= 1"));
    expect(source).not.toContain('let fieldTexture');
    expect(source).not.toContain('uField: { value: null }');
    expect(source).not.toContain('uniform sampler2D uField');
    expect(source).not.toContain('fieldTexture.needsUpdate');
  });

  it('honors reduced motion for the first scene while keeping manual replay available', () => {
    expect(source).toContain("window.matchMedia?.('(prefers-reduced-motion: reduce)').matches");
    expect(source).toContain('growthPlayback: !prefersReducedMotion');
    expect(source).toContain('if (skipInitialGrowth) {');
    expect(source).toContain('updateGrowthControls(GROWTH_DURATION)');
    expect(source).toContain('function restartGrowth()');
    expect(source).toContain('params.growthPlayback = true');
  });

  it('records the five-second growth animation in real time with performance guardrails', () => {
    expect(html).toContain('id="video-export-button"');
    expect(html).not.toContain('id="video-export-hint"');
    expect(html).toContain('导出生长视频');
    expect(styles).toContain('.export-actions');
    expect(styles).toContain('.export-action-button');
    expect(styles).toContain('height: 50px');
    expect(html).toContain('class="export-button export-action-button"');
    expect(source).toContain('renderer.domElement.captureStream(VIDEO_RECORDING_FPS)');
    expect(source).toContain('new MediaRecorder(stream');
    expect(source).toContain("'video/mp4;codecs=avc1.42E01E'");
    expect(source).toContain("'video/webm;codecs=vp9'");
    expect(source).toContain('const VIDEO_RECORDING_TIMEOUT = 8000');
    expect(source).toContain('const VIDEO_RECORDING_MIN_FPS = 24');
    expect(source).toContain('if (preflightFps < VIDEO_RECORDING_MIN_FPS)');
    expect(source).toContain('waitForGrowthRecording()');
    expect(source).toContain('document.documentElement.dataset.lastVideoBytes');
    expect(source).toContain('link.download = filename');
  });

  it('encodes 4K PNG directly from the WebGL canvas without duplicate CPU pixel buffers', () => {
    expect(source).toContain('renderer.setSize(exportWidth, exportHeight, false)');
    expect(source).toContain("renderer.domElement.toBlob(resolve, 'image/png')");
    expect(source).toContain('renderer.setSize(previousCanvasWidth, previousCanvasHeight, false)');
    expect(source).not.toContain('const exportComposite = makeTarget');
    expect(source).not.toContain('const pixels = new Uint8Array(exportWidth * exportHeight * 4)');
    expect(source).not.toContain('context.createImageData(exportWidth, exportHeight)');
  });

  it('replaces the shortcut note with linked creator signatures', () => {
    expect(html).toContain('class="signature-credit"');
    expect(html).toContain('class="signature-creators"');
    expect(html).toContain('href="https://x.com/ring_hyacinth"');
    expect(html).toContain('href="https://x.com/simonxxoo"');
    expect(html).toContain('>Hyacinth</a>');
    expect(html).toContain('>Simon</a>');
    expect(html).toContain('href="https://github.com/simonxxooxxoo/wet-paint-flow"');
    expect(html).toContain('>github.com/simonxxooxxoo/wet-paint-flow</a>');
    expect((html.match(/target="_blank"/g) || [])).toHaveLength(3);
    expect(styles).toContain('justify-items: end');
  });

  it('uses the section-heading serif face for bold parameter-panel text', () => {
    expect(styles).toContain('.panel :is(button, strong, b, output),');
    expect(styles).toContain('.panel .growth-scrubber-head span { font-family: var(--serif); }');
  });

});
