import { useParams, useNavigate } from 'react-router-dom'
import { designers } from '@/data/designers'
import { DesignerProfile } from '@/components/DesignerProfile'

export function DesignerDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const designer = designers.find((d) => d.id === id)

  if (!designer) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Designer not found.</p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-slate-900 underline mt-2"
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-2xl mx-auto px-4 py-8">
        <DesignerProfile
          designer={designer}
          onBookConsultation={() => {}}
          onBack={() => navigate(-1)}
        />
      </main>
    </div>
  )
}
