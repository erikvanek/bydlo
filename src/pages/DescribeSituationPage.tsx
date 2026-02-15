import { useNavigate } from 'react-router-dom'
import { useConversation } from '@/context/ConversationContext'
import { SituationInput } from '@/components/SituationInput'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function DescribeSituationPage() {
  const navigate = useNavigate()
  const { setInitialDescription } = useConversation()

  const handleSubmit = (description: string) => {
    setInitialDescription(description)
    navigate('/conversation')
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold">Popište svou situaci</h1>
            <p className="text-muted-foreground">
              Napište 2–5 vět. Například: stěhování s partnerem, sdílený studentský byt, nebo plánování malé rekonstrukce.
            </p>
          </CardHeader>
          <CardContent>
            <SituationInput onSubmit={handleSubmit} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
