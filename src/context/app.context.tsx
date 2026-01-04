import { createContext } from 'react'
import { getAccesTokenFromLS, getProfileFromLS } from '../utils/auth'
import type { User } from '../types/user.type'
import type { ExtendedPurchase } from '../types/purchases.type'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
  extendedPurchases: ExtendedPurchase[]
  setExtendedPurchases: React.Dispatch<React.SetStateAction<ExtendedPurchase[]>>
}

export const initalAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccesTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  extendedPurchases: [],
  setExtendedPurchases: () => null
}

export const AppContext = createContext<AppContextInterface>(initalAppContext)
