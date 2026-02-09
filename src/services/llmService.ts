import type { ConversationMessage, ExtractedNeeds, DesignerScore } from '@/types'
import { EXTRACT_NEEDS_PROMPT, ANALYZE_DESCRIPTION_PROMPT, SCORE_DESIGNERS_PROMPT } from './systemPrompt'

export interface LLMRequest {
  conversationHistory: ConversationMessage[]
  systemPrompt: string
}

export interface LLMResponse {
  message: string
  extractedData?: Partial<ExtractedNeeds>
  shouldContinue: boolean
}

/**
 * API base URL:
 * - Dev: empty string → relative URL → Vite dev proxy handles /api/chat
 * - Prod: set via VITE_API_URL in .env.production → Cloudflare Worker URL
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const API_URL: string = (import.meta as any).env?.VITE_API_URL || ''

/**
 * Generate next follow-up question based on conversation so far.
 * Tries real API first, falls back to mock on failure.
 */
export async function generateFollowUp(request: LLMRequest): Promise<LLMResponse> {
  try {
    return await realLLMCall(request)
  } catch (e) {
    // If it's a network error (no proxy), fall back to mock
    if (e instanceof TypeError && e.message.includes('fetch')) {
      return mockGenerateFollowUp(request)
    }
    throw e
  }
}

/**
 * Extract structured needs from full conversation for matching.
 */
export async function extractNeeds(
  conversationHistory: ConversationMessage[]
): Promise<ExtractedNeeds> {
  try {
    return await realExtractNeeds(conversationHistory)
  } catch (e) {
    if (e instanceof TypeError && e.message.includes('fetch')) {
      return mockExtractNeeds(conversationHistory)
    }
    throw e
  }
}

/**
 * Real-time analysis of the user's description as they type.
 * Uses Haiku for speed/cost. Returns null-filled object on any error.
 */
export interface DescriptionAnalysis {
  location: string | null
  budget: string | null
  timeline: string | null
  scope: string | null
  style: string | null
}

const EMPTY_ANALYSIS: DescriptionAnalysis = {
  location: null,
  budget: null,
  timeline: null,
  scope: null,
  style: null,
}

export async function analyzeDescription(
  text: string,
  signal?: AbortSignal
): Promise<DescriptionAnalysis> {
  try {
    const raw = await callClaude(
      ANALYZE_DESCRIPTION_PROMPT,
      [{ role: 'user', content: text }],
      150,
      'claude-haiku-4-5-20251001',
      signal
    )

    const jsonStr = raw.replace(/^```json?\n?/, '').replace(/\n?```$/, '').trim()
    const parsed = JSON.parse(jsonStr)

    return {
      location: parsed.location ?? null,
      budget: parsed.budget ?? null,
      timeline: parsed.timeline ?? null,
      scope: parsed.scope ?? null,
      style: parsed.style ?? null,
    }
  } catch {
    // Silently return empty on any error (network, parse, abort)
    return EMPTY_ANALYSIS
  }
}

/**
 * Lightweight designer summary for the scoring prompt.
 * Built client-side from the full Designer objects.
 */
export interface DesignerSummary {
  id: string
  name: string
  specialty: string
  location: string
  hourlyRate: number
  availability: string
  yearsExperience: number
  tags: string[]
  shortBio: string
  approach: string
}

/**
 * LLM-based semantic scoring of all designers against the user's conversation.
 * Uses Haiku for speed/cost. Falls back to naive scoring on failure.
 */
export async function scoreDesigners(
  conversationHistory: ConversationMessage[],
  extractedNeeds: ExtractedNeeds,
  designerSummaries: DesignerSummary[]
): Promise<DesignerScore[]> {
  try {
    return await realScoreDesigners(conversationHistory, extractedNeeds, designerSummaries)
  } catch (e) {
    console.warn('LLM scoring failed, falling back to naive:', e)
    return mockScoreDesigners(extractedNeeds, designerSummaries)
  }
}

async function realScoreDesigners(
  conversationHistory: ConversationMessage[],
  extractedNeeds: ExtractedNeeds,
  designerSummaries: DesignerSummary[]
): Promise<DesignerScore[]> {
  // Build the user message: conversation context + designer list
  const conversationText = conversationHistory
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n')

  const needsSummary = Object.entries(extractedNeeds)
    .filter(([, v]) => v != null && (Array.isArray(v) ? v.length > 0 : true))
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
    .join('; ')

  const designerList = designerSummaries
    .map(
      (d) =>
        `ID: ${d.id} | ${d.name} | ${d.specialty} | ${d.location} | €${d.hourlyRate}/hr | ${d.availability} | ${d.yearsExperience}yr exp | Tags: ${d.tags.join(', ')}\nBio: ${d.shortBio}\nApproach: ${d.approach}`
    )
    .join('\n\n')

  const userMessage = `## User's conversation\n${conversationText}\n\n## Extracted needs\n${needsSummary || 'None extracted'}\n\n## Available designers\n${designerList}`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  try {
    const raw = await callClaude(
      SCORE_DESIGNERS_PROMPT,
      [{ role: 'user', content: userMessage }],
      4096,
      'claude-haiku-4-5-20251001',
      controller.signal
    )

    clearTimeout(timeout)

    const jsonStr = raw.replace(/^```json?\n?/, '').replace(/\n?```$/, '').trim()
    const parsed = JSON.parse(jsonStr)

    if (!Array.isArray(parsed)) throw new Error('Expected JSON array')

    return parsed.map((entry: { id?: string; score?: number; reason?: string }) => ({
      designerId: entry.id ?? '',
      score: typeof entry.score === 'number' ? Math.max(0, Math.min(100, entry.score)) : 50,
      reason: entry.reason ?? '',
    }))
  } catch (e) {
    clearTimeout(timeout)
    throw e
  }
}

/**
 * Naive fallback scoring — mirrors the old matchScore() logic from ResultsPage.
 * Used when LLM scoring is unavailable.
 */
function mockScoreDesigners(
  extractedNeeds: ExtractedNeeds,
  designerSummaries: DesignerSummary[]
): DesignerScore[] {
  return designerSummaries.map((d) => {
    let score = 40
    const reasons: string[] = []

    if (
      extractedNeeds.constraints?.length &&
      extractedNeeds.constraints.some((c) =>
        c.toLowerCase().includes(d.location.toLowerCase())
      )
    ) {
      score += 20
      reasons.push(`in ${d.location}`)
    }

    if (extractedNeeds.budget && d.hourlyRate <= extractedNeeds.budget) {
      score += 15
      reasons.push('within budget')
    }

    if (extractedNeeds.timeline && d.availability === extractedNeeds.timeline) {
      score += 10
      reasons.push('available when needed')
    }

    // Add some variation based on designer id hash so scores aren't identical
    const hash = d.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    score += (hash % 11) - 5
    score = Math.max(20, Math.min(95, score))

    return {
      designerId: d.id,
      score,
      reason: reasons.length > 0 ? reasons.join(', ') : 'General match',
    }
  })
}

// —— Real API implementation (via proxy) ——

async function callClaude(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
  maxTokens = 512,
  model?: string,
  signal?: AbortSignal
): Promise<string> {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system: systemPrompt,
      messages,
      max_tokens: maxTokens,
      ...(model && { model }),
    }),
    signal,
  })

  if (!response.ok) {
    const errorText = await response.text()
    try {
      const parsed = JSON.parse(errorText)
      const msg = parsed.error?.message || parsed.error || `API error (${response.status})`
      throw new Error(typeof msg === 'string' ? msg : `API error (${response.status})`)
    } catch (e) {
      if (e instanceof Error && !e.message.includes('API error')) throw e
      throw new Error(`API error (${response.status})`)
    }
  }

  const data = await response.json()
  const textBlock = data.content?.find((b: { type: string }) => b.type === 'text')
  if (!textBlock?.text) throw new Error('No text in response')

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

// —— Mock implementation (fallback) ——

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
