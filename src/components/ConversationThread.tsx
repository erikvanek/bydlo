import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { ConversationMessage } from '@/components/ConversationMessage'
import type { ConversationMessage as MessageType } from '@/types'

interface ConversationThreadProps {
  messages: MessageType[]
  onUserResponse: (response: string) => void
  isWaitingForLLM: boolean
  isComplete: boolean
  onSeeMatches: () => void
}

export function ConversationThread({
  messages,
  onUserResponse,
  isWaitingForLLM,
  isComplete,
  onSeeMatches,
}: ConversationThreadProps) {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isWaitingForLLM])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || isWaitingForLLM || isComplete) return
    onUserResponse(text)
    setInput('')
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((msg) => (
          <ConversationMessage key={msg.id} message={msg} />
        ))}
        {isWaitingForLLM && (
          <div className="flex gap-3">
            <div className="h-8 w-8 shrink-0 rounded-full bg-slate-200 flex items-center justify-center text-xs">AI</div>
            <div className="rounded-lg border bg-slate-50 px-4 py-3 text-sm text-slate-500">
              Thinking…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <Separator />
      <div className="p-4">
        {isComplete ? (
          <Button onClick={onSeeMatches} className="w-full">See matches</Button>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your answer…"
              disabled={isWaitingForLLM}
              className="flex-1"
            />
            <Button type="submit" disabled={!input.trim() || isWaitingForLLM}>
              Send
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
