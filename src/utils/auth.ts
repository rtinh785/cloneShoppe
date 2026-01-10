import type { User } from '../types/user.type'

export const LocalStorageEvenTarget = new EventTarget()

export const saveAccesTokenToLS = (acces_token: string) => {
  localStorage.setItem('access_token', acces_token)
}

export const clearLocalStorage = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('profile')
  const clearLSEvent = new Event('clearLSEvent')
  LocalStorageEvenTarget.dispatchEvent(clearLSEvent)
}

export const getAccesTokenFromLS = () => localStorage.getItem('access_token') || ''

export const getProfileFromLS = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}

export const setProfileToLS = (profile: User) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}
