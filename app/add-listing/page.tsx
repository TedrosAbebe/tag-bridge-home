'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '../components/Navigation'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { ETHIOPIAN_CITIES, PROPERTY_TYPES } from '../types'
import { 
  HomeIcon, 
  PhotoIcon, 
  MapPinIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

export default function AddListingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { t, language } = useLanguage()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'ETB',
    city: '',
    area: '',
    type: 'house_sale',
    bedrooms: '',
    bathrooms: '',
    size: '',
    features: [] as string[],
    whatsappNumber: user?.whatsappNumber || '',
    phoneNumber: user?.phone || '',
    images: [] as string[]
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [paymentInfo, setPaymentInfo] = useState<any>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  // Redirect if not authenticated
  if (!user) {
    router.push('/login')
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/properties-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        setPaymentInfo(result.payment)
        setShowPaymentModal(true)
      } else {
        alert(result.error || 'Failed to create listing')
      }
    } catch (error) {
      console.error('Error creating listing:', error)
      alert('Failed to create listing')
    } finally {
      setIsLoading(false)
    }
  }

  const commonFeatures = [
    'Parking', 'Garden', 'Balcony', 'Modern Kitchen', 'Furnished', 
    'Security', 'Elevator', 'Generator', 'Water Tank', 'Internet Ready'
  ]

  const getListingFee = () => {
    return formData.type === 'house_rent' ? 25 : 50
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-2xl mx-auto px-4 py-8 pb-24">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-ethiopian-green rounded-full flex items-center justify-center mx-auto mb-4">
              <HomeIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-2xl font-bold text-gray-900 mb-2 ${
              language === 'am' ? 'amharic' : ''
            }`}>
              {t('add_listing')}
            </h1>
            <p className={`text-gray-600 ${language === 'am' ? 'amharic' : ''}`}>
              {language === 'en' 
                ? 'List your property for sale or rent' 
                : 'ንብረትዎን ለሽያጭ ወይም ለኪራይ ያስዘርዝሩ'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold text-gray-900 ${
                language === 'am' ? 'amharic' : ''
              }`}>
                {language === 'en' ? 'Basic Information' : 'መሰረታዊ መረጃ'}
              </h3>
              
              <div>
                <label className={`block text-sm font-medium text-gray-700 mb-2 ${
                  language === 'am' ? 'amharic' : ''
                }`}>
                  {language === 'en' ? 'Property Title' : 'የንብረት ርዕስ'} *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder={language === 'en' ? 'e.g., Modern 3 Bedroom House in Bole' : 'ምሳሌ፣ በቦሌ ውስጥ ዘመናዊ 3 መኝታ ቤት'}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium text-gray-700 mb-2 ${
                  language === 'am' ? 'amharic' : ''
                }`}>
                  {language === 'en' ? 'Property Type' : 'የንብረት አይነት'} *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  {PROPERTY_TYPES.map(type => (
                    <option key={type} value={type}>
                      {t(type)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${
                    language === 'am' ? 'amharic' : ''
                  }`}>
                    {t('price')} *
                  </label>
                  <div className="relative">
                    <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${
                    language === 'am' ? 'amharic' : ''
                  }`}>
                    {language === 'en' ? 'Currency' : 'ምንዛሪ'}
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="ETB">ETB (Ethiopian Birr)</option>
                    <option value="USD">USD (US Dollar)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold text-gray-900 ${
                language === 'am' ? 'amharic' : ''
              }`}>
                {t('location')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${
                    language === 'am' ? 'amharic' : ''
                  }`}>
                    {language === 'en' ? 'City' : 'ከተማ'} *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="">{language === 'en' ? 'Select City' : 'ከተማ ይምረጡ'}</option>
                    {ETHIOPIAN_CITIES.map(city => (
                      <option key={city} value={city}>
                        {t(city.toLowerCase().replace(' ', '_'))}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${
                    language === 'am' ? 'amharic' : ''
                  }`}>
                    {language === 'en' ? 'Area/Neighborhood' : 'አካባቢ'} *
                  </label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      placeholder={language === 'en' ? 'e.g., Bole, Kazanchis' : 'ምሳሌ፣ ቦሌ፣ ካዛንቺስ'}
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold text-gray-900 ${
                language === 'am' ? 'amharic' : ''
              }`}>
                {t('property_details')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${
                    language === 'am' ? 'amharic' : ''
                  }`}>
                    {t('bedrooms')}
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="input-field"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${
                    language === 'am' ? 'amharic' : ''
                  }`}>
                    {t('bathrooms')}
                  </label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="input-field"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${
                    language === 'am' ? 'amharic' : ''
                  }`}>
                    {language === 'en' ? 'Size (m²)' : 'መጠን (ካሬ ሜትር)'} *
                  </label>
                  <input
                    type="number"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="input-field"
                    required
                    min="1"
                  />
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold text-gray-900 ${
                language === 'am' ? 'amharic' : ''
              }`}>
                {language === 'en' ? 'Features' : 'ባህሪያት'}
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {commonFeatures.map(feature => (
                  <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                      className="rounded border-gray-300 text-ethiopian-green focus:ring-ethiopian-green"
                    />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold text-gray-900 ${
                language === 'am' ? 'amharic' : ''
              }`}>
                {language === 'en' ? 'Contact Information' : 'የመገናኛ መረጃ'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${
                    language === 'am' ? 'amharic' : ''
                  }`}>
                    {t('phone')} *
                  </label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="+251911234567"
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${
                    language === 'am' ? 'amharic' : ''
                  }`}>
                    {language === 'en' ? 'WhatsApp Number' : 'ዋትስአፕ ቁጥር'} *
                  </label>
                  <div className="relative">
                    <ChatBubbleLeftRightIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleInputChange}
                      placeholder="+251911234567"
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${
                language === 'am' ? 'amharic' : ''
              }`}>
                {language === 'en' ? 'Description' : 'መግለጫ'}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder={language === 'en' 
                  ? 'Describe your property in detail...'
                  : 'ንብረትዎን በዝርዝር ይግለጹ...'
                }
                className="input-field"
              />
            </div>

            {/* Listing Fee Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CurrencyDollarIcon className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className={`font-medium text-yellow-800 mb-1 ${
                    language === 'am' ? 'amharic' : ''
                  }`}>
                    {language === 'en' ? 'Listing Fee' : 'የዝርዝር ክፍያ'}
                  </h4>
                  <p className={`text-sm text-yellow-700 ${
                    language === 'am' ? 'amharic' : ''
                  }`}>
                    {language === 'en'
                      ? `A listing fee of ${getListingFee()} ETB is required to publish your property. Payment instructions will be provided after submission.`
                      : `ንብረትዎን ለማተም ${getListingFee()} ብር የዝርዝር ክፍያ ያስፈልጋል። ከማስገባት በኋላ የክፍያ መመሪያዎች ይሰጣሉ።`
                    }
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full btn-primary ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading 
                ? (language === 'en' ? 'Creating Listing...' : 'ዝርዝር በመፍጠር ላይ...')
                : (language === 'en' ? 'Create Listing' : 'ዝርዝር ፍጠር')
              }
            </button>
          </form>
        </div>
      </main>

      {/* Payment Modal */}
      {showPaymentModal && paymentInfo && (
        <PaymentModal 
          paymentInfo={paymentInfo}
          onClose={() => {
            setShowPaymentModal(false)
            router.push('/profile')
          }}
        />
      )}
    </div>
  )
}

function PaymentModal({ paymentInfo, onClose }: { paymentInfo: any, onClose: () => void }) {
  const { language } = useLanguage()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className={`text-lg font-bold text-gray-900 mb-4 ${
          language === 'am' ? 'amharic' : ''
        }`}>
          {language === 'en' ? 'Payment Required' : 'ክፍያ ያስፈልጋል'}
        </h3>
        
        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className={`text-sm text-gray-600 mb-2 ${language === 'am' ? 'amharic' : ''}`}>
              {language === 'en' ? 'Amount to Pay:' : 'የሚከፈል መጠን:'}
            </p>
            <p className="text-2xl font-bold text-ethiopian-green">
              {paymentInfo.amount} ETB
            </p>
          </div>
          
          <div className="space-y-2">
            <p className={`text-sm font-medium text-gray-700 ${language === 'am' ? 'amharic' : ''}`}>
              {language === 'en' ? 'Payment Instructions:' : 'የክፍያ መመሪያዎች:'}
            </p>
            <ol className={`text-sm text-gray-600 space-y-1 list-decimal list-inside ${
              language === 'am' ? 'amharic' : ''
            }`}>
              <li>
                {language === 'en' 
                  ? `Transfer ${paymentInfo.amount} ETB to: ${paymentInfo.bankAccountPlaceholder}`
                  : `${paymentInfo.amount} ብር ወደ: ${paymentInfo.bankAccountPlaceholder} ያስተላልፉ`
                }
              </li>
              <li>
                {language === 'en'
                  ? `Send payment screenshot to WhatsApp: ${paymentInfo.whatsappContactPlaceholder}`
                  : `የክፍያ ስክሪንሾት ወደ ዋትስአፕ ይላኩ: ${paymentInfo.whatsappContactPlaceholder}`
                }
              </li>
              <li>
                {language === 'en'
                  ? `Include Payment ID: ${paymentInfo.id}`
                  : `የክፍያ መታወቂያ ያካትቱ: ${paymentInfo.id}`
                }
              </li>
            </ol>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="w-full btn-primary"
        >
          {language === 'en' ? 'I Understand' : 'ተረድቻለሁ'}
        </button>
      </div>
    </div>
  )
}