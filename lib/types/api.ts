// API Response Types
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Flight API Types
export interface FlightSearchParams {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  passengers: number
  cabinClass?: string
}

export interface FlightDestination {
  id: string
  name: string
  code: string
  cityName: string
  countryName: string
  type?: 'AIRPORT' | 'CITY'
  regionName?: string
  country?: string
  photoUri?: string
}

export interface FlightApiResponse {
  status: boolean
  data: {
    itineraries?: FlightItinerary[]
    flightOffers?: FlightOffer[]
  }
}

export interface FlightItinerary {
  id: string
  legs: FlightLeg[]
  price: {
    formatted: string
    value: number
  }
}

export interface FlightLeg {
  departure: string
  arrival: string
  origin: FlightAirport
  destination: FlightAirport
  durationInMinutes: number
  stopCount: number
  segments: FlightSegment[]
}

export interface FlightSegment {
  marketingCarrier: {
    name: string
    code: string
  }
  flightNumber: string
}

export interface FlightAirport {
  code: string
  cityName: string
  displayCode: string
  name: string
}

export interface FlightOffer {
  token: string
  segments: FlightOfferSegment[]
  priceBreakdown: {
    total: {
      units: number
    }
  }
}

export interface FlightOfferSegment {
  departureTime: string
  arrivalTime: string
  departureAirport: FlightAirport
  arrivalAirport: FlightAirport
  legs: FlightOfferLeg[]
  travellerCheckedLuggage: Array<{
    luggageAllowance: {
      maxWeightPerPiece: number
    }
  }>
  travellerCabinLuggage: Array<{
    luggageAllowance: {
      maxWeightPerPiece: number
    }
  }>
}

export interface FlightOfferLeg {
  carriersData: Array<{
    name: string
    code: string
  }>
  flightInfo: {
    flightNumber: string
  }
}

// Hotel API Types
export interface HotelSearchParams {
  destination: string
  checkIn: string
  checkOut: string
  guests: number
  rooms: number
  sortBy?: string
  filters?: string[]
  priceMin?: number
  priceMax?: number
  starRating?: number[]
  propertyTypes?: string[]
  facilities?: string[]
  pageNumber?: number
}

export interface HotelFilter {
  title: string
  field: string
  filterStyle: 'CHECKBOX' | 'SLIDER' | 'SWITCH'
  options: Array<{
    title: string
    genericId: string
    countNotAutoextended: number
  }>
  min?: string
  max?: string
  minPriceStep?: string
  currency?: string
}

export interface HotelSortOption {
  id: string
  title: string
}

export interface HotelApiResponse {
  status: boolean
  data: {
    hotels?: HotelProperty[]
    filters?: HotelFilter[]
  }
}

export interface HotelProperty {
  property: {
    id: number
    name: string
    wishlistName?: string
    reviewScore?: number
    reviewCount?: number
    accuratePropertyClass?: number
    priceBreakdown?: {
      grossPrice?: {
        value: number
        currency: string
      }
      strikethroughPrice?: {
        value: number
        currency: string
      }
    }
    photoUrls?: string[]
    city?: string
    countryCode?: string
    checkinDate?: string
    checkoutDate?: string
  }
}

export interface HotelDetails {
  hotel_id: number
  hotel_name: string
  address: string
  city: string
  country: string
  latitude: number
  longitude: number
  review_score?: number
  review_nr: number
  star_rating?: number
  facilities: Array<{
    name: string
    icon: string
  }>
  photos: Array<{
    url_max300: string
    url_max750: string
    url_original: string
  }>
  price_breakdown: {
    gross_amount: {
      value: number
      currency: string
    }
    excluded_amount?: {
      value: number
      currency: string
    }
  }
  room_types: Array<{
    name: string
    description: string
    facilities: string[]
    bed_configurations: Array<{
      bed_types: Array<{
        name: string
        count: number
        description: string
      }>
    }>
  }>
}

// Activity API Types
export interface ActivitySearchParams {
  destination: string
  date: string
  participants: number
  category?: string
}

export interface ActivityApiResponse {
  status: boolean
  data: ActivityItem[]
}

export interface ActivityItem {
  id: string
  name: string
  description: string
  location: string
  rating: number
  reviews: number
  duration: string
  price: string
  category: string
  image: string
  highlights: string[]
  included: string
}
