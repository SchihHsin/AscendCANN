# Design QA — learning task workbench

## Scope

- Reference: user-supplied screenshot showing the previous fixed top path bar and undersized center task card.
- Implementation reviewed: `#scene-3` at a 1280 × 720 desktop viewport, before and after running the precheck.
- Intent: validate the requested structural change, not reproduce the rejected screenshot.

## Comparison

| User feedback | Implemented result | Verification |
|---|---|---|
| Remove the persistent horizontal step bar | The complete path appears only in the overview; the practice screen uses a compact breadcrumb | `.learning-path-bar` is absent from scenes 1–6 |
| Stop wasting the surrounding page area | Task context, live lab, and validation evidence fill a 1204 px workbench inside a 1232 px main canvas | Browser geometry check; no horizontal overflow |
| Do not show an empty central card | The pre-run state includes the command, environment, safety boundary, expected signals, and connected workspace state | Visual and DOM review |
| Keep actions close to their effect | “运行预检 / 查看失败诊断” is inside the terminal footer; the detached practice action bar is gone | Interaction test passed |
| Show a meaningful post-run transition | The same workbench updates to 2 PASS / 1 FAIL, exposes ErrorCode 507001, and continues to failure diagnosis | Click-through test passed |

## Regression checks

- All six journey scenes load from their hash URLs.
- No persistent full-path bar appears on any scene.
- Practice and failure screens have no horizontal overflow at 1280 px.
- The run action changes the terminal, validation signals, task step, and AI note in sync.
- The second action navigates to `#scene-4`.
- Fresh browser session reported no console errors.
- Production build and Sites worker tests pass.

final result: passed
