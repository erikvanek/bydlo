# Requirements — Designer Matchmaking Discovery Prototype

User stories and acceptance criteria in EARS format for AI-actionable specification.  
**Source of truth for *what* to build.** See [start.md](./start.md) for full product spec; [design.md](./design.md) for architecture.

---

## Product context

- **Audience:** People in transitional living (shared flats, couples moving in, small renovations). Czech market (Prague, Brno, Olomouc, Ostrava).
- **Goal:** Validate demand and value proposition via discovery interviews. Prototype is clickable only; no auth, payments, or real booking.
- **Success:** User completes Journey 1 in &lt;4 min, Journey 2 in &lt;2 min; conversation feels helpful; matches feel relevant.

---

## Journey 1: Describe your situation (primary)

### User story

As someone in a transitional living situation, I want to describe my situation in my own words and answer a few follow-up questions, so that I get matched with designers who fit my needs without filling a long form.

### Acceptance criteria

**Landing**
- WHEN the user lands on the app, THE SYSTEM SHALL display both journey entry points prominently ("Describe your situation" primary, "Choose a consultant" secondary).
- WHEN the user clicks "Describe your situation," THE SYSTEM SHALL navigate to /describe.
- WHEN the user clicks "Choose a consultant," THE SYSTEM SHALL navigate to /browse.

**Describe situation**
- WHEN the user types at least 20 characters in the situation text area, THE SYSTEM SHALL enable the "Continue" button.
- WHEN the user clicks "Continue," THE SYSTEM SHALL store the initial description in conversation state and navigate to /conversation.
- THE SYSTEM SHALL display placeholder text with an example situation (e.g. students moving into a 3-bedroom flat).

**Conversation**
- WHEN the conversation page loads, THE SYSTEM SHALL send the user's initial description to the LLM service and display the first follow-up question.
- WHEN the user submits a response, THE SYSTEM SHALL add it to conversation history, call the LLM service with updated history, and display the next question.
- WHEN the LLM indicates enough information is collected (shouldContinue: false), THE SYSTEM SHALL display a "See matches" button instead of the response input.
- WHEN the user clicks "See matches," THE SYSTEM SHALL extract structured needs from the conversation and navigate to /results.
- THE SYSTEM SHALL display a loading indicator while waiting for LLM responses.
- THE SYSTEM SHALL handle LLM errors gracefully (show message, allow retry or dismiss).

**Results**
- WHEN the user arrives from the conversation flow, THE SYSTEM SHALL display 3–5 designers with match scores derived from extracted needs.
- WHEN the user clicks "View profile" on a card, THE SYSTEM SHALL navigate to /designer/[id].
- THE SYSTEM SHALL display each designer's hourly rate, location, and availability on the card.
- THE SYSTEM SHALL show a match score percentage (e.g. "87% match") on each card.

**Designer detail**
- WHEN the user clicks "Book a consultation," THE SYSTEM SHALL show a dialog stating this is the end of the prototype and a "Close" button.
- WHEN the user clicks the back control, THE SYSTEM SHALL navigate to the previous page.

---

## Journey 2: Choose a consultant

### User story

As someone who prefers to browse first, I want to see all designers and filter by specialty, location, rate, and availability, so that I can pick a consultant without describing my situation.

### Acceptance criteria

**Browse**
- WHEN the user changes any filter (location, specialty, rate range, availability), THE SYSTEM SHALL update the designer grid to show only designers matching all active filters.
- WHEN no designers match the filters, THE SYSTEM SHALL display a message such as "No designers found. Try adjusting your filters."
- WHEN all filters are cleared, THE SYSTEM SHALL display all designers (12–16).
- THE SYSTEM SHALL offer location filter options: All locations, Prague, Brno, Olomouc, Ostrava.
- THE SYSTEM SHALL offer specialty filter options: All specialties, Interior Design, Architecture, Both.

**Designer detail**
- (Same as Journey 1: Book consultation dialog, back navigation.)

---

## Cross-cutting

- Filtering and sorting on Results and Browse SHALL work without full page reload.
- Responsive layout: usable on mobile, tablet, desktop.
- No authentication, no persistence of user data across sessions.
- Designer data is static (mock); "Book consultation" is simulated only.

---

## Out of scope (do not implement in this prototype)

- User accounts, login, registration.
- Payment processing.
- Real booking or scheduling.
- Backend API or database (except optional LLM API for Phase 2).
- Email or notifications.
- Admin or designer-facing views.
- Multi-language support.
- Accessibility beyond semantic HTML (can be added later).
