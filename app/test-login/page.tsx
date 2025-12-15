'use client'

import { useState } from 'react'

export default function TestLoginPage() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testLogin = async (username: string, password: string) => {
    setLoading(true)
    setResult('')
    
    try {
      console.log('🔐 Testing login with:', { username, password })
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      
      console.log('📡 Response status:', response.status)
      
      const data = await response.json()
      console.log('📡 Response data:', data)
      
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      console.error('❌ Login test error:', error)
      setResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔐 Login Test Page</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-bold mb-4">Available Test Users:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border p-4 rounded">
              <h3 className="font-bold text-green-600">Admin User</h3>
              <p>Username: <code>admin</code></p>
              <p>Password: <code>admin123</code></p>
              <button 
                onClick={() => testLogin('admin', 'admin123')}
                disabled={loading}
                className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
              >
                Test Admin Login
              </button>
            </div>
            
            <div className="border p-4 rounded">
              <h3 className="font-bold text-blue-600">Broker User</h3>
              <p>Username: <code>broker1</code></p>
              <p>Password: <code>broker123</code></p>
              <button 
                onClick={() => testLogin('broker1', 'broker123')}
                disabled={loading}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                Test Broker Login
              </button>
            </div>
            
            <div className="border p-4 rounded">
              <h3 className="font-bold text-purple-600">Regular User</h3>
              <p>Username: <code>user1</code></p>
              <p>Password: <code>user123</code></p>
              <button 
                onClick={() => testLogin('user1', 'user123')}
                disabled={loading}
                className="mt-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-gray-400"
              >
                Test User Login
              </button>
            </div>
            
            <div className="border p-4 rounded">
              <h3 className="font-bold text-orange-600">Tedros Admin</h3>
              <p>Username: <code>tedros</code></p>
              <p>Password: <code>tedros123</code></p>
              <button 
                onClick={() => testLogin('tedros', 'tedros123')}
                disabled={loading}
                className="mt-2 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:bg-gray-400"
              >
                Test Tedros Login
              </button>
            </div>
          </div>
        </div>
        
        {loading && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
              Testing login...
            </div>
          </div>
        )}
        
        {result && (
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg">
            <h3 className="font-bold mb-2">API Response:</h3>
            <pre className="text-sm overflow-x-auto">{result}</pre>
          </div>
        )}
        
        <div className="mt-6">
          <a href="/login" className="text-blue-600 hover:text-blue-700">
            ← Back to Login Page
          </a>
        </div>
      </div>
    </div>
  )
}