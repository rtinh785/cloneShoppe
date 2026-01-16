import axios, { AxiosError, HttpStatusCode, type InternalAxiosRequestConfig } from 'axios'
import { toast } from 'react-toastify'
import type { AuthResponse, RefreshTokenRespone } from '../types/auth.type'
import {
  clearLocalStorage,
  getAccesTokenFromLS,
  getRefreshTokenFromLS,
  saveAccesTokenToLS,
  saveRefreshTokenToLS,
  setProfileToLS
} from './auth'

import config from '../constants/config'
import { URL_LOGIN, URL_REFRESH_TOKEN, URL_REGISTER, URL_LOGOUT } from '../apis/auth.api'
import { isAxiosExpiredTokenRerror, isAxiosUnauthorizedError } from './utils'
import type { ErroResponse } from '../types/utils.type'

let refreshTokenRequest: Promise<string> | null = null

const http = axios.create({
  baseURL: config.baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'expire-access-token': 10,
    'expire-refresh-token': 60 * 60
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
    if (url === URL_LOGIN || url == URL_REGISTER) {
      const data = response.data as AuthResponse
      const access_token: string = data.data.access_token
      const refresh_token: string = data.data.refresh_token
      saveAccesTokenToLS(access_token)
      saveRefreshTokenToLS(refresh_token)
      setProfileToLS(data.data.user)
    } else if (url === URL_LOGOUT) {
      clearLocalStorage()
    }
    return response
  },

  function onRejected(error: AxiosError<string>) {
    // not 402 and 401
    console.log(error)
    if (![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status as number)) {
      const message = error.message
      toast.error(message)
    }

    const config = error.response?.config || ({ headers: {} } as InternalAxiosRequestConfig)
    const { url } = config

    // 401
    if (isAxiosUnauthorizedError<ErroResponse<{ name: string; messasge: string }>>(error)) {
      if (isAxiosExpiredTokenRerror(error) && url !== URL_REFRESH_TOKEN) {
        refreshTokenRequest =
          refreshTokenRequest !== null
            ? refreshTokenRequest
            : handleReFreshToken().finally(() => {
                setTimeout(() => {
                  refreshTokenRequest = null
                }, 1000)
              })

        return refreshTokenRequest.then((access_token) => {
          return http({ ...config, headers: { ...config.headers, Authorization: access_token } })
        })
      }
      clearLocalStorage()
      toast.error(error.response?.data.data?.messasge || error.response?.data.message)
    }

    return Promise.reject(error)
  }
)

const handleReFreshToken = () => {
  const refresh_token = getRefreshTokenFromLS()
  return http
    .post<RefreshTokenRespone>(URL_REFRESH_TOKEN, {
      refresh_token: refresh_token
    })
    .then((res) => {
      const { access_token } = res.data.data
      saveAccesTokenToLS(access_token)
      return access_token
    })
    .catch((error) => {
      clearLocalStorage()
      throw error
    })
}

export default http
