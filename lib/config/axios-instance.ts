import axios from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com"

export const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export const authApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth token to requests
authApi.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("user-store")
    if (token) {
      const parsedToken = JSON.parse(token)
      if (parsedToken.state?.accessToken) {
        config.headers.Authorization = `Bearer ${parsedToken.state.accessToken}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Handle token expiration
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("user-store")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)
