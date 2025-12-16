import path from '../constants/path'
import type { AuthResponse } from '../types/auth.type'
import http from '../utils/http'

const authApi = {
  registerAccount(body: { email: string; password: string }) {
    return http.post<AuthResponse>(path.register, body)
  },
  loginAccount(body: { email: string; password: string }) {
    return http.post<AuthResponse>(path.login, body)
  },
  logoutAccount() {
    return http.post(path.logout)
  }
}

export default authApi
