import { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react'
import { SecureStorageAdapter } from '@/adapters/secure-storage-adapter'
import { createAuthService } from '@prosperium-it/shared'
import { http } from '@/lib/http'

const storage = new SecureStorageAdapter()
const authService = createAuthService(http)

interface AuthUser {
  id: number
  nome: string
  email: string
  roles: string[]
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function restore() {
      try {
        const token = await storage.get('auth_token')
        if (token) {
          const data = await storage.get('user_data')
          if (data) setUser(JSON.parse(data))
        }
      } finally {
        setIsLoading(false)
      }
    }
    restore()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password)
    const token = (response as Record<string, unknown>).access_token as string ?? (response as Record<string, unknown>).token as string
    const refreshToken = (response as Record<string, unknown>).refresh_token as string
    await storage.set('auth_token', token)
    if (refreshToken) await storage.set('refresh_token', refreshToken)
    const userData = (response as Record<string, unknown>).user
    if (userData) {
      await storage.set('user_data', JSON.stringify(userData))
      setUser(userData as AuthUser)
    }
  }

  const logout = async () => {
    const refreshToken = await storage.get('refresh_token')
    if (refreshToken) {
      await authService.logout(refreshToken).catch(() => {})
    }
    await storage.remove('auth_token')
    await storage.remove('refresh_token')
    await storage.remove('user_data')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
