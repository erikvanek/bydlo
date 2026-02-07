# Wireframes — ASCII layouts for AI comprehension

Low-fidelity ASCII wireframes for each screen. Use with [requirements.md](../requirements.md) and [design.md](../design.md).  
**Annotate behavior:** e.g. "[shadcn Card]", "click → /designer/:id", "stack below md".

---

## Landing (redesigned)

```
┌──────────────────────────────────────────────────────────────────────┐
│  TWO-COLUMN SECTION  (lg: side-by-side, <lg: stacked)               │
│                                                                      │
│  ┌──────────────────────────────────┬───────────────────────────┐   │
│  │  LEFT (lg:col-span-7)            │ RIGHT (lg:col-span-5)     │   │
│  │                                   │                           │   │
│  │  Designer Matchmaking             │ [shadcn Card]             │   │
│  │  Find the right designer for     │  How it works             │   │
│  │  your living situation.           │                           │   │
│  │                                   │  ① Describe               │   │
│  │  ┌───────────────────────────┐   │    Tell us your situation │   │
│  │  │ [shadcn Textarea — large] │   │  ② Chat                   │   │
│  │  │ nudging placeholder text  │   │    A few follow-ups       │   │
│  │  │                      [→]  │   │  ③ Match                  │   │
│  │  │  ← Arrow submit button    │   │    See fitting designers  │   │
│  │  └───────────────────────────┘   │  ④ Book                   │   │
│  │  N chars (min 20)                 │    Pick and book          │   │
│  │                                   │                           │   │
│  │  [Moving in with partner]         │                           │   │
│  │  [Shared flat refresh]            │                           │   │
│  │  [Small kitchen reno]             │                           │   │
│  │  ← outline buttons, fill textarea│                           │   │
│  │                                   │                           │   │
│  │  or Browse all consultants →      │                           │   │
│  └──────────────────────────────────┴───────────────────────────┘   │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│  FEATURED CONSULTANTS (full width)                                   │
│                                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │ [Avatar] │  │ [Avatar] │  │ [Avatar] │  │ [Avatar] │           │
│  │ Name     │  │ Name     │  │ Name     │  │ Name     │           │
│  │ Spec·€/h │  │ Spec·€/h │  │ Spec·€/h │  │ Spec·€/h │           │
│  │[View pr.]│  │[View pr.]│  │[View pr.]│  │[View pr.]│           │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘           │
│  ← reuses DesignerCard, click → /designer/:id                       │
│  sm:grid-cols-2, lg:grid-cols-4                                      │
│                                                                      │
│  [See all consultants →]  ← link to /browse                        │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Landing — context completeness nudge

The goal: reduce conversation back-and-forth by nudging users to provide richer
initial descriptions. The right sidebar transforms from "How it works" (empty
textarea) to a "Your situation" checklist (once they start typing).

**Detection is LLM-based** — a lightweight Claude call (Haiku) extracts
structured data from the user's free text. This handles Czech declension,
diacritics, informal language, and mixed Czech/English reliably.
Debounce: **500ms** after user stops typing.

### State 1 — Empty (current behavior, "How it works" visible)

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  Bydlo                                                               │
│  Helping you live better — one room at a time.                       │
│                                                                      │
│  ┌──────────────────────────────────┬───────────────────────────┐   │
│  │  LEFT (lg:col-span-8)            │ RIGHT (lg:col-span-4)     │   │
│  │                                   │                           │   │
│  │  Describe your living situation   │ [Card, muted]             │   │
│  │  and we'll match you with a       │  HOW IT WORKS             │   │
│  │  freelance designer who can help. │                           │   │
│  │                                   │  ① Describe               │   │
│  │  ┌───────────────────────────┐   │    your situation         │   │
│  │  │ placeholder text…         │   │  ② Add                    │   │
│  │  │                           │   │    more details            │   │
│  │  │                      [→]  │   │  ③ Match                  │   │
│  │  └───────────────────────────┘   │    with a designer        │   │
│  │  0 / 500                         │  ④ Book                   │   │
│  │                                   │    a consultation         │   │
│  │  TYPICAL SCENARIOS                │                           │   │
│  │  [Moving in with partner]         │                           │   │
│  │  [Shared flat refresh]            │                           │   │
│  │  [Small kitchen reno]             │                           │   │
│  └──────────────────────────────────┴───────────────────────────┘   │
│                                                                      │
│  ... featured consultants below ...                                  │
└──────────────────────────────────────────────────────────────────────┘
```

### State 2 — Typing (sidebar crossfades to checklist)

The sidebar card content crossfades (opacity transition, ~200ms) from
"How it works" to "Your situation" checklist. Same card container —
no layout shift. Triggers when the LLM analysis returns at least one
detected field.

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  Bydlo                                                               │
│  Helping you live better — one room at a time.                       │
│                                                                      │
│  ┌──────────────────────────────────┬───────────────────────────┐   │
│  │  LEFT (lg:col-span-8)            │ RIGHT (lg:col-span-4)     │   │
│  │                                   │                           │   │
│  │  Describe your living situation   │ [Card, subtle border]     │   │
│  │                                   │  YOUR SITUATION           │   │
│  │  ┌───────────────────────────┐   │                           │   │
│  │  │ S partnerem se stěhujeme │   │  ✓ Location               │   │
│  │  │ do bytu 2+kk v Praze     │   │    Praha                  │   │
│  │  │ příští měsíc. Máme rozpočet│   │                           │   │
│  │  │ asi 1500 Kč/h a potřebujeme│   │  ✓ Budget                │   │
│  │  │ pomoct sladit nábytek     │   │    ~1500 Kč/hr            │   │
│  │  │ a zařídit obývák…    [→]  │   │                           │   │
│  │  └───────────────────────────┘   │  ✓ Timeline               │   │
│  │  187 / 500 · ready to go         │    příští měsíc            │   │
│  │                                   │                           │   │
│  │                                   │  ○ What you need          │   │
│  │                                   │    layout? renovation?    │   │
│  │                                   │                           │   │
│  │                                   │  ○ Style preference       │   │
│  │                                   │    optional               │   │
│  │                                   │                           │   │
│  │                                   │  ─────────────────        │   │
│  │                                   │  3 of 5 — good start     │   │
│  └──────────────────────────────────┴───────────────────────────┘   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Detection: LLM-based extraction

Uses a lightweight Claude call (Haiku model via the existing /api/chat proxy)
to extract structured data from the textarea text. Handles Czech + English.

**System prompt** (new, ~150 tokens):
```
Extract what you can from this user description. Return ONLY a JSON object:
{
  "location": "city name or null",
  "budget": "extracted budget string or null",
  "timeline": "when they need help or null",
  "scope": "what they need help with or null",
  "style": "style preferences or null"
}
Respond with valid JSON only. Use null for anything not mentioned.
Preserve the user's language (Czech values stay Czech).
```

**API call details:**
- Model: `claude-haiku-4-20250414` (fast, cheap — ~$0.0002 per call)
- max_tokens: 150
- Debounce: 500ms after last keystroke
- Only fires when textarea.length >= 20 (MIN_LENGTH)
- Abort previous in-flight request when new one fires (AbortController)
- On error/timeout: silently keep previous state (non-blocking)

**Cost estimate:** ~5-10 calls per user session = ~$0.001-0.002 total.

### Behavior notes

- **Transition trigger:** LLM analysis returns at least 1 non-null field.
  Card content crossfades (opacity 0→1, ~200ms). No layout shift.
  When textarea is emptied → revert to "How it works".
- **Checked items (✓):** Green checkmark + extracted value in muted text.
- **Unchecked items (○):** Grey circle + hint text ("layout? renovation?").
  Not required — just helpful nudges.
- **Progress line:** "3 of 5" with a subtle label: "good start" / "almost
  there" / "looking good". NOT a blocker — submit enabled at 20 chars always.
- **Mobile (<lg):** Checklist moves below the textarea (stacked), shown as
  a compact horizontal pill row or collapsed section.
- **Quick scenario buttons:** Fill the textarea and trigger the same debounced
  analysis, so the checklist updates after 500ms.
- **Worker change:** Accept optional `model` param in /api/chat body so the
  frontend can request Haiku for cheap analysis calls.

---

## Describe situation

```
┌─────────────────────────────────────────────────────────┐
│  Tell us about your situation                           │
│  Write 2–5 sentences. e.g. moving in, shared flat…     │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │  [Text area — placeholder example situation]    │   │
│  │                                                  │   │
│  └─────────────────────────────────────────────────┘   │
│  N characters (min 20)                                 │
│  [Continue]  ← enabled when ≥20 chars                 │
└─────────────────────────────────────────────────────────┘
```

---

## Conversation

```
┌─────────────────────────────────────────────────────────┐
│  A few questions                                        │
│  Your situation: "We're students moving into…"          │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │  [AI]: What's the size of your space? …         │   │
│  │  [You]: About 65m², Prague 2                    │   │
│  │  [AI]: Do you have a rough budget? …             │   │
│  │  [Thinking…] or next message                    │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌───────────────────────────────┐ [Send]              │
│  │  Type your answer…            │                     │
│  └───────────────────────────────┘                     │
│  When complete: [See matches] instead of input         │
└─────────────────────────────────────────────────────────┘
```

---

## Results

```
┌─────────────────────────────────────────────────────────┐
│  We found N designers for you                           │
│  Based on: ~65m², budget ~€250, …                        │
├─────────────────────────────────────────────────────────┤
│  [Filters: Location ▾] [Specialty ▾] [Rate ——○] [✓]    │
│  Sort: [Match ▾]                                       │
├─────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ [Photo]  │  │ [Photo]  │  │ [Photo]  │             │
│  │ Name     │  │ Name     │  │ Name     │             │
│  │ 87% match│  │ 82% match│  │ 79% match│             │
│  │ €65/hr   │  │ €75/hr   │  │ €55/hr   │             │
│  │[View pr.]│  │[View pr.]│  │[View pr.]│             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
```

---

## Browse

```
┌─────────────────────────────────────────────────────────┐
│  Browse designers                                       │
├─────────────────────────────────────────────────────────┤
│  [Location ▾] [Specialty ▾] [Rate ——○] [Availability] │
├─────────────────────────────────────────────────────────┤
│  Grid of DesignerCards (no match %)                     │
│  Same card layout: photo, name, specialty, rate,       │
│  location, availability, [View profile]                 │
└─────────────────────────────────────────────────────────┘
```

---

## Designer detail

```
┌─────────────────────────────────────────────────────────┐
│  ← Back                                                 │
├─────────────────────────────────────────────────────────┤
│  [Avatar]  Name                                         │
│            Interior Design · €65/hr · Prague · 8y       │
├─────────────────────────────────────────────────────────┤
│  About                                                   │
│  Short bio. Approach to consultations.                   │
├─────────────────────────────────────────────────────────┤
│  Portfolio                                               │
│  [img] [img] [img]   (3 cols desktop, 2 tablet, 1 mob) │
├─────────────────────────────────────────────────────────┤
│  [tag] [tag] [tag]                                       │
│  [Book a consultation]  → Dialog: end of prototype      │
└─────────────────────────────────────────────────────────┘
```
