"use client"

import { useState } from 'react'

export default function TestLiveLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
      
      const data = await response.json()
      setResult({
        status: response.status,
        success: data.success,
        message: data.message,
        user: data.user,
        hasToken: !!data.token,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      setResult({
        error: error.message,
        timestamp: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  const testCredentials = [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'broker1', password: 'broker123', role: 'broker' },
    { username: 'user1', password: 'user123', role: 'user' },
    { username: 'tedros', password: '494841', role: 'admin' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            🔐 Live Login Test - Tag Bridge Home
          </h1>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Login Form */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Test Login</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter username"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter password"
                />
              </div>
              
              <button
                onClick={testLogin}
                disabled={loading || !username || !password}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Testing...' : 'Test Login'}
              </button>
            </div>
            
            {/* Test Credentials */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Available Test Accounts</h2>
              
              <div className="space-y-2">
                {testCredentials.map((cred, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-900">{cred.username}</div>
                        <div className="text-sm text-gray-600">Role: {cred.role}</div>
                        <div className="text-xs text-gray-500">Password: {cred.password}</div>
                      </div>
                      <button
                        onClick={() => {
                          setUsername(cred.username)
                          setPassword(cred.password)
                        }}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Use
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Results */}
          {result && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Test Result</h3>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
          
          {/* Environment Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Environment Info</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <div>Current URL: {typeof window !== 'undefined' ? window.location.href : 'Server-side'}</div>
              <div>Environment: {process.env.NODE_ENV}</div>
              <div>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configured' : 'Not configured'}</div>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-md">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Instructions</h3>
            <div className="text-sm text-yellow-700 space-y-2">
              <p>1. Test login on localhost:3000 first</p>
              <p>2. Deploy to Vercel and test on live site</p>
              <p>3. Compare results - they should be identical</p>
              <p>4. If live site fails, check Vercel environment variables</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}