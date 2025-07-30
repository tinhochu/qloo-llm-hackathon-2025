import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'

function TikTokAgentSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-7 w-20 rounded-xl bg-gray-600" />
    </div>
  )
}

function TikTokAgent({ item, preFetchedData }: any) {
  // Use pre-fetched data if available, otherwise return skeleton
  if (!preFetchedData) {
    return <TikTokAgentSkeleton />
  }

  const parsedData = preFetchedData

  if (!parsedData.is_trending) {
    return (
      <>
        {item.recommendation.cultural_match && item.recommendation.cultural_match.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1 mt-1">
              {item.recommendation.cultural_match.map((match: string, matchIndex: number) => (
                <span key={matchIndex} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                  {match}
                </span>
              ))}
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Badge className="bg-black text-white px-3 py-1 text-xs font-bold border-2 rounded-xl border-pink-500 shadow-lg hover:shadow-xl transition-shadow hover:cursor-pointer hover:scale-95 transition-all duration-300">
          <svg fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M6.977,15.532a2.791,2.791,0,0,0,2.791,2.792,2.859,2.859,0,0,0,2.9-2.757L12.7,3h2.578A4.8,4.8,0,0,0,19.7,7.288v2.995h0c-.147.014-.295.022-.443.022a4.8,4.8,0,0,1-4.02-2.172v7.4a5.469,5.469,0,1,1-5.469-5.469c.114,0,.226.01.338.017v2.7a2.909,2.909,0,0,0-.338-.034A2.791,2.791,0,0,0,6.977,15.532Z"></path>
            </g>
          </svg>
          VIRAL
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="bg-gray-100">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <div className="h-5 w-5">
            <svg fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#000000">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path d="M6.977,15.532a2.791,2.791,0,0,0,2.791,2.792,2.859,2.859,0,0,0,2.9-2.757L12.7,3h2.578A4.8,4.8,0,0,0,19.7,7.288v2.995h0c-.147.014-.295.022-.443.022a4.8,4.8,0,0,1-4.02-2.172v7.4a5.469,5.469,0,1,1-5.469-5.469c.114,0,.226.01.338.017v2.7a2.909,2.909,0,0,0-.338-.034A2.791,2.791,0,0,0,6.977,15.532Z"></path>
              </g>
            </svg>
          </div>
          TikTok Insights
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs text-gray-700">
            <strong>Hashtags:</strong> {parsedData.trending_hashtags.join(', ')}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { TikTokAgent, TikTokAgentSkeleton }
