'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '../components/Navigation'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  HomeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  UserIcon
} from '@heroicons/react/24/outline'

interface Property {
  id: string
  title: string
  price: number
  city: string
  area: string
  type: string
  size: number
  status: string
  owner_name: string
  owner_role: string
  whatsapp_number: string
  phone_number: string
  created_at: string
}

interface GuestSubmission {
  id: string
  property_id: string
  guest_name: string
  guest_phone: string
  guest_whatsapp: string
  title: string
  description: string
  price: number
  city: string
  area: string
  type: string
  property_status: string
  submission_date: string
}

export default function AdminWorkingDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const { t, language } = useLanguage()
  
  const [properties, setProperties] = useState<Property[]>([])
  const [guestSubmissions, setGuestSubmissions] = useState<GuestSubmission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'properties' | 'guests'>('properties')

  // Redirect if not admin
  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    
    if (user.role !== 'admin') {
      router.push('/')
      return
    }
    
    fetchProperties()
    fetchGuestSubmissions()
  }, [user, router])

  const fetchProperties = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/admin-working/properties', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setProperties(data.properties)
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchGuestSubmissions = async () => {
    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/admin/guest-submissions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setGuestSubmissions(data.submissions)
      }
    } catch (error) {
      console.error('Error fetching guest submissions:', error)
    }
  }

  const updatePropertyStatus = async (propertyId: string, status: string) => {
    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/admin-working/properties', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          propertyId,
          status,
          adminNotes: `${status} by admin`
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        fetchProperties()
        alert(`Property ${status} successfully!`)
      } else {
        alert(`Failed to ${status} property: ${data.error}`)
      }
    } catch (error) {
      console.error('Error updating property:', error)
      alert('Error updating property')
    }
  }

  const updateGuestSubmissionStatus = async (submissionId: string, propertyId: string, action: string, rejectionReason?: string) => {
    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/admin/guest-submissions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          submissionId,
          propertyId,
          action,
          rejectionReason,
          adminNotes: `${action} by admin`
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        fetchGuestSubmissions()
        fetchProperties()
        alert(`Guest submission ${action}d successfully!`)
      } else {
        alert(`Failed to ${action} guest submission: ${data.error}`)
      }
    } catch (error) {
      console.error('Error updating guest submission:', error)
      alert('Error updating guest submission')
    }
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 py-8 pb-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage property listings and guest submissions
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('properties')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'properties'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Broker Properties ({properties.length})
              </button>
              <button
                onClick={() => setActiveTab('guests')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'guests'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Guest Submissions ({guestSubmissions.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Broker Property Listings
              </h2>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading properties...</p>
                </div>
              ) : properties.length === 0 ? (
                <div className="text-center py-8">
                  <HomeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No properties yet</h3>
                  <p className="text-gray-600">Property listings will appear here for review</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {properties.map((property) => (
                    <div key={property.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{property.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {property.area}, {property.city} • {property.type}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-lg font-bold text-green-600">
                              {new Intl.NumberFormat().format(property.price)} ETB
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                              property.status === 'pending' ? 'text-yellow-600 bg-yellow-100' :
                              property.status === 'approved' ? 'text-green-600 bg-green-100' :
                              'text-red-600 bg-red-100'
                            }`}>
                              {property.status}
                            </span>
                          </div>
                        </div>
                        
                        {property.status === 'pending_payment' && (
                          <div className="ml-4 flex space-x-2">
                            <button
                              onClick={() => updatePropertyStatus(property.id, 'approved')}
                              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                              <CheckCircleIcon className="w-4 h-4 mr-2" />
                              Approve
                            </button>
                            <button
                              onClick={() => updatePropertyStatus(property.id, 'rejected')}
                              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                              <XCircleIcon className="w-4 h-4 mr-2" />
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Guest Submissions Tab */}
        {activeTab === 'guests' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Guest Property Submissions
              </h2>
            </div>
            <div className="p-6">
              {guestSubmissions.length === 0 ? (
                <div className="text-center py-8">
                  <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No guest submissions yet</h3>
                  <p className="text-gray-600">Guest property submissions will appear here for review</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {guestSubmissions.map((submission) => (
                    <div key={submission.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">{submission.title}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">
                                <strong>Guest:</strong> {submission.guest_name}
                              </p>
                              <p className="text-sm text-gray-600">
                                <strong>Phone:</strong> {submission.guest_phone}
                              </p>
                              <p className="text-sm text-gray-600">
                                <strong>WhatsApp:</strong> {submission.guest_whatsapp}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                <strong>Location:</strong> {submission.area}, {submission.city}
                              </p>
                              <p className="text-sm text-gray-600">
                                <strong>Price:</strong> {new Intl.NumberFormat().format(submission.price)} ETB
                              </p>
                              <p className="text-sm text-gray-600">
                                <strong>Status:</strong> {submission.property_status}
                              </p>
                            </div>
                          </div>
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Description:</p>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                              {submission.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="ml-6 flex flex-col space-y-2">
                          {submission.property_status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateGuestSubmissionStatus(submission.id, submission.property_id, 'approve')}
                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                              >
                                <CheckCircleIcon className="w-4 h-4 mr-2" />
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  const reason = prompt('Rejection reason:')
                                  if (reason) {
                                    updateGuestSubmissionStatus(submission.id, submission.property_id, 'reject', reason)
                                  }
                                }}
                                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                              >
                                <XCircleIcon className="w-4 h-4 mr-2" />
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => {
                              const message = encodeURIComponent(`Hello! Regarding your property: "${submission.title}". We are reviewing your listing.`)
                              window.open(`https://wa.me/${submission.guest_whatsapp.replace(/[\+\s-]/g, '')}?text=${message}`, '_blank')
                            }}
                            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                          >
                            Contact Guest
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}