import axios, { AxiosError, HttpStatusCode } from 'axios'
import { toast } from 'react-toastify'
import type { AuthResponse } from '../types/auth.type'
import { clearLocalStorage, getAccesTokenFromLS, saveAccesTokenToLS, setProfileToLS } from './auth'
import path from '../constants/path'

const http = axios.create({
  baseURL: 'https://api-ecom.duthanhduoc.com/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

http.interceptors.request.use(
  function (config) {
    const access_token: string = getAccesTokenFromLS()
    if (access_token) {
      config.headers.Authorization = access_token
      return config
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

http.interceptors.response.use(
  function onFulfilled(response) {
    const { url } = response.config
    if (url === path.login || url == path.register) {
      const data = response.data as AuthResponse
      const access_token: string = data.data.access_token
      saveAccesTokenToLS(access_token)
      setProfileToLS(data.data.user)
    } else if (url === path.logout) {
      clearLocalStorage()
    }
    return response
  },
  function onRejected(error: AxiosError<string>) {
    if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
      const message = error.message
      toast(message)
    }

    return Promise.reject(error)
  }
)

export default http
