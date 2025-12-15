'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Property } from '../types'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  HeartIcon, 
  MapPinIcon, 
  HomeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

interface PropertyCardProps {
  property: Property
  isFavorite?: boolean
  onToggleFavorite?: (propertyId: string) => void
}

export default function PropertyCard({ 
  property, 
  isFavorite = false, 
  onToggleFavorite 
}: PropertyCardProps) {
  const { t, language } = useLanguage()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Debug logging
  if (property.title === 'Beautiful House with Photo Gallery' || property.title === 'what') {
    console.log(`🏠 PropertyCard for "${property.title}":`, {
      id: property.id,
      hasImages: property.images && property.images.length > 0,
      imageCount: property.images?.length || 0,
      firstImage: property.images?.[0]?.substring(0, 80),
      isBase64: property.images?.[0]?.startsWith('data:'),
      fullImagesArray: property.images
    })
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US').format(price) + ' ' + currency
  }

  const getPropertyTypeLabel = (type: Property['type']) => {
    return t(type)
  }

  const openWhatsApp = (number: string, propertyTitle: string) => {
    // Clean the number (remove + and any spaces)
    const cleanNumber = number.replace(/[\+\s-]/g, '')
    const message = encodeURIComponent(
      `Hello, I'm interested in the property: ${propertyTitle}. Can you provide more details?`
    )
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank')
  }

  const makeCall = (number: string) => {
    window.open(`tel:${number}`, '_self')
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    )
  }

  return (
    <div className="card overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image Carousel */}
      <div className="relative h-48 bg-gray-200">
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
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
                >
                  ←
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
                >
                  →
                </button>
                
                {/* Image Indicators */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {property.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <HomeIcon className="w-12 h-12 text-gray-400" />
          </div>
        )}

        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            onClick={() => onToggleFavorite(property.id)}
            className="absolute top-2 right-2 p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
          >
            {isFavorite ? (
              <HeartSolidIcon className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        )}

        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            property.status === 'approved' ? 'bg-green-100 text-green-800' :
            property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            property.status === 'sold' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {t(property.status)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className={`font-semibold text-gray-900 line-clamp-2 ${
            language === 'am' ? 'amharic' : ''
          }`}>
            {property.title}
          </h3>
          <span className="text-sm font-medium text-ethiopian-green bg-green-50 px-2 py-1 rounded">
            {getPropertyTypeLabel(property.type)}
          </span>
        </div>

        <div className="flex items-center text-gray-600 mb-2">
          <MapPinIcon className="w-4 h-4 mr-1" />
          <span className="text-sm">
            {property.location.area}, {property.location.city}
          </span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-bold text-ethiopian-green">
            {formatPrice(property.price, property.currency)}
          </div>
          
          {(property.bedrooms || property.bathrooms) && (
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              {property.bedrooms && (
                <span>{property.bedrooms} {t('bedrooms')}</span>
              )}
              {property.bathrooms && (
                <span>{property.bathrooms} {t('bathrooms')}</span>
              )}
            </div>
          )}
        </div>

        <div className="text-sm text-gray-600 mb-3">
          {property.size} m² • {property.features.slice(0, 2).join(', ')}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Link
            href={`/property/${property.id}`}
            className="w-full bg-ethiopian-blue hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg transition-colors text-sm font-medium block"
          >
            View Details
          </Link>
          
          <div className="flex space-x-2">
            <button
              onClick={() => openWhatsApp(property.whatsappNumber, property.title)}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              <span className="text-xs">WhatsApp</span>
            </button>
            
            <button
              onClick={() => makeCall(property.phoneNumber)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1"
            >
              <PhoneIcon className="w-4 h-4" />
              <span className="text-xs">Call</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}