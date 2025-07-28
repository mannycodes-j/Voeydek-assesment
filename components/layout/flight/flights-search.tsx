'use client'

import { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  ArrowUpDown,
  Plane,
  Clock,
  Calendar,
  Users,
  MapPin,
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { useMutation, useQuery } from '@tanstack/react-query'
import { travelService } from '@/lib/services'
import { useItineraryStore } from '@/lib/store/itinerary-store'
import { toast } from 'sonner'
import type { Flight } from '@/lib/types/travel'
import type { FlightDestination, FlightSearchParams } from '@/lib/types/api'

export function FlightsSearch() {
  const [searchParams, setSearchParams] = useState<FlightSearchParams>({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    cabinClass: 'ECONOMY',
  })

  const [tripType, setTripType] = useState('round-trip')
  const [searchResults, setSearchResults] = useState<Flight[]>([])
  const [originQuery, setOriginQuery] = useState('')
  const [destinationQuery, setDestinationQuery] = useState('')
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false)
  const [showDestinationSuggestions, setShowDestinationSuggestions] =
    useState(false)
  const { addFlight } = useItineraryStore()

  // Search origin destinations
  const { data: originSuggestions = [], refetch: refetchOrigin } = useQuery({
    queryKey: ['flightDestinations', originQuery],
    queryFn: () => travelService.searchFlightDestinations(originQuery),
    enabled: originQuery.length >= 2,
  })

  // Search destination destinations
  const { data: destinationSuggestions = [], refetch: refetchDestination } =
    useQuery({
      queryKey: ['flightDestinations', destinationQuery],
      queryFn: () => travelService.searchFlightDestinations(destinationQuery),
      enabled: destinationQuery.length >= 2,
    })

  const searchMutation = useMutation({
    mutationFn: travelService.searchFlights,
    onSuccess: (data) => {
      setSearchResults(data)
      toast.success(`Found ${data.length} flights`)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to search flights')
    },
  })

  // Debounced search for origin
  useEffect(() => {
    const timer = setTimeout(() => {
      if (originQuery.length >= 2) {
        refetchOrigin()
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [originQuery, refetchOrigin])

  // Debounced search for destination
  useEffect(() => {
    const timer = setTimeout(() => {
      if (destinationQuery.length >= 2) {
        refetchDestination()
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [destinationQuery, refetchDestination])

  const handleSearch = () => {
    const validation = travelService.validateSearchParams('flight', {
      ...searchParams,
      tripType,
    })

    if (!validation.isValid) {
      toast.error(validation.errors[0])
      return
    }

    if (tripType === 'round-trip' && !searchParams.returnDate) {
      toast.error('Please select a return date for round-trip flights')
      return
    }

    // Validate dates
    const departureDate = new Date(searchParams.departureDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (departureDate < today) {
      toast.error('Departure date cannot be in the past')
      return
    }

    if (tripType === 'round-trip' && searchParams.returnDate) {
      const returnDate = new Date(searchParams.returnDate)
      if (returnDate <= departureDate) {
        toast.error('Return date must be after departure date')
        return
      }
    }

    const searchData: FlightSearchParams = {
      ...searchParams,
      returnDate:
        tripType === 'round-trip' ? searchParams.returnDate : undefined,
    }

    searchMutation.mutate(searchData)
  }

  const handleAddToItinerary = (flight: Flight) => {
    const flightWithId = {
      ...flight,
      id: `flight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }

    addFlight(flightWithId)
    toast.success('Flight added to itinerary!')
  }

  const selectOrigin = (destination: FlightDestination) => {
    setSearchParams((prev) => ({ ...prev, origin: destination.id }))
    setOriginQuery(`${destination.name} (${destination.code})`)
    setShowOriginSuggestions(false)
  }

  const selectDestination = (destination: FlightDestination) => {
    setSearchParams((prev) => ({ ...prev, destination: destination.id }))
    setDestinationQuery(`${destination.name} (${destination.code})`)
    setShowDestinationSuggestions(false)
  }

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-0">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">
          Search Flights
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          Find and book flights for your next adventure
        </p>
      </div>

      {/* Search Form */}
      <Card className="mb-6 sm:mb-8 border-gray-200">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          {/* Trip Type Selection */}
          <div className="mb-4 sm:mb-6">
            <RadioGroup
              value={tripType}
              onValueChange={setTripType}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="round-trip" id="round-trip" />
                <Label htmlFor="round-trip">Round-trip</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="one-way" id="one-way" />
                <Label htmlFor="one-way">One-way</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 mb-4 sm:mb-6">
            {/* Origin */}
            <div className="relative sm:col-span-1 xl:col-span-1">
              <label className="block text-sm font-semibold mb-2 sm:mb-3 text-gray-900">
                From
              </label>
              <div className="relative">
                <Input
                  placeholder="Origin city or airport"
                  value={originQuery}
                  onChange={(e) => {
                    setOriginQuery(e.target.value)
                    setShowOriginSuggestions(true)
                  }}
                  onFocus={() => setShowOriginSuggestions(true)}
                  className="h-10 sm:h-12 pl-8 sm:pl-10 text-sm"
                />
                <MapPin className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              </div>
              {showOriginSuggestions && originSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 sm:max-h-60 overflow-y-auto">
                  {originSuggestions.map((destination) => (
                    <div
                      key={destination.id}
                      className="p-2 sm:p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => selectOrigin(destination)}
                    >
                      <div className="font-medium text-sm">
                        {destination.name}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        {destination.code} • {destination.cityName},{' '}
                        {destination.countryName}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Destination */}
            <div className="relative sm:col-span-1 xl:col-span-1">
              <label className="block text-sm font-semibold mb-2 sm:mb-3 text-gray-900">
                To
              </label>
              <div className="relative">
                <Input
                  placeholder="Destination city or airport"
                  value={destinationQuery}
                  onChange={(e) => {
                    setDestinationQuery(e.target.value)
                    setShowDestinationSuggestions(true)
                  }}
                  onFocus={() => setShowDestinationSuggestions(true)}
                  className="h-10 sm:h-12 pl-8 sm:pl-10 text-sm"
                />
                <MapPin className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              </div>
              {showDestinationSuggestions &&
                destinationSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 sm:max-h-60 overflow-y-auto">
                    {destinationSuggestions.map((destination) => (
                      <div
                        key={destination.id}
                        className="p-2 sm:p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => selectDestination(destination)}
                      >
                        <div className="font-medium text-sm">
                          {destination.name}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">
                          {destination.code} • {destination.cityName},{' '}
                          {destination.countryName}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>

            {/* Departure Date */}
            <div className="sm:col-span-1 xl:col-span-1">
              <label className="block text-sm font-semibold mb-2 sm:mb-3 text-gray-900">
                Departure
              </label>
              <div className="relative">
                <Input
                  type="date"
                  value={searchParams.departureDate}
                  onChange={(e) =>
                    setSearchParams((prev) => ({
                      ...prev,
                      departureDate: e.target.value,
                    }))
                  }
                  className="h-10 sm:h-12 pl-8 sm:pl-10 text-sm"
                  min={new Date().toISOString().split('T')[0]}
                />
                <Calendar className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              </div>
            </div>

            {/* Return Date */}
            <div className="sm:col-span-1 xl:col-span-1">
              <label className="block text-sm font-semibold mb-2 sm:mb-3 text-gray-900">
                Return
              </label>
              <div className="relative">
                <Input
                  type="date"
                  value={searchParams.returnDate}
                  onChange={(e) =>
                    setSearchParams((prev) => ({
                      ...prev,
                      returnDate: e.target.value,
                    }))
                  }
                  className="h-10 sm:h-12 pl-8 sm:pl-10 text-sm"
                  min={
                    searchParams.departureDate ||
                    new Date().toISOString().split('T')[0]
                  }
                  disabled={tripType === 'one-way'}
                />
                <Calendar className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              </div>
            </div>

            {/* Passengers */}
            <div className="sm:col-span-1 xl:col-span-1">
              <label className="block text-sm font-semibold mb-2 sm:mb-3 text-gray-900">
                Passengers
              </label>
              <div className="relative">
                <Select
                  value={searchParams.passengers.toString()}
                  onValueChange={(value) =>
                    setSearchParams((prev) => ({
                      ...prev,
                      passengers: Number.parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger className="h-10 sm:h-12 pl-8 sm:pl-10 text-sm">
                    <SelectValue placeholder="1 Passenger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Passenger</SelectItem>
                    <SelectItem value="2">2 Passengers</SelectItem>
                    <SelectItem value="3">3 Passengers</SelectItem>
                    <SelectItem value="4">4 Passengers</SelectItem>
                  </SelectContent>
                </Select>
                <Users className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              </div>
            </div>

            {/* Cabin Class */}
            <div className="sm:col-span-2 lg:col-span-1 xl:col-span-1">
              <label className="block text-sm font-semibold mb-2 sm:mb-3 text-gray-900">
                Class
              </label>
              <Select
                value={searchParams.cabinClass}
                onValueChange={(value) =>
                  setSearchParams((prev) => ({ ...prev, cabinClass: value }))
                }
              >
                <SelectTrigger className="h-10 sm:h-12 text-sm">
                  <SelectValue placeholder="Economy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ECONOMY">Economy</SelectItem>
                  <SelectItem value="PREMIUM_ECONOMY">
                    Premium Economy
                  </SelectItem>
                  <SelectItem value="BUSINESS">Business</SelectItem>
                  <SelectItem value="FIRST">First Class</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              className="bg-blue-600 hover:bg-blue-700 px-6 sm:px-8 py-2 sm:py-3 h-10 sm:h-12 text-sm sm:text-base"
              onClick={handleSearch}
              disabled={searchMutation.isPending}
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              {searchMutation.isPending ? 'Searching...' : 'Search Flights'}
            </Button>
            <Button
              variant="outline"
              className="px-6 sm:px-8 py-2 sm:py-3 h-10 sm:h-12 bg-transparent text-sm sm:text-base"
            >
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      {searchResults.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <h2 className="text-xl sm:text-2xl font-semibold">
            Available Flights ({searchResults.length})
          </h2>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 bg-transparent text-sm"
            >
              <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Sort by Price
            </Button>
          </div>
        </div>
      )}

      {/* Flight Results */}
      <div className="space-y-4 sm:space-y-6">
        {searchResults.map((flight) => (
          <Card
            key={flight.id}
            className="hover:shadow-lg transition-shadow border-gray-200"
          >
            <CardContent className="p-4 sm:p-6">
              {/* Mobile Layout */}
              <div className="block sm:hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Plane className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base">
                        {flight.airline}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {flight.flightNumber}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">
                      {flight.price}
                    </div>
                    <div className="text-xs text-gray-600">per person</div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-lg font-semibold">
                        {flight.departure.time}
                      </div>
                      <div className="text-xs text-gray-600">
                        {flight.departure.date}
                      </div>
                      <div className="text-sm font-medium">
                        {flight.departure.code}
                      </div>
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="flex items-center justify-center mb-1">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <div className="mx-2 flex items-center gap-1 text-xs text-gray-600">
                          <Clock className="w-3 h-3" />
                          {flight.duration}
                        </div>
                        <div className="flex-1 h-px bg-gray-300"></div>
                      </div>
                      <div className="text-center text-xs text-gray-600">
                        {flight.type}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">
                        {flight.arrival.time}
                      </div>
                      <div className="text-xs text-gray-600">
                        {flight.arrival.date}
                      </div>
                      <div className="text-sm font-medium">
                        {flight.arrival.code}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {flight.facilities.slice(0, 3).map((facility, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs border-gray-300"
                    >
                      {facility}
                    </Badge>
                  ))}
                  {flight.facilities.length > 3 && (
                    <Badge
                      variant="outline"
                      className="text-xs border-gray-300"
                    >
                      +{flight.facilities.length - 3} more
                    </Badge>
                  )}
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 py-2 text-sm"
                  onClick={() => handleAddToItinerary(flight)}
                >
                  Add to Itinerary
                </Button>
              </div>

              {/* Desktop Layout */}
              <div className="hidden sm:block">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Plane className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {flight.airline}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {flight.flightNumber}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {flight.price}
                    </div>
                    <div className="text-sm text-gray-600">per person</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="text-center">
                    <div className="text-xl font-semibold">
                      {flight.departure.time}
                    </div>
                    <div className="text-sm text-gray-600">
                      {flight.departure.date}
                    </div>
                    <div className="text-sm font-medium">
                      {flight.departure.code}
                    </div>
                    <div className="text-xs text-gray-500">
                      {flight.departure.city}
                    </div>
                  </div>

                  <div className="flex-1 mx-8">
                    <div className="flex items-center justify-center mb-2">
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <div className="mx-4 flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {flight.duration}
                      </div>
                      <div className="flex-1 h-px bg-gray-300"></div>
                    </div>
                    <div className="text-center text-sm text-gray-600">
                      {flight.type}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-xl font-semibold">
                      {flight.arrival.time}
                    </div>
                    <div className="text-sm text-gray-600">
                      {flight.arrival.date}
                    </div>
                    <div className="text-sm font-medium">
                      {flight.arrival.code}
                    </div>
                    <div className="text-xs text-gray-500">
                      {flight.arrival.city}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
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
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-2"
                    onClick={() => handleAddToItinerary(flight)}
                  >
                    Add to Itinerary
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Loading State */}
      {searchMutation.isPending && (
        <div className="text-center py-8 sm:py-12">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 text-base sm:text-lg">
            Searching for flights...
          </p>
        </div>
      )}

      {/* No results message */}
      {searchResults.length === 0 && !searchMutation.isPending && (
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-500 text-base sm:text-lg">
            Search for flights to see results here
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Try searching for popular destinations like New York or Mumbai
          </p>
        </div>
      )}
    </div>
  )
}
