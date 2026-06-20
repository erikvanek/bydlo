import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type Mode = 'rent' | 'purchase'

interface Tier {
  id: string
  label: string
  sublabel: string
  rentPct: number
  purchasePct: number
}

const TIERS: Tier[] = [
  {
    id: 'exceptional',
    label: 'Výsledek předčil očekávání',
    sublabel: 'Architekt přinesl víc, než jsi doufal/a',
    rentPct: 0.02,
    purchasePct: 0.01,
  },
  {
    id: 'satisfied',
    label: 'Spokojeni s výsledkem',
    sublabel: 'Pomohlo to přesně tak, jak jsi čekal/a',
    rentPct: 0.01,
    purchasePct: 0.005,
  },
  {
    id: 'helped',
    label: 'Pomohlo to trochu',
    sublabel: 'Přínos byl, ale bez velkého wow momentu',
    rentPct: 0.005,
    purchasePct: 0.0025,
  },
  {
    id: 'missed',
    label: 'Nedoručili jsme',
    sublabel: 'Neplatíš nic — žádáme jen 45minutový hovor',
    rentPct: 0,
    purchasePct: 0,
  },
]

function formatCZK(n: number): string {
  return `${Math.round(n).toLocaleString('cs-CZ')} Kč`
}

function pctString(pct: number): string {
  const v = pct * 100
  return v % 1 === 0 ? `${v}` : `${v}`
}

export function PricingPage() {
  const [mode, setMode] = useState<Mode>('rent')
  const [monthlyRent, setMonthlyRent] = useState('')
  const [purchasePrice, setPurchasePrice] = useState('')

  const rentRaw = parseFloat(monthlyRent) || 0
  const yearlyRent = rentRaw * 12
  const purchase = parseFloat(purchasePrice) || 0
  const base = mode === 'rent' ? yearlyRent : purchase
  const hasAmount = base > 0

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 pt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-subtle hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Zpět
        </Link>
      </div>

      <main className="max-w-2xl mx-auto px-4 pb-32">

        {/* Hero */}
        <section className="pt-10 pb-12 lg:pt-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">
            Jak funguje cenotvorba
          </p>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-[1.1] text-balance">
            Platíte až po výsledku
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground max-w-prose">
            Výběr bytu nebo domu je rozhodnutí na roky dopředu. Špatná dispozice, přehlédnutá vada,
            kuchyň o dva metry menší — taková věc tě může pronásledovat dekádu.
            Proto věříme, že odměna architekta by měla odpovídat hodnotě, kterou skutečně přinesl.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground max-w-prose">
            Výše poplatku závisí na dvou věcech:{' '}
            <span className="font-semibold text-foreground">jak moc jsi spokojen/á</span> a na{' '}
            <span className="font-semibold text-foreground">hodnotě nemovitosti</span>, o které se rozhodovalo.
          </p>
        </section>

        {/* Calculator */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-foreground mb-5">Spočítej si to</h2>

          {/* Mode toggle */}
          <div className="flex gap-2 mb-6 p-1 bg-muted rounded-full w-fit">
            {(['rent', 'purchase'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  mode === m
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {m === 'rent' ? 'Pronájem' : 'Koupě'}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {mode === 'rent' ? 'Měsíční nájem' : 'Cena nemovitosti'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={mode === 'rent' ? monthlyRent : purchasePrice}
                onChange={(e) =>
                  mode === 'rent'
                    ? setMonthlyRent(e.target.value)
                    : setPurchasePrice(e.target.value)
                }
                placeholder={mode === 'rent' ? 'např. 18 000' : 'např. 4 500 000'}
                className="w-48 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <span className="text-sm text-subtle">Kč{mode === 'rent' ? '/měs' : ''}</span>
            </div>
            {mode === 'rent' && yearlyRent > 0 && (
              <p className="mt-1.5 text-xs text-subtle">
                Roční nájem: {formatCZK(yearlyRent)}
              </p>
            )}
          </div>

          {/* Tiers */}
          <div className="grid gap-3">
            {TIERS.map((tier, i) => {
              const amount = base * (mode === 'rent' ? tier.rentPct : tier.purchasePct)
              const pct = mode === 'rent' ? tier.rentPct : tier.purchasePct
              const isMissed = tier.id === 'missed'
              const isTop = i === 0

              return (
                <Card
                  key={tier.id}
                  className={`border ${
                    isMissed
                      ? 'bg-muted/30 border-border'
                      : isTop
                      ? 'bg-[hsl(13_52%_53%/0.07)] border-[hsl(13_52%_53%/0.3)]'
                      : 'bg-card border-border'
                  }`}
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    {/* Rank dot */}
                    <div
                      className={`shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isMissed
                          ? 'bg-muted text-subtle'
                          : isTop
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-foreground'
                      }`}
                    >
                      {isMissed ? '–' : i + 1}
                    </div>

                    {/* Label */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${isMissed ? 'text-subtle' : 'text-foreground'}`}>
                        {tier.label}
                      </p>
                      <p className="text-xs text-subtle mt-0.5 leading-snug">{tier.sublabel}</p>
                    </div>

                    {/* Price */}
                    <div className="shrink-0 text-right">
                      {isMissed ? (
                        <p className="text-sm font-bold text-subtle">0 Kč</p>
                      ) : hasAmount ? (
                        <p className={`text-lg font-bold ${isTop ? 'text-primary' : 'text-foreground'}`}>
                          {formatCZK(amount)}
                        </p>
                      ) : (
                        <p className="text-sm font-medium text-subtle">
                          {pctString(pct)} %
                        </p>
                      )}
                      {!isMissed && !hasAmount && (
                        <p className="text-xs text-subtle mt-0.5">
                          {mode === 'rent' ? 'ročního nájmu' : 'z ceny'}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {!hasAmount && (
            <p className="mt-3 text-xs text-subtle">
              Zadej {mode === 'rent' ? 'měsíční nájem' : 'cenu nemovitosti'} výše a uvidíš konkrétní částky.
            </p>
          )}
        </section>

        {/* If it doesn't work */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-foreground mb-4">Co když to nevyjde?</h2>
          <div className="rounded-xl border border-border bg-muted/30 p-6 space-y-3">
            <p className="text-base text-muted-foreground leading-relaxed">
              Pokud architekt nepřinesl to, co jsme slíbili, <span className="font-semibold text-foreground">neplatíš nic</span>.
              Prosíme tě jen o jedno: 45minutový hovor, kde si projdeme, co se nepovedlo — ať je to
              na naší straně, nebo na straně architekta.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              Stejný rozhovor uděláme v případě pochybností i s architektem samotným — záleží nám na
              tom, kdo u nás působí. Pokud jsme na vině my, nabídneme ti{' '}
              <span className="font-semibold text-foreground">jedno další propojení zdarma</span>.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              Ke každému propojení přistupujeme s tím, že jde o dobrý match — proto se snažíme
              propojovat jen tehdy, když věříme, že to dává smysl. Kvalita nad kvantitou.
            </p>
          </div>
        </section>

        {/* Social mission */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-foreground mb-4">Přístup pro každého</h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Věříme, že kvalitní pomoc s bydlením by neměla být jen pro ty, kdo si ji snadno mohou
            dovolit. Proto věnujeme{' '}
            <span className="font-semibold text-foreground">20 % svých příjmů</span>{' '}
            na podporu lidí, pro které je taková služba těžko dostupná.
            Posuzujeme individuálně — pokud si myslíš, že bys mohl/a být jedním z nich,
            dej nám vědět.
          </p>
        </section>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg">
            <Link to="/">
              Začít hledat <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/browse">Prohlédnout architekty</Link>
          </Button>
        </div>

      </main>
    </div>
  )
}
