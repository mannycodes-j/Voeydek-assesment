// API Configuration
export const API_CONFIG = {
  RAPIDAPI_KEY: process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "d9761f26femsh8bf09d2897b3921p1195a0jsne1e1711a5ae6",

  // Hotel API (Booking.com)
  HOTEL_API: {
    BASE_URL: "https://booking-com15.p.rapidapi.com",
    HOST: "booking-com15.p.rapidapi.com",
  },

  // Flight API (Sky Scrapper)
  FLIGHT_API: {
    BASE_URL: "https://sky-scrapper.p.rapidapi.com",
    HOST: "sky-scrapper.p.rapidapi.com",
  },

  // Activities API (placeholder for future integration)
  ACTIVITY_API: {
    BASE_URL: "https://activities-api.example.com",
    HOST: "activities-api.example.com",
  },

  // Default parameters
  DEFAULTS: {
    CURRENCY: "USD",
    LANGUAGE: "en-us",
    COUNTRY_CODE: "US",
    MARKET: "en-US",
    UNITS: "metric",
    TEMPERATURE_UNIT: "c",
  },
}

// API Headers factory
export const createApiHeaders = (host: string) => ({
  "X-RapidAPI-Key": API_CONFIG.RAPIDAPI_KEY,
  "X-RapidAPI-Host": host,
  "Content-Type": "application/json",
})
