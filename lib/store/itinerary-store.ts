import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Flight, Hotel, Activity } from "../types/travel"

type ItineraryStoreState = {
  flights: Flight[]
  hotels: Hotel[]
  activities: Activity[]
}

type ItineraryStoreActions = {
  addFlight: (flight: Flight) => void
  addHotel: (hotel: Hotel) => void
  addActivity: (activity: Activity) => void
  removeItem: (type: "flight" | "hotel" | "activity", id: string) => void
  clearItinerary: () => void
}

type ItineraryStore = ItineraryStoreState & ItineraryStoreActions

export const useItineraryStore = create<ItineraryStore>()(
  persist(
    (set) => ({
      flights: [
        {
          id: "1",
          airline: "American Airlines",
          flightNumber: "AA-924",
          departure: { time: "08:35", date: "Sun, 30 Aug", code: "LOS" },
          arrival: { time: "09:55", date: "Sun, 30 Aug", code: "SIN" },
          duration: "1h 20m",
          type: "Direct",
          price: "₦ 123,450.00",
          facilities: ["Baggage: 20kg", "Cabin baggage: Big", "In flight entertainment", "In flight meal", "USB Port"],
        },
        {
          id: "2",
          airline: "American Airlines",
          flightNumber: "AA-924",
          departure: { time: "08:35", date: "Sun, 30 Aug", code: "LOS" },
          arrival: { time: "09:55", date: "Sun, 30 Aug", code: "SIN" },
          duration: "1h 20m",
          type: "Direct",
          price: "₦ 123,450.00",
          facilities: ["Baggage: 20kg", "Cabin baggage: Big", "In flight entertainment", "In flight meal", "USB Port"],
        },
      ],
      hotels: [
        {
          id: "1",
          name: "Riviera Resort, Lekki",
          address: "18 Kenneth Agbakuru Street, Off Access Bank Admiralty Way, Lekki Phase1",
          rating: 4.5,
          reviews: 430,
          price: "₦ 123,450.00",
          originalPrice: "₦ 150,000",
          nights: "1 night x 1 night bed taxes",
          checkIn: "20-04-2024",
          checkOut: "23-04-2024",
          facilities: ["Pool", "Bar"],
          image: "/placeholder.svg?height=120&width=120&text=Hotel",
        },
        {
          id: "2",
          name: "Riviera Resort, Lekki",
          address: "18 Kenneth Agbakuru Street, Off Access Bank Admiralty Way, Lekki Phase1",
          rating: 4.5,
          reviews: 430,
          price: "₦ 123,450.00",
          originalPrice: "₦ 150,000",
          nights: "1 night x 1 night bed taxes",
          checkIn: "20-04-2024",
          checkOut: "23-04-2024",
          facilities: ["Pool", "Bar"],
          image: "/placeholder.svg?height=120&width=120&text=Hotel",
        },
      ],
      activities: [
        {
          id: "1",
          name: "The Museum of Modern Art",
          description:
            "Works from Van Gogh to Warhol & beyond plus a sculpture garden, 2 cafes & the modern restaurant.",
          rating: 4.5,
          reviews: 430,
          duration: "1 Hour",
          price: "₦ 123,450.00",
          note: "10:30 AM on Mar 19",
          included: "Admission to the Empire State Building",
          image: "/placeholder.svg?height=120&width=120&text=Museum",
        },
        {
          id: "2",
          name: "The Museum of Modern Art",
          description:
            "Works from Van Gogh to Warhol & beyond plus a sculpture garden, 2 cafes & the modern restaurant.",
          rating: 4.5,
          reviews: 430,
          duration: "1 Hour",
          price: "₦ 123,450.00",
          note: "10:30 AM on Mar 19",
          included: "Admission to the Empire State Building",
          image: "/placeholder.svg?height=120&width=120&text=Museum",
        },
        {
          id: "3",
          name: "The Museum of Modern Art",
          description:
            "Works from Van Gogh to Warhol & beyond plus a sculpture garden, 2 cafes & the modern restaurant.",
          rating: 4.5,
          reviews: 430,
          duration: "1 Hour",
          price: "₦ 123,450.00",
          note: "10:30 AM on Mar 19",
          included: "Admission to the Empire State Building",
          image: "/placeholder.svg?height=120&width=120&text=Museum",
        },
      ],
      addFlight: (flight) =>
        set((state) => ({
          flights: [...state.flights, flight],
        })),
      addHotel: (hotel) =>
        set((state) => ({
          hotels: [...state.hotels, hotel],
        })),
      addActivity: (activity) =>
        set((state) => ({
          activities: [...state.activities, activity],
        })),
      removeItem: (type, id) =>
        set((state) => ({
          ...state,
          [type === "flight" ? "flights" : type === "hotel" ? "hotels" : "activities"]: state[
            type === "flight" ? "flights" : type === "hotel" ? "hotels" : "activities"
          ].filter((item) => item.id !== id),
        })),
      clearItinerary: () =>
        set({
          flights: [],
          hotels: [],
          activities: [],
        }),
    }),
    {
      name: "itinerary-store",
      storage: {
        setItem: (name, value) => sessionStorage.setItem(name, JSON.stringify(value)),
        getItem: (name) => (sessionStorage.getItem(name) ? JSON.parse(sessionStorage.getItem(name)!) : null),
        removeItem: (name) => sessionStorage.removeItem(name),
      },
    },
  ),
)
