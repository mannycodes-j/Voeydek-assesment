import { flightService } from "./flight.service"
import { hotelService } from "./hotel.service"
import { activityService } from "./activity.service"
import type { FlightSearchParams, HotelSearchParams, ActivitySearchParams } from "../types/api"
import type { Flight, Hotel, Activity } from "../types/travel"

// Unified travel service that orchestrates all travel-related operations
class TravelService {
  // Flight operations
  async searchFlightDestinations(query: string) {
    return flightService.searchDestinations(query)
  }

  async searchFlights(params: FlightSearchParams): Promise<Flight[]> {
    return flightService.searchFlights(params)
  }

  async getFlightDetails(token: string, currencyCode?: string) {
    return flightService.getFlightDetails(token, currencyCode)
  }

  // Hotel operations
  async getHotelFilters(params: {
    dest_id: string
    search_type: string
    adults: number
    children_age?: string
    room_qty: number
  }) {
    return hotelService.getFilters(params)
  }

  async getHotelSortOptions(params: {
    dest_id: string
    search_type: string
    adults: number
    children_age?: string
    room_qty: number
  }) {
    return hotelService.getSortOptions(params)
  }

  async searchHotels(params: HotelSearchParams): Promise<Hotel[]> {
    return hotelService.searchHotels(params)
  }

  async getHotelDetails(params: {
    hotel_id: string
    adults: number
    children_age?: string
    room_qty: number
    units?: string
    temperature_unit?: string
    languagecode?: string
    currency_code?: string
  }) {
    return hotelService.getHotelDetails(params)
  }

  // Activity operations
  async searchActivities(params: ActivitySearchParams): Promise<Activity[]> {
    return activityService.searchActivities(params)
  }

  async getActivityDetails(activityId: string) {
    return activityService.getActivityDetails(activityId)
  }

  async getActivityCategories() {
    return activityService.getActivityCategories()
  }

  // Utility methods
  validateSearchParams(type: "flight" | "hotel" | "activity", params: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    switch (type) {
      case "flight":
        if (!params.origin) errors.push("Origin is required")
        if (!params.destination) errors.push("Destination is required")
        if (!params.departureDate) errors.push("Departure date is required")
        if (params.passengers < 1) errors.push("At least 1 passenger is required")
        break

      case "hotel":
        if (!params.destination) errors.push("Destination is required")
        if (!params.checkIn) errors.push("Check-in date is required")
        if (!params.checkOut) errors.push("Check-out date is required")
        if (params.guests < 1) errors.push("At least 1 guest is required")
        if (params.rooms < 1) errors.push("At least 1 room is required")
        break

      case "activity":
        if (!params.destination) errors.push("Destination is required")
        if (!params.date) errors.push("Date is required")
        if (params.participants < 1) errors.push("At least 1 participant is required")
        break
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  formatPrice(amount: number, currency = "USD"): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  calculateDuration(startTime: string, endTime: string): string {
    const start = new Date(startTime)
    const end = new Date(endTime)
    const diffMs = end.getTime() - start.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    return `${diffHours}h ${diffMinutes}m`
  }
}

export const travelService = new TravelService()

// Legacy exports for backward compatibility
export const searchFlights = travelService.searchFlights.bind(travelService)
export const searchHotels = travelService.searchHotels.bind(travelService)
export const searchActivities = travelService.searchActivities.bind(travelService)
