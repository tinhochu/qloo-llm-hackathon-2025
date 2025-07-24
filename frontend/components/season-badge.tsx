import { Badge } from '@/components/ui/badge'

export const SeasonBadge = ({ season }: { season: string }) => {
  return (
    <Badge variant="outline" className="flex items-center gap-2 text-body bg-white">
      {season.charAt(0).toUpperCase() + season.slice(1)}
    </Badge>
  )
}
