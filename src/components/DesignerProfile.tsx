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
  interior: 'Interior Design',
  architect: 'Architecture',
  both: 'Interior & Architecture',
}

const availabilityLabel: Record<Designer['availability'], string> = {
  immediate: 'Available now',
  'within-week': 'Available this week',
  'within-month': 'Available this month',
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
          className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          &larr; Back to results
        </button>

        {/* Hero: avatar + key info + CTA */}
        <div className="flex flex-col sm:flex-row gap-6">
          <Avatar className="h-28 w-28 shrink-0 ring-2 ring-slate-100">
            <AvatarImage src={designer.photo} alt={designer.name} />
            <AvatarFallback className="text-3xl font-semibold">
              {designer.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                {designer.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <Badge>{specialtyLabel[designer.specialty]}</Badge>
                <span className="text-sm text-slate-500">
                  {designer.location}
                </span>
                <span className="text-slate-300">&middot;</span>
                <span className="text-sm text-slate-500">
                  {designer.yearsExperience} years experience
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center justify-center h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-slate-600">
                  {availabilityLabel[designer.availability]}
                </span>
              </div>
              <span className="font-semibold text-slate-900">
                &euro;{designer.hourlyRate}/hr
              </span>
            </div>

            {/* Primary CTA — desktop */}
            <div className="hidden sm:block pt-1">
              <Button size="lg" onClick={handleBook} className="text-base px-8">
                Book intro call
              </Button>
            </div>
          </div>
        </div>

        {/* Primary CTA — mobile (full width) */}
        <div className="sm:hidden">
          <Button size="lg" onClick={handleBook} className="w-full text-base">
            Book intro call
          </Button>
        </div>

        <Separator />

        {/* About */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">About</h2>
          <p className="text-slate-700 leading-relaxed">{designer.shortBio}</p>
        </section>

        {/* Approach */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">How I work</h2>
          <p className="text-slate-600 leading-relaxed">{designer.approach}</p>
        </section>

        <Separator />

        {/* Portfolio */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Portfolio</h2>
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
          <p className="text-slate-600">
            Ready to get started with {designer.name.split(' ')[0]}?
          </p>
          <Button size="lg" onClick={handleBook} className="text-base px-8">
            Book a free intro call
          </Button>
          <p className="text-xs text-slate-400">
            15 minutes &middot; no commitment &middot; free
          </p>
        </section>
      </div>

      {/* Booking dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="sm:max-w-md">
          {bookingStep === 'form' ? (
            <>
              <DialogHeader>
                <DialogTitle>Book an intro call</DialogTitle>
                <DialogDescription>
                  A free 15-minute call with {designer.name.split(' ')[0]} to
                  discuss your situation and see if it's a good fit.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <label
                    htmlFor="booking-name"
                    className="text-sm font-medium text-slate-700"
                  >
                    Your name
                  </label>
                  <Input
                    id="booking-name"
                    placeholder="e.g. Jan Novak"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="booking-email"
                    className="text-sm font-medium text-slate-700"
                  >
                    Email
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
                  Cancel
                </Button>
                <Button
                  disabled={!isFormValid}
                  onClick={handleConfirm}
                >
                  Confirm booking
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>You're all set!</DialogTitle>
                <DialogDescription>
                  This is a prototype — in the real platform,{' '}
                  {designer.name.split(' ')[0]} would receive your request and
                  you'd get a calendar invite. Thanks for testing!
                </DialogDescription>
              </DialogHeader>

              <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600 space-y-1">
                <p>
                  <span className="font-medium text-slate-900">Call with:</span>{' '}
                  {designer.name}
                </p>
                <p>
                  <span className="font-medium text-slate-900">Duration:</span>{' '}
                  15 minutes
                </p>
                <p>
                  <span className="font-medium text-slate-900">Cost:</span>{' '}
                  Free
                </p>
                <p>
                  <span className="font-medium text-slate-900">
                    Confirmation sent to:
                  </span>{' '}
                  {email}
                </p>
              </div>

              <DialogFooter>
                <Button onClick={handleClose}>Done</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
