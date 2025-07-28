import { type AxiosErrorShape, errorHandler } from "../config/axios-error"
import { authApi, publicApi } from "../config/axios-instance"
import type { ApiResponse } from "../types/api"
import type { LoginType, ResetPassword, SignUp, User } from "../types/auth"

class AuthService {
  async loginUser(data: LoginType) {
    try {
      const response = await publicApi.post<ApiResponse<{ access_token: string }>>("/authentication/sign-in", data)
      return response.data.data
    } catch (error) {
      errorHandler(error as AxiosErrorShape | string)
      throw error
    }
  }

  async requestForgotPasswordLink(credential: string) {
    try {
      await publicApi.post("/authentication/forgot-password", { credential })
    } catch (error) {
      errorHandler(error as AxiosErrorShape | string)
      throw error
    }
  }

  async resetPassword(body: ResetPassword) {
    try {
      await publicApi.post("/authentication/reset-password", body)
    } catch (error) {
      errorHandler(error as AxiosErrorShape | string)
      throw error
    }
  }

  async signUpUser(data: SignUp) {
    try {
      await publicApi.post("/authentication/sign-up", {
        ...data,
        college: data.college?._id,
        department: data.department?._id,
      })
    } catch (error) {
      errorHandler(error as AxiosErrorShape | string)
      throw error
    }
  }

  async getUser() {
    try {
      const response = await authApi.get<ApiResponse<User>>("/user")
      return response?.data?.data
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async logoutUser() {
    try {
      // Clear local storage/session storage
      sessionStorage.removeItem("user-store")
      // Optionally call logout endpoint if available
      // await authApi.post("/authentication/logout")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  isAuthenticated(): boolean {
    try {
      const userStore = sessionStorage.getItem("user-store")
      if (!userStore) return false

      const parsedStore = JSON.parse(userStore)
      return !!parsedStore.state?.accessToken
    } catch {
      return false
    }
  }

  getAccessToken(): string | null {
    try {
      const userStore = sessionStorage.getItem("user-store")
      if (!userStore) return null

      const parsedStore = JSON.parse(userStore)
      return parsedStore.state?.accessToken || null
    } catch {
      return null
    }
  }
}

export const authService = new AuthService()

// Legacy exports for backward compatibility
export const loginUser = authService.loginUser.bind(authService)
export const requestForgotPasswordLink = authService.requestForgotPasswordLink.bind(authService)
export const resetPassword = authService.resetPassword.bind(authService)
export const signUpUser = authService.signUpUser.bind(authService)
export const getUser = authService.getUser.bind(authService)
