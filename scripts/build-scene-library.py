#!/usr/bin/env python3
"""Build the browser-ready WebP scene library from local source paintings.

Install the optional Python dependency first:
    python -m pip install -r requirements-dev.txt

Source images must have independently verified provenance and redistribution
rights before generated WebP files are committed or published. See
ASSET_PROVENANCE.md.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageOps


SCENES = (
    ("sunflowers", "Sunflowers (The Met).jpg", "向日葵（1887）", "Sunflowers (1887)"),
    ("roses", "Roses (The Met).jpg", "玫瑰", "Roses"),
    ("auvers-church", "View of Auvers with Church (RISD).jpg", "奥维尔教堂景色", "View of Auvers with Church"),
    ("vineyards-auvers", "Vineyards at Auvers (SLAM).jpg", "奥维尔的葡萄园", "Vineyards at Auvers"),
    ("olive-trees-blue-sky", "Olive Trees (The Met).jpg", "橄榄树（大都会版）", "Olive Trees (The Met)"),
    ("cypresses", "Cypresses (The Met).jpg", "丝柏树", "Cypresses"),
    ("wheat-field-cypresses", "Wheat Field with Cypresses (The Met).jpg", "有丝柏的麦田", "Wheat Field with Cypresses"),
    ("olive-trees-yellow-sky", "Olive Trees (Mia).jpg", "橄榄树与黄天和太阳", "Olive Trees with Yellow Sky and Sun"),
    ("seascape-saintes-maries", "Seascape at Saintes-Maries (Commons).jpg", "圣玛丽海景", "Seascape at Saintes-Maries"),
    ("yellow-house", "The Yellow House (Commons).jpg", "黄房子", "The Yellow House"),
    ("starry-night", "The Starry Night (Commons).jpg", "星夜", "The Starry Night"),
)


def resized(image: Image.Image, max_edge: int) -> Image.Image:
    copy = image.copy()
    copy.thumbnail((max_edge, max_edge), Image.Resampling.LANCZOS)
    return copy


def save_webp(image: Image.Image, target: Path, quality: int) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    image.save(target, "WEBP", quality=quality, method=6, exact=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source_dir", type=Path, help="Folder containing the original paintings")
    parser.add_argument("--output", type=Path, default=Path("public/scenes"))
    parser.add_argument("--full-edge", type=int, default=1280)
    parser.add_argument("--thumb-edge", type=int, default=280)
    parser.add_argument("--full-quality", type=int, default=80)
    args = parser.parse_args()

    output = args.output.resolve()
    manifest = []

    for scene_id, filename, title_zh, title_en in SCENES:
        source = args.source_dir / filename
        if not source.is_file():
            raise FileNotFoundError(source)

        with Image.open(source) as opened:
            image = ImageOps.exif_transpose(opened).convert("RGB")
            original_width, original_height = image.size
            full = resized(image, args.full_edge)
            thumb = resized(image, args.thumb_edge)

        full_path = output / "full" / f"{scene_id}.webp"
        thumb_path = output / "thumb" / f"{scene_id}.webp"
        save_webp(full, full_path, args.full_quality)
        save_webp(thumb, thumb_path, 72)
        asset_version = hashlib.sha256(full_path.read_bytes()).hexdigest()[:12]

        manifest.append(
            {
                "id": scene_id,
                "title": title_zh,
                "titleEn": title_en,
                "src": f"./scenes/full/{scene_id}.webp",
                "thumb": f"./scenes/thumb/{scene_id}.webp",
                "assetVersion": f"sha256-{asset_version}",
                "width": full.width,
                "height": full.height,
                "originalWidth": original_width,
                "originalHeight": original_height,
            }
        )

    output.mkdir(parents=True, exist_ok=True)
    (output / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    total_bytes = sum(path.stat().st_size for path in output.rglob("*.webp"))
    print(f"Built {len(manifest)} scenes ({total_bytes / 1024 / 1024:.2f} MiB)")


if __name__ == "__main__":
    main()
