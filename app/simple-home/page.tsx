'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Property {
  id: string
  title: string
  price: number
  city: string
  area: string
  status: string
}

export default function SimpleHomePage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/properties-public')
      const data = await response.json()
      
      if (data.success) {
        setProperties(data.properties)
      } else {
        setError(data.error || 'Failed to load properties')
      }
    } catch (err) {
      setError('Network error: ' + (err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Navigation */}
      <nav className="bg-white shadow-sm border-b p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Ethiopia Home Broker</h1>
          <div className="flex space-x-4">
            <Link href="/simple-home" className="text-blue-600 hover:underline">Home</Link>
            <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
            <Link href="/submit-property" className="text-blue-600 hover:underline">Submit Property</Link>
            <Link href="/test-page" className="text-blue-600 hover:underline">Test Page</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Properties</h2>
          <p className="text-gray-600">Browse approved property listings</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading properties...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">Error: {error}</p>
            <button 
              onClick={fetchProperties}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Properties List */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 text-lg">No properties available</p>
                <Link 
                  href="/submit-property"
                  className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                  Submit Your Property
                </Link>
              </div>
            ) : (
              properties.map((property) => (
                <div key={property.id} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
                  <p className="text-gray-600 mb-2">{property.area}, {property.city}</p>
                  <p className="text-2xl font-bold text-green-600 mb-4">
                    {new Intl.NumberFormat().format(property.price)} ETB
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      property.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {property.status}
                    </span>
                    <Link 
                      href={`/property/${property.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Debug Info */}
        <div className="mt-12 bg-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Debug Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Properties Count:</strong> {properties.length}</p>
              <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
              <p><strong>Error:</strong> {error || 'None'}</p>
            </div>
            <div>
              <p><strong>API Endpoint:</strong> /api/properties-public</p>
              <p><strong>Page Status:</strong> Loaded</p>
              <p><strong>React:</strong> Working</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}