import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConversation } from '@/context/ConversationContext'
import { ConversationThread } from '@/components/ConversationThread'
import { generateFollowUp, extractNeeds } from '@/services/llmService'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function ConversationPage() {
  const navigate = useNavigate()
  const { state, addMessage, setComplete } = useConversation()
  const [isWaitingForLLM, setIsWaitingForLLM] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!state?.initialDescription) {
      navigate('/', { replace: true })
      return
    }

    const run = async () => {
      const history = state.messages
      const isFirstQuestion = history.length === 0

      if (isFirstQuestion) {
        setIsWaitingForLLM(true)
        setError(null)
        try {
          const response = await generateFollowUp({
            conversationHistory: [
              { id: '0', role: 'user', content: state.initialDescription, timestamp: new Date() },
            ],
            systemPrompt: '',
          })
          addMessage({ role: 'assistant', content: response.message })
          if (!response.shouldContinue) {
            const needs = await extractNeeds([
              ...state.messages,
              { id: '0', role: 'user', content: state.initialDescription, timestamp: new Date() },
              { id: '1', role: 'assistant', content: response.message, timestamp: new Date() },
            ])
            setComplete({ ...state.extractedNeeds, ...needs })
          }
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Something went wrong')
        } finally {
          setIsWaitingForLLM(false)
        }
      }
    }

    run()
  }, [state?.initialDescription])

  const handleUserResponse = async (response: string) => {
    if (!state) return
    addMessage({ role: 'user', content: response })
    setIsWaitingForLLM(true)
    setError(null)
    const newUserMessage = { id: 'u', role: 'user' as const, content: response, timestamp: new Date() }
    const newHistory = [...state.messages, newUserMessage]
    try {
      const llmResponse = await generateFollowUp({
        conversationHistory: newHistory,
        systemPrompt: '',
      })
      addMessage({ role: 'assistant', content: llmResponse.message })
      if (!llmResponse.shouldContinue) {
        const fullHistory = [
          ...newHistory,
          { id: 'a', role: 'assistant' as const, content: llmResponse.message, timestamp: new Date() },
        ]
        const needs = await extractNeeds(fullHistory)
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
    const needs = await extractNeeds(state.messages)
    setComplete(needs)
    navigate('/results')
  }

  if (!state) return null

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <Card className="flex flex-col h-[calc(100vh-6rem)]">
          <CardHeader className="shrink-0">
            <h1 className="text-xl font-bold">A few questions</h1>
            <p className="text-sm text-slate-600">Your situation: {state.initialDescription.slice(0, 80)}…</p>
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
