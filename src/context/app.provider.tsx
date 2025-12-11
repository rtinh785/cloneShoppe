import { useState } from 'react'
import { initalAppContext, AppContext } from './app.context'
import type { User } from '../types/user.type'

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initalAppContext.isAuthenticated)
  const [profile, setProfile] = useState<User | null>(initalAppContext.profile)
  return (
    <>
      <AppContext.Provider
        value={{
          isAuthenticated,
          setIsAuthenticated,
          profile,
          setProfile
        }}
      >
        {children}
      </AppContext.Provider>
    </>
  )
}
