import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const MIN_LENGTH = 20

interface SituationInputProps {
  onSubmit: (description: string) => void
  placeholder?: string
}

const defaultPlaceholder =
  "We're students moving into a 3-bedroom flat together next month. We each have some furniture but the space feels cramped and we're not sure how to make it work..."

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
      <p className="text-sm text-slate-500">
        {value.length} characters {value.length >= MIN_LENGTH ? '— ready to continue' : `(min ${MIN_LENGTH})`}
      </p>
      <Button onClick={() => onSubmit(value.trim())} disabled={!valid}>
        Continue
      </Button>
    </div>
  )
}
