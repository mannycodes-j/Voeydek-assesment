import { toast } from "sonner"

export interface AxiosErrorShape {
  response?: {
    data?: {
      message?: string
      error?: string
    }
    status?: number
  }
  message?: string
}

export const errorHandler = (error: AxiosErrorShape | string) => {
  let errorMessage = "An unexpected error occurred"

  if (typeof error === "string") {
    errorMessage = error
  } else if (error.response?.data?.message) {
    errorMessage = error.response.data.message
  } else if (error.response?.data?.error) {
    errorMessage = error.response.data.error
  } else if (error.message) {
    errorMessage = error.message
  }

  toast.error(errorMessage)
  console.error("API Error:", error)
}
