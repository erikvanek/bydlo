# Bydlo — Designer Matchmaking Discovery Prototype

A clickable prototype for a matchmaking platform connecting freelance designers/architects with people in transitional living situations (shared flats, moving in together, small renovations). Built for discovery interviews.

## Tech stack

- **React 18** + TypeScript
- **Vite** — build and dev server
- **Tailwind CSS** — styling
- **React Router** — navigation
- **LLM** — mock service (pattern-based); swappable for Claude/API later

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command      | Description              |
|-------------|--------------------------|
| `npm run dev`    | Start dev server         |
| `npm run build`  | Production build         |
| `npm run preview`| Preview production build |

## Project structure

- `src/pages/` — route-level pages (Landing, Describe, Conversation, Results, Browse, Designer detail)
- `src/components/` — SituationInput, ConversationThread, DesignerCard, DesignerProfile, FilterBar
- `src/components/ui/` — minimal UI stubs (replace with shadcn when you run `npx shadcn@latest add …`)
- `src/context/ConversationContext.tsx` — conversation state for Journey 1
- `src/services/llmService.ts` — LLM abstraction (mock by default; set `USE_MOCK_LLM = false` and implement API for Phase 2)
- `src/data/designers.ts` — 14 mock designers (Prague, Brno, Olomouc, Ostrava)
- `src/types/index.ts` — shared types

## Replacing the UI stubs with shadcn

The app currently uses minimal stub components in `src/components/ui/`. To replace them with real shadcn/ui components:

**1. Initialize shadcn** (sets up Tailwind theme, CSS variables, `components.json`, and `src/lib/utils.ts`):

```bash
npx shadcn@latest init
```

When prompted, choose: **Style:** Default · **Base color:** Slate · **CSS variables:** Yes.

**2. Add the components** (installs Radix primitives and other deps, and **overwrites** the stubs in `src/components/ui/`):

```bash
npx shadcn@latest add button card input textarea select badge dialog slider checkbox avatar separator
```

No manual copy-paste is needed — the CLI writes the real components into `src/components/ui/`. The existing feature components (SituationInput, DesignerCard, etc.) use the same props, so they should work as-is. If the CLI asks to overwrite files, confirm yes.

## Routes

| Path | Page |
|------|------|
| `/` | Landing (Describe your situation / Choose a consultant) |
| `/describe` | Describe situation (Journey 1 entry) |
| `/conversation` | AI conversation (Journey 1) |
| `/results` | Matched designers (from conversation or browse) |
| `/browse` | Browse all designers (Journey 2) |
| `/designer/:id` | Designer profile + “Book consultation” (simulated) |

## Spec

See [specs/start.md](specs/start.md) for the full discovery prototype specification.
