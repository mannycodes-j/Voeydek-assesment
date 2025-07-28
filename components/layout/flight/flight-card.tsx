'use client'

import { X, Plane } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Flight } from '@/lib/types/travel'

interface FlightCardProps {
  flight: Flight
  onRemove: () => void
}

export function FlightCard({ flight, onRemove }: FlightCardProps) {
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

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">AA</span>
            </div>
            <div>
              <h4 className="text-lg font-semibold">{flight.airline}</h4>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {flight.flightNumber}
                </span>
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 font-medium"
                >
                  First Class
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {flight.price}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">
              {flight.departure.time}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {flight.departure.date}
            </div>
            <div className="text-sm font-semibold text-gray-900 mt-1">
              {flight.departure.code}
            </div>
          </div>

          <div className="flex-1 mx-8 text-center">
            <div className="text-sm text-gray-600 mb-2">
              Duration: {flight.duration}
            </div>
            <div className="relative">
              <div className="h-px bg-gray-300 w-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                <Plane className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="text-sm font-medium text-green-600 mt-2">
              {flight.type}
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">
              {flight.arrival.time}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {flight.arrival.date}
            </div>
            <div className="text-sm font-semibold text-gray-900 mt-1">
              {flight.arrival.code}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {flight.facilities.map((facility, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs border-gray-300"
            >
              {facility}
            </Badge>
          ))}
        </div>

        <div className="flex gap-6">
          <Button variant="link" className="text-blue-600 p-0 font-medium">
            Flight details
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
      </CardContent>
    </Card>
  )
}
