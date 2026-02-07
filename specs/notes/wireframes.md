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
