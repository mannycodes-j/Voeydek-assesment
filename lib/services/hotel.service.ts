import { API_CONFIG, createApiHeaders } from "../config/api-config"
import type {
  HotelSearchParams,
  HotelFilter,
  HotelSortOption,
  HotelDetails,
  HotelApiResponse,
  HotelProperty,
} from "../types/api"
import type { Hotel } from "../types/travel"

class HotelService {
  private baseUrl = API_CONFIG.HOTEL_API.BASE_URL
  private headers = createApiHeaders(API_CONFIG.HOTEL_API.HOST)

  async getFilters(params: {
    dest_id: string
    search_type: string
    adults: number
    children_age?: string
    room_qty: number
  }): Promise<HotelFilter[]> {
    try {
      const queryParams = new URLSearchParams({
        dest_id: params.dest_id,
        search_type: params.search_type,
        adults: params.adults.toString(),
        room_qty: params.room_qty.toString(),
      })

      if (params.children_age) {
        queryParams.append("children_age", params.children_age)
      }

      const url = `${this.baseUrl}/api/v1/hotels/getFilter?${queryParams.toString()}`

      const response = await fetch(url, {
        method: "GET",
        headers: this.headers,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.status && data.data?.filters) {
        return data.data.filters.map((filter: any) => ({
          title: filter.title,
          field: filter.field,
          filterStyle: filter.filterStyle,
          options: filter.options || [],
          min: filter.min,
          max: filter.max,
          minPriceStep: filter.minPriceStep,
          currency: filter.currency,
        }))
      }

      return []
    } catch (error) {
      console.error("Error getting hotel filters:", error)
      return []
    }
  }

  async getSortOptions(params: {
    dest_id: string
    search_type: string
    adults: number
    children_age?: string
    room_qty: number
  }): Promise<HotelSortOption[]> {
    try {
      const queryParams = new URLSearchParams({
        dest_id: params.dest_id,
        search_type: params.search_type,
        adults: params.adults.toString(),
        room_qty: params.room_qty.toString(),
      })

      if (params.children_age) {
        queryParams.append("children_age", params.children_age)
      }

      const url = `${this.baseUrl}/api/v1/hotels/getSortBy?${queryParams.toString()}`

      const response = await fetch(url, {
        method: "GET",
        headers: this.headers,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.status && data.data) {
        return data.data.map((option: any) => ({
          id: option.id,
          title: option.title,
        }))
      }

      return []
    } catch (error) {
      console.error("Error getting hotel sort options:", error)
      return []
    }
  }

  async searchHotels(params: HotelSearchParams): Promise<Hotel[]> {
    try {
      const searchParams: any = {
        dest_id: "-2092174", // Mumbai default - should be dynamic based on destination
        search_type: "CITY",
        adults: params.guests.toString(),
        room_qty: params.rooms.toString(),
        page_number: params.pageNumber?.toString() || "1",
        units: API_CONFIG.DEFAULTS.UNITS,
        temperature_unit: API_CONFIG.DEFAULTS.TEMPERATURE_UNIT,
        languagecode: API_CONFIG.DEFAULTS.LANGUAGE,
        currency_code: API_CONFIG.DEFAULTS.CURRENCY,
        arrival_date: params.checkIn,
        departure_date: params.checkOut,
      }

      // Add sorting if specified
      if (params.sortBy) {
        searchParams.order_by = params.sortBy
      }

      // Add filters if specified
      if (params.filters && params.filters.length > 0) {
        searchParams.categories_filter = params.filters.join(",")
      }

      // Add price range if specified
      if (params.priceMin !== undefined && params.priceMax !== undefined) {
        searchParams.price_filter_currencycode = API_CONFIG.DEFAULTS.CURRENCY
        searchParams.nflt = `price-${API_CONFIG.DEFAULTS.CURRENCY}-${params.priceMin}-${params.priceMax}-1`
      }

      const queryString = new URLSearchParams(searchParams).toString()
      const url = `${this.baseUrl}/api/v1/hotels/searchHotels?${queryString}`

      const response = await fetch(url, {
        method: "GET",
        headers: this.headers,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: HotelApiResponse = await response.json()

      if (data.status && data.data?.hotels) {
        return data.data.hotels.map(this.transformHotelData)
      }

      return this.getFallbackHotels(params)
    } catch (error) {
      console.error("Error searching hotels:", error)
      return this.getFallbackHotels(params)
    }
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
  }): Promise<HotelDetails | null> {
    try {
      const queryParams = new URLSearchParams({
        hotel_id: params.hotel_id,
        adults: params.adults.toString(),
        room_qty: params.room_qty.toString(),
        units: params.units || API_CONFIG.DEFAULTS.UNITS,
        temperature_unit: params.temperature_unit || API_CONFIG.DEFAULTS.TEMPERATURE_UNIT,
        languagecode: params.languagecode || API_CONFIG.DEFAULTS.LANGUAGE,
        currency_code: params.currency_code || API_CONFIG.DEFAULTS.CURRENCY,
      })

      if (params.children_age) {
        queryParams.append("children_age", params.children_age)
      }

      const url = `${this.baseUrl}/api/v1/hotels/getHotelDetails?${queryParams.toString()}`

      const response = await fetch(url, {
        method: "GET",
        headers: this.headers,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.status && data.data) {
        return this.transformHotelDetails(data.data)
      }

      return null
    } catch (error) {
      console.error("Error getting hotel details:", error)
      return null
    }
  }

  private transformHotelData = (apiHotel: HotelProperty): Hotel => {
    const property = apiHotel.property
    return {
      id: property.id.toString(),
      name: property.name,
      address: `${property.city || ""}, ${property.countryCode || ""}`.trim().replace(/^,|,$/, ""),
      rating: property.reviewScore ? property.reviewScore / 2 : property.accuratePropertyClass || 0,
      reviews: property.reviewCount || 0,
      price: property.priceBreakdown?.grossPrice
        ? `$${Math.round(property.priceBreakdown.grossPrice.value)}`
        : "Price not available",
      originalPrice: property.priceBreakdown?.strikethroughPrice
        ? `$${Math.round(property.priceBreakdown.strikethroughPrice.value)}`
        : undefined,
      nights: "1 night",
      checkIn: property.checkinDate || "",
      checkOut: property.checkoutDate || "",
      facilities: ["WiFi", "Parking", "Room Service"],
      roomType: "Standard Room",
      image: property.photoUrls?.[0] || "/placeholder.svg?height=120&width=120&text=Hotel",
    }
  }

  private transformHotelDetails = (hotel: any): HotelDetails => {
    // Transform facilities
    const facilities =
      hotel.facilities_block?.facilities?.map((facility: any) => ({
        name: facility.name,
        icon: facility.icon,
      })) || []

    // Transform photos
    const photos = hotel.rooms
      ? (() => {
          const roomObj = Object.values(hotel.rooms)[0];
          if (roomObj && typeof roomObj === "object" && "photos" in roomObj && Array.isArray((roomObj as any).photos)) {
            return (roomObj as any).photos.map((photo: any) => ({
              url_max300: photo.url_max300,
              url_max750: photo.url_max750,
              url_original: photo.url_original,
            }));
          }
          return [];
        })()
      : []

    // Transform room types
    const room_types = hotel.rooms
      ? Object.entries(hotel.rooms).map(([roomId, room]: [string, any]) => ({
          name: room.description || "Standard Room",
          description: room.description || "",
          facilities: room.facilities?.map((f: any) => f.name) || [],
          bed_configurations: room.bed_configurations || [],
        }))
      : []

    return {
      hotel_id: hotel.hotel_id,
      hotel_name: hotel.hotel_name,
      address: hotel.address,
      city: hotel.city,
      country: hotel.country_trans || hotel.countrycode,
      latitude: hotel.latitude,
      longitude: hotel.longitude,
      review_score: hotel.review_nr > 0 ? (hotel.review_score || 0) / 2 : undefined,
      review_nr: hotel.review_nr,
      star_rating: hotel.property_class,
      facilities,
      photos,
      price_breakdown: {
        gross_amount: {
          value: hotel.product_price_breakdown?.gross_amount?.value || 0,
          currency: hotel.product_price_breakdown?.gross_amount?.currency || API_CONFIG.DEFAULTS.CURRENCY,
        },
        excluded_amount: hotel.product_price_breakdown?.excluded_amount,
      },
      room_types,
    }
  }

  private getFallbackHotels = (params: HotelSearchParams): Hotel[] => {
    return [
      {
        id: "1",
        name: "Riviera Resort, Lekki",
        address: "18 Kenneth Agbakuru Street, Off Access Bank Admiralty Way, Lekki Phase1",
        rating: 4.5,
        reviews: 430,
        price: "$150.00",
        originalPrice: "$200.00",
        nights: "1 night x 1 room incl. taxes",
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        facilities: ["Pool", "WiFi", "Parking", "Restaurant", "Spa", "Gym"],
        image: "/placeholder.svg?height=200&width=300&text=Hotel+Resort",
        roomType: "Deluxe King Room",
      },
      {
        id: "2",
        name: "Lagos Continental Hotel",
        address: "52A Kofo Abayomi Street, Victoria Island, Lagos",
        rating: 4.2,
        reviews: 287,
        price: "$120.00",
        originalPrice: "$150.00",
        nights: "1 night x 1 room incl. taxes",
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        facilities: ["WiFi", "Restaurant", "Bar", "Conference Room", "Laundry"],
        image: "/placeholder.svg?height=200&width=300&text=Continental+Hotel",
        roomType: "Standard Double Room",
      },
    ]
  }
}

export const hotelService = new HotelService()
