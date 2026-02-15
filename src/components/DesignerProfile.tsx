import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import type { Designer } from '@/types'

const specialtyLabel: Record<Designer['specialty'], string> = {
  interior: 'Interiérový design',
  architect: 'Architektura',
  both: 'Interiér a architektura',
}

const availabilityLabel: Record<Designer['availability'], string> = {
  immediate: 'K dispozici ihned',
  'within-week': 'K dispozici tento týden',
  'within-month': 'K dispozici tento měsíc',
}

interface DesignerProfileProps {
  designer: Designer
  onBack: () => void
}

export function DesignerProfile({ designer, onBack }: DesignerProfileProps) {
  const [showBookingDialog, setShowBookingDialog] = useState(false)
  const [bookingStep, setBookingStep] = useState<'form' | 'confirmed'>('form')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleBook = () => {
    setBookingStep('form')
    setName('')
    setEmail('')
    setShowBookingDialog(true)
  }

  const handleConfirm = () => {
    setBookingStep('confirmed')
  }

  const handleClose = () => {
    setShowBookingDialog(false)
  }

  const isFormValid = name.trim().length > 0 && email.trim().includes('@')

  return (
    <>
      <div className="space-y-8">
        {/* Back button */}
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Zpět na výsledky
        </button>

        {/* Hero: avatar + key info + CTA */}
        <div className="flex flex-col sm:flex-row gap-6">
          <Avatar className="h-28 w-28 shrink-0 ring-2 ring-border">
            <AvatarImage src={designer.photo} alt={designer.name} />
            <AvatarFallback className="text-3xl font-semibold">
              {designer.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                {designer.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <Badge>{specialtyLabel[designer.specialty]}</Badge>
                <span className="text-sm text-muted-foreground">
                  {designer.location}
                </span>
                <span className="text-subtle">&middot;</span>
                <span className="text-sm text-muted-foreground">
                  {designer.yearsExperience} let praxe
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center justify-center h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-muted-foreground">
                  {availabilityLabel[designer.availability]}
                </span>
              </div>
              <span className="font-semibold text-foreground">
                &euro;{designer.hourlyRate}/hod
              </span>
            </div>

            {/* Primary CTA — desktop */}
            <div className="hidden sm:block pt-1">
              <Button size="lg" onClick={handleBook} className="text-base px-8">
                Rezervovat úvodní hovor
              </Button>
            </div>
          </div>
        </div>

        {/* Primary CTA — mobile (full width) */}
        <div className="sm:hidden">
          <Button size="lg" onClick={handleBook} className="w-full text-base">
            Rezervovat úvodní hovor
          </Button>
        </div>

        <Separator />

        {/* About */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">O mně</h2>
          <p className="text-foreground leading-relaxed">{designer.shortBio}</p>
        </section>

        {/* Approach */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">Jak pracuji</h2>
          <p className="text-muted-foreground leading-relaxed">{designer.approach}</p>
        </section>

        <Separator />

        {/* Portfolio */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Portfolio</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {designer.portfolioImages.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${designer.name} portfolio ${i + 1}`}
                className="rounded-lg object-cover w-full aspect-[4/3] hover:opacity-90 transition-opacity"
              />
            ))}
          </div>
        </section>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {designer.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-sm">
              {tag}
            </Badge>
          ))}
        </div>

        <Separator />

        {/* Bottom CTA */}
        <section className="text-center py-4 space-y-3">
          <p className="text-muted-foreground">
            Chceš začít spolupráci s {designer.name.split(' ')[0]}?
          </p>
          <Button size="lg" onClick={handleBook} className="text-base px-8">
            Rezervovat bezplatný úvodní hovor
          </Button>
          <p className="text-xs text-subtle">
            15 minut &middot; nezávazně &middot; zdarma
          </p>
        </section>
      </div>

      {/* Booking dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="sm:max-w-md">
          {bookingStep === 'form' ? (
            <>
              <DialogHeader>
                <DialogTitle>Rezervace úvodního hovoru</DialogTitle>
                <DialogDescription>
                  Bezplatný 15minutový hovor s {designer.name.split(' ')[0]}, kde
                  proberete vaši situaci a zjistíte, jestli si sednete.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <label
                    htmlFor="booking-name"
                    className="text-sm font-medium text-foreground"
                  >
                    Vaše jméno
                  </label>
                  <Input
                    id="booking-name"
                    placeholder="např. Jan Novák"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="booking-email"
                    className="text-sm font-medium text-foreground"
                  >
                    E-mail
                  </label>
                  <Input
                    id="booking-email"
                    type="email"
                    placeholder="jan@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={handleClose}
                >
                  Zrušit
                </Button>
                <Button
                  disabled={!isFormValid}
                  onClick={handleConfirm}
                >
                  Potvrdit rezervaci
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Máte zarezervováno!</DialogTitle>
                <DialogDescription>
                  Toto je prototyp — v reálné platformě by{' '}
                  {designer.name.split(' ')[0]} dostal/a vaši žádost a
                  vy byste obdrželi pozvánku do kalendáře. Díky za testování!
                </DialogDescription>
              </DialogHeader>

              <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground space-y-1">
                <p>
                  <span className="font-medium text-foreground">Hovor s:</span>{' '}
                  {designer.name}
                </p>
                <p>
                  <span className="font-medium text-foreground">Délka:</span>{' '}
                  15 minut
                </p>
                <p>
                  <span className="font-medium text-foreground">Cena:</span>{' '}
                  Zdarma
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    Potvrzení odesláno na:
                  </span>{' '}
                  {email}
                </p>
              </div>

              <DialogFooter>
                <Button onClick={handleClose}>Hotovo</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
