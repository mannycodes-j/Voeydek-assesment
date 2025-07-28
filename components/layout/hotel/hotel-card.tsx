'use client'

import { X, Star, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Hotel } from '@/lib/types/travel'
import Image from 'next/image'

interface HotelCardProps {
  hotel: Hotel
  onRemove: () => void
}

export function HotelCard({ hotel, onRemove }: HotelCardProps) {
  return (
    <Card className="relative border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
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
                hotel.image ||
                '/placeholder.svg?height=128&width=128&text=Hotel'
              }
              alt={hotel.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {hotel.name}
                </h4>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                  {hotel.address}
                </p>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(hotel.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-gray-900">
                      {hotel.rating}
                    </span>
                    <span className="text-sm text-gray-600">
                      ({hotel.reviews})
                    </span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 font-medium"
                  >
                    King size room
                  </Badge>
                </div>
              </div>
              <div className="text-right ml-6">
                <div className="text-2xl font-bold text-gray-900">
                  {hotel.price}
                </div>
                <div className="text-sm text-gray-500 line-through">
                  {hotel.originalPrice}
                </div>
                <div className="text-sm text-gray-600">{hotel.nights}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              {hotel.facilities.map((facility, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs border-gray-300"
                >
                  {facility}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Check-in {hotel.checkIn}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Check-out {hotel.checkOut}</span>
              </div>
            </div>

            <div className="flex gap-6">
              <Button variant="link" className="text-blue-600 p-0 font-medium">
                Hotel details
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
