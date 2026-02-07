// Core entities

export interface Designer {
  id: string
  name: string
  specialty: 'interior' | 'architect' | 'both'
  photo: string
  hourlyRate: number
  availability: 'immediate' | 'within-week' | 'within-month'
  location: string
  yearsExperience: number
  shortBio: string
  approach: string
  portfolioImages: string[]
  tags: string[]
  matchScore?: number
}

export interface ConversationMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ExtractedNeeds {
  spaceType?: string
  budget?: number
  timeline?: string
  priorities?: string[]
  constraints?: string[]
}

export interface ConversationState {
  initialDescription: string
  messages: ConversationMessage[]
  extractedNeeds: ExtractedNeeds
  isComplete: boolean
}

export interface MatchCriteria {
  needs: ExtractedNeeds
  preferredSpecialty?: string[]
  maxRate?: number
  locationPreference?: string[]
}

// Filter state for Browse / Results
export interface FilterState {
  location: string
  specialty: string
  rateMin: number
  rateMax: number
  availability: ('immediate' | 'within-week' | 'within-month')[]
}
