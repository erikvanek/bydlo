# Bydlo — Project context for Gemini

Use this file to understand the codebase when working on it with Gemini (e.g. Gemini in Google AI Studio, or other tools that read project context).

**Spec-first workflow (YOU MUST follow):** All specification and PM workflow live in **`specs/`**. Before implementing a feature, read **`specs/requirements.md`** (EARS acceptance criteria) and **`specs/design.md`** (architecture and boundaries), or **`specs/start.md`** for the full spec. Use **`specs/tasks.md`** for the ordered checklist and **`specs/notes/wireframes.md`** for layout reference. After coding, update **`specs/progress.md`** and **`specs/HANDOFF.md`** so the next session or tool has context. YOU MUST update **`specs/HANDOFF.md`** after significant work. The multi-tool playbook (which tool for which phase) is in **`specs/workflow.md`**.

## What this project is

**Bydlo** is a **discovery prototype** for a designer matchmaking platform. It connects freelance designers/architects with people in transitional living situations (shared flats, couples moving in, small renovations). The app is used in the second half of discovery interviews to validate demand and get feedback on the concept.

- **In scope:** Clickable UI, two user journeys, mock LLM conversation, filtering/sorting, simulated “book consultation.”
- **Out of scope:** Auth, payments, real backend/DB, real booking, email, admin, i18n.

## Tech stack

- **React 18** + TypeScript
- **Vite** — build and dev server
- **Tailwind CSS** — styling (theme via CSS variables in `src/index.css`)
- **shadcn/ui** — UI components in `src/components/ui/` (Radix primitives + class-variance-authority + `cn()` from `@/lib/utils`)
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
│   └── FilterBar.tsx         # Uses Select (value/onValueChange), Checkbox (onCheckedChange), Slider (value array, onValueChange)
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

- **Import alias:** `@/` points to `src/` (configured in `tsconfig.json` and `tsconfig.app.json`).
- **Specification and PM workflow live in `specs/`:**
  - `specs/requirements.md` — EARS acceptance criteria and user stories (*what* to build).
  - `specs/design.md` — Architecture, component hierarchy, boundaries.
  - `specs/start.md` — Full product specification.
  - `specs/tasks.md` — Ordered implementation checklist.
  - `specs/progress.md` — Implementation status tracker.
  - `specs/workflow.md` — Multi-tool AI playbook (phases, tool choice).
  - `specs/notes/wireframes.md` — ASCII wireframes.
  - `specs/HANDOFF.md` — Session handoff; update after coding sessions. YOU MUST update HANDOFF.md after significant work so the next tool has context.

## User journeys

1. **Journey 1 (primary):** Landing → Describe situation → Conversation (2–4 LLM follow-up questions) → Results (3–5 matched designers) → Designer detail → “Book consultation” (dialog only; no real booking).
2. **Journey 2:** Landing → Browse (filters: location, specialty, rate, availability) → Designer detail → same “Book consultation” dialog.

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

- Use types from `@/types`. Add or extend types there when changing the data model.
- UI: use components from `@/components/ui/` and theme tokens (`bg-primary`, `text-muted-foreground`, etc.). Add new shadcn components with `npx shadcn@latest add <name>` if needed.
- LLM: preserve the `generateFollowUp` and `extractNeeds` interfaces so mock and real implementations can be swapped via `USE_MOCK_LLM`.
- No new global state libraries; keep using React Context for conversation state.
- Designer data is static in `src/data/designers.ts`; there is no backend API or database.

## Commands

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## Working on this codebase

- **New features:** Read `specs/requirements.md` and `specs/design.md` (or `specs/start.md`) before implementing. Update `specs/progress.md` when you complete items. Update `specs/HANDOFF.md` at end of session.
- **Bugs:** For conversation flow, check `ConversationContext` and `llmService`; for filter/sort, check `FilterBar` and `ResultsPage`.
- **Styling:** Use Tailwind and shadcn theme tokens. Change CSS variables in `src/index.css` and theme in `tailwind.config.js` if needed.
- **Phase 2 LLM:** Implement `realLLMCall` and `realExtractNeeds` in `llmService.ts`, set `USE_MOCK_LLM = false`, and supply API keys via environment variables (do not commit secrets).
