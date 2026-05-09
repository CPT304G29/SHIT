# SHIT

**S**mart **H**andling **I**nventory **T**racker — a React-based inventory dashboard built for a UNIQLO-themed internal tool.

This isn't trying to be the next ERP giant. It's a clean, fast interface for tracking stock: add items, edit quantities, delete dead SKUs, sort columns, search the table, toggle between light/dark themes, and switch languages (English, Chinese, Japanese). Data persists to localStorage so you won't lose everything on refresh.

## Tech stack

- React 19 + TypeScript + Vite
- State: Zustand (with persistence)
- Styling: Vanilla Extract CSS (no runtime cost, type-safe)
- Table: TanStack Table v8
- Dialogs/tooltips: Radix UI primitives
- Icons: Lucide
- i18n: react-i18next
- Tests: Vitest + React Testing Library (unit), Playwright (e2e)

## Getting started

```bash
pnpm install
pnpm dev
```

Open http://localhost:5173. That's it.

## Build

```bash
pnpm build
```

Output goes to `dist/`. Preview locally with `pnpm preview`.

## Tests

Unit/component tests:

```bash
pnpm test
```

E2E (headless):

```bash
pnpm test:e2e
```

The E2E suite covers the full flow: add an item, edit it, delete it, toggle theme, switch language.

## Code quality

```bash
pnpm lint        # ESLint
pnpm format      # Prettier
pnpm format:check
```

## Project structure

```
src/
  features/inventory/   # the only real feature — table, form, store, utils
  components/layout/    # sidebar, header, shell
  components/ui/        # button, input, icon-button
  styles/               # theme tokens, global reset
  locales/              # en, zh, ja
  hooks/                # theme transition, localStorage
  lib/                  # i18n setup
```

## A note on the name

Yes, the acronym is intentional. No, we're not changing it.

---

MIT
