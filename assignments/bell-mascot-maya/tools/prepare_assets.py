"""Prepare reference images and the "GO BELLS!" decal for the Maya project.

Crops the single supplied photo (front figure on the left, side figure on the
right) into two reference images. Crops are pure crops: no resizing or
stretching, so each image keeps its original pixel aspect ratio.

Run from anywhere:  python3 tools/prepare_assets.py
Requires Pillow (pip install pillow). Not needed inside Maya.
"""
import os

from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
SRC_DIR = os.path.join(HERE, "..", "sourceimages")
ORIGINAL = os.path.join(SRC_DIR, "reference_original_front_and_side.png")

# Pixel boxes (left, top, right, bottom) in the original 1900 x 1544 image.
# Front crop is symmetric about the mascot's vertical axis (x = 476) so the
# image-plane offset in X is exactly zero.
FRONT_BOX = (60, 0, 892, 1544)
# The side figure sits close to the front figure, so its crop cannot be
# symmetric about the body axis (x = 1199); the script applies the offset.
SIDE_BOX = (870, 0, 1640, 1544)


def main():
    img = Image.open(ORIGINAL).convert("RGB")
    for name, box in (("reference_front.png", FRONT_BOX), ("reference_side.png", SIDE_BOX)):
        crop = img.crop(box)
        out = os.path.join(SRC_DIR, name)
        crop.save(out)
        print("wrote", os.path.normpath(out), crop.size)

    font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
    width, height = 2400, 720
    decal = Image.new("RGBA", (width, height), (255, 255, 255, 0))
    draw = ImageDraw.Draw(decal)
    font = ImageFont.truetype(font_path, 560)
    text = "GO BELLS!"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    scale = min((width * 0.97) / tw, (height * 0.97) / th)
    font = ImageFont.truetype(font_path, int(560 * scale))
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(((width - tw) / 2 - bbox[0], (height - th) / 2 - bbox[1]), text,
              font=font, fill=(244, 244, 240, 255))
    out = os.path.join(SRC_DIR, "texture_go_bells_decal.png")
    decal.save(out)
    print("wrote", os.path.normpath(out), decal.size)


if __name__ == "__main__":
    main()
