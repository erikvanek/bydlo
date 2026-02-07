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
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold">Tell us about your situation</h1>
            <p className="text-slate-600">
              Write 2–5 sentences. For example: moving in with a partner, sharing a student flat, or planning a small renovation.
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
