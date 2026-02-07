import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Designer Matchmaking
        </h1>
        <p className="text-slate-600 mb-8">
          Get matched with freelance designers and architects for a one-off consultation — whether you're sharing a flat, moving in together, or planning a small renovation.
        </p>
        <p className="text-sm text-slate-500 mb-10">
          100+ successful matches · 30+ designers across Czech Republic
        </p>

        <div className="space-y-4">
          <Card className="border-2 border-slate-900">
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-2">Describe your situation</h2>
              <p className="text-sm text-slate-600 mb-4">
                Tell us about your space and what you need. We'll ask a few follow-up questions and suggest designers who fit.
              </p>
              <Button asChild className="w-full">
                <Link to="/describe">Describe your situation</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-2">Choose a consultant</h2>
              <p className="text-sm text-slate-600 mb-4">
                Browse designers by specialty, location, and rate. Pick someone and book a consultation.
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link to="/browse">Choose a consultant</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
