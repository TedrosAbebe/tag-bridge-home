"use client"

import { useState } from 'react'

export default function AdminTest() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const testAPI = async (endpoint: string, method: string = 'GET', body?: any) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
      
      if (body) {
        options.body = JSON.stringify(body)
      }
      
      const response = await fetch(endpoint, options)
      const data = await response.json()
      
      setResults(prev => ({
        ...prev,
        [endpoint]: {
          status: response.status,
          success: response.ok,
          data: data,
          timestamp: new Date().toISOString()
        }
      }))
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [endpoint]: {
          status: 'ERROR',
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        }
      }))
    } finally {
      setLoading(false)
    }
  }

  const testEndpoints = [
    { name: 'Admin Properties', endpoint: '/api/admin-working/properties', method: 'GET' },
    { name: 'Admin Users', endpoint: '/api/admin/users', method: 'GET' },
    { name: 'Guest Submissions', endpoint: '/api/admin/guest-submissions', method: 'GET' },
    { name: 'Broker Applications', endpoint: '/api/admin/broker-applications', method: 'GET' },
    { name: 'Advertiser Applications', endpoint: '/api/admin/advertiser-applications', method: 'GET' },
    { name: 'Payments', endpoint: '/api/admin/payments', method: 'GET' },
    { name: 'Banners', endpoint: '/api/admin/banners', method: 'GET' }
  ]

  const createTestUser = () => {
    testAPI('/api/admin/manage-users', 'POST', {
      username: 'testuser' + Date.now(),
      password: 'test123',
      role: 'user'
    })
  }

  const initDatabase = () => {
    testAPI('/api/admin/init-database', 'POST')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            🛠️ Admin Functionality Test
          </h1>
          
          {/* Quick Actions */}
          <div className="mb-6 space-y-3">
            <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={initDatabase}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                🗄️ Initialize Database
              </button>
              <button
                onClick={createTestUser}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                👤 Create Test User
              </button>
            </div>
          </div>
          
          {/* API Tests */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">API Endpoint Tests</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {testEndpoints.map((test) => (
                <button
                  key={test.endpoint}
                  onClick={() => testAPI(test.endpoint, test.method)}
                  disabled={loading}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm"
                >
                  {test.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Results */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Test Results</h2>
            {Object.keys(results).length === 0 ? (
              <p className="text-gray-600">No tests run yet. Click buttons above to test functionality.</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(results).map(([endpoint, result]: [string, any]) => (
                  <div key={endpoint} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{endpoint}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          result.success 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {result.success ? '✅ Success' : '❌ Failed'}
                        </span>
                        <span className="text-xs text-gray-500">
                          Status: {result.status}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded p-3 overflow-auto">
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                        {JSON.stringify(result.data || result.error, null, 2)}
                      </pre>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {result.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Instructions</h3>
            <div className="text-sm text-blue-700 space-y-2">
              <p>1. First login as admin (tedros / 494841)</p>
              <p>2. Click "Initialize Database" to set up tables</p>
              <p>3. Test each API endpoint to verify functionality</p>
              <p>4. Check results for any errors or issues</p>
              <p>5. If all tests pass, admin functionality is working</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}