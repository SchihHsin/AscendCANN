#!/usr/bin/env python3
"""Assemble the existing Ascend Studio screenshots into a 16:9 PowerPoint."""

import json
from pathlib import Path

from PIL import Image
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.util import Inches


HERE = Path(__file__).resolve().parent
OUTLINE = HERE / "composition.json"
OUTPUT = HERE / "ascend-studio-combined-report.pptx"
SLIDE_W = Inches(13.333333)
SLIDE_H = Inches(7.5)


def create_journey_crops(outline):
    source = HERE / outline["journey_source"]["image"]
    task_box = outline["journey_source"]["task_crop"]
    learning_box = outline["journey_source"]["learning_crop"]
    with Image.open(source) as image:
        image.crop(task_box).save(HERE / "assets/03-task-developer-journey.png")
        image.crop(learning_box).save(HERE / "assets/04-learning-developer-journey.png")


def image_background_color(path):
    with Image.open(path) as image:
        pixel = image.convert("RGB").getpixel((0, 0))
    return RGBColor(*pixel)


def add_image_slide(prs, item, index):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    image_path = (HERE / item["image"]).resolve()
    if not image_path.exists():
        raise FileNotFoundError(image_path)

    slide.background.fill.solid()
    slide.background.fill.fore_color.rgb = image_background_color(image_path)
    with Image.open(image_path) as image:
        ratio = image.width / image.height
    slide_ratio = SLIDE_W / SLIDE_H
    if ratio >= slide_ratio:
        width = SLIDE_W
        height = int(SLIDE_W / ratio)
    else:
        height = SLIDE_H
        width = int(SLIDE_H * ratio)
    left = int((SLIDE_W - width) / 2)
    top = int((SLIDE_H - height) / 2)
    picture = slide.shapes.add_picture(
        str(image_path), left, top, width=width, height=height
    )
    picture.name = f"P{index:02d} · {item['name']}"
    picture._element.nvPicPr.cNvPr.set("descr", item["source_url"])
    picture.click_action.hyperlink.address = item["source_url"]
    return slide


def main():
    outline = json.loads(OUTLINE.read_text(encoding="utf-8"))
    create_journey_crops(outline)

    prs = Presentation()
    prs.slide_width = SLIDE_W
    prs.slide_height = SLIDE_H
    prs.core_properties.title = outline["title"]
    prs.core_properties.subject = "原报告封面、报告第 2 页、双用户旅程与 Ascend Studio PC 页面"
    prs.core_properties.author = "Ascend Studio"
    for index, item in enumerate(outline["slides"], 1):
        add_image_slide(prs, item, index)
    prs.save(OUTPUT)
    print(f"已生成：{OUTPUT}")
    print(f"页数：{len(prs.slides)}")


if __name__ == "__main__":
    main()
