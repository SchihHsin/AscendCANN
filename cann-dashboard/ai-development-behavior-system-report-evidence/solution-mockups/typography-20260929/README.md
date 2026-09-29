# Solution mockups typography pass · 2026-09-29

## Final assets

All three final images are 1672×941 PNGs. Originals remain unchanged. They were generated with built-in image_gen, and every final output was viewed. No CLI, HTML, SVG, or scripted drawing was used.

| Original | Final |
|---|---|
| `q1-assembly-20260929/01-codex-task-capability-selection-v1.png` | [选配图 v3](../q1-assembly-20260929/01-codex-task-capability-selection-typography-v3.png) |
| `q1-assembly-20260929/02-codex-capability-usage-record-v1.png` | [使用记录图 v3](../q1-assembly-20260929/02-codex-capability-usage-record-typography-v3.png) |
| `02-codex-decision-guidance.png` | [决策辅助图 v2](../02-codex-decision-guidance-typography-v2.png) |

The q1 typography-v2 candidates and the first decision-guidance candidate are local intermediate drafts only, not final deliverables. The initial decision-guidance output changed “整块尺寸” to “整数尺寸”; the text-corrected output is the final image.

## Reference and visual review

The repository README for cann-dashboard/ploy-interaction-lab/learning-canvas-story/images/codex-workspace-user.png describes it as a user-provided Codex Workspace interface reference. It was used only for workspace shell and ordinary UI-density cues; its blue-purple desktop wallpaper and snake-game content were not copied. Typography was visually compared by relative scale, not certified by pixel measurement. The parent agent accepted all three final images. The first image's buttons remain slightly tall; no further pixel-specific iteration was requested.

## Invariant checks

- Each canvas remains 1672×941 and full-bleed; the whole image was not shrunk, and no outer frame or commentary-number badge was added.
- Problem 01 selection preserves the three-column shell, task conditions marked 待确认, three candidate capabilities, read-only scope, and the boundaries that code changes/build/run and NPU assessment remain unauthorized.
- Problem 01 usage preserves the original 01–03 activity sequence and distinguishes example Skill loading, an example MCP receipt, and an NPU assessment that has not run with no performance conclusion. Environment and acceptance conditions remain 待确认.
- Problem 02 preserves diagnostic facts, attempted compiler-parameter change, unresolved tail-block index range, three diagnostic routes, and the instruction to inspect the tail-block index without changing the precision threshold. Unnecessary 01/02/03 heading prefixes were removed; content order is unchanged.
- The first decision-guidance generation changed “整块尺寸” to “整数尺寸”. A separate text-localization edit corrected it; the final image visibly reads: “当输入为整块尺寸（如 [16, 32]）时结果正常；当输入为非整块尺寸（如 [17, 33]）时在同一位置报精度不匹配。”
- Manual visual review found no evident gibberish, clipping, or missing boundary labels. This is not automated OCR verification.
- Final callout coordinates: usage state uses (23.8,28.5,44.8,21), (23.8,52,44.8,28), (23.8,83,44.8,14). Decision guidance uses (16.5,14.2,37.1,59.2), (54.7,14.2,43.7,59.2), (16.5,74.9,81.9,22.1). The parent adjusted selection-image marks separately based on the final image.

## Complete final prompts

The following are the actual prompts used for the three final images; problem 02 includes its one-phrase correction prompt.

### Problem 01 · task and capability selection · final v3

~~~~text
Use case: ui-mockup.
Asset type: desktop workspace concept screenshot, typography/layout correction v3.
Input images: Image 1: edit target (the previously reduced state-A concept, still too large); Image 2: genuine user-provided Codex Workspace screenshot, reference ONLY for real desktop UI density, typography hierarchy and compact shell styling. Do not copy its blue-purple desktop wallpaper or snake-game content.
Primary request: Make a clearly stronger second reduction of internal UI typography and controls. The current target still reads oversized. Reduce ordinary body and navigation text about another 25% relative to Image 1, reduce primary/secondary button height about 35% relative to Image 1, and modestly reduce icons. Preserve legibility. This is internal app layout editing, not whole-image scaling.
Composition/framing: maintain the exact 1672×941 canvas, full-bleed workspace screenshot and current 3-column responsibility structure (sidebar, task workspace, permission inspector). Keep content order and broad regions, but allow more natural whitespace; do not stretch controls/cards to fill available height.
Target density at this 1672×941 screenshot: ordinary body and navigation 14–16 px; secondary/meta/status text 12–13 px; task title 20–22 px; section headings 16–18 px; normal buttons 32–36 px tall; icons 16–20 px. No giant headers. Typical desktop spacing; buttons and rows compact, restrained, aligned to text.
Text and content: preserve the target's existing Chinese and English UI labels verbatim and in the same order, including Codex sidebar, task title, tab labels, three task-condition fields all marked 待确认, three selected candidates (性能分析 Skill / 环境检查 Skill / 文档 MCP), their uses, inputs and applicability statements, and the full right permission inspector. Preserve the exact states: only read-only start; loading Skill and connecting document MCP allowed after confirmation; code changes/build/run and NPU performance assessment not authorized; no performance assessment has run. Keep “加载方法，不等于已经执行。” and “设计提案 · 不代表平台现成功能.” Do not add, remove, paraphrase, fabricate, or alter any claims or values.
Style: compact real desktop system-sans typography, pale gray sidebar, white workspace and inspector, fine dividers, restrained blue selection/action emphasis, modest thin-line icons. Preserve the existing Codex-style shell and relative column widths.
Avoid: another merely slight reduction, poster-scale titles, 18–20 px body copy, oversized navigation, 58 px buttons, enlarged icons, whole-image shrink, outer frame/container/wallpaper, new graphics, extra badges, card inflation, text clipping, gibberish, watermark, invented versions/chips/measurement/results.
~~~~

### Problem 01 · capability usage record · final v3

~~~~text
Use case: ui-mockup.
Asset type: desktop workspace concept screenshot, final typography/layout correction for state B.
Input images: Image 1: edit target; Image 2: accepted v3 concept screenshot establishing the final compact typography/control density and Codex-like shell for this same task; Image 3: genuine user-provided Codex Workspace screenshot, reference only for authentic desktop UI hierarchy and shell. Do not copy Image 3's blue-purple desktop wallpaper or snake-game content.
Primary request: edit the interface inside Image 1 to match Image 2's accepted compact desktop UI density. The target's large titles, navigation, timeline text/numbers, and buttons need visibly smaller, ordinary application proportions. Do not scale down the whole canvas.
Composition/framing: preserve exact 1672×941 landscape, full-bleed app UI, left sidebar / central activity timeline / right confirmation inspector. Keep the three-region structure and all state content in order, but allow natural whitespace rather than stretching controls to fill the canvas.
Typography scale: match Image 2's accepted appearance: task header about 20–22 px; section headings 16–18 px; ordinary body and navigation about 14–16 px; metadata/status about 12–13 px. Timeline markers 01/02/03 are actual product step labels and must remain, but be compact ordinary markers (small 28–32 px circles at most, not oversized bubbles). Typical desktop controls; primary and secondary button heights around 32–38 px, compact padding. Small icons around 16–20 px.
Text/content invariant: preserve the target's existing Chinese and English text verbatim, exact section ordering, and each distinct status. This includes sidebar and task title; both navigation tabs with 使用记录 active; heading and subtitle; 01 “Skill 方法已加载” with “已加载 · 示例”, two Skill names, method/context explanation, and warning that loading is not execution and the check command has not run; 02 “文档 MCP 查询回执” with “只读查询 · 示例”, query/return/source/applicable-version fields, example source-position link and note that this is receipt structure not real result; 03 “性能评测” with “待接 NPU”, missing matched NPU/CANN environment, “未运行 · 无性能结论”; right-side confirmation fields CANN version, chip model, acceptance condition all “待确认”; current read-only permission; code/build/run still require authorization; next step wording; buttons “补充任务条件” and “开始性能评测”; bottom design-proposal boundary. Do not omit, paraphrase, fabricate, or alter claims or values.
Style: use Image 2 as the strongest reference for this task's app shell, muted pale sidebar, clean white surfaces, restrained blue and amber, thin dividers, system-sans font, compact readable controls. Keep every label legible and unclipped.
Avoid: poster typography, oversized timeline number bubbles, giant header/buttons, text at 18–20 px for ordinary body, whole-image shrink, added app chrome or outer container, wallpaper, fabricated query URL/data/version, any success/performance claim, text errors/gibberish, watermark.
~~~~

### Problem 02 · decision guidance · generation prompt

~~~~text
Use case: ui-mockup.
Asset type: desktop coding-workspace diagnostic concept screenshot, typography/layout correction v2.
Input images: Image 1: edit target; Image 2: accepted compact Codex-style concept screenshot establishing typography/control density; Image 3: genuine user-provided Codex Workspace screenshot, reference only for authentic desktop UI density and shell. Do not copy its blue-purple desktop wallpaper or snake-game content.
Primary request: Edit the internal UI of Image 1 so oversized text, section headings and controls read like a normal desktop diagnostic workspace. Match Image 2's compact hierarchy. Do not shrink the entire image.
Composition/framing: keep exact full-bleed 1672×941 landscape app interface, left Codex navigation, broad central workspace with two upper columns and one full-width lower action area. Retain all three regions and their positions. Let compact UI use natural whitespace; do not stretch controls or cards vertically.
Typography at this canvas: task header 20–22 px; section heading 16–18 px; body 14–16 px; metadata/status 12–13 px. Use compact system sans-serif. Buttons ordinary compact desktop height around 32–36 px; icons around 16–20 px. The current heading prefixes 01/02/03 are unnecessary decoration: remove these large numerals, leaving the three existing headings in the same sequence and positions; do not add any numbers or badges.
Text/content invariants: keep existing content exactly except remove those three oversized numeric prefixes. Preserve task title “AddCustom · 精度异常诊断” and “概念演示”, Codex workspace shell, search / branch / run / document / settings header and update metadata. Keep diagnostic evidence: “$ python run.py”; Loading model; input shape [17, 33]; running inference; precision mismatch at custom_op.cpp:128; process exited with code 1. Keep explanation that aligned input [16, 32] succeeds but non-aligned [17, 33] fails at the same location, attempted compiler parameter change and same failure, unresolved tail-block index range. Preserve the exact three alternatives and meaning: “检查尾块边界” grounded in only non-aligned input failing, read code first/no side effects; “检查数据精度” requires error distribution and cannot yet be ruled out; “更换模型重试” has no new diagnostic evidence and preserves prior attempt. Preserve the third section “确认判断后执行” with instruction “先检查尾块索引，不修改精度阈值。” and its normal compact execute-check button, plus context and current-project controls. This is a diagnostic design proposal; do not claim the issue was actually fixed or verified.
Style: match accepted Image 2's realistic modest Codex-like product density, clear but compact title hierarchy, light gray sidebar, white main surface, restrained blue and muted colors, fine dividers, modest icons. Maintain original shell and layout with the current active choice styling.
Avoid: giant 01/02/03 title numbers, poster typography, oversized UI headings, giant buttons, body copy at 18–20 px, whole-image scaling, extra frame or wallpaper, added/fabricated diagnosis, new claims or data, text clipping, Chinese/English gibberish, watermark.
~~~~

### Problem 02 · decision guidance · text correction prompt

~~~~text
Use case: text-localization.
Input images: Image 1: edit target, compact diagnostic concept screenshot; Image 2: original source screenshot, exact text reference.
Primary request: Make a text-only correction to Image 1. Replace only the phrase “整数尺寸” in the diagnostic paragraph with the exact original phrase “整块尺寸”. The full corrected sentence must read exactly: “当输入为整块尺寸（如 [16, 32]）时结果正常；当输入为非整块尺寸（如 [17, 33]）时在同一位置报精度不匹配。”
Constraints: change only those three Chinese characters in that phrase; preserve all other pixels, every other word, controls, hierarchy, background, layout and compact typography exactly. Keep the phrase within the existing paragraph line wrapping. Do not alter any other text. No added content, no watermark.
~~~~
