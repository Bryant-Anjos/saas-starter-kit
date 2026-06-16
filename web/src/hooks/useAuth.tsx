import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { useTranslation } from 'react-i18next'
import { api, type User, ApiError } from '../lib/api.js'

interface AuthContext {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  refetch: () => Promise<void>
}

const Ctx = createContext<AuthContext | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { i18n } = useTranslation()

  async function fetchUser() {
    try {
      const u = await api.me.get()
      setUser(u)
      if (u.language && i18n.language !== u.language) {
        await i18n.changeLanguage(u.language)
      }
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void fetchUser() }, [])

  async function signOut() {
    await api.auth.signOut()
    setUser(null)
  }

  return (
    <Ctx.Provider value={{ user, loading, signOut, refetch: fetchUser }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
