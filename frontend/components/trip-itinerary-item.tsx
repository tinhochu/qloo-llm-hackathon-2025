import { CulturalPreferencesBadge } from '@/components/cultural-preferences-badge'
import { EntityImage, EntityImageLoading } from '@/components/entity-image'
import { InstagramAgent, InstagramAgentSkeleton } from '@/components/instagram-agent'
import { TikTokAgent, TikTokAgentSkeleton } from '@/components/tiktok-agent'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { isEntityIdValid } from '@/helpers/qloo'
import { cn } from '@/lib/utils'

interface TripItineraryItemProps {
  item: any
  index: number
}

export function TripItineraryItem({ item, index }: TripItineraryItemProps) {
  return (
    <div key={index} className="border-l-4 border-indigo-200 pl-4 py-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{item.time}</span>
      </div>
      {item.recommendation && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div
              className={cn(
                'col-span-1',
                isEntityIdValid(item.recommendation.entity_id) ? 'lg:col-span-2' : 'lg:col-span-3'
              )}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">
                  {item.recommendation.type === 'restaurant' && '🍽️'}
                  {item.recommendation.type === 'attraction' && '🏛️'}
                  {item.recommendation.type === 'venue' && '🎵'}
                  {item.recommendation.type === 'hotel' && '🏨'}
                  {item.recommendation.type === 'activity' && '🎯'}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">{item.recommendation.name}</h4>

                  <div className="mb-3 flex gap-2">
                    {/* TikTok Agent */}
                    {item.tiktokData ? (
                      item.tiktokData.is_trending ? (
                        <TikTokAgent item={item} preFetchedData={item.tiktokData} />
                      ) : (
                        item.recommendation.cultural_match &&
                        item.recommendation.cultural_match.length > 0 && (
                          <div className="mb-3">
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.recommendation.cultural_match.map((match: string, matchIndex: number) => (
                                <span
                                  key={matchIndex}
                                  className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full"
                                >
                                  {match}
                                </span>
                              ))}
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <TikTokAgentSkeleton />
                    )}

                    {/* Instagram Agent */}
                    {item.instagramData ? (
                      item.instagramData.is_trending ? (
                        <InstagramAgent item={item} preFetchedData={item.instagramData} />
                      ) : (
                        item.recommendation.cultural_match &&
                        item.recommendation.cultural_match.length > 0 && (
                          <div className="mb-3">
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.recommendation.cultural_match.map((match: string, matchIndex: number) => (
                                <span
                                  key={matchIndex}
                                  className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full"
                                >
                                  {match}
                                </span>
                              ))}
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <InstagramAgentSkeleton />
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-700 mb-2 antialiased">
                    <span className="capitalize">{item.recommendation.type}</span>
                    <span>•</span>
                    <span>{item.recommendation.location}</span>
                    {item.recommendation.rating && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          ⭐ <span className="font-bold">{item.recommendation.rating}</span>
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-gray-700 mb-3">{item.recommendation.description}</p>

                  {item.recommendation.why_recommended && (
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-600">Why Recommended:</span>
                      <p className="text-sm text-gray-700 mt-1">{item.recommendation.why_recommended}</p>
                    </div>
                  )}

                  {item.recommendation.weather_consideration && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Weather Consideration:</span>
                      <p className="text-sm text-gray-700 mt-1">{item.recommendation.weather_consideration}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {isEntityIdValid(item.recommendation.entity_id) && (
              <div className="col-span-1">
                {item.entityImageData ? (
                  <div className="w-full h-full relative overflow-hidden rounded-lg">
                    <img
                      src={item.entityImageData.properties.image.url}
                      alt={item.entityImageData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <EntityImageLoading />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
