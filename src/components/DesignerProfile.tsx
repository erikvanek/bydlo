import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import type { Designer } from '@/types'

const specialtyLabel: Record<Designer['specialty'], string> = {
  interior: 'Interior Design',
  architect: 'Architecture',
  both: 'Interior & Architecture',
}

interface DesignerProfileProps {
  designer: Designer
  onBookConsultation: () => void
  onBack: () => void
}

export function DesignerProfile({ designer, onBookConsultation, onBack }: DesignerProfileProps) {
  const [showBookingDialog, setShowBookingDialog] = useState(false)

  const handleBook = () => {
    setShowBookingDialog(true)
  }

  const handleCloseDialog = () => {
    setShowBookingDialog(false)
  }

  return (
    <>
      <div className="space-y-6">
        <Button variant="ghost" onClick={onBack} className="-ml-2">
          ← Back
        </Button>
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={designer.photo} alt={designer.name} />
                <AvatarFallback className="text-2xl">{designer.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{designer.name}</h1>
                <Badge className="mt-1">{specialtyLabel[designer.specialty]}</Badge>
                <p className="text-slate-600 mt-2">
                  €{designer.hourlyRate}/hr · {designer.location} · {designer.availability.replace(/-/g, ' ')} · {designer.yearsExperience} years experience
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>{designer.shortBio}</p>
            <p className="text-slate-600">{designer.approach}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {designer.portfolioImages.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Portfolio ${i + 1}`}
                  className="rounded-lg object-cover w-full aspect-[4/3]"
                />
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="flex flex-wrap gap-2">
          {designer.tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
        <Button onClick={handleBook} className="w-full sm:w-auto">
          Book a consultation
        </Button>
      </div>

      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Prototype endpoint</DialogTitle>
            <DialogDescription>
              In the real platform, this would connect you directly with {designer.name}. For now, this is the end of the prototype.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
