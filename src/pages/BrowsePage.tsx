import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { designers } from '@/data/designers'
import { DesignerCard } from '@/components/DesignerCard'
import { FilterBar } from '@/components/FilterBar'
import type { FilterState } from '@/types'

const defaultFilters: FilterState = {
  location: 'Všechna města',
  specialty: 'Všechny obory',
  rateMin: 0,
  rateMax: 200,
  availability: [],
}

export function BrowsePage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<FilterState>(defaultFilters)

  const filtered = useMemo(() => {
    let list = [...designers]
    if (filters.location !== 'Všechna města') list = list.filter((d) => d.location === filters.location)
    if (filters.specialty !== 'Všechny obory') {
      const spec = filters.specialty === 'Interiérový design' ? 'interior' : filters.specialty === 'Architektura' ? 'architect' : 'both'
      list = list.filter((d) => d.specialty === spec)
    }
    if (filters.rateMax < 200) list = list.filter((d) => d.hourlyRate <= filters.rateMax)
    if (filters.rateMin > 0) list = list.filter((d) => d.hourlyRate >= filters.rateMin)
    if (filters.availability.length) list = list.filter((d) => filters.availability.includes(d.availability))
    return list
  }, [filters])

  const locations = useMemo(() => [...new Set(designers.map((d) => d.location))], [])
  const specialties = useMemo(() => [...new Set(designers.map((d) => (d.specialty === 'interior' ? 'Interiérový design' : d.specialty === 'architect' ? 'Architektura' : 'Obojí')))], [])

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Prohlédnout designéry</h1>
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          availableLocations={locations}
          availableSpecialties={specialties}
        />
        <div className="grid gap-5 mt-6 sm:grid-cols-1 lg:grid-cols-2">
          {filtered.map((designer) => (
            <DesignerCard
              key={designer.id}
              designer={designer}
              onViewProfile={() => navigate(`/designer/${designer.id}`)}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-muted-foreground text-center py-12">Žádní designéři nenalezeni. Zkuste upravit filtry.</p>
        )}
      </main>
    </div>
  )
}
