'use client'

import { X, Star, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Activity } from '@/lib/types/travel'
import Image from 'next/image'

interface ActivityCardProps {
  activity: Activity
  onRemove: () => void
}

export function ActivityCard({ activity, onRemove }: ActivityCardProps) {
  return (
    <Card className="relative border-l-4 border-l-blue-600 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={onRemove}
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="flex gap-6">
          <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={
                activity.image ||
                '/placeholder.svg?height=128&width=128&text=Activity'
              }
              alt={activity.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {activity.name}
                </h4>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                  {activity.description}
                </p>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(activity.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-gray-900">
                      {activity.rating}
                    </span>
                    <span className="text-sm text-gray-600">
                      ({activity.reviews})
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">
                      {activity.duration}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right ml-6">
                <div className="text-2xl font-bold text-gray-900">
                  {activity.price}
                </div>
                <div className="text-sm text-gray-600">{activity.note}</div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-700">
                <strong>What's included:</strong> {activity.included}
              </p>
              <Button
                variant="link"
                className="text-blue-600 p-0 text-sm font-medium"
              >
                See more
              </Button>
            </div>

            <div className="flex gap-6">
              <Button variant="link" className="text-blue-600 p-0 font-medium">
                Activity details
              </Button>
              <Button variant="link" className="text-blue-600 p-0 font-medium">
                Price details
              </Button>
              <Button
                variant="link"
                className="text-blue-600 p-0 ml-auto font-medium"
              >
                Edit details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
