import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConversation } from '@/context/ConversationContext'
import { designers } from '@/data/designers'
import { scoreDesigners } from '@/services/llmService'
import type { DesignerSummary } from '@/services/llmService'
import { DesignerCard } from '@/components/DesignerCard'
import { FilterBar } from '@/components/FilterBar'
import type { FilterState, ConversationMessage } from '@/types'

const defaultFilters: FilterState = {
  location: 'All locations',
  specialty: 'All specialties',
  rateMin: 0,
  rateMax: 200,
  availability: [],
}

const specialtyLabel: Record<string, string> = {
  interior: 'Interior Design',
  architect: 'Architecture',
  both: 'Interior & Architecture',
}

/** Designer summaries for the scoring prompt — built once at module level. */
const designerSummaries: DesignerSummary[] = designers.map((d) => ({
  id: d.id,
  name: d.name,
  specialty: specialtyLabel[d.specialty] ?? d.specialty,
  location: d.location,
  hourlyRate: d.hourlyRate,
  availability: d.availability,
  yearsExperience: d.yearsExperience,
  tags: d.tags,
  shortBio: d.shortBio,
  approach: d.approach,
}))

/** Rebuild full conversation history from context for scoring. */
function buildFullHistory(
  initialDescription: string,
  messages: ConversationMessage[]
): ConversationMessage[] {
  return [
    { id: 'initial', role: 'user', content: initialDescription, timestamp: new Date() },
    ...messages,
  ]
}

export function ResultsPage() {
  const navigate = useNavigate()
  const { state, setDesignerScores } = useConversation()
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [sortBy, setSortBy] = useState<'match' | 'rate' | 'location'>('match')
  const [isScoring, setIsScoring] = useState(false)
  const scoringFiredRef = useRef(false)

  // Lazy async scoring — fires once when page mounts with conversation state
  useEffect(() => {
    if (!state?.isComplete || !state.extractedNeeds) return
    if (state.designerScores.length > 0) return // Already scored
    if (scoringFiredRef.current) return
    scoringFiredRef.current = true

    const run = async () => {
      setIsScoring(true)
      try {
        const fullHistory = buildFullHistory(state.initialDescription, state.messages)
        const scores = await scoreDesigners(fullHistory, state.extractedNeeds, designerSummaries)
        setDesignerScores(scores)
      } catch (e) {
        console.warn('Scoring failed:', e)
        // Scores stay empty — cards show without match percentages
      } finally {
        setIsScoring(false)
      }
    }

    run()
  }, [state?.isComplete])

  const hasScores = (state?.designerScores?.length ?? 0) > 0

  const filteredAndScored = useMemo(() => {
    let list = designers.map((d) => {
      const scored = state?.designerScores?.find((s) => s.designerId === d.id)
      return {
        ...d,
        matchScore: scored ? scored.score : undefined,
        matchReason: scored?.reason,
      }
    })
    // Only filter by score once we have real scores
    if (hasScores) {
      list = list.filter((d) => d.matchScore == null || d.matchScore >= 40)
    }
    if (filters.location !== 'All locations') list = list.filter((d) => d.location === filters.location)
    if (filters.specialty !== 'All specialties') {
      const spec = filters.specialty === 'Interior Design' ? 'interior' : filters.specialty === 'Architecture' ? 'architect' : 'both'
      list = list.filter((d) => d.specialty === spec)
    }
    if (filters.rateMax < 200) list = list.filter((d) => d.hourlyRate <= filters.rateMax)
    if (filters.rateMin > 0) list = list.filter((d) => d.hourlyRate >= filters.rateMin)
    if (filters.availability.length) list = list.filter((d) => filters.availability.includes(d.availability))
    if (sortBy === 'match' && hasScores) list.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
    if (sortBy === 'rate') list.sort((a, b) => a.hourlyRate - b.hourlyRate)
    if (sortBy === 'location') list.sort((a, b) => a.location.localeCompare(b.location))
    return list.slice(0, 8)
  }, [state, filters, sortBy, hasScores])

  const locations = useMemo(() => [...new Set(designers.map((d) => d.location))], [])
  const specialties = useMemo(() => [...new Set(designers.map((d) => (d.specialty === 'interior' ? 'Interior Design' : d.specialty === 'architect' ? 'Architecture' : 'Both')))], [])

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">
          {isScoring
            ? 'Finding your best matches...'
            : `We found ${filteredAndScored.length} designers for you`}
        </h1>
        {state?.extractedNeeds && Object.keys(state.extractedNeeds).length > 0 && (
          <p className="text-muted-foreground text-sm mb-6">
            Based on: {state.extractedNeeds.spaceType ?? 'your space'}, {state.extractedNeeds.budget ? `budget ~€${state.extractedNeeds.budget}` : 'budget flexible'}, {state.extractedNeeds.timeline ?? 'timeline flexible'}
          </p>
        )}
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          availableLocations={locations}
          availableSpecialties={specialties}
        />
        <div className="mt-4 flex justify-end">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'match' | 'rate' | 'location')}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="match">Sort by match</option>
            <option value="rate">Sort by rate</option>
            <option value="location">Sort by location</option>
          </select>
        </div>
        <div className="grid gap-5 mt-6 sm:grid-cols-1 lg:grid-cols-2">
          {filteredAndScored.map((designer) => (
            <DesignerCard
              key={designer.id}
              designer={designer}
              showMatchScore={hasScores}
              isLoadingScore={isScoring}
              onViewProfile={() => navigate(`/designer/${designer.id}`)}
            />
          ))}
        </div>
        {filteredAndScored.length === 0 && (
          <p className="text-muted-foreground text-center py-12">No designers found. Try adjusting your filters.</p>
        )}
      </main>
    </div>
  )
}
