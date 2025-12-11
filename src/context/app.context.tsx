import { createContext } from 'react'
import { getAccesTokenFromLS, getProfileFromLS } from '../utils/auth'
import type { User } from '../types/user.type'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
}

export const initalAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccesTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null
}

export const AppContext = createContext<AppContextInterface>(initalAppContext)
