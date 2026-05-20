---
name: ascendops-theme
description: Apply the AscendOps dashboard visual style to any HTML kanban or dashboard. Use this skill whenever the user asks to apply a specific dashboard theme, switch to the AscendOps style, or wants a kanban/dashboard that looks like the AscendOps design system. Trigger when the user says things like "用这个风格", "切换成AscendOps样式", "apply the dashboard theme", "一键换风格", or asks to replicate the energizing purple-teal gradient style. This skill defines the exact CSS tokens, component patterns, JS rendering rules, and layout rules to recreate the AscendOps look: glassmorphism hero KPI cards, grade-colored scene cards, heatmap matrix with click-detail panels, pipeline stage cards, VOD left-right layout, pain ranked lists, donut charts, SVG trend lines, and SVG radar charts — all on a warm gray #F8F8F9 background with a purple-teal accent system.
---

# AscendOps Theme Skill  v4

This skill reproduces the **AscendOps 算子开发体验看板** visual design system in full, including CSS, JS rendering patterns, layout rules, and ECharts color configs.

## How to apply
1. Read `references/tokens.md` — CSS custom properties (colors, radii, shadows, font imports)
2. Read `references/components.md` — complete CSS for every component class
3. Read `references/patterns.md` — JS rendering patterns (heatmap, scene cards, charts, trend/radar SVG)
4. Replace the target HTML's `<style>` block; patch JS chart init colors per `references/patterns.md`

> If the target HTML uses different class names, write a short CSS adapter mapping their selectors to AscendOps rules rather than renaming elements.

---

## Design System Overview

### Personality
Energizing, data-dense, tech-professional. Vibrant gradients over a neutral gray canvas, glassmorphism on hero metrics, pastel tints on scene cards, monospace numbers everywhere data appears.

### Color System — 5 Hue Families + Gray Scale
See `references/tokens.md` for all hex values.

| Role | Variable | Usage |
|---|---|---|
| Primary | `--purple-core / --purple-bright` | Tabs, active states, CTAs, matrix selection |
| Accent | `--teal-core` | Rationale sidebar, callout badges |
| Good / ok | `--green-dark` | Positive trends, high scores ≥ 80 |
| Warn / mid | `--gold-dark` | Moderate scores 55–79 |
| Bad | `--coral-dark` | Negative trends, scores < 55 |
| Background | `#F8F8F9` | Page canvas |
| Card | `#FFFFFF` | All section cards |
| Border | `#E1E2E4` | Default card/row border |

### Grade → Color Mapping (CRITICAL)
**Always derive color from `grade` / score value, never from position/rank index.**

| grade | bg token | fg token | hex fg |
|---|---|---|---|
| `bad` (< 55) | `var(--coral-light)` | `var(--coral-dark)` | `#E63838` |
| `mid` (55–79) | `var(--gold-light)` | `var(--gold-dark)` | `#FD9A00` |
| `ok` (≥ 80) | `var(--green-light)` | `var(--green-dark)` | `#37C597` |

### Typography
- Body / UI: **Inter** (400/500/600/700/800/900)
- All numbers, scores, metrics, dates: **JetBrains Mono** (500/700)

### Radius Scale
`--radius-xl: 22px` · `--radius-l: 18px` · `--radius-m: 12px` · `--radius-s: 8px`

### Shadows
- `--shadow-soft`: `0 1px 2px rgba(39,51,71,.04), 0 4px 14px rgba(39,51,71,.04)`
- `--shadow-pop`: `0 10px 30px rgba(106,103,206,.18)`

---

## Component Inventory

| Component | Reference file |
|---|---|
| CSS tokens (`:root`) | `references/tokens.md` |
| All CSS classes (296 total) | `references/components.md` |
| Hero banner + glass KPI cards | `references/components.md` § Hero |
| Heatmap matrix + click-detail | `references/components.md` § Matrix · `references/patterns.md` § Heatmap |
| Scene cards (grade-colored) | `references/components.md` § Scene Cards · `references/patterns.md` § Scene Cards |
| Pipeline stage cards | `references/components.md` § Pipeline |
| VOD left-right layout | `references/components.md` § VOD · `references/patterns.md` § VOD |
| Pain ranked list | `references/components.md` § Pain List |
| Donut chart (ECharts) | `references/patterns.md` § Donut |
| SVG trend line | `references/patterns.md` § Trend |
| SVG radar | `references/patterns.md` § Radar |
| ECharts color palette | `references/patterns.md` § ECharts Colors |
