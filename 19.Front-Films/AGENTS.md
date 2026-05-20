# Repository Guidelines

## Project Structure & Module Organization

- `src/` contains the application code. 
- Top-level feature folders such as `home/`, `about/`, and `films/` expose page modules like `home-page.ts`.
- Shared code lives under `src/core/`: 
  - `components/` for reusable UI, 
  - `router/` for navigation,
  - `data/` for static data,
  - `entities/` for domain models,
  - `repositories/` for API access and data orchestration.
- Public static assets live in `public/`, while global styles are split between top-level `index.css` and `base.css`.

## Build, Test, and Development Commands

- Use `npm run dev` to start the Vite dev server. 
- Use `npm run build` to type-check with `tsc` and produce the production bundle. 
- Use `npm run preview` to serve the built app locally. 
- Use `npm run lint` to check for linting issues with ESLint.
- There is no `test` script yet.

## Coding Style & Naming Conventions

- Write TypeScript with strict-mode compatibility in mind;
- `tsconfig.json` enables `strict`, `noUnusedLocals`, and `noUnusedParameters`.
- Follow the existing style:
  - 4-space indentation,
  - single quotes,
  - semicolons
  - explicit imports with `.ts` omitted. 
- Keep page files named `*-page.ts`, and use the current component split:
  - `*.ts` for custom elements and paired `.css` files for component styles.
- In component CSS files, prefer nesting under the component root class (e.g. `.register { & h2 { ... } }`) instead of repeating the root selector on every rule.
- Use native Custom Elements without Shadow DOM; render component HTML with template strings and `innerHTML`.
- When registering custom elements, check `customElements.get(...)` before calling `customElements.define(...)`.

## Testing Guidelines

- No automated test framework is configured in this repository yet.
- Vitest will be introduced in a later course stage, not in the current phase.
- Until one is added, validate changes with `npm run build` and manual browser checks through `npm run dev`, especially routing and custom element registration.
- If you introduce tests, prefer naming them `*.test.ts` and keep them close to the feature they cover.

## Implementation Notes

- The router is intentionally basic: it handles the main pages, uses the History API, and does not support nested routes or advanced `query`/`hash` handling.
- Global styling is centralized in `base.css` and `index.css`; component-specific styles should be imported from the component file.

## Commit & Pull Request Guidelines

- Commits use short imperative subjects such as `Update course info` and `Add view basic test`.
- Always write commit messages in English, even if the codebase is in another language
- Keep commit titles concise, capitalized, and focused on one change.
- Pull requests should include a brief summary, affected screens or routes, linked issues if any, and screenshots or short recordings for UI changes.

## Configuration Tips

- Keep secrets in `.env` and never hardcode credentials in `src/`. 
- When adding new assets, place browser-facing files in `public/` and import code-owned assets from `src/` so Vite can process them correctly.
