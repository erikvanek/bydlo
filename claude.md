# Bydlo — Project context for Claude

Use this file to understand the codebase when working on it with Claude (e.g. Claude Code, Cursor with Claude, or other tools).

**Spec-first workflow:** All specification and PM workflow live in **`specs/`**. Before implementing a feature, read **`specs/requirements.md`** (EARS acceptance criteria) and **`specs/design.md`** (architecture and boundaries), or **`specs/start.md`** for the full spec. Use **`specs/tasks.md`** for the ordered checklist and **`specs/notes/wireframes.md`** for layout reference. After coding, update **`specs/progress.md`** and **`specs/HANDOFF.md`** so the next session or tool has context. The multi-tool playbook (which tool for which phase) is in **`specs/workflow.md`**.

## What this project is

**Bydlo** is a **discovery prototype** for a designer matchmaking platform. It connects freelance designers/architects with people in transitional living situations (shared flats, couples moving in, small renovations). The app is used in the second half of discovery interviews to validate demand and get feedback on the concept.

- **In scope:** Clickable UI, two user journeys, mock LLM conversation, filtering/sorting, simulated "book consultation."
- **Out of scope:** Auth, payments, real backend/DB, real booking, email, admin, i18n.

## Research context

This prototype exists to answer a specific research question and test core hypotheses about problem-solution fit. All implementation decisions should be viewed through this lens.

**Research question:** How do people in life transitions (moving, renovation, moving in with partner) solve space arrangement and furnishing — and where do they encounter unmet needs that could be addressed by brief consultations from professionals (architects, interior designers, technical supervisors)?

**Core hypotheses being tested:**
- **H1 (Need exists):** People face non-trivial problems with spatial and aesthetic decisions during housing transitions — not just logistics, but "I don't know what would work" or "I care but can't solve it."
- **H2 (Access barrier):** People who would benefit from design consultation don't seek professional help because they perceive designers as "for big projects," too expensive, or simply inaccessible for brief consultations.
- **H3 (Informal substitutes):** People already "hire" non-professionals (friends with taste, partners, Instagram, IKEA planner, Pinterest). These substitutes partly work but leave gaps and don't bring final satisfaction.
- **H4 (Willingness to invest):** When stakes are high enough (moving in with partner, first "own" place, already spending on furniture), people would consider paying for expert input — especially if framed as lightweight and non-committal.

**How this prototype fits:** The prototype serves as a boundary object in interviews. It's shown only to participants who qualify (demonstrate design decision friction in their story). Their reaction — whether they project themselves into it, ask practical questions, or remain politely distant — provides signal strength for H1-H4.

**Research materials:**
- `specs/research/vyzkumny-plan.md` — Full research plan, hypotheses, signal criteria
- `specs/research/scenar-klient.md` — Interview script for "demand side" (people who recently moved/renovated)

When working on this codebase, consider: Does this change make the prototype more effective as a research instrument? Does it help surface the participant's mental models and needs?

## Tech stack

- **React 18** + TypeScript
- **Vite** — build and dev server
- **Tailwind CSS** — styling (theme via CSS variables in `src/index.css`)
- **shadcn/ui** — UI components in `src/components/ui/` (Radix primitives + CVA + `cn()` from `@/lib/utils`)
- **React Router** — client-side routing (no backend routes)
- **State:** `useState` and React Context only (`ConversationContext`). No Redux/Zustand.
- **LLM:** `src/services/llmService.ts` calls Claude via proxy (`/api/chat`). Falls back to mock (keyword pattern matching) on network failure. System prompts in `src/services/systemPrompt.ts`.
- **Hosting:** Cloudflare Pages (frontend) + Cloudflare Worker (API proxy). See `DEPLOYMENT.md`.

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
│   ├── llmService.ts         # generateFollowUp(), extractNeeds(); real API with mock fallback
│   └── systemPrompt.ts       # SYSTEM_PROMPT, EXTRACT_NEEDS_PROMPT (grounded in designer data)
├── lib/
│   └── utils.ts              # cn() for classnames
├── App.tsx                   # ConversationProvider + Routes
└── main.tsx

worker/
├── index.js                  # Cloudflare Worker — API proxy (plain JS, no build step)
└── wrangler.toml             # Worker config (name, entry point)
```

- **Import alias:** `@/` → `src/` (see `tsconfig.json` and `tsconfig.app.json`).
- **Specification and PM workflow live in `specs/`:**
  - `specs/requirements.md` — EARS acceptance criteria and user stories (*what* to build).
  - `specs/design.md` — Architecture, component hierarchy, boundaries.
  - `specs/start.md` — Full product specification.
  - `specs/tasks.md` — Ordered implementation checklist.
  - `specs/progress.md` — Implementation status tracker.
  - `specs/workflow.md` — Multi-tool AI playbook (phases, tool choice).
  - `specs/notes/wireframes.md` — ASCII wireframes.
  - `specs/HANDOFF.md` — Session handoff; update after coding sessions.
  - `specs/research/vyzkumny-plan.md` — Research plan, hypotheses, signal criteria.
  - `specs/research/scenar-klient.md` — Interview script for demand-side discovery.

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
npm run dev          # http://localhost:5173 (needs .env.local with ANTHROPIC_API_KEY for real LLM)
npx vite build       # Production build (use this instead of npm run build to skip tsc strict checks)
npm run preview      # Preview production build locally
```

For deployment commands, see `DEPLOYMENT.md`.

## Working on this codebase

- **New features:** Read `specs/requirements.md` and `specs/design.md` (or `specs/start.md`) before implementing. Update `specs/progress.md` when you complete items. Optionally update `specs/HANDOFF.md` at end of session.
- **Bugs:** Check `ConversationContext` and `llmService` for conversation flow; check `FilterBar` and `ResultsPage` for filter/sort state.
- **Styling:** Prefer Tailwind + shadcn theme tokens. Edit `src/index.css` for CSS variables; edit `tailwind.config.js` for theme extensions.
- **LLM / API:** Real Claude integration is live. API key goes in `.env.local` (local) or Worker secret (prod). Never commit secrets. See `DEPLOYMENT.md` for details.
- **Deploying:** See `DEPLOYMENT.md` for full guide (Cloudflare Pages + Worker).
