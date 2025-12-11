import path from '../constants/path'
import type { AuthResponse } from '../types/auth.type'
import http from '../utils/http'

export const registerAccount = (body: { email: string; password: string }) => {
  return http.post<AuthResponse>(path.register, body)
}

export const loginAccount = (body: { email: string; password: string }) => {
  return http.post<AuthResponse>(path.login, body)
}

export const logoutAccount = () => {
  return http.post(path.logout)
}
