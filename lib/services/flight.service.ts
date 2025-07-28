import { API_CONFIG, createApiHeaders } from "../config/api-config"
import type { FlightSearchParams, FlightDestination, FlightApiResponse, FlightOffer } from "../types/api"
import type { Flight } from "../types/travel"

class FlightService {
  private baseUrl = API_CONFIG.FLIGHT_API.BASE_URL
  private headers = createApiHeaders(API_CONFIG.FLIGHT_API.HOST)

  async searchDestinations(query: string): Promise<FlightDestination[]> {
    try {
      const url = `${this.baseUrl}/api/v1/flights/searchAirport?query=${encodeURIComponent(query)}`

      const response = await fetch(url, {
        method: "GET",
        headers: this.headers,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data?.status && data?.data) {
        return data.data.map((item: any) => ({
          id: item.skyId || item.entityId,
          name: item.presentation?.title || item.name,
          code: item.iata || item.skyId,
          cityName: item.presentation?.subtitle?.split(",")[0] || item.cityName || "",
          countryName: item.presentation?.subtitle?.split(",")[1]?.trim() || item.countryName || "",
        }))
      }

      return []
    } catch (error) {
      console.error("Error searching flight destinations:", error)
      return []
    }
  }

  async searchFlights(params: FlightSearchParams): Promise<Flight[]> {
    try {
      const searchParams = {
        originSkyId: params.origin,
        destinationSkyId: params.destination,
        originEntityId: params.origin,
        destinationEntityId: params.destination,
        date: params.departureDate,
        returnDate: params.returnDate,
        adults: params.passengers,
        cabinClass: params.cabinClass || "economy",
        currency: API_CONFIG.DEFAULTS.CURRENCY,
        market: API_CONFIG.DEFAULTS.MARKET,
        countryCode: API_CONFIG.DEFAULTS.COUNTRY_CODE,
      }

      const queryString = new URLSearchParams(
        Object.entries(searchParams)
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => [key, String(value)]),
      ).toString()

      const url = `${this.baseUrl}/api/v2/flights/searchFlights?${queryString}`

      const response = await fetch(url, {
        method: "GET",
        headers: this.headers,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: FlightApiResponse = await response.json()

      if (data?.status && data?.data?.itineraries) {
        return data.data.itineraries.map(this.transformFlightData)
      }

      return this.getFallbackFlights(params)
    } catch (error) {
      console.error("Error searching flights:", error)
      return this.getFallbackFlights(params)
    }
  }

  async getFlightDetails(token: string, currencyCode = API_CONFIG.DEFAULTS.CURRENCY): Promise<Flight | null> {
    try {
      const url = `${this.baseUrl}/api/v1/flights/getFlightDetails?token=${token}&currency_code=${currencyCode}`

      const response = await fetch(url, {
        method: "GET",
        headers: this.headers,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.status && data.data) {
        return this.transformFlightOfferData(data.data)
      }

      return null
    } catch (error) {
      console.error("Error getting flight details:", error)
      return null
    }
  }

  private transformFlightData = (itinerary: any): Flight => {
    const leg = itinerary.legs[0]
    const segments = leg.segments || []
    const firstSegment = segments[0] || {}

    return {
      id: itinerary.id || `flight_${Date.now()}_${Math.random()}`,
      airline: firstSegment.marketingCarrier?.name || "Unknown Airline",
      flightNumber: firstSegment.flightNumber || "N/A",
      departure: {
        time: new Date(leg.departure).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: new Date(leg.departure).toLocaleDateString(),
        code: leg.origin?.displayCode || "",
        city: leg.origin?.name || "",
      },
      arrival: {
        time: new Date(leg.arrival).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: new Date(leg.arrival).toLocaleDateString(),
        code: leg.destination?.displayCode || "",
        city: leg.destination?.name || "",
      },
      duration: `${Math.floor(leg.durationInMinutes / 60)}h ${leg.durationInMinutes % 60}m`,
      type: leg.stopCount === 0 ? "Direct" : `${leg.stopCount} Stop${leg.stopCount > 1 ? "s" : ""}`,
      price: `$${itinerary.price?.formatted || "N/A"}`,
      facilities: ["Baggage included", "Seat selection", "In-flight service"],
    }
  }

  private transformFlightOfferData = (apiOffer: FlightOffer): Flight => {
    const firstSegment = apiOffer.segments[0]
    const lastSegment = apiOffer.segments[apiOffer.segments.length - 1]

    // Calculate total duration
    const totalDuration = apiOffer.segments.reduce((total: number, segment: any) => {
      return total + (segment.totalTime || 0)
    }, 0)

    // Format duration from seconds to hours and minutes
    const formatDuration = (seconds: number) => {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      return `${hours}h ${minutes}m`
    }

    // Get airline info from first leg
    const firstLeg = firstSegment.legs[0]
    const airlineData = firstLeg.carriersData[0]

    // Determine flight type
    const stops = firstSegment.legs.length > 1 ? `${firstSegment.legs.length - 1} stop` : "Direct"

    // Format price
    const price = `$${Math.round(apiOffer.priceBreakdown.total.units * 1.5).toLocaleString()}.00`

    // Extract facilities from luggage allowances
    const facilities = [
      `Baggage: ${firstSegment.travellerCheckedLuggage[0]?.luggageAllowance?.maxWeightPerPiece || 20}kg`,
      `Cabin baggage: ${firstSegment.travellerCabinLuggage[0]?.luggageAllowance?.maxWeightPerPiece || 7}kg`,
      "In flight entertainment",
      "In flight meal",
      "USB Port",
    ]

    return {
      id: apiOffer.token || `flight_${Date.now()}`,
      airline: airlineData.name,
      flightNumber: `${airlineData.code}-${firstLeg.flightInfo.flightNumber}`,
      departure: {
        time: new Date(firstSegment.departureTime).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        date: new Date(firstSegment.departureTime).toLocaleDateString("en-US", {
          weekday: "short",
          day: "2-digit",
          month: "short",
        }),
        code: firstSegment.departureAirport.code,
        city: firstSegment.departureAirport.cityName,
      },
      arrival: {
        time: new Date(lastSegment.arrivalTime).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        date: new Date(lastSegment.arrivalTime).toLocaleDateString("en-US", {
          weekday: "short",
          day: "2-digit",
          month: "short",
        }),
        code: lastSegment.arrivalAirport.code,
        city: lastSegment.arrivalAirport.cityName,
      },
      duration: formatDuration(totalDuration),
      type: stops,
      price: price,
      facilities: facilities,
    }
  }

  private getFallbackFlights = (params: FlightSearchParams): Flight[] => {
    return [
      {
        id: "1",
        airline: "American Airlines",
        flightNumber: "AA-924",
        departure: { time: "08:35", date: "Sun, 30 Aug", code: params.origin.toUpperCase(), city: params.origin },
        arrival: {
          time: "09:55",
          date: "Sun, 30 Aug",
          code: params.destination.toUpperCase(),
          city: params.destination,
        },
        duration: "1h 20m",
        type: "Direct",
        price: "$450.00",
        facilities: ["Baggage: 20kg", "Cabin baggage: 8kg", "In flight entertainment", "In flight meal", "USB Port"],
      },
      {
        id: "2",
        airline: "Emirates",
        flightNumber: "EK-783",
        departure: { time: "14:20", date: "Sun, 30 Aug", code: params.origin.toUpperCase(), city: params.origin },
        arrival: {
          time: "16:45",
          date: "Sun, 30 Aug",
          code: params.destination.toUpperCase(),
          city: params.destination,
        },
        duration: "2h 25m",
        type: "Direct",
        price: "$675.00",
        facilities: ["Baggage: 30kg", "Cabin baggage: 8kg", "In flight entertainment", "In flight meal", "WiFi"],
      },
    ]
  }
}

export const flightService = new FlightService()
