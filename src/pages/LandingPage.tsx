import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useConversation } from '@/context/ConversationContext'
import { designers } from '@/data/designers'
import { DesignerCard } from '@/components/DesignerCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { analyzeDescription } from '@/services/llmService'
import type { DescriptionAnalysis } from '@/services/llmService'

const MIN_LENGTH = 20

const QUICK_EXAMPLES = [
  {
    label: 'Stěhování s partnerem',
    text: 'S partnerem se příští měsíc stěhujeme do dvoupokojového bytu v Praze. Každý máme svůj nábytek a jiný vkus, a potřebujeme pomoct to nějak sladit dohromady v rozpočtu do €80/hod.',
  },
  {
    label: 'Refresh sdíleného bytu',
    text: 'Jsme tři studenti v Brně a sdílíme byt, kde společné prostory vypadají chaoticky a stísněně. Chceme, aby obývák a kuchyň fungovaly líp pro všechny, aniž bychom utratili moc peněz.',
  },
  {
    label: 'Malá rekonstrukce kuchyně',
    text: 'Plánujeme malou rekonstrukci kuchyně v bytě v Ostravě. Současná dispozice plýtvá prostorem a potřebujeme poradit, jak co nejlépe využít přibližně 8 metrů čtverečních s omezeným rozpočtem.',
  },
]

const WORKFLOW_STEPS = [
  { title: 'Popiš', description: 'svou situaci' },
  { title: 'Doplň', description: 'pár detailů' },
  { title: 'Najdi', description: 'správného designéra' },
  { title: 'Rezervuj', description: 'si konzultaci' },
]

const CHECKLIST_ITEMS: {
  key: keyof DescriptionAnalysis
  label: string
  hint: string
}[] = [
  { key: 'location', label: 'Lokalita', hint: 'které město?' },
  { key: 'budget', label: 'Rozpočet', hint: 'přibližná představa?' },
  { key: 'timeline', label: 'Kdy', hint: 'kdy potřebuješ pomoct?' },
  { key: 'scope', label: 'Co potřebuješ', hint: 'dispozice? rekonstrukce?' },
  { key: 'style', label: 'Styl', hint: 'volitelné' },
]

function progressLabel(count: number, total: number): string {
  if (count === total) return 'vše vyplněno!'
  if (count <= 2) return 'dobrý začátek'
  return 'skoro hotovo'
}

const FEATURED_IDS = ['1', '3', '7', '13']
const featuredDesigners = designers.filter((d) => FEATURED_IDS.includes(d.id))

export function LandingPage() {
  const [situationText, setSituationText] = useState('')
  const [analysis, setAnalysis] = useState<DescriptionAnalysis | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const navigate = useNavigate()
  const { setInitialDescription } = useConversation()

  const isValid = situationText.trim().length >= MIN_LENGTH
  // Track the latest text for the interval to read
  const textRef = useRef(situationText)
  textRef.current = situationText
  // Track what text we last sent to avoid duplicate calls
  const lastSentRef = useRef('')

  // Periodic LLM analysis — fires every 500ms while text is long enough
  useEffect(() => {
    if (situationText.trim().length < MIN_LENGTH) {
      setAnalysis(null)
      lastSentRef.current = ''
      return
    }

    // Fire immediately on first valid text, then every 500ms
    const doAnalysis = async () => {
      const current = textRef.current.trim()
      if (current.length < MIN_LENGTH || current === lastSentRef.current) return

      lastSentRef.current = current
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      try {
        const result = await analyzeDescription(current, controller.signal)
        if (!controller.signal.aborted) {
          setAnalysis(result)
        }
      } catch {
        // Silently ignore — keep previous state
      }
    }

    doAnalysis() // fire immediately
    const interval = setInterval(doAnalysis, 500)

    return () => {
      clearInterval(interval)
      abortRef.current?.abort()
    }
  }, [situationText.trim().length >= MIN_LENGTH ? 'active' : 'inactive']) // only re-mount when crossing the threshold

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

  // Count how many fields the analysis detected
  const detectedCount = analysis
    ? CHECKLIST_ITEMS.filter((item) => analysis[item.key] !== null).length
    : 0
  const showChecklist = analysis !== null && detectedCount > 0
  const allComplete = detectedCount === CHECKLIST_ITEMS.length

  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="pt-24 pb-12 lg:pt-36 lg:pb-16">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.05] text-balance">
            Bydlo
          </h1>
          <p className="mt-5 text-xl lg:text-2xl max-w-2xl leading-relaxed text-gradient-fade">
            Pomáháme ti bydlet líp — pokoj po pokoji.
          </p>
        </div>
      </section>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 pb-32">

        {/* Two-column section */}
        <div className="grid gap-10 lg:grid-cols-12 items-start">

          {/* Left column: Input + Scenarios */}
          <div className="lg:col-span-8 space-y-5">

            <p className="text-base text-muted-foreground">
              Popiš svou bytovou situaci a my ti najdeme freelance
              designéra, který ti pomůže.
            </p>

            {/* Textarea with inline submit */}
            <div>
              <div className="relative">
                <Textarea
                  placeholder="Příští měsíc se stěhujeme do sdíleného bytu a žádný z našeho nábytku k sobě moc nepasuje. Obývák je dlouhý a úzký a nevíme, jak ho zařídit..."
                  value={situationText}
                  onChange={(e) => setSituationText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-[140px] lg:min-h-[180px] pr-14 resize-none text-base shadow-sm focus-visible:ring-ring"
                  maxLength={500}
                />
                <Button
                  size="icon"
                  className="absolute bottom-3 right-3 h-10 w-10 rounded-full"
                  disabled={!isValid}
                  onClick={handleSubmit}
                  aria-label="Pokračovat"
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                {situationText.length} / 500
                {situationText.length > 0 && situationText.length < MIN_LENGTH
                  ? ` · min. ${MIN_LENGTH} znaků`
                  : ''}
                {situationText.length >= MIN_LENGTH ? ' · můžeš pokračovat' : ''}
              </p>
            </div>

            {/* Quick scenarios */}
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-subtle">
                Typické situace
              </p>
              <div className="flex flex-wrap gap-2">
                {QUICK_EXAMPLES.map((ex) => (
                  <Button
                    key={ex.label}
                    variant="outline"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    onClick={() => setSituationText(ex.text)}
                  >
                    {ex.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: How it works / Your situation checklist */}
          <div className="lg:col-span-4 lg:pt-8">
            <Card className={`relative overflow-hidden transition-all duration-500 ${
              allComplete
                ? 'border-emerald-200 bg-emerald-50/30 shadow-sm shadow-emerald-100'
                : 'border-0 shadow-[0_1px_3px_0_rgb(0_0_0/0.03)] bg-card'
            }`}>
              <CardContent className="p-5">

                {/* "How it works" — fades out when checklist appears */}
                <div
                  className="transition-opacity duration-200"
                  style={{
                    opacity: showChecklist ? 0 : 1,
                    position: showChecklist ? 'absolute' : 'relative',
                    inset: showChecklist ? 0 : undefined,
                    padding: showChecklist ? '1.25rem' : undefined,
                    pointerEvents: showChecklist ? 'none' : undefined,
                  }}
                >
                  <p className="text-xs font-medium uppercase tracking-wider text-subtle mb-3">
                    Jak to funguje
                  </p>
                  <ol className="space-y-2.5">
                    {WORKFLOW_STEPS.map((step, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="flex items-center justify-center h-5 w-5 rounded-full border border-border text-[11px] font-semibold text-subtle shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">{step.title}</span>{' '}
                          {step.description}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* "Your situation" checklist — fades in */}
                <div
                  className="transition-opacity duration-200"
                  style={{
                    opacity: showChecklist ? 1 : 0,
                    position: showChecklist ? 'relative' : 'absolute',
                    inset: showChecklist ? undefined : 0,
                    padding: showChecklist ? undefined : '1.25rem',
                    pointerEvents: showChecklist ? undefined : 'none',
                  }}
                >
                  <p className={`text-xs font-medium uppercase tracking-wider mb-3 transition-colors duration-300 ${
                    allComplete ? 'text-emerald-500' : 'text-subtle'
                  }`}>
                    Tvoje situace
                  </p>
                  <ul className="space-y-3">
                    {CHECKLIST_ITEMS.map((item) => {
                      const value = analysis?.[item.key] ?? null
                      const detected = value !== null

                      return (
                        <li key={item.key} className="flex items-start gap-2.5">
                          <span
                            className={`flex items-center justify-center h-5 w-5 rounded-full shrink-0 mt-0.5 text-[11px] font-semibold ${
                              detected
                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                : 'border border-border text-subtle'
                            }`}
                          >
                            {detected ? '\u2713' : '\u25CB'}
                          </span>
                          <div className="min-w-0">
                            <p
                              className={`text-sm ${
                                detected
                                  ? 'font-medium text-foreground'
                                  : 'text-subtle'
                              }`}
                            >
                              {item.label}
                            </p>
                            <p className="text-xs text-subtle truncate">
                              {detected ? value : item.hint}
                            </p>
                          </div>
                        </li>
                      )
                    })}
                  </ul>

                  {/* Progress summary */}
                  <div className={`mt-4 pt-3 border-t transition-colors duration-300 ${
                    allComplete ? 'border-emerald-100' : 'border-border'
                  }`}>
                    {allComplete ? (
                      <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-1 duration-300">
                        <span className="flex items-center justify-center h-5 w-5 rounded-full bg-emerald-100 text-emerald-600 text-xs">
                          ✓
                        </span>
                        <p className="text-sm font-medium text-emerald-700">
                          Skvělý popis — máš vše vyplněno!
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-subtle">
                        {detectedCount} of {CHECKLIST_ITEMS.length} &mdash;{' '}
                        {progressLabel(detectedCount, CHECKLIST_ITEMS.length)}
                      </p>
                    )}
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>
        </div>

        {/* Featured consultants */}
        <section className="mt-28 lg:mt-36">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground text-balance">
              Naši konzultanti
            </h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/browse">Zobrazit vše &rarr;</Link>
            </Button>
          </div>
          <div className="grid gap-5 sm:grid-cols-1 lg:grid-cols-2">
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
