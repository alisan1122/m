"""Prepare the uploaded logo and product cut-outs for the Remotion project.

usage: python3 scripts/prepare_assets.py <uploads_dir> <public_dir>
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

src, out = Path(sys.argv[1]), Path(sys.argv[2])
GOLD = np.array([233, 199, 123], float)


def trim(im: Image.Image, pad: int = 8) -> Image.Image:
    box = im.getchannel("A").point(lambda v: 255 if v > 24 else 0).getbbox()
    l, t, r, b = box
    return im.crop((max(l - pad, 0), max(t - pad, 0), min(r + pad, im.width), min(b + pad, im.height)))


# The logo is a dark embossed render: keep only its light rims and tint them gold.
logo = np.array(Image.open(src / "d252440e-image.png").convert("RGBA")).astype(float)
lum = logo[..., :3].max(-1) / 255
alpha = np.clip((lum - 0.04) / 0.5, 0, 1) ** 0.8
rgb = np.clip(GOLD * (0.75 + 0.6 * lum[..., None]), 0, 255)
gold = np.dstack([rgb, alpha * 255]).astype(np.uint8)
trim(Image.fromarray(gold, "RGBA")).save(out / "logo-line.png")

products = {
    "41657836": "box.png",          # navy gift tube with gold logo
    "c1fa7967": "bottle-navy.png",  # navy bottle with gold cap
    "55ae6028": "bottle-amber.png", # Prime roze amber bottle
    "21a13e20": "bottle-guilty.png",
    "7a6fa907": "bottle-grey.png",
}
for key, name in products.items():
    im = Image.open(src / f"{key}-image.png").convert("RGBA")
    if name == "bottle-navy.png":
        im = im.crop((290, 0, im.width, im.height))  # drop the stray "ime" lettering
    trim(im).save(out / "products" / name)
    print(name, trim(im).size)

# The source video is heavily underexposed; it is lifted once here (gamma + warm balance)
# and the composition plays public/video-graded.mp4:
#   ffmpeg -i <upload>.mp4 -vf "eq=gamma=2.4:contrast=1.15:brightness=0.02:saturation=1.3,\
#     colorbalance=rs=0.03:bs=-0.04:rm=0.03:bm=-0.03" -c:v libx264 -crf 16 -pix_fmt yuv420p \
#     -c:a copy public/video-graded.mp4
