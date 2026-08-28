# Design QA — AI learning journey landing

## Evidence and state

- Source visual truth: `/var/folders/wj/nd900vqd3wl1kztdsn2r8pcw0000gn/T/codex-clipboard-faada73b-e0b7-46ea-b234-ccdad0167a73.png` (1487 × 1058 px).
- Normalized source: `design-qa-source-normalized.png` (1280 × 720 px).
- Browser-rendered implementation: `design-qa-implementation.png` (1280 × 720 px).
- Side-by-side evidence: `design-qa-comparison.png` (2560 × 756 px, labels included above both 1280 × 720 panels).
- CSS viewport: 1280 × 720; device scale factor: 1. The source was proportionally scaled and center-cropped to the same 1280 × 720 content frame before comparison.
- State: first visit, `#landing`, before selecting a task.

## Findings

- No actionable P0, P1, or P2 mismatch remains.
- Fonts and typography: both use a compact Chinese sans-serif hierarchy with a large black task-led headline, medium-weight navigation, and restrained small metadata. The implementation uses Noto Sans SC / Inter fallbacks and preserves the source wrapping and optical hierarchy at the normalized viewport.
- Spacing and layout rhythm: the implementation preserves the source's wide hero, right-side three-step mechanism, dominant recommended-task card, narrower weekly-task rail, and dense first-screen rhythm. At 1280 × 720 the role filter begins below the fold; this is an expected responsive consequence of normalizing a 1487 × 1058 reference, not hidden core functionality.
- Colors and visual tokens: the warm cream-to-lilac-to-blue ambient field, white translucent cards, purple primary actions, green verification evidence, neutral borders, and low elevation match the source direction.
- Image quality and assets: the Ascend logo is the supplied vector brand asset; the ambient background is the existing raster asset; interface icons use Phosphor rather than substitute glyphs or CSS drawings. All remain sharp at the target viewport.
- Copy and content: the source's real-task framing, searchable goal input, three-step matching mechanism, featured Qwen3 task, acceptance criteria, evidence, and weekly verified tasks are retained. The implementation adds a necessary explicit action label and functional generation states without changing the page's proposition.
- Affordance and interaction: search, task selection, four necessary clarifications, generation feedback, and automatic transition to `#scene-1` work as one continuous flow. The task selection and clarification states intentionally reuse the landing surface rather than introducing a separate generation workbench.

## Full-view comparison

`design-qa-comparison.png` was opened and reviewed as one combined input. Major-region proportions, visual hierarchy, card density, hero placement, right rail, typography, color field, and task evidence anatomy were readable at full-view scale.

## Focused-region comparison

No additional crop was required: the combined image is 2560 px wide and the essential fidelity surfaces—navigation, headline, search, three-step mechanism, featured task title, acceptance tags, evidence mini-card, primary CTA, and weekly-task rows—remain legible in the full-view evidence. Fine one-pixel border and shadow differences are P3-level implementation polish only.

## Comparison history

- Pass 1: no actionable visual P0/P1/P2 issue was found in the normalized source-versus-implementation comparison, so no visual correction loop was required.
- Release hardening after the visual pass: converted Vite and public asset paths to relative-base output so the same verified screen works from the GitHub Pages subdirectory. This changes delivery paths only and does not alter the rendered composition.

## Primary interaction and console checks

- Loaded the static Pages build at `#landing`; Ascend logo and page content rendered.
- Selected “查看详情并开始匹配”; URL remained `#landing` and the clarification state appeared.
- Changed the device to “Atlas 800I A2”; selected state updated.
- Started generation; the generating state appeared and automatically transitioned to `#scene-1` after 2.2 seconds.
- Confirmed the path overview rendered and the browser reported no warning or error logs.
- Production build, Sites worker tests, and `git diff --check` pass.

## Follow-up polish

- P3: on a future content pass, the source's small secondary labels can be rebalanced after real task/evidence data replaces the current realistic mock data.

final result: passed
