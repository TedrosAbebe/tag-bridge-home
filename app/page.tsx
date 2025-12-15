'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from './contexts/LanguageContext'
import PromotionalBanner from './components/PromotionalBanner'

interface Property {
  id: string
  title: string
  description: string
  price: number
  currency: string
  location: {
    city: string
    area: string
  }
  type: string
  bedrooms?: number
  bathrooms?: number
  size: number
  images: string[]
  status: string
  whatsappNumber: string
  phoneNumber: string
  advertiser?: {
    name: string
    business: string
    email: string
    website?: string
  }
  isPremium?: boolean
  isFeatured?: boolean
}

export default function HomePage() {
  const { language, t } = useLanguage()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedListingType, setSelectedListingType] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const ethiopianCities = [
    'Addis Ababa', 'Adama', 'Hawassa', 'Bahir Dar', 'Mekelle', 
    'Gondar', 'Jimma', 'Dire Dawa', 'Dessie', 'Nekemte'
  ]

  const getCityName = (city: string) => {
    const cityTranslations: { [key: string]: { en: string, am: string } } = {
      'Addis Ababa': { en: 'Addis Ababa', am: 'አዲስ አበባ' },
      'Adama': { en: 'Adama', am: 'አዳማ' },
      'Hawassa': { en: 'Hawassa', am: 'ሐዋሳ' },
      'Bahir Dar': { en: 'Bahir Dar', am: 'ባሕር ዳር' },
      'Mekelle': { en: 'Mekelle', am: 'መቐለ' },
      'Gondar': { en: 'Gondar', am: 'ጎንደር' },
      'Jimma': { en: 'Jimma', am: 'ጅማ' },
      'Dire Dawa': { en: 'Dire Dawa', am: 'ድሬ ዳዋ' },
      'Dessie': { en: 'Dessie', am: 'ደሴ' },
      'Nekemte': { en: 'Nekemte', am: 'ነቀምት' }
    }
    return cityTranslations[city]?.[language] || city
  }

  const propertyTypes = [
    'house_sale', 'house_rent', 'apartment_sale', 'apartment_rent',
    'villa_sale', 'villa_rent', 'land', 'shop_sale', 'shop_rent'
  ]

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      // Fetch both regular properties and advertiser properties
      const timestamp = Date.now()
      const [regularResponse, advertiserResponse] = await Promise.all([
        fetch(`/api/properties-working?t=${timestamp}`),
        fetch(`/api/advertiser-properties?t=${timestamp}`)
      ])
      
      let allProperties: Property[] = []
      
      // Add regular properties
      if (regularResponse.ok) {
        const regularData = await regularResponse.json()
        allProperties = [...allProperties, ...(regularData.properties || [])]
      }
      
      // Add advertiser properties (premium listings)
      if (advertiserResponse.ok) {
        const advertiserData = await advertiserResponse.json()
        allProperties = [...allProperties, ...(advertiserData.properties || [])]
      }
      
      // Sort properties: featured first, then premium, then by date
      allProperties.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1
        if (!a.isFeatured && b.isFeatured) return 1
        if (a.isPremium && !b.isPremium) return -1
        if (!a.isPremium && b.isPremium) return 1
        return 0
      })
      
      setProperties(allProperties)
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.city.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCity = !selectedCity || property.location.city === selectedCity
    const matchesType = !selectedType || property.type === selectedType
    const matchesPrice = !maxPrice || property.price <= parseInt(maxPrice)
    
    // Filter by rent or sale
    const matchesListingType = !selectedListingType || 
      (selectedListingType === 'rent' && property.type.includes('rent')) ||
      (selectedListingType === 'sale' && (property.type.includes('sale') || property.type === 'land'))
    
    return matchesSearch && matchesCity && matchesType && matchesListingType && matchesPrice && property.status === 'approved'
  })

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US').format(price) + ' ' + currency
  }

  const formatPropertyType = (type: string) => {
    const typeTranslations: { [key: string]: { en: string, am: string } } = {
      'house_sale': { en: 'House Sale', am: 'የቤት ሽያጭ' },
      'house_rent': { en: 'House Rent', am: 'የቤት ኪራይ' },
      'apartment_sale': { en: 'Apartment Sale', am: 'የአፓርትመንት ሽያጭ' },
      'apartment_rent': { en: 'Apartment Rent', am: 'የአፓርትመንት ኪራይ' },
      'villa_sale': { en: 'Villa Sale', am: 'የቪላ ሽያጭ' },
      'villa_rent': { en: 'Villa Rent', am: 'የቪላ ኪራይ' },
      'land': { en: 'Land', am: 'መሬት' },
      'shop_sale': { en: 'Shop Sale', am: 'የሱቅ ሽያጭ' },
      'shop_rent': { en: 'Shop Rent', am: 'የሱቅ ኪራይ' }
    }
    return typeTranslations[type]?.[language] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const handleWhatsAppContact = (whatsappNumber: string, propertyTitle: string) => {
    const message = language === 'en' 
      ? `Hi, I'm interested in the property: ${propertyTitle}`
      : `ሰላም፣ በዚህ ንብረት ላይ ፍላጎት አለኝ: ${propertyTitle}`
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handlePhoneCall = (phoneNumber: string) => {
    const cleanPhoneNumber = phoneNumber.replace(/[^0-9+]/g, '')
    window.location.href = `tel:${cleanPhoneNumber}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">


      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-6 fade-in">
            {t('find_perfect_home')}
          </h2>
          <p className="text-xl mb-8 fade-in">
            {t('discover_properties')}
          </p>
          
          {/* Search Bar */}
          <div className="max-w-5xl mx-auto bg-white rounded-lg p-6 shadow-xl fade-in">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <input
                type="text"
                placeholder={t('search_properties')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{t('all_cities')}</option>
                {ethiopianCities.map(city => (
                  <option key={city} value={city}>{getCityName(city)}</option>
                ))}
              </select>
              
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{t('all_types')}</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{formatPropertyType(type)}</option>
                ))}
              </select>
              
              <select
                value={selectedListingType}
                onChange={(e) => setSelectedListingType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{language === 'en' ? 'For Rent or Sale' : 'ለኪራይ ወይም ለሽያጭ'}</option>
                <option value="rent">{language === 'en' ? 'For Rent' : 'ለኪራይ'}</option>
                <option value="sale">{language === 'en' ? 'For Sale' : 'ለሽያጭ'}</option>
              </select>
              
              <input
                type="number"
                placeholder={t('max_price_etb')}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <div className="max-w-7xl mx-auto">
        <PromotionalBanner />
      </div>

      {/* Properties Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">{t('featured_properties')}</h3>
            <p className="text-lg text-gray-600">
              {filteredProperties.length} {t('properties_found')}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">{t('loading_properties')}</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏠</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">{t('no_properties_found')}</h4>
              <p className="text-gray-600 mb-6">{t('try_adjusting_search')}</p>
              <Link href="/submit-property" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                {t('list_your_property')}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
                <div key={property.id} className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${
                  property.isFeatured ? 'ring-2 ring-yellow-400' : property.isPremium ? 'ring-2 ring-purple-400' : ''
                }`}>
                  <div className={`h-48 bg-gradient-to-r ${
                    property.isFeatured ? 'from-yellow-400 to-orange-500' :
                    property.isPremium ? 'from-purple-400 to-pink-500' :
                    'from-green-400 to-blue-500'
                  } flex items-center justify-center relative`}>
                    {/* Premium/Featured Badges */}
                    {property.isFeatured && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        ⭐ {t('featured')}
                      </div>
                    )}
                    {property.isPremium && !property.isFeatured && (
                      <div className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        💎 {t('premium')}
                      </div>
                    )}
                    
                    <div className="text-white text-center">
                      <div className="text-4xl mb-2">🏠</div>
                      <p className="text-sm">{t('property_image')}</p>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-xl font-semibold text-gray-900 line-clamp-2">{property.title}</h4>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {formatPropertyType(property.type)}
                      </span>
                    </div>
                    
                    {/* Advertiser Information */}
                    {property.advertiser && (
                      <div className="mb-3 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-purple-400">
                        <p className="text-xs font-semibold text-purple-700">
                          🏢 {property.advertiser.business}
                        </p>
                        <p className="text-xs text-gray-600">
                          {t('professional_advertiser')}
                        </p>
                      </div>
                    )}
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{property.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">📍</span>
                        {property.location.area}, {getCityName(property.location.city)}
                      </div>
                      
                      {property.bedrooms && (
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">🛏️</span>
                          {property.bedrooms} {t('bedrooms')}
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">📐</span>
                        {property.size} m²
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold text-green-600">
                        {formatPrice(property.price, property.currency)}
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <Link 
                          href={`/property/${property.id}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm text-center"
                        >
                          {t('view_details')}
                        </Link>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleWhatsAppContact(property.whatsappNumber, property.title)}
                            className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm flex-1"
                          >
                            {t('whatsapp')}
                          </button>
                          
                          <button
                            onClick={() => handlePhoneCall(property.phoneNumber)}
                            className="bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm flex-1"
                          >
                            {t('call')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">{t('why_choose_us')}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🔍</div>
              <h4 className="text-xl font-semibold mb-3">{t('easy_search')}</h4>
              <p className="text-gray-600">{t('easy_search_desc')}</p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-5xl mb-4">💬</div>
              <h4 className="text-xl font-semibold mb-3">{t('direct_contact')}</h4>
              <p className="text-gray-600">{t('direct_contact_desc')}</p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-5xl mb-4">✅</div>
              <h4 className="text-xl font-semibold mb-3">{t('verified_listings')}</h4>
              <p className="text-gray-600">{t('verified_listings_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-6">{t('ready_find_dream_home')}</h3>
          <p className="text-xl mb-8">{t('join_satisfied_customers')}</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/submit-property" className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              {t('list_your_property')}
            </Link>
            <Link href="/register-broker" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
              {language === 'en' ? 'Register as a Broker' : 'እንደ ደላላ ይመዝገቡ'}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img src="/tagbridge-logo.svg" alt="Tag Bridge Home" className="w-8 h-8" />
                <span className="text-xl font-bold">Tag Bridge Home</span>
              </div>
              <p className="text-gray-400">{t('trusted_partner')}</p>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">{t('quick_links')}</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/login" className="hover:text-white">{t('login')}</Link></li>
                <li><Link href="/submit-property" className="hover:text-white">{t('list_your_property')}</Link></li>
                <li><Link href="/register-broker" className="hover:text-white">{language === 'en' ? 'Register as a Broker' : 'እንደ ደላላ ይመዝገቡ'}</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">{t('property_types')}</h5>
              <ul className="space-y-2 text-gray-400">
                <li>{t('houses_for_sale')}</li>
                <li>{t('apartments_for_rent')}</li>
                <li>{t('commercial_properties')}</li>
                <li>{t('land_for_sale')}</li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">{t('contact')}</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="mailto:tedayeerasu@gmail.com" className="hover:text-white transition-colors">
                    📧 tedayeerasu@gmail.com
                  </a>
                </li>
                <li>
                  <a href="tel:0991856292" className="hover:text-white transition-colors">
                    📱 0991856292
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/0991856292" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    💬 WhatsApp: 0991856292
                  </a>
                </li>
                <li>📍 {getCityName('Addis Ababa')}, {language === 'en' ? 'Ethiopia' : 'ኢትዮጵያ'}</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Tag Bridge Home. {t('all_rights_reserved')}</p>
          </div>
        </div>
      </footer>
      {/* Developer Section - Supabase Test */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-700 mb-4">🧪 Developer Tools</h3>
            <div className="flex justify-center space-x-4">
              <Link 
                href="/todos"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                📝 Test Supabase Connection
              </Link>
              <div className="text-sm text-gray-600 flex items-center">
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  process.env.NEXT_PUBLIC_SUPABASE_URL ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
                Supabase {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Connected' : 'Not Configured'}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}