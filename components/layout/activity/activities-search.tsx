'use client'

import { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  ArrowUpDown,
  MapPin,
  Calendar,
  Users,
  Star,
  Clock,
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
import { useMutation } from '@tanstack/react-query'
import { travelService } from '@/lib/services'
import { useItineraryStore } from '@/lib/store/itinerary-store'
import { toast } from 'sonner'
import type { Activity } from '@/lib/types/travel'
import type { ActivitySearchParams } from '@/lib/types/api'

export function ActivitiesSearch() {
  const [searchParams, setSearchParams] = useState<ActivitySearchParams>({
    destination: '',
    date: '',
    participants: 2,
    category: 'all',
  })

  const [searchResults, setSearchResults] = useState<Activity[]>([])
  const { addActivity } = useItineraryStore()

  const searchMutation = useMutation({
    mutationFn: travelService.searchActivities,
    onSuccess: (data) => {
      setSearchResults(data)
      toast.success(`Found ${data.length} activities`)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to search activities')
    },
  })

  const handleSearch = () => {
    const validation = travelService.validateSearchParams(
      'activity',
      searchParams
    )

    if (!validation.isValid) {
      toast.error(validation.errors[0])
      return
    }

    // Validate date
    const activityDate = new Date(searchParams.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (activityDate < today) {
      toast.error('Activity date cannot be in the past')
      return
    }

    searchMutation.mutate(searchParams)
  }

  const handleAddToItinerary = (activity: Activity) => {
    const activityWithId = {
      ...activity,
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }

    addActivity(activityWithId)
    toast.success('Activity added to itinerary!')
  }

  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([])

  // Fetch categories on mount
  useEffect(() => {
    travelService.getActivityCategories().then(setCategories)
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-0">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">
          Search Activities
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          Discover amazing experiences and activities for your trip
        </p>
      </div>

      {/* Search Form */}
      <Card className="mb-6 sm:mb-8 border-gray-200">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div>
              <label className="block text-sm font-semibold mb-2 sm:mb-3 text-gray-900">
                Destination
              </label>
              <div className="relative">
                <Input
                  placeholder="Where do you want to explore?"
                  value={searchParams.destination}
                  onChange={(e) =>
                    setSearchParams((prev) => ({
                      ...prev,
                      destination: e.target.value,
                    }))
                  }
                  className="h-10 sm:h-12 pl-8 sm:pl-10 text-sm sm:text-base"
                />
                <MapPin className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 sm:mb-3 text-gray-900">
                Date
              </label>
              <div className="relative">
                <Input
                  type="date"
                  value={searchParams.date}
                  onChange={(e) =>
                    setSearchParams((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                  className="h-10 sm:h-12 pl-8 sm:pl-10 text-sm sm:text-base"
                  min={new Date().toISOString().split('T')[0]}
                />
                <Calendar className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 sm:mb-3 text-gray-900">
                Participants
              </label>
              <div className="relative">
                <Select
                  value={searchParams.participants.toString()}
                  onValueChange={(value) =>
                    setSearchParams((prev) => ({
                      ...prev,
                      participants: Number.parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger className="h-10 sm:h-12 pl-8 sm:pl-10 text-sm sm:text-base">
                    <SelectValue placeholder="2 People" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Person</SelectItem>
                    <SelectItem value="2">2 People</SelectItem>
                    <SelectItem value="3">3 People</SelectItem>
                    <SelectItem value="4">4 People</SelectItem>
                    <SelectItem value="5">5+ People</SelectItem>
                  </SelectContent>
                </Select>
                <Users className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 sm:mb-3 text-gray-900">
                Category
              </label>
              <Select
                value={searchParams.category}
                onValueChange={(value) =>
                  setSearchParams((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger className="h-10 sm:h-12 text-sm sm:text-base">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              className="bg-blue-600 hover:bg-blue-700 px-6 sm:px-8 py-2 sm:py-3 h-10 sm:h-12 text-sm sm:text-base w-full sm:w-auto"
              onClick={handleSearch}
              disabled={searchMutation.isPending}
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              {searchMutation.isPending ? 'Searching...' : 'Search Activities'}
            </Button>
            <Button
              variant="outline"
              className="px-6 sm:px-8 py-2 sm:py-3 h-10 sm:h-12 bg-transparent text-sm sm:text-base w-full sm:w-auto"
            >
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      {searchResults.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-3">
          <h2 className="text-xl sm:text-2xl font-semibold">
            Available Activities ({searchResults.length})
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

      {/* Activity Results */}
      <div className="space-y-4 sm:space-y-6">
        {searchResults.map((activity) => (
          <Card
            key={activity.id}
            className="hover:shadow-lg transition-shadow border-gray-200"
          >
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row">
                {/* Activity Image */}
                <div className="w-full lg:w-80 h-48 sm:h-56 lg:h-64 flex-shrink-0">
                  <img
                    src={activity.image || '/placeholder.svg'}
                    alt={activity.name}
                    className="w-full h-full object-cover rounded-t-lg lg:rounded-l-lg lg:rounded-t-none"
                  />
                </div>

                {/* Activity Details */}
                <div className="flex-1 p-4 sm:p-6 lg:p-8">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">
                        {activity.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                i < Math.floor(activity.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs sm:text-sm text-gray-600">
                          {activity.rating} ({activity.reviews} reviews)
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs sm:text-sm mb-4">
                        {activity.description}
                      </p>
                    </div>
                    <div className="text-left lg:text-right">
                      <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-1 sm:mb-2">
                        {activity.price}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                        per person
                      </div>
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 px-4 sm:px-6 py-2 text-sm w-full lg:w-auto"
                        onClick={() => handleAddToItinerary(activity)}
                      >
                        Add to Itinerary
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                      <span className="text-xs sm:text-sm text-gray-600">
                        {activity.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                      <span className="text-xs sm:text-sm text-gray-600">
                        {activity.location}
                      </span>
                    </div>
                    {activity.category && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 text-xs"
                      >
                        {activity.category}
                      </Badge>
                    )}
                  </div>

                  {activity.note && (
                    <div className="mb-4">
                      <span className="text-xs sm:text-sm font-medium text-gray-900">
                        Next available:{' '}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-600">
                        {activity.note}
                      </span>
                    </div>
                  )}

                  <div className="mb-4">
                    <span className="text-xs sm:text-sm font-medium text-gray-900">
                      Included:{' '}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-600">
                      {activity.included}
                    </span>
                  </div>

                  {activity.highlights && activity.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {activity.highlights
                        .slice(0, 4)
                        .map((highlight, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs border-gray-300"
                          >
                            {highlight}
                          </Badge>
                        ))}
                      {activity.highlights.length > 4 && (
                        <Badge
                          variant="outline"
                          className="text-xs border-gray-300"
                        >
                          +{activity.highlights.length - 4} more
                        </Badge>
                      )}
                    </div>
                  )}
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
            Searching for activities...
          </p>
        </div>
      )}

      {/* No results message */}
      {searchResults.length === 0 && !searchMutation.isPending && (
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-500 text-base sm:text-lg">
            Search for activities to see results here
          </p>
          <p className="text-gray-400 text-xs sm:text-sm mt-2">
            Try searching for popular destinations and experiences
          </p>
        </div>
      )}
    </div>
  )
}
