import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  login as authLogin,
  logout as authLogout,
  getUser,
  isAuthenticated,
  isAdmin,
} from '../lib/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Check for existing session on mount
    if (isAuthenticated()) {
      setUser(getUser())
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const { user: loggedInUser } = await authLogin(email, password)
    setUser(loggedInUser)

    // Redirect based on role
    if (loggedInUser.is_admin) {
      navigate('/admin')
    } else {
      navigate('/dashboard')
    }

    return loggedInUser
  }

  const logout = () => {
    authLogout()
    setUser(null)
    navigate('/login')
  }

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin(),
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
