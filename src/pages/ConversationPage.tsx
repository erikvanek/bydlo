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

/** Wait at least `ms` milliseconds (used for acknowledgement pause). */
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function ConversationPage() {
  const navigate = useNavigate()
  const { state, addMessage, setComplete } = useConversation()
  const [isWaitingForLLM, setIsWaitingForLLM] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hasFiredRef = useRef(false)

  /**
   * Handle conversation completion:
   * 1. Wrap-up message already shown by caller
   * 2. Show a brief "finding matches" overlay
   * 3. Extract needs in parallel with a minimum pause
   * 4. Navigate to results
   */
  const handleCompletion = async (fullHistory: ConversationMessage[]) => {
    setIsWaitingForLLM(false)
    setIsRedirecting(true)

    try {
      const [needs] = await Promise.all([
        extractNeeds(fullHistory),
        delay(1200),
      ])
      setComplete(needs)
      navigate('/results')
    } catch (e) {
      setIsRedirecting(false)
      setError(e instanceof Error ? e.message : 'Something went wrong')
    }
  }

  // Send first LLM question on mount (once only)
  useEffect(() => {
    if (!state?.initialDescription) {
      navigate('/', { replace: true })
      return
    }

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
          await handleCompletion(fullHistory)
        } else {
          setIsWaitingForLLM(false)
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Something went wrong')
        hasFiredRef.current = false
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
        await handleCompletion(completeHistory)
      } else {
        setIsWaitingForLLM(false)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setIsWaitingForLLM(false)
    }
  }

  const handleSeeMatches = async () => {
    if (!state) return
    setIsRedirecting(true)
    try {
      const fullHistory = buildFullHistory(state.initialDescription, state.messages)
      const [needs] = await Promise.all([
        extractNeeds(fullHistory),
        delay(800),
      ])
      setComplete(needs)
      navigate('/results')
    } catch (e) {
      setIsRedirecting(false)
      setError(e instanceof Error ? e.message : 'Something went wrong')
    }
  }

  if (!state) return null

  // Full-page transition overlay
  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 animate-in fade-in duration-300">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mx-auto">
            <svg className="h-6 w-6 text-primary animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-foreground">Finding your matches</p>
          <p className="text-sm text-muted-foreground">Just a moment…</p>
        </div>
      </div>
    )
  }

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
