import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { designers } from '@/data/designers'
import { DesignerCard } from '@/components/DesignerCard'
import { FilterBar } from '@/components/FilterBar'
import type { FilterState } from '@/types'

const defaultFilters: FilterState = {
  location: 'All locations',
  specialty: 'All specialties',
  rateMin: 0,
  rateMax: 200,
  availability: [],
}

export function BrowsePage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<FilterState>(defaultFilters)

  const filtered = useMemo(() => {
    let list = [...designers]
    if (filters.location !== 'All locations') list = list.filter((d) => d.location === filters.location)
    if (filters.specialty !== 'All specialties') {
      const spec = filters.specialty === 'Interior Design' ? 'interior' : filters.specialty === 'Architecture' ? 'architect' : 'both'
      list = list.filter((d) => d.specialty === spec)
    }
    if (filters.rateMax < 200) list = list.filter((d) => d.hourlyRate <= filters.rateMax)
    if (filters.rateMin > 0) list = list.filter((d) => d.hourlyRate >= filters.rateMin)
    if (filters.availability.length) list = list.filter((d) => filters.availability.includes(d.availability))
    return list
  }, [filters])

  const locations = useMemo(() => [...new Set(designers.map((d) => d.location))], [])
  const specialties = useMemo(() => [...new Set(designers.map((d) => (d.specialty === 'interior' ? 'Interior Design' : d.specialty === 'architect' ? 'Architecture' : 'Both')))], [])

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Browse designers</h1>
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          availableLocations={locations}
          availableSpecialties={specialties}
        />
        <div className="grid gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((designer) => (
            <DesignerCard
              key={designer.id}
              designer={designer}
              onViewProfile={() => navigate(`/designer/${designer.id}`)}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-slate-500 text-center py-12">No designers found. Try adjusting your filters.</p>
        )}
      </main>
    </div>
  )
}
