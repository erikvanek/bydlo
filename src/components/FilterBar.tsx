import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import type { FilterState } from '@/types'

interface FilterBarProps {
  onFilterChange: (filters: FilterState) => void
  availableLocations: string[]
  availableSpecialties: string[]
  filters: FilterState
}

const LOCATION_OPTIONS = ['Všechna města', 'Praha', 'Brno', 'Olomouc', 'Ostrava']
const SPECIALTY_OPTIONS = ['Všechny obory', 'Interiérový design', 'Architektura', 'Obojí']
const AVAILABILITY_OPTIONS = [
  { value: 'immediate' as const, label: 'Ihned' },
  { value: 'within-week' as const, label: 'Do týdne' },
  { value: 'within-month' as const, label: 'Do měsíce' },
]

export function FilterBar({
  onFilterChange,
  availableLocations,
  availableSpecialties,
  filters,
}: FilterBarProps) {
  const locations = ['Všechna města', ...availableLocations]
  const specialties = ['Všechny obory', ...availableSpecialties]

  const update = (patch: Partial<FilterState>) => {
    onFilterChange({ ...filters, ...patch })
  }

  const toggleAvailability = (value: FilterState['availability'][number]) => {
    const next = filters.availability.includes(value)
      ? filters.availability.filter((a) => a !== value)
      : [...filters.availability, value]
    update({ availability: next })
  }

  const activeCount =
    (filters.location !== 'Všechna města' ? 1 : 0) +
    (filters.specialty !== 'Všechny obory' ? 1 : 0) +
    (filters.rateMin > 0 || filters.rateMax < 200 ? 1 : 0) +
    filters.availability.length

  return (
    <div className="space-y-4 p-4 rounded-lg border bg-muted/30">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Filtry</span>
        {activeCount > 0 && (
          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
            {activeCount} aktivní
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Město</label>
          <Select value={filters.location} onValueChange={(v) => update({ location: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Město" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Obor</label>
          <Select value={filters.specialty} onValueChange={(v) => update({ specialty: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Obor" />
            </SelectTrigger>
            <SelectContent>
              {specialties.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Sazba €/hod: {filters.rateMin}–{filters.rateMax}</label>
          <Slider
            min={0}
            max={200}
            step={5}
            value={[filters.rateMax]}
            onValueChange={([v]) => update({ rateMax: v })}
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-2">Dostupnost</label>
          <div className="flex flex-wrap gap-3">
            {AVAILABILITY_OPTIONS.map(({ value, label }) => (
              <label key={value} className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox
                  checked={filters.availability.includes(value)}
                  onCheckedChange={() => toggleAvailability(value)}
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
