import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import apiClient from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ns_user')
    return saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(true)

  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('ns_refresh_token')
      await apiClient.post('/auth/logout', { refreshToken }).catch(() => {})
    } finally {
      localStorage.removeItem('ns_access_token')
      localStorage.removeItem('ns_refresh_token')
      localStorage.removeItem('ns_user')
      setUser(null)
    }
  }, [])

  // Listen for forced logouts from 401 refresh failures
  useEffect(() => {
    const handleForcedLogout = () => {
      setUser(null)
    }
    window.addEventListener('auth:logout', handleForcedLogout)
    return () => window.removeEventListener('auth:logout', handleForcedLogout)
  }, [])

  // Verify session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('ns_access_token')
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const { data } = await apiClient.get('/auth/me')
        setUser(data.user)
        localStorage.setItem('ns_user', JSON.stringify(data.user))
      } catch (err) {
        console.warn('Session verification failed:', err.message)
        // If offline or network error, keep cached user; if 401, interceptor will have logged out
        if (err.response?.status === 401) {
          logout()
        }
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [logout])

  const login = async (email, password) => {
    const { data } = await apiClient.post('/auth/login', { email, password })
    localStorage.setItem('ns_access_token', data.accessToken)
    localStorage.setItem('ns_refresh_token', data.refreshToken)
    localStorage.setItem('ns_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  const register = async (email, password, displayName, tagline) => {
    const { data } = await apiClient.post('/auth/register', {
      email,
      password,
      displayName,
      tagline,
    })
    localStorage.setItem('ns_access_token', data.accessToken)
    localStorage.setItem('ns_refresh_token', data.refreshToken)
    localStorage.setItem('ns_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  const changePassword = async (currentPassword, newPassword) => {
    const { data } = await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    })
    return data
  }

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    changePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
