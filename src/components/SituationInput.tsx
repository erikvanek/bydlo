import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const MIN_LENGTH = 20

interface SituationInputProps {
  onSubmit: (description: string) => void
  placeholder?: string
}

const defaultPlaceholder =
  "Jsme studenti, příští měsíc se stěhujeme do třípokojového bytu. Každý má nějaký nábytek, ale prostor působí stísněně a nevíme, jak to zařídit…"

export function SituationInput({
  onSubmit,
  placeholder = defaultPlaceholder,
}: SituationInputProps) {
  const [value, setValue] = useState('')
  const valid = value.trim().length >= MIN_LENGTH

  return (
    <div className="space-y-4">
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="min-h-[120px]"
        maxLength={500}
      />
      <p className="text-sm text-muted-foreground">
        {value.length} znaků {value.length >= MIN_LENGTH ? '— můžete pokračovat' : `(min ${MIN_LENGTH})`}
      </p>
      <Button onClick={() => onSubmit(value.trim())} disabled={!valid}>
        Pokračovat
      </Button>
    </div>
  )
}
