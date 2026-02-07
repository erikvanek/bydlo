import type { ConversationMessage, ExtractedNeeds } from '@/types'

export interface LLMRequest {
  conversationHistory: ConversationMessage[]
  systemPrompt: string
}

export interface LLMResponse {
  message: string
  extractedData?: Partial<ExtractedNeeds>
  shouldContinue: boolean
}

const USE_MOCK_LLM = true

/**
 * Generate next follow-up question based on conversation so far.
 * Phase 1: mock responses via pattern matching.
 * Phase 2: swap to real Claude/API call.
 */
export async function generateFollowUp(request: LLMRequest): Promise<LLMResponse> {
  if (USE_MOCK_LLM) {
    return mockGenerateFollowUp(request)
  }
  return realLLMCall(request)
}

/**
 * Extract structured needs from full conversation for matching.
 */
export async function extractNeeds(
  conversationHistory: ConversationMessage[]
): Promise<ExtractedNeeds> {
  if (USE_MOCK_LLM) {
    return mockExtractNeeds(conversationHistory)
  }
  return realExtractNeeds(conversationHistory)
}

// —— Mock implementation (Phase 1) ——

function mockGenerateFollowUp(request: LLMRequest): LLMResponse {
  const { conversationHistory } = request
  const lastUser = [...conversationHistory].reverse().find((m) => m.role === 'user')
  const text = (lastUser?.content ?? '').toLowerCase()
  const questionCount = conversationHistory.filter((m) => m.role === 'assistant').length

  if (questionCount === 0) {
    if (text.includes('flat') || text.includes('apartment') || text.includes('byt')) {
      return {
        message: "What's the size of your new space (roughly in m²)? And do you have a rough budget in mind for the consultation?",
        shouldContinue: true,
      }
    }
    if (text.includes('moving') || text.includes('together') || text.includes('spolu')) {
      return {
        message: "That's an exciting step! When are you planning to move? And do you have a rough budget in mind for design help?",
        shouldContinue: true,
      }
    }
    return {
      message: "What's the size of your space? Do you have a rough budget in mind for the consultation?",
      shouldContinue: true,
    }
  }

  if (questionCount === 1) {
    if (text.match(/\d+/) && (text.includes('€') || text.includes('eur') || text.includes('budget') || text.includes('korun'))) {
      return {
        message: "Last question — are you mainly looking to arrange what you already have, or are you open to selling some pieces and buying new items that work better together?",
        shouldContinue: true,
      }
    }
    return {
      message: "Do you have a rough budget in mind (e.g. in EUR)? And are you mainly looking to arrange what you have, or open to buying new pieces?",
      shouldContinue: true,
    }
  }

  if (questionCount >= 2) {
    return {
      message: "Great, I have enough to go on. Let me find designers who match your situation!",
      shouldContinue: false,
      extractedData: {},
    }
  }

  return {
    message: "Thanks — I have enough information. Let me find some designers for you.",
    shouldContinue: false,
    extractedData: {},
  }
}

function mockExtractNeeds(conversationHistory: ConversationMessage[]): ExtractedNeeds {
  const needs: ExtractedNeeds = {}
  const allText = conversationHistory
    .filter((m) => m.role === 'user')
    .map((m) => m.content)
    .join(' ')
    .toLowerCase()

  const sizeMatch = allText.match(/(\d+)\s*m²|(\d+)\s*m2|(\d+)\s*sqm/i) ?? allText.match(/(\d+)\s*(square|sq)/i)
  if (sizeMatch) {
    const num = parseInt(sizeMatch[1] ?? sizeMatch[2] ?? sizeMatch[3] ?? '0', 10)
    if (num > 0) needs.spaceType = `~${num} m²`
  }

  const budgetMatch = allText.match(/€?\s*(\d+)\s*[-–]\s*€?\s*(\d+)|(\d+)\s*eur|budget\s*(\d+)/i)
  if (budgetMatch) {
    const a = parseInt(budgetMatch[1] ?? budgetMatch[3] ?? budgetMatch[4] ?? '0', 10)
    const b = parseInt(budgetMatch[2] ?? '0', 10)
    needs.budget = b > a ? Math.round((a + b) / 2) : a
  }

  if (allText.includes('next month') || allText.includes('příští měsíc')) needs.timeline = 'within-month'
  else if (allText.includes('next week') || allText.includes('asap') || allText.includes('soon')) needs.timeline = 'within-week'
  else if (allText.includes('moving') || allText.includes('stěhování')) needs.timeline = needs.timeline ?? 'within-month'

  if (allText.includes('arrange') || allText.includes('what we have') || allText.includes('keep')) {
    needs.priorities = ['arrange existing furniture']
  }
  if (allText.includes('prague') || allText.includes('praha')) needs.constraints = ['Prague']
  if (allText.includes('brno')) needs.constraints = ['Brno']

  return needs
}

// —— Real API stubs (Phase 2) ——

async function realLLMCall(_request: LLMRequest): Promise<LLMResponse> {
  // TODO: call Anthropic Claude API or similar
  return mockGenerateFollowUp(_request)
}

async function realExtractNeeds(_conversationHistory: ConversationMessage[]): Promise<ExtractedNeeds> {
  // TODO: call LLM to summarize conversation into structured needs
  return mockExtractNeeds(_conversationHistory)
}
