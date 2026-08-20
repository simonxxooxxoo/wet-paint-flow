import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const mount = document.getElementById('canvas-mount');
const appEl = document.getElementById('app');
const panelEl = document.getElementById('control-panel');
const panelResizerEl = document.getElementById('panel-resizer');
const statusEl = document.getElementById('runtime-status');
const strokeCountEl = document.getElementById('stroke-count');
const gbufferSizeEl = document.getElementById('gbuffer-size');
const seedChurnEl = document.getElementById('seed-churn');
const fpsEl = document.getElementById('fps');
const fieldTimeEl = document.getElementById('field-time');
const growthProgressEl = document.getElementById('growth-progress');
const rendererNameEl = document.getElementById('renderer-name');
const flowSumEl = document.getElementById('flow-sum');
const sourceModeEl = document.getElementById('source-mode');
const sourceMetaEl = document.getElementById('source-meta');
const sourceUploadEl = document.getElementById('source-upload');
const modelSourceControlsEl = document.getElementById('model-source-controls');
const modelSourceNameEl = document.getElementById('model-source-name');
const modelSourceMetaEl = document.getElementById('model-source-meta');
const modelPreviewButtonEl = document.getElementById('model-preview-button');
const modelPaintButtonEl = document.getElementById('model-paint-button');
const defaultGeometryEls = Array.from(document.querySelectorAll('[data-default-geometry]'));
const liveModelAnalysisEl = document.getElementById('live-model-analysis');
const modelColorEls = Array.from(document.querySelectorAll('[data-model-color]'));
const modelColorCustomEl = document.getElementById('model-color-custom');
const modelLightControlEl = document.getElementById('model-light-control');
const modelLightAngleEl = document.getElementById('model-light-angle');
const modelLightAngleOutputEl = document.getElementById('model-light-angle-output');
const sourcePreviewLabelEl = document.getElementById('source-preview-label');
const sourcePreviewHintEl = document.getElementById('source-preview-hint');
const stageEl = document.querySelector('.stage');
const uploadDropEl = document.getElementById('upload-drop');
const qualityModeEl = document.getElementById('quality-mode');
const exportButtonEl = document.getElementById('export-button');
const videoExportButtonEl = document.getElementById('video-export-button');
const replayGrowthButtonEl = document.getElementById('replay-growth-button');
const pauseButton = document.getElementById('pause-button');
const restoreSceneButton = document.getElementById('restore-scene-button');
const sceneLibraryEl = document.getElementById('scene-library');
const sceneGridEl = document.getElementById('scene-grid');
const scenePickerLabelEl = document.getElementById('scene-picker-label');
const sceneTourToggleEl = document.getElementById('scene-tour-toggle');
sceneTourToggleEl.disabled = true;
const layerModeEls = Array.from(document.querySelectorAll('input[name="layer-mode"]'));
const brushLayerEls = Array.from(document.querySelectorAll('input[data-brush-layer]'));
const growthTimelineEl = document.getElementById('growth-timeline');
const growthTimeLabelEl = document.getElementById('growth-time-label');
const languageToggleEl = document.getElementById('language-toggle');

const I18N = Object.freeze({
  zh: Object.freeze({
    pageTitle: 'Wet Paint Flow · 实时油画笔触生成器',
    switchLanguage: 'Switch to English',
    growthControl: '生长控制',
    restartGrowth: '重新生成',
    growthTimeline: '生长时间轴',
    growthTimelineAria: '生长动画时间轴',
    pause: '暂停',
    resume: '继续',
    waiting: '等待生成',
    growthComplete: '生长完成',
    growthCoarse: '粗层',
    growthMediumFine: '中层＋细层',
    growthFinishing: '稳定收尾',
    source: '素材',
    importSource: '导入图片或 GLB',
    localProcessing: 'JPG / PNG / WebP / GLB · 本地处理',
    defaultGeometry: '默认几何体',
    liveStrokeFollow: '实时笔触跟随',
    sphere: '球体',
    cube: '立方体',
    torus: '圆环',
    knot: '扭结',
    modelColor: '模型颜色',
    preview3d: '3D 预览',
    strokeResult: '笔触结果',
    builtInWorks: '内置原作',
    elevenWorks: '11 幅',
    strokeMorph: '作品间笔触变形',
    startTour: '自动巡展',
    stopTour: '停止巡展',
    loadingScenes: '正在读取场景…',
    loadingWork: '正在载入',
    selectWork: '选择一幅原作',
    meshCount: '网格',
    triangleCount: '三角面',
    restoreScene: '恢复内置场景',
    display: '画面显示',
    brushOnly: '纯笔触',
    beigeCanvas: '米色画布',
    original: '原图',
    noStrokes: '不加笔触',
    model3d: '3D 模型',
    dragToRotate: '拖动旋转',
    brushAndOriginal: '笔触＋原图',
    blendedView: '融合显示',
    flowSketch: '流场手稿',
    pencilFlow: '铅笔方向线',
    brushLayers: '笔刷图层',
    coarse: '粗层',
    structure: '结构',
    medium: '中层',
    shaping: '塑形',
    fine: '细层',
    texture: '纹理',
    strokeEffects: '笔触效果',
    previewQuality: '预览清晰度',
    qualityBalanced: '流畅',
    qualityHigh: '高清',
    qualityUltra: '极致',
    strokeSize: '笔触大小',
    strokeLength: '笔触长度',
    strokeCount: '笔触数量',
    paintThickness: '颜料厚度',
    paintDryness: '颜料干燥度',
    paintViscosity: '颜料黏度',
    generateExport: '生成与导出',
    exportPng: '导出 4K PNG',
    exportVideo: '导出生长视频',
    checkingPerformance: '正在检测性能…',
    recording: '录制中',
    seconds: '秒',
    canvasHint: '滚轮缩放画布 · 双击恢复 · 拖动时间轴定位',
    modelCanvasHint: '拖动旋转模型 · 滚轮调整距离 · 双击复位视角',
    lightAngle: '环境光角度',
    resizePanel: '拖动调整参数面板宽度',
  }),
  en: Object.freeze({
    pageTitle: 'Wet Paint Flow · Real-time Brush Generator',
    switchLanguage: '切换到中文',
    growthControl: 'Growth',
    restartGrowth: 'Regenerate',
    growthTimeline: 'Growth Timeline',
    growthTimelineAria: 'Growth animation timeline',
    pause: 'Pause',
    resume: 'Resume',
    waiting: 'Waiting',
    growthComplete: 'Complete',
    growthCoarse: 'Coarse layer',
    growthMediumFine: 'Medium + fine',
    growthFinishing: 'Finishing',
    source: 'Source',
    importSource: 'Import Image or GLB',
    localProcessing: 'JPG / PNG / WebP / GLB · Processed locally',
    defaultGeometry: 'Default Geometry',
    liveStrokeFollow: 'Live Stroke Follow',
    sphere: 'Sphere',
    cube: 'Cube',
    torus: 'Torus',
    knot: 'Knot',
    modelColor: 'Model Color',
    preview3d: '3D Preview',
    strokeResult: 'Brush Result',
    builtInWorks: 'Built-in Works',
    elevenWorks: '11 works',
    strokeMorph: 'Stroke-to-stroke transitions',
    startTour: 'Auto Tour',
    stopTour: 'Stop Tour',
    loadingScenes: 'Loading scenes…',
    loadingWork: 'Loading',
    selectWork: 'Select a work',
    meshCount: 'meshes',
    triangleCount: 'triangles',
    restoreScene: 'Restore Built-in Scene',
    display: 'Display',
    brushOnly: 'Brushes',
    beigeCanvas: 'Beige canvas',
    original: 'Original',
    noStrokes: 'No brush layer',
    model3d: '3D Model',
    dragToRotate: 'Drag to rotate',
    brushAndOriginal: 'Brush + Original',
    blendedView: 'Blended view',
    flowSketch: 'Flow Sketch',
    pencilFlow: 'Pencil directions',
    brushLayers: 'Brush Layers',
    coarse: 'Coarse',
    structure: 'Structure',
    medium: 'Medium',
    shaping: 'Form',
    fine: 'Fine',
    texture: 'Texture',
    strokeEffects: 'Brush Effects',
    previewQuality: 'Preview Quality',
    qualityBalanced: 'Balanced',
    qualityHigh: 'High',
    qualityUltra: 'Ultra',
    strokeSize: 'Brush Size',
    strokeLength: 'Brush Length',
    strokeCount: 'Brush Count',
    paintThickness: 'Paint Thickness',
    paintDryness: 'Paint Dryness',
    paintViscosity: 'Paint Viscosity',
    generateExport: 'Generate & Export',
    exportPng: 'Export 4K PNG',
    exportVideo: 'Export Growth Video',
    checkingPerformance: 'Checking performance…',
    recording: 'Recording',
    seconds: 'sec',
    canvasHint: 'Wheel to zoom · Double-click to reset · Drag the timeline to seek',
    modelCanvasHint: 'Drag to rotate · Wheel to zoom · Double-click to reset',
    lightAngle: 'Light Angle',
    resizePanel: 'Drag to resize the control panel',
  }),
});

let currentLanguage = (() => {
  try {
    return localStorage.getItem('wet-paint-flow-language') === 'en' ? 'en' : 'zh';
  } catch {
    return 'zh';
  }
})();

function t(key) {
  return I18N[currentLanguage][key] || I18N.zh[key] || key;
}

function applyLanguage() {
  document.documentElement.lang = currentLanguage === 'en' ? 'en' : 'zh-CN';
  document.documentElement.dataset.language = currentLanguage;
  document.title = t('pageTitle');
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const value = t(element.dataset.i18n);
    if (value) element.textContent = value;
  });
  document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
    const value = t(element.dataset.i18nAriaLabel);
    if (value) element.setAttribute('aria-label', value);
  });
  languageToggleEl.setAttribute('aria-label', t('switchLanguage'));
  languageToggleEl.title = t('switchLanguage');
}

const PANEL_MIN_WIDTH = 360;
const PANEL_KEYBOARD_STEP = 32;
let panelResizing = false;
let panelResizePointerId = null;
let panelResizeFrameId = 0;
let pendingPanelWidth = null;

function panelResizeEnabled() {
  return window.matchMedia('(min-width: 851px)').matches;
}

function panelViewportMaximum() {
  return Math.max(PANEL_MIN_WIDTH, appEl.clientWidth - panelResizerEl.offsetWidth);
}

function updatePanelResizeAria(width = panelEl.getBoundingClientRect().width) {
  panelResizerEl.setAttribute('aria-valuemin', String(PANEL_MIN_WIDTH));
  panelResizerEl.setAttribute('aria-valuemax', String(Math.round(panelViewportMaximum())));
  panelResizerEl.setAttribute('aria-valuenow', String(Math.round(width)));
}

function applyPanelWidth(width) {
  const nextWidth = Math.min(
    panelViewportMaximum(),
    Math.max(PANEL_MIN_WIDTH, Number(width) || PANEL_MIN_WIDTH),
  );
  appEl.style.setProperty('--panel-width', `${Math.round(nextWidth)}px`);
  updatePanelResizeAria(nextWidth);
  document.documentElement.dataset.panelWidth = String(Math.round(nextWidth));
  return nextWidth;
}

function flushPanelResize() {
  panelResizeFrameId = 0;
  if (pendingPanelWidth === null) return;
  applyPanelWidth(pendingPanelWidth);
  pendingPanelWidth = null;
  fitCanvasFrameToSource();
}

function schedulePanelResize(width) {
  pendingPanelWidth = width;
  if (panelResizeFrameId) return;
  panelResizeFrameId = requestAnimationFrame(flushPanelResize);
}

function widthFromPanelPointer(event) {
  return appEl.getBoundingClientRect().right - event.clientX;
}

function finishPanelResize(event) {
  if (!panelResizing || event.pointerId !== panelResizePointerId) return;
  if (panelResizeFrameId) {
    cancelAnimationFrame(panelResizeFrameId);
    panelResizeFrameId = 0;
  }
  pendingPanelWidth = event.type === 'pointerup'
    ? widthFromPanelPointer(event)
    : pendingPanelWidth ?? panelEl.getBoundingClientRect().width;
  flushPanelResize();
  panelResizing = false;
  panelResizePointerId = null;
  delete document.documentElement.dataset.panelResizing;
  if (panelResizerEl.hasPointerCapture(event.pointerId)) {
    panelResizerEl.releasePointerCapture(event.pointerId);
  }
  resizeDirty = true;
  requestFrame();
}

panelResizerEl.addEventListener('pointerdown', (event) => {
  if (!panelResizeEnabled() || event.button !== 0) return;
  event.preventDefault();
  panelResizing = true;
  panelResizePointerId = event.pointerId;
  document.documentElement.dataset.panelResizing = 'true';
  panelResizerEl.setPointerCapture(event.pointerId);
  panelResizerEl.focus();
  schedulePanelResize(widthFromPanelPointer(event));
});

panelResizerEl.addEventListener('pointermove', (event) => {
  if (!panelResizing || event.pointerId !== panelResizePointerId) return;
  schedulePanelResize(widthFromPanelPointer(event));
});

panelResizerEl.addEventListener('pointerup', finishPanelResize);
panelResizerEl.addEventListener('pointercancel', finishPanelResize);
panelResizerEl.addEventListener('lostpointercapture', finishPanelResize);

panelResizerEl.addEventListener('keydown', (event) => {
  if (!panelResizeEnabled()) return;
  const currentWidth = panelEl.getBoundingClientRect().width;
  let nextWidth = null;
  if (event.key === 'ArrowLeft') nextWidth = currentWidth + PANEL_KEYBOARD_STEP;
  if (event.key === 'ArrowRight') nextWidth = currentWidth - PANEL_KEYBOARD_STEP;
  if (event.key === 'Home') nextWidth = PANEL_MIN_WIDTH;
  if (nextWidth === null) return;
  event.preventDefault();
  applyPanelWidth(nextWidth);
  resizeDirty = true;
  requestFrame();
});

const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
let skipInitialGrowth = prefersReducedMotion;

const params = {
  structure: 0.34,
  geometry: 0.28,
  semantic: 0.72,
  length: 1.48,
  strokeSize: 1,
  strokeCountK: 14,
  coverage: 0.99,
  impasto: 0.04,
  dryness: 0.69,
  viscosity: 0.58,
  bristleDetail: 0.82,
  qualityMode: 'high',
  viewMode: 5,
  brushLayers: [true, true, true],
  cameraDrift: false,
  growthPlayback: !prefersReducedMotion,
  movingLight: true,
  modelLightAngle: -52,
  liveModelAnalysis: false,
  showBase: false,
  paused: false,
};
document.documentElement.dataset.liveModelAnalysis = String(params.liveModelAnalysis);

function paintWetness() {
  return THREE.MathUtils.clamp(1 - params.dryness, 0, 1);
}

const SEMANTIC = Object.freeze({
  SKY: 1,
  MOUNTAIN: 2,
  GROUND: 3,
  VEGETATION: 4,
  BUILDING: 5,
  IMAGE: 6,
});

const semanticColors = {
  [SEMANTIC.SKY]: 0x526fae,
  [SEMANTIC.MOUNTAIN]: 0x637c72,
  [SEMANTIC.GROUND]: 0xd49b3e,
  [SEMANTIC.VEGETATION]: 0x285345,
  [SEMANTIC.BUILDING]: 0xd5c18c,
  [SEMANTIC.IMAGE]: 0xc77846,
};

const palettes = {
  [SEMANTIC.SKY]: ['#17377f', '#2356ac', '#3477c2', '#69a1d2', '#e6b84d', '#f5d879'],
  [SEMANTIC.MOUNTAIN]: ['#294875', '#3c668c', '#568796', '#86a08a', '#d6ad4f', '#ead080'],
  [SEMANTIC.GROUND]: ['#7b3e18', '#a85a1e', '#cd7b24', '#e4a334', '#f1c551', '#7e7d36'],
  [SEMANTIC.VEGETATION]: ['#123c38', '#1d5947', '#39734e', '#6b873f', '#c89b34', '#e2ba55'],
  [SEMANTIC.BUILDING]: ['#673a29', '#a2603c', '#c28b57', '#d9b979', '#ead49b', '#f3e3b7'],
};

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false,
  preserveDrawingBuffer: false,
  powerPreference: 'high-performance',
});
renderer.setPixelRatio(1);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
renderer.shadowMap.enabled = false;
renderer.setClearColor(0x0b1322, 1);
mount.appendChild(renderer.domElement);

rendererNameEl.textContent = renderer.capabilities.isWebGL2
  ? `WebGL2 · Three r${THREE.REVISION}`
  : `WebGL · Three r${THREE.REVISION}`;

const scene = new THREE.Scene();
const proceduralSceneFog = new THREE.FogExp2(0x506780, 0.018);
scene.fog = proceduralSceneFog;

const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
camera.position.set(0, 4.8, 10.5);
const cameraTarget = new THREE.Vector3(0, 1.25, -4.8);
camera.lookAt(cameraTarget);

const modelOrbitControls = new OrbitControls(camera, renderer.domElement);
modelOrbitControls.enabled = false;
modelOrbitControls.enableDamping = false;
modelOrbitControls.enablePan = false;
modelOrbitControls.rotateSpeed = 0.62;
modelOrbitControls.zoomSpeed = 0.78;
modelOrbitControls.minPolarAngle = 0.08;
modelOrbitControls.maxPolarAngle = Math.PI - 0.08;

const uploadedScene = new THREE.Scene();
const uploadedCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const uploadedMaterial = new THREE.ShaderMaterial({
  depthTest: false,
  depthWrite: false,
  toneMapped: false,
  uniforms: {
    uImage: { value: null },
    uPass: { value: 0 },
    uScale: { value: new THREE.Vector2(1, 1) },
  },
  vertexShader: `
    varying vec2 vUv;
    uniform vec2 uScale;
    void main() {
      vUv = uv;
      gl_Position = vec4(position.xy * uScale, 0.0, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform sampler2D uImage;
    uniform int uPass;
    void main() {
      vec4 source = texture2D(uImage, vUv);
      if (source.a < 0.035) discard;
      if (uPass == 1) {
        gl_FragColor = vec4(${SEMANTIC.IMAGE.toFixed(1)} / 255.0, 0.0, 0.0, 1.0);
        return;
      }
      if (uPass == 2) {
        gl_FragColor = vec4(0.5, 0.5, 1.0, 0.5);
        return;
      }
      gl_FragColor = vec4(source.rgb, 1.0);
    }
  `,
});
const uploadedQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), uploadedMaterial);
uploadedScene.add(uploadedQuad);
let uploadedImage = null;
let uploadedTexture = null;
let uploadedImageLabel = '';
let builtInScenes = [];
let selectedBuiltInScene = null;
let activeBuiltInSceneId = '';
let sceneLoadToken = 0;
const builtInSceneBlobCache = new Map();
let sceneTourEnabled = false;
let sceneTourTimer = 0;
let importedModelRoot = null;
let importedModelMeshes = [];
let importedModelLabel = '';
let importedModelStats = null;
let activeDefaultGeometryId = '';
let activeModelColor = '';
let activeModelColorIsCustom = false;
let modelViewDirty = false;
let modelOrbiting = false;
let modelLightAdjusting = false;
let modelCameraDistance = 8;

const DEFAULT_GEOMETRIES = Object.freeze({
  sphere: {
    label: '球体',
    color: 0xb9783e,
    create: () => new THREE.SphereGeometry(2, 64, 40),
  },
  cube: {
    label: '立方体',
    color: 0x526d9d,
    cameraDistanceScale: 1.16,
    create: () => new THREE.BoxGeometry(3.5, 3.5, 3.5, 10, 10, 10),
  },
  torus: {
    label: '圆环',
    color: 0x66856c,
    create: () => new THREE.TorusGeometry(1.65, 0.62, 32, 96),
    rotation: [0.34, -0.42, 0.12],
  },
  knot: {
    label: '扭结',
    color: 0x9f5d58,
    create: () => new THREE.TorusKnotGeometry(1.35, 0.42, 160, 28, 2, 3),
    rotation: [0.2, -0.35, -0.12],
  },
});

const hemi = new THREE.HemisphereLight(0xabc5e8, 0x6c431f, 2.2);
scene.add(hemi);
const sunLight = new THREE.DirectionalLight(0xffffff, 2.8);
sunLight.position.set(-5, 9, 4);
scene.add(sunLight);

function setModelLightAngle(value, options = {}) {
  const angle = THREE.MathUtils.clamp(Number(value) || 0, -180, 180);
  const radians = THREE.MathUtils.degToRad(angle);
  params.modelLightAngle = angle;
  sunLight.position.set(Math.sin(radians) * 7.5, 8.5, Math.cos(radians) * 7.5);
  sunLight.updateMatrixWorld();
  modelLightAngleEl.value = String(Math.round(angle));
  modelLightAngleOutputEl.textContent = `${Math.round(angle)}°`;
  document.documentElement.dataset.modelLightAngle = String(Math.round(angle));
  sceneTargetDirty = true;
  compositeDirty = true;
  if (importedModelRoot) modelViewDirty = true;
  if (options.finalize) {
    fieldDirty = true;
    statusEl.textContent = `环境光角度 · ${Math.round(angle)}°`;
    publishFlowState();
  }
  requestFrame();
}

const sceneObjects = [];
let skyMaterial;

function tag(object, semantic) {
  object.userData.semantic = semantic;
  sceneObjects.push(object);
  scene.add(object);
  return object;
}

function createScene() {
  skyMaterial = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    depthWrite: false,
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform float uTime;
      void main() {
        vec2 p = vUv - vec2(0.32, 0.58);
        float radius = length(p * vec2(1.0, 1.45));
        float angle = atan(p.y, p.x);
        float curl = sin(radius * 38.0 - angle * 4.0 + uTime * 0.16);
        float bands = 0.5 + 0.5 * sin(vUv.y * 26.0 + sin(vUv.x * 11.0) * 1.8);
        vec3 low = vec3(0.075, 0.16, 0.36);
        vec3 high = vec3(0.28, 0.48, 0.70);
        vec3 color = mix(low, high, smoothstep(0.02, 0.94, vUv.y));
        color += vec3(0.08, 0.09, 0.11) * curl * exp(-radius * 2.2);
        color += vec3(0.035, 0.055, 0.075) * bands;
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(48, 27, 1, 1), skyMaterial);
  sky.position.set(0, 5, -17);
  tag(sky, SEMANTIC.SKY);

  const sun = new THREE.Mesh(
    new THREE.CircleGeometry(1.02, 64),
    new THREE.MeshBasicMaterial({ color: 0xf3c35e, fog: false }),
  );
  sun.position.set(-4.6, 4.6, -15.7);
  tag(sun, SEMANTIC.SKY);

  const groundGeometry = new THREE.PlaneGeometry(28, 34, 54, 68);
  groundGeometry.rotateX(-Math.PI / 2);
  const groundPosition = groundGeometry.attributes.position;
  const groundColor = new Float32Array(groundPosition.count * 3);
  const ochreA = new THREE.Color(0x9a6724);
  const ochreB = new THREE.Color(0xd29a35);
  for (let i = 0; i < groundPosition.count; i += 1) {
    const x = groundPosition.getX(i);
    const z = groundPosition.getZ(i);
    const ridge = Math.sin(x * 0.48 + z * 0.16) * 0.18 + Math.sin(z * 0.41) * 0.11;
    groundPosition.setY(i, ridge - 0.25);
    const mix = 0.5 + 0.5 * Math.sin(x * 0.72 - z * 0.32);
    const color = ochreA.clone().lerp(ochreB, mix * 0.72 + 0.14);
    groundColor[i * 3] = color.r;
    groundColor[i * 3 + 1] = color.g;
    groundColor[i * 3 + 2] = color.b;
  }
  groundGeometry.setAttribute('color', new THREE.BufferAttribute(groundColor, 3));
  groundGeometry.computeVertexNormals();
  const ground = new THREE.Mesh(
    groundGeometry,
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, metalness: 0, side: THREE.DoubleSide }),
  );
  ground.position.z = -4;
  tag(ground, SEMANTIC.GROUND);

  const mountainSpecs = [
    [-6.2, 2.2, -11.8, 5.2, 7.6, 0x506f7b],
    [-1.5, 2.7, -12.8, 6.8, 8.7, 0x698882],
    [4.7, 2.0, -12.1, 5.3, 7.2, 0x547681],
    [8.8, 1.45, -11.7, 4.1, 6.4, 0x738b7b],
  ];
  mountainSpecs.forEach(([x, y, z, radius, height, color], index) => {
    const mountain = new THREE.Mesh(
      new THREE.ConeGeometry(radius, height, 7, 3, false, index * 0.31),
      new THREE.MeshStandardMaterial({ color, roughness: 0.96, flatShading: true }),
    );
    mountain.position.set(x, y, z);
    mountain.scale.z = 0.48;
    tag(mountain, SEMANTIC.MOUNTAIN);
  });

  function createCypress(x, z, scale = 1) {
    const group = new THREE.Group();
    const dark = new THREE.MeshStandardMaterial({ color: 0x214d3f, roughness: 0.95 });
    for (let i = 0; i < 4; i += 1) {
      const crown = new THREE.Mesh(new THREE.ConeGeometry((0.52 - i * 0.07) * scale, 2.15 * scale, 9), dark);
      crown.position.y = (0.78 + i * 0.66) * scale;
      crown.rotation.y = i * 0.47;
      group.add(crown);
    }
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11 * scale, 0.19 * scale, 1.7 * scale, 7),
      new THREE.MeshStandardMaterial({ color: 0x59401f, roughness: 1 }),
    );
    trunk.position.y = 0.45 * scale;
    group.add(trunk);
    group.position.set(x, -0.1, z);
    group.userData.semantic = SEMANTIC.VEGETATION;
    group.traverse((child) => {
      if (child.isMesh) {
        child.userData.semantic = SEMANTIC.VEGETATION;
        sceneObjects.push(child);
      }
    });
    scene.add(group);
  }
  createCypress(-5.0, -6.7, 1.65);
  createCypress(5.6, -7.3, 1.2);
  createCypress(7.3, -8.3, 0.78);

  function createHouse(x, z, scale, wallColor, roofColor) {
    const house = new THREE.Mesh(
      new THREE.BoxGeometry(1.65 * scale, 1.15 * scale, 1.35 * scale),
      new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.92 }),
    );
    house.position.set(x, 0.42 * scale, z);
    tag(house, SEMANTIC.BUILDING);
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(1.28 * scale, 0.82 * scale, 4),
      new THREE.MeshStandardMaterial({ color: roofColor, roughness: 0.95 }),
    );
    roof.position.set(x, 1.35 * scale, z);
    roof.rotation.y = Math.PI * 0.25;
    roof.scale.z = 0.78;
    tag(roof, SEMANTIC.BUILDING);
    const windowMaterial = new THREE.MeshBasicMaterial({ color: 0x3d5e80 });
    for (const offset of [-0.42, 0.42]) {
      const windowMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.25 * scale, 0.38 * scale), windowMaterial);
      windowMesh.position.set(x + offset * scale, 0.48 * scale, z + 0.681 * scale);
      tag(windowMesh, SEMANTIC.BUILDING);
    }
  }
  createHouse(2.5, -5.6, 1.15, 0xd6c08c, 0x8c4d36);
  createHouse(4.5, -6.5, 0.72, 0xc89b67, 0x6f3b34);

  const wheatMaterial = new THREE.MeshStandardMaterial({ color: 0xe0ae45, roughness: 0.94 });
  const bladeGeometry = new THREE.ConeGeometry(0.035, 0.62, 4);
  const wheat = new THREE.InstancedMesh(bladeGeometry, wheatMaterial, 520);
  const matrix = new THREE.Matrix4();
  const position = new THREE.Vector3();
  const rotation = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  for (let i = 0; i < wheat.count; i += 1) {
    const x = (hash(i * 3.17) - 0.5) * 19;
    const z = -1.8 - hash(i * 8.91 + 4.2) * 8.4;
    position.set(x, -0.02, z);
    rotation.setFromEuler(new THREE.Euler((hash(i + 7) - 0.5) * 0.18, hash(i + 2) * Math.PI, 0));
    const s = 0.66 + hash(i * 1.77) * 0.8;
    scale.set(s, s, s);
    matrix.compose(position, rotation, scale);
    wheat.setMatrixAt(i, matrix);
  }
  wheat.instanceMatrix.needsUpdate = true;
  tag(wheat, SEMANTIC.GROUND);
}

createScene();
const proceduralSceneRoots = scene.children.filter((child) => child !== hemi && child !== sunLight);

modelOrbitControls.addEventListener('start', () => {
  if (!importedModelRoot) return;
  modelOrbiting = true;
  mount.classList.add('is-orbiting');
  compositeDirty = true;
  statusEl.textContent = params.liveModelAnalysis
    ? '正在调整模型角度 · 笔触实时跟随'
    : '正在调整模型角度 · 流畅 3D 预览';
  requestFrame();
});

modelOrbitControls.addEventListener('change', () => {
  if (!importedModelRoot) return;
  modelViewDirty = true;
  sceneTargetDirty = true;
  compositeDirty = true;
  document.documentElement.dataset.modelView = [
    camera.position.x.toFixed(3),
    camera.position.y.toFixed(3),
    camera.position.z.toFixed(3),
  ].join(',');
  requestFrame();
});

modelOrbitControls.addEventListener('end', () => {
  if (!importedModelRoot) return;
  const replayGrowthAfterOrbit = modelViewDirty
    && !params.liveModelAnalysis
    && params.viewMode !== 3;
  modelOrbiting = false;
  mount.classList.remove('is-orbiting');
  if (modelViewDirty) fieldDirty = true;
  if (replayGrowthAfterOrbit) restartGrowth();
  compositeDirty = true;
  statusEl.textContent = replayGrowthAfterOrbit
    ? '模型角度已同步 · 新笔触正在生长'
    : '模型角度已同步 · 笔触正在定稿';
  requestFrame();
});

const normalDepthMaterial = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  blending: THREE.NoBlending,
  vertexShader: `
    varying vec3 vViewNormal;
    void main() {
      vec4 localPosition = vec4(position, 1.0);
      vec3 localNormal = normal;
      #ifdef USE_INSTANCING
        localPosition = instanceMatrix * localPosition;
        localNormal = mat3(instanceMatrix) * localNormal;
      #endif
      vViewNormal = normalize(normalMatrix * localNormal);
      gl_Position = projectionMatrix * modelViewMatrix * localPosition;
    }
  `,
  fragmentShader: `
    varying vec3 vViewNormal;
    void main() {
      vec3 encodedNormal = normalize(vViewNormal) * 0.5 + 0.5;
      gl_FragColor = vec4(encodedNormal, gl_FragCoord.z);
    }
  `,
});

const semanticMaterials = Object.fromEntries(
  Object.keys(semanticColors).map((id) => [id, new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    blending: THREE.NoBlending,
    uniforms: { uId: { value: Number(id) / 255 } },
    vertexShader: `
      void main() {
        vec4 localPosition = vec4(position, 1.0);
        #ifdef USE_INSTANCING
          localPosition = instanceMatrix * localPosition;
        #endif
        gl_Position = projectionMatrix * modelViewMatrix * localPosition;
      }
    `,
    fragmentShader: `uniform float uId; void main(){gl_FragColor=vec4(uId,0.0,0.0,1.0);}`,
  })]),
);

const overlayScene = new THREE.Scene();
const overlayCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const screenScene = new THREE.Scene();
const screenCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

const strokeVertexShader = `
  attribute vec2 aP0;
  attribute vec2 aP1;
  attribute vec2 aP2;
  attribute vec2 aP3;
  attribute vec3 aColor;
  attribute float aWidth;
  attribute float aSeed;
  attribute vec4 aPrevP01;
  attribute vec4 aPrevP23;
  attribute float aBirth;
  attribute float aDuration;
  attribute float aBrushLayer;
  uniform vec2 uResolution;
  uniform float uStrokeScale;
  uniform float uBrushSize;
  uniform float uGrowthTime;
  uniform float uGrowthEnabled;
  uniform float uSceneMorph;
  uniform vec3 uBrushLayerVisibility;
  varying vec3 vColor;
  varying float vSide;
  varying float vT;
  varying float vSeed;
  varying float vGrowth;
  varying float vFreshness;
  varying float vBrushLayerVisible;
  varying vec2 vTangent;

  vec2 bezier(float t) {
    float s = 1.0 - t;
    vec2 p0 = mix(aPrevP01.xy, aP0, uSceneMorph);
    vec2 p1 = mix(aPrevP01.zw, aP1, uSceneMorph);
    vec2 p2 = mix(aPrevP23.xy, aP2, uSceneMorph);
    vec2 p3 = mix(aPrevP23.zw, aP3, uSceneMorph);
    return s*s*s*p0 + 3.0*s*s*t*p1 + 3.0*s*t*t*p2 + t*t*t*p3;
  }

  void main() {
    float t = position.x;
    float side = position.y;
    vec2 center = bezier(t);
    vec2 before = bezier(max(0.0, t - 0.012));
    vec2 after = bezier(min(1.0, t + 0.012));
    vec2 tangentPx = normalize((after - before) * uResolution);
    vec2 normalPx = vec2(-tangentPx.y, tangentPx.x);
    float pressure = 0.44 + 0.56 * pow(max(0.0, sin(t * 3.14159265)), 0.42);
    float wobble = sin(t * 15.0 + aSeed * 43.0) * 0.032
      + sin(t * 38.0 + aSeed * 19.0) * 0.012;
    vec2 uv = center + normalPx * aWidth * uStrokeScale * uBrushSize * (side * pressure + wobble) / uResolution;
    gl_Position = vec4(uv * 2.0 - 1.0, 0.0, 1.0);
    vColor = aColor;
    vTangent = tangentPx;
    vSide = side;
    vT = t;
    vSeed = aSeed;
    vGrowth = uGrowthEnabled > 0.5
      ? clamp((uGrowthTime - aBirth) / max(0.05, aDuration), 0.0, 1.0)
      : 1.0;
    vBrushLayerVisible = aBrushLayer < 0.5
      ? uBrushLayerVisibility.x
      : (aBrushLayer < 1.5 ? uBrushLayerVisibility.y : uBrushLayerVisibility.z);
    float wetAge = max(0.0, uGrowthTime - aBirth);
    vFreshness = exp(-wetAge * 0.12);
  }
`;

const strokeFragmentShader = `
  uniform float uCoverage;
  uniform float uWetness;
  uniform float uViscosity;
  uniform float uBristleDetail;
  varying vec3 vColor;
  varying float vSide;
  varying float vT;
  varying float vSeed;
  varying float vGrowth;
  varying float vFreshness;
  varying float vBrushLayerVisible;

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    if (vBrushLayerVisible < 0.5) discard;
    if (fract(vSeed * 17.713) > uCoverage) discard;
    if (vT > vGrowth) discard;
    float edge = 1.0 - smoothstep(0.76, 1.0, abs(vSide));
    float tips = smoothstep(0.0, 0.025, vT) * (1.0 - smoothstep(0.95, 1.0, vT));
    float liveTip = 1.0 - smoothstep(max(0.0, vGrowth - 0.08), max(0.001, vGrowth), vT);
    float fibers = 0.5 + 0.5 * sin(
      vSide * (20.0 + uBristleDetail * 9.0) +
      sin(vT * 24.0 + vSeed * 17.0) * 1.7 +
      vSeed * 67.0
    );
    float microFibers = 0.5 + 0.5 * sin(vSide * 61.0 - vT * 9.0 + vSeed * 101.0);
    float splitFibers = smoothstep(0.18, 0.84, fibers);
    float bristle = mix(1.0, 0.86 + splitFibers * 0.12 + microFibers * 0.035, uBristleDetail);
    float pigmentBreak = mix(
      0.955,
      1.0,
      noise(vec2(floor(vT * 72.0) + vSeed * 11.0, floor(vSide * 17.0)))
    );
    float edgePool = pow(1.0 - abs(vSide), 0.52);
    float cohesion = mix(0.84 + splitFibers * 0.16, 1.0, uViscosity);
    float alpha = edge * tips * liveTip * bristle * pigmentBreak * cohesion;
    vec3 pigment = vColor * (0.91 + splitFibers * 0.095 + microFibers * 0.025);
    pigment *= mix(0.94, mix(1.045, 1.12, uViscosity), edgePool);
    pigment += vec3(1.0, 0.82, 0.53) * vFreshness * uWetness * (0.018 + splitFibers * 0.012);
    gl_FragColor = vec4(pigment, alpha);
  }
`;

const heightFragmentShader = `
  uniform float uCoverage;
  uniform float uWetness;
  uniform float uViscosity;
  uniform float uBristleDetail;
  varying vec3 vColor;
  varying float vSide;
  varying float vT;
  varying float vSeed;
  varying float vGrowth;
  varying float vFreshness;
  varying float vBrushLayerVisible;
  void main() {
    if (vBrushLayerVisible < 0.5) discard;
    if (fract(vSeed * 17.713) > uCoverage) discard;
    if (vT > vGrowth) discard;
    float edge = 1.0 - smoothstep(0.72, 1.0, abs(vSide));
    float tips = smoothstep(0.0, 0.025, vT) * (1.0 - smoothstep(0.95, 1.0, vT));
    float liveTip = 1.0 - smoothstep(max(0.0, vGrowth - 0.08), max(0.001, vGrowth), vT);
    float ridgeWave = 0.5 + 0.5 * sin(
      vSide * (20.0 + uBristleDetail * 9.0) + sin(vT * 23.0 + vSeed * 23.0) * 1.7 + vSeed * 67.0
    );
    float microRidge = 0.5 + 0.5 * sin(vSide * 61.0 - vT * 9.0 + vSeed * 101.0);
    float ridges = mix(0.74, 0.52 + pow(ridgeWave, 2.1) * 0.42 + microRidge * 0.08, uBristleDetail);
    float centralLoad = 0.7 + 0.3 * pow(max(0.0, 1.0 - abs(vSide)), 0.48);
    float body = edge * tips * liveTip;
    float height = body * ridges * centralLoad * mix(0.062, 0.108, uViscosity);
    float wet = body * uWetness * (0.62 + vFreshness * 0.38) * (0.038 + ridgeWave * 0.022);
    float furrow = body * (0.018 + ridgeWave * 0.052 + microRidge * 0.012);
    gl_FragColor = vec4(height, wet, furrow, 1.0);
  }
`;

const strokeMaterial = new THREE.ShaderMaterial({
  transparent: true,
  depthTest: false,
  depthWrite: false,
  side: THREE.DoubleSide,
  vertexShader: strokeVertexShader,
  fragmentShader: strokeFragmentShader,
  uniforms: {
    uResolution: { value: new THREE.Vector2(1, 1) },
    uStrokeScale: { value: 1 },
    uBrushSize: { value: params.strokeSize },
    uCoverage: { value: params.coverage },
    uWetness: { value: paintWetness() },
    uViscosity: { value: params.viscosity },
    uBristleDetail: { value: params.bristleDetail },
    uGrowthTime: { value: 0 },
    uGrowthEnabled: { value: 1 },
    uSceneMorph: { value: 1 },
    uBrushLayerVisibility: { value: new THREE.Vector3(1, 1, 1) },
  },
});

const pencilFragmentShader = `
  uniform float uCoverage;
  varying vec3 vColor;
  varying float vSide;
  varying float vT;
  varying float vSeed;
  varying float vGrowth;
  varying float vBrushLayerVisible;

  float graphiteNoise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    if (vBrushLayerVisible < 0.5) discard;
    if (fract(vSeed * 17.713) > uCoverage) discard;
    if (vT > vGrowth) discard;
    float leadWobble = sin(vT * 31.0 + vSeed * 83.0) * 0.11
      + sin(vT * 73.0 + vSeed * 29.0) * 0.035;
    float leadDistance = abs(vSide - leadWobble);
    float core = 1.0 - smoothstep(0.19, 0.54, leadDistance);
    float ghost = (1.0 - smoothstep(0.1, 0.3, abs(vSide + leadWobble * 0.45 - 0.38))) * 0.18;
    float tips = smoothstep(0.0, 0.018, vT) * (1.0 - smoothstep(0.975, 1.0, vT));
    float liveTip = 1.0 - smoothstep(max(0.0, vGrowth - 0.07), max(0.001, vGrowth), vT);
    float grain = graphiteNoise(vec2(floor(vT * 170.0) + vSeed * 31.0, floor(vSide * 23.0)));
    float pressure = 0.58 + 0.42 * pow(max(0.0, sin(vT * 3.14159265)), 0.38);
    float alpha = (core + ghost) * tips * liveTip * pressure * (0.18 + grain * 0.28);
    vec3 graphite = vec3(0.105, 0.098, 0.087) * mix(0.76, 1.13, grain);
    gl_FragColor = vec4(graphite, alpha);
  }
`;

const pencilStrokeMaterial = new THREE.ShaderMaterial({
  transparent: true,
  depthTest: false,
  depthWrite: false,
  side: THREE.DoubleSide,
  vertexShader: strokeVertexShader,
  fragmentShader: pencilFragmentShader,
  uniforms: {
    uResolution: { value: new THREE.Vector2(1, 1) },
    uStrokeScale: { value: 0.34 },
    uBrushSize: { value: params.strokeSize },
    uCoverage: { value: params.coverage },
    uGrowthTime: { value: 0 },
    uGrowthEnabled: { value: 1 },
    uSceneMorph: { value: 1 },
    uBrushLayerVisibility: { value: new THREE.Vector3(1, 1, 1) },
  },
});

const heightMaterial = new THREE.ShaderMaterial({
  transparent: true,
  depthTest: false,
  depthWrite: false,
  side: THREE.DoubleSide,
  blending: THREE.AdditiveBlending,
  vertexShader: strokeVertexShader,
  fragmentShader: heightFragmentShader,
  uniforms: {
    uResolution: { value: new THREE.Vector2(1, 1) },
    uStrokeScale: { value: 1 },
    uBrushSize: { value: params.strokeSize },
    uCoverage: { value: params.coverage },
    uWetness: { value: paintWetness() },
    uViscosity: { value: params.viscosity },
    uBristleDetail: { value: params.bristleDetail },
    uGrowthTime: { value: 0 },
    uGrowthEnabled: { value: 1 },
    uSceneMorph: { value: 1 },
    uBrushLayerVisibility: { value: new THREE.Vector3(1, 1, 1) },
  },
});

const compositeMaterial = new THREE.ShaderMaterial({
  depthTest: false,
  depthWrite: false,
  uniforms: {
    uScene: { value: null },
    uStroke: { value: null },
    uHeight: { value: null },
    uSemantic: { value: null },
    uTexel: { value: new THREE.Vector2(1, 1) },
    uMode: { value: 0 },
    uImpasto: { value: params.impasto },
    uWetness: { value: paintWetness() },
    uLightAngle: { value: 0 },
    uTime: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform sampler2D uScene;
    uniform sampler2D uStroke;
    uniform sampler2D uHeight;
    uniform sampler2D uSemantic;
    uniform vec2 uTexel;
    uniform int uMode;
    uniform float uImpasto;
    uniform float uWetness;
    uniform float uLightAngle;
    uniform float uTime;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    const float PI = 3.14159265359;

    float saturatePaint(float value) {
      return clamp(value, 0.0, 1.0);
    }

    float distributionGGX(float nDotH, float roughness) {
      float alpha = roughness * roughness;
      float alpha2 = alpha * alpha;
      float denominator = nDotH * nDotH * (alpha2 - 1.0) + 1.0;
      return alpha2 / max(PI * denominator * denominator, 0.0001);
    }

    float geometrySmith(float nDotV, float nDotL, float roughness) {
      float r = roughness + 1.0;
      float k = (r * r) * 0.125;
      float ggxV = nDotV / max(nDotV * (1.0 - k) + k, 0.0001);
      float ggxL = nDotL / max(nDotL * (1.0 - k) + k, 0.0001);
      return ggxV * ggxL;
    }

    float wetSpecular(vec3 normal, vec3 lightDirection, float roughness) {
      vec3 viewDirection = vec3(0.0, 0.0, 1.0);
      vec3 halfVector = normalize(lightDirection + viewDirection);
      float nDotV = saturatePaint(dot(normal, viewDirection));
      float nDotL = saturatePaint(dot(normal, lightDirection));
      float nDotH = saturatePaint(dot(normal, halfVector));
      float vDotH = saturatePaint(dot(viewDirection, halfVector));
      float fresnel = 0.045 + (1.0 - 0.045) * pow(1.0 - vDotH, 5.0);
      float specular = distributionGGX(nDotH, roughness) *
        geometrySmith(nDotV, nDotL, roughness) * fresnel;
      return min(3.0, specular / max(4.0 * nDotV * nDotL, 0.001));
    }

    float paintHeight(vec2 uv) {
      return texture2D(uHeight, uv).r;
    }

    vec3 semanticColor(float id) {
      if (id < 0.5) return vec3(0.035, 0.045, 0.065);
      if (id < 1.5) return vec3(0.21, 0.38, 0.68);
      if (id < 2.5) return vec3(0.31, 0.48, 0.42);
      if (id < 3.5) return vec3(0.82, 0.55, 0.19);
      if (id < 4.5) return vec3(0.10, 0.34, 0.25);
      if (id < 5.5) return vec3(0.74, 0.55, 0.34);
      return vec3(0.78, 0.42, 0.23);
    }

    float pencilLuma(vec3 color) {
      return dot(color, vec3(0.2126, 0.7152, 0.0722));
    }

    float pencilNoise(vec2 pixel) {
      float coarse = hash(floor(pixel * 0.47));
      float fine = hash(floor(pixel * 1.31) + 23.7);
      return coarse * 0.58 + fine * 0.42;
    }

    void main() {
      vec3 base = texture2D(uScene, vUv).rgb;
      vec4 stroke = texture2D(uStroke, vUv);
      vec4 paintState = texture2D(uHeight, vUv);
      float height = paintState.r;
      float wet = saturatePaint(paintState.g * 5.0) * saturatePaint(uWetness);
      float furrow = saturatePaint(paintState.b * 11.0);

      if (uMode == 1) {
        vec2 pixel = vUv / uTexel;
        float centerLuma = pencilLuma(base);
        float leftLuma = pencilLuma(texture2D(uScene, vUv - vec2(uTexel.x * 1.6, 0.0)).rgb);
        float rightLuma = pencilLuma(texture2D(uScene, vUv + vec2(uTexel.x * 1.6, 0.0)).rgb);
        float topLuma = pencilLuma(texture2D(uScene, vUv + vec2(0.0, uTexel.y * 1.6)).rgb);
        float bottomLuma = pencilLuma(texture2D(uScene, vUv - vec2(0.0, uTexel.y * 1.6)).rgb);
        float contour = smoothstep(0.018, 0.15, length(vec2(rightLuma - leftLuma, topLuma - bottomLuma)));
        float tone = pow(max(0.0, 1.0 - centerLuma), 1.28);
        float paperGrain = pencilNoise(pixel * 0.58);
        float paperFiber = sin(pixel.x * 0.41 + sin(pixel.y * 0.017) * 2.1)
          * sin(pixel.y * 0.37 + sin(pixel.x * 0.021) * 1.7);
        vec3 paper = vec3(0.925, 0.902, 0.838)
          * (0.972 + paperGrain * 0.034 + paperFiber * 0.008);
        vec3 pencil = stroke.rgb / max(stroke.a, 0.025);
        float pencilAlpha = smoothstep(0.006, 0.62, stroke.a);
        float underdrawing = contour * 0.2 + tone * (0.018 + paperGrain * 0.025);
        vec3 sketch = mix(paper, pencil, clamp(pencilAlpha, 0.0, 0.88));
        sketch = mix(sketch, vec3(0.13, 0.12, 0.105), clamp(underdrawing, 0.0, 0.16));
        gl_FragColor = vec4(sketch, 1.0);
        #include <colorspace_fragment>
        return;
      }
      if (uMode == 2) {
        float id = floor(texture2D(uSemantic, vUv).r * 255.0 + 0.5);
        gl_FragColor = vec4(semanticColor(id), 1.0);
        #include <colorspace_fragment>
        return;
      }
      if (uMode == 3) {
        gl_FragColor = vec4(base, 1.0);
        #include <colorspace_fragment>
        return;
      }
      if (uMode == 4) {
        gl_FragColor = vec4(vec3(pow(height, 0.42)), 1.0);
        return;
      }
      vec2 pixel = vUv / uTexel;
      float canvasGrain = hash(floor(pixel * 0.46));
      float fineGrain = hash(floor(pixel * 1.17) + 17.0);
      float warpFiber = sin(pixel.y * 1.33 + sin(pixel.x * 0.021) * 1.8);
      float weftFiber = sin(pixel.x * 1.21 + sin(pixel.y * 0.018) * 1.6);
      float canvasWeave = warpFiber * weftFiber;
      vec3 canvasBeige = vec3(0.835, 0.775, 0.665);
      canvasBeige *= 0.968 + canvasGrain * 0.028 + fineGrain * 0.014 + canvasWeave * 0.009;
      if (uMode == 5) base = canvasBeige;

      float hTL = paintHeight(vUv + vec2(-uTexel.x, uTexel.y));
      float hT = paintHeight(vUv + vec2(0.0, uTexel.y));
      float hTR = paintHeight(vUv + vec2(uTexel.x, uTexel.y));
      float hL = paintHeight(vUv - vec2(uTexel.x, 0.0));
      float hR = paintHeight(vUv + vec2(uTexel.x, 0.0));
      float hBL = paintHeight(vUv + vec2(-uTexel.x, -uTexel.y));
      float hB = paintHeight(vUv - vec2(0.0, uTexel.y));
      float hBR = paintHeight(vUv + vec2(uTexel.x, -uTexel.y));
      vec2 gradient = vec2(
        hTL + 2.0 * hL + hBL - hTR - 2.0 * hR - hBR,
        hBL + 2.0 * hB + hBR - hTL - 2.0 * hT - hTR
      );
      vec3 paintNormal = normalize(vec3(
        gradient * (4.0 + uImpasto * 6.0),
        mix(1.08, 0.72, saturatePaint(uImpasto))
      ));
      vec3 lightDir = normalize(vec3(cos(uLightAngle), sin(uLightAngle), 0.72));
      float nDotL = saturatePaint(dot(paintNormal, lightDir));
      float diffuse = mix(0.78, 1.16, nDotL);
      float roughness = mix(0.44, 0.11, wet);
      float specular = wetSpecular(paintNormal, lightDir, roughness);
      vec3 halfDir = normalize(lightDir + vec3(0.0, 0.0, 1.0));
      float clearcoat = pow(saturatePaint(dot(paintNormal, halfDir)), mix(5.0, 13.0, wet));

      vec3 pigment = stroke.rgb / max(stroke.a, 0.065);
      pigment = clamp(pigment, vec3(0.0), vec3(1.45));
      float localPeak = max(max(max(hL, hR), max(hT, hB)), height);
      float pooledEdge = saturatePaint((localPeak - height) * 3.8);
      float ridgeCatch = saturatePaint(length(gradient) * 13.0 + pooledEdge * 0.7 + furrow * 0.3);
      pigment *= mix(0.91, 1.13, furrow);
      pigment *= 1.0 - pooledEdge * wet * 0.11;

      float layerOpacity = uMode == 0 ? 0.62 : 1.0;
      vec3 color = mix(base, pigment * diffuse, smoothstep(0.015, 0.78, stroke.a * 1.18) * layerOpacity);
      float paintMask = smoothstep(0.003, 0.055, height + stroke.a * 0.12);
      float grazingSheen = pow(1.0 - saturatePaint(paintNormal.z), 2.0) * wet;
      color += vec3(1.0, 0.9, 0.7) * (
        specular * 0.78 + clearcoat * wet * (0.18 + ridgeCatch * 0.82) + grazingSheen * 0.075
      ) * paintMask * (0.34 + uImpasto * 0.32) * layerOpacity;
      color += vec3(0.58, 0.34, 0.12) * pooledEdge * wet * stroke.a * 0.075 * layerOpacity;
      color -= vec3(0.065, 0.05, 0.032) * saturatePaint(-dot(paintNormal.xy, lightDir.xy)) * height * uImpasto * layerOpacity;
      color *= 0.987 + canvasGrain * 0.017 + fineGrain * 0.008;
      gl_FragColor = vec4(color, 1.0);
      #include <colorspace_fragment>
    }
  `,
});

const screenQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), compositeMaterial);
screenScene.add(screenQuad);

let sceneTarget;
let colorTarget;
let normalTarget;
let semanticTarget;
let strokeTarget;
let heightTarget;
let strokeMesh;
let strokeGeometry;
let analysis = null;
let seeds = [];
let outputWidth = 0;
let outputHeight = 0;
let renderWidth = 0;
let renderHeight = 0;
let analysisWidth = 0;
let analysisHeight = 0;
let currentRenderScale = 1;
let buffers = null;
let fieldDirty = true;
let strokeGeometryDirty = false;
let resizeDirty = true;
let sceneTargetDirty = true;
let lastAnalysisAt = -Infinity;
let lastFrameAt = 0;
let animationFrameId = 0;
let frameAccumulator = 0;
let frameSamples = 0;
let elapsed = 0;
let seedGeneration = 0;
let growthTimeline = 0;
let growthStartTimeline = 0;
let strokeTargetsDirty = true;
let compositeDirty = true;
let growthWasActive = false;
let videoRecording = false;
let lastAnalysisDuration = 0;
let lastReseedDuration = 0;
let strokeMorphActive = false;
let strokeMorphStartedAt = 0;
const GROWTH_DURATION = 5;
const STROKE_MORPH_DURATION = 1800;
const SCENE_TOUR_DWELL = 6200;
const VIDEO_RECORDING_FPS = 30;
const VIDEO_RECORDING_MIN_FPS = 24;
const VIDEO_RECORDING_TIMEOUT = 8000;
const VIDEO_RECORDING_BITRATE = 6_000_000;
const ANALYSIS_INTERVAL = 900;
const MODEL_ANALYSIS_INTERVAL = 180;
const IMAGE_MATTE_SCALE = 0.982;
let canvasZoom = 1;
const canvasPan = new THREE.Vector2(0, 0);
const projectedScratch = new THREE.Vector3();
const STROKE_TRACE_STEPS = 10;
const backwardTraceScratch = new Float32Array(STROKE_TRACE_STEPS * 2);
const forwardTraceScratch = new Float32Array(STROKE_TRACE_STEPS * 2);

function requestFrame() {
  if (animationFrameId) return;
  if (!lastFrameAt) lastFrameAt = performance.now();
  animationFrameId = requestAnimationFrame(animate);
}

const QUALITY_PROFILES = Object.freeze({
  balanced: Object.freeze({ renderScale: 0.7, smallScale: 0.88, analysisEdge: 340, samples: 0 }),
  high: Object.freeze({ renderScale: 1, smallScale: 1, analysisEdge: 460, samples: 4 }),
  ultra: Object.freeze({ renderScale: 1.25, smallScale: 1.18, analysisEdge: 580, samples: 4 }),
});

function makeTarget(width, height, options = {}) {
  const target = new THREE.WebGLRenderTarget(width, height, {
    minFilter: options.nearest ? THREE.NearestFilter : THREE.LinearFilter,
    magFilter: options.nearest ? THREE.NearestFilter : THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
    depthBuffer: options.depth !== false,
    stencilBuffer: false,
  });
  target.samples = renderer.capabilities.isWebGL2 ? (options.samples || 0) : 0;
  target.texture.colorSpace = THREE.NoColorSpace;
  return target;
}

function disposeTargets() {
  [sceneTarget, colorTarget, normalTarget, semanticTarget, strokeTarget, heightTarget].forEach((target) => target?.dispose());
}

function fitCanvasFrameToSource() {
  const stageStyle = getComputedStyle(stageEl);
  const mountStyle = getComputedStyle(mount);
  const availableWidth = Math.max(2, stageEl.clientWidth
    - parseFloat(stageStyle.paddingLeft)
    - parseFloat(stageStyle.paddingRight));
  const availableHeight = Math.max(2, stageEl.clientHeight
    - parseFloat(stageStyle.paddingTop)
    - parseFloat(stageStyle.paddingBottom));
  const borderWidth = parseFloat(mountStyle.borderLeftWidth) + parseFloat(mountStyle.borderRightWidth);
  const borderHeight = parseFloat(mountStyle.borderTopWidth) + parseFloat(mountStyle.borderBottomWidth);
  if (importedModelRoot) {
    const contentWidth = Math.max(2, availableWidth - borderWidth);
    const contentHeight = Math.max(2, availableHeight - borderHeight);
    mount.style.width = `${Math.round(contentWidth + borderWidth)}px`;
    mount.style.height = `${Math.round(contentHeight + borderHeight)}px`;
    document.documentElement.dataset.canvasAspect = (contentWidth / contentHeight).toFixed(4);
    document.documentElement.dataset.canvasFit = 'model-area';
    return;
  }
  const sourceAspect = uploadedImage
    ? uploadedImage.width / Math.max(1, uploadedImage.height)
    : 16 / 10;
  let contentWidth = Math.max(2, availableWidth - borderWidth);
  let contentHeight = contentWidth / sourceAspect;
  if (contentHeight + borderHeight > availableHeight) {
    contentHeight = Math.max(2, availableHeight - borderHeight);
    contentWidth = contentHeight * sourceAspect;
  }
  mount.style.width = `${Math.round(contentWidth + borderWidth)}px`;
  mount.style.height = `${Math.round(contentHeight + borderHeight)}px`;
  document.documentElement.dataset.canvasAspect = sourceAspect.toFixed(4);
  document.documentElement.dataset.canvasFit = 'source-aspect';
}

function resize() {
  if (!resizeDirty && outputWidth > 0 && outputHeight > 0) return false;
  fitCanvasFrameToSource();
  const width = Math.max(2, Math.floor(mount.clientWidth));
  const height = Math.max(2, Math.floor(mount.clientHeight));
  const aspect = width / height;
  const quality = QUALITY_PROFILES[params.qualityMode] || QUALITY_PROFILES.high;
  const renderScale = width * height > 420000 ? quality.renderScale : quality.smallScale;
  const nextRenderWidth = Math.max(2, Math.round(width * renderScale));
  const nextRenderHeight = Math.max(2, Math.round(height * renderScale));
  let nextAnalysisWidth;
  let nextAnalysisHeight;
  if (aspect >= 1) {
    nextAnalysisWidth = Math.min(quality.analysisEdge, Math.max(300, Math.round(width * 0.46)));
    nextAnalysisHeight = Math.max(144, Math.round(nextAnalysisWidth / aspect));
  } else {
    nextAnalysisHeight = Math.min(quality.analysisEdge, Math.max(300, Math.round(height * 0.4)));
    nextAnalysisWidth = Math.max(144, Math.round(nextAnalysisHeight * aspect));
  }
  const targetSamples = renderer.capabilities.isWebGL2 ? quality.samples : 0;
  const dimensionsUnchanged = Boolean(
    sceneTarget
    && outputWidth === width
    && outputHeight === height
    && renderWidth === nextRenderWidth
    && renderHeight === nextRenderHeight
    && analysisWidth === nextAnalysisWidth
    && analysisHeight === nextAnalysisHeight
    && sceneTarget.samples === targetSamples
    && strokeTarget?.samples === targetSamples
    && heightTarget?.samples === targetSamples,
  );
  resizeDirty = false;
  if (dimensionsUnchanged) return false;

  outputWidth = width;
  outputHeight = height;
  currentRenderScale = renderScale;
  renderWidth = nextRenderWidth;
  renderHeight = nextRenderHeight;
  analysisWidth = nextAnalysisWidth;
  analysisHeight = nextAnalysisHeight;
  renderer.setSize(renderWidth, renderHeight, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  disposeTargets();

  sceneTarget = makeTarget(renderWidth, renderHeight, { samples: quality.samples });
  colorTarget = makeTarget(analysisWidth, analysisHeight);
  normalTarget = makeTarget(analysisWidth, analysisHeight, { nearest: true });
  semanticTarget = makeTarget(analysisWidth, analysisHeight, { nearest: true });
  strokeTarget = makeTarget(renderWidth, renderHeight, { depth: false, samples: quality.samples });
  heightTarget = makeTarget(renderWidth, renderHeight, { depth: false, samples: quality.samples });
  buffers = {
    color: new Uint8Array(analysisWidth * analysisHeight * 4),
    normalDepth: new Uint8Array(analysisWidth * analysisHeight * 4),
    semantic: new Uint8Array(analysisWidth * analysisHeight * 4),
  };

  compositeMaterial.uniforms.uScene.value = sceneTarget.texture;
  compositeMaterial.uniforms.uStroke.value = strokeTarget.texture;
  compositeMaterial.uniforms.uHeight.value = heightTarget.texture;
  compositeMaterial.uniforms.uSemantic.value = semanticTarget.texture;
  compositeMaterial.uniforms.uTexel.value.set(1 / renderWidth, 1 / renderHeight);
  strokeMaterial.uniforms.uResolution.value.set(renderWidth, renderHeight);
  strokeMaterial.uniforms.uStrokeScale.value = (renderWidth / outputWidth) * 1.12;
  pencilStrokeMaterial.uniforms.uResolution.value.set(renderWidth, renderHeight);
  pencilStrokeMaterial.uniforms.uStrokeScale.value = (renderWidth / outputWidth) * 0.34;
  heightMaterial.uniforms.uResolution.value.set(renderWidth, renderHeight);
  heightMaterial.uniforms.uStrokeScale.value = (renderWidth / outputWidth) * 1.12;
  gbufferSizeEl.textContent = `${analysisWidth} × ${analysisHeight}`;
  rendererNameEl.textContent = `${renderer.capabilities.isWebGL2 ? 'WebGL2' : 'WebGL'} · ${params.qualityMode} · ${Math.round(renderScale * 100)}%`;
  document.documentElement.dataset.outputSize = `${outputWidth}x${outputHeight}`;
  document.documentElement.dataset.renderSize = `${renderWidth}x${renderHeight}`;
  document.documentElement.dataset.sceneTargetSize = `${sceneTarget.width}x${sceneTarget.height}`;
  fieldDirty = true;
  sceneTargetDirty = true;
  seeds = [];
  return true;
}

function fitUploadedQuad(target, image = uploadedImage) {
  const targetAspect = target.width / Math.max(1, target.height);
  const imageAspect = image.width / Math.max(1, image.height);
  if (imageAspect >= targetAspect) {
    uploadedMaterial.uniforms.uScale.value.set(1, targetAspect / imageAspect);
  } else {
    uploadedMaterial.uniforms.uScale.value.set(imageAspect / targetAspect, 1);
  }
  uploadedMaterial.uniforms.uScale.value.multiplyScalar(IMAGE_MATTE_SCALE);
}

function renderUploadedTo(target, pass = 0, image = uploadedImage, texture = uploadedTexture) {
  fitUploadedQuad(target, image);
  uploadedMaterial.uniforms.uImage.value = texture;
  uploadedMaterial.uniforms.uPass.value = pass;
  renderer.setRenderTarget(target);
  renderer.setViewport(0, 0, target.width, target.height);
  if (pass === 1) renderer.setClearColor(0x000000, 1);
  else if (pass === 2) renderer.setClearColor(0x8080ff, 1);
  else renderer.setClearColor(0xe5dac5, 1);
  renderer.clear(true, true, true);
  renderer.render(uploadedScene, uploadedCamera);
}

function renderSceneTo(target) {
  if (uploadedImage) {
    renderUploadedTo(target, 0, uploadedImage, uploadedTexture);
    return;
  }
  renderer.setRenderTarget(target);
  renderer.setClearColor(importedModelRoot ? 0xd8d4ca : 0x0b1322, 1);
  renderer.clear(true, true, true);
  renderer.render(scene, camera);
}

function renderSemanticPass() {
  const originals = [];
  sceneObjects.forEach((object) => {
    originals.push([object, object.material]);
    object.material = semanticMaterials[object.userData.semantic] || semanticMaterials[SEMANTIC.SKY];
  });
  renderer.setRenderTarget(semanticTarget);
  renderer.setClearColor(0x000000, 1);
  renderer.clear(true, true, true);
  renderer.render(scene, camera);
  originals.forEach(([object, material]) => { object.material = material; });
}

function captureGBuffer() {
  if (uploadedImage) {
    renderUploadedTo(colorTarget, 0, uploadedImage, uploadedTexture);
    renderUploadedTo(normalTarget, 2, uploadedImage, uploadedTexture);
    renderUploadedTo(semanticTarget, 1, uploadedImage, uploadedTexture);
  } else {
    renderSceneTo(colorTarget);

    scene.overrideMaterial = normalDepthMaterial;
    renderer.setRenderTarget(normalTarget);
    renderer.setClearColor(0x8080ff, 1);
    renderer.clear(true, true, true);
    renderer.render(scene, camera);
    scene.overrideMaterial = null;

    renderSemanticPass();
  }
  renderer.readRenderTargetPixels(colorTarget, 0, 0, analysisWidth, analysisHeight, buffers.color);
  renderer.readRenderTargetPixels(normalTarget, 0, 0, analysisWidth, analysisHeight, buffers.normalDepth);
  renderer.readRenderTargetPixels(semanticTarget, 0, 0, analysisWidth, analysisHeight, buffers.semantic);
}

function semanticAt(x, y) {
  const ix = Math.max(0, Math.min(analysisWidth - 1, Math.round(x)));
  const iy = Math.max(0, Math.min(analysisHeight - 1, Math.round(y)));
  return Math.round(buffers.semantic[(iy * analysisWidth + ix) * 4] || 0);
}

function depthAt(x, y) {
  const ix = Math.max(0, Math.min(analysisWidth - 1, Math.round(x)));
  const iy = Math.max(0, Math.min(analysisHeight - 1, Math.round(y)));
  return buffers.normalDepth[(iy * analysisWidth + ix) * 4 + 3] / 255;
}

function hash(value) {
  return fract(Math.sin(value * 91.173 + 17.371) * 43758.5453);
}

function fract(value) {
  return value - Math.floor(value);
}

function lineBlend3(angleA, weightA, angleB, weightB, angleC, weightC) {
  const x = Math.cos(angleA * 2) * weightA
    + Math.cos(angleB * 2) * weightB
    + Math.cos(angleC * 2) * weightC;
  const y = Math.sin(angleA * 2) * weightA
    + Math.sin(angleB * 2) * weightB
    + Math.sin(angleC * 2) * weightC;
  return Math.atan2(y, x) * 0.5;
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function buildDirectionField() {
  const count = analysisWidth * analysisHeight;
  const luminance = new Float32Array(count);
  const gx = new Float32Array(count);
  const gy = new Float32Array(count);
  const depthGx = new Float32Array(count);
  const depthGy = new Float32Array(count);
  const angle = new Float32Array(count);
  const confidence = new Float32Array(count);
  const imageMode = Boolean(uploadedImage);

  for (let i = 0; i < count; i += 1) {
    const offset = i * 4;
    luminance[i] = (
      buffers.color[offset] * 0.2126
      + buffers.color[offset + 1] * 0.7152
      + buffers.color[offset + 2] * 0.0722
    ) / 255;
  }

  const sample = (array, x, y) => array[
    Math.max(0, Math.min(analysisHeight - 1, y)) * analysisWidth
    + Math.max(0, Math.min(analysisWidth - 1, x))
  ];

  for (let y = 0; y < analysisHeight; y += 1) {
    for (let x = 0; x < analysisWidth; x += 1) {
      const i = y * analysisWidth + x;
      gx[i] = sample(luminance, x + 1, y) - sample(luminance, x - 1, y);
      gy[i] = sample(luminance, x, y + 1) - sample(luminance, x, y - 1);
      depthGx[i] = depthAt(x + 1, y) - depthAt(x - 1, y);
      depthGy[i] = depthAt(x, y + 1) - depthAt(x, y - 1);
    }
  }

  const tensorXX = new Float32Array(count);
  const tensorYY = new Float32Array(count);
  const tensorXY = new Float32Array(count);
  for (let i = 0; i < count; i += 1) {
    tensorXX[i] = gx[i] * gx[i];
    tensorYY[i] = gy[i] * gy[i];
    tensorXY[i] = gx[i] * gy[i];
  }

  const integralStride = analysisWidth + 1;
  const buildIntegral = (source) => {
    const integral = new Float32Array((analysisWidth + 1) * (analysisHeight + 1));
    for (let y = 0; y < analysisHeight; y += 1) {
      let rowSum = 0;
      for (let x = 0; x < analysisWidth; x += 1) {
        rowSum += source[y * analysisWidth + x];
        integral[(y + 1) * integralStride + x + 1] = integral[y * integralStride + x + 1] + rowSum;
      }
    }
    return integral;
  };
  const integralXX = buildIntegral(tensorXX);
  const integralYY = buildIntegral(tensorYY);
  const integralXY = buildIntegral(tensorXY);
  const tensorRadius = 2;
  const boxSum = (integral, x0, y0, x1, y1) => (
    integral[y1 * integralStride + x1]
    - integral[y0 * integralStride + x1]
    - integral[y1 * integralStride + x0]
    + integral[y0 * integralStride + x0]
  );

  for (let y = 0; y < analysisHeight; y += 1) {
    for (let x = 0; x < analysisWidth; x += 1) {
      const i = y * analysisWidth + x;
      const x0 = Math.max(0, x - tensorRadius);
      const y0 = Math.max(0, y - tensorRadius);
      const x1 = Math.min(analysisWidth, x + tensorRadius + 1);
      const y1 = Math.min(analysisHeight, y + tensorRadius + 1);
      const jxx = boxSum(integralXX, x0, y0, x1, y1);
      const jyy = boxSum(integralYY, x0, y0, x1, y1);
      const jxy = boxSum(integralXY, x0, y0, x1, y1);
      const trace = jxx + jyy;
      const discriminant = Math.sqrt(Math.max(0, (jxx - jyy) ** 2 + 4 * jxy * jxy));
      const imageConfidence = Math.min(1, discriminant / (trace + 0.0008));
      const imageAngle = 0.5 * Math.atan2(2 * jxy, jxx - jyy) + Math.PI * 0.5;

      const offset = i * 4;
      const semantic = semanticAt(x, y);
      if (!semantic) {
        angle[i] = 0;
        confidence[i] = 0;
        continue;
      }
      const normalX = buffers.normalDepth[offset] / 127.5 - 1;
      const normalY = buffers.normalDepth[offset + 1] / 127.5 - 1;
      const normalAngle = Math.atan2(normalX, -normalY);
      const depthAngle = Math.atan2(depthGx[i], -depthGy[i]);
      const geometryAngle = lineBlend3(
        normalAngle,
        0.55,
        depthAngle,
        Math.min(0.9, Math.hypot(depthGx[i], depthGy[i]) * 80),
        0,
        0,
      );

      const nx = x / Math.max(1, analysisWidth - 1);
      const ny = y / Math.max(1, analysisHeight - 1);
      let semanticAngle = 0;
      if (imageMode) {
        const contourAngle = imageAngle + Math.sin(nx * 17 + ny * 23) * 0.075;
        const artisticAngle = Math.atan2((ny - 0.5) * 1.18, nx - 0.5)
          + Math.PI * 0.5
          + Math.sin(nx * 13 - ny * 9) * 0.12;
        angle[i] = lineBlend3(
          imageAngle,
          params.structure * (0.35 + imageConfidence * 1.15),
          contourAngle,
          params.geometry * (0.12 + imageConfidence * 0.72),
          artisticAngle,
          params.semantic * (0.08 + (1 - imageConfidence) * 0.34),
        );
        confidence[i] = Math.min(1, 0.18 + imageConfidence * 0.72);
      } else if (semantic === SEMANTIC.SKY) {
        const dx = nx - 0.31;
        const dy = (ny - 0.59) * 1.25;
        semanticAngle = Math.atan2(dy, dx) + Math.PI * 0.5 + Math.sin(nx * 14 + ny * 9) * 0.13;
      } else if (semantic === SEMANTIC.MOUNTAIN) {
        semanticAngle = (nx < 0.5 ? 0.56 : Math.PI - 0.56) + Math.sin(ny * 13) * 0.11;
      } else if (semantic === SEMANTIC.GROUND) {
        semanticAngle = Math.atan2(ny - 0.54, nx - 0.53) + Math.sin(nx * 18 - ny * 8) * 0.08;
      } else if (semantic === SEMANTIC.VEGETATION) {
        semanticAngle = Math.PI * 0.5 + Math.sin(ny * 18 + nx * 9) * 0.26;
      } else if (semantic === SEMANTIC.BUILDING) {
        semanticAngle = imageConfidence > 0.28 ? imageAngle : (hash(Math.floor(nx * 28) + Math.floor(ny * 22) * 5) > 0.52 ? 0 : Math.PI * 0.5);
      } else if (semantic === SEMANTIC.IMAGE) {
        semanticAngle = lineBlend3(imageAngle, 0.62, geometryAngle, 0.92, 0, 0);
      }

      if (!imageMode) {
        angle[i] = lineBlend3(
          imageAngle,
          params.structure * (0.18 + imageConfidence * 0.82),
          geometryAngle,
          params.geometry,
          semanticAngle,
          params.semantic,
        );
        confidence[i] = Math.min(1, 0.24 + imageConfidence * 0.52 + Math.hypot(depthGx[i], depthGy[i]) * 12);
      }
    }
  }

  analysis = {
    angle,
    confidence,
    luminance,
  };
}

function poissonLayer(layer, target, minDistance, accepted) {
  const cellSize = minDistance / Math.SQRT2;
  const cols = Math.ceil(analysisWidth / cellSize);
  const rows = Math.ceil(analysisHeight / cellSize);
  const grid = new Int32Array(cols * rows).fill(-1);
  const local = [];
  const maxAttempts = target * 34;
  const generationOffset = seedGeneration * 104729 + layer * 9176;

  for (let attempt = 0; attempt < maxAttempts && local.length < target; attempt += 1) {
    const index = attempt + generationOffset + 1;
    const x = fract(0.5 + index * 0.754877666) * analysisWidth;
    const y = fract(0.5 + index * 0.569840296) * analysisHeight;
    const semantic = semanticAt(x, y);
    if (!semantic || depthAt(x, y) >= 0.999) continue;
    const fieldIndex = Math.min(analysis.angle.length - 1, Math.floor(y) * analysisWidth + Math.floor(x));
    const confidence = analysis.confidence[fieldIndex];
    const semanticDensity = semantic === SEMANTIC.VEGETATION ? 1 : semantic === SEMANTIC.BUILDING ? 0.72 : 0.88;
    if (hash(index * 2.13) > semanticDensity * (0.64 + confidence * 0.36)) continue;

    const gx = Math.floor(x / cellSize);
    const gy = Math.floor(y / cellSize);
    let valid = true;
    for (let oy = -2; oy <= 2 && valid; oy += 1) {
      for (let ox = -2; ox <= 2; ox += 1) {
        const cx = gx + ox;
        const cy = gy + oy;
        if (cx < 0 || cy < 0 || cx >= cols || cy >= rows) continue;
        const neighborIndex = grid[cy * cols + cx];
        if (neighborIndex < 0) continue;
        const neighbor = local[neighborIndex];
        if (Math.hypot(neighbor.x - x, neighbor.y - y) < minDistance) {
          valid = false;
          break;
        }
      }
    }
    if (!valid) continue;

    const depth = depthAt(x, y);
    const world = new THREE.Vector3(
      (x / analysisWidth) * 2 - 1,
      (y / analysisHeight) * 2 - 1,
      depth * 2 - 1,
    ).unproject(camera);
    const seed = {
      x,
      y,
      world,
      semantic,
      layer,
      depth,
      random: hash(index * 7.31 + layer * 13.7),
    };
    grid[gy * cols + gx] = local.length;
    local.push(seed);
    accepted.push(seed);
  }
}

function generatePersistentSeeds(options = {}) {
  const preservedGrowthTime = options.preserveGrowth ? currentGrowthTime() : 0;
  const nextSeeds = [];
  const desiredCount = Math.max(3000, Math.min(24000, Math.round(params.strokeCountK * 1000)));
  const coarseCount = Math.round(desiredCount * 0.06);
  const mediumCount = Math.round(desiredCount * 0.225);
  const fineCount = desiredCount - coarseCount - mediumCount;
  const analysisScale = Math.sqrt((analysisWidth * analysisHeight) / (312 * 460));
  const densityScale = Math.sqrt(14000 / desiredCount);
  const distanceScale = analysisScale * densityScale;
  const layerPlan = [
    [0, coarseCount, 5.8 * distanceScale],
    [1, mediumCount, 2.75 * distanceScale],
    [2, fineCount, 1.2 * distanceScale],
  ];
  layerPlan.forEach(([layer, target, distance]) => {
    poissonLayer(layer, target, distance, nextSeeds);
  });
  seeds = nextSeeds;
  seeds.forEach((seed) => { seed.color = paletteColor(seed, seed.x, seed.y); });
  seedGeneration += 1;
  growthStartTimeline = growthTimeline - preservedGrowthTime * 1000;
  strokeTargetsDirty = true;
  seedChurnEl.textContent = '0.0%';
  strokeCountEl.textContent = `${seeds.length.toLocaleString()} 笔触`;
  const countOutput = document.querySelector('[data-output="strokeCountK"]');
  if (countOutput) countOutput.textContent = seeds.length.toLocaleString();
}

function sampleAngle(x, y) {
  const ix = Math.max(0, Math.min(analysisWidth - 1, Math.round(x)));
  const iy = Math.max(0, Math.min(analysisHeight - 1, Math.round(y)));
  return analysis.angle[iy * analysisWidth + ix];
}

function referenceColorDistance(x0, y0, x1, y1) {
  const first = colorPixelOffset(x0, y0);
  const second = colorPixelOffset(x1, y1);
  const dr = (buffers.color[first] - buffers.color[second]) / 255;
  const dg = (buffers.color[first + 1] - buffers.color[second + 1]) / 255;
  const db = (buffers.color[first + 2] - buffers.color[second + 2]) / 255;
  return Math.sqrt(dr * dr * 0.24 + dg * dg * 0.56 + db * db * 0.2);
}

function traceInto(seed, x, y, sign, distance, steps, target) {
  const startDepth = depthAt(x, y);
  let px = x;
  let py = y;
  let previousX = 0;
  let previousY = 0;
  let count = 0;
  const stepLength = distance / steps;
  for (let step = 0; step < steps; step += 1) {
    let direction = sampleAngle(px, py);
    let dx = Math.cos(direction) * sign;
    let dy = Math.sin(direction) * sign;
    if (step > 0 && dx * previousX + dy * previousY < 0) {
      dx *= -1;
      dy *= -1;
    }
    const mx = px + dx * stepLength * 0.5;
    const my = py + dy * stepLength * 0.5;
    direction = sampleAngle(mx, my);
    let ndx = Math.cos(direction) * sign;
    let ndy = Math.sin(direction) * sign;
    if (ndx * dx + ndy * dy < 0) {
      ndx *= -1;
      ndy *= -1;
    }
    const nx = px + ndx * stepLength;
    const ny = py + ndy * stepLength;
    if (nx < 1 || ny < 1 || nx >= analysisWidth - 1 || ny >= analysisHeight - 1) break;
    if (semanticAt(nx, ny) !== seed.semantic || Math.abs(depthAt(nx, ny) - startDepth) > 0.075) break;
    if ((uploadedImage || importedModelRoot) && referenceColorDistance(x, y, nx, ny) > 0.31) break;
    px = nx;
    py = ny;
    previousX = ndx;
    previousY = ndy;
    target[count * 2] = px;
    target[count * 2 + 1] = py;
    count += 1;
  }
  return count;
}

function colorPixelOffset(x, y) {
  const px = Math.max(0, Math.min(analysisWidth - 1, Math.round(x)));
  const py = Math.max(0, Math.min(analysisHeight - 1, Math.round(y)));
  return (py * analysisWidth + px) * 4;
}

function paletteColor(seed, x, y) {
  const offset = colorPixelOffset(x, y);
  if (uploadedImage || importedModelRoot) {
    const radius = [3.2, 1.45, 0.45][seed.layer];
    const leftOffset = colorPixelOffset(x - radius, y);
    const rightOffset = colorPixelOffset(x + radius, y);
    const bottomOffset = colorPixelOffset(x, y - radius);
    const topOffset = colorPixelOffset(x, y + radius);
    const red = (
      buffers.color[offset] + buffers.color[leftOffset] + buffers.color[rightOffset]
      + buffers.color[bottomOffset] + buffers.color[topOffset]
    ) / 1275;
    const green = (
      buffers.color[offset + 1] + buffers.color[leftOffset + 1] + buffers.color[rightOffset + 1]
      + buffers.color[bottomOffset + 1] + buffers.color[topOffset + 1]
    ) / 1275;
    const blue = (
      buffers.color[offset + 2] + buffers.color[leftOffset + 2] + buffers.color[rightOffset + 2]
      + buffers.color[bottomOffset + 2] + buffers.color[topOffset + 2]
    ) / 1275;
    const color = new THREE.Color(red, green, blue);
    color.offsetHSL((seed.random - 0.5) * 0.018, 0.035 + seed.layer * 0.018, (seed.random - 0.5) * 0.055);
    return color;
  }

  const palette = palettes[seed.semantic] || palettes[SEMANTIC.SKY];
  const luma = (
    buffers.color[offset] * 0.2126
    + buffers.color[offset + 1] * 0.7152
    + buffers.color[offset + 2] * 0.0722
  ) / 255;
  const choice = Math.max(0, Math.min(palette.length - 1, Math.floor(luma * palette.length + (seed.random - 0.5) * 1.5)));
  return new THREE.Color(palette[choice]);
}

function createStrokeBaseGeometry() {
  const segments = 8;
  const vertices = [];
  const indices = [];
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    vertices.push(t, -1, 0, t, 1, 0);
  }
  for (let i = 0; i < segments; i += 1) {
    const a = i * 2;
    indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const geometry = new THREE.InstancedBufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  return geometry;
}

function ensureStrokeGeometry(count) {
  if (strokeGeometry?.userData.capacity === count) return;
  strokeGeometry?.dispose();
  if (strokeMesh) overlayScene.remove(strokeMesh);
  strokeGeometry = createStrokeBaseGeometry();
  strokeGeometry.userData.capacity = count;
  const dynamic = (length, size) => {
    const attribute = new THREE.InstancedBufferAttribute(new Float32Array(length), size);
    attribute.setUsage(THREE.DynamicDrawUsage);
    return attribute;
  };
  strokeGeometry.setAttribute('aP0', dynamic(count * 2, 2));
  strokeGeometry.setAttribute('aP1', dynamic(count * 2, 2));
  strokeGeometry.setAttribute('aP2', dynamic(count * 2, 2));
  strokeGeometry.setAttribute('aP3', dynamic(count * 2, 2));
  strokeGeometry.setAttribute('aColor', dynamic(count * 3, 3));
  strokeGeometry.setAttribute('aWidth', dynamic(count, 1));
  strokeGeometry.setAttribute('aSeed', dynamic(count, 1));
  strokeGeometry.setAttribute('aPrevP01', dynamic(count * 4, 4));
  strokeGeometry.setAttribute('aPrevP23', dynamic(count * 4, 4));
  strokeGeometry.setAttribute('aBirth', dynamic(count, 1));
  strokeGeometry.setAttribute('aDuration', dynamic(count, 1));
  strokeGeometry.setAttribute('aBrushLayer', dynamic(count, 1));
  strokeGeometry.instanceCount = count;
  strokeMesh = new THREE.Mesh(strokeGeometry, strokeMaterial);
  strokeMesh.frustumCulled = false;
  overlayScene.add(strokeMesh);
}

const STROKE_MORPH_POINT_ATTRIBUTES = Object.freeze(['aP0', 'aP1', 'aP2', 'aP3']);

function setStrokeMorphProgress(value) {
  const progress = THREE.MathUtils.clamp(value, 0, 1);
  [strokeMaterial, pencilStrokeMaterial, heightMaterial].forEach((material) => {
    material.uniforms.uSceneMorph.value = progress;
  });
  document.documentElement.dataset.strokeMorphProgress = progress.toFixed(3);
}

function captureStrokeMorphSnapshot() {
  if (!strokeGeometry || strokeGeometry.instanceCount < 1) return null;
  const progress = strokeMaterial.uniforms.uSceneMorph.value;
  const previousP01 = strokeGeometry.getAttribute('aPrevP01').array;
  const previousP23 = strokeGeometry.getAttribute('aPrevP23').array;
  const attributes = {};
  STROKE_MORPH_POINT_ATTRIBUTES.forEach((currentName, pointIndex) => {
    const current = strokeGeometry.getAttribute(currentName).array;
    const snapshot = new Float32Array(current.length);
    if (strokeMorphActive && progress < 0.999) {
      const previous = pointIndex < 2 ? previousP01 : previousP23;
      const packedOffset = pointIndex % 2 === 0 ? 0 : 2;
      for (let index = 0; index < strokeGeometry.instanceCount; index += 1) {
        const currentOffset = index * 2;
        const previousOffset = index * 4 + packedOffset;
        snapshot[currentOffset] = THREE.MathUtils.lerp(previous[previousOffset], current[currentOffset], progress);
        snapshot[currentOffset + 1] = THREE.MathUtils.lerp(previous[previousOffset + 1], current[currentOffset + 1], progress);
      }
    } else {
      snapshot.set(current);
    }
    attributes[currentName] = snapshot;
  });
  return { count: strokeGeometry.instanceCount, attributes };
}

function beginStrokeMorph(snapshot) {
  if (!snapshot || !strokeGeometry || !snapshot.count) return false;
  const count = strokeGeometry.instanceCount;
  const previousP01 = strokeGeometry.getAttribute('aPrevP01');
  const previousP23 = strokeGeometry.getAttribute('aPrevP23');
  const p01 = previousP01.array;
  const p23 = previousP23.array;
  for (let index = 0; index < count; index += 1) {
    const sourceIndex = Math.min(snapshot.count - 1, Math.floor(index * snapshot.count / count));
    const sourceOffset = sourceIndex * 2;
    const targetOffset = index * 4;
    p01[targetOffset] = snapshot.attributes.aP0[sourceOffset];
    p01[targetOffset + 1] = snapshot.attributes.aP0[sourceOffset + 1];
    p01[targetOffset + 2] = snapshot.attributes.aP1[sourceOffset];
    p01[targetOffset + 3] = snapshot.attributes.aP1[sourceOffset + 1];
    p23[targetOffset] = snapshot.attributes.aP2[sourceOffset];
    p23[targetOffset + 1] = snapshot.attributes.aP2[sourceOffset + 1];
    p23[targetOffset + 2] = snapshot.attributes.aP3[sourceOffset];
    p23[targetOffset + 3] = snapshot.attributes.aP3[sourceOffset + 1];
  }
  previousP01.needsUpdate = true;
  previousP23.needsUpdate = true;
  params.growthPlayback = false;
  growthWasActive = false;
  strokeMorphActive = true;
  strokeMorphStartedAt = performance.now();
  setStrokeMorphProgress(0);
  updateGrowthControls(GROWTH_DURATION);
  document.documentElement.dataset.strokeMorphState = 'morphing';
  statusEl.textContent = '作品切换中 · 笔触正在变形';
  publishFlowState();
  strokeTargetsDirty = true;
  compositeDirty = true;
  requestFrame();
  return true;
}

function updateStrokeMorph(time) {
  if (!strokeMorphActive) return false;
  const linear = THREE.MathUtils.clamp((time - strokeMorphStartedAt) / STROKE_MORPH_DURATION, 0, 1);
  const eased = linear * linear * (3 - 2 * linear);
  setStrokeMorphProgress(eased);
  strokeTargetsDirty = true;
  compositeDirty = true;
  if (linear >= 1) {
    strokeMorphActive = false;
    document.documentElement.dataset.strokeMorphState = 'idle';
    statusEl.textContent = '作品切换完成 · 笔触身份已稳定';
    publishFlowState();
  }
  return strokeMorphActive;
}

function rebuildStrokeGeometry() {
  const geometryStarted = performance.now();
  const count = seeds.length;
  ensureStrokeGeometry(count);
  const p0 = strokeGeometry.getAttribute('aP0').array;
  const p1 = strokeGeometry.getAttribute('aP1').array;
  const p2 = strokeGeometry.getAttribute('aP2').array;
  const p3 = strokeGeometry.getAttribute('aP3').array;
  const colors = strokeGeometry.getAttribute('aColor').array;
  const widths = strokeGeometry.getAttribute('aWidth').array;
  const randoms = strokeGeometry.getAttribute('aSeed').array;
  const births = strokeGeometry.getAttribute('aBirth').array;
  const durations = strokeGeometry.getAttribute('aDuration').array;
  const brushLayers = strokeGeometry.getAttribute('aBrushLayer').array;
  let visible = 0;

  for (let index = 0; index < count; index += 1) {
    const seed = seeds[index];
    const projected = projectedScratch.copy(seed.world).project(camera);
    const x = (projected.x * 0.5 + 0.5) * analysisWidth;
    const y = (projected.y * 0.5 + 0.5) * analysisHeight;
    const currentlyVisible = projected.z > -1 && projected.z < 1
      && x >= 1 && y >= 1 && x < analysisWidth - 1 && y < analysisHeight - 1
      && semanticAt(x, y) === seed.semantic;
    const baseLength = [25, 14, 7.4][seed.layer]
      * params.length
      * (0.82 + seed.random * 0.36);
    const backwardCount = currentlyVisible
      ? traceInto(seed, x, y, -1, baseLength * 0.5, STROKE_TRACE_STEPS, backwardTraceScratch)
      : 0;
    const forwardCount = currentlyVisible
      ? traceInto(seed, x, y, 1, baseLength * 0.5, STROKE_TRACE_STEPS, forwardTraceScratch)
      : 0;
    const backwardEndOffset = Math.max(0, backwardCount - 1) * 2;
    const backwardMidOffset = Math.floor(backwardCount * 0.48) * 2;
    const forwardMidOffset = Math.floor(forwardCount * 0.48) * 2;
    const forwardEndOffset = Math.max(0, forwardCount - 1) * 2;
    const pointOffset = index * 2;
    p0[pointOffset] = (backwardCount ? backwardTraceScratch[backwardEndOffset] : x) / analysisWidth;
    p0[pointOffset + 1] = (backwardCount ? backwardTraceScratch[backwardEndOffset + 1] : y) / analysisHeight;
    p1[pointOffset] = (backwardCount ? backwardTraceScratch[backwardMidOffset] : x) / analysisWidth;
    p1[pointOffset + 1] = (backwardCount ? backwardTraceScratch[backwardMidOffset + 1] : y) / analysisHeight;
    p2[pointOffset] = (forwardCount ? forwardTraceScratch[forwardMidOffset] : x) / analysisWidth;
    p2[pointOffset + 1] = (forwardCount ? forwardTraceScratch[forwardMidOffset + 1] : y) / analysisHeight;
    p3[pointOffset] = (forwardCount ? forwardTraceScratch[forwardEndOffset] : x) / analysisWidth;
    p3[pointOffset + 1] = (forwardCount ? forwardTraceScratch[forwardEndOffset + 1] : y) / analysisHeight;
    const color = seed.color || paletteColor(seed, x, y);
    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
    widths[index] = currentlyVisible
      ? [11.5, 6.0, 3.15][seed.layer] * (0.82 + seed.random * 0.36)
      : 0;
    randoms[index] = seed.random + index * 0.00013;
    brushLayers[index] = seed.layer;
    if (seed.layer === 2) {
      const fineBirthRandom = hash(seed.x * 0.137 + seed.y * 0.193 + seed.random * 17.1);
      births[index] = 0.72 + fineBirthRandom * 1.85;
      durations[index] = 0.22 + seed.random * 0.18;
    } else {
      births[index] = [0, 0.72][seed.layer] + seed.random * [0.7, 1.2][seed.layer];
      durations[index] = [1.2, 0.9][seed.layer] * (0.82 + seed.random * 0.36);
    }
    if (currentlyVisible) visible += 1;
  }

  ['aP0', 'aP1', 'aP2', 'aP3', 'aColor', 'aWidth', 'aSeed', 'aBirth', 'aDuration', 'aBrushLayer']
    .forEach((name) => { strokeGeometry.getAttribute(name).needsUpdate = true; });
  strokeTargetsDirty = true;
  strokeGeometryDirty = false;
  const geometryDuration = performance.now() - geometryStarted;
  document.documentElement.dataset.strokeGeometryMs = geometryDuration.toFixed(2);
  seedChurnEl.textContent = `${((1 - visible / Math.max(1, count)) * 100).toFixed(1)}% occluded`;
}

function updateAnalysis(reseed = false) {
  const analysisStarted = performance.now();
  captureGBuffer();
  buildDirectionField();
  const refreshModelSeeds = Boolean(importedModelRoot && modelViewDirty && seeds.length > 0);
  if (reseed || seeds.length === 0 || refreshModelSeeds) {
    generatePersistentSeeds({ preserveGrowth: refreshModelSeeds });
  }
  rebuildStrokeGeometry();
  lastAnalysisDuration = performance.now() - analysisStarted;
  fieldTimeEl.textContent = `${lastAnalysisDuration.toFixed(1)} ms`;
  fieldDirty = false;
  modelViewDirty = false;
  lastAnalysisAt = performance.now();
  statusEl.textContent = importedModelRoot && params.liveModelAnalysis && (modelOrbiting || modelLightAdjusting)
    ? modelLightAdjusting ? '环境光调整中 · 笔触实时跟随' : '拖动中 · 笔触实时跟随'
    : uploadedImage
      ? '原图已转换 · 方向场与颜色已同步'
      : '实时运行 · 方向场已同步';
  publishFlowState();
}

function publishFlowState() {
  const videoFormat = preferredVideoRecordingFormat();
  window.__vangoghFlowState = {
    ready: true,
    sourceMode: importedModelRoot ? 'model' : uploadedImage ? 'image' : 'scene',
    activeSceneId: activeBuiltInSceneId || null,
    sceneSwitchMs: Number(document.documentElement.dataset.sceneSwitchMs || 0),
    sceneTransition: {
      active: strokeMorphActive,
      progress: Number(document.documentElement.dataset.strokeMorphProgress || 1),
      autoTour: sceneTourEnabled,
    },
    sourceSize: uploadedImage ? [uploadedImage.width, uploadedImage.height] : null,
    model: importedModelStats ? { ...importedModelStats } : null,
    modelAppearance: importedModelRoot ? {
      color: activeModelColor || null,
      lightAngle: params.modelLightAngle,
      liveStrokeFollow: params.liveModelAnalysis,
    } : null,
    strokes: seeds.length,
    gbuffer: [analysisWidth, analysisHeight],
    layers: 3,
    brushLayers: [...params.brushLayers],
    strokeMaterial: {
      size: params.strokeSize,
      dryness: params.dryness,
      viscosity: params.viscosity,
      impasto: params.impasto,
    },
    persistentSeeds: true,
    performance: {
      fieldMs: lastAnalysisDuration,
      geometryMs: Number(document.documentElement.dataset.strokeGeometryMs || 0),
      reseedMs: lastReseedDuration,
    },
    videoExport: {
      supported: Boolean(videoFormat && typeof renderer.domElement.captureStream === 'function'),
      recording: videoRecording,
      format: videoFormat?.extension || null,
      preflightFps: Number(document.documentElement.dataset.videoPreflightFps || 0),
      lastBytes: Number(document.documentElement.dataset.lastVideoBytes || 0),
    },
    errors: window.__vangoghFlowErrors,
  };
  document.documentElement.dataset.flowReady = 'true';
  document.documentElement.dataset.strokeCount = String(seeds.length);
  document.documentElement.dataset.fieldUpdateMs = lastAnalysisDuration.toFixed(2);
}

function reseedStrokes() {
  if (!analysis) {
    updateAnalysis(true);
    return;
  }
  const reseedStarted = performance.now();
  generatePersistentSeeds();
  rebuildStrokeGeometry();
  lastReseedDuration = performance.now() - reseedStarted;
  document.documentElement.dataset.reseedMs = lastReseedDuration.toFixed(2);
  fieldTimeEl.textContent = `${lastReseedDuration.toFixed(1)} ms`;
  publishFlowState();
}

function currentGrowthTime() {
  return params.growthPlayback
    ? Math.max(0, Math.min(GROWTH_DURATION, (growthTimeline - growthStartTimeline) / 1000))
    : GROWTH_DURATION;
}

function formatGrowthTime(seconds) {
  return `00:${seconds.toFixed(1).padStart(4, '0')}`;
}

function updateGrowthControls(growthTime = currentGrowthTime()) {
  const clampedTime = Math.max(0, Math.min(GROWTH_DURATION, growthTime));
  const progress = clampedTime / GROWTH_DURATION;
  growthTimelineEl.value = clampedTime.toFixed(2);
  growthTimelineEl.style.setProperty('--timeline-progress', `${(progress * 100).toFixed(2)}%`);
  growthTimeLabelEl.textContent = `${formatGrowthTime(clampedTime)} / ${formatGrowthTime(GROWTH_DURATION)}`;
  document.documentElement.dataset.growthTime = clampedTime.toFixed(2);
}

function seekGrowth(seconds) {
  const clampedTime = Math.max(0, Math.min(GROWTH_DURATION, Number(seconds) || 0));
  params.growthPlayback = true;
  growthTimeline = growthStartTimeline + clampedTime * 1000;
  growthWasActive = clampedTime < GROWTH_DURATION;
  strokeTargetsDirty = true;
  compositeDirty = true;
  updateGrowthControls(clampedTime);
  requestFrame();
}

function renderStrokeLayers() {
  if (!strokeMesh) return false;
  const growthTime = currentGrowthTime();
  const growthActive = params.growthPlayback && growthTime < GROWTH_DURATION;
  if (growthWasActive && !growthActive) strokeTargetsDirty = true;
  growthWasActive = growthActive;
  if (!strokeTargetsDirty && (!growthActive || params.paused)) return false;
  const growthRatio = params.growthPlayback ? Math.min(1, growthTime / GROWTH_DURATION) : 1;
  growthProgressEl.textContent = growthRatio >= 1
    ? t('growthComplete')
    : `${Math.round(growthRatio * 100)}% · ${growthTime < 1.4 ? t('growthCoarse') : growthTime < 3.2 ? t('growthMediumFine') : t('growthFinishing')}`;
  if (growthRatio >= 1 && statusEl.textContent.startsWith('正在生长')) {
    statusEl.textContent = '生长完成 · 笔触身份保持';
  }
  updateGrowthControls(growthTime);
  document.documentElement.dataset.growthProgress = growthRatio.toFixed(3);
  strokeMaterial.uniforms.uCoverage.value = params.coverage;
  pencilStrokeMaterial.uniforms.uCoverage.value = params.coverage;
  heightMaterial.uniforms.uCoverage.value = params.coverage;
  strokeMaterial.uniforms.uBrushSize.value = params.strokeSize;
  pencilStrokeMaterial.uniforms.uBrushSize.value = params.strokeSize;
  heightMaterial.uniforms.uBrushSize.value = params.strokeSize;
  strokeMaterial.uniforms.uWetness.value = paintWetness();
  heightMaterial.uniforms.uWetness.value = paintWetness();
  strokeMaterial.uniforms.uViscosity.value = params.viscosity;
  heightMaterial.uniforms.uViscosity.value = params.viscosity;
  strokeMaterial.uniforms.uBristleDetail.value = params.bristleDetail;
  heightMaterial.uniforms.uBristleDetail.value = params.bristleDetail;
  strokeMaterial.uniforms.uGrowthTime.value = growthTime;
  pencilStrokeMaterial.uniforms.uGrowthTime.value = growthTime;
  heightMaterial.uniforms.uGrowthTime.value = growthTime;
  strokeMaterial.uniforms.uGrowthEnabled.value = params.growthPlayback ? 1 : 0;
  pencilStrokeMaterial.uniforms.uGrowthEnabled.value = params.growthPlayback ? 1 : 0;
  heightMaterial.uniforms.uGrowthEnabled.value = params.growthPlayback ? 1 : 0;

  const sketchActive = params.viewMode === 1;
  strokeMesh.material = sketchActive ? pencilStrokeMaterial : strokeMaterial;
  renderer.setRenderTarget(strokeTarget);
  renderer.setViewport(0, 0, strokeTarget.width, strokeTarget.height);
  renderer.setClearColor(0x000000, 0);
  renderer.clear(true, true, true);
  renderer.render(overlayScene, overlayCamera);

  if (!sketchActive) {
    strokeMesh.material = heightMaterial;
    renderer.setRenderTarget(heightTarget);
    renderer.setViewport(0, 0, heightTarget.width, heightTarget.height);
    renderer.setClearColor(0x000000, 0);
    renderer.clear(true, true, true);
    renderer.render(overlayScene, overlayCamera);

  }
  strokeMesh.material = sketchActive ? pencilStrokeMaterial : strokeMaterial;
  strokeTargetsDirty = false;
  return true;
}

function renderComposite(time) {
  compositeMaterial.uniforms.uMode.value = (modelOrbiting && !params.liveModelAnalysis) || params.showBase
    ? 3
    : params.viewMode;
  compositeMaterial.uniforms.uImpasto.value = params.impasto;
  compositeMaterial.uniforms.uWetness.value = paintWetness();
  compositeMaterial.uniforms.uLightAngle.value = params.movingLight ? time * 0.00022 : -0.8;
  compositeMaterial.uniforms.uTime.value = time * 0.001;
  renderer.setRenderTarget(null);
  renderer.setViewport(0, 0, renderWidth, renderHeight);
  document.documentElement.dataset.compositeViewport = `${renderWidth}x${renderHeight}`;
  renderer.setClearColor(0x0b1322, 1);
  renderer.clear(true, true, true);
  renderer.render(screenScene, screenCamera);
  compositeDirty = false;
}

function setCanvasZoom(nextZoom, cursorPoint = null) {
  const next = Math.max(1, Math.min(4, nextZoom));
  if (next <= 1.0001) {
    canvasZoom = 1;
    canvasPan.set(0, 0);
  } else {
    const stageRect = stageEl.getBoundingClientRect();
    const layoutLeft = stageRect.left + mount.offsetLeft;
    const layoutTop = stageRect.top + mount.offsetTop;
    const cursorX = cursorPoint?.x ?? layoutLeft + mount.offsetWidth * 0.5;
    const cursorY = cursorPoint?.y ?? layoutTop + mount.offsetHeight * 0.5;
    const localX = (cursorX - layoutLeft - canvasPan.x) / canvasZoom;
    const localY = (cursorY - layoutTop - canvasPan.y) / canvasZoom;
    canvasPan.set(
      cursorX - layoutLeft - localX * next,
      cursorY - layoutTop - localY * next,
    );
    canvasZoom = next;
  }
  mount.style.setProperty('--canvas-zoom', canvasZoom.toFixed(4));
  mount.style.setProperty('--canvas-pan-x', `${canvasPan.x.toFixed(2)}px`);
  mount.style.setProperty('--canvas-pan-y', `${canvasPan.y.toFixed(2)}px`);
  mount.classList.toggle('is-zoomed', canvasZoom > 1.0001);
  document.documentElement.dataset.canvasZoom = canvasZoom.toFixed(2);
}

function resetCanvasZoom() {
  setCanvasZoom(1);
}

function resetModelView() {
  if (!importedModelRoot) return;
  modelOrbitControls.reset();
  modelOrbitControls.update();
  fieldDirty = true;
  sceneTargetDirty = true;
  compositeDirty = true;
  statusEl.textContent = '模型视角已复位 · 笔触重新同步';
  requestFrame();
}

function handleCanvasWheel(event) {
  if (importedModelRoot) return;
  event.preventDefault();
  const rect = mount.getBoundingClientRect();
  const deltaPixels = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? rect.height : 1);
  setCanvasZoom(canvasZoom * Math.exp(-deltaPixels * 0.0014), { x: event.clientX, y: event.clientY });
}

function handleCanvasDoubleClick() {
  if (importedModelRoot) resetModelView();
  else resetCanvasZoom();
}

function updateCamera(time) {
  if (importedModelRoot || !params.cameraDrift || params.paused) return;
  const phase = time * 0.00016;
  camera.position.x = Math.sin(phase) * 0.58;
  camera.position.y = 4.8 + Math.sin(phase * 0.63) * 0.12;
  camera.position.z = 10.5 + Math.cos(phase) * 0.16;
  camera.lookAt(cameraTarget);
}

function animate(time) {
  animationFrameId = 0;
  const rawDelta = Math.max(0, time - lastFrameAt);
  const delta = Math.min(64, rawDelta);
  lastFrameAt = time;
  if (!params.paused) {
    elapsed += delta;
    growthTimeline += rawDelta;
  }
  frameAccumulator += delta;
  frameSamples += 1;
  if (frameAccumulator > 600) {
    fpsEl.textContent = `${Math.round(frameSamples * 1000 / frameAccumulator)} fps`;
    frameAccumulator = 0;
    frameSamples = 0;
  }

  const resized = resize();
  if (resized) compositeDirty = true;
  updateCamera(elapsed);
  skyMaterial.uniforms.uTime.value = elapsed * 0.001;
  let sceneRendered = false;
  if (sceneTargetDirty || params.cameraDrift) {
    renderSceneTo(sceneTarget);
    sceneTargetDirty = false;
    sceneRendered = true;
  }

  const liveModelAdjustmentPending = params.liveModelAnalysis
    && importedModelRoot
    && (modelOrbiting || modelLightAdjusting)
    && modelViewDirty;
  const liveModelAnalysisDue = liveModelAdjustmentPending
    && time - lastAnalysisAt > MODEL_ANALYSIS_INTERVAL;
  const analysisDue = fieldDirty
    || liveModelAnalysisDue
    || (params.cameraDrift && !params.paused && time - lastAnalysisAt > ANALYSIS_INTERVAL);
  if (analysisDue) updateAnalysis(false);
  else if (strokeGeometryDirty) rebuildStrokeGeometry();
  const morphActive = updateStrokeMorph(time);
  const strokesRendered = renderStrokeLayers();
  if (compositeDirty || strokesRendered || sceneRendered || params.cameraDrift || (params.movingLight && growthWasActive)) {
    renderComposite(elapsed);
  }
  const growthActive = params.growthPlayback
    && !params.paused
    && currentGrowthTime() < GROWTH_DURATION;
  if (growthActive || morphActive || liveModelAdjustmentPending || (params.cameraDrift && !params.paused)) requestFrame();
  else lastFrameAt = 0;
}

function setProceduralSceneVisible(visible) {
  proceduralSceneRoots.forEach((root) => { root.visible = visible; });
  scene.fog = visible ? proceduralSceneFog : null;
}

function disposeImportedMaterial(material) {
  if (!material) return;
  Object.values(material).forEach((value) => {
    if (value?.isTexture) value.dispose();
  });
  material.dispose?.();
}

function clearImportedModel() {
  if (importedModelRoot) {
    scene.remove(importedModelRoot);
    importedModelRoot.traverse((child) => {
      if (!child.isMesh) return;
      child.geometry?.dispose();
      if (Array.isArray(child.material)) child.material.forEach(disposeImportedMaterial);
      else disposeImportedMaterial(child.material);
    });
  }
  if (importedModelMeshes.length) {
    const importedSet = new Set(importedModelMeshes);
    for (let index = sceneObjects.length - 1; index >= 0; index -= 1) {
      if (importedSet.has(sceneObjects[index])) sceneObjects.splice(index, 1);
    }
  }
  importedModelRoot = null;
  importedModelMeshes = [];
  importedModelLabel = '';
  importedModelStats = null;
  activeDefaultGeometryId = '';
  activeModelColor = '';
  activeModelColorIsCustom = false;
  modelViewDirty = false;
  modelLightAdjusting = false;
  modelOrbitControls.enabled = false;
  mount.classList.remove('is-model-source', 'is-orbiting');
  setProceduralSceneVisible(true);
  delete document.documentElement.dataset.modelView;
  delete document.documentElement.dataset.modelColor;
}

function configureImportedModel(root, source = {}) {
  root.position.set(0, 0, 0);
  root.scale.setScalar(1);
  root.updateWorldMatrix(true, true);
  const sourceBounds = new THREE.Box3().setFromObject(root);
  if (sourceBounds.isEmpty()) throw new Error('GLB 中没有可显示的几何体');
  const sourceSize = sourceBounds.getSize(new THREE.Vector3());
  const largestDimension = Math.max(sourceSize.x, sourceSize.y, sourceSize.z);
  if (!Number.isFinite(largestDimension) || largestDimension <= 0) throw new Error('GLB 模型尺寸无效');
  root.scale.setScalar(5.2 / largestDimension);
  root.updateWorldMatrix(true, true);
  const fittedBounds = new THREE.Box3().setFromObject(root);
  const fittedCenter = fittedBounds.getCenter(new THREE.Vector3());
  root.position.sub(fittedCenter);
  root.updateWorldMatrix(true, true);

  const finalBounds = new THREE.Box3().setFromObject(root);
  const finalSize = finalBounds.getSize(new THREE.Vector3());
  const radius = Math.max(1, finalSize.length() * 0.5);
  const cameraDistanceScale = source.cameraDistanceScale ?? 1;
  modelCameraDistance = Math.max(4.8, radius / Math.sin(THREE.MathUtils.degToRad(camera.fov * 0.5)) * 0.78)
    * cameraDistanceScale;
  const viewDirection = new THREE.Vector3(0.86, 0.52, 1.25).normalize();
  camera.near = Math.max(0.015, modelCameraDistance / 150);
  camera.far = Math.max(80, modelCameraDistance * 24);
  camera.position.copy(viewDirection.multiplyScalar(modelCameraDistance));
  camera.updateProjectionMatrix();
  modelOrbitControls.target.set(0, 0, 0);
  modelOrbitControls.minDistance = Math.max(1.8, modelCameraDistance * 0.34);
  modelOrbitControls.maxDistance = modelCameraDistance * 4.5;
  modelOrbitControls.enabled = true;
  modelOrbitControls.update();
  modelOrbitControls.saveState();

  let vertices = 0;
  let triangles = 0;
  let meshes = 0;
  root.traverse((child) => {
    if (!child.isMesh) return;
    child.frustumCulled = true;
    child.userData.semantic = SEMANTIC.IMAGE;
    importedModelMeshes.push(child);
    sceneObjects.push(child);
    meshes += 1;
    const positionCount = child.geometry?.attributes?.position?.count || 0;
    vertices += positionCount;
    triangles += Math.round((child.geometry?.index?.count || positionCount) / 3);
  });
  if (!meshes) throw new Error('GLB 中没有可生成笔触的网格');
  importedModelStats = {
    meshes,
    vertices,
    triangles,
    bytes: Number(source.size) || 0,
    kind: activeDefaultGeometryId ? 'default' : 'glb',
    preset: activeDefaultGeometryId || null,
  };
}

function updateDefaultGeometryButtons() {
  defaultGeometryEls.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.defaultGeometry === activeDefaultGeometryId));
  });
}

function modelColorHex(value) {
  return `#${new THREE.Color(value).getHexString()}`;
}

function updateModelColorButtons() {
  const modelAvailable = Boolean(importedModelRoot);
  modelColorEls.forEach((button) => {
    const selected = !activeModelColorIsCustom && button.dataset.modelColor.toLowerCase() === activeModelColor;
    button.setAttribute('aria-pressed', String(selected));
    button.disabled = !modelAvailable;
  });
  const customControl = modelColorCustomEl?.closest('.model-color-custom');
  modelColorCustomEl.disabled = !modelAvailable;
  customControl?.classList.toggle('is-active', modelAvailable && activeModelColorIsCustom);
  customControl?.classList.toggle('is-disabled', !modelAvailable);
  customControl?.style.setProperty('--custom-model-color', modelColorCustomEl.value);
}

function applyModelColor(value, label = '自定义颜色', options = {}) {
  if (!importedModelRoot) return;
  const color = new THREE.Color(value);
  const materials = new Set();
  importedModelMeshes.forEach((mesh) => {
    const meshMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    meshMaterials.forEach((material) => {
      if (material?.color) materials.add(material);
    });
  });
  materials.forEach((material) => {
    material.color.copy(color);
    material.needsUpdate = true;
  });
  activeModelColor = modelColorHex(color);
  activeModelColorIsCustom = Boolean(options.custom);
  if (activeModelColorIsCustom) modelColorCustomEl.value = activeModelColor;
  document.documentElement.dataset.modelColor = activeModelColor;
  updateModelColorButtons();
  modelViewDirty = true;
  fieldDirty = true;
  sceneTargetDirty = true;
  compositeDirty = true;
  statusEl.textContent = `模型颜色 · ${label}`;
  publishFlowState();
  requestFrame();
}

function updateModelViewButtons() {
  const previewActive = Boolean(importedModelRoot) && params.viewMode === 3;
  const paintActive = Boolean(importedModelRoot) && params.viewMode === 5;
  modelPreviewButtonEl?.setAttribute('aria-pressed', String(previewActive));
  modelPaintButtonEl?.setAttribute('aria-pressed', String(paintActive));
}

function sceneDisplayTitle(scene) {
  if (!scene) return '';
  return currentLanguage === 'en' ? scene.titleEn || scene.title : scene.title;
}

function setSourceUi() {
  const modelMode = Boolean(importedModelRoot);
  const imageMode = Boolean(uploadedImage);
  const builtInActive = imageMode && Boolean(activeBuiltInSceneId);
  sourceModeEl.textContent = modelMode
    ? activeDefaultGeometryId ? '默认几何体' : 'GLB 模型'
    : builtInActive ? '内置场景' : imageMode ? '原图' : '内置场景';
  sourceMetaEl.textContent = modelMode ? importedModelLabel : imageMode ? uploadedImageLabel : '正在准备内置场景';
  sourceMetaEl.title = sourceMetaEl.textContent;
  restoreSceneButton.disabled = (!modelMode && builtInActive) || !selectedBuiltInScene;
  restoreSceneButton.hidden = restoreSceneButton.disabled;
  scenePickerLabelEl.textContent = builtInActive
    ? sceneDisplayTitle(selectedBuiltInScene) || t('selectWork')
    : sceneDisplayTitle(selectedBuiltInScene) || t('selectWork');
  document.documentElement.dataset.sourceMode = modelMode ? 'model' : builtInActive ? 'builtin' : imageMode ? 'image' : 'scene';
  document.documentElement.dataset.modelSource = modelMode
    ? activeDefaultGeometryId || 'glb'
    : 'none';
  modelSourceControlsEl.hidden = !modelMode;
  if (modelMode) {
    modelSourceNameEl.textContent = importedModelLabel.split(' · ')[0];
    modelSourceMetaEl.textContent = `${importedModelStats.meshes} ${t('meshCount')} · ${importedModelStats.triangles.toLocaleString()} ${t('triangleCount')}`;
  }
  sourcePreviewLabelEl.dataset.i18n = modelMode ? 'model3d' : 'original';
  sourcePreviewHintEl.dataset.i18n = modelMode ? 'dragToRotate' : 'noStrokes';
  sourcePreviewLabelEl.textContent = t(sourcePreviewLabelEl.dataset.i18n);
  sourcePreviewHintEl.textContent = t(sourcePreviewHintEl.dataset.i18n);
  mount.title = modelMode
    ? t('modelCanvasHint')
    : t('canvasHint');
  mount.classList.toggle('is-model-source', modelMode);
  stageEl.classList.toggle('is-model-layout', modelMode);
  modelLightControlEl.hidden = !modelMode;
  updateDefaultGeometryButtons();
  updateModelColorButtons();
  updateModelViewButtons();
  sceneGridEl?.querySelectorAll('.scene-card').forEach((button) => {
    const selected = button.dataset.sceneId === activeBuiltInSceneId;
    button.classList.toggle('is-selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
}

function setLayerMode(mode) {
  const nextMode = [0, 1, 3, 5].includes(Number(mode)) ? Number(mode) : 5;
  const previousMode = params.viewMode;
  const replayModelGrowth = Boolean(importedModelRoot) && previousMode === 3 && nextMode === 5;
  params.viewMode = nextMode;
  params.showBase = false;
  layerModeEls.forEach((input) => { input.checked = Number(input.value) === nextMode; });
  const layerModeName = nextMode === 5
    ? 'brush'
    : nextMode === 3 ? 'original' : nextMode === 1 ? 'flow-sketch' : 'blend';
  document.documentElement.dataset.layerMode = layerModeName;
  updateModelViewButtons();
  compositeDirty = true;
  if (previousMode !== nextMode) {
    strokeTargetsDirty = true;
  }
  if (replayModelGrowth) restartGrowth();
  if (nextMode === 1) statusEl.textContent = '流场手稿 · 与最终笔触共用长度、弯度和生长轨迹';
  requestFrame();
  return replayModelGrowth;
}

function syncBrushLayerVisibility() {
  const visibility = params.brushLayers.map((visible) => (visible ? 1 : 0));
  [strokeMaterial, pencilStrokeMaterial, heightMaterial].forEach((material) => {
    material.uniforms.uBrushLayerVisibility.value.set(...visibility);
  });
  brushLayerEls.forEach((input) => {
    const layer = Number(input.dataset.brushLayer);
    input.checked = params.brushLayers[layer];
  });
  document.documentElement.dataset.brushLayers = visibility.join('');
  strokeTargetsDirty = true;
  compositeDirty = true;
  publishFlowState();
  requestFrame();
}

function resetForSourceChange(options = {}) {
  resetCanvasZoom();
  resizeDirty = true;
  resize();
  params.cameraDrift = false;
  if (!importedModelRoot) {
    camera.near = 0.1;
    camera.far = 80;
    camera.position.set(0, 4.8, 10.5);
    camera.lookAt(cameraTarget);
    camera.updateProjectionMatrix();
  }
  setLayerMode(options.viewMode ?? 5);
  seedGeneration += 1;
  seeds = [];
  analysis = null;
  fieldDirty = true;
  sceneTargetDirty = true;
  strokeTargetsDirty = true;
  updateAnalysis(true);
  if (beginStrokeMorph(options.strokeMorphSnapshot)) {
    return;
  }
  setStrokeMorphProgress(1);
  strokeMorphActive = false;
  document.documentElement.dataset.strokeMorphState = 'idle';
  if (skipInitialGrowth) {
    skipInitialGrowth = false;
    params.growthPlayback = false;
    growthWasActive = false;
    compositeDirty = true;
    updateGrowthControls(GROWTH_DURATION);
    statusEl.textContent = '已按减少动态效果偏好显示完成画面';
    requestFrame();
  } else {
    restartGrowth();
  }
}

function limitImageSize(image) {
  const maxEdge = Math.min(4096, renderer.capabilities.maxTextureSize || 4096);
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  const scale = Math.min(1, maxEdge / Math.max(sourceWidth, sourceHeight));
  if (scale >= 0.999) return image;
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(sourceWidth * scale));
  canvas.height = Math.max(1, Math.round(sourceHeight * scale));
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) throw new Error('无法建立图片缩放画布');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function makeSourceTexture(image) {
  const texture = new THREE.Texture(image);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

function setNumericControl(key, value) {
  params[key] = value;
  const input = document.querySelector(`[data-param="${key}"]`);
  const output = document.querySelector(`[data-output="${key}"]`);
  if (input) input.value = String(value);
  if (output) output.textContent = key === 'strokeCountK'
    ? Math.round(value * 1000).toLocaleString()
    : Number(value).toFixed(2);
}

async function loadDefaultGeometry(geometryId) {
  const preset = DEFAULT_GEOMETRIES[geometryId];
  if (!preset) return;
  if (sceneTourEnabled) setSceneTourEnabled(false);
  const requestToken = ++sceneLoadToken;
  statusEl.textContent = `正在生成${preset.label} · 准备 3D 预览`;
  let root = null;
  try {
    const geometry = preset.create();
    geometry.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({
      color: preset.color,
      roughness: 0.72,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    if (preset.rotation) mesh.rotation.set(...preset.rotation);
    mesh.name = preset.label;
    root = new THREE.Group();
    root.name = `Default ${preset.label}`;
    root.add(mesh);

    clearImportedModel();
    uploadedTexture?.dispose();
    uploadedTexture = null;
    uploadedImage = null;
    uploadedImageLabel = '';
    activeBuiltInSceneId = '';
    activeDefaultGeometryId = geometryId;
    activeModelColor = modelColorHex(preset.color);
    activeModelColorIsCustom = false;
    document.documentElement.dataset.modelColor = activeModelColor;
    importedModelMeshes = [];
    importedModelRoot = root;
    scene.add(importedModelRoot);
    setProceduralSceneVisible(false);
    configureImportedModel(importedModelRoot, preset);
    importedModelLabel = `${preset.label} · 内置几何体 · 可实时旋转`;
    setSourceUi();
    await new Promise((resolve) => requestAnimationFrame(resolve));
    if (requestToken !== sceneLoadToken) return;
    resetForSourceChange({ viewMode: 3 });
    statusEl.textContent = `${preset.label}已载入 · 拖动模型实时调整笔触方向`;
  } catch (error) {
    if (importedModelRoot === root) clearImportedModel();
    else root?.traverse((child) => {
      child.geometry?.dispose();
      if (Array.isArray(child.material)) child.material.forEach(disposeImportedMaterial);
      else disposeImportedMaterial(child.material);
    });
    if (requestToken !== sceneLoadToken) return;
    const message = error instanceof Error ? error.message : String(error);
    statusEl.textContent = `默认几何体生成失败 · ${message}`;
    window.__vangoghFlowErrors.push(message);
  }
}

async function loadUploadedImage(file, options = {}) {
  if (!file) return;
  const requestToken = options.requestToken ?? ++sceneLoadToken;
  const builtInScene = options.builtInScene || null;
  if (!builtInScene && sceneTourEnabled) setSceneTourEnabled(false);
  if (!builtInScene && file.type && !file.type.startsWith('image/')) {
    statusEl.textContent = '请选择 JPG、PNG 或 WebP 图片';
    return;
  }

  statusEl.textContent = `正在读取图片 · ${builtInScene?.title || file.name}`;
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.decoding = 'async';
    image.src = objectUrl;
    await image.decode();
    const sourceWidth = image.naturalWidth || image.width;
    const sourceHeight = image.naturalHeight || image.height;
    if (!sourceWidth || !sourceHeight) throw new Error('图片没有可读取的尺寸');
    const prepared = limitImageSize(image);
    if (requestToken !== sceneLoadToken) return;

    clearImportedModel();
    uploadedTexture?.dispose();
    uploadedImage = prepared;
    uploadedTexture = makeSourceTexture(prepared);
    uploadedMaterial.uniforms.uImage.value = uploadedTexture;
    const resized = prepared.width !== sourceWidth || prepared.height !== sourceHeight;
    if (builtInScene) {
      selectedBuiltInScene = builtInScene;
      activeBuiltInSceneId = builtInScene.id;
      uploadedImageLabel = `${builtInScene.title} · ${sourceWidth}×${sourceHeight} WebP · 保持比例`;
    } else {
      activeBuiltInSceneId = '';
      uploadedImageLabel = `${file.name} · ${sourceWidth}×${sourceHeight}${resized ? ` → ${prepared.width}×${prepared.height}` : ''} · 保持比例`;
    }
    setSourceUi();
    await new Promise((resolve) => requestAnimationFrame(resolve));
    if (requestToken !== sceneLoadToken) return;
    resetForSourceChange({ strokeMorphSnapshot: options.strokeMorphSnapshot });
    if (builtInScene) {
      const sceneSwitchMs = performance.now() - (options.sceneSwitchStarted || performance.now());
      document.documentElement.dataset.activeSceneId = builtInScene.id;
      document.documentElement.dataset.sceneSwitchMs = sceneSwitchMs.toFixed(2);
      document.documentElement.dataset.sceneSwitchState = 'ready';
      publishFlowState();
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    statusEl.textContent = `图片读取失败 · ${message}`;
    window.__vangoghFlowErrors.push(message);
  } finally {
    URL.revokeObjectURL(objectUrl);
    sourceUploadEl.value = '';
  }
}

function isGlbFile(file) {
  return Boolean(file) && (
    file.name?.toLowerCase().endsWith('.glb')
    || file.type === 'model/gltf-binary'
    || file.type === 'model/gltf+binary'
  );
}

async function loadGlbModel(file) {
  if (!file) return;
  if (sceneTourEnabled) setSceneTourEnabled(false);
  if (!isGlbFile(file)) {
    statusEl.textContent = '请选择单文件 GLB 模型';
    return;
  }
  const requestToken = ++sceneLoadToken;
  statusEl.textContent = `正在解析 GLB · ${file.name}`;
  uploadDropEl.classList.add('is-loading');
  try {
    const [{ GLTFLoader }, arrayBuffer] = await Promise.all([
      import('three/addons/loaders/GLTFLoader.js'),
      file.arrayBuffer(),
    ]);
    if (requestToken !== sceneLoadToken) return;
    const gltf = await new GLTFLoader().parseAsync(arrayBuffer, '');
    if (requestToken !== sceneLoadToken) return;
    if (!gltf.scene) throw new Error('GLB 没有可读取的主场景');

    clearImportedModel();
    uploadedTexture?.dispose();
    uploadedTexture = null;
    uploadedImage = null;
    uploadedImageLabel = '';
    activeBuiltInSceneId = '';
    importedModelMeshes = [];
    importedModelRoot = gltf.scene;
    scene.add(importedModelRoot);
    setProceduralSceneVisible(false);
    configureImportedModel(importedModelRoot, file);
    const fileSize = file.size >= 1048576
      ? `${(file.size / 1048576).toFixed(1)} MB`
      : `${Math.max(1, Math.round(file.size / 1024))} KB`;
    importedModelLabel = `${file.name} · GLB · ${fileSize} · 本地处理`;
    setSourceUi();
    await new Promise((resolve) => requestAnimationFrame(resolve));
    if (requestToken !== sceneLoadToken) return;
    resetForSourceChange({ viewMode: 3 });
    statusEl.textContent = 'GLB 已载入 · 拖动模型实时调整笔触方向';
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (importedModelRoot && !importedModelLabel) clearImportedModel();
    statusEl.textContent = `GLB 读取失败 · ${message}`;
    window.__vangoghFlowErrors.push(message);
  } finally {
    uploadDropEl.classList.remove('is-loading');
    sourceUploadEl.value = '';
  }
}

function fetchBuiltInSceneBlob(scene) {
  if (!scene?.src) return Promise.reject(new Error('场景资源地址无效'));
  const separator = scene.src.includes('?') ? '&' : '?';
  const assetUrl = `${scene.src}${separator}v=${encodeURIComponent(scene.assetVersion || `${scene.width}x${scene.height}`)}`;
  if (builtInSceneBlobCache.has(assetUrl)) return builtInSceneBlobCache.get(assetUrl);
  const request = fetch(assetUrl, { cache: 'default' })
    .then((response) => {
      if (!response.ok) throw new Error(`场景资源 ${response.status}`);
      return response.blob();
    })
    .catch((error) => {
      builtInSceneBlobCache.delete(assetUrl);
      throw error;
    });
  builtInSceneBlobCache.set(assetUrl, request);
  return request;
}

function updateSceneTourButton() {
  sceneTourToggleEl.disabled = builtInScenes.length < 2;
  sceneTourToggleEl.setAttribute('aria-pressed', String(sceneTourEnabled));
  sceneTourToggleEl.dataset.i18n = sceneTourEnabled ? 'stopTour' : 'startTour';
  sceneTourToggleEl.textContent = t(sceneTourToggleEl.dataset.i18n);
}

function scheduleSceneTour(delay = SCENE_TOUR_DWELL) {
  clearTimeout(sceneTourTimer);
  sceneTourTimer = 0;
  if (!sceneTourEnabled || builtInScenes.length < 2) return;
  sceneTourTimer = window.setTimeout(() => {
    sceneTourTimer = 0;
    const currentIndex = Math.max(0, builtInScenes.findIndex((scene) => scene.id === activeBuiltInSceneId));
    loadBuiltInScene(builtInScenes[(currentIndex + 1) % builtInScenes.length]);
  }, delay);
}

function setSceneTourEnabled(value) {
  sceneTourEnabled = Boolean(value) && builtInScenes.length > 1;
  clearTimeout(sceneTourTimer);
  sceneTourTimer = 0;
  updateSceneTourButton();
  document.documentElement.dataset.sceneTour = sceneTourEnabled ? 'playing' : 'idle';
  statusEl.textContent = sceneTourEnabled
    ? '自动巡展已开启 · 内置原作将以笔触变形衔接'
    : '自动巡展已停止';
  if (sceneTourEnabled) scheduleSceneTour(900);
  publishFlowState();
  requestFrame();
}

async function loadBuiltInScene(scene) {
  if (!scene || (activeBuiltInSceneId === scene.id && uploadedImage)) return;
  const sceneSwitchStarted = performance.now();
  const requestToken = ++sceneLoadToken;
  const strokeMorphSnapshot = activeBuiltInSceneId && uploadedImage
    ? captureStrokeMorphSnapshot()
    : null;
  selectedBuiltInScene = scene;
  document.documentElement.dataset.sceneSwitchState = 'loading';
  scenePickerLabelEl.textContent = `${t('loadingWork')} · ${sceneDisplayTitle(scene)}`;
  const button = sceneGridEl?.querySelector(`[data-scene-id="${scene.id}"]`);
  button?.classList.add('is-loading');
  statusEl.textContent = `正在载入内置场景 · ${scene.title}`;
  try {
    const blob = await fetchBuiltInSceneBlob(scene);
    if (requestToken !== sceneLoadToken) return;
    const file = new File([blob], `${scene.id}.webp`, { type: 'image/webp' });
    await loadUploadedImage(file, {
      builtInScene: scene,
      requestToken,
      sceneSwitchStarted,
      strokeMorphSnapshot,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    statusEl.textContent = `内置场景读取失败 · ${message}`;
    window.__vangoghFlowErrors.push(message);
  } finally {
    button?.classList.remove('is-loading');
    if (requestToken === sceneLoadToken && sceneTourEnabled) scheduleSceneTour();
  }
}

function renderSceneLibrary() {
  if (!sceneGridEl) return;
  sceneGridEl.replaceChildren();
  builtInScenes.forEach((scene) => {
    const button = document.createElement('button');
    button.className = 'scene-card';
    button.type = 'button';
    button.dataset.sceneId = scene.id;
    button.setAttribute('role', 'listitem');
    button.setAttribute('aria-label', `${t('loadingWork')} ${sceneDisplayTitle(scene)}`);
    button.title = `${scene.title} · ${scene.titleEn}`;
    const image = document.createElement('img');
    const separator = scene.thumb.includes('?') ? '&' : '?';
    image.src = `${scene.thumb}${separator}v=${encodeURIComponent(scene.assetVersion || `${scene.width}x${scene.height}`)}`;
    image.alt = '';
    image.loading = 'lazy';
    image.decoding = 'async';
    const label = document.createElement('span');
    label.textContent = sceneDisplayTitle(scene);
    button.append(image, label);
    button.addEventListener('pointerenter', () => { fetchBuiltInSceneBlob(scene).catch(() => {}); }, { once: true });
    button.addEventListener('focus', () => { fetchBuiltInSceneBlob(scene).catch(() => {}); }, { once: true });
    button.addEventListener('click', () => loadBuiltInScene(scene));
    sceneGridEl.append(button);
  });
  setSourceUi();
}

async function initializeSceneLibrary() {
  try {
    const response = await fetch('./scenes/manifest.json');
    if (!response.ok) throw new Error(`场景清单 ${response.status}`);
    const manifest = await response.json();
    if (!Array.isArray(manifest) || manifest.length === 0) throw new Error('场景清单为空');
    builtInScenes = manifest;
    selectedBuiltInScene = builtInScenes[Math.floor(Math.random() * builtInScenes.length)];
    updateSceneTourButton();
    renderSceneLibrary();
    await loadBuiltInScene(selectedBuiltInScene);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    sceneGridEl?.replaceChildren(Object.assign(document.createElement('span'), {
      className: 'scene-loading',
      textContent: '内置场景暂时不可用',
    }));
    statusEl.textContent = `内置场景初始化失败 · ${message}`;
    window.__vangoghFlowErrors.push(message);
  }
}

function restoreBuiltInScene() {
  loadBuiltInScene(selectedBuiltInScene || builtInScenes[0]);
}

function exportDimensions(maxEdge) {
  const aspect = outputWidth / Math.max(1, outputHeight);
  if (aspect >= 1) {
    return [maxEdge, Math.max(2, Math.round(maxEdge / aspect))];
  }
  return [Math.max(2, Math.round(maxEdge * aspect)), maxEdge];
}

function preferredVideoRecordingFormat() {
  if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') {
    return null;
  }
  const formats = [
    { mimeType: 'video/mp4;codecs=avc1.42E01E', extension: 'mp4', label: 'MP4' },
    { mimeType: 'video/webm;codecs=vp9', extension: 'webm', label: 'WebM' },
    { mimeType: 'video/webm;codecs=vp8', extension: 'webm', label: 'WebM' },
    { mimeType: 'video/webm', extension: 'webm', label: 'WebM' },
  ];
  return formats.find(({ mimeType }) => MediaRecorder.isTypeSupported(mimeType)) || null;
}

function videoExtensionForMime(mimeType, fallback = 'webm') {
  if (mimeType.includes('mp4')) return 'mp4';
  if (mimeType.includes('webm')) return 'webm';
  return fallback;
}

function waitForAnimationFrames(count = 1) {
  return new Promise((resolve) => {
    let remaining = Math.max(1, count);
    const step = () => {
      remaining -= 1;
      if (remaining <= 0) resolve();
      else requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

function measureCanvasFrameRate(duration = 450) {
  return new Promise((resolve) => {
    const samples = [];
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutId);
      if (samples.length < 2) {
        resolve(0);
        return;
      }
      const elapsedMs = samples.at(-1) - samples[0];
      resolve(elapsedMs > 0 ? ((samples.length - 1) * 1000) / elapsedMs : 0);
    };
    const sample = (time) => {
      if (settled) return;
      samples.push(time);
      if (samples.length > 1 && time - samples[0] >= duration) finish();
      else requestAnimationFrame(sample);
    };
    const timeoutId = setTimeout(finish, duration + 800);
    requestAnimationFrame(sample);
  });
}

function waitForGrowthRecording() {
  return new Promise((resolve, reject) => {
    let frameId = 0;
    const timeoutId = setTimeout(() => {
      cancelAnimationFrame(frameId);
      reject(new Error('实时录制超过 8 秒，已自动停止'));
    }, VIDEO_RECORDING_TIMEOUT);
    const check = () => {
      if (currentGrowthTime() >= GROWTH_DURATION - 0.01) {
        clearTimeout(timeoutId);
        resolve();
        return;
      }
      frameId = requestAnimationFrame(check);
    };
    frameId = requestAnimationFrame(check);
  });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function videoExportIsSupported() {
  return Boolean(
    preferredVideoRecordingFormat()
    && typeof renderer.domElement.captureStream === 'function',
  );
}

function setVideoRecordingUi(recording, label = t('exportVideo')) {
  videoRecording = recording;
  videoExportButtonEl.classList.toggle('is-busy', recording);
  videoExportButtonEl.textContent = label;
  videoExportButtonEl.disabled = recording || !videoExportIsSupported();
  exportButtonEl.disabled = recording;
  replayGrowthButtonEl.disabled = recording;
  pauseButton.disabled = recording;
  growthTimelineEl.disabled = recording;
  qualityModeEl.disabled = recording;
  document.documentElement.dataset.videoRecording = recording ? 'recording' : 'idle';
  publishFlowState();
}

function initializeVideoExport() {
  const format = preferredVideoRecordingFormat();
  const supported = Boolean(format && typeof renderer.domElement.captureStream === 'function');
  videoExportButtonEl.disabled = !supported;
  document.documentElement.dataset.videoExportSupported = String(supported);
  document.documentElement.dataset.videoRecording = 'idle';
}

async function exportGrowthVideo() {
  if (videoRecording || exportButtonEl.classList.contains('is-busy')) return;
  const format = preferredVideoRecordingFormat();
  if (!format || typeof renderer.domElement.captureStream !== 'function') {
    statusEl.textContent = '当前浏览器不支持画布视频录制';
    initializeVideoExport();
    return;
  }

  let stream = null;
  let recorder = null;
  let progressTimer = 0;
  setVideoRecordingUi(true, t('checkingPerformance'));

  try {
    const preflightFps = await measureCanvasFrameRate();
    document.documentElement.dataset.videoPreflightFps = preflightFps.toFixed(1);
    if (preflightFps < VIDEO_RECORDING_MIN_FPS) {
      statusEl.textContent = `当前约 ${preflightFps.toFixed(0)} FPS，为避免卡顿已取消录制`;
      return;
    }

    restartGrowth();
    setPaused(true);
    seekGrowth(0);
    await waitForAnimationFrames(2);

    stream = renderer.domElement.captureStream(VIDEO_RECORDING_FPS);
    if (stream.getVideoTracks().length === 0) throw new Error('画布没有可录制的视频轨道');
    const chunks = [];
    let recorderError = null;
    recorder = new MediaRecorder(stream, {
      mimeType: format.mimeType,
      videoBitsPerSecond: VIDEO_RECORDING_BITRATE,
    });
    const stopped = new Promise((resolve) => {
      recorder.onstop = resolve;
    });
    recorder.ondataavailable = (event) => {
      if (event.data?.size) chunks.push(event.data);
    };
    recorder.onerror = (event) => {
      recorderError = event.error || new Error('浏览器录制器发生错误');
    };

    const recordingWidth = renderer.domElement.width;
    const recordingHeight = renderer.domElement.height;
    recorder.start(1000);
    growthStartTimeline = growthTimeline;
    growthWasActive = false;
    strokeTargetsDirty = true;
    setPaused(false);
    statusEl.textContent = `正在录制生长动画 · ${recordingWidth}×${recordingHeight}`;
    progressTimer = setInterval(() => {
      videoExportButtonEl.textContent = `${t('recording')} ${currentGrowthTime().toFixed(1)} / ${GROWTH_DURATION.toFixed(1)} ${t('seconds')}`;
    }, 100);

    await waitForGrowthRecording();
    await waitForAnimationFrames(2);
    recorder.stop();
    await stopped;
    if (recorderError) throw recorderError;
    const mimeType = recorder.mimeType || format.mimeType;
    const blob = new Blob(chunks, { type: mimeType });
    if (!blob.size) throw new Error('浏览器未能编码视频');
    const extension = videoExtensionForMime(blob.type, format.extension);
    const filename = `wet-paint-flow-growth-${recordingWidth}x${recordingHeight}.${extension}`;
    downloadBlob(blob, filename);
    document.documentElement.dataset.lastVideoExport = filename;
    document.documentElement.dataset.lastVideoMime = blob.type;
    document.documentElement.dataset.lastVideoBytes = String(blob.size);
    document.documentElement.dataset.lastVideoDuration = GROWTH_DURATION.toFixed(1);
    document.documentElement.dataset.lastVideoSize = `${recordingWidth}x${recordingHeight}`;
    statusEl.textContent = `视频导出完成 · ${recordingWidth}×${recordingHeight} ${extension.toUpperCase()}`;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    statusEl.textContent = `视频导出失败 · ${message}`;
    window.__vangoghFlowErrors.push(message);
  } finally {
    clearInterval(progressTimer);
    if (recorder && recorder.state !== 'inactive') recorder.stop();
    stream?.getTracks().forEach((track) => track.stop());
    setVideoRecordingUi(false);
  }
}

async function exportHighResolution() {
  if (!strokeMesh || videoRecording || exportButtonEl.classList.contains('is-busy')) return;
  const maxEdge = 4096;
  const [exportWidth, exportHeight] = exportDimensions(maxEdge);
  const exportScene = makeTarget(exportWidth, exportHeight, { depth: true });
  const exportStroke = makeTarget(exportWidth, exportHeight, { depth: false });
  const exportHeightState = makeTarget(exportWidth, exportHeight, { depth: false });
  const previousRenderTarget = renderer.getRenderTarget();
  const previousCanvasWidth = renderer.domElement.width;
  const previousCanvasHeight = renderer.domElement.height;
  const previousStrokeResolution = strokeMaterial.uniforms.uResolution.value.clone();
  const previousPencilResolution = pencilStrokeMaterial.uniforms.uResolution.value.clone();
  const previousHeightResolution = heightMaterial.uniforms.uResolution.value.clone();
  const previousStrokeScale = strokeMaterial.uniforms.uStrokeScale.value;
  const previousPencilScale = pencilStrokeMaterial.uniforms.uStrokeScale.value;
  const previousHeightScale = heightMaterial.uniforms.uStrokeScale.value;
  const previousSceneTexture = compositeMaterial.uniforms.uScene.value;
  const previousStrokeTexture = compositeMaterial.uniforms.uStroke.value;
  const previousHeightTexture = compositeMaterial.uniforms.uHeight.value;
  const previousTexel = compositeMaterial.uniforms.uTexel.value.clone();
  const previousMaterial = strokeMesh.material;
  exportButtonEl.classList.add('is-busy');
  exportButtonEl.disabled = true;
  videoExportButtonEl.disabled = true;
  exportButtonEl.textContent = `正在渲染 ${maxEdge === 4096 ? '4K' : '2K'}…`;
  statusEl.textContent = `高清导出 · ${exportWidth}×${exportHeight}`;

  try {
    if (uploadedImage) renderUploadedTo(
      exportScene,
      0,
      uploadedImage,
      uploadedTexture,
    );
    else renderSceneTo(exportScene);

    const exportStrokeScale = (exportWidth / Math.max(1, outputWidth)) * 1.12;
    strokeMaterial.uniforms.uResolution.value.set(exportWidth, exportHeight);
    pencilStrokeMaterial.uniforms.uResolution.value.set(exportWidth, exportHeight);
    heightMaterial.uniforms.uResolution.value.set(exportWidth, exportHeight);
    strokeMaterial.uniforms.uStrokeScale.value = exportStrokeScale;
    pencilStrokeMaterial.uniforms.uStrokeScale.value = (exportWidth / Math.max(1, outputWidth)) * 0.34;
    heightMaterial.uniforms.uStrokeScale.value = exportStrokeScale;

    strokeMesh.material = params.viewMode === 1 ? pencilStrokeMaterial : strokeMaterial;
    renderer.setRenderTarget(exportStroke);
    renderer.setClearColor(0x000000, 0);
    renderer.clear(true, true, true);
    renderer.render(overlayScene, overlayCamera);

    strokeMesh.material = heightMaterial;
    renderer.setRenderTarget(exportHeightState);
    renderer.setClearColor(0x000000, 0);
    renderer.clear(true, true, true);
    renderer.render(overlayScene, overlayCamera);

    compositeMaterial.uniforms.uScene.value = exportScene.texture;
    compositeMaterial.uniforms.uStroke.value = exportStroke.texture;
    compositeMaterial.uniforms.uHeight.value = exportHeightState.texture;
    compositeMaterial.uniforms.uTexel.value.set(1 / exportWidth, 1 / exportHeight);
    renderer.setRenderTarget(null);
    renderer.setSize(exportWidth, exportHeight, false);
    renderer.setViewport(0, 0, exportWidth, exportHeight);
    renderer.setClearColor(0x000000, 1);
    renderer.clear(true, true, true);
    renderer.render(screenScene, screenCamera);

    const blob = await new Promise((resolve) => renderer.domElement.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('浏览器未能编码 PNG');
    downloadBlob(blob, `wet-paint-flow-${exportWidth}x${exportHeight}.png`);
    statusEl.textContent = `导出完成 · ${exportWidth}×${exportHeight} PNG`;
    document.documentElement.dataset.lastExport = `${exportWidth}x${exportHeight}`;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    statusEl.textContent = `导出失败 · ${message}`;
    window.__vangoghFlowErrors.push(message);
  } finally {
    strokeMesh.material = previousMaterial;
    strokeMaterial.uniforms.uResolution.value.copy(previousStrokeResolution);
    pencilStrokeMaterial.uniforms.uResolution.value.copy(previousPencilResolution);
    heightMaterial.uniforms.uResolution.value.copy(previousHeightResolution);
    strokeMaterial.uniforms.uStrokeScale.value = previousStrokeScale;
    pencilStrokeMaterial.uniforms.uStrokeScale.value = previousPencilScale;
    heightMaterial.uniforms.uStrokeScale.value = previousHeightScale;
    compositeMaterial.uniforms.uScene.value = previousSceneTexture;
    compositeMaterial.uniforms.uStroke.value = previousStrokeTexture;
    compositeMaterial.uniforms.uHeight.value = previousHeightTexture;
    compositeMaterial.uniforms.uTexel.value.copy(previousTexel);
    renderer.setSize(previousCanvasWidth, previousCanvasHeight, false);
    renderer.setRenderTarget(previousRenderTarget);
    exportScene.dispose();
    exportStroke.dispose();
    exportHeightState.dispose();
    compositeDirty = true;
    requestFrame();
    exportButtonEl.classList.remove('is-busy');
    exportButtonEl.disabled = false;
    exportButtonEl.textContent = t('exportPng');
    videoExportButtonEl.disabled = !videoExportIsSupported();
  }
}

sourceUploadEl.addEventListener('change', (event) => {
  const file = event.target.files?.[0];
  if (isGlbFile(file)) loadGlbModel(file);
  else loadUploadedImage(file);
});
sceneTourToggleEl.addEventListener('click', () => setSceneTourEnabled(!sceneTourEnabled));
defaultGeometryEls.forEach((button) => {
  button.addEventListener('click', () => loadDefaultGeometry(button.dataset.defaultGeometry));
});
liveModelAnalysisEl.addEventListener('change', () => {
  params.liveModelAnalysis = liveModelAnalysisEl.checked;
  document.documentElement.dataset.liveModelAnalysis = String(params.liveModelAnalysis);
  statusEl.textContent = params.liveModelAnalysis
    ? '实时笔触跟随已开启 · 拖动时动态重建'
    : '实时笔触跟随已关闭 · 松手后一次定稿';
  publishFlowState();
  requestFrame();
});
modelColorEls.forEach((button) => {
  button.addEventListener('click', () => applyModelColor(
    button.dataset.modelColor,
    button.getAttribute('aria-label') || '自定义颜色',
  ));
});
modelColorCustomEl.addEventListener('input', () => applyModelColor(
  modelColorCustomEl.value,
  modelColorCustomEl.value.toUpperCase(),
  { custom: true },
));
modelLightAngleEl.addEventListener('input', () => {
  modelLightAdjusting = true;
  setModelLightAngle(modelLightAngleEl.value);
});
modelLightAngleEl.addEventListener('change', () => {
  modelLightAdjusting = false;
  setModelLightAngle(modelLightAngleEl.value, { finalize: true });
});
restoreSceneButton.addEventListener('click', restoreBuiltInScene);
exportButtonEl.addEventListener('click', exportHighResolution);
videoExportButtonEl.addEventListener('click', exportGrowthVideo);
mount.addEventListener('wheel', handleCanvasWheel, { passive: false });
mount.addEventListener('dblclick', handleCanvasDoubleClick);
modelPreviewButtonEl.addEventListener('click', () => {
  setLayerMode(3);
  statusEl.textContent = '3D 模型预览 · 拖动旋转，滚轮调整距离';
});
modelPaintButtonEl.addEventListener('click', () => {
  const replaying = setLayerMode(5);
  statusEl.textContent = replaying
    ? '正在生成模型笔触 · 粗层 → 中层＋细层 → 稳定收尾'
    : '模型笔触结果 · 调整角度会实时重建';
});

let dragDepth = 0;
const hasDraggedFiles = (event) => Array.from(event.dataTransfer?.types || []).includes('Files');
window.addEventListener('dragenter', (event) => {
  if (!hasDraggedFiles(event)) return;
  event.preventDefault();
  dragDepth += 1;
  stageEl.classList.add('is-dragging');
  uploadDropEl.classList.add('is-dragging');
});
window.addEventListener('dragover', (event) => {
  if (!hasDraggedFiles(event)) return;
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
});
window.addEventListener('dragleave', (event) => {
  if (!hasDraggedFiles(event)) return;
  dragDepth = Math.max(0, dragDepth - 1);
  if (dragDepth === 0) {
    stageEl.classList.remove('is-dragging');
    uploadDropEl.classList.remove('is-dragging');
  }
});
window.addEventListener('drop', (event) => {
  if (!hasDraggedFiles(event)) return;
  event.preventDefault();
  dragDepth = 0;
  stageEl.classList.remove('is-dragging');
  uploadDropEl.classList.remove('is-dragging');
  const files = Array.from(event.dataTransfer?.files || []);
  const modelFile = files.find(isGlbFile);
  if (modelFile) loadGlbModel(modelFile);
  else loadUploadedImage(files.find((file) => file.type.startsWith('image/')));
});
window.addEventListener('paste', (event) => {
  const imageFile = Array.from(event.clipboardData?.files || []).find((file) => file.type.startsWith('image/'));
  if (imageFile) loadUploadedImage(imageFile);
});

document.querySelectorAll('[data-param]').forEach((input) => {
  const key = input.dataset.param;
  const output = document.querySelector(`[data-output="${key}"]`);
  input.addEventListener('input', () => {
    params[key] = Number(input.value);
    compositeDirty = true;
    if (output) {
      output.textContent = key === 'strokeCountK'
        ? Math.round(Number(input.value) * 1000).toLocaleString()
        : Number(input.value).toFixed(2);
    }
    if (['structure', 'geometry', 'semantic'].includes(key)) fieldDirty = true;
    if (key === 'length') strokeGeometryDirty = true;
    if (['strokeSize', 'coverage', 'dryness', 'viscosity', 'bristleDetail'].includes(key)) {
      strokeTargetsDirty = true;
    }
    if (flowSumEl) flowSumEl.textContent = (params.structure + params.geometry + params.semantic).toFixed(2);
    requestFrame();
  });
});

document.querySelector('[data-param="strokeCountK"]').addEventListener('change', () => {
  reseedStrokes();
  restartGrowth();
});

qualityModeEl.addEventListener('change', (event) => {
  params.qualityMode = event.target.value;
  resizeDirty = true;
  statusEl.textContent = `正在切换${event.target.selectedOptions[0].textContent}画质…`;
  requestFrame();
});

layerModeEls.forEach((input) => {
  input.addEventListener('change', () => {
    if (input.checked) setLayerMode(input.value);
  });
});

brushLayerEls.forEach((input) => {
  input.addEventListener('change', () => {
    params.brushLayers[Number(input.dataset.brushLayer)] = input.checked;
    syncBrushLayerVisibility();
  });
});

function setPaused(value) {
  params.paused = value;
  pauseButton.dataset.i18n = value ? 'resume' : 'pause';
  pauseButton.textContent = t(pauseButton.dataset.i18n);
  pauseButton.setAttribute('aria-pressed', String(value));
  statusEl.textContent = value ? '已暂停 · 笔触身份保持' : '实时运行 · 方向场已同步';
  updateGrowthControls();
  requestFrame();
}
pauseButton.addEventListener('click', () => {
  if (params.paused && currentGrowthTime() >= GROWTH_DURATION - 0.01) seekGrowth(0);
  setPaused(!params.paused);
});

growthTimelineEl.max = String(GROWTH_DURATION);
growthTimelineEl.addEventListener('pointerdown', () => setPaused(true));
growthTimelineEl.addEventListener('input', () => {
  const requestedTime = Number(growthTimelineEl.value);
  if (!params.paused) setPaused(true);
  seekGrowth(requestedTime);
  statusEl.textContent = `已定位 · ${formatGrowthTime(currentGrowthTime())}`;
});

function restartGrowth() {
  params.growthPlayback = true;
  growthStartTimeline = growthTimeline;
  growthWasActive = false;
  strokeTargetsDirty = true;
  if (params.paused) setPaused(false);
  updateGrowthControls(0);
  statusEl.textContent = '正在生长 · 粗层 → 中层＋细层 → 稳定收尾';
  requestFrame();
}

function regenerateGrowth() {
  reseedStrokes();
  restartGrowth();
  statusEl.textContent = '已重建 · 新种子开始生长';
}

replayGrowthButtonEl.addEventListener('click', regenerateGrowth);

window.addEventListener('keydown', (event) => {
  if (event.code === 'Space' && event.target === document.body) {
    event.preventDefault();
    setPaused(!params.paused);
  }
  if (event.key.toLowerCase() === 'b' && !event.repeat) {
    params.showBase = true;
    compositeDirty = true;
    requestFrame();
  }
});

window.addEventListener('keyup', (event) => {
  if (event.key.toLowerCase() === 'b') {
    params.showBase = false;
    compositeDirty = true;
    requestFrame();
  }
});

window.addEventListener('resize', () => {
  const configuredWidth = parseFloat(appEl.style.getPropertyValue('--panel-width'));
  if (panelResizeEnabled() && Number.isFinite(configuredWidth)) applyPanelWidth(configuredWidth);
  else updatePanelResizeAria();
  resizeDirty = true;
  requestFrame();
});
if ('ResizeObserver' in window) {
  const mountResizeObserver = new ResizeObserver(() => {
    if (panelResizing) return;
    resizeDirty = true;
    requestFrame();
  });
  mountResizeObserver.observe(mount);
  mountResizeObserver.observe(stageEl);
}

languageToggleEl.addEventListener('click', () => {
  currentLanguage = currentLanguage === 'zh' ? 'en' : 'zh';
  try {
    localStorage.setItem('wet-paint-flow-language', currentLanguage);
  } catch {
    // Language switching still works when storage is unavailable.
  }
  pauseButton.dataset.i18n = params.paused ? 'resume' : 'pause';
  applyLanguage();
  renderSceneLibrary();
  setSourceUi();
  updateGrowthControls();
  initializeVideoExport();
});

applyLanguage();
updatePanelResizeAria();
setSourceUi();
setLayerMode(5);
updateGrowthControls(prefersReducedMotion ? GROWTH_DURATION : 0);
initializeVideoExport();
setCanvasZoom(1);
setModelLightAngle(params.modelLightAngle);
requestFrame();
initializeSceneLibrary();
