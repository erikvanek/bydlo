# Tasks — Ordered implementation checklist

Discrete, ordered steps for building and iterating on the prototype.  
**Use with [requirements.md](./requirements.md) and [design.md](./design.md).**  
Mark done in [progress.md](./progress.md) for overall status.

---

## Phase 1: Scaffolding and project setup

- [x] Vite + React + TypeScript project
- [x] Tailwind CSS + PostCSS
- [x] Path alias `@/` → `src/`
- [x] React Router (routes for all 6 pages)
- [x] shadcn/ui init (components.json, CSS variables, lib/utils)
- [x] shadcn components: button, card, input, textarea, select, badge, dialog, slider, checkbox, avatar, separator
- [x] Folder structure: pages/, components/, components/ui/, context/, services/, data/, types/, lib/

---

## Phase 2: Data and core logic

- [x] Types: Designer, ConversationMessage, ConversationState, ExtractedNeeds, FilterState
- [x] Mock designers (12–16) in data/designers.ts
- [x] ConversationContext (initialDescription, messages, addMessage, setComplete, reset)
- [x] llmService: generateFollowUp, extractNeeds (mock implementation)
- [x] Matching logic (scores from extracted needs; filter ≥70)

---

## Phase 3: Pages and feature components

- [x] LandingPage — value prop, two CTAs → /describe, /browse
- [x] DescribeSituationPage — SituationInput, store description, navigate to /conversation
- [x] ConversationPage — load first question, thread, "See matches", navigate to /results
- [x] ResultsPage — FilterBar, sort, DesignerCard grid with match scores
- [x] BrowsePage — FilterBar, DesignerCard grid
- [x] DesignerDetailPage — DesignerProfile, Book consultation dialog
- [x] SituationInput, ConversationMessage, ConversationThread
- [x] DesignerCard, DesignerProfile, FilterBar (using shadcn Select, Checkbox, Slider)

---

## Phase 4: Integration and polish

- [ ] Verify both journeys end-to-end (manual test)
- [ ] Responsive check (mobile, tablet, desktop)
- [ ] Loading and empty states (LLM thinking, no designers found)
- [ ] Error handling (LLM failure, retry/dismiss)
- [ ] Optional: ASCII wireframes in specs/notes/wireframes.md and align UI

---

## Phase 5: Iteration (post-interview)

- [ ] Update requirements.md from interview feedback
- [ ] Update tasks.md with new or changed tasks
- [ ] Implement via tool workflow (see [workflow.md](./workflow.md))
- [ ] Update HANDOFF.md after session

---

## Optional / future

- [ ] Phase 2 LLM: real API in llmService (USE_MOCK_LLM = false)
- [ ] Progress indicators or clearer “stage in flow”
- [ ] Markdown in assistant messages (ConversationMessage)
- [ ] Preserve filter/sort state in URL when navigating back from designer detail
