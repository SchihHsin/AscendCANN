#!/usr/bin/env python3
"""Keep ImageGen's perspective shells while mapping exact product screenshots onto screen planes."""
from pathlib import Path
from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent


def solve_linear(matrix, values):
    """Small Gauss-Jordan solver for the 8 perspective coefficients."""
    rows = [list(map(float, row)) + [float(value)] for row, value in zip(matrix, values)]
    n = len(values)
    for col in range(n):
        pivot = max(range(col, n), key=lambda row: abs(rows[row][col]))
        rows[col], rows[pivot] = rows[pivot], rows[col]
        divisor = rows[col][col]
        if abs(divisor) < 1e-12:
            raise ValueError("Degenerate screen quadrilateral")
        rows[col] = [value / divisor for value in rows[col]]
        for row in range(n):
            if row == col:
                continue
            factor = rows[row][col]
            rows[row] = [a - factor * b for a, b in zip(rows[row], rows[col])]
    return [rows[i][-1] for i in range(n)]


def perspective_coeffs(source_size, destination_quad):
    sw, sh = source_size
    source = [(0, 0), (sw - 1, 0), (sw - 1, sh - 1), (0, sh - 1)]
    matrix, values = [], []
    for (u, v), (x, y) in zip(source, destination_quad):
        matrix.append([x, y, 1, 0, 0, 0, -u * x, -u * y])
        values.append(u)
        matrix.append([0, 0, 0, x, y, 1, -v * x, -v * y])
        values.append(v)
    return solve_linear(matrix, values)


def paste_perspective(background_path, screenshot, output_path, destination_quad, corner_radius=0):
    background = Image.open(background_path).convert("RGBA")
    screenshot = screenshot.convert("RGBA")
    if corner_radius:
        mask = Image.new("L", screenshot.size, 0)
        ImageDraw.Draw(mask).rounded_rectangle(
            (0, 0, screenshot.width - 1, screenshot.height - 1),
            radius=corner_radius,
            fill=255,
        )
        screenshot.putalpha(mask)
    warped = screenshot.transform(
        background.size,
        Image.Transform.PERSPECTIVE,
        perspective_coeffs(screenshot.size, destination_quad),
        resample=Image.Resampling.BICUBIC,
        fillcolor=(0, 0, 0, 0),
    )
    composite = Image.alpha_composite(background, warped).convert("RGB")
    composite.save(output_path, "JPEG", quality=95, subsampling=0, optimize=True)


# The official desktop homepage was captured at 1440x900; crop to the visible
# 16:9 screen area so its live navigation, hero, notice strip, and article cards
# retain their actual colors and hierarchy in the angled browser window.
site_full = Image.open(HERE / "hiascend-developer-style-reference-1440.png").convert("RGB")
site_screen = site_full.crop((0, 0, 1440, 790))
paste_perspective(
    HERE / "entry-traditional-ui.png",
    site_screen,
    HERE / "entry-traditional-ui-composite.jpg",
    [(392, 194), (1600, 278), (1587, 859), (383, 876)],
)

# Reuse the repository's existing Codex task/workspace screenshot in the
# generated perspective app: exact brief and Context content replace its main
# pane; the outer app and session navigation follow the same visual reference.
codex_full = Image.open(HERE / "12-codex-task-brief.png").convert("RGB")
codex_screen = codex_full.crop((375, 60, 1622, 925))
paste_perspective(
    HERE / "entry-agent-workspace.png",
    codex_screen,
    HERE / "entry-agent-workspace-composite.jpg",
    [(469, 75), (1471, 133), (1519, 843), (472, 852)],
)
