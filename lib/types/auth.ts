export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  role: string
  college?: {
    _id: string
    name: string
  }
  department?: {
    _id: string
    name: string
  }
}

export interface LoginType {
  email: string
  password: string
}

export interface SignUp {
  firstName: string
  lastName: string
  email: string
  password: string
  college?: {
    _id: string
    name: string
  }
  department?: {
    _id: string
    name: string
  }
}

export interface ResetPassword {
  token: string
  password: string
  confirmPassword: string
}
