"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User as AppUser } from '../types'

// Extend the shared `User` type with optional runtime fields used in UI
type User = AppUser & {
  brokerStatus?: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, role: string, token: string, id: string) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        console.log('✅ User restored from localStorage:', parsedUser.username)
      } catch (error) {
        console.error('❌ Error parsing stored user data:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    
    setIsLoading(false)
  }, [])

  const login = (username: string, role: string, token: string, id: string) => {
    const userData: User = {
      id,
      username,
      role: role as 'admin' | 'broker' | 'user' | 'advertiser'
    }
    
    setUser(userData)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    
    console.log('✅ User logged in:', userData)
    
    // Check if user has a language preference
    const preferredLanguage = localStorage.getItem('preferred-language')
    
    if (preferredLanguage) {
      // User has already selected a language, redirect to appropriate dashboard
      if (role === 'admin') {
        router.push('/admin-working')
      } else if (role === 'broker') {
        router.push('/broker')
      } else if (role === 'advertiser') {
        router.push('/advertiser')
      } else {
        router.push('/dashboard')
      }
    } else {
      // First time login or no language preference, show language selection
      router.push('/language-selection')
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    console.log('✅ User logged out')
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}