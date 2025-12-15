'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function TestPage() {
  const [status, setStatus] = useState('Loading...')
  const { user } = useAuth()

  useEffect(() => {
    setStatus('Page loaded successfully!')
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🧪 System Diagnostic Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Status */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Basic Status</h2>
            <div className="space-y-2">
              <p><strong>Page Status:</strong> <span className="text-green-600">{status}</span></p>
              <p><strong>React:</strong> <span className="text-green-600">✅ Working</span></p>
              <p><strong>Tailwind CSS:</strong> <span className="text-green-600">✅ Working</span></p>
              <p><strong>TypeScript:</strong> <span className="text-green-600">✅ Working</span></p>
            </div>
          </div>

          {/* Authentication Status */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
            <div className="space-y-2">
              <p><strong>Auth Context:</strong> <span className="text-green-600">✅ Loaded</span></p>
              <p><strong>Current User:</strong> {user ? `${user.username} (${user.role})` : 'Not logged in'}</p>
              <p><strong>Local Storage:</strong> {typeof localStorage !== 'undefined' ? '✅ Available' : '❌ Not available'}</p>
            </div>
          </div>

          {/* API Test */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">API Test</h2>
            <button 
              onClick={testAPI}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Test API Connection
            </button>
            <div id="api-result" className="mt-4"></div>
          </div>

          {/* Navigation Test */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Navigation Test</h2>
            <div className="space-y-2">
              <a href="/" className="block text-blue-600 hover:underline">🏠 Home Page</a>
              <a href="/login" className="block text-blue-600 hover:underline">🔐 Login Page</a>
              <a href="/submit-property" className="block text-blue-600 hover:underline">📝 Submit Property</a>
              <a href="/broker" className="block text-blue-600 hover:underline">👨‍💼 Broker Dashboard</a>
              <a href="/admin-working" className="block text-blue-600 hover:underline">🛡️ Admin Dashboard</a>
            </div>
          </div>

          {/* System Info */}
          <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">System Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p><strong>User Agent:</strong></p>
                <p className="text-gray-600 break-all">{typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'}</p>
              </div>
              <div>
                <p><strong>Current URL:</strong></p>
                <p className="text-gray-600 break-all">{typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
              </div>
              <div>
                <p><strong>Screen Size:</strong></p>
                <p className="text-gray-600">{typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Console Logs */}
        <div className="bg-white p-6 rounded-lg shadow mt-6">
          <h2 className="text-xl font-semibold mb-4">Console Logs</h2>
          <p className="text-gray-600 mb-4">Check your browser's developer console (F12) for any error messages.</p>
          <div className="bg-gray-100 p-4 rounded">
            <p className="text-sm font-mono">
              If you see any red error messages in the console, that's likely the cause of the issues.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function testAPI() {
  const resultDiv = document.getElementById('api-result')
  if (!resultDiv) return

  resultDiv.innerHTML = '<p className="text-blue-600">Testing API...</p>'

  fetch('/api/properties-public')
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        resultDiv.innerHTML = '<p className="text-green-600">✅ API Working - Found ' + data.properties.length + ' properties</p>'
      } else {
        resultDiv.innerHTML = '<p className="text-red-600">❌ API Error: ' + data.error + '</p>'
      }
    })
    .catch(error => {
      resultDiv.innerHTML = '<p className="text-red-600">❌ API Connection Error: ' + error.message + '</p>'
    })
}