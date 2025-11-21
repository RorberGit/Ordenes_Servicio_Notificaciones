import type { UserContext } from '@/types/auth'

const LOCAL_STORAGE_KEY = 'auth_user_data'

export const authService = {
  getAccessToken: () => localStorage.getItem('access_token'),
  getRefreshToken: () => localStorage.getItem('refresh_token'),
  setTokens: (access: string, refresh?: string) => {
    localStorage.setItem('access_token', access)
    if (refresh) localStorage.setItem('refresh_token', refresh)
  },
  getUser: () => {
    const userData = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (userData) return JSON.parse(userData)
  },
  setUser: (user: UserContext) => localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user)),
  clear: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem(LOCAL_STORAGE_KEY)
  },
}
