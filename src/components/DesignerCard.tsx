import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import type { Designer } from '@/types'

interface DesignerCardProps {
  designer: Designer & { matchReason?: string }
  showMatchScore?: boolean
  isLoadingScore?: boolean
  onViewProfile: () => void
}

const specialtyLabel: Record<Designer['specialty'], string> = {
  interior: 'Interior Design',
  architect: 'Architecture',
  both: 'Interior & Architecture',
}

export function DesignerCard({ designer, showMatchScore = false, isLoadingScore = false, onViewProfile }: DesignerCardProps) {
  return (
    <Card className="overflow-hidden border border-transparent shadow-[0_1px_3px_0_rgb(0_0_0/0.04)] hover:shadow-[0_8px_24px_0_rgb(0_0_0/0.06)] hover:-translate-y-0.5 hover:border-primary/30 transition-all duration-300 ease-out">
      <CardContent className="p-0">
        <div className="flex gap-4 p-4">
          <Avatar className="h-16 w-16 shrink-0">
            <AvatarImage src={designer.photo} alt={designer.name} />
            <AvatarFallback>{designer.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-foreground">{designer.name}</h3>
              {isLoadingScore && !showMatchScore && (
                <Skeleton className="h-5 w-20 rounded-full" />
              )}
              {showMatchScore && designer.matchScore != null && (
                <Badge variant="secondary" className="animate-in fade-in duration-500">
                  {designer.matchScore}% match
                </Badge>
              )}
            </div>
            <Badge variant="outline" className="mt-1">{specialtyLabel[designer.specialty]}</Badge>
            <p className="text-sm text-muted-foreground mt-1">
              {designer.location} · €{designer.hourlyRate}/hr · {designer.availability.replace(/-/g, ' ')}
            </p>
            {isLoadingScore && !showMatchScore && (
              <Skeleton className="h-3.5 w-48 mt-1.5 rounded" />
            )}
            {showMatchScore && designer.matchReason && (
              <p className="text-xs text-primary/70 mt-1.5 italic animate-in fade-in duration-500">
                {designer.matchReason}
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{designer.shortBio}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-4 px-4">
        <Button variant="outline" className="w-full" onClick={onViewProfile}>
          View profile
        </Button>
      </CardFooter>
    </Card>
  )
}
