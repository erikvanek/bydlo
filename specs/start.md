# Designer Matchmaking Platform — Discovery Prototype Specification

## Objective

Build a clickable prototype demonstrating a matchmaking platform that connects freelance designers/architects with people in transitional living situations (students sharing flats, couples moving in together, small renovations). This prototype validates demand-side interest during discovery interviews. Users will interact with it in the second half of interviews to provide feedback on the concept, value proposition, and matching experience.

**Key validation questions:** Do people in these scenarios recognize they need design help? Does the consultation model feel accessible and valuable? What information do they need to trust and choose a designer? Does the AI-guided conversation feel helpful or intrusive?

## Tech Stack

- **React 18+** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling (core utility classes only)
- **shadcn/ui** for UI components
- **React Router** for navigation
- **LLM API Integration** — Anthropic Claude API or similar for conversational question flow
- **No state management library** — useState and React Context only

### shadcn/ui Setup

Initialize the project with shadcn/ui from scratch:

```bash
# Create Vite project with React + TypeScript
npm create vite@latest designer-matchmaking -- --template react-ts
cd designer-matchmaking

# Install dependencies
npm install

# Initialize shadcn/ui (will set up Tailwind, config files, etc.)
npx shadcn@latest init

# When prompted:
# - Style: Default
# - Base color: Slate (or your preference)
# - CSS variables: Yes

# Install required shadcn components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add textarea
npx shadcn@latest add select
npx shadcn@latest add badge
npx shadcn@latest add dialog
npx shadcn@latest add slider
npx shadcn@latest add checkbox
npx shadcn@latest add avatar
npx shadcn@latest add separator

# Install React Router
npm install react-router-dom
```

All shadcn components will be in `src/components/ui/` and can be customized directly.

## User Flows

### Journey 1: Describe Your Situation (PRIMARY)

1. **Landing** → User sees value proposition and two main options
2. **Situation Input** → User writes a text description of their situation (2-5 sentences)
3. **AI Conversation** → LLM analyzes input and asks 2-4 dynamic follow-up questions to clarify needs
4. **Match Results** → See 3-5 matched designers ranked by relevance
5. **Designer Detail** → Click to see full profile, portfolio, consultation approach
6. **Next Steps** → See how to book a consultation (simulated — prototype stops here)

**Key interaction:** The AI conversation should feel natural and helpful. Questions adapt based on what the user described. Example:
- User writes: "My boyfriend and I are moving in together next month. We both have furniture we love but not sure how to make it work in the new place."
- LLM asks: "What's the size of your new space? Do you have a rough budget in mind for this? Are you open to selling some furniture or mainly looking to arrange what you have?"

### Journey 2: Choose a Consultant

1. **Landing** → User sees value proposition and two main options
2. **Browse Designers** → Grid of all available designers with filters (specialty, location, rate, availability)
3. **Designer Detail** → Same as Journey 1
4. **Next Steps** → Same as Journey 1

**Key interaction:** User wants to explore designers first without describing their situation. They can filter and sort to find someone that fits their criteria.

## Project Structure

```
src/
├── components/
│   ├── ui/              # UI library components (TBD)
│   ├── SituationInput.tsx
│   ├── ConversationMessage.tsx
│   ├── ConversationThread.tsx
│   ├── DesignerCard.tsx
│   ├── DesignerProfile.tsx
│   └── FilterBar.tsx
├── pages/
│   ├── LandingPage.tsx
│   ├── DescribeSituationPage.tsx
│   ├── ConversationPage.tsx
│   ├── ResultsPage.tsx
│   ├── DesignerDetailPage.tsx
│   └── BrowsePage.tsx
├── data/
│   └── designers.ts
├── types/
│   └── index.ts
├── context/
│   └── ConversationContext.tsx
├── services/
│   └── llmService.ts      # API calls to LLM
├── App.tsx
└── main.tsx
```

## Data Model

```typescript
// Core entities

interface Designer {
  id: string;
  name: string;
  specialty: 'interior' | 'architect' | 'both';
  photo: string; // URL to placeholder image
  hourlyRate: number; // in EUR
  availability: 'immediate' | 'within-week' | 'within-month';
  location: string; // Prague, Brno, Olomouc, or Ostrava
  yearsExperience: number;
  shortBio: string; // 1-2 sentences
  approach: string; // 2-3 sentences about consultation style
  portfolioImages: string[]; // 3-5 URLs
  tags: string[]; // e.g. ['small spaces', 'budget-friendly', 'scandinavian']
  matchScore?: number; // 0-100, calculated based on user conversation
}

interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ConversationState {
  initialDescription: string;
  messages: ConversationMessage[];
  extractedNeeds: {
    spaceType?: string;
    budget?: number;
    timeline?: string;
    priorities?: string[];
    constraints?: string[];
  };
  isComplete: boolean;
}

interface MatchCriteria {
  needs: ConversationState['extractedNeeds'];
  preferredSpecialty?: string[];
  maxRate?: number;
  locationPreference?: string[];
}
```
```

## Mock Data

**Designers:** Create 12-16 fictional designers distributed across locations:
- Prague: 6-8 designers
- Brno: 3-4 designers  
- Olomouc: 2 designers
- Ostrava: 2 designers

Use realistic Czech/European names. Vary specialties (interior, architect, both), rates (€40-120/hour), and experience levels (2-15 years). Use placeholder photos from UI Faces or similar.

Each designer should have:
- Unique combination of tags (e.g., "small spaces", "scandinavian style", "budget-friendly", "sustainable design", "color consultation")
- Realistic short bio reflecting their specialty
- 3-5 portfolio image placeholders
- Varied availability (distributed across immediate/within-week/within-month)

**LLM Responses (for initial implementation):** Mock responses for development/testing before LLM API is connected. Store example follow-up questions organized by common situation types (shared flat, couple moving, renovation). These will be replaced with real API calls in later phases.

## LLM Integration

### Architecture

The LLM powers the conversational flow in Journey 1. It analyzes user's initial situation description and generates contextual follow-up questions to extract key information for matching.

**API Service Structure:**
```typescript
// services/llmService.ts

interface LLMRequest {
  conversationHistory: ConversationMessage[];
  systemPrompt: string;
}

interface LLMResponse {
  message: string;
  extractedData?: Partial<ConversationState['extractedNeeds']>;
  shouldContinue: boolean; // false when enough info collected
}

export const llmService = {
  // Generate next question based on conversation so far
  generateFollowUp: async (request: LLMRequest): Promise<LLMResponse> => {
    // Will call Claude API or similar
    // For initial implementation, can return mock responses
  },
  
  // Extract structured needs from conversation
  extractNeeds: async (conversationHistory: ConversationMessage[]): Promise<ConversationState['extractedNeeds']> => {
    // Summarize conversation into structured matching criteria
  }
};
```

**System Prompt Guidelines:**
The LLM should be prompted to:
- Ask 2-4 focused questions (not more, to avoid interview fatigue)
- Focus on: space type, budget range, timeline, key priorities, major constraints
- Be conversational and empathetic, not interrogative
- Recognize when enough information has been gathered
- Extract needs in structured format for matching algorithm

**Mock vs. Real Implementation:**
- **Phase 1 (initial prototype):** Mock responses based on simple pattern matching of user input
- **Phase 2:** Real API integration with Claude/GPT
- Both phases should use identical interfaces so swapping is seamless

### Conversation Flow Example

```
User: "My boyfriend and I are moving in together next month. We both have 
furniture we love but not sure how to make it work."

LLM: "That's an exciting step! A few questions to help match you with the 
right designer: What's the size of your new space? And do you have a rough 
budget in mind for the consultation?"

User: "It's about 65m², two bedroom flat in Prague 2. Budget maybe €200-300?"

LLM: "Perfect. Last question - are you mainly looking to arrange what you 
already have, or are you open to selling some pieces and buying new items 
that work better together?"

User: "We'd like to keep what we have if possible, maybe just add a few 
smaller things."

LLM: "Great, I have everything I need. Let me find designers who specialize 
in space planning and furniture arrangement!"

→ Navigate to Results with extracted needs
```

## Screen Specifications

*Note: Detailed screen layouts and components will be finalized based on low-fidelity wireframes. The specifications below describe functional requirements and key interactions.*

### Landing Page
**Purpose:** Communicate value proposition and present two entry points

**Key Elements:**
- Value proposition: headline + explanation of consultation-based model
- Two prominent CTAs: "Describe your situation" (primary) and "Choose a consultant" (secondary)
- Trust signals (fictional: "100+ successful matches", "30+ designers across Czech Republic")

**Acceptance Criteria:**
- WHEN the user lands on the page, THE SYSTEM SHALL display both journey entry points prominently
- WHEN the user clicks "Describe your situation," THE SYSTEM SHALL navigate to /describe
- WHEN the user clicks "Choose a consultant," THE SYSTEM SHALL navigate to /browse

*Detailed layout will be based on low-fi wireframe.*

---

### Describe Situation Page (Journey 1 Entry)
**Purpose:** Collect initial situation description from user

**Key Elements:**
- Prompt: "Tell us about your situation" with helpful examples
- Text area for user input (2-5 sentences expected)
- "Continue" button (disabled until meaningful input provided)
- Optional: example situations to inspire user

**Acceptance Criteria:**
- WHEN the user types at least 20 characters, THE SYSTEM SHALL enable the "Continue" button
- WHEN the user clicks "Continue," THE SYSTEM SHALL store the initial description in ConversationContext and navigate to /conversation
- THE SYSTEM SHALL display placeholder text with an example like "We're students moving into a 3-bedroom flat together next month. We each have some furniture but the space feels cramped and we're not sure how to make it work..."

*Detailed layout will be based on low-fi wireframe.*

---

### Conversation Page (Journey 1)
**Purpose:** AI-guided dialogue to extract key needs

**Key Elements:**
- Chat-style interface showing conversation history
- User's initial description displayed at top
- LLM questions appear as assistant messages
- User response input field
- Visual indicator when LLM is "thinking" (generating next question)
- "See matches" button appears when conversation is complete

**Acceptance Criteria:**
- WHEN the page loads, THE SYSTEM SHALL send the user's initial description to the LLM service and display the first follow-up question
- WHEN the user submits a response, THE SYSTEM SHALL add it to conversation history, send updated history to LLM service, and display the next question
- WHEN the LLM determines enough information is collected (shouldContinue: false), THE SYSTEM SHALL display "See matches" button instead of input field
- WHEN the user clicks "See matches," THE SYSTEM SHALL extract structured needs from conversation and navigate to /results
- THE SYSTEM SHALL display a loading indicator while waiting for LLM responses
- THE SYSTEM SHALL handle LLM errors gracefully (show error message, allow retry)

**Mock Implementation:**
For initial development without LLM API, use pattern matching on keywords:
- If user mentions "flat" or "apartment" → ask about size
- If user mentions "moving" or "together" → ask about timeline  
- If user mentions budget amount → skip budget question
- After 2-3 questions → mark as complete

*Detailed layout will be based on low-fi wireframe.*

---

### Results Page (Both Journeys)
**Purpose:** Show matched designers ranked by relevance

**Entry points:**
- Journey 1: After completing conversation
- Journey 2: Could arrive here if Browse page had a "Show best matches" feature (optional)

**Key Elements:**
- Header: "We found [N] designers for you" (for Journey 1) or just designer grid (for Journey 2)
- If from Journey 1: summary of key needs extracted from conversation
- Grid of 3-5 DesignerCard components (photo, name, specialty, rate, match score, 1-sentence bio)
- "View profile" CTA on each card
- Filter/sort options (by rate, by location, by availability, by specialty)

**Acceptance Criteria:**
- WHEN the user arrives from the conversation flow, THE SYSTEM SHALL display 3-5 designers with match scores calculated from extracted needs
- WHEN the user clicks "View profile" on a card, THE SYSTEM SHALL navigate to /designer/[id]
- WHEN the user changes the sort dropdown, THE SYSTEM SHALL reorder the designer cards accordingly without page reload
- WHEN the user applies filters, THE SYSTEM SHALL update the grid to show only matching designers
- THE SYSTEM SHALL display each designer's hourly rate, location, and availability badge prominently on the card
- THE SYSTEM SHALL show a match score percentage (e.g., "87% match") on each card for Journey 1

**Matching Algorithm:**
Calculate match scores based on conversation data:
- Location match: +30 if designer in same city as user (if mentioned)
- Specialty alignment: +25 if designer specialty matches need type (space planning, renovation, etc.)
- Budget fit: +25 if designer rate is within user's stated budget range
- Availability match: +20 if designer availability matches user timeline

Add small random variation (±5) to feel realistic. Only show designers with 70+ match score.

*Detailed layout will be based on low-fi wireframe.*

---

### Designer Detail Page (Both Journeys)
**Purpose:** Provide enough information for user to imagine booking

**Key Elements:**
- Designer header: photo, name, specialty, rate, availability, location
- "About" section: bio + approach to consultations
- Portfolio grid: 3-5 project photos
- Tags/specialties: badges showing expertise areas
- "Book a consultation" CTA (simulated)
- Back to previous page link

**Acceptance Criteria:**
- WHEN the user clicks "Book a consultation," THE SYSTEM SHALL show a dialog with message "In the real platform, this would connect you directly with [designer name]. For now, this is the end of the prototype." and a "Close" button
- WHEN the user clicks the back link, THE SYSTEM SHALL navigate to the previous page (either /results or /browse) preserving any filter/sort state
- THE SYSTEM SHALL display all portfolio images in a grid that is visually balanced (3 columns on desktop, 2 on tablet, 1 on mobile)

*Detailed layout will be based on low-fi wireframe.*

---

### Browse Page (Journey 2 Entry)
**Purpose:** Allow users to explore all designers without describing their situation first

**Key Elements:**
- Search/filter bar: specialty, location, rate range, availability
- Grid of all 12-16 designers as cards (no match scores shown)
- Each card links to designer detail

**Acceptance Criteria:**
- WHEN the user changes any filter, THE SYSTEM SHALL update the designer grid showing only designers matching all active filters
- WHEN no designers match the filters, THE SYSTEM SHALL display a "No designers found. Try adjusting your filters." message
- WHEN the user clears all filters, THE SYSTEM SHALL display all 12-16 designers
- THE SYSTEM SHALL display location filter with options: All locations, Prague, Brno, Olomouc, Ostrava
- THE SYSTEM SHALL display specialty filter with options: All specialties, Interior Design, Architecture, Both

*Detailed layout will be based on low-fi wireframe.*

## Component Specifications

*Component details will be refined based on low-fi wireframes. These are functional specifications with shadcn/ui components.*

**SituationInput**
- Props: `{ onSubmit: (description: string) => void; placeholder?: string }`
- Uses: shadcn `Textarea` for input, shadcn `Button` for submit
- Validates minimum length (20 chars) before enabling submit
- Shows character count helper text

**ConversationMessage**
- Props: `{ message: ConversationMessage; isLatest?: boolean }`
- Uses: shadcn `Card` for message container, shadcn `Avatar` for user/assistant icons
- Renders differently for user vs assistant messages (alignment, styling)
- User messages: right-aligned, different background
- Assistant messages: left-aligned with avatar icon
- Supports markdown in assistant messages if needed

**ConversationThread**
- Props: `{ messages: ConversationMessage[]; onUserResponse: (response: string) => void; isWaitingForLLM: boolean; isComplete: boolean }`
- Uses: shadcn `Input` for user response, shadcn `Button` for submit/see matches, shadcn `Separator` between messages
- Manages auto-scrolling to latest message
- Shows loading state (spinner/dots) when `isWaitingForLLM` is true
- Shows "See matches" button when `isComplete` is true instead of input field

**DesignerCard**
- Props: `{ designer: Designer; showMatchScore?: boolean; onViewProfile: () => void }`
- Uses: shadcn `Card`, shadcn `Badge` for specialty/availability, shadcn `Avatar` for photo
- Displays: photo, name, specialty badge, location, rate, availability badge, short bio (truncated), match score if provided
- Hover state should use shadcn's hover utilities
- Responsive: full-width on mobile, 2-column grid on tablet, 3-4 column grid on desktop

**DesignerProfile**
- Props: `{ designer: Designer; onBookConsultation: () => void; onBack: () => void }`
- Uses: shadcn `Card` for sections, shadcn `Badge` for tags, shadcn `Button` for actions, shadcn `Dialog` for booking confirmation
- Full designer information display with clear sections
- Portfolio image gallery in responsive grid
- "Book consultation" triggers shadcn `Dialog` with prototype end message

**FilterBar**
- Props: `{ onFilterChange: (filters: FilterState) => void; availableLocations: string[]; availableSpecialties: string[] }`
- Uses: shadcn `Select` for dropdowns, shadcn `Slider` for rate range, shadcn `Checkbox` for availability
- Controls: location dropdown, specialty dropdown, rate range slider, availability checkboxes
- Updates trigger immediate filtering without submit button
- Shows active filter count as badge

## Real vs. Simulated vs. Not Implemented

| Feature | Implementation |
|---------|---------------|
| All UI components | **REAL** — fully functional React components |
| Navigation | **REAL** — React Router with proper routes |
| Form validation | **REAL** — validate inputs before allowing submission |
| Filtering/sorting | **REAL** — works without page reload |
| Conversation interface | **REAL** — chat-style message display and input |
| LLM conversation (Phase 1) | **SIMULATED** — pattern-matching mock responses based on keywords |
| LLM conversation (Phase 2) | **REAL** — actual API calls to Claude/GPT for dynamic questions |
| Needs extraction | **SIMULATED (Phase 1) / REAL (Phase 2)** — extract structured data from conversation |
| Designer matching | **SIMULATED** — calculate scores using rule-based logic on mock data |
| "Book consultation" action | **SIMULATED** — shows dialog explaining this is end of prototype |
| Designer availability | **SIMULATED** — static mock data, not checking real calendars |
| User accounts | **NOT IMPLEMENTED** — no login, registration, or persistence |
| Payment processing | **NOT IMPLEMENTED** — prototype stops before payment |
| Actual booking/scheduling | **NOT IMPLEMENTED** — not needed for discovery validation |
| Backend API (except LLM) | **NOT IMPLEMENTED** — all designer data is imported TypeScript files |
| Database | **NOT IMPLEMENTED** |
| Email/notifications | **NOT IMPLEMENTED** |

## Scope Boundaries

### DO Build:
- Landing page with two clear CTAs for both journeys
- Journey 1: Situation input → AI conversation → Match results → Designer detail
- Journey 2: Browse/filter → Designer detail
- Conversation interface with message history display
- LLM service abstraction layer (works with mock data initially, swappable for real API)
- Filtering and sorting on browse and results pages
- Responsive design (mobile, tablet, desktop)
- Loading states for LLM "thinking" and route transitions
- Empty states ("No designers found", "No messages yet")
- Error handling for LLM failures (with retry option)

### DO NOT Build:
- Scenario selection flow (removed per feedback)
- Static questionnaire with predefined questions
- Authentication or user accounts
- Any backend services except LLM API integration
- Real payment processing
- Email functionality
- Admin interfaces
- Real-time features
- Analytics tracking
- Designer-facing views (onboarding, profile editing, calendar management)
- Booking calendar or scheduling logic beyond simulated "book" button
- Reviews or rating systems (can show fake average ratings on cards if helpful)
- Multi-language support
- Accessibility features beyond semantic HTML (can be added in refinement)

## Code Style & Patterns

**Component Pattern with shadcn:**
```typescript
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const ConversationMessage = ({ message, isLatest }: ConversationMessageProps) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <Avatar>
        <AvatarFallback>{isUser ? 'You' : 'AI'}</AvatarFallback>
      </Avatar>
      <Card className={isUser ? 'bg-primary text-primary-foreground' : ''}>
        <CardContent className="p-4">
          {message.content}
        </CardContent>
      </Card>
    </div>
  );
};
```

**Using shadcn Dialog:**
```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const [showBookingDialog, setShowBookingDialog] = useState(false);

<Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Prototype Endpoint</DialogTitle>
      <DialogDescription>
        In the real platform, this would connect you directly with {designer.name}. 
        For now, this is the end of the prototype.
      </DialogDescription>
    </DialogHeader>
    <Button onClick={() => setShowBookingDialog(false)}>Close</Button>
  </DialogContent>
</Dialog>
```

**Routing:**
```typescript
// Use React Router v6+ patterns
<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/describe" element={<DescribeSituationPage />} />
  <Route path="/conversation" element={<ConversationPage />} />
  <Route path="/results" element={<ResultsPage />} />
  <Route path="/browse" element={<BrowsePage />} />
  <Route path="/designer/:id" element={<DesignerDetailPage />} />
</Routes>
```

**Context Usage:**
```typescript
// ConversationContext stores conversation state during Journey 1
const ConversationContext = createContext<{
  state: ConversationState | null;
  addMessage: (message: ConversationMessage) => void;
  setComplete: (extractedNeeds: ConversationState['extractedNeeds']) => void;
} | null>(null);
```

**LLM Service Pattern:**
```typescript
// Abstraction allows swapping mock for real API
export const llmService = {
  generateFollowUp: async (request: LLMRequest): Promise<LLMResponse> => {
    if (USE_MOCK_LLM) {
      return mockLLMResponse(request);
    }
    return realLLMAPICall(request);
  }
};
```

**Styling with shadcn:**
- shadcn components come pre-styled with Tailwind
- Customize via className prop with Tailwind utilities
- Use shadcn's CSS variables for theming consistency (e.g., `bg-primary`, `text-foreground`)
- Mobile-first responsive (sm: tablet, md: desktop, lg: desktop large)
- Consistent spacing using shadcn's conventions (p-4, p-6, gap-4)

## Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Success Criteria

This prototype is successful if:
1. A user can complete Journey 1 (describe situation → conversation → results → designer detail) in under 4 minutes
2. A user can complete Journey 2 (browse → filter → designer detail) in under 2 minutes
3. The AI conversation feels natural and not interrogative (users should feel helped, not interviewed)
4. The matching results feel plausible and relevant based on what the user described
5. All interactions feel responsive (no loading delays >2 seconds even with mock LLM)
6. Users in discovery interviews understand the value proposition and can articulate whether they would use this service
7. The filtering on browse page produces intuitive results
8. Users can easily understand what stage they're at in the flow (clear navigation, progress indicators)

## Notes for AI Implementation

- **shadcn/ui advantages:** Components are in your project (`src/components/ui/`), so you can read and modify them directly. This is ideal for AI-driven development because the AI can see actual implementation, not just documentation.
- Start with routing and basic page structure before adding LLM integration
- Run `npx shadcn@latest add [component]` to add new shadcn components as needed
- Implement mock LLM service first (pattern matching on keywords), then make it swappable for real API
- The conversation flow is the most critical UX — prioritize making it feel smooth and responsive
- Use placeholder images from UI Faces, Unsplash, or generate via simple colored gradients with initials
- Distribute mock designers realistically across Prague (6-8), Brno (3-4), Olomouc (2), Ostrava (2)
- The matching algorithm can be very simple — focus on the UI/UX feeling intelligent, not actual ML
- Error handling for LLM failures should be graceful: show message, allow retry, don't break the flow
- shadcn components are accessible by default — maintain semantic HTML structure
- Use shadcn's theming variables (`bg-primary`, `text-muted-foreground`, etc.) for consistency
- If adding micro-interactions, use shadcn's built-in hover/focus states
- Designer detail pages should feel professional and trustworthy since that's the conversion point
- The "describe situation" journey is primary — it should be visually prioritized on landing page
- Keep conversation to 2-4 questions maximum to avoid fatigue
- Build for readability: conversation messages should have good contrast, comfortable line height, appropriate font size