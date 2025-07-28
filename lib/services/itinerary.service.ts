import { type AxiosErrorShape, errorHandler } from "../config/axios-error"
import { authApi } from "../config/axios-instance"
import type { ApiResponse } from "../types/api"
import type { Flight, Hotel, Activity } from "../types/travel"

class ItineraryService {
  async removeFromItinerary(data: { type: "flight" | "hotel" | "activity"; id: string }) {
    try {
      const response = await authApi.delete<ApiResponse<any>>(`/itinerary/${data.type}/${data.id}`)
      return response.data.data
    } catch (error) {
      errorHandler(error as AxiosErrorShape | string)
      throw error
    }
  }

  async getItinerary() {
    try {
      const response =
        await authApi.get<
          ApiResponse<{
            flights: Flight[]
            hotels: Hotel[]
            activities: Activity[]
          }>
        >("/itinerary")
      return response.data.data
    } catch (error) {
      errorHandler(error as AxiosErrorShape | string)
      throw error
    }
  }

  async addToItinerary(data: {
    type: "flight" | "hotel" | "activity"
    item: Flight | Hotel | Activity
  }) {
    try {
      const response = await authApi.post<ApiResponse<any>>(`/itinerary/${data.type}`, data.item)
      return response.data.data
    } catch (error) {
      errorHandler(error as AxiosErrorShape | string)
      throw error
    }
  }

  async updateItineraryItem(data: {
    type: "flight" | "hotel" | "activity"
    id: string
    updates: Partial<Flight | Hotel | Activity>
  }) {
    try {
      const response = await authApi.patch<ApiResponse<any>>(`/itinerary/${data.type}/${data.id}`, data.updates)
      return response.data.data
    } catch (error) {
      errorHandler(error as AxiosErrorShape | string)
      throw error
    }
  }

  async clearItinerary() {
    try {
      const response = await authApi.delete<ApiResponse<any>>("/itinerary")
      return response.data.data
    } catch (error) {
      errorHandler(error as AxiosErrorShape | string)
      throw error
    }
  }

  async shareItinerary(email: string) {
    try {
      const response = await authApi.post<ApiResponse<any>>("/itinerary/share", { email })
      return response.data.data
    } catch (error) {
      errorHandler(error as AxiosErrorShape | string)
      throw error
    }
  }

  async exportItinerary(format: "pdf" | "json" | "csv" = "pdf") {
    try {
      const response = await authApi.get<Blob>(`/itinerary/export?format=${format}`, {
        responseType: "blob",
      })
      return response.data
    } catch (error) {
      errorHandler(error as AxiosErrorShape | string)
      throw error
    }
  }

  // Utility methods for itinerary management
  calculateTotalCost(flights: Flight[], hotels: Hotel[], activities: Activity[]): number {
    const extractPrice = (priceString: string): number => {
      const match = priceString.match(/[\d,]+\.?\d*/)
      return match ? Number.parseFloat(match[0].replace(/,/g, "")) : 0
    }

    const flightTotal = flights.reduce((sum, flight) => sum + extractPrice(flight.price), 0)
    const hotelTotal = hotels.reduce((sum, hotel) => sum + extractPrice(hotel.price), 0)
    const activityTotal = activities.reduce((sum, activity) => sum + extractPrice(activity.price), 0)

    return flightTotal + hotelTotal + activityTotal
  }

  validateItinerary(
    flights: Flight[],
    hotels: Hotel[],
    activities: Activity[],
  ): {
    isValid: boolean
    warnings: string[]
    errors: string[]
  } {
    const warnings: string[] = []
    const errors: string[] = []

    // Check for date conflicts
    const dates = [
      ...flights.map((f) => ({ type: "flight", date: f.departure.date, item: f })),
      ...hotels.map((h) => ({ type: "hotel", date: h.checkIn, item: h })),
      ...activities.map((a) => ({ type: "activity", date: a.note, item: a })),
    ]

    // Add more validation logic as needed
    if (flights.length === 0 && hotels.length === 0 && activities.length === 0) {
      warnings.push("Your itinerary is empty")
    }

    return {
      isValid: errors.length === 0,
      warnings,
      errors,
    }
  }
}

export const itineraryService = new ItineraryService()

// Legacy exports for backward compatibility
export const removeFromItinerary = itineraryService.removeFromItinerary.bind(itineraryService)
export const getItinerary = itineraryService.getItinerary.bind(itineraryService)
