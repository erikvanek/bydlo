import type { ConversationMessage, ExtractedNeeds } from '@/types'
import { EXTRACT_NEEDS_PROMPT } from './systemPrompt'

export interface LLMRequest {
  conversationHistory: ConversationMessage[]
  systemPrompt: string
}

export interface LLMResponse {
  message: string
  extractedData?: Partial<ExtractedNeeds>
  shouldContinue: boolean
}

/** Auto-detect: if API key is present, use real Claude. Otherwise, fall back to mock. */
const USE_MOCK_LLM = !import.meta.env.VITE_ANTHROPIC_API_KEY

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const ANTHROPIC_MODEL = 'claude-sonnet-4-20250514'

/**
 * Generate next follow-up question based on conversation so far.
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

// —— Real API implementation ——

async function callClaude(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
  maxTokens = 512
): Promise<string> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('VITE_ANTHROPIC_API_KEY is not set')

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Claude API error (${response.status}): ${error}`)
  }

  const data = await response.json()
  const textBlock = data.content?.find((b: { type: string }) => b.type === 'text')
  if (!textBlock?.text) throw new Error('No text in Claude response')

  return textBlock.text
}

/** Convert internal ConversationMessage[] to Anthropic messages format. */
function toAnthropicMessages(
  history: ConversationMessage[]
): { role: 'user' | 'assistant'; content: string }[] {
  return history.map((m) => ({ role: m.role, content: m.content }))
}

async function realLLMCall(request: LLMRequest): Promise<LLMResponse> {
  const messages = toAnthropicMessages(request.conversationHistory)
  const text = await callClaude(request.systemPrompt, messages)

  // Detect [COMPLETE] prefix
  const isComplete = text.startsWith('[COMPLETE]')
  const cleanMessage = isComplete
    ? text.replace(/^\[COMPLETE\]\s*/, '')
    : text

  return {
    message: cleanMessage,
    shouldContinue: !isComplete,
  }
}

async function realExtractNeeds(
  conversationHistory: ConversationMessage[]
): Promise<ExtractedNeeds> {
  const messages = toAnthropicMessages(conversationHistory)

  // Add a final user message asking for extraction
  const extractionMessages = [
    ...messages,
    {
      role: 'user' as const,
      content: 'Please extract the structured needs from our conversation as JSON.',
    },
  ]

  try {
    const text = await callClaude(EXTRACT_NEEDS_PROMPT, extractionMessages, 1024)

    // Try to parse JSON — handle cases where model wraps in ```json
    const jsonStr = text.replace(/^```json?\n?/, '').replace(/\n?```$/, '').trim()
    const parsed = JSON.parse(jsonStr)

    return {
      spaceType: parsed.spaceType ?? undefined,
      budget: typeof parsed.budget === 'number' ? parsed.budget : undefined,
      timeline: parsed.timeline ?? undefined,
      priorities: Array.isArray(parsed.priorities) ? parsed.priorities : undefined,
      constraints: Array.isArray(parsed.constraints) ? parsed.constraints : undefined,
    }
  } catch (e) {
    console.warn('Failed to extract needs from Claude response, falling back to empty:', e)
    return {}
  }
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
