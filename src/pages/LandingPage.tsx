import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useConversation } from '@/context/ConversationContext'
import { designers } from '@/data/designers'
import { DesignerCard } from '@/components/DesignerCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

const MIN_LENGTH = 20

const QUICK_EXAMPLES = [
  {
    label: 'Moving in with partner',
    text: "My partner and I are moving into a 2-bedroom flat together next month. We each have our own furniture and different style preferences, and we need help figuring out how to merge everything into one cohesive home.",
  },
  {
    label: 'Shared flat refresh',
    text: "We're three students sharing a flat and the common areas feel chaotic and cramped. We want to make the living room and kitchen work better for everyone without spending too much money.",
  },
  {
    label: 'Small kitchen reno',
    text: "We're planning a small kitchen renovation in our flat. The current layout wastes space and we need advice on how to make the most of roughly 8 square meters on a tight budget.",
  },
]

const WORKFLOW_STEPS = [
  { title: 'Describe', description: 'your situation' },
  { title: 'Add', description: 'more details' },
  { title: 'Match', description: 'with a designer' },
  { title: 'Book', description: 'a consultation' },
]

const FEATURED_IDS = ['1', '3', '7', '13']
const featuredDesigners = designers.filter((d) => FEATURED_IDS.includes(d.id))

export function LandingPage() {
  const [situationText, setSituationText] = useState('')
  const navigate = useNavigate()
  const { setInitialDescription } = useConversation()

  const isValid = situationText.trim().length >= MIN_LENGTH

  const handleSubmit = () => {
    if (!isValid) return
    setInitialDescription(situationText.trim())
    navigate('/conversation')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && isValid) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero */}
      <section className="pt-20 pb-8 lg:pt-28 lg:pb-12">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Bydlo
          </h1>
          <p className="mt-4 text-xl lg:text-2xl text-slate-500 max-w-2xl leading-relaxed">
            Helping you live better — one room at a time.
          </p>
        </div>
      </section>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 pb-24">

        {/* Two-column section */}
        <div className="grid gap-10 lg:grid-cols-12 items-start">

          {/* Left column: Input + Scenarios */}
          <div className="lg:col-span-8 space-y-5">

            <p className="text-base text-slate-600">
              Describe your living situation and we'll match you with a freelance
              designer who can help.
            </p>

            {/* Textarea with inline submit */}
            <div>
              <div className="relative">
                <Textarea
                  placeholder="We're moving into a shared flat next month and none of our furniture really goes together. The living room is long and narrow and we're not sure how to set it up..."
                  value={situationText}
                  onChange={(e) => setSituationText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-[140px] lg:min-h-[180px] pr-14 resize-none text-base shadow-sm border-slate-200 focus-visible:ring-slate-400"
                  maxLength={500}
                />
                <Button
                  size="icon"
                  className="absolute bottom-3 right-3 h-10 w-10 rounded-full"
                  disabled={!isValid}
                  onClick={handleSubmit}
                  aria-label="Continue to conversation"
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                {situationText.length} / 500
                {situationText.length > 0 && situationText.length < MIN_LENGTH
                  ? ` · min ${MIN_LENGTH} characters`
                  : ''}
                {situationText.length >= MIN_LENGTH ? ' · ready to go' : ''}
              </p>
            </div>

            {/* Quick scenarios */}
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Typical scenarios
              </p>
              <div className="flex flex-wrap gap-2">
                {QUICK_EXAMPLES.map((ex) => (
                  <Button
                    key={ex.label}
                    variant="outline"
                    size="sm"
                    className="text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    onClick={() => setSituationText(ex.text)}
                  >
                    {ex.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: How it works — compact, muted */}
          <div className="lg:col-span-4 lg:pt-8">
            <Card className="border-slate-100 shadow-none bg-slate-50/50">
              <CardContent className="p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-3">
                  How it works
                </p>
                <ol className="space-y-2.5">
                  {WORKFLOW_STEPS.map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="flex items-center justify-center h-5 w-5 rounded-full border border-slate-300 text-[11px] font-semibold text-slate-400 shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-sm text-slate-500">
                        <span className="font-medium text-slate-700">{step.title}</span>{' '}
                        {step.description}
                      </p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Featured consultants */}
        <section className="mt-24">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
              Meet our consultants
            </h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/browse">See all &rarr;</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredDesigners.map((designer) => (
              <DesignerCard
                key={designer.id}
                designer={designer}
                onViewProfile={() => navigate(`/designer/${designer.id}`)}
              />
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}
