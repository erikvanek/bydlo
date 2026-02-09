import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConversation } from '@/context/ConversationContext'
import { ConversationThread } from '@/components/ConversationThread'
import { generateFollowUp, extractNeeds } from '@/services/llmService'
import { SYSTEM_PROMPT } from '@/services/systemPrompt'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { ConversationMessage } from '@/types'

/** Build the full message history including the initial description as the first user message. */
function buildFullHistory(
  initialDescription: string,
  messages: ConversationMessage[]
): ConversationMessage[] {
  return [
    { id: 'initial', role: 'user', content: initialDescription, timestamp: new Date() },
    ...messages,
  ]
}

export function ConversationPage() {
  const navigate = useNavigate()
  const { state, addMessage, setComplete } = useConversation()
  const [isWaitingForLLM, setIsWaitingForLLM] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hasFiredRef = useRef(false)

  // Send first LLM question on mount (once only)
  useEffect(() => {
    if (!state?.initialDescription) {
      navigate('/', { replace: true })
      return
    }

    // Guard against StrictMode double-fire and re-renders
    if (state.messages.length > 0 || hasFiredRef.current) return
    hasFiredRef.current = true

    const run = async () => {
      setIsWaitingForLLM(true)
      setError(null)
      try {
        const history = buildFullHistory(state.initialDescription, [])
        const response = await generateFollowUp({
          conversationHistory: history,
          systemPrompt: SYSTEM_PROMPT,
        })
        addMessage({ role: 'assistant', content: response.message })
        if (!response.shouldContinue) {
          const fullHistory = [
            ...history,
            { id: 'a0', role: 'assistant' as const, content: response.message, timestamp: new Date() },
          ]
          const needs = await extractNeeds(fullHistory)
          setComplete(needs)
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Something went wrong')
        hasFiredRef.current = false // Allow retry
      } finally {
        setIsWaitingForLLM(false)
      }
    }

    run()
  }, [state?.initialDescription])

  const handleUserResponse = async (response: string) => {
    if (!state) return
    addMessage({ role: 'user', content: response })
    setIsWaitingForLLM(true)
    setError(null)

    // Build full history: initial description + all previous messages + this new user message
    const newUserMessage: ConversationMessage = {
      id: 'u',
      role: 'user',
      content: response,
      timestamp: new Date(),
    }
    const fullHistory = buildFullHistory(state.initialDescription, [
      ...state.messages,
      newUserMessage,
    ])

    try {
      const llmResponse = await generateFollowUp({
        conversationHistory: fullHistory,
        systemPrompt: SYSTEM_PROMPT,
      })
      addMessage({ role: 'assistant', content: llmResponse.message })

      if (!llmResponse.shouldContinue) {
        const completeHistory = [
          ...fullHistory,
          { id: 'a', role: 'assistant' as const, content: llmResponse.message, timestamp: new Date() },
        ]
        const needs = await extractNeeds(completeHistory)
        setComplete(needs)
        navigate('/results')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setIsWaitingForLLM(false)
    }
  }

  const handleSeeMatches = async () => {
    if (!state) return
    const fullHistory = buildFullHistory(state.initialDescription, state.messages)
    const needs = await extractNeeds(fullHistory)
    setComplete(needs)
    navigate('/results')
  }

  if (!state) return null

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <Card className="flex flex-col h-[calc(100vh-6rem)]">
          <CardHeader className="shrink-0">
            <h1 className="text-xl font-bold">A few questions</h1>
            <p className="text-sm text-muted-foreground">
              Your situation: {state.initialDescription}
            </p>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0 p-0">
            {error && (
              <div className="mx-4 mb-2 p-3 rounded-lg bg-red-50 text-red-800 text-sm">
                {error}
                <button
                  type="button"
                  className="ml-2 underline"
                  onClick={() => setError(null)}
                >
                  Dismiss
                </button>
              </div>
            )}
            <ConversationThread
              messages={state.messages}
              onUserResponse={handleUserResponse}
              isWaitingForLLM={isWaitingForLLM}
              isComplete={state.isComplete}
              onSeeMatches={handleSeeMatches}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
