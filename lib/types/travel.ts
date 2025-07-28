export interface Flight {
  id: string
  airline: string
  flightNumber: string
  departure: {
    time: string
    date: string
    code: string
    city?: string
  }
  arrival: {
    time: string
    date: string
    code: string
    city?: string
  }
  duration: string
  type: string
  price: string
  facilities: string[]
  notes?: string
}

export interface Hotel {
  id: string
  name: string
  address: string
  rating: number
  reviews: number
  price: string
  originalPrice?: string
  nights: string
  checkIn: string
  checkOut: string
  facilities: string[]
  roomType?: string
  image?: string
  notes?: string
}

export interface Activity {
  id: string
  name: string
  description: string
  rating: number
  reviews: number
  duration: string
  price: string
  note: string
  included: string
  category?: string
  location?: string
  highlights?: string[]
  image?: string
  notes?: string
}

// Form Data Types
export interface FlightFormData {
  airline: string
  flightNumber: string
  departureTime: string
  departureDate: string
  departureCode: string
  departureCity: string
  arrivalTime: string
  arrivalDate: string
  arrivalCode: string
  arrivalCity: string
  duration: string
  type: string
  price: string
  facilities: string[]
  notes: string
}

export interface HotelFormData {
  name: string
  address: string
  rating: number
  reviews: number
  price: string
  originalPrice: string
  nights: string
  checkIn: string
  checkOut: string
  facilities: string[]
  roomType: string
  image: string
  notes: string
}

export interface ActivityFormData {
  name: string
  description: string
  rating: number
  reviews: number
  duration: string
  price: string
  note: string
  included: string
  category: string
  location: string
  date: string
  time: string
  highlights: string[]
  image: string
  notes: string
}
