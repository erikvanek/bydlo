import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { ConversationState, ConversationMessage, ExtractedNeeds } from '@/types'

interface ConversationContextValue {
  state: ConversationState | null
  setInitialDescription: (description: string) => void
  addMessage: (message: Omit<ConversationMessage, 'id' | 'timestamp'>) => void
  setComplete: (extractedNeeds: ExtractedNeeds) => void
  reset: () => void
}

const ConversationContext = createContext<ConversationContextValue | null>(null)

export function ConversationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConversationState | null>(null)

  const setInitialDescription = useCallback((initialDescription: string) => {
    setState({
      initialDescription,
      messages: [],
      extractedNeeds: {},
      isComplete: false,
    })
  }, [])

  const addMessage = useCallback((message: Omit<ConversationMessage, 'id' | 'timestamp'>) => {
    const fullMessage: ConversationMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    }
    setState((prev) =>
      prev
        ? {
            ...prev,
            messages: [...prev.messages, fullMessage],
          }
        : null
    )
  }, [])

  const setComplete = useCallback((extractedNeeds: ExtractedNeeds) => {
    setState((prev) =>
      prev ? { ...prev, extractedNeeds, isComplete: true } : null
    )
  }, [])

  const reset = useCallback(() => {
    setState(null)
  }, [])

  return (
    <ConversationContext.Provider
      value={{
        state,
        setInitialDescription,
        addMessage,
        setComplete,
        reset,
      }}
    >
      {children}
    </ConversationContext.Provider>
  )
}

export function useConversation() {
  const ctx = useContext(ConversationContext)
  if (!ctx) throw new Error('useConversation must be used within ConversationProvider')
  return ctx
}
