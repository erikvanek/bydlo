# Progress tracker — Designer Matchmaking Discovery Prototype

Tracks implementation against [start.md](./start.md).  
**Legend:** ✅ Done · ⬜ Not done · 🔶 Partial / stub / follow-up needed

---

## Tech stack

| Item | Status | Notes |
|------|--------|--------|
| React 18+ with TypeScript | ✅ | |
| Vite for build tooling | ✅ | |
| Tailwind CSS for styling | ✅ | tailwind.config.js, postcss, index.css |
| shadcn/ui for UI components | ✅ | Real shadcn/Radix components in `src/components/ui/` (button, card, input, textarea, select, badge, dialog, slider, checkbox, avatar, separator). Theme via CSS variables in index.css; FilterBar updated for Select/Checkbox/Slider APIs. |
| React Router for navigation | ✅ | BrowserRouter, Routes in App.tsx |
| LLM API integration (Claude/similar) | 🔶 | Abstraction in place; **Phase 1 mock** only (pattern matching). Phase 2 = real API. |
| No state management library (useState + Context only) | ✅ | ConversationContext only |

---

## Project structure

| Path | Status | Notes |
|------|--------|--------|
| `src/components/ui/` | ✅ | All 11 shadcn components (Radix + CVA + theme) |
| `src/components/SituationInput.tsx` | ✅ | |
| `src/components/ConversationMessage.tsx` | ✅ | |
| `src/components/ConversationThread.tsx` | ✅ | Includes `onSeeMatches` prop as used by ConversationPage |
| `src/components/DesignerCard.tsx` | ✅ | |
| `src/components/DesignerProfile.tsx` | ✅ | |
| `src/components/FilterBar.tsx` | ✅ | |
| `src/pages/LandingPage.tsx` | ✅ | |
| `src/pages/DescribeSituationPage.tsx` | ✅ | |
| `src/pages/ConversationPage.tsx` | ✅ | |
| `src/pages/ResultsPage.tsx` | ✅ | |
| `src/pages/DesignerDetailPage.tsx` | ✅ | |
| `src/pages/BrowsePage.tsx` | ✅ | |
| `src/data/designers.ts` | ✅ | |
| `src/types/index.ts` | ✅ | |
| `src/context/ConversationContext.tsx` | ✅ | |
| `src/services/llmService.ts` | ✅ | |
| `src/App.tsx` | ✅ | |
| `src/main.tsx` | ✅ | |

---

## Data model (types/index.ts)

| Interface | Status | Notes |
|-----------|--------|--------|
| `Designer` | ✅ | All fields including optional `matchScore` |
| `ConversationMessage` | ✅ | |
| `ConversationState` (with `extractedNeeds`) | ✅ | |
| `MatchCriteria` | ✅ | |
| `FilterState` | ✅ | Added for FilterBar (location, specialty, rateMin/Max, availability[]) |

---

## Mock data (data/designers.ts)

| Requirement | Status | Notes |
|-------------|--------|--------|
| 12–16 fictional designers | ✅ | 14 designers |
| Prague 6–8 | ✅ | 6 |
| Brno 3–4 | ✅ | 4 |
| Olomouc 2 | ✅ | 2 |
| Ostrava 2 | ✅ | 2 |
| Czech/European names | ✅ | |
| Specialties (interior, architect, both) | ✅ | Varied |
| Rates €40–120/hour | ✅ | €45–110 |
| Experience 2–15 years | ✅ | |
| Placeholder photos | ✅ | Unsplash URLs |
| Unique tags per designer | ✅ | |
| Short bio + approach | ✅ | |
| 3–5 portfolio images each | ✅ | |
| Varied availability | ✅ | immediate / within-week / within-month |
| Mock LLM responses (pattern matching) | ✅ | In llmService.ts |

---

## LLM integration (services/llmService.ts)

| Item | Status | Notes |
|------|--------|--------|
| `generateFollowUp(request): Promise<LLMResponse>` | ✅ | Mock: keyword pattern matching |
| `extractNeeds(conversationHistory): Promise<ExtractedNeeds>` | ✅ | Mock: regex/keywords for size, budget, timeline, etc. |
| `LLMRequest` / `LLMResponse` interfaces | ✅ | |
| Phase 1 mock (pattern matching) | ✅ | flat/apartment → size; moving/together → timeline; 2–3 questions → complete |
| Swappable for real API (USE_MOCK_LLM flag) | ✅ | Stubs `realLLMCall` / `realExtractNeeds` for Phase 2 |
| Ask 2–4 questions, conversational tone | 🔶 | Mock does 2–3; tone is basic |

---

## User flows

### Journey 1: Describe your situation

| Step | Status | Notes |
|------|--------|--------|
| 1. Landing → value prop + two options | ✅ | |
| 2. Situation input (2–5 sentences) | ✅ | Min 20 chars, placeholder example |
| 3. AI conversation (2–4 follow-ups) | ✅ | Mock LLM, chat UI |
| 4. Match results (3–5 designers) | ✅ | Filtered by match ≥70, sort/filter |
| 5. Designer detail | ✅ | |
| 6. Next steps (simulated book) | ✅ | Dialog: “end of prototype” |

### Journey 2: Choose a consultant

| Step | Status | Notes |
|------|--------|--------|
| 1. Landing | ✅ | |
| 2. Browse designers (filters) | ✅ | FilterBar: location, specialty, rate, availability |
| 3. Designer detail | ✅ | |
| 4. Next steps (simulated book) | ✅ | Same dialog |

---

## Screen specifications & acceptance criteria

### Landing page

| Criterion | Status |
|-----------|--------|
| Display both journey entry points prominently | ✅ |
| “Describe your situation” → navigate to /describe | ✅ |
| “Choose a consultant” → navigate to /browse | ✅ |
| Value proposition headline + explanation | ✅ |
| Trust signals (100+ matches, 30+ designers) | ✅ |

### Describe situation page

| Criterion | Status |
|-----------|--------|
| Enable “Continue” when user types ≥20 characters | ✅ |
| On “Continue”: store in ConversationContext, navigate to /conversation | ✅ |
| Placeholder with example situation text | ✅ |
| Prompt “Tell us about your situation” + examples | ✅ |

### Conversation page

| Criterion | Status |
|-----------|--------|
| On load: send initial description to LLM, show first follow-up | ✅ |
| On user submit: add to history, call LLM, show next question | ✅ |
| When shouldContinue false: show “See matches” instead of input | ✅ |
| On “See matches”: extract needs, navigate to /results | ✅ |
| Loading indicator while waiting for LLM | ✅ |
| Handle LLM errors (message + retry/dismiss) | ✅ |
| Chat-style history + user’s situation at top | ✅ |

### Results page

| Criterion | Status |
|-----------|--------|
| From conversation: show 3–5 designers with match scores | ✅ |
| “View profile” → navigate to /designer/[id] | ✅ |
| Sort dropdown reorders without reload | ✅ |
| Filters update grid to matching designers only | ✅ |
| Hourly rate, location, availability on card | ✅ |
| Match score % on card for Journey 1 | ✅ |
| Header “We found [N] designers” + needs summary when from Journey 1 | ✅ |
| Matching: location +30, budget +25, availability +20, ±5 variation, only ≥70 | 🔶 | Implemented; specialty alignment in spec could be refined |

### Designer detail page

| Criterion | Status |
|-----------|--------|
| “Book a consultation” → dialog with prototype-end message + Close | ✅ |
| Back link → previous page (results or browse) | ✅ |
| Portfolio grid: 3 cols desktop, 2 tablet, 1 mobile | ✅ |
| Header: photo, name, specialty, rate, availability, location | ✅ |
| About: bio + approach | ✅ |
| Tags/specialties as badges | ✅ |

### Browse page

| Criterion | Status |
|-----------|--------|
| Filter change → grid updates to matching designers only | ✅ |
| No matches → “No designers found. Try adjusting your filters.” | ✅ |
| Clear filters → show all 12–16 designers | ✅ |
| Location: All, Prague, Brno, Olomouc, Ostrava | ✅ |
| Specialty: All, Interior Design, Architecture, Both | ✅ |

---

## Component specifications

| Component | Status | Notes |
|-----------|--------|--------|
| **SituationInput** — onSubmit, placeholder; Textarea + Button; min 20 chars; character count | ✅ | |
| **ConversationMessage** — message, isLatest; Card + Avatar; user right / assistant left | ✅ | Markdown in assistant not implemented |
| **ConversationThread** — messages, onUserResponse, isWaitingForLLM, isComplete, onSeeMatches; Input + Button; auto-scroll; loading; “See matches” when complete | ✅ | |
| **DesignerCard** — designer, showMatchScore?, onViewProfile; Card, Badge, Avatar; responsive grid | ✅ | |
| **DesignerProfile** — designer, onBookConsultation, onBack; Card, Badge, Button, Dialog; portfolio grid | ✅ | |
| **FilterBar** — onFilterChange, availableLocations, availableSpecialties; Select, Slider, Checkbox; immediate filter; active count | ✅ | FilterBar also receives `filters` so it’s controlled |

---

## Scope boundaries (DO build)

| Item | Status |
|------|--------|
| Landing with two CTAs | ✅ |
| Journey 1 end-to-end | ✅ |
| Journey 2: Browse → Designer detail | ✅ |
| Conversation UI with message history | ✅ |
| LLM service layer (mock, swappable) | ✅ |
| Filtering and sorting (browse + results) | ✅ |
| Responsive design (mobile, tablet, desktop) | 🔶 | Tailwind responsive classes used; no formal breakpoint audit |
| Loading states (LLM “thinking”) | ✅ |
| Empty states (“No designers found”) | ✅ |
| Error handling for LLM (message, retry/dismiss) | ✅ |

---

## Scope boundaries (DO NOT build)

All items in the “DO NOT build” list are correctly **not** implemented (no auth, payment, backend, email, admin, real-time, analytics, designer-facing views, real booking, reviews, i18n, full a11y).

---

## Routing (App.tsx)

| Route | Status |
|-------|--------|
| `/` → LandingPage | ✅ |
| `/describe` → DescribeSituationPage | ✅ |
| `/conversation` → ConversationPage | ✅ |
| `/results` → ResultsPage | ✅ |
| `/browse` → BrowsePage | ✅ |
| `/designer/:id` → DesignerDetailPage | ✅ |

---

## Commands

| Command | Status |
|---------|--------|
| npm install | ✅ (in README) |
| npm run dev | ✅ |
| npm run build | ✅ |
| npm run preview | ✅ |

---

## Follow-up / optional

| Item | Status |
|------|--------|
| Run `npx shadcn@latest init` and add real shadcn components | ✅ |
| Phase 2: real LLM API (Claude etc.) in llmService | ⬜ |
| Low-fi wireframes → refine layouts per spec notes | ⬜ |
| Progress indicators / clearer “stage in flow” (success criteria #8) | ⬜ |
| Markdown rendering in assistant messages (ConversationMessage) | ⬜ |
| Preserve filter/sort state when navigating back from designer to results/browse | 🔶 | Back uses history; state is not persisted in URL |

---

*Last updated to reflect the initial groundwork implementation.*
