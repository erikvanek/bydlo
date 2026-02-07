import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConversation } from '@/context/ConversationContext'
import { designers } from '@/data/designers'
import { DesignerCard } from '@/components/DesignerCard'
import { FilterBar } from '@/components/FilterBar'
import type { Designer, FilterState } from '@/types'

const defaultFilters: FilterState = {
  location: 'All locations',
  specialty: 'All specialties',
  rateMin: 0,
  rateMax: 200,
  availability: [],
}

function matchScore(designer: Designer, needs: ReturnType<typeof useConversation>['state']): number {
  if (!needs?.extractedNeeds) return 50
  const n = needs.extractedNeeds
  let score = 50
  if (n.constraints?.length && n.constraints.some((c) => c.toLowerCase().includes(designer.location.toLowerCase()))) score += 30
  if (n.budget && designer.hourlyRate <= n.budget) score += 25
  if (n.timeline && designer.availability === n.timeline) score += 20
  score += Math.floor(Math.random() * 11) - 5
  return Math.max(0, Math.min(100, score))
}

export function ResultsPage() {
  const navigate = useNavigate()
  const { state } = useConversation()
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [sortBy, setSortBy] = useState<'match' | 'rate' | 'location'>('match')

  const filteredAndScored = useMemo(() => {
    let list = designers.map((d) => ({
      ...d,
      matchScore: state ? matchScore(d, state) : undefined,
    }))
    list = list.filter((d) => d.matchScore == null || d.matchScore >= 70)
    if (filters.location !== 'All locations') list = list.filter((d) => d.location === filters.location)
    if (filters.specialty !== 'All specialties') {
      const spec = filters.specialty === 'Interior Design' ? 'interior' : filters.specialty === 'Architecture' ? 'architect' : 'both'
      list = list.filter((d) => d.specialty === spec)
    }
    if (filters.rateMax < 200) list = list.filter((d) => d.hourlyRate <= filters.rateMax)
    if (filters.rateMin > 0) list = list.filter((d) => d.hourlyRate >= filters.rateMin)
    if (filters.availability.length) list = list.filter((d) => filters.availability.includes(d.availability))
    if (sortBy === 'match' && state) list.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
    if (sortBy === 'rate') list.sort((a, b) => a.hourlyRate - b.hourlyRate)
    if (sortBy === 'location') list.sort((a, b) => a.location.localeCompare(b.location))
    return list.slice(0, 5)
  }, [state, filters, sortBy])

  const locations = useMemo(() => [...new Set(designers.map((d) => d.location))], [])
  const specialties = useMemo(() => [...new Set(designers.map((d) => (d.specialty === 'interior' ? 'Interior Design' : d.specialty === 'architect' ? 'Architecture' : 'Both')))], [])

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">
          We found {filteredAndScored.length} designers for you
        </h1>
        {state?.extractedNeeds && Object.keys(state.extractedNeeds).length > 0 && (
          <p className="text-slate-600 text-sm mb-6">
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
        <div className="grid gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndScored.map((designer) => (
            <DesignerCard
              key={designer.id}
              designer={designer}
              showMatchScore={!!state}
              onViewProfile={() => navigate(`/designer/${designer.id}`)}
            />
          ))}
        </div>
        {filteredAndScored.length === 0 && (
          <p className="text-slate-500 text-center py-12">No designers found. Try adjusting your filters.</p>
        )}
      </main>
    </div>
  )
}
