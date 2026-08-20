# Wet Paint Flow

<p align="center">
  <a href="#中文">中文</a> · <a href="#english">English</a>
</p>

> A browser-based Three.js flow-field painter for stable layered strokes and wet impasto shading.

<table>
  <tr>
    <td width="33.33%" align="center"><a href="./docs/examples/olive-grove-growth.mp4"><img src="./docs/examples/olive-grove-growth.webp" alt="Olive Grove stroke growth" /></a></td>
    <td width="33.33%" align="center"><a href="./docs/examples/glb-sculpture-study.mp4"><img src="./docs/examples/glb-sculpture-study.webp" alt="GLB sculpture interaction" /></a></td>
    <td width="33.33%" align="center"><a href="./docs/examples/starry-night-growth.mp4"><img src="./docs/examples/starry-night-growth.webp" alt="Starry Night stroke growth" /></a></td>
  </tr>
  <tr>
    <td align="center"><sub>Olive Grove</sub></td>
    <td align="center"><sub>GLB Sculpture</sub></td>
    <td align="center"><sub>Starry Night</sub></td>
  </tr>
</table>

<a id="中文"></a>

## 中文

Wet Paint Flow 是一个浏览器内运行的 Three.js 实时流场绘画实验。它从图片或
3D 场景提取结构方向，用稳定的粗、中、细三层 Bézier ribbon 笔触重建画面，
再以高度、湿度、刷毛沟槽和微表面光照合成湿油彩质感。

[在线体验](https://wet-paint-flow.simonxxoo.chatgpt.site/) ·
[资产溯源](./ASSET_PROVENANCE.md) ·
[技术来源与致谢](#致谢与技术来源) ·
[验收记录](./docs/REVIEW.md)

### 核心能力

- **图片与 GLB** — 导入 JPG、PNG、WebP、GIF 或单文件 GLB；也可使用内置
  球体、立方体、圆环和扭结。
- **结构流场** — 结构张量、深度、法线与语义信息形成无箭头 line field，
  正反向积分为三次 Bézier 笔触。
- **稳定三层笔触** — Poisson 分档播种保持笔触身份稳定，可独立显示粗、中、
  细层并重播生长。
- **湿油彩合成** — 颜料高度、湿度和刷毛沟槽进入独立状态缓冲，再以高度法线
  和微表面高光合成。
- **结果与导出** — 支持纯笔触、原图、融合与流场手稿视图，可导出最长边
  4096 px 的 PNG，并在浏览器支持时录制生长视频。
- **中英界面** — 可在中文与 English 界面之间切换。

### 运行方式

推荐 Node.js 22；最低版本遵循 `package.json` 中的 engines 约束。

```powershell
npm ci
npm run dev -- --port 4186
```

打开：

```text
http://127.0.0.1:4186/
```

### 交互

图片保持原始宽高比。旋转模型时先显示轻量 3D 预览，松手后只做一次方向场分析
和笔触重建，避免拖动中重复 GPU 读回。

桌面端可拖动画布与参数面板之间的分隔线，自由调整面板宽度；面板最小宽度为
360 px。

### 架构与性能策略

项目保持小而扁平的前端结构，不为一次性逻辑建立框架层：

- `main.js` — 场景捕获、方向场分析、种子积分、笔触几何、渲染、交互与导出
- `index.html` / `styles.css` — 界面结构与视觉呈现
- `public/scenes/` — 浏览器可用的 WebP 衍生图与运行时清单
- `worker/sites-static.js` — Sites 静态分发与 SPA fallback
- `tests/wet-paint-flow.test.js` — 静态架构与回归检查
- `scripts/build-scene-library.py` — 供维护者重新生成已核验场景衍生图的可选工具

主要性能边界：

- 一套实例化 ribbon geometry 表示全部可见笔触；
- 仅修改笔触几何或材质时复用分析结果；
- 方向与颜色采样的热路径避免临时对象分配；
- 生长期间连续渲染，静止后改为按需渲染；
- 质量模式会调整内部分析/渲染比例，但不改变导出规格。

发布目标为默认 **14,000** 笔、最大 **24,000** 笔。性能优化不得静默降低
笔触数、渲染比例、MSAA、shader 细节、材质 pass 或导出分辨率。

本 README 不保留未经本轮复测的精确 FPS 或毫秒数字；当前验收状态记录在
[`docs/REVIEW.md`](./docs/REVIEW.md)。

### 场景库维护

这个可选脚本需要 Python 3.10+ 和受约束的 Pillow 12.x：

```powershell
python -m pip install -r requirements-dev.txt
python scripts/build-scene-library.py <verified-source-directory>
```

原始画作文件不在仓库内。只有来源 URL 与数字复制品再分发权均已核验的文件才可
用于生成可提交资产；本地文件名不能作为授权证据。

### 验证

```powershell
npm run check
```

`check` 会运行 Vitest 静态回归测试和普通 Vite 生产构建。它不等于浏览器验收。
视觉或性能改动还必须在默认 14,000 和最大 24,000 笔下检查加载、交互、生长、
静止帧、PNG/视频导出和控制台错误。

### Sites 部署

`npm run check` 最后生成普通 `dist/`。Sites 需要另一种目录布局，因此部署前
必须最后运行 `build:sites`：

```powershell
npm ci
npm run check
# 提交并推送已验收的准确源码状态
npm run build:sites
```

随后以已推送 commit SHA 保存 Sites version，只部署该已保存版本，并回读部署
状态与生产 URL。Fork 必须绑定自己的 Sites 项目；仓库内的 project ID 不授予
部署权限。

### 贡献

欢迎范围清楚的小型 issue 和 pull request。修改前请先说明可观察问题，避免顺手
重构无关代码；提交前运行 `npm run check`，视觉或性能改动附 14k/24k 浏览器
证据。不要提交来源或授权不清的图像。

普通问题使用 [GitHub Issues](https://github.com/simonxxooxxoo/wet-paint-flow/issues)。

### 许可证与来源

- 项目代码：[MIT](./LICENSE)
- 第三方许可证文本：[THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)
- 内置图像状态：[ASSET_PROVENANCE.md](./ASSET_PROVENANCE.md)

MIT 代码许可证不授予第三方图像资产的使用权；每项内置图像均遵循上述文件记录
的对应来源条款。

### 致谢与技术来源

下表把主要技术来源与当前实现逐项对应。论文和文章用于方法参考；除明确列出的
MIT 依赖外，本项目没有复制这些论文的实现代码。

| 来源 | Wet Paint Flow 实际采用的部分 | 没有采用的部分 |
| --- | --- | --- |
| Aaron Hertzmann，[*Painterly Rendering with Curved Brush Strokes of Multiple Sizes*](https://mrl.cs.nyu.edu/publications/painterly98/) | 从粗到细的多尺度笔触，以及沿结构方向弯曲的曲线笔触；对应粗、中、细三层 Bézier ribbon | 未复现论文的逐层残差比较与自动补笔流程 |
| Jan Eric Kyprianidis & Henry Kang，[*Image and Video Abstraction by Coherence-Enhancing Filtering*](https://doi.org/10.1111/j.1467-8659.2011.01882.x) | 由 `Jxx / Jyy / Jxy` 结构张量计算连续方向与置信度 | 未实现论文的 Poisson 张量平滑、LIC 或 shock filtering |
| Robert Bridson，[*Fast Poisson Disk Sampling in Arbitrary Dimensions*](https://www.cs.ubc.ca/~rbridson/docs/bridson-siggraph07-poissondisk.pdf) | 用网格加速最小距离播种，并为粗、中、细三层使用不同间距 | 当前使用确定性候选序列与 rejection sampling，不是论文的 active-list / annulus 算法 |
| David Li，[Fluid Paint / `dli/paint`](https://github.com/dli/paint) | 将颜料颜色与高度、湿度、刷毛沟槽分开，并由高度法线合成湿润高光 | 未移植流体求解、压力投影、颜料对流或完整笔刷物理模拟 |
| Walter et al.，[<i>Microfacet Models for Refraction through Rough Surfaces</i>](https://www.cs.cornell.edu/~srm/publications/EGSR07-btdf.html) | 使用 GGX / Trowbridge–Reitz 微表面分布表现湿颜料高光 | 未实现论文的 BTDF、折射或完整粗糙表面传输模型 |
| Brian Karis，[<i>Real Shading in Unreal Engine 4</i>](https://cdn2.unrealengine.com/Resources/files/2013SiggraphPresentationsNotes-26915738.pdf) | 实时 GGX、Schlick Fresnel 与 Smith 几何遮蔽近似，包括 `k = (roughness + 1)² / 8` | 未采用 UE4 的完整材质、IBL 与能量守恒管线 |
| [Three.js](https://github.com/mrdoob/three.js) | WebGL 渲染、`WebGLRenderTarget`、`ShaderMaterial`、`InstancedBufferGeometry`、加载器与控制器 | 它是 MIT 运行时依赖，不是笔触算法来源 |

研究与视觉背景还包括 Hertzmann 与 Perlin 的
[*Painterly Rendering for Video and Interaction*](https://mrl.cs.nyu.edu/publications/painterly-video/)、
Lamberti、Sanna 与 Paravati 的
[*Computer-assisted analysis of painting brushstrokes*](https://link.springer.com/article/10.1186/1687-5281-2014-53)，
以及[梦速写_NextRealm](https://space.bilibili.com/332891269)公开展示的 shader
与渐进渲染作品（示例：[《三渲二_新做shader初步效果测试》](https://www.bilibili.com/video/BV1LpSNYTEtT/)）。
这些内容提供时间连续性、笔触分析和视觉交互方面的研究背景；当前仓库没有复现
它们的完整系统，也不主张使用了其未公开源码。

<p align="right"><a href="#wet-paint-flow">返回顶部 ↑</a></p>

<a id="english"></a>

## English

Wet Paint Flow is a browser-based Three.js flow-field painter. It derives a
structural direction field from an image or 3D scene, reconstructs the view
with stable coarse, medium, and fine Bézier ribbon strokes, and composites a
wet-paint surface from height, moisture, bristle, and lighting data.

[Live demo](https://wet-paint-flow.simonxxoo.chatgpt.site/) ·
[Asset provenance](./ASSET_PROVENANCE.md) ·
[Credits and technical references](#credits-and-technical-references) ·
[Review](./docs/REVIEW.md)

### Highlights

- **Images and GLB** — Import local JPG, PNG, WebP, GIF, or self-contained GLB
  files, or start from the built-in sphere, box, torus, and torus knot.
- **Structural flow field** — Structure, depth, normals, and semantic cues form
  an unoriented line field that drives bidirectional cubic Bézier strokes.
- **Stable three-layer strokes** — Stable Poisson-stratified seeds support
  replayable coarse, medium, and fine layers.
- **Wet-paint shading** — Paint height, wetness, and bristle channels feed a
  separate state buffer and a height-normal, micro-surface composite.
- **Output** — Switch among stroke, source, blend, and flow-sketch views;
  export a PNG up to 4096 px on the longest edge or a real-time growth
  recording when the browser supports it.
- **Bilingual UI** — Switch between Chinese and English.

### Quick Start

Node.js 22 is recommended; the exact supported range is declared in
`package.json`.

```powershell
npm ci
npm run dev -- --port 4186
```

Open:

```text
http://127.0.0.1:4186/
```

### Interaction

Images preserve their aspect ratio. Model orbiting uses a lightweight 3D
preview and performs one direction-field analysis and stroke rebuild on
release instead of repeatedly reading the GPU while dragging.

On desktop, drag the divider between the canvas and control panel to resize
the panel freely; its minimum width is 360 px.

### Architecture and Performance

The repository keeps a small, flat frontend surface and avoids framework
layers for one-off behavior:

- `main.js` — scene capture, direction-field analysis, seed integration,
  stroke geometry, rendering, interaction, and export
- `index.html` / `styles.css` — interface structure and presentation
- `public/scenes/` — browser-ready WebP derivatives and runtime manifest
- `worker/sites-static.js` — Sites static delivery and SPA fallback
- `tests/wet-paint-flow.test.js` — static architecture and regression checks
- `scripts/build-scene-library.py` — optional maintainer tool for rebuilding
  verified scene derivatives

Main performance boundaries:

- one instanced ribbon geometry represents all visible strokes;
- analysis results are reused when only stroke geometry or material changes;
- hot direction and color sampling paths avoid temporary allocations;
- rendering is continuous during growth and becomes demand-driven when idle;
- quality modes change internal analysis/render scale without changing exports.

The release target is **14,000 strokes by default** and **24,000 maximum**.
Optimization must not silently reduce stroke count, render scale, MSAA,
shader detail, material passes, or export resolution.

This README does not preserve exact frame-rate or timing claims without a fresh
browser run. Current acceptance status lives in
[`docs/REVIEW.md`](./docs/REVIEW.md).

### Rebuilding the Scene Library

The optional maintainer script requires Python 3.10+ and the constrained
Pillow 12.x range:

```powershell
python -m pip install -r requirements-dev.txt
python scripts/build-scene-library.py <verified-source-directory>
```

Original source images are not distributed here. Do not commit generated
derivatives until the exact source URL and digital-reproduction redistribution
rights are verified. A local filename is not licensing evidence.

### Validation

```powershell
npm run check
```

`check` runs the Vitest static regression suite and a normal Vite production
build. It does not replace browser acceptance. Visual or performance changes
still require checks at 14,000 and 24,000 strokes for loading, interaction,
growth, idle frames, PNG/video export, and console errors.

### Sites Deployment

`npm run check` leaves a normal Vite `dist/`; Sites requires a different
directory layout, so `build:sites` must be the final build step before
packaging:

```powershell
npm ci
npm run check
# Commit and push the exact accepted source state
npm run build:sites
```

Then save a Sites version from the pushed commit SHA, deploy only that saved
version, and read back the deployment status and production URL. Forks must
bind their own Sites project; the checked-in project ID does not grant
deployment access.

### Contributing

Focused issues and pull requests are welcome. Describe the observable problem
before changing code, avoid opportunistic refactors, run `npm run check`, and
attach 14k/24k browser evidence for visual or performance changes. Do not add
assets without verified provenance and redistribution terms.

Use [GitHub Issues](https://github.com/simonxxooxxoo/wet-paint-flow/issues) for
ordinary bugs.

### License and Attribution

- Project code: [MIT](./LICENSE)
- Third-party license notices: [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)
- Bundled image status: [ASSET_PROVENANCE.md](./ASSET_PROVENANCE.md)

The MIT code license does not grant rights to third-party image assets; each
bundled image follows the source-specific status recorded above.

### Credits and Technical References

The table maps each major technical source to the current implementation.
Papers and articles are methodological references; except for the explicitly
listed MIT dependencies, their implementation code is not copied here.

| Source | Used in Wet Paint Flow | Not used |
| --- | --- | --- |
| Aaron Hertzmann, [*Painterly Rendering with Curved Brush Strokes of Multiple Sizes*](https://mrl.cs.nyu.edu/publications/painterly98/) | Coarse-to-fine, multi-scale strokes and curved strokes following structural direction; represented here by coarse, medium, and fine Bézier ribbons | The paper's layered residual comparison and automatic repaint algorithm are not reproduced |
| Jan Eric Kyprianidis & Henry Kang, [*Image and Video Abstraction by Coherence-Enhancing Filtering*](https://doi.org/10.1111/j.1467-8659.2011.01882.x) | Continuous orientation and confidence derived from the `Jxx / Jyy / Jxy` structure tensor | No Poisson tensor smoothing, LIC, or shock filtering from the paper |
| Robert Bridson, [*Fast Poisson Disk Sampling in Arbitrary Dimensions*](https://www.cs.ubc.ca/~rbridson/docs/bridson-siggraph07-poissondisk.pdf) | Grid-accelerated minimum-distance seeding with different spacing for coarse, medium, and fine layers | The current deterministic candidate sequence and rejection sampler do not reproduce Bridson's active-list / annulus algorithm |
| David Li, [Fluid Paint / `dli/paint`](https://github.com/dli/paint) | Separation of pigment color from height, wetness, and bristle furrows, followed by height-normal wet highlights | No fluid solver, pressure projection, pigment advection, or complete physical-brush simulation is ported |
| Walter et al., [*Microfacet Models for Refraction through Rough Surfaces*](https://www.cs.cornell.edu/~srm/publications/EGSR07-btdf.html) | GGX / Trowbridge–Reitz microfacet distribution for wet-paint highlights | No BTDF, refraction, or full rough-surface transmission model |
| Brian Karis, [*Real Shading in Unreal Engine 4*](https://cdn2.unrealengine.com/Resources/files/2013SiggraphPresentationsNotes-26915738.pdf) | Real-time GGX, Schlick Fresnel, and Smith geometry approximation, including `k = (roughness + 1)² / 8` | No complete UE4 material, IBL, or energy-conservation pipeline |
| [Three.js](https://github.com/mrdoob/three.js) | WebGL rendering, `WebGLRenderTarget`, `ShaderMaterial`, `InstancedBufferGeometry`, loaders, and controls | It is the MIT runtime dependency, not the source of the stroke algorithm |

Additional research and visual context includes Hertzmann and Perlin's
[*Painterly Rendering for Video and Interaction*](https://mrl.cs.nyu.edu/publications/painterly-video/),
Lamberti, Sanna, and Paravati's
[*Computer-assisted analysis of painting brushstrokes*](https://link.springer.com/article/10.1186/1687-5281-2014-53),
and [梦速写_NextRealm](https://space.bilibili.com/332891269)'s public shader
and progressive-rendering work (for example,
[*Toon Rendering — Initial Shader Test*](https://www.bilibili.com/video/BV1LpSNYTEtT/)).
They informed research on temporal continuity, brushstroke analysis, and visual
interaction; this repository does not reproduce their complete systems or
claim access to unpublished source code.

<p align="right"><a href="#wet-paint-flow">Back to top ↑</a></p>
