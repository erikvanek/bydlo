# The multi-tool AI coding playbook for lean React prototyping

**A React prototype for discovery interviews can be built in 3–5 days using a four-tool workflow that costs $20/month total.** The optimal strategy uses Gemini CLI as the free workhorse for scaffolding and volume tasks, reserves Claude Code's paid credits for complex logic and architecture decisions, leverages Cursor's free tier for visual debugging and multi-file edits, and relies on conversational Claude for upfront specification writing. Practitioners who follow this phased approach report **70–90% AI-generated code** with minimal manual intervention after the first page is templated. The key insight across dozens of real-world case studies: output quality is determined far more by specification clarity than by tool choice.

This report synthesizes practitioner experiences, benchmark data, and official documentation from 2024–2026 to provide an immediately executable workflow for building a 6-page React + TypeScript + Vite + Tailwind + shadcn/ui prototype within a 1–2 week lean discovery timeline.

---

## Phase-by-phase workflow from spec to working prototype

The end-to-end process divides cleanly into five phases, each with a primary tool assignment based on that tool's documented strengths.

**Phase 1: Specification and planning (Days 1–2) → Conversational Claude (free, unlimited).** Use Claude's chat interface to transform your product requirements into three structured documents: a `requirements.md` with user stories and EARS-format acceptance criteria, a `design.md` with architecture decisions and component hierarchy, and a `tasks.md` breaking implementation into discrete, ordered steps. This three-file pattern, validated by GitHub's Spec Kit and JetBrains Junie workflows, gives agentic tools the structured input they execute best against. Simultaneously, create ASCII wireframes or annotated Excalidraw exports for each screen and store them in `notes/wireframes.md`. One practitioner reported that adding ASCII wireframes changed his first-shot success rate to **97%** — they consume 10x fewer tokens than HTML mockups and eliminate visual ambiguity.

**Phase 2: Scaffolding and project setup (Day 2–3) → Gemini CLI (free).** Gemini CLI's unlimited free tier handles project initialization without burning paid credits. Generate the Vite + React + TypeScript scaffold, install Tailwind and shadcn/ui, configure routing, and create component stubs for all six pages. Gemini's **1M-token context window** means it can hold your entire spec in memory while scaffolding. However, Render.com's systematic benchmark scored Gemini only **3/10 for greenfield generation** — it produces functional but visually bare output that requires 5–7 follow-up prompts for styling. Accept this: you're using Gemini for structure, not polish.

**Phase 3: Core page development (Days 3–7) → Claude Code (paid, strategic) + Gemini CLI (free).** Build one page fully with Claude Code first — this becomes the template. Practitioners consistently report that Claude Code gets **70% accuracy on the first page** but jumps to **80–90% on subsequent pages** once it can reference the template. After establishing the pattern, switch to Gemini CLI for the remaining five pages, using the first page's component patterns as reference. Reserve Claude Code for complex state management, LLM integration logic, and tricky data flows. This division typically consumes 15–25 Claude Code prompts — well within the Pro plan's ~45 messages per 5-hour window.

**Phase 4: Integration, polish, and debugging (Days 8–10) → Cursor (free tier) + Claude Code.** Cursor's visual diff review and Composer feature are uniquely suited for multi-file refactoring and UI polish. Use the **free tier's ~50 premium requests** for cross-component integration and responsive layout adjustments. Cursor scored **9/10 in Render.com's benchmark** for overall app quality — "destroyed the competition with the cleanest and most full-featured app." For stubborn bugs, fall back to Claude Code's superior reasoning.

**Phase 5: Interview-driven iteration (Days 10–14) → Gemini CLI + Claude Code as needed.** After each user interview, update `requirements.md` with feedback, then use Gemini CLI for UI tweaks and flow adjustments. Reserve Claude Code for structural changes that affect state management or navigation logic.

---

## Tool selection matrix based on benchmarks and practitioner data

The choice of which tool to use for each task type is not subjective — systematic benchmarks and hundreds of practitioner reports converge on clear patterns.

| Task | Best tool | Why | Cost |
|------|-----------|-----|------|
| Spec writing and planning | Claude Chat | Unlimited, best reasoning for product specs | $0 |
| Project scaffolding | Gemini CLI | Free, 1M context holds full spec | $0 |
| First page (template) | Claude Code | Highest first-attempt quality (7/10 benchmark) | $20/mo |
| Subsequent pages | Gemini CLI | Free, follows existing patterns well | $0 |
| Complex state management | Claude Code | Best reasoning, fewest iterations needed | $20/mo |
| LLM integration code | Claude Code | Superior at async patterns and error handling | $20/mo |
| UI component generation | Cursor or Claude Code + shadcn MCP | Both excel with MCP server access | $0–20 |
| Multi-file refactoring | Cursor Composer | Unique visual multi-file editing | $0 (free tier) |
| Debugging | Cursor | Visual diffs and inline chat are superior to terminal | $0 (free tier) |
| Responsive adjustments | Gemini CLI | Volume task, good enough quality | $0 |
| Test generation | Gemini CLI | Template-driven, saves paid credits | $0 |
| Code review | Gemini CLI | 1M context reviews entire codebase at once | $0 |
| Post-interview iterations | Gemini CLI → Claude Code escalation | Start free, escalate for complex changes | $0–20 |

**Critical note on shadcn/ui**: All three tools hallucinate outdated props and patterns without the official shadcn MCP server. Install it for both Claude Code (`claude mcp add --transport http shadcn https://www.shadcn.io/api/mcp`) and Cursor. Without MCP, one practitioner at LogRocket found tools "confidently spit out props that don't exist or dust off patterns from 2023."

---

## Specification template optimized for agentic handoff

The specification system uses a separation of concerns: tool-specific context files encode *how to code*, while spec files encode *what to code*. This makes specs portable across tools.

**CLAUDE.md** (committed to repo, read automatically by Claude Code at session start):

```markdown
# Project: MatchFlow Discovery Prototype
React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui.
Conversation-based matching interface with LLM integration.

## Commands
- `npm run dev` — Start Vite dev server
- `npm run build` — Production build (must pass before commit)
- `npm run typecheck` — TypeScript strict check

## Code Style
- Functional components with hooks only, no class components
- shadcn/ui components from @/components/ui — ALWAYS prefer these
- Zustand for client state, TanStack Query for server state
- File naming: PascalCase components, camelCase utilities, kebab-case routes

## Architecture
- src/pages/ — Route-level page components
- src/components/ — Shared UI components
- src/components/ui/ — shadcn/ui primitives (NEVER modify these directly)
- src/hooks/ — Custom hooks (use* prefix)
- src/lib/ — Utilities, API clients, LLM integration
- src/stores/ — Zustand stores

## IMPORTANT Boundaries
- NEVER modify files in src/components/ui/ — these are shadcn/ui base components
- NEVER add dependencies without explicit approval
- NEVER change tsconfig.json, vite.config.ts, or tailwind.config.ts
- After code changes, ALWAYS run typecheck
```

**GEMINI.md** follows the same structure — Gemini CLI supports identical hierarchical placement. However, Gemini tends to **ignore project rules unless repeatedly nudged**, so add emphasis markers: "YOU MUST follow these rules. CRITICAL: Never modify ui/ components."

**Cursor rules** use the newer `.cursor/rules/` directory with scoped `.mdc` files:

```markdown
---
description: "React component standards for this prototype"
globs: "src/components/**/*.tsx, src/pages/**/*.tsx"
alwaysApply: true
---
# Component Standards
- Use shadcn/ui components as primary UI primitives
- TypeScript interfaces for all props (no `any` types)
- Tailwind CSS utility classes only — no inline styles or CSS modules
- Include loading and error states for async components
```

**requirements.md** uses EARS notation, which is becoming the de facto standard for AI-actionable specs because it provides enough structure for LLMs to parse reliably while remaining natural for humans to write:

```markdown
## Page: Conversation Matching
### User Story
As a job seeker, I want to have a guided conversation that surfaces
relevant matches, so I can discover opportunities aligned with my goals.

### Acceptance Criteria
WHEN a user opens the matching page
THE SYSTEM SHALL display a chat interface with an initial prompt question

WHEN a user submits a response
THE SYSTEM SHALL send the message to the LLM endpoint and display
a streaming response with match suggestions

WHEN match suggestions are returned
THE SYSTEM SHALL render each match as a shadcn Card with title,
summary, match score (percentage), and a "Learn More" button

WHEN a user clicks "Learn More" on a match card
THE SYSTEM SHALL navigate to the match detail page with the match ID
```

The **Goldilocks principle** for spec detail: specify tech stack versions, component behavior, architecture patterns, and acceptance criteria explicitly. Leave internal function decomposition, variable naming, and implementation details to AI discretion. Research shows frontier models follow **150–200 instructions** reliably — beyond that, adherence degrades.

---

## How to integrate wireframes for maximum AI comprehension

All three agentic tools accept image inputs, but the optimal format depends on your workflow speed requirements.

**ASCII wireframes deliver the highest success rate.** Nathan Onn's practitioner workflow showed 97% first-attempt accuracy after adding ASCII wireframes to his AI development process. They cost 10x fewer tokens than image processing, work in every terminal, and eliminate the ambiguity that plagues image interpretation. Store them in `notes/wireframes.md`:

```
## Matching Page
┌─────────────────────────────────────────┐
│  Logo         [Nav] [Nav] [Profile▾]    │
├─────────────────────────────────────────┤
│  ┌───────────────────────────────────┐  │
│  │        Chat Messages Area         │  │
│  │  [Bot]: What role interests you?  │  │
│  │  [User]: Product management       │  │
│  │  [Bot]: Here are your matches:    │  │
│  │                                   │  │
│  │  ┌─────────┐  ┌─────────┐        │  │
│  │  │Match 92%│  │Match 87%│        │  │
│  │  │  Card   │  │  Card   │        │  │
│  │  │[Details]│  │[Details]│        │  │
│  │  └─────────┘  └─────────┘        │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────┐ [Send ▶]     │
│  │  Type your response...│              │
│  └───────────────────────┘              │
└─────────────────────────────────────────┘
```

**For visual wireframes, Excalidraw is the optimal tool.** It exports to PNG, SVG, and JSON; has a VS Code extension for in-IDE editing; and its hand-drawn aesthetic communicates "this is low-fi, don't over-polish." When using image wireframes with AI tools, the input methods are: Claude Code accepts **Ctrl+V paste** or file path references; Gemini CLI uses `@filename.png` syntax; Cursor accepts uploads in its Composer interface.

**Always pair visual wireframes with text annotations.** Label each element with its component type (`[shadcn Card]`, `[shadcn Button]`), specify interactive behaviors ("click navigates to /detail/:id"), and note responsive expectations ("stack to single column below md breakpoint"). The wireframe alone is a contract for layout; the annotations are the contract for behavior.

**The iterative screenshot loop accelerates refinement.** After generating a page, take a screenshot of the running app and paste it back into the AI tool with: "Compare this screenshot with the wireframe at `notes/wireframes.md`. List every discrepancy and fix them." This visual feedback loop catches layout drift that text-only prompts miss.

---

## Resource allocation that keeps total cost at $20/month

Claude Code's Pro plan ($20/month) provides **~45 messages per 5-hour rolling window** and **40–80 hours of Sonnet per week** — shared across Claude web, desktop, and terminal. The critical constraint: this quota is unified, so heavy conversational Claude usage during spec writing can reduce what's available for coding sessions. Official data shows the average developer spends **$6/day on API usage**, but prototype work is far less intensive than production development.

**Budget your Claude Code sessions as focused 2–3 hour blocks.** Plan your prompts before opening the terminal. Disorganized prompting is the number-one cost inflator — practitioners report **33% token savings** from grouping related changes into single prompts rather than iterative refinement. Use `/cost` to track spending, `/compact` when context grows large, and `/clear` between unrelated tasks. One critical tip from Anthropic's own documentation: "A clean session with a better prompt almost always outperforms a long session with accumulated corrections."

**Gemini CLI's 1,000 requests/day free tier is genuinely sustainable for a full prototype.** Each page typically consumes 20–40 requests for generation plus iterations, putting the total project at 200–400 requests over two weeks — well under daily limits. The caveat: Gemini CLI's free tier dynamically routes between Pro and Flash models. After approximately 10–15 complex prompts, you may be shifted to the lower-quality Flash model. Mitigate this by writing specific, bounded prompts rather than vague requests that trigger expensive broad file scanning.

**Cursor's free tier is best treated as a precision tool, not a workhorse.** With roughly 50 premium requests/month, allocate them exclusively to multi-file Composer edits and visual debugging sessions where Cursor's IDE-native diff review adds irreplaceable value. For everything else, use the free models (Gemini 2.5 Flash, DeepSeek v3) which are unlimited. Time your **14-day Pro trial** to coincide with your most intensive polish sprint for maximum leverage.

The decision to escalate from free to paid tools follows a simple heuristic: if you've spent **more than 3 Gemini CLI prompts** trying to get something right and the output keeps degrading, switch to Claude Code. The cost of burning paid credits is always less than the cost of wasting hours on tool wrestling.

---

## Iteration patterns for the build-test-learn cycle

Post-interview iteration is where multi-tool workflows either shine or collapse. The key principle: **update the spec before touching the code**.

After each discovery interview, return to conversational Claude and update `requirements.md` with new insights. Classify feedback into three categories that map to different tool strategies. **Small UI tweaks** (copy changes, color adjustments, spacing) go directly to Gemini CLI with specific file references: "In `src/pages/MatchingPage.tsx`, change the heading from 'Your Matches' to 'Opportunities for You' and increase card gap from gap-4 to gap-6." **Flow changes** (reordering screens, adding a step, changing navigation) require updating the spec first, then a planning prompt to Claude Code: "Read the updated requirements.md. The user flow now requires an onboarding step between login and matching. Create an implementation plan." **New features** always start with specification, never jump to code.

**Cumulative specs outperform delta-based updates.** Keep `requirements.md` as a single source of truth reflecting the current desired state, using git history to track evolution. For session handoffs between tools, maintain a `HANDOFF.md` that Claude Code writes at the end of each session: "Summarize what was done, what's pending, and any decisions made. Save to HANDOFF.md." The next tool — whether Claude Code, Gemini CLI, or Cursor — reads this file to inherit context without re-explaining the project.

**Continue sessions for related work; start fresh for new features.** Practitioners universally recommend resetting conversations every 1–2 hours to prevent "context drift" — the anti-pattern where AI starts producing increasingly incoherent output as the conversation accumulates contradictory context. Claude Code's `/resume` and Gemini CLI's checkpointing let you pick up where you left off for related follow-up work, but a genuinely new feature deserves a clean session with a precise prompt.

The realistic iteration timeline for a discovery prototype: **Prototype v1 in 3–5 days → first interviews on day 6–7 → v2 incorporating feedback in 2–3 days → second round of interviews by day 10–12.** This pace is achievable because AI tools collapse the implementation phase from days to hours. The bottleneck shifts entirely to interview scheduling and insight synthesis — which is exactly where a product person's time should be spent.

---

## Eight anti-patterns that waste time and credits

Real-world failure modes documented by practitioners reveal consistent traps.

**The Big Bang Prompt.** Asking AI to "build me a complete matching app" in a single prompt produces messy, incomplete, fragile code. Break every feature into discrete tasks. The spec-driven three-file pattern (requirements → design → tasks) exists specifically to prevent this.

**Tool Thrashing.** Switching tools mid-task destroys context and creates more work than it saves. A Director of Engineering at ShopBack built an entire "AI DevKit" to solve the problem of "planning lived in one place, implementation in another, testing somewhere else." The fix: set tool boundaries by phase, not by impulse. Commit code before switching. Maintain portable context files.

**The Harmless Upgrade.** AI assistants reflexively upgrade dependencies, TypeScript configs, and ESLint rules. One dual-AI practitioner learned this "the hard way" — lock tsconfig, ESLint, CI, and package versions in your context files with explicit instructions to never modify them.

**Silent Failures.** IEEE Spectrum warned that modern LLMs "generate code that fails to perform as intended but seems to run successfully, removing safety checks or creating fake output." This is worse than crashes because it's undetectable without testing. Always verify AI-generated code against acceptance criteria, especially for LLM integration and data handling.

**Context Drift (The Dory Problem).** Long sessions cause AI to gradually forget earlier requirements and contradict itself. Reset every 1–2 hours. Use `/compact` in Claude Code before context fills up.

**Skipping the First Page Template.** Going directly to multi-page generation without establishing a pattern page means every page needs heavy correction. Build one page fully, review it, and then use it as the reference for all subsequent pages.

**Ignoring shadcn/ui MCP.** Without the MCP server, all three tools hallucinate outdated component APIs. This single integration eliminates the most common source of React/shadcn build failures.

**Over-Specifying Implementation Details.** Specs that dictate function names, internal variable choices, and algorithmic approaches fight against AI's strengths. Specify the *what* and *why*; let AI determine the *how*. Research shows that models degrade when asked to satisfy too many simultaneous micro-constraints — the "curse of instructions" sets in above 150–200 rules.

---

## When things go wrong: a troubleshooting decision tree

When Gemini CLI produces bare, unstyled output — which happens frequently on greenfield generation — don't iterate endlessly. After 2–3 failed refinement attempts, copy the structural code Gemini produced, switch to Claude Code, and prompt: "Here's a React component with correct structure but no styling. Apply Tailwind CSS and shadcn/ui components matching the wireframe at `notes/wireframes.md`." This leverages Gemini's strength (structure) and Claude's strength (polish) without wasting credits on either tool's weakness.

When Claude Code hits rate limits mid-session, use `/compact` to reduce context, then switch to Gemini CLI for remaining tasks in that window. Claude Code's limits reset every 5 hours on a rolling basis — plan your most important Claude sessions for the start of your coding blocks.

When Cursor's free credits run out, switch Composer requests to the free Gemini 2.5 Flash model, which handles multi-file edits adequately if less elegantly. Reserve any remaining premium requests for the final polish sprint.

When AI-generated code causes React re-rendering performance issues — a documented common problem — explicitly prompt for memoization: "Wrap expensive computations in useMemo and event handlers in useCallback. Add React.memo to list item components." AI tools don't optimize performance unprompted.

When tools modify shadcn/ui base components in `src/components/ui/`, revert with git and add the boundary rule to your context file with stronger emphasis: "CRITICAL: NEVER modify any file in src/components/ui/. These are shadcn/ui base components. Create new components that compose these primitives instead."

---

## Conclusion

The four-tool workflow succeeds because it maps each tool's empirically documented strengths to the phase where those strengths matter most. Gemini CLI's unlimited free tier and massive context window handle the volume work — scaffolding, boilerplate, styling, and tests. Claude Code's superior reasoning handles the precision work — architecture, complex logic, and the critical first-page template that all subsequent pages follow. Cursor's visual IDE excels at the integration work — multi-file refactoring, debugging, and final polish. Conversational Claude handles the thinking work — specifications, planning, and post-interview synthesis.

The non-obvious insight from practitioner data: **the specification is the product, not the code.** A well-structured three-file spec (requirements, design, tasks) with EARS-format acceptance criteria and ASCII wireframes makes AI tools nearly interchangeable. The spec, not the tool, determines output quality. Invest 40% of your total time in specification and planning — this is where a product/UX background becomes the decisive advantage. The AI tools compress implementation from the bottleneck to the easy part, freeing you to focus on what actually matters for lean discovery: understanding users and iterating on the value proposition.