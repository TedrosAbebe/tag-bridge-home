'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'

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
  created_at: string
  views: number
  inquiries: number
}

interface AdvertiserStats {
  totalProperties: number
  activeProperties: number
  totalViews: number
  totalInquiries: number
  pendingProperties: number
}

export default function AdvertiserDashboard() {
  const { language, t } = useLanguage()
  const { user } = useAuth()
  const [properties, setProperties] = useState<Property[]>([])
  const [stats, setStats] = useState<AdvertiserStats>({
    totalProperties: 0,
    activeProperties: 0,
    totalViews: 0,
    totalInquiries: 0,
    pendingProperties: 0
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (user) {
      fetchAdvertiserData()
    }
  }, [user])

  const fetchAdvertiserData = async () => {
    try {
      const [propertiesResponse, statsResponse] = await Promise.all([
        fetch('/api/advertiser/properties'),
        fetch('/api/advertiser/stats')
      ])

      if (propertiesResponse.ok) {
        const propertiesData = await propertiesResponse.json()
        setProperties(propertiesData.properties || [])
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.stats || stats)
      }
    } catch (error) {
      console.error('Error fetching advertiser data:', error)
    } finally {
      setLoading(false)
    }
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

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US').format(price) + ' ' + currency
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    const statusTranslations: { [key: string]: { en: string, am: string } } = {
      'approved': { en: 'Approved', am: 'ጸድቋል' },
      'pending': { en: 'Pending', am: 'በመጠባበቅ ላይ' },
      'rejected': { en: 'Rejected', am: 'ውድቅ ሆኗል' }
    }
    return statusTranslations[status]?.[language] || status
  }

  if (!user || user.role !== 'advertiser') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {language === 'en' ? 'Access Denied' : 'መዳረሻ ተከልክሏል'}
          </h1>
          <p className="text-gray-600 mb-6">
            {language === 'en' 
              ? 'You need to be logged in as an advertiser to access this page.'
              : 'ይህንን ገጽ ለመድረስ እንደ አስተዋዋቂ መግባት አለብዎት።'
            }
          </p>
          <Link href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            {t('login')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <span className="mr-3">🏢</span>
                {language === 'en' ? 'Advertiser Dashboard' : 'የአስተዋዋቂ ዳሽቦርድ'}
              </h1>
              <p className="text-gray-600 mt-1">
                {language === 'en' ? `Welcome back, ${user.username}!` : `እንኳን ደህና መጡ፣ ${user.username}!`}
              </p>
            </div>
            <Link
              href="/advertiser/add-listing"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold"
            >
              + {language === 'en' ? 'Add Premium Listing' : 'ፕሪሚየም ዝርዝር ጨምር'}
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">🏠</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {language === 'en' ? 'Total Properties' : 'ጠቅላላ ንብረቶች'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {language === 'en' ? 'Active Properties' : 'ንቁ ንብረቶች'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeProperties}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-2xl">👁️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {language === 'en' ? 'Total Views' : 'ጠቅላላ እይታዎች'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <span className="text-2xl">📞</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {language === 'en' ? 'Inquiries' : 'ጥያቄዎች'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalInquiries}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {language === 'en' ? 'Pending' : 'በመጠባበቅ ላይ'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingProperties}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {language === 'en' ? 'Overview' : 'አጠቃላይ እይታ'}
              </button>
              <button
                onClick={() => setActiveTab('properties')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'properties'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {language === 'en' ? 'My Properties' : 'የእኔ ንብረቶች'}
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {language === 'en' ? 'Analytics' : 'ትንታኔ'}
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Properties */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {language === 'en' ? 'Recent Properties' : 'የቅርብ ጊዜ ንብረቶች'}
                    </h3>
                    <div className="space-y-3">
                      {properties.slice(0, 3).map((property) => (
                        <div key={property.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xl">🏠</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{property.title}</h4>
                            <p className="text-sm text-gray-600">{formatPrice(property.price, property.currency)}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                            {getStatusText(property.status)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {language === 'en' ? 'Quick Actions' : 'ፈጣን እርምጃዎች'}
                    </h3>
                    <div className="space-y-3">
                      <Link
                        href="/advertiser/add-listing"
                        className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg hover:from-blue-100 hover:to-purple-100 transition-colors"
                      >
                        <span className="text-2xl">➕</span>
                        <span className="font-medium text-gray-900">
                          {language === 'en' ? 'Add New Property' : 'አዲስ ንብረት ጨምር'}
                        </span>
                      </Link>
                      <Link
                        href="/advertiser/promote"
                        className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg hover:from-green-100 hover:to-blue-100 transition-colors"
                      >
                        <span className="text-2xl">📈</span>
                        <span className="font-medium text-gray-900">
                          {language === 'en' ? 'Promote Properties' : 'ንብረቶችን አስተዋውቅ'}
                        </span>
                      </Link>
                      <Link
                        href="/advertiser/settings"
                        className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:from-purple-100 hover:to-pink-100 transition-colors"
                      >
                        <span className="text-2xl">⚙️</span>
                        <span className="font-medium text-gray-900">
                          {language === 'en' ? 'Account Settings' : 'የመለያ ቅንብሮች'}
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'properties' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {language === 'en' ? 'All Properties' : 'ሁሉም ንብረቶች'}
                  </h3>
                  <Link
                    href="/advertiser/add-listing"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    + {language === 'en' ? 'Add Property' : 'ንብረት ጨምር'}
                  </Link>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">{t('loading')}</p>
                  </div>
                ) : properties.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏠</div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      {language === 'en' ? 'No Properties Yet' : 'ገና ንብረቶች የሉም'}
                    </h4>
                    <p className="text-gray-600 mb-6">
                      {language === 'en' ? 'Start by adding your first property listing.' : 'የመጀመሪያ ንብረት ዝርዝርዎን በመጨመር ይጀምሩ።'}
                    </p>
                    <Link
                      href="/advertiser/add-listing"
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {language === 'en' ? 'Add First Property' : 'የመጀመሪያ ንብረት ጨምር'}
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                      <div key={property.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="text-4xl mb-2">🏠</div>
                            <p className="text-sm">{t('property_image')}</p>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-900 line-clamp-1">{property.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                              {getStatusText(property.status)}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{property.description}</p>
                          
                          <div className="space-y-1 mb-3 text-sm text-gray-600">
                            <div className="flex items-center">
                              <span className="mr-2">📍</span>
                              {property.location.area}, {property.location.city}
                            </div>
                            <div className="flex items-center">
                              <span className="mr-2">🏷️</span>
                              {formatPropertyType(property.type)}
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="font-bold text-blue-600">
                              {formatPrice(property.price, property.currency)}
                            </div>
                            <div className="flex space-x-2 text-xs text-gray-500">
                              <span>👁️ {property.views || 0}</span>
                              <span>📞 {property.inquiries || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {language === 'en' ? 'Performance Analytics' : 'የአፈጻጸም ትንታኔ'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      {language === 'en' ? 'Property Views Trend' : 'የንብረት እይታ አዝማሚያ'}
                    </h4>
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">📊</div>
                      <p className="text-gray-600">
                        {language === 'en' ? 'Analytics coming soon' : 'ትንታኔ በቅርቡ ይመጣል'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      {language === 'en' ? 'Inquiry Statistics' : 'የጥያቄ ስታቲስቲክስ'}
                    </h4>
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">📈</div>
                      <p className="text-gray-600">
                        {language === 'en' ? 'Detailed reports coming soon' : 'ዝርዝር ሪፖርቶች በቅርቡ ይመጣሉ'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}