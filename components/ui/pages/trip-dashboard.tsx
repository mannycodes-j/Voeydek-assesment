'use client'
import {
  ArrowLeft,
  MoreHorizontal,
  UserPlus,
  Calendar,
  Plane,
  Hotel,
  MapPin,
  PlaneTakeoff,
  Star,
  Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useItineraryStore } from '@/lib/store/itinerary-store'
import { toast } from 'sonner'
import { X, Package, Monitor, Utensils, Usb } from 'lucide-react'
import Image from 'next/image'

export function TripDashboard() {
  const { flights, hotels, activities, removeItem } = useItineraryStore()

  const handleRemoveItem = (
    type: 'flight' | 'hotel' | 'activity',
    id: string
  ) => {
    removeItem(type, id)
    toast.success('Item removed from itinerary')
  }

  return (
    <div className="max-w-full">
      {/* Trip Header - Responsive */}
      <div className="relative mb-6">
        <div className="rounded-2xl p-4 md:p-6 relative overflow-hidden h-32 md:h-48">
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full z-0">
            <Image
              src="/assets/images/banner.png"
              alt="Trip Background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 rounded-2xl" />
          </div>
          {/* Top Controls */}
          <div className="absolute top-2 md:top-4 left-2 md:left-4 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full w-6 h-6 md:w-8 md:h-8"
            >
              <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 text-black" />
            </Button>
          </div>
        </div>

        {/* Trip Info - Responsive Layout */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mt-4 md:mt-6 space-y-4 md:space-y-0">
          {/* Left: Trip Info */}
          <div className="flex-1">
            <div className="flex items-center p-2 max-w-full md:max-w-[280px] gap-2 bg-[#FEF4E6] text-gray-700 text-xs md:text-sm mb-2">
              <Calendar className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-[#da860f] font-bold text-xs md:text-sm">
                21 March 2024 → 23 April 2024
              </span>
            </div>
            <h1 className="text-gray-900 text-xl md:text-2xl font-bold mb-1">
              Bahamas Family Trip
            </h1>
            <p className="text-gray-700 text-xs md:text-sm">
              New York, United States of America | Solo Trip
            </p>
          </div>

          {/* Right: Actions and Profile/Settings - Mobile Responsive */}
          <div className="flex flex-row md:flex-col items-center justify-between md:justify-start md:ml-6">
            {/* Button and Menu */}
            <div className="flex flex-row items-center gap-2 md:mb-6">
              <Button className="w-20 h-8 md:w-28 md:h-12 bg-[#E7F0FF] text-white flex items-center justify-center">
                <UserPlus className="w-3 h-3 md:w-4 md:h-4 text-blue-600 fill-blue-600" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 md:w-8 md:h-8"
              >
                <MoreHorizontal className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
            </div>

            <div className="flex flex-row items-center relative">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 flex items-center justify-center mb-0 md:mb-2">
                <Image
                  src="/assets/images/profile-icon.png"
                  alt="Profile"
                  width={24}
                  height={24}
                  className="rounded-full md:w-8 md:h-8"
                />
              </div>
              {/* Connecting Line */}
              <div className="w-4 md:w-8 h-0.5 bg-gray-300 mx-1 md:mx-2" />
              {/* Settings Icon */}
              <Settings className="w-6 h-6 md:w-9 md:h-8 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Cards - Responsive Grid */}
      <div className="w-full md:max-w-[65%] mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-0">
          <Card className="bg-[#000031] text-white rounded-lg md:rounded-none">
            <CardContent className="p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold mb-2">
                Activities
              </h3>
              <p className="text-gray-300 text-xs md:text-sm mb-4 leading-relaxed">
                Build personalized and optimized your itineraries with our trip
                planner.
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 md:py-2.5 text-sm rounded-[1px]">
                Add Activities
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#E7F0FF] text-white border-0 rounded-lg md:rounded-none">
            <CardContent className="p-4 md:p-6">
              <h3 className="text-base md:text-lg text-[#000031] font-semibold mb-2">
                Hotels
              </h3>
              <p className="text-[#000031] text-xs md:text-sm mb-4 leading-relaxed">
                Build personalized and optimized your itineraries with our trip
                planner.
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 md:py-2.5 text-sm rounded-[1px]">
                Add Hotels
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#0D6EFD] text-white border-0 rounded-lg md:rounded-none">
            <CardContent className="p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold mb-2">
                Flights
              </h3>
              <p className="text-blue-100 text-xs md:text-sm mb-4 leading-relaxed">
                Build personalized and optimized your itineraries with our trip
                planner.
              </p>
              <Button className="w-full bg-white text-blue-600 hover:bg-gray-100 font-medium py-2 md:py-2.5 text-sm rounded-[1px]">
                Add Flights
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trip Itineraries */}
      <div className="mb-8">
        <h2 className="text-lg md:text-xl font-semibold mb-1">
          Trip Itineraries
        </h2>
        <p className="text-gray-600 text-xs md:text-sm mb-6">
          Your trip itineraries are placed here
        </p>

        {/* Flights Section */}
        <div className="mb-8 bg-gray-200 p-4 md:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 md:gap-3">
              <PlaneTakeoff className="w-3 h-3 text-gray-700" />
              <h3 className="text-base md:text-lg font-semibold">Flights</h3>
            </div>
            <Button
              variant="link"
              className="text-blue-600 text-xs md:text-sm font-medium p-2 md:p-4 rounded-[1px] bg-white"
            >
              Add Flights
            </Button>
          </div>

          <div className="space-y-4">
            {flights.map((flight) => (
              <Card
                key={flight.id}
                className="border border-gray-200 rounded-xl shadow-sm overflow-hidden"
              >
                <CardContent className="p-0 flex flex-col md:flex-row">
                  {/* Main card content */}
                  <div className="flex-1 p-4 md:p-6">
                    {/* Flight info - Mobile: Stack vertically, Desktop: Horizontal */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6 space-y-4 md:space-y-0">
                      {/* Left side - Airline info */}
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-red-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs md:text-sm font-bold">
                            AA
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-base md:text-lg">
                            {flight.airline}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs md:text-sm text-gray-600">
                              {flight.flightNumber}
                            </span>
                            <Badge className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                              First Class
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Center - Flight times and path - Mobile: Full width */}
                      <div className="flex items-center gap-4 md:gap-8 flex-1 md:mx-8">
                        {/* Departure */}
                        <div className="text-center flex-1">
                          <div className="text-xl md:text-3xl font-bold text-gray-900">
                            {flight.departure.time}
                          </div>
                          <div className="text-xs md:text-sm text-gray-600 mt-1">
                            {flight.departure.date}
                          </div>
                          <div className="text-sm md:text-lg font-semibold text-gray-900 mt-1">
                            {flight.departure.code}
                          </div>
                        </div>

                        {/* Flight path */}
                        <div className="flex-1 text-center">
                          <div className="text-xs md:text-sm text-gray-600 mb-2">
                            Duration: {flight.duration}
                          </div>
                          <div className="relative">
                            <div className="h-px bg-blue-400 w-full"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                              <Plane className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                            </div>
                          </div>
                          <div className="text-xs md:text-sm font-medium text-blue-600 mt-2">
                            {flight.type}
                          </div>
                        </div>

                        {/* Arrival */}
                        <div className="text-center flex-1">
                          <div className="text-xl md:text-3xl font-bold text-gray-900">
                            {flight.arrival.time}
                          </div>
                          <div className="text-xs md:text-sm text-gray-600 mt-1">
                            {flight.arrival.date}
                          </div>
                          <div className="text-sm md:text-lg font-semibold text-gray-900 mt-1">
                            {flight.arrival.code}
                          </div>
                        </div>
                      </div>

                      {/* Right side - Price */}
                      <div className="text-center md:text-right">
                        <div className="text-xl md:text-2xl font-bold text-gray-900">
                          {flight.price}
                        </div>
                      </div>
                    </div>

                    {/* Facilities - Mobile: Wrap, Desktop: Horizontal */}
                    <div className="mb-4 md:mb-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-1 text-xs md:text-sm text-gray-600">
                        <span className="font-medium mb-2 md:mb-0">
                          Facilities:
                        </span>
                        <div className="flex flex-wrap items-center gap-2 md:gap-4 md:ml-2">
                          <div className="flex items-center gap-1">
                            <Package className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="text-xs md:text-sm">
                              Baggage: 20kg, Cabin: 8kg
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Monitor className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="text-xs md:text-sm">
                              Entertainment
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Utensils className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="text-xs md:text-sm">Meal</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Usb className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="text-xs md:text-sm">USB Port</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom links - Mobile: Stack, Desktop: Horizontal */}
                    <div className="flex flex-col md:flex-row gap-2 md:gap-6">
                      <Button
                        variant="link"
                        className="text-blue-600 p-0 text-xs md:text-sm font-medium justify-start md:justify-center"
                      >
                        Flight details
                      </Button>
                      <Button
                        variant="link"
                        className="text-blue-600 p-0 text-xs md:text-sm font-medium justify-start md:justify-center"
                      >
                        Price details
                      </Button>
                      <Button
                        variant="link"
                        className="text-blue-600 p-0 md:ml-auto text-xs md:text-sm font-medium justify-start md:justify-center"
                      >
                        Edit details
                      </Button>
                    </div>
                  </div>

                  {/* Cancel button strip - Mobile: Bottom, Desktop: Right */}
                  <div className="w-full h-12 md:w-12 md:h-auto bg-red-50 flex items-center justify-center border-t md:border-t-0 md:border-l border-red-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-100 w-6 h-6 md:w-8 md:h-8"
                      onClick={() => handleRemoveItem('flight', flight.id)}
                    >
                      <X className="w-3 h-3 md:w-4 md:h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Hotels Section */}
        <div className="mb-8 bg-[#344054] p-4 md:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 md:gap-3">
              <Hotel className="w-3 h-3 text-white" />
              <h3 className="text-base md:text-lg text-white font-semibold">
                Hotels
              </h3>
            </div>
            <Button
              variant="link"
              className="text-[#344054] text-xs md:text-sm font-medium p-2 md:p-4 rounded-[1px] bg-white"
            >
              Add Hotels
            </Button>
          </div>

          <div className="space-y-4">
            {hotels.map((hotel) => (
              <Card
                key={hotel.id}
                className="border border-gray-200 rounded-xl shadow-sm overflow-hidden"
              >
                <CardContent className="p-0 flex flex-col md:flex-row">
                  {/* Main card content */}
                  <div className="flex-1 p-4 md:p-6">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                      {/* Hotel Image */}
                      <div className="w-full h-32 md:w-24 md:h-24 relative rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={
                            hotel.image ||
                            '/placeholder.svg?height=96&width=96&text=Hotel' ||
                            '/placeholder.svg'
                          }
                          alt={hotel.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Hotel Details */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3 space-y-2 md:space-y-0">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-base md:text-lg mb-1">
                              {hotel.name}
                            </h4>
                            <p className="text-xs md:text-sm text-gray-600 mb-2">
                              {hotel.address}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < Math.floor(hotel.rating)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs md:text-sm font-medium">
                                {hotel.rating} ({hotel.reviews})
                              </span>
                              <span className="text-xs md:text-sm text-gray-600">
                                King size room
                              </span>
                            </div>
                          </div>
                          <div className="text-left md:text-right">
                            <div className="text-xl md:text-2xl font-bold text-gray-900">
                              {hotel.price}
                            </div>
                            <div className="text-xs md:text-sm text-gray-500">
                              {hotel.originalPrice}
                            </div>
                            <div className="text-xs md:text-sm text-gray-600">
                              {hotel.nights}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-3">
                          <span className="text-xs md:text-sm font-medium text-gray-700">
                            Facilities:
                          </span>
                          <div className="flex items-center gap-3">
                            {hotel.facilities
                              .slice(0, 2)
                              .map((facility, index) => (
                                <span
                                  key={index}
                                  className="text-xs md:text-sm text-gray-600"
                                >
                                  🏊 {facility}
                                </span>
                              ))}
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 mb-4">
                          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                            <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                            <span>Check-in {hotel.checkIn}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                            <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                            <span>Check-out {hotel.checkOut}</span>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-2 md:gap-6">
                          <Button
                            variant="link"
                            className="text-blue-600 p-0 text-xs md:text-sm font-medium justify-start md:justify-center"
                          >
                            Hotel details
                          </Button>
                          <Button
                            variant="link"
                            className="text-blue-600 p-0 text-xs md:text-sm font-medium justify-start md:justify-center"
                          >
                            Price details
                          </Button>
                          <Button
                            variant="link"
                            className="text-blue-600 p-0 md:ml-auto text-xs md:text-sm font-medium justify-start md:justify-center"
                          >
                            Edit details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cancel button strip */}
                  <div className="w-full h-12 md:w-12 md:h-auto bg-red-50 flex items-center justify-center border-t md:border-t-0 md:border-l border-red-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-100 w-6 h-6 md:w-8 md:h-8"
                      onClick={() => handleRemoveItem('hotel', hotel.id)}
                    >
                      <X className="w-3 h-3 md:w-4 md:h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Activities Section */}
        <div className="mb-8 bg-[#0054E4] p-4 md:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-5 h-5 md:w-6 md:h-6 bg-blue-600 rounded flex items-center justify-center">
                <MapPin className="w-3 h-3 text-white" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-white">
                Activities
              </h3>
            </div>
            <Button
              variant="link"
              className="text-blue-600 bg-white rounded-[1px] text-xs md:text-sm font-medium p-2 md:p-4"
            >
              Add Activities
            </Button>
          </div>

          <div className="space-y-4">
            {activities.map((activity) => (
              <Card
                key={activity.id}
                className="border border-gray-200 rounded-xl shadow-sm overflow-hidden"
              >
                <CardContent className="p-0 flex flex-col md:flex-row">
                  {/* Main card content */}
                  <div className="flex-1 p-4 md:p-6">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                      {/* Activity Image */}
                      <div className="w-full h-32 md:w-24 md:h-24 relative rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={
                            activity.image ||
                            '/placeholder.svg?height=96&width=96&text=Museum' ||
                            '/placeholder.svg'
                          }
                          alt={activity.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Activity Details */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3 space-y-2 md:space-y-0">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-base md:text-lg mb-1">
                              {activity.name}
                            </h4>
                            <p className="text-xs md:text-sm text-gray-600 mb-2">
                              {activity.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-2">
                              <div className="flex items-center gap-1">
                                <span className="text-xs md:text-sm text-blue-600">
                                  📍 Directions
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < Math.floor(activity.rating)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                                <span className="text-xs md:text-sm font-medium ml-1">
                                  {activity.rating} ({activity.reviews})
                                </span>
                              </div>
                              <span className="text-xs md:text-sm text-gray-600">
                                ⏱ {activity.duration}
                              </span>
                            </div>
                          </div>
                          <div className="text-left md:text-right">
                            <div className="text-xl md:text-2xl font-bold text-gray-900">
                              {activity.price}
                            </div>
                            <div className="text-xs md:text-sm text-gray-600">
                              {activity.note}
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-xs md:text-sm text-gray-700">
                            <span className="font-medium">
                              What's Included:
                            </span>{' '}
                            {activity.included}{' '}
                            <Button
                              variant="link"
                              className="text-blue-600 p-0 text-xs md:text-sm"
                            >
                              See more
                            </Button>
                          </p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-2 md:gap-6">
                          <Button
                            variant="link"
                            className="text-blue-600 p-0 text-xs md:text-sm font-medium justify-start md:justify-center"
                          >
                            Activity details
                          </Button>
                          <Button
                            variant="link"
                            className="text-blue-600 p-0 text-xs md:text-sm font-medium justify-start md:justify-center"
                          >
                            Price details
                          </Button>
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-4 py-1 text-xs md:text-sm rounded self-start md:self-center">
                            Buy
                          </Button>
                          <Button
                            variant="link"
                            className="text-blue-600 p-0 md:ml-auto text-xs md:text-sm font-medium justify-start md:justify-center"
                          >
                            Edit details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cancel button strip */}
                  <div className="w-full h-12 md:w-12 md:h-auto bg-red-50 flex items-center justify-center border-t md:border-t-0 md:border-l border-red-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-100 w-6 h-6 md:w-8 md:h-8"
                      onClick={() => handleRemoveItem('activity', activity.id)}
                    >
                      <X className="w-3 h-3 md:w-4 md:h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
