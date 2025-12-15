'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { useAuth } from '../contexts/AuthContext'
import { 
  HomeIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

interface BrokerProperty {
  id: string
  title: string
  status: string
  price: number
  currency: string
  city: string
  area: string
  type: string
  created_at: string
}

export default function BrokerDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  
  const [properties, setProperties] = useState<BrokerProperty[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  })

  // Redirect if not authenticated or not a broker/admin
  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    
    // Only allow admin and broker roles to access broker functionality
    if (user?.role !== 'admin' && user?.role !== 'broker') {
      router.push('/')
      return
    }
    
    fetchBrokerData()
  }, [user])

  const fetchBrokerData = async () => {
    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/broker/properties', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (data.properties) {
        setProperties(data.properties)
        
        // Calculate stats
        const stats = data.properties.reduce((acc: any, prop: BrokerProperty) => {
          acc.total++
          if (prop.status === 'pending_payment' || prop.status === 'pending') {
            acc.pending++
          } else if (prop.status === 'approved') {
            acc.approved++
          } else if (prop.status === 'rejected') {
            acc.rejected++
          }
          return acc
        }, { total: 0, pending: 0, approved: 0, rejected: 0 })
        
        setStats(stats)
      }
    } catch (error) {
      console.error('Error fetching broker data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': 
      case 'pending_payment': 
        return 'text-yellow-600 bg-yellow-100'
      case 'approved': 
        return 'text-green-600 bg-green-100'
      case 'rejected': 
        return 'text-red-600 bg-red-100'
      case 'sold': 
        return 'text-blue-600 bg-blue-100'
      default: 
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
      case 'pending_payment':
        return <ClockIcon className="w-4 h-4" />
      case 'approved':
        return <CheckCircleIcon className="w-4 h-4" />
      case 'rejected':
        return <XCircleIcon className="w-4 h-4" />
      default:
        return <ClockIcon className="w-4 h-4" />
    }
  }

  if (!user || (user?.role !== 'admin' && user?.role !== 'broker')) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8 pb-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏢 Broker Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your property listings and track performance
          </p>
          
          {/* Broker Status Alert */}
          {user?.brokerStatus === 'pending' && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <div className="text-yellow-400 text-xl mr-3">⏳</div>
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">
                    Broker Account Pending Approval
                  </h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Your broker application is currently under review by our admin team. 
                    You can browse properties but cannot add new listings until approved.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {user?.brokerStatus === 'rejected' && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="text-red-400 text-xl mr-3">❌</div>
                <div>
                  <h3 className="text-sm font-medium text-red-800">
                    Broker Application Rejected
                  </h3>
                  <p className="text-sm text-red-700 mt-1">
                    Your broker application was not approved. Please contact support for more information.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {user?.brokerStatus === 'approved' && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <div className="text-green-400 text-xl mr-3">✅</div>
                <div>
                  <h3 className="text-sm font-medium text-green-800">
                    Broker Account Approved
                  </h3>
                  <p className="text-sm text-green-700 mt-1">
                    Congratulations! Your broker account is approved. You can now add and manage property listings.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <HomeIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircleIcon className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push('/broker/add-listing')}
              className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add New Property
            </button>
            
            <button
              onClick={() => window.open('https://wa.me/251911234567', '_blank')}
              className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              WhatsApp Support
            </button>
          </div>
        </div>

        {/* Properties List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              My Properties
            </h2>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ethiopian-green mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading properties...</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-8">
                <HomeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No properties yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start by adding your first property listing
                </p>
                <button
                  onClick={() => router.push('/broker/add-listing')}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Add Property
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {properties.map((property) => (
                  <div key={property.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{property.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {property.area}, {property.city} • {property.type.replace(/_/g, ' ')}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-lg font-bold text-green-600">
                            {new Intl.NumberFormat().format(property.price)} {property.currency}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(property.status)}`}>
                            {getStatusIcon(property.status)}
                            <span className="ml-1">{property.status.replace('_', ' ')}</span>
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Created: {new Date(property.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => router.push(`/property/${property.id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Property"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        
                        {(property.status === 'pending_payment' || property.status === 'rejected') && (
                          <button
                            onClick={() => router.push(`/edit-listing/${property.id}`)}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            title="Edit Property"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}