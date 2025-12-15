'use client'

import { useState, useEffect } from 'react'
import Navigation from './components/Navigation'
import { useAuth } from './contexts/AuthContext'

interface SimpleProperty {
  id: string
  title: string
  price: number
  city: string
  area: string
  status: string
}

export default function SimpleHomePage() {
  const { user } = useAuth()
  const [properties, setProperties] = useState<SimpleProperty[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/properties-public')
      const data = await response.json()
      
      if (data.success && data.properties) {
        setProperties(data.properties)
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 py-8 pb-24">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Ethiopia Home Broker
          </h1>
          <p className="text-gray-600">
            Find your dream property in Ethiopia
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-4">Properties will appear here once approved</p>
            <a
              href="/submit-property"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Submit Your Property
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
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
                  <a 
                    href={`/property/${property.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View Details
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}