import { createContext, useContext, useState } from 'react'
import api from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('thyrosense-user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  async function login(email, password, role) {
    const res = await api.post('/auth/login', { email, password, role })
    const userData = res.data.user
    localStorage.setItem('thyrosense-user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  async function register(formData) {
    const res = await api.post('/auth/register', formData)
    const userData = res.data.user
    localStorage.setItem('thyrosense-user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  function logout() {
    localStorage.removeItem('thyrosense-user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
