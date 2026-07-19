import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import * as authLib from './auth'
import type { User } from './auth'
import { supabase } from './supabase'

type AuthContextType = {
  user: User | null
  loading: boolean
  register: (name: string, email: string, password: string, adminCode?: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authLib.currentUser().then((u) => {
      setUser(u)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange(async () => {
      const u = await authLib.currentUser()
      setUser(u)
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  async function register(name: string, email: string, password: string, adminCode?: string) {
    const u = await authLib.register(name, email, password, adminCode)
    setUser(u)
  }

  async function login(email: string, password: string) {
    const u = await authLib.login(email, password)
    setUser(u)
  }

  async function logout() {
    await authLib.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
