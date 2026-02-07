# Design — Architecture and component hierarchy

Architecture decisions and structure for the discovery prototype.  
**Complements [requirements.md](./requirements.md) and [start.md](./start.md).**

---

## Tech stack

- **React 18** + TypeScript
- **Vite** — build and dev server
- **Tailwind CSS** — styling; theme via CSS variables in `src/index.css`
- **shadcn/ui** — UI primitives in `src/components/ui/` (Radix + CVA + `cn()` from `@/lib/utils`)
- **React Router** — client-side routing only
- **State:** `useState` and React Context only. **No** Redux, Zustand, or other global state library.
- **LLM:** Abstract service in `src/services/llmService.ts`. Phase 1: mock (pattern matching). Phase 2: real API (e.g. Claude); same interfaces, swap via `USE_MOCK_LLM`.

---

## Architecture

```
src/
├── pages/           # One component per route; composition only, minimal logic
├── components/      # Feature components (SituationInput, DesignerCard, etc.)
├── components/ui/  # shadcn primitives — do not modify; add via npx shadcn@latest add
├── context/        # ConversationContext for Journey 1 state
├── services/       # llmService (generateFollowUp, extractNeeds)
├── data/           # Static mock data (designers.ts)
├── types/          # Shared TypeScript interfaces
├── lib/            # utils (cn), no API clients except LLM in services
├── App.tsx         # ConversationProvider + Routes
└── main.tsx        # BrowserRouter + root render
```

- **Import alias:** `@/` → `src/` (tsconfig).
- **No backend routes.** All data is in-memory or mock; Phase 2 LLM is the only external call.

---

## Component hierarchy

**Pages (route-level):**
- `LandingPage` — value prop, two CTAs
- `DescribeSituationPage` — SituationInput, then navigate to /conversation
- `ConversationPage` — ConversationThread, LLM service, navigate to /results
- `ResultsPage` — FilterBar, DesignerCard grid, sort, match scores when from Journey 1
- `BrowsePage` — FilterBar, DesignerCard grid (no match scores)
- `DesignerDetailPage` — DesignerProfile (same for both journeys)

**Feature components:**
- `SituationInput` — Textarea + validation (min 20 chars) + Continue button
- `ConversationMessage` — Single message (user vs assistant styling)
- `ConversationThread` — Message list + input or "See matches" button; loading state
- `DesignerCard` — Avatar, name, specialty, rate, location, availability, short bio; optional match score; View profile CTA
- `DesignerProfile` — Full bio, approach, portfolio grid, tags, Book consultation (opens Dialog)
- `FilterBar` — Select (location, specialty), Slider (rate), Checkbox (availability); controlled via FilterState

**UI primitives (shadcn):** button, card, input, textarea, select, badge, dialog, slider, checkbox, avatar, separator. Use these only; do not edit files in `src/components/ui/` except via `npx shadcn@latest add`.

---

## Data model (summary)

- **Designer** — id, name, specialty, photo, hourlyRate, availability, location, yearsExperience, shortBio, approach, portfolioImages, tags; optional matchScore.
- **ConversationMessage** — id, role (user | assistant), content, timestamp.
- **ConversationState** — initialDescription, messages, extractedNeeds (spaceType, budget, timeline, priorities, constraints), isComplete.
- **FilterState** — location, specialty, rateMin, rateMax, availability[].

Designers: 12–16 mock entries; Prague 6–8, Brno 3–4, Olomouc 2, Ostrava 2. See `src/types/index.ts` and `src/data/designers.ts`.

---

## Boundaries (do not violate)

- **NEVER** modify files in `src/components/ui/` directly; use or compose them.
- **NEVER** add a global state library (Zustand, Redux, etc.); use Context + useState only.
- **NEVER** add backend routes, database, or auth in this prototype.
- **NEVER** change `tsconfig.json`, `vite.config.ts`, or `tailwind.config.js` without explicit approval.
- **NEVER** add dependencies without explicit approval.
- After code changes, run `npm run build` (or typecheck) before considering the task done.

---

## Session handoff

After a coding session, update [HANDOFF.md](./HANDOFF.md) with: what was done, what’s pending, any decisions or blockers. Next tool or session reads it for context.
