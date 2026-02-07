# Bydlo — Project context for Claude

Use this file to understand the codebase when working on it with Claude (e.g. Claude Code, Cursor with Claude, or other tools).

## What this project is

**Bydlo** is a **discovery prototype** for a designer matchmaking platform. It connects freelance designers/architects with people in transitional living situations (shared flats, couples moving in, small renovations). The app is used in the second half of discovery interviews to validate demand and get feedback on the concept.

- **In scope:** Clickable UI, two user journeys, mock LLM conversation, filtering/sorting, simulated “book consultation.”
- **Out of scope:** Auth, payments, real backend/DB, real booking, email, admin, i18n.

## Tech stack

- **React 18** + TypeScript
- **Vite** — build and dev server
- **Tailwind CSS** — styling (theme via CSS variables in `src/index.css`)
- **shadcn/ui** — UI components in `src/components/ui/` (Radix primitives + CVA + `cn()` from `@/lib/utils`)
- **React Router** — client-side routing (no backend routes)
- **State:** `useState` and React Context only (`ConversationContext`). No Redux/Zustand.
- **LLM:** Abstract service in `src/services/llmService.ts`. **Phase 1:** mock (keyword pattern matching). **Phase 2:** swap to real API (e.g. Claude); use `USE_MOCK_LLM` and the same interfaces.

## Project structure

```
src/
├── components/
│   ├── ui/                    # shadcn components (button, card, input, textarea, select, badge, dialog, slider, checkbox, avatar, separator)
│   ├── SituationInput.tsx     # Journey 1: free-text situation + Continue
│   ├── ConversationMessage.tsx
│   ├── ConversationThread.tsx
│   ├── DesignerCard.tsx
│   ├── DesignerProfile.tsx
│   └── FilterBar.tsx         # Uses Select, Checkbox, Slider (Radix APIs)
├── pages/                     # One component per route
├── context/
│   └── ConversationContext.tsx # Journey 1 state: initialDescription, messages, extractedNeeds, isComplete
├── data/
│   └── designers.ts          # 14 mock designers (Prague, Brno, Olomouc, Ostrava)
├── types/
│   └── index.ts              # Designer, ConversationMessage, ConversationState, ExtractedNeeds, FilterState
├── services/
│   └── llmService.ts         # generateFollowUp(), extractNeeds(); mock or real
├── lib/
│   └── utils.ts              # cn() for classnames
├── App.tsx                   # ConversationProvider + Routes
└── main.tsx
```

- **Import alias:** `@/` → `src/` (see `tsconfig.json` and `tsconfig.app.json`).
- **Spec and progress:** Full spec is in `specs/start.md`. Implementation status is in `specs/progress.md`.

## User journeys

1. **Journey 1 (primary):** Landing → Describe situation → Conversation (2–4 LLM follow-ups) → Results (3–5 matched designers) → Designer detail → “Book consultation” (dialog only).
2. **Journey 2:** Landing → Browse (filters) → Designer detail → same “Book consultation” dialog.

## Routes

| Path | Page |
|------|------|
| `/` | LandingPage |
| `/describe` | DescribeSituationPage |
| `/conversation` | ConversationPage |
| `/results` | ResultsPage |
| `/browse` | BrowsePage |
| `/designer/:id` | DesignerDetailPage |

## Conventions

- Use existing types from `@/types`. Extend them there if you add fields.
- UI: use components from `@/components/ui/` and theme tokens (`bg-primary`, `text-muted-foreground`, etc.). Add new shadcn components with `npx shadcn@latest add <name>` if needed.
- LLM: keep the same `generateFollowUp` / `extractNeeds` interfaces so mock and real implementations are swappable.
- No new global state libraries; keep using Context for conversation state.
- Designer data is static in `src/data/designers.ts`; no API or DB.

## Commands

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## Working on this codebase

- **New features:** Align with `specs/start.md` (acceptance criteria, scope, DO/DON’T). Update `specs/progress.md` when you complete items.
- **Bugs:** Check `ConversationContext` and `llmService` for conversation flow; check `FilterBar` and `ResultsPage` for filter/sort state.
- **Styling:** Prefer Tailwind + shadcn theme tokens. Edit `src/index.css` for CSS variables; edit `tailwind.config.js` for theme extensions.
- **Phase 2 LLM:** Implement `realLLMCall` and `realExtractNeeds` in `llmService.ts`, set `USE_MOCK_LLM = false`, and add API keys via env (never commit secrets).
