# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Durable product decisions

- Do not place the full learning path in a persistent horizontal bar above every learning screen. The complete path belongs in the path overview and may be reopened on demand; focused screens use only a compact breadcrumb with the current node and activity.
- Layout changes with the learning phase. Knowledge learning may use video/content composition, hands-on work uses a task workbench, and debugging may use an immersive terminal. Do not reuse one fixed three-column shell for the whole journey.
- A pre-run state must still contain useful task, command, environment, and validation context. Do not make a large empty terminal or empty white canvas the visual focus.
- Primary actions belong to the surface they affect. Run controls live inside the lab/terminal, not in a separate floating action bar below the work area.
