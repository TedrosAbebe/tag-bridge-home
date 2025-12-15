'use client'

import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Link from 'next/link'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (data.success) {
        setMessage(`✅ Login successful! Welcome ${data.user.username} (${data.user.role})`)
        
        // Use AuthContext login method
        setTimeout(() => {
          login(data.user.username, data.user.role, data.token, data.user.id)
        }, 1000)
      } else {
        setMessage(`❌ Login failed: ${data.message || data.error || 'Unknown error'}`)
      }
    } catch (error) {
      setMessage(`❌ Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src="/tagbridge-logo.svg" alt="Tag Bridge Home" className="w-12 h-12 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">
              Tag Bridge Home
            </h1>
          </div>
          <p className="text-gray-600">የኢትዮጵያ የቤት ደላላ</p>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
            } text-white`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${
            message.includes('✅') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}



        <div className="mt-6 text-center">
          <Link href="/" className="text-green-600 hover:text-green-700 text-sm font-medium">
            ← Back to Home
          </Link>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-600 text-center mb-4">
            Don't have an account? Choose your registration type:
          </p>
          
          <div className="space-y-3">
            <Link 
              href="/register-broker" 
              className="w-full flex items-center justify-center px-4 py-3 border border-blue-300 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors font-medium"
            >
              <span className="mr-2">👨‍💼</span>
              Register as Broker
            </Link>
            
            <Link 
              href="/register-advertiser" 
              className="w-full flex items-center justify-center px-4 py-3 border border-purple-300 rounded-lg text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors font-medium"
            >
              <span className="mr-2">📢</span>
              Register as Advertiser
            </Link>
            
            <Link 
              href="/register" 
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors text-sm"
            >
              <span className="mr-2">👤</span>
              Regular User Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}