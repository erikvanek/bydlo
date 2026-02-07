import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { ConversationMessage as MessageType } from '@/types'

interface ConversationMessageProps {
  message: MessageType
  isLatest?: boolean
}

export function ConversationMessage({ message, isLatest = false }: ConversationMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="text-xs">{isUser ? 'You' : 'AI'}</AvatarFallback>
      </Avatar>
      <Card className={isUser ? 'bg-primary text-primary-foreground border-primary max-w-[85%]' : 'max-w-[85%]'}>
        <CardContent className="p-4">
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </CardContent>
      </Card>
    </div>
  )
}
