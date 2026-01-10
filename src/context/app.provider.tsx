import { useState } from 'react'
import { initalAppContext, AppContext } from './app.context'
import type { User } from '../types/user.type'
import type { ExtendedPurchase } from '../types/purchases.type'

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initalAppContext.isAuthenticated)
  const [profile, setProfile] = useState<User | null>(initalAppContext.profile)
  const [extendedPurchases, setExtendedPurchases] = useState<ExtendedPurchase[]>(initalAppContext.extendedPurchases)

  const reset = () => {
    setIsAuthenticated(false)
    setExtendedPurchases([])
    setProfile(null)
  }
  return (
    <>
      <AppContext.Provider
        value={{
          isAuthenticated,
          setIsAuthenticated,
          profile,
          setProfile,
          extendedPurchases,
          setExtendedPurchases,
          reset
        }}
      >
        {children}
      </AppContext.Provider>
    </>
  )
}
