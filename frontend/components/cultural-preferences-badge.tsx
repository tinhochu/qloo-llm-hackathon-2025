import { Badge } from '@/components/ui/badge'

export const CulturalPreferencesBadge = ({ culturalPreferences }: { culturalPreferences: string[] }) => {
  return (
    <>
      {culturalPreferences.map((preference) => (
        <Badge variant="outline" className="flex items-center gap-2 text-body bg-white" key={preference}>
          {preference.charAt(0).toUpperCase() + preference.slice(1)}
        </Badge>
      ))}
    </>
  )
}
