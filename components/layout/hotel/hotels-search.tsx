'use client'

import { useState } from 'react'
import {
  Search,
  Star,
  MapPin,
  Calendar,
  Users,
  X,
  ChevronDown,
  Sliders,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useMutation, useQuery } from '@tanstack/react-query'
import { travelService } from '@/lib/services'
import { useItineraryStore } from '@/lib/store/itinerary-store'
import { toast } from 'sonner'
import type { Hotel } from '@/lib/types/travel'
import type { HotelSearchParams } from '@/lib/types/api'

export function HotelsSearch() {
  const [searchParams, setSearchParams] = useState<HotelSearchParams>({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    rooms: 1,
    sortBy: '',
    filters: [],
    priceMin: 0,
    priceMax: 20000,
  })

  const [searchResults, setSearchResults] = useState<Hotel[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState<string[]>([])
  const { addHotel } = useItineraryStore()

  // Fetch hotel filters
  const { data: hotelFilters = [] } = useQuery({
    queryKey: ['hotelFilters', searchParams.guests, searchParams.rooms],
    queryFn: () =>
      travelService.getHotelFilters({
        dest_id: '-2092174', // Mumbai default
        search_type: 'CITY',
        adults: searchParams.guests,
        room_qty: searchParams.rooms,
      }),
    enabled: true,
  })

  // Fetch sort options
  const { data: sortOptions = [] } = useQuery({
    queryKey: ['hotelSortOptions', searchParams.guests, searchParams.rooms],
    queryFn: () =>
      travelService.getHotelSortOptions({
        dest_id: '-2092174', // Mumbai default
        search_type: 'CITY',
        adults: searchParams.guests,
        room_qty: searchParams.rooms,
      }),
    enabled: true,
  })

  const searchMutation = useMutation({
    mutationFn: travelService.searchHotels,
    onSuccess: (data) => {
      setSearchResults(data)
      toast.success(`Found ${data.length} hotels`)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to search hotels')
    },
  })

  const handleSearch = () => {
    const validation = travelService.validateSearchParams('hotel', searchParams)

    if (!validation.isValid) {
      toast.error(validation.errors[0])
      return
    }

    // Validate dates
    const checkInDate = new Date(searchParams.checkIn)
    const checkOutDate = new Date(searchParams.checkOut)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (checkInDate < today) {
      toast.error('Check-in date cannot be in the past')
      return
    }

    if (checkOutDate <= checkInDate) {
      toast.error('Check-out date must be after check-in date')
      return
    }

    const searchData: HotelSearchParams = {
      ...searchParams,
      filters: appliedFilters,
    }

    searchMutation.mutate(searchData)
  }

  const handleAddToItinerary = (hotel: Hotel) => {
    const hotelWithId = {
      ...hotel,
      id: `hotel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }

    addHotel(hotelWithId)
    toast.success('Hotel added to itinerary!')
  }

  const handleFilterChange = (filterId: string, checked: boolean) => {
    if (checked) {
      setAppliedFilters([...appliedFilters, filterId])
    } else {
      setAppliedFilters(appliedFilters.filter((id) => id !== filterId))
    }
  }

  const removeFilter = (filterId: string) => {
    setAppliedFilters(appliedFilters.filter((id) => id !== filterId))
  }

  const clearAllFilters = () => {
    setAppliedFilters([])
    setSearchParams((prev) => ({
      ...prev,
      priceMin: 0,
      priceMax: 20000,
    }))
  }

  // Get filter title by ID
  const getFilterTitle = (filterId: string) => {
    for (const filter of hotelFilters) {
      const option = filter.options.find((opt) => opt.genericId === filterId)
      if (option) return option.title
    }
    return filterId
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Search Hotels</h1>
        <p className="text-gray-600 text-lg">
          Find and book the perfect accommodation for your stay
        </p>
      </div>

      {/* Search Form */}
      <Card className="mb-8 border-gray-200">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-900">
                Destination
              </label>
              <div className="relative">
                <Input
                  placeholder="Where are you going?"
                  value={searchParams.destination}
                  onChange={(e) =>
                    setSearchParams((prev) => ({
                      ...prev,
                      destination: e.target.value,
                    }))
                  }
                  className="h-12 pl-10"
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-900">
                Check-in
              </label>
              <div className="relative">
                <Input
                  type="date"
                  value={searchParams.checkIn}
                  onChange={(e) =>
                    setSearchParams((prev) => ({
                      ...prev,
                      checkIn: e.target.value,
                    }))
                  }
                  className="h-12 pl-10"
                  min={new Date().toISOString().split('T')[0]}
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-900">
                Check-out
              </label>
              <div className="relative">
                <Input
                  type="date"
                  value={searchParams.checkOut}
                  onChange={(e) =>
                    setSearchParams((prev) => ({
                      ...prev,
                      checkOut: e.target.value,
                    }))
                  }
                  className="h-12 pl-10"
                  min={
                    searchParams.checkIn ||
                    new Date().toISOString().split('T')[0]
                  }
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-900">
                Guests
              </label>
              <div className="relative">
                <Select
                  value={searchParams.guests.toString()}
                  onValueChange={(value) =>
                    setSearchParams((prev) => ({
                      ...prev,
                      guests: Number.parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger className="h-12 pl-10">
                    <SelectValue placeholder="2 Guests" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Guest</SelectItem>
                    <SelectItem value="2">2 Guests</SelectItem>
                    <SelectItem value="3">3 Guests</SelectItem>
                    <SelectItem value="4">4 Guests</SelectItem>
                  </SelectContent>
                </Select>
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-900">
                Rooms
              </label>
              <Select
                value={searchParams.rooms.toString()}
                onValueChange={(value) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    rooms: Number.parseInt(value),
                  }))
                }
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="1 Room" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Room</SelectItem>
                  <SelectItem value="2">2 Rooms</SelectItem>
                  <SelectItem value="3">3 Rooms</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 h-12"
              onClick={handleSearch}
              disabled={searchMutation.isPending}
            >
              <Search className="w-5 h-5 mr-2" />
              {searchMutation.isPending ? 'Searching...' : 'Search Hotels'}
            </Button>
            <Button
              variant="outline"
              className="px-8 py-3 h-12 bg-transparent"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Sliders className="w-5 h-5 mr-2" />
              Filters{' '}
              {appliedFilters.length > 0 && `(${appliedFilters.length})`}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="w-80 flex-shrink-0">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  {appliedFilters.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                      Clear all
                    </Button>
                  )}
                </div>

                {/* Applied Filters */}
                {appliedFilters.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium mb-3">
                      Applied Filters
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {appliedFilters.map((filterId) => (
                        <Badge
                          key={filterId}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {getFilterTitle(filterId)}
                          <X
                            className="w-3 h-3 cursor-pointer"
                            onClick={() => removeFilter(filterId)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Filter Categories */}
                <div className="space-y-6 max-h-96 overflow-y-auto">
                  {hotelFilters
                    .filter((filter) =>
                      ['price', 'class', 'popular', 'hotelfacility'].includes(
                        filter.field
                      )
                    )
                    .map((filter) => (
                      <Collapsible
                        key={filter.field}
                        defaultOpen={
                          filter.field === 'price' || filter.field === 'class'
                        }
                      >
                        <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
                          <h4 className="text-sm font-medium">
                            {filter.title}
                          </h4>
                          <ChevronDown className="w-4 h-4" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-3">
                          {filter.filterStyle === 'SLIDER' &&
                          filter.field === 'price' ? (
                            <div className="space-y-3">
                              <Slider
                                value={[
                                  searchParams.priceMin || 0,
                                  searchParams.priceMax || 20000,
                                ]}
                                onValueChange={(value) =>
                                  setSearchParams((prev) => ({
                                    ...prev,
                                    priceMin: value[0],
                                    priceMax: value[1],
                                  }))
                                }
                                max={Number.parseInt(filter.max || '20000')}
                                min={Number.parseInt(filter.min || '0')}
                                step={Number.parseInt(
                                  filter.minPriceStep || '500'
                                )}
                                className="w-full"
                              />
                              <div className="flex justify-between text-sm text-gray-600">
                                <span>
                                  {filter.currency} {searchParams.priceMin || 0}
                                </span>
                                <span>
                                  {filter.currency}{' '}
                                  {searchParams.priceMax || 20000}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {filter.options.slice(0, 10).map((option) => (
                                <div
                                  key={option.genericId}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={option.genericId}
                                    checked={appliedFilters.includes(
                                      option.genericId
                                    )}
                                    onCheckedChange={(checked) =>
                                      handleFilterChange(
                                        option.genericId,
                                        checked as boolean
                                      )
                                    }
                                  />
                                  <label
                                    htmlFor={option.genericId}
                                    className="text-sm cursor-pointer flex-1 flex justify-between"
                                  >
                                    <span>{option.title}</span>
                                    <span className="text-gray-500">
                                      ({option.countNotAutoextended})
                                    </span>
                                  </label>
                                </div>
                              ))}
                            </div>
                          )}
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results Section */}
        <div className="flex-1">
         
          {searchResults.length > 0 && (
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold">
                Available Hotels ({searchResults.length})
              </h2>
              <div className="flex gap-3">
                <Select
                  value={searchParams.sortBy}
                  onValueChange={(value) =>
                    setSearchParams((prev) => ({ ...prev, sortBy: value }))
                  }
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Hotel Results */}
          <div className="space-y-6">
            {searchResults.map((hotel) => (
              <Card
                key={hotel.id}
                className="hover:shadow-lg transition-shadow border-gray-200"
              >
                <CardContent className="p-0">
                  <div className="flex">
                    {/* Hotel Image */}
                    <div className="w-80 h-64 flex-shrink-0">
                      <img
                        src={hotel.image || '/placeholder.svg'}
                        alt={hotel.name}
                        className="w-full h-full object-cover rounded-l-lg"
                      />
                    </div>

                    {/* Hotel Details */}
                    <div className="flex-1 p-8">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            {hotel.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center">
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
                            <span className="text-sm text-gray-600">
                              {hotel.rating} ({hotel.reviews} reviews)
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-4">
                            {hotel.address}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-right mb-2">
                            {hotel.originalPrice && (
                              <div className="text-sm text-gray-500 line-through">
                                {hotel.originalPrice}
                              </div>
                            )}
                            <div className="text-2xl font-bold text-blue-600">
                              {hotel.price}
                            </div>
                            <div className="text-sm text-gray-600">
                              {hotel.nights}
                            </div>
                          </div>
                          <Button
                            className="bg-blue-600 hover:bg-blue-700 px-6 py-2"
                            onClick={() => handleAddToItinerary(hotel)}
                          >
                            Add to Itinerary
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
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

                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Room type:</span>{' '}
                        {hotel.roomType}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No results message */}
          {searchResults.length === 0 && !searchMutation.isPending && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Search for hotels to see results here
              </p>
            </div>
          )}

          {/* Loading State */}
          {searchMutation.isPending && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500 text-lg">Searching for hotels...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
