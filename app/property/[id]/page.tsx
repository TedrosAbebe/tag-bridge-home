'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'


import { Property } from '../../types'
import { 
  MapPinIcon, 
  HomeIcon,
  PhoneIcon,
  HeartIcon,
  ArrowLeftIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()

  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const propertyId = params.id as string
    if (propertyId) {
      fetchProperty(propertyId)
    }
  }, [params.id])

  const fetchProperty = async (id: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/property/${id}`)
      const data = await response.json()
      
      if (data.property) {
        const prop = data.property
        const convertedProperty: Property = {
          id: prop.id,
          title: prop.title,
          description: prop.description,
          price: prop.price,
          currency: prop.currency as 'ETB' | 'USD',
          location: {
            city: prop.city,
            area: prop.area
          },
          type: prop.type as Property['type'],
          bedrooms: prop.bedrooms,
          bathrooms: prop.bathrooms,
          size: prop.size,
          images: prop.images || ['/api/placeholder/400/300'],
          features: prop.features || [],
          status: prop.status as Property['status'],
          ownerId: 'owner-' + prop.id,
          createdAt: new Date(prop.created_at),
          updatedAt: new Date(prop.created_at),
          whatsappNumber: prop.whatsapp_number,
          phoneNumber: prop.phone_number
        }
        setProperty(convertedProperty)
      }
    } catch (error) {
      console.error('Error fetching property:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US').format(price) + ' ' + currency
  }

  const openWhatsApp = (number: string, propertyTitle: string) => {
    // Clean the number (remove + and any spaces)
    const cleanNumber = number.replace(/[\+\s-]/g, '')
    const message = encodeURIComponent(
      `Hello, I'm interested in the property: ${propertyTitle}. Can you provide more details about the location, availability, and viewing schedule?`
    )
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank')
  }

  const makeCall = (number: string) => {
    window.open(`tel:${number}`, '_self')
  }

  const nextImage = () => {
    if (property) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (property) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      )
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading property details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <HomeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Property not found</h3>
            <p className="text-gray-600 mb-4">The property you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 py-8 pb-24">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Image Gallery */}
          <div className="relative h-96 bg-gray-200">
            {property.images.length > 0 ? (
              <>
                {property.images[currentImageIndex].startsWith('data:') ? (
                  <img
                    src={property.images[currentImageIndex]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={property.images[currentImageIndex]}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                )}
                
                {/* Image Navigation */}
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                    >
                      ←
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                    >
                      →
                    </button>
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {property.images.length}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <HomeIcon className="w-24 h-24 text-gray-400" />
              </div>
            )}

            {/* Favorite Button */}
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="absolute top-4 right-4 p-3 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
            >
              {isFavorite ? (
                <HeartSolidIcon className="w-6 h-6 text-red-500" />
              ) : (
                <HeartIcon className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>

          {/* Property Details */}
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {property.title}
                </h1>

                <div className="flex items-center text-gray-600 mb-4">
                  <MapPinIcon className="w-5 h-5 mr-2" />
                  <span className="text-lg">
                    {property.location.area}, {property.location.city}
                  </span>
                </div>

                <div className="flex items-center mb-6">
                  <CurrencyDollarIcon className="w-6 h-6 text-green-600 mr-2" />
                  <span className="text-3xl font-bold text-green-600">
                    {formatPrice(property.price, property.currency)}
                  </span>
                </div>

                {/* Property Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {property.bedrooms && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                      <div className="text-sm text-gray-600">Bedrooms</div>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                      <div className="text-sm text-gray-600">Bathrooms</div>
                    </div>
                  )}
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{property.size}</div>
                    <div className="text-sm text-gray-600">m²</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-green-600">{property.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                    <div className="text-xs text-gray-600">Type</div>
                  </div>
                </div>

                {/* Description */}
                {property.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{property.description}</p>
                  </div>
                )}

                {/* Features */}
                {property.features.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {property.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Section */}
              <div className="lg:w-80">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Property Owner</h3>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => openWhatsApp(property.whatsappNumber, property.title)}
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                      <span className="font-medium">WhatsApp Message</span>
                    </button>
                    
                    <button
                      onClick={() => makeCall(property.phoneNumber)}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <PhoneIcon className="w-5 h-5" />
                      <span className="font-medium">Call Broker</span>
                    </button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Phone:</strong> {property.phoneNumber}</p>
                      <p><strong>WhatsApp:</strong> {property.whatsappNumber}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                      Property ID: {property.id}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}